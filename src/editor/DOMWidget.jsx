import React, { Component } from 'preact/compat';

export default class DOMWidget extends Component {

  constructor(props) {
    super(props);
    this.element = React.createRef();
  }

  componentWillReceiveProps(next) {
    if (this.element.current) {
      if (this.props.annotation !== next.annotation) {
        const widgetEl = this.props.widget({
          annotation: this.props.annotation,
          readOnly: this.props.readOnly,
          onAppendBody: body => this.props.onAppendBody(body),
          onUpdateBody: (previous, updated) => this.props.onUpdateBody(previous, updated),
          onRemoveBody: body => this.props.onRemoveBody(body),
          onSaveAndClose: () => this.props.onSaveAndClose()
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
