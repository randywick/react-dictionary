function parseJson(string) {
  return new Promise((resolve, reject) => {
    try {
      const data = JSON.parse(string);
      resolve(data);
    } catch(err) {
      reject(err);
    }
  })
}


function fetchDefinition(term) {
  return new Promise((resolve, reject) => {
    const query = [
      'action=query',
      'titles=' + term,
      'prop=revisions',
      'rvprop=content',
      'format=json',
      'origin=*',
      'redirects'
    ].join('&')

    var req = new XMLHttpRequest();

    req.addEventListener('load', function() {
      if (this.status !== 200) {
        return reject(this.status);
      }

      resolve(this.responseText)
    })

    console.log('https://en.wiktionary.org/w/api.php?' + query)

    req.open('GET', 'https://en.wiktionary.org/w/api.php?' + query, true);
    req.setRequestHeader('Api-User-Agent', 'DefinitionFetcher/0.0.1 TEST');
    req.send();
  })
}


function parseResponse(response) {
  // REMEMBER TO CHECK FOR REDIRECTS AND INDICATE

  if (!response) {
    throw new NoResponseError()
  }

  if (!response.query) {
    throw new InvalidResponseError('No `query` object attached to response');
  }

  if (!response.query.pages) {
    throw new InvalidResponseError('No `pages` object attached to response query');
  }

  const pages = response.query.pages;

  if (pages['-1']) {
    console.log('No result');
    return null;
  }

  const pageIds = Object.keys(response.query.pages);

  if (pageIds.length > 1) {
    throw new InvalidResponseError('More pages than expected', pageIds);
  }

  const page = pages[pageIds[0]];
  const revision = page.revisions[0];
  
  const wikiText = revision['*'];

  return wikiText
}

function getRawPart(wikiText, part) {
  const regex = new RegExp('(?:{{en-' + part + '.*}}\\n\\n)[\\s\\S]+?(?=\\n\\n)');
  const match = wikiText.match(regex);

  if (!match) {
    return null;
  }

  return match[0]
    .split('\n')
    .splice(2)
    .join('\n')
}

function toArray(wikiText) {
  return wikiText.split('\n')
    .reduce((result, line, index) => {
      if (line.startsWith('# ')) {
        return result.concat(line);
      }

      if (line.startsWith('#*')) {
        result.push([line]);
        return result;
      }

      if (!Array.isArray(result.length && result[result.length - 1])) {
        // console.log('SKIPPING UNEXPECTED LINE', {line, index})
        return result;
      }

      result[result.length - 1].push(line);
      return result;
    }, [])
}

function stripUsage(defs) {
  return defs.filter(line => !Array.isArray(line))
}

function bold(str) {
  return str
  // return '**' + str + '**'
}

function italic(str) {
  return str
  // return '*' + str + '*'
}

function dropReferences(str) {
  return str.replace(/[\[]{2}[^\[\]]+[\]]{2}/g, ref => {
    let result = ref.replace(/[\[\]]/g, '');
    result = result.split('|')[result.split('|').length - 1];
    return bold(result);
  })
}

function dropLineMarker(str) {
  return str.substr(2);
}

function formatSpecialty(str) {
  return str.replace(/[\{]{2}[^\[\]]+[\}]{2}/g, ref => {
    const specialty = ref
      .replace(/([\{]{2}|[\}]{2})/g, '')
      .split('|')
      .filter(ref => ref !== 'lb' && ref !== 'en')
      .join(', ');

    return `(${italic(specialty)})`
  })
}


function getPart(wikiText, part) {
  let values = getRawPart(wikiText, part)

  if (values == null) {
    return {
      part, values
    }
  }

  values = toArray(values)
  values = stripUsage(values)
  values = values.map(dropLineMarker)
  values = values.map(dropReferences)
  values = values.map(formatSpecialty)
  
  values = values.map((value, index) => {
    return {
      key: index,
      value
    }
  })

  return {
    part, values
  }
}

const partsOfSpeech = ['noun', 'verb', 'adjective', 'adverb']


export function defineTerm(term) {
  let raw;

  return fetchDefinition(term)
    .then(body => parseJson(body))
    .then(data => parseResponse(data))
    .then(data => {
      raw = data;
      if (data == null) {
        return []
      }

      // console.log(raw)

      return Promise.all(partsOfSpeech.map(part => getPart(raw, part)));
    })
    .then(parts => {
      const parsed = parts.filter(part => part.values != null)
      return { raw, parsed }
    })
}