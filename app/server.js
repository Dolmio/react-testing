const express     = require('express'),
      bodyParser  = require('body-parser'),
      fs          = require('fs'),
      {resolve}   = require('path'),
      serveStatic = require('serve-static'),
      React       = require('react'),
      appState    = require('./client/appState'),
      R           = require('ramda')


const app   = express(),
      index = fs.readFileSync(resolve(__dirname, '../index.html')).toString()

var items = [{id: 912, name: "testaaja", title: "pelle"}]

app.use(bodyParser())
app.use('/public', serveStatic(resolve(__dirname, '../public')))
app.get('/', (req, res) => {
  appState({initialState: {items}})
    .take(1)
    .onValue((model) => {
      res.set('Content-Type', 'text/html')
      res.send(index
        .replace('{{INITIAL_MODEL}}', JSON.stringify(model)))
    })
})
app.put('/:id', (req, res) => {
  setTimeout(() => {
    const id = Number(req.params.id)
    const newItem = {id: id, name: req.body.name, title: req.body.title}

    if (newItem.name === "fail") {
      res.send(400)
      return
    }

    const item = items.find((it) => it.id === id)
    if (item) {
      function updateItem(itemId, fn) {
        return (it) => it.id === itemId ? fn(it) : it
      }

      items = R.map(updateItem(id, (item) => R.merge(item, newItem)), items)
    } else {
      items.push(newItem)
    }

    console.log(items)
    res.send(200)
  }, 2500)
})

app.listen(3000, () => console.log('Server listening on port 3000'))
