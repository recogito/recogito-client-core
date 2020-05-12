import { trimRange, rangeToSelection, enableTouch } from './SelectionUtils';
import EventEmitter from 'tiny-emitter';

const IS_TOUCH = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

export default class SelectionHandler extends EventEmitter {

  constructor(element, highlighter) {
    super();

    this.el = element;
    this.highlighter = highlighter;

    this.isEnabled = true;

    element.addEventListener('mousedown', this._onMouseDown);
    element.addEventListener('mouseup', this._onMouseUp);

    if (IS_TOUCH)
      enableTouch(element, this._onMouseUp);
  }

  get enabled() {
    return this.isEnabled;
  }

  set enabled(enabled) {
    this.isEnabled = enabled;
  }

  _onMouseDown = evt => {
    this.clearSelection();
  }

  _onMouseUp = evt => {
    if (this.isEnabled) {
      const selection = getSelection();

      if (selection.isCollapsed) {
        const annotationSpan = evt.target.closest('.r6o-annotation');
        if (annotationSpan) {
          this.emit('select', {
            selection: this.highlighter.getAnnotationsAt(annotationSpan)[0],
            element: annotationSpan
          });
        } else {
          // De-select
          this.emit('select', {});
        }
      } else {
        const selectedRange = trimRange(selection.getRangeAt(0));
        const stub = rangeToSelection(selectedRange, this.el);

        const spans = this.highlighter.wrapRange(selectedRange);
        spans.forEach(span => span.className = 'r6o-selection');

        this._clearNativeSelection();

        this.emit('select', {
          selection: stub,
          element: selectedRange
        });
      }
    }
  }

  _clearNativeSelection = () => {
    if (window.getSelection) {
      if (window.getSelection().empty) {  // Chrome
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {  // Firefox
        window.getSelection().removeAllRanges();
      }
    } else if (document.selection) {  // IE?
      document.selection.empty();
    }
  }

  clearSelection = () => {
    this._currentSelection = null;

    const spans = Array.prototype.slice.call(this.el.querySelectorAll('.r6o-selection'));
    if (spans) {
      spans.forEach(span => {
        const parent = span.parentNode;
        parent.insertBefore(document.createTextNode(span.textContent), span);
        parent.removeChild(span);
      });
    }
    this.el.normalize();
  }

}
