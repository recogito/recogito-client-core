import React from 'react';
import CommentWidget from './comment/CommentWidget'
import TagWidget from './tag/TagWidget';
import WrappedWidget from './WrappedWidget';

/** Standard widgets included by default **/
const BUILTIN_WIDGETS = {
  COMMENT: <CommentWidget />,
  TAG: <TagWidget />
};

/** Defaults to use if there's no overrides from the host app **/
export const DEFAULT_WIDGETS = [
  <CommentWidget />, <TagWidget />
]

export const getWidget = arg => {
  if (typeof arg === 'string' || arg instanceof String) {
    return BUILTIN_WIDGETS[arg];
  } else if (typeof arg === 'function' || arg instanceof Function) {
    return <WrappedWidget widget={arg} />
  } else if (React.isValidElement(arg)) {
    return arg;
  } else {
    throw `${arg} is not a valid plugin`
  }
}