import I18n from '../i18n';

/**
 * Adds DOM polyfills that babel polyfill doesn't include
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
    const l = locale === 'auto' ?
      window.navigator.userLanguage || window.navigator.language : locale;

    try {
      I18n.init(l.split('-')[0].toLowerCase());
    } catch (error) {
      console.warn(`Unsupported locale '${l}'. Falling back to default en.`);
    }
  }
}
