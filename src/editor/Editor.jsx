import React, { Component } from 'react';
import Draggable from 'react-draggable';
import { getWidget, DEFAULT_WIDGETS } from './widgets';
import { TrashIcon } from '../Icons';
import setPosition from './setPosition';
import i18n from '../i18n';

/** Shorthand **/
const toArray = body =>
  Array.isArray(body) ? body : [ body ];


/**
 * The popup editor component.
 * 
 * TODO instead of just updating the current annotation state,
 * we could create a stack of revisions, and allow going back
 * with CTRL+Z.
 */
export default class Editor extends Component {

  constructor(props) {
    super(props);

    // Reference to the DOM element, so we can set position
    this.element = React.createRef();

    this.state = {
      currentAnnotation: props.annotation,
      dragged: false
    }
  }

  componentWillReceiveProps(next) {
    this.setState({ currentAnnotation: next.annotation });

    if (this.props.modifiedTarget != next.modifiedTarget) {
      // Update in case target was changed (move, resize)
      if (this.state.currentAnnotation) {
        this.updateCurrentAnnotation({ target: this.props.modifiedTarget });

        // Change editor position if element has moved
        this.removeObserver && this.removeObserver();
        this.removeObserver = this.initResizeObserver();
      }
    }
  }

  componentDidMount() {
    // Init observer (triggers setPosition once)
    this.removeObserver = this.initResizeObserver();
  }

  componentWillUnmount() {
    // Remove the observer
    this.removeObserver && this.removeObserver();
  }

