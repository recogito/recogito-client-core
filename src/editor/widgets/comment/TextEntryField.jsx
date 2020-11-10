import React, { Component } from 'preact/compat';
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
    /*
    if (ref && this.props.editable)
      setTimeout(() => ref.focus(), 1);
    */
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