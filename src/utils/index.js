import I18n from '../i18n';

/**
 * 'Deflates' the HTML contained in the given parent node.
 * Deflation will completely drop empty text nodes, and replace
 * multiple spaces, tabs, newlines with a single space. This way,
 * character offsets in the markup will more closely represent
 * character offsets experienced in the browser.
 */
export const deflateHTML = parent => {
  deflateNodeList([ parent ]);
  return parent;
}

const deflateNodeList = parents => {

  // Deflates the immediate children of one parent (but not children of children)
  const deflateOne = parent => {
    return Array.from(parent.childNodes).reduce((compacted, node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.textContent.trim().length > 0) {
          // Text node - trim
          const trimmed = node.textContent.replace(/\s\s+/g, ' ');
          return [...compacted, document.createTextNode(trimmed)];
        } else {
          // Empty text node - discard
          return compacted;
        }
      } else {
        return [...compacted, node];
      }
    }, []);
  }

  // Replace original children with deflated
  parents.forEach(parent => {
    const deflatedChildren = deflateOne(parent);
    parent.innerHTML = '';
    deflatedChildren.forEach(node => parent.appendChild(node));
  });

  // Then, get all children that have more children
  const childrenWithChildren = parents.reduce((childrenWithChildren, parent) => {
    return childrenWithChildren.concat(Array.from(parent.childNodes).filter(c => c.firstChild));
  }, []);

  // Recursion
  if (childrenWithChildren.length > 0)
    deflateNodeList(childrenWithChildren);

}

/**
 * Adds MS Edge polyfills for Element.matches and .closest methods.
 */
export const addPolyfills = () => {

  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
      Element.prototype.webkitMatchesSelector;
  }

  if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
      let el = this;

      do {
        if (Element.prototype.matches.call(el, s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };
  }

  /*
  if (!String.prototype.startsWith) {
      Object.defineProperty(String.prototype, 'startsWith', {
          value: function(search, rawPos) {
              var pos = rawPos > 0 ? rawPos|0 : 0;
              return this.substring(pos, pos + search.length) === search;
          }
      });
  }
  */

  if (!String.prototype.includes) {
    String.prototype.includes = function(search, start) {
      'use strict';

      if (search instanceof RegExp) {
        throw TypeError('first argument must not be a RegExp');
      }
      if (start === undefined) { start = 0; }
      return this.indexOf(search, start) !== -1;
    };
  }

  if (!Array.prototype.find) {
    Object.defineProperty(Array.prototype, 'find', {
      value: function(predicate) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
          throw TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If IsCallable(predicate) is false, throw a TypeError exception.
        if (typeof predicate !== 'function') {
          throw TypeError('predicate must be a function');
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];

        // 5. Let k be 0.
        var k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ! ToString(k).
          // b. Let kValue be ? Get(O, Pk).
          // c. Let testResult be ToBoolean(? Call(predicate, T, « kValue, k, O »)).
          // d. If testResult is true, return kValue.
          var kValue = o[k];
          if (predicate.call(thisArg, kValue, k, o)) {
            return kValue;
          }
          // e. Increase k by 1.
          k++;
        }

        // 7. Return undefined.
        return undefined;
      },
      configurable: true,
      writable: true
    });

  }

  if (typeof Object.assign !== 'function') {
    // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
      value: function assign(target, varArgs) { // .length of function is 2
        'use strict';
        if (target === null || target === undefined) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var nextSource = arguments[index];

          if (nextSource !== null && nextSource !== undefined) {
            for (var nextKey in nextSource) {
              // Avoid bugs when hasOwnProperty is shadowed
              if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                to[nextKey] = nextSource[nextKey];
              }
            }
          }
        }
        return to;
      },
      writable: true,
      configurable: true
    });
  }

}

/**
 * Helper to init the i18n class with a pre-defined or auto-detected locale.
 */
export const setLocale = locale => {
  if (locale) {
    const l = locale === 'auto' ?
      window.navigator.userLanguage || window.navigator.language : locale;

    try {
      I18n.init(l.split('-')[0].toLowerCase());
    } catch (error) {
      console.warn(`Unsupported locale '${l}'. Falling back to default en.`);
    }
  }
}
