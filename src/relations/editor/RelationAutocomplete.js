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

  return (
    <div ref={element}>
      <div {...getComboboxProps()}>
        <input 
          {...getInputProps({ onKeyDown: evt => { if (!isOpen) props.onKeyDown(evt); } })}
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