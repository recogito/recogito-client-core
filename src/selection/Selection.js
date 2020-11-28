import WebAnnotation from '../WebAnnotation';
import { v4 as uuid } from 'uuid';

/**
 * An "annotation in draft mode". Really the same
 * data structure, but as a separate class so we can
 * tell things apart properly.
 */
export default class Selection {

  constructor(target) {
    this._underlying = {
      type: 'Selection',
      body: [],
      target
    }
  }

  /** Creates a copy of this selection **/
  clone = opt_props => {
    // Deep-clone target
    const clonedTarget = JSON.parse(JSON.stringify(this._underlying.target));    
    const cloned = new Selection(clonedTarget);

    if (opt_props)
      cloned._underlying = { ...cloned._underlying, ...opt_props };

    return cloned;
  }

  get type() {
    return this._underlying.type;
  }

  get body() {
    return this._underlying.body;
  }

  get target() {
    return this._underlying.target;
  }

  /** For consistency with WebAnnotation **/
  isEqual(other) {
    if (!other) {
      return false;
    } else {
      return this._underlying === other._underlying;
    }
  }
  
  get bodies() {
    return this._underlying.body;
  }

  selector = type => {
    const { target } = this._underlying;

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
    const a = Object.assign({}, this._underlying, {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      'type': 'Annotation',
      'id': `#${uuid()}`
    });

    return new WebAnnotation(a);
  }

}