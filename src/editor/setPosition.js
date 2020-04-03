/** Sets the editor position and determines a proper orientation **/
const setPosition = (containerEl, editorEl, annotationBounds) => {
  // Container element offset
  const { offsetLeft, offsetTop } = containerEl;
  const { scrollX, scrollY } = window;

  // Re-set orientation class
  editorEl.className = 'r6o-editor';

  // Default orientation
  const { x, y, height, top, right } = annotationBounds; 
  editorEl.style.top = `${y + height + scrollY - offsetTop}px`;
  editorEl.style.left = `${x + scrollX - offsetLeft}px`;

  const defaultOrientation = editorEl.getBoundingClientRect();

  if (defaultOrientation.right > window.innerWidth) {
    // Default bounds clipped - flip horizontally
    editorEl.classList.add('align-right');
    editorEl.style.left = `${right - defaultOrientation.width + scrollX - offsetLeft}px`;
  }

  if (defaultOrientation.bottom > window.innerHeight) {
    // Flip vertically
    const annotationTop = top + scrollY; // Annotation top relative to parents
    const containerBounds = containerEl.getBoundingClientRect();
    const containerHeight = containerBounds.height + containerBounds.top + scrollY;
    
    editorEl.classList.add('align-bottom');
    editorEl.style.top = 'auto';
    editorEl.style.bottom = `${containerHeight - annotationTop}px`;
  }
}

export default setPosition;