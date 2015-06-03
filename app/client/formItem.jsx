
const React = require('react'),
      forms = require('./forms'),
      fetchSikailu = require('whatwg-fetch')


module.exports = React.createClass({
  getInitialState: function() {
    return this.props.item
  },
  changeName: function(e) {
    this.setState({name: e.target.value})
  },
  changeTitle: function(e) {
    this.setState({title: e.target.value})
  },
  saveForm: function() {
    var component = this
    component.setState({busy: true, error: false})
    fetch('/' + this.props.item.id,
      {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          name: this.state.name,
          title: this.state.title
        })
      }
    ).then((response) => {
      if (response.status != 200) {
        throw "failure"
      }
      component.setState({busy: false})
      forms.updateForm(this.props.item.id, this.state.name, this.state.title)
    }).catch(() => {
      component.setState({busy: false, error: true})
    })
  },
  deleteForm: function() {
    forms.deleteForm(this.props.item.id)
  },
  revertToProps: function() {
    this.setState(this.props.item)
  },
  render: function() {
    const item = this.props.item
    const classes = "formItem" + (this.state.busy ? " busy" : "")
    return (
      <div className={classes}>
        <label><input type="text" onChange={this.changeName} value={this.state.name}/>Name</label>
        <label><input type="text" onChange={this.changeTitle} value={this.state.title}/>Title</label>
        <button onClick={this.revertToProps}>Cancel</button>
        <button onClick={this.saveForm}>Save</button>
        <button onClick={this.deleteForm}>Delete</button>
        {this.state.error ? <p>Error in saving or deleting!</p> : null}
      </div>
    )
  }
})


