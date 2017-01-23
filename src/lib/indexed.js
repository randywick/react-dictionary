const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

const open = indexedDB.open('DefinitionDB', 1)

let db

open.onupgradeneeded = function() {
  db = open.result
  db.createObjectStore('DefinitionStore', {keyPath: 'term'})
}

open.onsuccess = function() {
  db = open.result
}

function createStore(type = 'readwrite') {
  const tx = db.transaction('DefinitionStore', type)
  return tx.objectStore('DefinitionStore')
}

export function getDefinition(term) {
  return new Promise((resolve, reject) => {
    const store = createStore('readonly')
    const request = store.get(term)
    
    request.onsuccess = () => resolve(request.result? request.result.value : null)
    request.onerror = err => reject(err)
  })
}

export function putDefinition(term, value) {
  return new Promise((resolve, reject) => {
    const store = createStore('readwrite')
    const request = store.put({ term, value })
    
    request.onsuccess = () => resolve()
    request.onerror = err => reject(err)
  }) 
}