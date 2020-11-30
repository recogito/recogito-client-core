import React, { Component } from 'preact/compat';
import i18n from '../../../i18n';
import Select from 'react-select';

const purposes = [{'value': 'assessing', 'label': 'Assessing'}, {'value': 'bookmarking', 'label': 'Bookmarking'}, {'value': 'classifying', 'label': 'Classifying'}, {'value': 'commenting', 'label': 'Commenting'}, {'value': 'describing', 'label': 'Describing'},{'value': 'editing', 'label': 'Editing'}, {'value': 'highlighting', 'label': 'Highlighting'},{'value': 'identifying', 'label': 'Identifying'},{'value': 'linking', 'label': 'Linking'},{'value': 'moderating', 'label': 'Moderating'},{'value': 'questioning', 'label': 'Questioning'}]

export default class TypeDropdown extends Component {
  render() {
    const selectedOption = this.props.content ? {'value': this.props.content, 'label': this.props.content.charAt(0).toUpperCase() + this.props.content.slice(1) } : undefined;
    return (
      <div class="purposedropdown">
        <Select
          value={selectedOption}
          onChange={this.props.onChange}
          options={purposes}
          isDisabled={!this.props.editable}
        />
      </div>
    );
  }
} 