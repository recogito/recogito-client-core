import React, { Component } from 'react';
import TextareaAutosize from 'react-autosize-textarea';
import i18n from '../../../i18n';

/** 
 * A basic text entry field, for reuse in different widgets.
 */
export default class TextEntryField extends Component {

  // CTRL+Enter functions as Ok
  onKeyDown = evt => {
    if (evt.which === 13 && evt.ctrlKey)
      this.props.onSaveAndClose();
  }

  // Focus on render
  onRender = ref => {
    // Note: we could use this to set automatic focus (but leave this out for now)
  }

  render() {
    return (
      <TextareaAutosize
        ref={this.onRender}
        className="r6o-editable-text" 
        value={this.props.content}
        placeholder={this.props.placeholder || i18n.t('Add a comment...')}
        disabled={!this.props.editable}
        onChange={this.props.onChange}
        onKeyDown={this.onKeyDown} />
    )
  }

} 