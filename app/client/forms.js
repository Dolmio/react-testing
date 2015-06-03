
const Bacon       = require('baconjs'),
  R           = require('ramda'),
  Dispatcher  = require('./dispatcher')


const d = new Dispatcher()

module.exports = {
  toItemsProperty: function(initialItems, filterS) {
    const itemsS = Bacon.update(initialItems,
      [d.stream('remove')],           deleteForm,
      [d.stream('create')],           createForm,
      [d.stream('addState')],         addItemState,
      [d.stream('removeState')],      removeItemState,
      [d.stream('removeCompleted')],  removeCompleteItems,
      [d.stream('updateForm')],       updateForm
    )

    return Bacon.combineAsArray([itemsS, filterS]).map(withDisplayStatus)


    function createForm(items) {
      return items.concat([{id: Date.now(), name: "", title: ""}])
    }

    function deleteForm(items, itemIdToRemove) {
      return R.reject(it => it.id === itemIdToRemove, items)
    }

    function removeCompleteItems(items) {
      return R.reject(isItemCompleted, items)
    }

    function addItemState(items, {itemId, state}) {
      return R.map(updateItem(itemId, it => R.merge(it, {states: R.union(it.states, [state])})), items)
    }

    function removeItemState(items, {itemId, state}) {
      return R.map(updateItem(itemId, it => R.merge(it, {states: R.reject(R.eq(state), it.states)})), items)
    }

    function updateForm(items, {itemId, name, title}) {
      return R.map(updateItem(itemId, it => R.merge(it, {name, title})), items)
    }

    function withDisplayStatus([items, filter]) {
      function setDisplay(it) {
        const display = filter === 'completed' ? isItemCompleted(it) : filter === 'active' ? !isItemCompleted(it) : true
        return R.merge(it, {display})
      }
      return R.map(setDisplay, items)
    }
  },

  // "public" methods

  isCompleted: isItemCompleted,

  isEdited: isItemEdited,

  createForm: function() {
    d.push('create')
  },

  deleteForm: function(itemId) {
    d.push('remove', itemId)
  },

  removeCompleted: function() {
    d.push('removeCompleted')
  },

  updateForm: function(itemId, name, title) {
    d.push('updateForm', {itemId, name, title})
  },

  setCompleted: function(itemId, completed) {
    d.push(completed ? 'addState' : 'removeState', {itemId, state: 'completed'})
  },

  setAllCompleted: function(completed) {
    d.push(completed ? 'addState' : 'removeState', {itemId: 'all', state: 'completed'})
  },

  setEditing: function(itemId, editing) {
    d.push(editing ? 'addState' : 'removeState', {itemId, state: 'editing'})
  }

}


function isItemCompleted(item) {
  return R.contains('completed', item.states)
}

function isItemEdited(item) {
  return R.contains('editing', item.states)
}

function updateItem(itemId, fn) {
  return (it) => it.id === itemId ? fn(it) : it
}

