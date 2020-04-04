import React, { useRef } from 'react';
import useClickOutside from '../../useClickOutside';

const DropdownMenu = props => {

  const ref = useRef();

  // Custom hook that notifies when clicked outside this component
  useClickOutside(ref, () => props.onClickOutside());

  return (
    <ul ref={ref} className="comment-dropdown-menu">
      <li onClick={props.onEdit}>Edit</li>
      <li onClick={props.onDelete}>Delete</li>
    </ul>
  )

}

export default DropdownMenu;