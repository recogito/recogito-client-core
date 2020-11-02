import React from 'preact/compat';
import { useRef } from 'preact/hooks';
import useClickOutside from '../../useClickOutside';
import i18n from '../../../i18n';
const purposes = ['assessing', 'bookmarking', 'classifying', 'commenting', 'describing', 'editing', 'highlighting', 'identifying', 'linking', 'moderating', 'questioning']

const DropdownMenu = props => {
  const ref = useRef();
  // Custom hook that notifies when clicked outside this component
  useClickOutside(ref, () => props.onClickOutside());
  return (
    <select name="purpose" id="purpose">
      {purposes.map(purpose => (
        <option value={purpose} selected={purpose == props.content}>
          {purpose}
        </option>
      ))}
    </select>
  )

}

export default DropdownMenu;