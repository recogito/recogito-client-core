/** Sets the editor position and determines a proper orientation **/
const setPosition = (wrapperEl, editorEl, selectedEl, autoPosition) => {
  // Container element bounds
  const containerBounds = wrapperEl.getBoundingClientRect();

  // Re-set orientation class
  editorEl.className = 'r6o-editor';

  // Make visible
  editorEl.style.opacity = 1;

  // Default orientation (upwards arrow, at bottom-left of shape)
  const { left, top, right, height, bottom } = selectedEl.getBoundingClientRect();
  editorEl.style.top = `${top + height - containerBounds.top}px`;
  editorEl.style.left = `${left - containerBounds.left}px`;

  if (autoPosition) {
    const defaultOrientation = editorEl.children[1].getBoundingClientRect();

    // Test 1: does right edge extend beyond the width of the page?
    // If so, flip horizontally
    if (defaultOrientation.right > window.innerWidth) {
      editorEl.classList.add('align-right');
      editorEl.style.left = `${right - defaultOrientation.width - containerBounds.left}px`;
    }

    // Test 2: does the bottom edge extend beyond the height of the page?
    // If so, flip vertically
    if (defaultOrientation.bottom > window.innerHeight) {
      editorEl.classList.add('align-bottom');
      
      const editorHeight = editorEl.children[1].getBoundingClientRect().height;
      editorEl.style.top = `${top - containerBounds.top - editorHeight}px`;
    }

    // Get bounding box in current orientation for next tests
    const currentOrientation = editorEl.children[1].getBoundingClientRect();

    // Test 3: does the top (still?) extend beyond top of the page?
    // If so, push it down
    if (currentOrientation.top < 0) {
      editorEl.classList.add('pushed-down');

      editorEl.style.top = `${-containerBounds.top}px`;

      const shapeBottom = bottom - containerBounds.top;
      const editorBottom = currentOrientation.height - containerBounds.top;

      if (editorBottom > shapeBottom)
        editorEl.classList.remove('align-bottom');
    }

    // Test 4: does the left edge extend beyond the start of the page?
    // If so, push inward
    if (currentOrientation.left < 0)
      editorEl.style.left = `${-containerBounds.left}px`;
  }
}

export default setPosition;
