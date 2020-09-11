import React, { Component } from 'preact/compat';

export default class DOMWidget extends Component {

  constructor(props) {
    super(props);
    this.element = React.createRef();
  }

  componentDidMount() {
    if (this.element.current) {
      const widgetEl = this.props.widget({
        annotation: this.props.annotation,
        readOnly: this.props.readOnly,
        onAppendBody: body => this.props.onAppendBody(body),
        onUpdateBody: (previous, updated) => this.props.onUpdateBody(previous, updated),
        onRemoveBody: body => this.props.onRemoveBody(body),
        onSaveAndClose: () => this.props.onSaveAndClose()
      });

      this.element.current.appendChild(widgetEl);
    }
  }

  render() {
    return (
      <div ref={this.element} className="widget"></div>
    )
  }

}
