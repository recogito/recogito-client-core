import React, { useState } from 'react';
import DropdownMenu from './DropdownMenu';
import TextEntryField from './TextEntryField';

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
    <div className="r6o-section comment">
      {props.body.value}
    </div>
  ) : (
    <div className={ isEditable ? "r6o-section comment editable" : "r6o-section comment"}>
      <TextEntryField 
        editable={isEditable}
        content={props.body.value} 
        onChange={onUpdateComment} 
        onOk={props.onOk} 
      />

      <div 
        className={isMenuVisible ? "icon arrow-down menu-open" : "icon arrow-down"} 
        onClick={() => setIsMenuVisible(!isMenuVisible)} />

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