/** @jsx React.DOM */

var VotingBooth = React.createClass({

  getInitialState: function () {
    return { score: this.props.score }
  },

  componentWillReceiveProps: function ( props ) {
    return this.setState({ score: props.score });
  },

  render: function () {
    return(
      <div className="voting-booth-component">
        <div className="row">
          <div className="small-12 column">
            <div className="vote up-vote"></div>
          </div>
        </div>

        <div className="row">
          <div className="small-12 column">
            <p className="vote-count">
              { this.state.score }
            </p>
          </div>
        </div>

        <div className="row">
          <div className="small-12 column">
            <div className="vote down-vote"></div>
          </div>
        </div>
      </div>
    );
  }
});
