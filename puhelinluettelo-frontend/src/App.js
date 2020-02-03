
import React, { useState, useEffect } from 'react'
import Persons from './components/Persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Notification from './components/Notification'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterValue, setNewFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber
    }

    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      const confirmed = window.confirm(`Person ${existingPerson.name} already exists. Do you want to update the phonenumber?`)

      if (confirmed) {
        personService
          .update(existingPerson.id, { ...existingPerson, number: newNumber })
          .then(changedPerson => {
            setPersons(persons.map(person => person.id !== existingPerson.id ? person : changedPerson))
            setNewName('')
            setNewNumber('')

            setNotificationMessage(`${existingPerson.name}'s number has been modified.`)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
          })

          .catch(error => {
            setNotificationMessage(`Error: person ${existingPerson.name} has been already modified.`)
            setTimeout(() => {
              setNotificationMessage(null)
            }, 5000)
            setPersons(persons.filter(person => person.id !== existingPerson.id))
          })
      }

    } else {

      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')

          setNotificationMessage(`${returnedPerson.name} added.`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })
    }
  }

  const removeName = (event) => {
    event.preventDefault()

    const personId = event.target.id
    const name = event.target.value

    const confirmed = window.confirm(`Do you want to remove ${name}?`)

    if (confirmed) {
      personService
        .remove(personId)
        .then(() => {
          setPersons(persons.filter(person => person.id !== Number(personId)))
          setNotificationMessage(`${name} has been removed.`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
        })

        .catch(error => {
          setNotificationMessage(`Error: person ${name} has already been removed.`)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
          setPersons(persons.filter(person => person.id !== personId))
        })
    }
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }
  
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value.toLowerCase())
  }

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(filterValue))

  const rows = () =>
    filteredPersons.map(p => <Persons key={p.name} id={p.id} name={p.name} number={p.number} removeName={removeName} />)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} />
      <Filter filterValue={filterValue} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm addName={addName} newName={newName} newNumber={newNumber} handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />

      <h3>Numbers</h3>

      {rows()}
    </div>
  )
}

export default App


