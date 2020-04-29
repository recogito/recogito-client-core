import React, { useState } from 'react';
import DropdownMenu from './DropdownMenu';
import TextEntryField from './TextEntryField';
import { ChevronDownIcon } from '../../../Icons';

/** A single comment inside the CommentWidget **/
const Comment = props => {

  const [ isEditable, setIsEditable ] = useState(false);
  const [ isMenuVisible, setIsMenuVisible ] = useState(false);

  const onMakeEditable = _ => {
    setIsEditable(true);
    setIsMenuVisible(false);
  }

  const onDelete = _ => {
    props.onDelete(props.body);
    setIsMenuVisible(false); 
  }

  const onUpdateComment = evt => {
    props.onUpdate(props.body, { ...props.body, value: evt.target.value });
  }

  return props.readOnly ? (
    <div className="r6o-widget comment">
      {props.body.value}
    </div>
  ) : (
    <div className={ isEditable ? "r6o-widget comment editable" : "r6o-widget comment"}>
      <TextEntryField 
        editable={isEditable}
        content={props.body.value} 
        onChange={onUpdateComment} 
        onSaveAndClose={props.onSaveAndClose} 
      />

      <div 
        className={isMenuVisible ? "icon arrow-down menu-open" : "icon arrow-down"} 
        onClick={() => setIsMenuVisible(!isMenuVisible)}>
        <ChevronDownIcon width={12} />
      </div>

      { isMenuVisible && 
        <DropdownMenu 
          onEdit={onMakeEditable} 
          onDelete={onDelete} 
          onClickOutside={() => setIsMenuVisible(false)} /> 
      }
    </div>
  )

}

export default Comment;