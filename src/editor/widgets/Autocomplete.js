import React, { useState, useEffect, useRef } from 'react'
import { useCombobox } from 'downshift'

const Autocomplete = props => {

  const element = useRef();

  const [ inputItems, setInputItems ] = useState(props.vocabulary);

  useEffect(() =>
    element.current?.querySelector('input').focus(), []);

  const onInputValueChange = ({ inputValue }) => {
    props.onChange(inputValue);

    setInputItems(
      props.vocabulary.filter(item =>
        item.toLowerCase().startsWith(inputValue.toLowerCase())))
  }

  const {
    isOpen,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
  } = useCombobox({ items: inputItems, onInputValueChange });

  // TODO onEnter?
  const onKeyDown = evt => {
    if (evt.which == 13) {
      if (!isOpen || highlightedIndex == -1) {
        setInputItems([]); // To prevent the popup from showing up afterwards
        props.onKeyDown(evt);
      }
    } else if (evt.which == 40 && props.content.length == 0) {
      // To make options appear on key down
      setInputItems(props.vocabulary);
    }
  }

  return (
    <div ref={element} className="r6o-autocomplete">
      <div {...getComboboxProps()}>
        <input 
          {...getInputProps({ onKeyDown  })}
          placeholder={props.placeholder}  
          value={props.content} />
      </div>
      <ul {...getMenuProps()}>
        {isOpen && inputItems.map((item, index) => (
          <li style={
                highlightedIndex === index
                  ? { backgroundColor: '#bde4ff' }
                  : {}
              }
              key={`${item}${index}`}
              {...getItemProps({ item, index })}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
  
}

export default Autocomplete;