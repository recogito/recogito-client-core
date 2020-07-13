import WebAnnotation from '../WebAnnotation';
import { v4 as uuid } from 'uuid';

/**
 * An "annotation in draft mode". Really the same
 * data structure, but as a separate class so we can
 * tell things apart properly.
 */
export default class Selection {

  constructor(target) {
    this._stub = {
      type: 'Selection',
      body: [],
      target
    }
  }

  /** Creates a copy of this selection **/
  clone = opt_props => {
    // Deep-clone target
    const clonedTarget = JSON.parse(JSON.stringify(this._stub.target));    
    const cloned = new Selection(clonedTarget);

    if (opt_props)
      cloned._stub = { ...cloned._stub, ...opt_props };

    return cloned;
  }

  get type() {
    return this._stub.type;
  }

  get body() {
    return this._stub.body;
  }

  get target() {
    return this._stub.target;
  }

  /** For consistency with WebAnnotation **/
  isEqual(other) {
    if (!other) {
      return false;
    } else {
      return this._stub === other._stub;
    }
  }
  
  get bodies() {
    return this._stub.body;
  }

  selector = type => {
    const { target } = this._stub;

    if (target.selector) {
      // Normalize to array
      const selectors = Array.isArray(target.selector) ?
        target.selector : [ target.selector ];

      return selectors.find(s => s.type === type);
    }
  }

  /** Shorthand for the 'exact' field of the TextQuoteSelector **/
  get quote() {
    return this.selector('TextQuoteSelector').exact;
  }

  /*******************************************/ 
  /* Selection-specific properties & methods */
  /*******************************************/

  get isSelection() {
    return true;
  }

  toAnnotation = () => {
    const a = Object.assign({}, this._stub, {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      'type': 'Annotation',
      'id': `#${uuid()}`
    });

    return new WebAnnotation(a);
  }

}