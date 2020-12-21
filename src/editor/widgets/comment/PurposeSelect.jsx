import React from 'preact/compat';
import Select from 'react-select';

export const PURPOSES = [
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

const PurposeSelect = props => {

  const selectedOption = props.content ?
    PURPOSES.find(p => p.value === props.content) : null;

  return (
    <div class="r6o-purposedropdown">
      <Select
        value={selectedOption}
        onChange={props.onChange}
        options={PURPOSES}
        isDisabled={!props.editable}
      />
    </div>
  );

}

export default PurposeSelect;