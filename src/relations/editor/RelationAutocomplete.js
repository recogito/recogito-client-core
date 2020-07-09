import React, { useState, useEffect, useRef } from 'react'
import { useCombobox } from 'downshift'

const RelationAutocomplete = props => {

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

  const onKeyDown = evt => {
    // Only forward key events if the dropdown is closed, or no option selected)
    if (!isOpen || highlightedIndex == -1) 
      props.onKeyDown(evt);
  }

  return (
    <div ref={element}>
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

export default RelationAutocomplete;