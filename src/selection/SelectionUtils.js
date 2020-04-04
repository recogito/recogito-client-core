import Selection from './Selection';

export const trimRange = range => {
  let quote = range.toString();
  let leadingSpaces = 0;
  let trailingSpaces = 0;

  // Count/strip leading spaces
  while (quote.substring(0, 1) === ' ') {
    leadingSpaces += 1;
    quote = quote.substring(1);
  }

  // Count/strip trailing spaces
  while (quote.substring(quote.length - 1) === ' ') {
    trailingSpaces += 1;
    quote = quote.substring(0, quote.length - 1);
  }

  // Adjust range
  if (leadingSpaces > 0)
    range.setStart(range.startContainer, range.startOffset + leadingSpaces);

  if (trailingSpaces > 0)
    range.setEnd(range.endContainer, range.endOffset - trailingSpaces);

  return range;
};

export const rangeToSelection = (range, containerEl) => {
  const rangeBefore = document.createRange();

  // A helper range from the start of the contentNode to the start of the selection
  rangeBefore.setStart(containerEl, 0);
  rangeBefore.setEnd(range.startContainer, range.startOffset);

  const quote = range.toString();
  const start = rangeBefore.toString().length;

  return new Selection([{
    type: 'TextQuoteSelector',
    exact: quote
  }, {
    type: 'TextPositionSelector',
    start: start,
    end: start + quote.length
  }]);

};

export const enableTouch = (element, selectHandler) => {
  let touchTimeout;
  let lastTouchEvent;

  const onTouchStart = evt => {
    if (!touchTimeout) {
      lastTouchEvent = evt;
      touchTimeout = setTimeout(executeTouchSelect, 1000);
    }
  }

  const executeTouchSelect = () => {
    if (lastTouchEvent) {
      selectHandler(lastTouchEvent);
      touchTimeout = null;
      lastTouchEvent = null;
    }
  };

  const resetTouch = evt => {
    if (touchTimeout) {
      clearTimeout(touchTimeout);
      touchTimeout = setTimeout(executeTouchSelect, 1500);
    }
  }

  element.addEventListener('touchstart', onTouchStart);
  document.addEventListener('selectionchange', resetTouch);  
}