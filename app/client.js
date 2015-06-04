
const React    = require('react'),
      Bacon    = require('baconjs'),
      appState = require('./client/appState'),
      TodoApp  = require('./client/formApp'),
      fetch    = require("whatwg-fetch"),
      lrApi = require('livereactload-api')


window.onload = function() {
  initApp(window.INITIAL_MODEL)
}

function initApp(model) {
  const stateStream = appState({
    initialState: model
  })

  stateStream.onValue((state) => {
    console.log(state)
    lrApi.setState(state)
    React.render(<TodoApp {...state} />, document.getElementById('formapp'))
  })
}

lrApi.onReload(function() {
  initApp(lrApi.getState() || window.INITIAL_MODEL)
})
