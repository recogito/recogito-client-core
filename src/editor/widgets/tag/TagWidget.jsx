import React from 'preact/compat';
import { useState } from 'preact/hooks';
import { CSSTransition } from 'react-transition-group';
import { CloseIcon } from '../../../Icons';
import i18n from '../../../i18n';
import Autocomplete from '../Autocomplete';

/** The basic freetext tag control from original Recogito **/
const TagWidget = props => {

  const [ showDelete, setShowDelete ] = useState(false);

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

  const onSubmit = tag => {
    props.onAppendBody({ type: 'TextualBody', purpose: 'tagging', value: tag.trim() });
  }

  return (
    <div className="r6o-widget tag">
      { tagBodies.length > 0 &&
        <ul className="r6o-taglist">
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
      }

      { !props.readOnly &&
        <Autocomplete 
          placeholder={i18n.t('Add tag...')}
          onSubmit={onSubmit}
          vocabulary={props.vocabulary || []} />
      }
    </div>
  )

};

export default TagWidget;