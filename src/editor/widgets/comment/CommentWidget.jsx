import React from 'react';
import Comment from './Comment';
import TextEntryField from './TextEntryField';

/** 
 * Renders a list of comment bodies, followed by a 'reply' field.
 */
const CommentWidget = props => {

  const commentBodies = props.annotation ? 
    props.annotation.bodies.filter(b => // No purpose or 'commenting', 'replying'
      !b.hasOwnProperty('purpose') || b.purpose === 'commenting' || b.purpose === 'replying'
    ) : [];

  return (
    <>
      { commentBodies.map((body, idx) => 
        <Comment 
          key={idx} 
          readOnly={props.readOnly} 
          body={body} 
          onUpdate={props.onUpdateComment}
          onDelete={props.onDeleteComment}
          onOk={props.onOk} />
      )}

      { !props.readOnly && props.annotation &&
        <div className="r6o-section comment editable">
          <TextEntryField
            content={props.currentReply}
            editable={true}
            placeholder={commentBodies.length > 0 ? 'Add a reply...' : 'Add a comment...'}
            onChange={props.onUpdateReply}
            onOk={() => props.onOk()}
          /> 
        </div>
      }
    </>
  )

}

export default CommentWidget;