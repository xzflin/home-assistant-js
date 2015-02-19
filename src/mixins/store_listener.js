'use strict';

/**

Put this in your class to have it listen to stores.

When you want to start listening, call this.listenToStores(fireOnListen)
If fireOnListen is true will call all change listeners when they start listening.

When you want to stop listening, call stopListeningToStores()

All functions that you define that follow the format:

  function <storeName>StoreChanged(store);

will be automatically fired on a store change.

*/

var STORES = [
  'auth', 'component', 'event', 'service', 'state', 'stateHistory',
  'stream', 'sync', 'notification'];

// camelCase to under_score method from http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
var JS_FILES = STORES.map(function(input){
  return input.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
});

var getStore = function(index) {
  return require('../stores/' + JS_FILES[index]);
};

export function listenToStores(fireOnListen) {
  var storeListeners = [];

  STORES.forEach(function(storeName, storeIndex) {
    var listenerName = storeName + 'StoreChanged';

    if (this[listenerName]) {
      var store = getStore(storeIndex);
      var listener = this[listenerName].bind(this, store);

      store.addChangeListener(listener);

      storeListeners.push({store: store, listener: listener});

      if (fireOnListen) {
        listener();
      }
    }
  }.bind(this));

  this._storeListeners = storeListeners;
}

export function stopListeningToStores() {
  this._storeListeners.forEach(function({store, listener}) {
    store.removeChangeListener(listener);
  });
}