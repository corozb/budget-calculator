import { useState, useEffect } from 'react'
import uuid from 'uuid/v4'
import './App.css'

import Alert from './components/Alert'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'

// const initialExpenses = [
//   {
//     id: uuid(),
//     charge: 'rent',
//     amount: 1600,
//   },
//   {
//     id: uuid(),
//     charge: 'car payment',
//     amount: 400,
//   },
//   {
//     id: uuid(),
//     charge: 'credit card bill',
//     amount: 1200,
//   },
// ]

const initialExpenses = localStorage.getItem('expenses') ? JSON.parse(localStorage.getItem('expenses')) : []

function App() {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [charge, setCharge] = useState('')
  const [amount, setAmount] = useState('')
  const [alert, setAlert] = useState({ show: false })
  const [edit, setEdit] = useState(false)
  const [id, setId] = useState(0)

  const handleCharge = (e) => setCharge(e.target.value)
  const handleAmount = (e) => {
    let amount = e.target.value
    if (amount === '') {
      setAmount(amount)
    } else {
      setAmount(parseInt(amount))
    }
  }

  const handleAlert = ({ type, text }) => {
    setAlert({ show: true, type, text })
    setTimeout(() => {
      setAlert({ show: false })
    }, 3000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (charge !== '' && amount > 0) {
      if (edit) {
        let tempExpenses = expenses.map((item) => (item.id === id ? { ...item, charge, amount } : item))
        setExpenses(tempExpenses)
        setEdit(false)
        handleAlert({ type: 'success', text: 'item edited' })
      } else {
        const singleExpense = { id: uuid(), charge, amount: amount }
        setExpenses([...expenses, singleExpense])
        handleAlert({ type: 'success', text: 'item added' })
      }
      setCharge('')
      setAmount('')
    } else {
      handleAlert({ type: 'danger', text: "charge can't be empty value and amount has to be bigger than zero" })
    }
  }

  const clearItems = () => {
    setExpenses([])
    handleAlert({ type: 'danger', text: 'all items deleted' })
  }

  const handleDelete = (id) => {
    let tempExpenses = expenses.filter((item) => item.id !== id)
    setExpenses(tempExpenses)
    handleAlert({ type: 'danger', text: 'item deleted' })
  }

  const handleEdit = (id) => {
    let expense = expenses.find((item) => item.id === id)
    let { charge, amount } = expense
    setCharge(charge)
    setAmount(amount)
    setEdit(true)
    setId(id)
  }

  const props = { charge, amount, handleCharge, handleAmount, handleSubmit, edit }

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses))
  }, [expenses])

  return (
    <>
      {alert.show && <Alert type={alert.type} text={alert.text} />}
      <h1>budget calculator</h1>
      <main className='App'>
        <ExpenseForm {...props} />
        <ExpenseList expenses={expenses} handleDelete={handleDelete} handleEdit={handleEdit} clearItems={clearItems} />
      </main>
      <h1>
        total spending: <span className='total'>$ {expenses.reduce((acc, curr) => (acc += curr.amount), 0)}</span>
      </h1>
    </>
  )
}

export default App
