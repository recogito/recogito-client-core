import React from 'preact/compat';
import { useState } from 'preact/hooks';
import TimeAgo from 'timeago-react';
import DropdownMenu from './DropdownMenu';
import TextEntryField from './TextEntryField';
import { ChevronDownIcon } from '../../../Icons';
import Environment from '../../../Environment';

/** A single comment inside the CommentWidget **/
const Comment = props => {

  const [ isEditable, setIsEditable ] = useState(false);
  const [ isMenuVisible, setIsMenuVisible ] = useState(false);

  const onMakeEditable = _ => {
    props.body.draft = true;
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

  const creatorInfo = props.body.creator && 
    <div className="lastmodified">
      <span className="lastmodified-by">{props.body.creator.name}</span>
      { props.body.created && 
        <span className="lastmodified-at">
          <TimeAgo datetime={Environment.toClientTime(props.body.created)} />
        </span> 
      }
    </div>

  return props.readOnly ? (
    <div className="r6o-widget comment">
      <div className="value">{props.body.value}</div>
      { creatorInfo }
    </div>
  ) : (
    <div className={ isEditable ? "r6o-widget comment editable" : "r6o-widget comment"}>
      <TextEntryField 
        editable={isEditable}
        content={props.body.value} 
        onChange={onUpdateComment} 
        onSaveAndClose={props.onSaveAndClose} 
      />
      
      { creatorInfo }

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