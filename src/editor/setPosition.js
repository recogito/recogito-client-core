/** Sets the editor position and determines a proper orientation **/
const setPosition = (wrapperEl, editorEl, selectedEl) => {
  // Container element offset
  const containerBounds = wrapperEl.getBoundingClientRect();
  const { pageYOffset } = window;

  // Re-set orientation class
  editorEl.className = 'r6o-editor';

  // Set visible
  editorEl.style.opacity = 1;

  // Default orientation
  const { left, top, right, height, bottom } = selectedEl.getBoundingClientRect();
  editorEl.style.top = `${top + height - containerBounds.top}px`;
  editorEl.style.left = `${left - containerBounds.left}px`;

  const defaultOrientation = editorEl.children[1].getBoundingClientRect();

  if (defaultOrientation.right > window.innerWidth) {
    // Default bounds clipped - flip horizontally
    editorEl.classList.add('align-right');
    editorEl.style.left = `${right - defaultOrientation.width - containerBounds.left}px`;
  }

  if (defaultOrientation.bottom > window.innerHeight) {
    // Flip vertically
    const annotationTop = top + pageYOffset; // Annotation bottom relative to parents
    const containerHeight = containerBounds.bottom + pageYOffset;

    editorEl.classList.add('align-bottom');
    editorEl.style.top = 'auto';
    editorEl.style.bottom = `${containerHeight - annotationTop}px`;
  }

  // Check if vertical flip helped, push down if not 
  const currentOrientation = editorEl.children[1].getBoundingClientRect();
  if (currentOrientation.top < 0) {
    editorEl.style.top = `${-containerBounds.top}px`;
    editorEl.style.bottom = 'auto';

    const shapeBottom = bottom - containerBounds.top;
    const editorBottom = currentOrientation.height - containerBounds.top;

    if (editorBottom > shapeBottom)
      editorEl.classList.remove('align-bottom');
  }

}

export default setPosition;
