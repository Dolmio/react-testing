
const Bacon       = require('baconjs'),
  R           = require('ramda'),
  Dispatcher  = require('./dispatcher')


const d = new Dispatcher()

module.exports = {
  toItemsProperty: function(initialItems) {
    const itemsS = Bacon.update(initialItems,
      [d.stream('remove')],           deleteForm,
      [d.stream('create')],           createForm,
      [d.stream('updateForm')],       updateForm
    )

    return itemsS.toProperty()


    function createForm(items) {
      return items.concat([{id: Date.now(), name: "", title: "", isBrowserOnly: true, isEditing: true}])
    }

    function deleteForm(items, itemIdToRemove) {
      return R.reject(it => it.id === itemIdToRemove, items)
    }

    function updateForm(items, newItem) {
      return R.map(updateItem(newItem.id, it => R.merge(it, newItem)), items)
    }
  },

  // "public" methods

  createForm: function() {
    d.push('create')
  },

  deleteForm: function(item) {
    if (item.isBrowserOnly) {
      d.push('remove', item.id)
    } else {
      d.push('updateForm', {id: item.id, error: false, deleteInProgress: true})
      fetch('/' + item.id,
        {
          method: 'delete'
        }
      ).then((response) => {
        if (response.status != 200) {
          throw "failure"
        }
        d.push('remove', item.id)
      }).catch(() => {
        d.push('updateForm', {id: item.id, error: true, deleteInProgress: false})
      })
    }
  },

  updateForm: function(id, name, title) {
    d.push('updateForm', {id, name, title, busy: true, error: false})
    fetch('/' + id,
      {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: name,
          title: title
        })
      }
    ).then((response) => {
      if (response.status != 200) {
        throw "failure"
      }
      d.push('updateForm', {id, busy: false, error: false, isBrowserOnly: false, isEditing: false})
    }).catch(() => {
      d.push('updateForm', {id, busy: false, error: true})
    })
  },

  startEditing: function(id) {
    d.push('updateForm', {id, isEditing: true})
  },
  cancelEditing: function(id) {
    d.push('updateForm', {id, isEditing: false})
  }
}

function updateItem(itemId, fn) {
  return (it) => it.id === itemId ? fn(it) : it
}

