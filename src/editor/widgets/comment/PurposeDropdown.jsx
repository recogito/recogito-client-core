import React from 'preact/compat';
import Select from 'react-select';

export const purposes = [
  {'value': 'assessing', 'label': 'Assessing'}, 
  {'value': 'bookmarking', 'label': 'Bookmarking'}, 
  {'value': 'classifying', 'label': 'Classifying'}, 
  {'value': 'commenting', 'label': 'Commenting'}, 
  {'value': 'describing', 'label': 'Describing'},
  {'value': 'editing', 'label': 'Editing'}, 
  {'value': 'highlighting', 'label': 'Highlighting'},
  {'value': 'identifying', 'label': 'Identifying'},
  {'value': 'linking', 'label': 'Linking'},
  {'value': 'moderating', 'label': 'Moderating'},
  {'value': 'questioning', 'label': 'Questioning'},
  {'value': 'replying', 'label': 'Replying'}
]

const PurposeDropdown = props => {

  const selectedOption = this.props.content ?
    purposes.find(p => p.value === props.content) : null;

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

export default PurposeDropdown;