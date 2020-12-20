import React from 'preact/compat';
import { useState } from 'preact/hooks';
import TimeAgo from 'timeago-react';
import DropdownMenu from './DropdownMenu';
import TextEntryField from './TextEntryField';
import PurposeDropdown from './PurposeDropdown';
import { ChevronDownIcon } from '../../../Icons';
import i18n from '../../../i18n';


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

  const onUpdateDropdown = evt => {
    props.onUpdate(props.body, { ...props.body, purpose: evt.value });
  }

  const creatorInfo = props.body.creator && 
    <div className="r6o-lastmodified">
      <span className="r6o-lastmodified-by">{props.body.creator.name || props.body.creator.id}</span>
      { props.body.created && 
        <span className="r6o-lastmodified-at">
          <TimeAgo 
            datetime={props.env.toClientTime(props.body.created)}
            locale={i18n.locale()} />
        </span> 
      }
    </div>
  
  return props.readOnly ? (
    <div className="r6o-widget comment">
      <div className="r6o-readonly-comment">{props.body.value}</div>
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

      { props.purpose &&
        <PurposeDropdown
            editable={isEditable}
            content={props.body.purpose} 
            onChange={onUpdateDropdown} 
            onSaveAndClose={props.onSaveAndClose}
          /> } 
          
      <div 
        className={isMenuVisible ? "r6o-icon r6o-arrow-down r6o-menu-open" : "r6o-icon r6o-arrow-down"} 
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