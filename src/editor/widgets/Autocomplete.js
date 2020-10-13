import React, { Component, createRef } from 'react'
import { useCombobox } from 'downshift'

export default class Autocomplete extends Component {

  constructor(props) {
    super(props);

    this.element = createRef();

    this.state = {
      inputItems: props.vocabulary || []
    }
  }

  componentDidMount() {
    if (this.props.initialValue && this.element.current)
      this.element.current.querySelector('input').value = this.props.initialValue;
  }
  
  onInputValueChange = ({ inputValue }) => {
    if (inputValue.length > 0) {
      const prefixMatches = this.props.vocabulary.filter(item => {
        return item.toLowerCase().startsWith(inputValue.toLowerCase());
      });

      this.setState({ inputItems: prefixMatches });
    } else {
      // ...or none, if the input is empty
      this.setState({ inputItems: [] });
    }      
  }

  render() {

    const {
      isOpen,
      getMenuProps,
      getInputProps,
      getComboboxProps,
      highlightedIndex,
      getItemProps,
      setInputValue
    } = useCombobox({ 
      items: this.state.inputItems, 
      onInputValueChange: this.onInputValueChange, 
      onSelectedItemChange: ({ inputValue }) => {
        onSubmit(inputValue);
        setInputValue('');
      } 
    });

    const onSubmit = inputValue => {
      setInputValue('');
      if (inputValue.trim().length > 0)
        this.props.onSubmit(inputValue);
    }

    const onKeyUp = evt => {
      const { value } = evt.target;
      
      if (evt.which == 13 && highlightedIndex == -1) {
        onSubmit(value);
      } else if (evt.which == 40 && value.length == 0) {
        setInputItems(this.props.vocabulary); // Show all options on key down
      } else if (evt.which == 27) {
        this.props.onCancel && this.props.onCancel();
      } else {
        this.props.onChange && this.props.onChange(value);
      }
    }

    return (
      <div className="r6o-autocomplete" ref={this.element}>
        <div {...getComboboxProps()}>
          <input 
            {...getInputProps({ onKeyUp })}
            placeholder={this.props.placeholder} />
        </div>
        <ul {...getMenuProps()}>
          {isOpen && this.state.inputItems.map((item, index) => (
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
  
}
