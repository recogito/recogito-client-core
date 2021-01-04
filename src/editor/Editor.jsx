import React from 'preact/compat';
import { useState, useRef, useEffect } from 'preact/hooks';
import { getWidget, DEFAULT_WIDGETS } from './widgets';
import setPosition from './setPosition';
import i18n from '../i18n';

/** We need to compare bounds by value, not by object ref **/
const bounds = elem => {
  const { top, left, width, height } = elem.getBoundingClientRect();
  return `${top}, ${left}, ${width}, ${height}`;
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

  // Set derived annotation state
  useEffect(() => 
    setCurrentAnnotation(props.annotation), [ props.annotation ]);

  // Change editor position if element has moved
  useEffect(() => {
    if (element.current) {
      // Note that ResizeObserver fires once when observation starts
      return initResizeObserver();
    }
  }, [ bounds(props.selectedElement) ]);

  const initResizeObserver = () => {
    if (window?.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        setPosition(props.wrapperEl, element.current, props.selectedElement);
      });

      resizeObserver.observe(props.wrapperEl);
      return () => resizeObserver.disconnect();
    } else {
      // Fire setPosition *only* for devices that don't support ResizeObserver
      setPosition(props.wrapperEl, element.current, props.selectedElement);
    }  
  }

  // Creator and created/modified timestamp metadata
  const creationMeta = body => {
    const meta = {};

    const { user } = props.env;

    // Metadata is only added when a user is set, otherwise
    // the Editor operates in 'anonymous mode'.
    if (user) {
      meta.creator = {};
      if (user.id) meta.creator.id = user.id;
      if (user.displayName) meta.creator.name = user.displayName;

      meta[body.created ? 'modified' : 'created'] = props.env.getCurrentTimeAdjusted();
    }

    return meta;
  }

  const onAppendBody = body => setCurrentAnnotation(
    currentAnnotation.clone({ 
      body: [ ...currentAnnotation.bodies, { ...body, ...creationMeta(body) } ] 
    })
  );

  const onUpdateBody = (previous, updated) => setCurrentAnnotation(
    currentAnnotation.clone({
      body: currentAnnotation.bodies.map(body => 
        body === previous ? { ...updated, ...creationMeta(updated) } : body)
    })
  );

  const onRemoveBody = body => setCurrentAnnotation(
    currentAnnotation.clone({
      body: currentAnnotation.bodies.filter(b => b !== body)
    })
  );

  const onCancel = () => 
    props.onCancel(currentAnnotation);

  const onOk = _ => {
    // Removes the state payload from all bodies
    const undraft = annotation => 
      annotation.clone({
        body : annotation.bodies.map(({ draft, ...rest }) => rest)
      });

    // Current annotation is either a selection (if it was created from 
    // scratch just now) or an annotation (if it existed already and was
    // opened for editing)
    if (currentAnnotation.bodies.length === 0) {
      if (currentAnnotation.isSelection)
        onCancel();
      else 
        props.onAnnotationDeleted(props.annotation);
    } else {
      if (currentAnnotation.isSelection)
        props.onAnnotationCreated(undraft(currentAnnotation).toAnnotation());
      else
        props.onAnnotationUpdated(undraft(currentAnnotation), props.annotation);
    }
  };

  // Use default comment + tag widget unless host app overrides
  const widgets = props.config.widgets ? 
    props.config.widgets.map(getWidget) : DEFAULT_WIDGETS;
  return (
    <div ref={element} className="r6o-editor">
      <div className="r6o-arrow" />
      <div className="r6o-editor-inner">
        {widgets.map(widget => 
          React.cloneElement(widget, { 
            annotation : currentAnnotation,
            readOnly : props.readOnly,
            env: props.env,
            onAppendBody,
            onUpdateBody,
            onRemoveBody,
            onSaveAndClose: onOk              
          })
        )}
        
        { props.readOnly ? (
          <div className="r6o-footer">
            <button
              className="r6o-btn" 
              onClick={onCancel}>{i18n.t('Close')}</button>
          </div>
        ) : (
          <div className="r6o-footer">
            <button 
              className="r6o-btn outline"
              onClick={onCancel}>{i18n.t('Cancel')}</button>

            <button 
              className="r6o-btn "
              onClick={onOk}>{i18n.t('Ok')}</button>
          </div>
        )}
      </div>
    </div>
  )

}

export default Editor;
