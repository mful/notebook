/** @jsx React.DOM */

var Modal = React.createClass({

  maybeDismiss: function ( e ) {
    if ( e.target.id && e.target.id === 'scribble-modal' ) {
      ModalActions.dismiss();
    }
  },

  render: function () {
    return(
      <div id="scribble-modal" onClick={ this.maybeDismiss }>
        <div id="scribble-modal-content">
          { this.props.component }
        </div>
      </div>
    );
  }
});
