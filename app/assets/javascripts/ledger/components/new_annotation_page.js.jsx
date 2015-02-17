/** @jsx React.DOM */

var NewAnnotationPage = React.createClass({

  componentDidMount: function () {
    AnalyticsActions.trackStartAnnotation(
      this.props.url,
      this.props.text.length
    );
  },

  header: function () {
    return this.refs.header.getDOMNode();
  },

  submitHandler: function ( content ) {
    AnnotationActions.createWithComment({
      annotation: {text: this.props.text},
      url: this.props.url,
      comment: {content: content}
    });
  },

  render: function () {
    return(
      <div className="annotation-page-component">
        <h1 ref="header">
          <img src={ this.props.logo } />
        </h1>

        <FormVisibilityWrapper submitHandler={ this.submitHandler }
                               headerGetter={ this.header }
                               visibility={ 'expanded' } />
      </div>
    );
  }
});
