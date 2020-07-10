import React, { useState, useEffect, useRef } from 'react'
import { useCombobox } from 'downshift'

const Autocomplete = props => {

  const element = useRef();

  const [ value, setValue ] = useState('');

  const [ inputItems, setInputItems ] = useState(props.vocabulary);

  useEffect(() => element.current?.querySelector('input')?.focus(), []);

  const onSubmit = inputValue => {
    setValue('');
    setInputItems([]); // Force-hide the popup
    if (inputValue.trim().length > 0)
      props.onSubmit(inputValue);
  }
  
  const onInputValueChange = ({ inputValue }) => {
    setValue(inputValue);
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
    setInputValue
  } = useCombobox({ 
    items: inputItems, 
    onInputValueChange, 
    onSelectedItemChange: ({ inputValue }) => {
      onSubmit(inputValue);
      setInputValue('');
    } 
  });

  const onKeyDown = evt => {
    if (evt.which == 13 && highlightedIndex == -1)
      onSubmit(value);
    else if (evt.which == 40 && value.length == 0)
      setInputItems(props.vocabulary); // Show all options on key down
    else if (evt.which == 27)
      props.onCancel && props.onCancel();
  }

  return (
    <div ref={element} className="r6o-autocomplete">
      <div {...getComboboxProps()}>
        <input 
          {...getInputProps({ onKeyDown  })}
          placeholder={props.placeholder}
          defaultValue={props.initialValue}
          value={value} />
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