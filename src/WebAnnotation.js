export default class WebAnnotation {

  constructor(annotation) {
    this._annotation = annotation;
  }

  /** For convenience - creates an empty web annotation **/
  static create = args => {
    const stub = {
      '@context': 'http://www.w3.org/ns/anno.jsonld',
      'type': 'Annotation',
      'body': []
    };

    return new WebAnnotation({ ...stub, ...args });
  }

  /** Creates a copy of this annotation **/
  clone = opt_props => {
    return new WebAnnotation({ ...this._annotation, ...opt_props});
  }

  /** An equality check based on the underlying object or (if given) ID **/
  isEqual(other) {
    if (!other) {
      return false;
    } else if (this._annotation === other._annotation) {
      return true;
    } else if (!this._annotation.id || !other._annotation.id) {
      return false;
    }
    return this._annotation.id === other._annotation.id
  }

  /*************************************/ 
  /* Getters to forward properties of  */
  /* the underlying annotation         */
  /*************************************/

  get id() {
    return this._annotation.id; 
  }

  get type() {
    return this._annotation.type;
  }

  get motivation() {
    return this._annotation.motivation;
  }

  get body() {
    return this._annotation.body;
  }

  get target() {
    return this._annotation.target;
  }

  /** Same as .body, but guaranteed to return an array **/
  get bodies() {
    return (Array.isArray(this._annotation.body)) ?
      this._annotation.body : [ this._annotation.body ];
  }

  /** Only bodies are meant to be mutated by the application **/
  set bodies(bodies) {
    this._annotation.body = bodies;
  }

  /** Same as .target, but guaranteed to return an array **/
  get targets() {
    return (Array.isArray(this._annotation.target)) ?
      this._annotation.target : [ this._annotation.target ];
  }
  
  /*****************************************/ 
  /* Various access helpers and shorthands */
  /*****************************************/

  /** Selector of the given type **/
  selector = type => {
    return this._annotation.target.selector && 
      this._annotation.target.selector.find(t => t.type === type);
  }

  /** Shorthand for the 'exact' field of the TextQuoteSelector **/
  get quote() {
    return this.selector('TextQuoteSelector').exact;
  }

  /** Shorthand for the 'start' field of the TextPositionSelector **/
  get start() {
    return this.selector('TextPositionSelector').start;
  }

  /** Shorthand for the 'end' field of the TextPositionSelector **/
  get end() {
    return this.selector('TextPositionSelector').end;
  }
  
}