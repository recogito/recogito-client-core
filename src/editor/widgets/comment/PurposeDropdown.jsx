import React, { Component } from 'preact/compat';
import Select from 'react-select';

export const purposes = [{'value': 'assessing', 'label': 'Assessing'}, {'value': 'bookmarking', 'label': 'Bookmarking'}, {'value': 'classifying', 'label': 'Classifying'}, {'value': 'commenting', 'label': 'Commenting'}, {'value': 'describing', 'label': 'Describing'},{'value': 'editing', 'label': 'Editing'}, {'value': 'highlighting', 'label': 'Highlighting'},{'value': 'identifying', 'label': 'Identifying'},{'value': 'linking', 'label': 'Linking'},{'value': 'moderating', 'label': 'Moderating'},{'value': 'questioning', 'label': 'Questioning'},{'value': 'replying', 'label': 'Replying'}]

export default class PurposeDropdown extends Component {
  render() {
    const selectedOption = this.props.content ? {'value': this.props.content, 'label': this.props.content.charAt(0).toUpperCase() + this.props.content.slice(1) } : undefined;
    return (
      <div class="r6o-purposedropdown">
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