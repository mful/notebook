/** @jsx React.DOM */

var HighlightText = React.createClass({

  render: function () {
    return (
      <div className="highlight-text row">
        <blockquote className="small-12 column">
          { this.props.highlight.text }
          <cite>{ this.props.highlight.base_domain }</cite>
        </blockquote>
      </div>
    );
  } 
});
