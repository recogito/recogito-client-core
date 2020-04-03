import React from 'react';

/** 
 * The basic Place/Person/Event selector from original Recogito
 */
const TypeSelectorWidget = props => {

  const onSelect = type => _ => {
    props.onSelect && props.onSelect(type);
  }

  return (
    <div className="type-selector">
      <div className="type place" onClick={onSelect('PLACE')}>
        <span className="icon">{'\uf041'}</span> Place
      </div>

      <div className="type person" onClick={onSelect('PERSON')}>
        <span className="icon">{'\uf007'}</span> Person
      </div>

      <div className="type event" onClick={onSelect('EVENT')}>
        <span className="icon">{'\uf005'}</span> Event
      </div>
    </div>
  )

}

export default TypeSelectorWidget;