  initResizeObserver = () => {
    if (window?.ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => {
        if (!this.state.dragged)
          setPosition(this.props.wrapperEl, this.element.current, this.props.selectedElement);
      });

      resizeObserver.observe(this.props.wrapperEl);
      return () => resizeObserver.disconnect();
    } else {
      // Fire setPosition manually *only* for devices that don't support ResizeObserver
      if (!this.state.dragged)
        setPosition(this.props.wrapperEl, this.element.current, this.props.selectedElement);
    }  
  }

  /** Creator and created/modified timestamp metadata **/
  creationMeta = body => {
    const meta = {};

    const { user } = this.props.env;

    // Metadata is only added when a user is set, otherwise
    // the Editor operates in 'anonymous mode'.
    if (user) {
      meta.creator = {};
      if (user.id) meta.creator.id = user.id;
      if (user.displayName) meta.creator.name = user.displayName;

      meta[body.created ? 'modified' : 'created'] = this.props.env.getCurrentTimeAdjusted();
    }

    return meta;
  }

  /** Shorthand **/
  updateCurrentAnnotation = (diff, saveImmediately) => {
    this.setState({
      currentAnnotation: this.state.currentAnnotation.clone(diff)
    }, () => {
      if (saveImmediately)
        this.onOk();
    })
  }

  /**
   * Appends a body to the current annotation. For convenience: also 
   * takes an array of bodies as argument.
   * @param bodyOrBodies the body or list of bodies to append
   * @param saveImmediately set to true to save & close immediately
   */
  onAppendBody = (bodyOrBodies, saveImmediately) => {
    const toAppend = toArray(bodyOrBodies).map(b => 
      ({ ...b, ...this.creationMeta(b) }));

    this.updateCurrentAnnotation({ 
      body: [ ...this.state.currentAnnotation.bodies, ...toAppend ] 
    }, saveImmediately);
  }

  /**
   * Updates a previous body with the given body.
   * @param previous the body to replace
   * @param updated the body to replace with
   * @param saveImmediately set to true to save & close immediately
   */
  onUpdateBody = (previous, updated, saveImmediately) => { 
    this.updateCurrentAnnotation({
      body: this.state.currentAnnotation.bodies.map(body => 
        body === previous ? { ...updated, ...this.creationMeta(updated) } : body)
    }, saveImmediately);
  }

  /** 
   * For convenience: an 'append or update' shorthand.
   */
   onUpsertBody = (arg1, arg2, saveImmediately) => {
    if (arg1 == null && arg2 != null) {
      // Append arg 2 as a new body
      this.onAppendBody(arg2, saveImmediately);
    } else if (arg1 != null && arg2 != null) {
      // Replace body arg1 with body arg2
      this.onUpdateBody(arg1, arg2, saveImmediately);
    } else if (arg1 != null && arg2 == null) {
      // Find the first body with the same purpose as arg1,
      // and upsert
      const existing = this.state.currentAnnotation.bodies.find(b => b.purpose === arg1.purpose);
      if (existing)
        this.onUpdateBody(existing, arg1, saveImmediately);
      else
        this.onAppendBody(arg1, saveImmediately);
    }
  }

  /**
   * Removes the given body from the current annotation. For 
   * convenience: also takes an array of bodies as argument.
   * @param bodyOrBodies the body or list of bodies to remove
   * @param saveImmediately set to true to save & close immediately
   */
  onRemoveBody = (bodyOrBodies, saveImmediately) => {
    const toRemove = toArray(bodyOrBodies);

    this.updateCurrentAnnotation({
      body: this.state.currentAnnotation.bodies.filter(b => !toRemove.includes(b))
    }, saveImmediately);
  }

  /**
   * For convenience: removes and appends one or more bodies
   * in one go, optionally saving immediately.
   */
  onRemoveAndAppend = (bodyOrBodiesToRemove, bodyOrBodiesToAppend, saveImmediately) => {
    const toRemove = toArray(bodyOrBodiesToRemove);
    const toAppend = toArray(bodyOrBodiesToAppend).map(b => 
      ({ ...b, ...this.creationMeta(b) }));

    this.updateCurrentAnnotation({
      body: [
        ...this.state.currentAnnotation.bodies.filter(b => !toRemove.includes(b)),
        ...toAppend 
      ]
    }, saveImmediately);
  }

  /**
   * Sets the given property value at the top level of the annotation.
   * @param property property key
   * @param value property value - set to null to delete the property
   */
  onSetProperty = (property, value) => {
    // A list of properties the user is NOT allowed to set
    const isForbidden = [ '@context', 'id', 'type', 'body', 'target' ].includes(property); 

    if (isForbidden)
      throw new Exception(`Cannot set ${property} - not allowed`);

    if (value) {
      this.updateCurrentAnnotation({ [ property ]: value });
    } else {
      const updated = this.currentAnnotation.clone();
      delete updated[ property ];
      this.setState({ currentAnnotation: updated });
    }
  }

  onCancel = () => 
    this.props.onCancel(this.props.annotation);

  onOk = () => {
    // Removes the state payload from all bodies
    const undraft = annotation => 
      annotation.clone({
        body : annotation.bodies.map(({ draft, ...rest }) => rest)
      });

    const { currentAnnotation } = this.state;

    // Current annotation is either a selection (if it was created from 
    // scratch just now) or an annotation (if it existed already and was
    // selected for editing)
    if (currentAnnotation.bodies.length === 0 && !this.props.allowEmpty) {
      if (currentAnnotation.isSelection)
        onCancel();
      else 
        this.props.onAnnotationDeleted(this.props.annotation);
    } else {
      if (currentAnnotation.isSelection)
        this.props.onAnnotationCreated(undraft(currentAnnotation).toAnnotation());
      else
        this.props.onAnnotationUpdated(undraft(currentAnnotation), this.props.annotation);
    }
  }

  onDelete = () => 
    this.props.onAnnotationDeleted(this.props.annotation);

  render() {
    const { currentAnnotation } = this.state;

    // Use default comment + tag widget unless host app overrides
    const widgets = this.props.widgets ? 
      this.props.widgets.map(getWidget) : DEFAULT_WIDGETS;

    const isReadOnlyWidget = w => w.type.disableDelete ?
      w.type.disableDelete(currentAnnotation, {
        ...w.props,
        readOnly:this.props.readOnly,
        env: this.props.env
      }) : false;

    const hasDelete = currentAnnotation && 
      // annotation has bodies or allowEmpty,
      (currentAnnotation.bodies.length > 0 || this.props.allowEmpty) && // AND
      !this.props.readOnly && // we are not in read-only mode AND
      !currentAnnotation.isSelection && // this is not a selection AND
      !widgets.some(isReadOnlyWidget);  // every widget is deletable

    return (
      <Draggable 
        disabled={!this.props.detachable}
        cancel=".r6o-btn, .r6o-nodrag" 
        onDrag={() => this.setState({ dragged: true })}>

        <div ref={this.element} className={this.state.dragged ? 'r6o-editor dragged' : 'r6o-editor'}>
          <div className="r6o-arrow" />
          <div className="r6o-editor-inner">
            {widgets.map((widget, idx) => 
              React.cloneElement(widget, { 
                focus: idx === 0,
                annotation : currentAnnotation,
                readOnly : this.props.readOnly,
                env: this.props.env,
                onAppendBody: this.onAppendBody,
                onUpdateBody: this.onUpdateBody,
                onRemoveBody: this.onRemoveBody,
                onUpsertBody: this.onUpsertBody,
                onRemoveAndAppend: this.onRemoveAndAppend,
                onSetProperty: this.onSetProperty,
                onSaveAndClose: this.onOk              
              })
            )}
            
            { this.props.readOnly ? (
              <div className="r6o-footer">
                <button
                  className="r6o-btn" 
                  onClick={this.onCancel}>{i18n.t('Close')}</button>
              </div>
            ) : (
              <div className="r6o-footer">
                { hasDelete && (
                  <button 
                    className="r6o-btn left delete-annotation" 
                    title={i18n.t('Delete')}
                    onClick={this.onDelete}>
                    <TrashIcon width={12} />
                  </button>
                )}

                <button 
                  className="r6o-btn outline"
                  onClick={this.onCancel}>{i18n.t('Cancel')}</button>

                <button 
                  className="r6o-btn "
                  onClick={this.onOk}>{i18n.t('Ok')}</button>
              </div>
            )}
          </div>
        </div>

      </Draggable>
    )

  }

}