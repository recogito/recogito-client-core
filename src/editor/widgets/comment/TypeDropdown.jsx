import React, { Component } from 'preact/compat';
import ContentEditable from 'react-contenteditable';
import i18n from '../../../i18n';

const purposes = ['assessing', 'bookmarking', 'classifying', 'commenting', 'describing', 'editing', 'highlighting', 'identifying', 'linking', 'moderating', 'questioning']

export default class TypeDropdown extends Component {

  // CTRL+Enter functions as Ok
  onKeyDown = evt => {
    if (evt.which === 13 && evt.ctrlKey)
      this.props.onSaveAndClose();
  }

  render() {
    return (
      <div>
        <div>{this.props.content}</div>
      <select name="purpose" id="purpose" disabled={this.props.editable ? false : true }>
        {purposes.map(purpose => (
          <option value={purpose} selected={purpose == this.props.content}>
            {purpose}
          </option>
        ))}
      </select>
      </div>
    )
  }
} 