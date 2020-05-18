import React from 'preact/compat';
import Comment from './Comment';
import TextEntryField from './TextEntryField';
import i18n from '../../../i18n';

/**
 * Comments are TextualBodies where the purpose field is either 
 * blank or 'commenting' or 'replying'
 */
const isComment = body => 
  body.type === 'TextualBody' && (
    !body.hasOwnProperty('purpose') || body.purpose === 'commenting' || body.purpose === 'replying'
  );
  
/**
 * The draft reply is a comment body with a 'draft' flag
 */
const getDraftReply = (existingDraft, isReply) => {
  return existingDraft ? existingDraft : {
    type: 'TextualBody', value: '', purpose: isReply ? 'replying' : 'commenting', draft: true
  };
};

/** 
 * Renders a list of comment bodies, followed by a 'reply' field.
 */
const CommentWidget = props => {

  // All comments (draft + non-draft)
  const all = props.annotation ? 
    props.annotation.bodies.filter(isComment) : [];

  // Last draft comment without a creator field goes into the reply field
  const draftReply = getDraftReply(all.reverse().find(b => b.draft && !b.creator), all.length > 1); 

  // All except draft reply
  const comments = all.filter(b => b != draftReply);

  const onEditReply = evt => {
    const prev = draftReply.value.trim();
    const updated = evt.target.value.trim();

    if (prev.length === 0 && updated.length > 0) {
      props.onAppendBody({ ...draftReply, value: updated });
    } else if (prev.length > 0 && updated.length === 0) {
      props.onRemoveBody(draftReply);
    } else {
      props.onUpdateBody(draftReply, { ...draftReply, value: updated });
    }
  }

  return (
    <>
      { comments.map((body, idx) => 
        <Comment 
          key={idx} 
          readOnly={props.readOnly} 
          body={body} 
          onUpdate={props.onUpdateBody}
          onDelete={props.onRemoveBody}
          onSaveAndClose={props.onSaveAndClose} />
      )}

      { !props.readOnly && props.annotation &&
        <div className="r6o-widget comment editable">
          <TextEntryField
            content={draftReply.value}
            editable={true}
            placeholder={comments.length > 0 ? i18n.t('Add a reply...') : i18n.t('Add a comment...')}
            onChange={onEditReply}
            onSaveAndClose={() => props.onSaveAndClose()}
          /> 
        </div>
      }
    </>
  )

}

export default CommentWidget;