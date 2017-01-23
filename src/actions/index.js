import { defineTerm } from '../lib/wiktionary'
import { getDefinition, putDefinition } from '../lib/indexed'

export const INVALIDATE_DEFINITION = 'INVALIDATE_DEFINITION';
export const REQUEST_DEFINITION = 'REQUEST_DEFINITION';
export const RECEIVE_DEFINITION = 'RECEIVE_DEFINITION';

export function fetchResult(term) {
  return {
    type: REQUEST_DEFINITION,
    payload: {
      term
    }
  }
}

export function receiveDefinition(term, definitions) {
  return {
    type: RECEIVE_DEFINITION,
    payload: {
      term,
      definitions,
      receivedAt: Date.now()
    }
  }
}

export function fetchDefinition(term) {
  return function(dispatch) {
    dispatch(fetchResult(term))

    let shouldCache = false
    let defs

    return getDefinition(term)
      .then(cached => {
        if (cached) {
          return cached
        }

        console.log('fetching new value for term', term);
        shouldCache = true
        return defineTerm(term)
      })
      .then(result => {
        if (shouldCache) {
          console.log('caching value for term', term, result)
          return putDefinition(term, result).then(() => result)
        }

        return result
      })
      .then(result => {
        console.log('got definition', term, result.parsed)
        dispatch(receiveDefinition(term, result.parsed))
      })
  }
}