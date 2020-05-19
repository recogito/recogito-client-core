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

}

/**
 * Helper to init the i18n class with a pre-defined or auto-detected locale.
 */
export const setLocale = locale => {
  if (locale) {
    try {
      const l = locale === 'auto' ?
        window.navigator.userLanguage || window.navigator.language : locale;

      I18n.init(l);
    } catch (error) {
      console.warn(`Unsupported locale '${locale}'. Falling back to default en.`);
    }
  }
}