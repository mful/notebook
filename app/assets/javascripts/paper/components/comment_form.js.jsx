/** @jsx React.DOM */

var CommentForm = React.createClass({
  submitHandler: function ( e ) {
    e.preventDefault();
    e.stopPropagration();
    this.props.submitHandler( this.refs.content.getDOMNode().value );
  },

  render: function () {
    return(
      <form className="comment-form-component" onSubmit={ this.submitHandler } >
        <div className="row">
          <div className="small-12 column">
            <textarea rows="6" ref="content"></textarea>
          </div>
        </div>

        <div className="row actions">
          <div className="small-12 column">
            <input type="submit" className="button tiny"/>
          </div>
        </div>
      </form>
    );
  }
});
