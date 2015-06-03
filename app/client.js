
const React    = require('react'),
      Bacon    = require('baconjs'),
      appState = require('./client/appState'),
      TodoApp  = require('./client/formApp'),
      fetch    = require("whatwg-fetch")


const stateStream = appState({
  initialState: window.INITIAL_MODEL
})

stateStream.onValue((state) => {
  console.log(state)
  React.render(<TodoApp {...state} />, document.getElementById('formapp'))
})
