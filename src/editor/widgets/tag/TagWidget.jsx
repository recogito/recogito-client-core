import React, { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import { CloseIcon } from '../../../Icons';

/** The basic freetext tag control from original Recogito **/
const TagWidget = props => {

  const [ showDelete, setShowDelete ] = useState(false);
  const [ newTag, setNewTag ] = useState('');

  // Every body with a 'tagging' purpose is considered a tag
  const tagBodies = props.annotation ? 
    props.annotation.bodies.filter(b => b.purpose === 'tagging') : [];

  const toggle = tag => _ => {
    if (showDelete === tag) // Removes delete button
      setShowDelete(false);
    else 
      setShowDelete(tag); // Sets delete button on a different tag
  }

  const onDelete = tag => evt => { 
    evt.stopPropagation();
    props.onRemoveBody(tag);
  }

  const onKeyDown = evt => {
    if (evt.which === 13) { // Enter
      props.onAppendBody({ type: 'TextualBody', purpose: 'tagging', value: newTag.trim() });
      setNewTag(''); // Clear the input
    }
  }

  return (
    <div className="tags">
      <ul>
        { tagBodies.map(tag => 
          <li key={tag.value} onClick={toggle(tag.value)}>
            <span className="label">{tag.value}</span>

            {!props.readOnly &&
              <CSSTransition in={showDelete === tag.value} timeout={200} classNames="delete">
                <span className="delete-wrapper" onClick={onDelete(tag)}>
                  <span className="delete">
                    <CloseIcon width={12} />
                  </span>
                </span>
              </CSSTransition>
            }
          </li>
        )}
      </ul>

      { !props.readOnly &&
        <input 
          type="text" 
          value={newTag} 
          onChange={evt => setNewTag(evt.target.value)} 
          onKeyDown={onKeyDown}
          placeholder="Add tag..." />
      }
    </div>
  )

};

export default TagWidget;