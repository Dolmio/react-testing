
const React = require('react'),
      forms = require('./forms')

module.exports = React.createClass({
  getInitialState: function() {
    return this.props.item
  },
  stateFieldSetter: function(fieldName) {
    var component = this
    return function (event) {
      var newState = {}
      newState[fieldName] = event.target.value
      component.setState(newState)
    }
  },
  saveForm: function() {
    forms.updateForm(this.props.item.id, this.state.name, this.state.title)
  },
  deleteForm: function() {
    forms.deleteForm(this.props.item)
  },
  startEditing: function() {
    forms.startEditing(this.props.item.id)
    this.setState(this.props.item)
  },
  cancelEditing: function() {
    forms.cancelEditing(this.props.item.id)
  },
  render: function() {
    const item = this.props.item
    const classes = "formItem" + (this.props.item.busy ? " busy" : "")
    return (this.props.item.deleteInProgress ? null :
      <div className={classes}>
        {!this.props.item.isEditing ?
          (
            <div>
              <span>Name: {item.name}</span><br/>
              <span>Title: {item.title}</span><br/>
              <button onClick={this.startEditing}>Edit</button>
            </div>
          ) :
          (
            <div>
              <label>Name: <input type="text" onChange={this.stateFieldSetter('name')} value={this.state.name}/></label><br/>
              <label>Title: <input type="text" onChange={this.stateFieldSetter('title')} value={this.state.title}/></label><br/>
              {item.isBrowserOnly ? null : <button onClick={this.cancelEditing}>Cancel</button>}
              <button onClick={this.saveForm}>Save</button>
              <button onClick={this.deleteForm}>Delete</button>
              {this.props.item.error ? <p>Error in saving or deleting!</p> : null}
            </div>
          )
        }
      </div>
    )
  }
})


