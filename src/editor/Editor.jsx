import React, { useState, useRef, useEffect } from 'react';
import setPosition from './setPosition';

const autoApply = props => {
  const applied = props.annotation.clone({ body: [{ ...props.autoApply }]});
  return applied.toAnnotation();
}

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

  // Reference to the DOM element, so we can set position
  const element = useRef();

  // Re-render: set derived annotation state & position the editor
  useEffect(() => {
    // Shorthand: user wants a template applied and this is a selection
    const shouldApplyTemplate = props.applyTemplate && props.annotation?.isSelection

    // Apply template if needed
    const annotation = shouldApplyTemplate ? 
      props.annotation.clone({ body: [ ...props.applyTemplate ]}) : 
      props.annotation;

    if (!currentAnnotation?.isEqual(annotation))
      setCurrentAnnotation(annotation);

    // In headless mode, create immediately
    if (shouldApplyTemplate && props.headless)
      props.onAnnotationCreated(annotation.toAnnotation());

    if (element.current)
      setPosition(props.wrapperEl, element.current, props.bounds);
  }, [ props.bounds ]);

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
    // Removes the 'draft' flag from all bodies
    const undraft = annotation => annotation.clone({
      body : annotation.bodies.map(({ draft, ...rest }) => rest)
    });

    // Current annotation is either a selection (if it was created from 
    // scratch just now) or an annotation (if it existed already and was
    // opened for editing)
    if (currentAnnotation.bodies.length === 0) {
      if (currentAnnotation.isSelection)
        props.onCancel();
      else 
        props.onAnnotationDeleted(props.annotation);
    } else {
      if (currentAnnotation.isSelection)
        props.onAnnotationCreated(undraft(currentAnnotation).toAnnotation());
      else
        props.onAnnotationUpdated(undraft(currentAnnotation), props.annotation);
    }
  };  

  return (
    <div ref={element} className="r6o-editor">
      <div className="arrow" />
      <div className="inner">
        {React.Children.map(props.children, child =>
          React.cloneElement(child, { 
            annotation : currentAnnotation,
            onAppendBody : onAppendBody,
            onUpdateBody : onUpdateBody,
            onRemoveBody : onRemoveBody,
            onSaveAndClose : onOk              
          }))
        }
        
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