import Editor from './Editor';

import CommentWidget from './widgets/comment/CommentWidget';
import TagWidget from './widgets/tag/TagWidget';

/** Standard widgets included by default **/
const DEFAULT_WIDGETS = {
  COMMENT: CommentWidget,
  TAG: TagWidget
};

Editor.CommentWidget = CommentWidget;
Editor.TagWidget = TagWidget;

export { Editor };
