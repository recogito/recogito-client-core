import React from 'preact/compat';
import { useRef, useEffect } from 'preact/hooks';

const DOMWidget = props => {

  const element = useRef();

  const { 
    annotation, 
    readOnly, 
    onAppendBody,
    onUpdateBody,
    onRemoveBody,
    onSaveAndClose
  } = props;

  useEffect(() => {
    if (element.current) {

      // Instantiate the widget...
      const widgetEl = props.widget({
        annotation,
        readOnly,
        onAppendBody,
        onUpdateBody,
        onRemoveBody,
        onSaveAndClose
      });

      // ...and append to JSX wrapper
      element.current.appendChild(widgetEl);
    }
  }, []);

  return (
    <div ref={element} class="widget"></div>
  )

}

export default DOMWidget;