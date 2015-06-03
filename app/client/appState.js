
const React   = require('react'),
      Bacon   = require('baconjs'),
      forms  = require('./forms')

module.exports = function({initialState}) {
  const itemsP   = forms.toItemsProperty(initialState.items)

  return Bacon.combineTemplate({
    items: itemsP
  })
}
