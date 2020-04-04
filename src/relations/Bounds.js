export default class Bounds {

  constructor(elements, offsetContainer) {
    this.elements = elements;
    this.offsetContainer = offsetContainer;
    this.recompute();
  }

  recompute = () => {
    this.offsetBounds = toUnionBoundingRects(this.elements).map(clientBounds => {
      return toOffsetBounds(clientBounds, this.offsetContainer);
    });
  }

  get rects() {
    return this.offsetBounds;
  }
  
  get top() {
    return this.offsetBounds[0].top;
  }

  get bottom() {
    return this.offsetBounds[this.offsetBounds.length - 1].bottom;
  }

  get height() {
    return this.bottom - this.top;
  }

  get topHandleXY() {
    return [
      this.offsetBounds[0].left + this.offsetBounds[0].width / 2 + 0.5,
      this.offsetBounds[0].top
    ];
  }

  get bottomHandleXY() {
    const i = this.offsetBounds.length - 1;
    return [
      this.offsetBounds[i].left + this.offsetBounds[i].width / 2 - 0.5,
      this.offsetBounds[i].bottom
    ];
  }

}

/** Translates DOMRect client bounds to offset bounds within the given container **/
const toOffsetBounds = (clientBounds, offsetContainer) => {
  const { x, y } = offsetContainer.getBoundingClientRect();
  const left = Math.round(clientBounds.left - x);
  const top = Math.round(clientBounds.top - y);

  return {
    left  : left,
    top   : top,
    right : Math.round(left + clientBounds.width),
    bottom: Math.round(top + clientBounds.height),
    width : Math.round(clientBounds.width),
    height: Math.round(clientBounds.height)
  };
};

/** Returns a clean list of (merged) DOMRect bounds for the given elements **/
const toUnionBoundingRects = elements => {
  const allRects = elements.reduce(function(arr, el) {
    const rectList = el.getClientRects();
    const len = rectList.length; 

    for (let i = 0; i<len; i++) {
      arr.push(rectList[i]);
    }

    return arr;
  }, []);

  return mergeBounds(allRects);
}

/** Helper to merge two bounds that have the same height + are exactly consecutive **/
const mergeBounds = clientBounds => {
  if (clientBounds.length == 1)
    return clientBounds; // shortcut

  return clientBounds.reduce(function(merged, bbox) {
    const previous = (merged.length > 0) ? merged[merged.length - 1] : null;

    const isConsecutive = function(a, b) {
      if (a.height === b.height)
        return (a.x + a.width === b.x || b.x + b.width === a.x);
      else
        return false;
    };

    const extend = function(a, b) {
      a.x = Math.min(a.x, b.x);
      a.left = Math.min(a.left, b.left);
      a.width = a.width + b.width;
      a.right = Math.max(a.right + b.right);
    };

    if (previous) {
      if (isConsecutive(previous, bbox))
        extend(previous, bbox);
      else
        merged.push(bbox);
    } else {
      merged.push(bbox);
    }

    return merged;
  }, []);
}