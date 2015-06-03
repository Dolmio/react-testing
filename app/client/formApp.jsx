
const React      = require('react'),
      FormList   = require('./formList'),
      forms      = require('./forms')


module.exports = React.createClass({

  addForm : function() {
    forms.createForm()
  },

  render: function() {
    return (
      <div>
        <header id="header">
          <h1>Form</h1>
          <FormList items={this.props.items}/>
          <button onClick={this.addForm}>New Form</button>
        </header>
      </div>
    )
  }

})
