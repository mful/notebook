/** @jsx React.DOM */

var Intro = React.createClass({

  getInitialState: function () {
    return {firstRender: true};
  },

  componentDidMount: function () {
    var _this = this;

    setTimeout(
      function () {
        _this.setState({ firstRender: false });
      }
    ,
      0
    )
  },

  visClass: function () {
    return this.state.firstRender ? ' hide-me' : '';
  },

  triggerLogin: function () {
    SessionActions.requestLogin()
  },

  render: function () {
    return (
      <div className="intro-component">
        <h4>Welcome to Scribble</h4>

        <button ref="signup" className={ "large button" + this.visClass() } onClick={ this.triggerLogin }>
          Sign In
        </button>

        <p className={ this.visClass() }>
          <strong>To annotate a page</strong>, highlight some text, and click the
          &nbsp;<img src={ this.props.pencil_image_path } height="18" width="18" /> in the bottom right corner of your screen.
        </p>

        <p className={ this.visClass() }>
          <strong>To read others' annotations</strong>, click on the purple highlighted text, you see around the web.
        </p>
      </div>
    );
  }
});
