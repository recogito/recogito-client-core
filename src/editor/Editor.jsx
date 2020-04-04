import React, { useState, useRef, useEffect } from 'react';
import setPosition from './setPosition';
import TagWidget  from './widgets/tag/TagWidget';
import TypeSelectorWidget from './widgets/type/TypeSelectorWidget';
import CommentWidget from './widgets/comment/CommentWidget';

/**
 * The popup editor component.
 * 
 * TODO instead of just updating the current annotation state,
 * we could create a stack of revisions, and allow going back
 * with CTRL+Z.
 */
const Editor = props => {
  
  // The current state of the edited annotation vs. original
  const [ currentAnnotation, setCurrentAnnotation ] = useState();
  const [ currentReply, setCurrentReply ] = useState('');

  // Reference to the DOM element, so we can set position
  const element = useRef();

  // Re-render: set derived annotation state & position the editor
  useEffect(() => {
    setCurrentAnnotation(props.annotation);
    setCurrentReply('');

    if (element.current)
      setPosition(props.containerEl, element.current, props.bounds);
  }, [ props.annotation ]);

  const onAppendBody = body => setCurrentAnnotation(
    currentAnnotation.clone({ 
      body: [ ...currentAnnotation.bodies, body ] 
    })
  );

  const onUpdateBody = (previous, updated) => setCurrentAnnotation(
    currentAnnotation.clone({
      body: currentAnnotation.bodies.map(body => body === previous ? updated : body)
    })
  );

  const onRemoveBody = body => setCurrentAnnotation(
    currentAnnotation.clone({
      body: currentAnnotation.bodies.filter(b => b !== body)
    })
  );

  const onOk = _ => {
    // If there is a non-empty reply, append it as a comment body
    const updated = currentReply.trim() ?
      currentAnnotation.clone({
        body: [ ...currentAnnotation.bodies, { type: 'TextualBody', value: currentReply.trim() } ] 
      }) : currentAnnotation;

    // Current annotation is either a selection (if it was created from 
    // scratch just now) or an annotation (if it existed already and was
    // opened for editing)
    if (updated.bodies.length === 0) {
      if (updated.isSelection)
        props.onCancel();
      else 
        props.onAnnotationDeleted(props.annotation);
    } else {
      if (updated.isSelection)
        props.onAnnotationCreated(updated.toAnnotation());
      else
        props.onAnnotationUpdated(updated, props.annotation);
    }
  };

  return (
    <div ref={element} className="r6o-editor">
      <div className="arrow" />
      <div className="inner">
        <CommentWidget 
          annotation={currentAnnotation}
          currentReply={currentReply}
          onUpdateComment={onUpdateBody}
          onDeleteComment={onRemoveBody}
          onUpdateReply={evt => setCurrentReply(evt.target.value.trim())}
          onOk={onOk} />

        <TagWidget 
          annotation={currentAnnotation} 
          onAddTag={onAppendBody}
          onRemoveTag={onRemoveBody} />
        
        { props.readOnly ? (
          <div className="footer">
            <button
              className="r6o-btn" 
              onClick={props.onCancel}>Close</button>
          </div>
        ) : (
          <div className="footer">
            <button 
              className="r6o-btn outline"
              onClick={props.onCancel}>Cancel</button>

            <button 
              className="r6o-btn "
              onClick={onOk}>Ok</button>
          </div>
        )}
      </div>
    </div>
  )

}

export default Editor;