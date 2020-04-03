import React, { Component } from 'react';
import ContentEditable from 'react-contenteditable';

/**
 * Shorthand to get the label (= first tag body value) from the
 * annotation of a relation.
 */
const getContent = relation => {
  const firstTag = relation.annotation.bodies.find(b => b.purpose === 'tagging');
  return firstTag ? firstTag.value : '';
}

/** 
 * A React component for the relationship editor popup. Note that this
 * component is NOT wired into the RelationsLayer directly, but needs
 * to be used separately by the implementing application. We
 * still keep it in the /recogito-relations folder though, so that
 * all code that belongs together stays together.
 * 
 * Note that react-contenteditable seems to have compatibility 
 * issues with React hooks, therefore this component is implemented 
 * as a class.
 */
export default class RelationEditor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      content: getContent(props.relation)
    }

    this.element = React.createRef();
  }

  componentDidMount() {
    this.setPosition();
  }

  componentDidUpdate() {
    this.setPosition();
  }

  componentWillReceiveProps(next) {
    if (this.props.relation !== next.relation)
      this.setState({ content : getContent(next.relation) });
  }

  setPosition() {
    if (this.element.current) {
      const el = this.element.current;
      const { midX, midY } = this.props.relation;

      el.style.top = `${midY}px`;
      el.style.left = `${midX}px`;

      setTimeout(() => el.querySelector('.input').focus(), 0);
    }
  }

  onChange = evt =>
    this.setState({ content: evt.target.value });

  onKeyDown = evt => {
    if (evt.which === 13) { // Enter = Submit
      evt.preventDefault();
      this.onSubmit();
    } else if (evt.which === 27) {
      this.props.onCancel();
    }
  }
  
  onSubmit = () => {
    const updatedAnnotation = this.props.relation.annotation.clone({
      body: [{
        type: 'TextualBody',
        value: this.state.content,
        purpose: 'tagging'
      }]
    });

    const updatedRelation = { ...this.props.relation, annotation: updatedAnnotation };

    // Return updated/before
    this.props.onRelationUpdated(updatedRelation, this.props.relation);
  }

  onDelete = () =>
    this.props.onRelationDeleted(this.props.relation);

  render() {
    return(
      <div className="r6o-relation-editor" ref={this.element}>
        <ContentEditable
          className="input"
          html={this.state.content}
          data-placeholder="Tag..."
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />

        <div className="buttons">
          <span 
            className="icon delete"
            onClick={this.onDelete}>{'\uf014'}</span>

          <span
            className="icon ok"
            onClick={this.onSubmit}>{'\uf00c'}</span>
        </div>
      </div>
    )
  }

}