import React, { Component } from 'react';
import Editor from './editor/Editor';
import Highlighter from './highlighter/Highlighter';
import SelectionHandler from './selection/SelectionHandler';
import RelationsLayer from './relations/RelationsLayer'; 
import RelationEditor from './relations/editor/RelationEditor';

/**
 * Pulls the strings between the annotation highlight layer
 * and the editor popup.
 */
export default class TextAnnotator extends Component {

  state = {
    selectionBounds: null,
    selectedAnnotation: null,

    showRelationEditor: false,
    selectedRelation: null,

    applyTemplate: null,
    headless: false
  }

  /** Shorthand **/
  clearState = () => {
    this.setState({
      selectionBounds: null,
      selectedAnnotation: null
    });
  }

  handleEscape = (evt) => {
    if (evt.which === 27)
      this.onCancelAnnotation();
  }

  componentDidMount() {
    this.highlighter = new Highlighter(this.props.contentEl, this.props.formatter);

    this.selectionHandler = new SelectionHandler(this.props.contentEl, this.highlighter);
    this.selectionHandler.on('select', this.handleSelect);

    this.relationsLayer = new RelationsLayer(this.props.contentEl);
    this.relationsLayer.readOnly = true; // Deactivate by default

    this.relationsLayer.on('createRelation', this.onEditRelation);
    this.relationsLayer.on('selectRelation', this.onEditRelation);
    this.relationsLayer.on('cancelDrawing', this.closeRelationsEditor);

    document.addEventListener('keydown', this.handleEscape);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleEscape);
  }

  /**************************/  
  /* Annotation CRUD events */
  /**************************/    

  /** Selection on the text **/
  handleSelect = evt => {
    const { selection, clientRect } = evt;
    if (selection) {
      this.setState({ 
        selectedAnnotation: null, 
        selectionBounds: null 
      }, () => this.setState({ 
        selectedAnnotation: selection,
        selectionBounds: clientRect
      }))
    } else {
      this.clearState();
    }
  }

  /** Common handler for annotation CREATE or UPDATE **/
  onCreateOrUpdateAnnotation = method => (annotation, previous) => {
    this.clearState();
    
    this.selectionHandler.clearSelection();
    this.highlighter.addOrUpdateAnnotation(annotation, previous);

    // Call CREATE or UPDATE handler
    this.props[method](annotation, previous);
  }

  onDeleteAnnotation = annotation => {
    // Delete connections
    const connections = this.relationsLayer.getConnectionsFor(annotation);
    connections.forEach(c => c.destroy());

    this.clearState();
    this.selectionHandler.clearSelection();
    this.highlighter.removeAnnotation(annotation);

    this.props.onAnnotationDeleted(annotation);
  }

  /** Cancel button on annotation editor **/
  onCancelAnnotation = () => {
    this.clearState();
    this.selectionHandler.clearSelection();
  }

  /************************/  
  /* Relation CRUD events */
  /************************/  

  // Shorthand
  closeRelationsEditor = () => {
    this.setState({ showRelationEditor: false });
    this.relationsLayer.resetDrawing();
  }

  /**
   * Selection on the relations layer: open an existing
   * or newly created connection for editing.
   */
  onEditRelation = relation => {
    this.setState({ 
      showRelationEditor: true,
      selectedRelation: relation
    });
  }

  /** 'Ok' on the relation editor popup **/
  onCreateOrUpdateRelation = (relation, previous) => {
    this.relationsLayer.addOrUpdateRelation(relation, previous);
    this.closeRelationsEditor();

    // This method will always receive a 'previous' connection -
    // if the previous is just an empty connection, fire 'create',
    // otherwise, fire 'update'
    const isNew = previous.annotation.bodies.length === 0;

    if (isNew)
      this.props.onAnnotationCreated(relation.annotation);
    else
      this.props.onAnnotationUpdated(relation.annotation, previous.annotation);
  }

  /** 'Delete' on the relation editor popup **/
  onDeleteRelation = relation => {
    this.relationsLayer.removeRelation(relation);
    this.closeRelationsEditor();
    this.props.onAnnotationDeleted(relation.annotation);
  }

  /****************/               
  /* External API */
  /****************/    

  addAnnotation = annotation => {
    this.highlighter.addOrUpdateAnnotation(annotation);
  }

  removeAnnotation = annotation => {
    this.highlighter.removeAnnotation(annotation);

    // If the editor is currently open on this annotation, close it
    const { selectedAnnotation } = this.state;
    if (selectedAnnotation && annotation.isEqual(selectedAnnotation))
      this.clearState();
  }

  setAnnotations = annotations => {
    this.highlighter.init(annotations).then(() =>
      this.relationsLayer.init(annotations));
  }

  getAnnotations = () => {
    const annotations = this.highlighter.getAllAnnotations();
    const relations = this.relationsLayer.getAllRelations();
    return annotations.concat(relations);
  }

  setMode = mode => {
    if (mode === 'RELATIONS') {
      this.clearState();
      
      this.selectionHandler.enabled = false;

      this.relationsLayer.readOnly = false;
      this.relationsLayer.startDrawing();
    } else {
      this.setState({ showRelationEditor: false });
      
      this.selectionHandler.enabled = true;

      this.relationsLayer.readOnly = true;
      this.relationsLayer.stopDrawing();
    }
  }

  applyTemplate = (bodies, headless) => 
    this.setState({ applyTemplate: bodies, headless })

  render() {
    return (
      <>
        { this.state.selectedAnnotation &&
          <Editor
            wrapperEl={this.props.wrapperEl}
            bounds={this.state.selectionBounds}
            annotation={this.state.selectedAnnotation}
            readOnly={this.props.readOnly}
            headless={this.state.headless}
            applyTemplate={this.state.applyTemplate}
            onAnnotationCreated={this.onCreateOrUpdateAnnotation('onAnnotationCreated')}
            onAnnotationUpdated={this.onCreateOrUpdateAnnotation('onAnnotationUpdated')}
            onAnnotationDeleted={this.onDeleteAnnotation}
            onCancel={this.onCancelAnnotation}>

            {this.props.children}

          </Editor>
        }

        { this.state.showRelationEditor && 
          <RelationEditor 
            relation={this.state.selectedRelation}
            onRelationCreated={this.onCreateOrUpdateRelation}
            onRelationUpdated={this.onCreateOrUpdateRelation}
            onRelationDeleted={this.onDeleteRelation}
            onCancel={this.closeRelationsEditor}
          /> 
        }
      </>
    );
  }  

}
