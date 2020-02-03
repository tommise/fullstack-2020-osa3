import React from 'react'

const Persons = ({ id, name, number, removeName }) => {

  return (
    <li>
      {name} {number}
      <button type='submit' value={name} onClick={removeName} id={id}>delete</button>
    </li>
  )
}

export default Persons