/** Sets the editor position and determines a proper orientation **/
const setPosition = (wrapperEl, editorEl, selectedEl) => {
  // Container element offset  
  const containerBounds = wrapperEl.getBoundingClientRect();
  const { scrollX, scrollY } = window;

  // Re-set orientation class
  editorEl.className = 'r6o-editor';

  // Set visible
  editorEl.style.opacity = 1;

  // Default orientation
  const { left, top, right, height } = selectedEl.getBoundingClientRect();
  editorEl.style.top = `${top + height - containerBounds.top}px`;
  editorEl.style.left = `${left + scrollX - containerBounds.left}px`;

  const defaultOrientation = editorEl.getBoundingClientRect();

  if (defaultOrientation.right > window.innerWidth) {
    // Default bounds clipped - flip horizontally
    editorEl.classList.add('align-right');
    editorEl.style.left = `${right - defaultOrientation.width + scrollX - containerBounds.left}px`;
  }

  if (defaultOrientation.bottom + scrollY > window.innerHeight) {
    // Flip vertically
    const annotationTop = top + scrollY; // Annotation bottom relative to parents
    const containerHeight = containerBounds.bottom + scrollY;

    editorEl.classList.add('align-bottom');
    editorEl.style.top = 'auto';
    editorEl.style.bottom = `${containerHeight - annotationTop}px`;
  }
}

export default setPosition;
