import React from 'react';
import CommentWidget from './comment/CommentWidget'
import TagWidget from './tag/TagWidget';
import WrappedWidget from './WrappedWidget';

/** Standard widgets included by default **/
const BUILTIN_WIDGETS = {
  COMMENT: CommentWidget,
  TAG: TagWidget
};

/** Defaults to use if there's no overrides from the host app **/
export const DEFAULT_WIDGETS = [
  <CommentWidget />, <TagWidget />
]

/**
 * There are multiple ways in which users can specify widgets:
 * 
 * 1. string -> name of a built-in widget
 * 2. function -> custom JS plugin
 * 3. React component custom JSX plugin
 * 4. an object in the following form: { widget: (...), args }
 * 
 * In case of 4, the 'widget' property may have the same allowed 
 * values (string, function, React component). The remaining parameters
 * are treated as widget configuration, and are passed along to the
 * widget.
 */
export const getWidget = arg => {

  const instantiate = (widget, config) => {
    if (typeof widget === 'string' || widget instanceof String) {
      return React.createElement(BUILTIN_WIDGETS[widget], config);
    } else if (typeof widget === 'function' || widget instanceof Function) {
      return <WrappedWidget widget={widget} config={config} />
    } else if (React.isValidElement(widget)) {
      return React.createElement(widget, config);
    } else {
      throw `${widget} is not a valid plugin`
    } 
  }

  // First, check 'top-level' vs. 'nested object' case
  if (arg.widget) {
    const { widget, ...config } = arg;
    return instantiate(widget, config);
  } else {
    // No object with args -> instantiate arg directly
    return instantiate(arg);
  }
}