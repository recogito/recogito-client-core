import React, { Component } from 'preact/compat';

export default class WrappedWidget extends Component {

  constructor(props) {
    super(props);

    this.element = React.createRef();
  }

  componentWillReceiveProps(next) {
    if (this.element.current) {
      if (this.props.annotation !== next.annotation) {
        
        const widgetEl = this.props.widget({
          annotation: next.annotation,
          readOnly: next.readOnly,
          ...this.props.config,
          onAppendBody: body => next.onAppendBody(body),
          onUpdateBody: (previous, updated) => next.onUpdateBody(previous, updated),
          onRemoveBody: body => next.onRemoveBody(body),
          onSaveAndClose: () => next.onSaveAndClose()
        });

        // Delete previous rendered state
        while (this.element.current.firstChild)
          this.element.current.removeChild(this.element.current.lastChild);
  
        this.element.current.appendChild(widgetEl);  
      }
    }
  }

  render() {
    return (
      <div ref={this.element} className="widget"></div>
    )
  }

}
