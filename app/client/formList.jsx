
const React    = require('react'),
      R        = require('ramda'),
      FormItem = require('./formItem'),
      forms    = require('./forms')


module.exports = React.createClass({

  render: function() {
    return (
      <section>
        {R.map(it => <FormItem key={it.id} item={it} />, this.props.items)}
      </section>
    )
  }

})
