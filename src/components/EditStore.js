import React, { useReducer, useEffect } from 'react'
import styled from 'styled-components'
import { db } from '../firebase'
import { InventoryItem } from './InventoryItem.js'

const reducer = (state, action) => {
  switch (action.type) {
    case 'form_update':
      return {
        ...state,
        [action.payload.name]: action.payload.value,
        feedback: action.payload.feedback || null,
      }
    case 'set_items':
      return { ...state, items: action.payload }
    case 'select_item':
      const item = {
        title: action.payload.title,
        description: action.payload.description,
        amount: action.payload.amount,
        id: action.payload.id,
        creating: false,
        index: action.payload.index,
      }
      return { ...state, ...item }
    case 'reset_form':
      return { ...initialState, items: state.items }
    case 'set_feedback':
      return { ...state, feedback: action.payload }
    default:
      return { ...state }
  }
}
const initialState = {
  items: [],
  creating: true,
  feedback: null,
  title: '',
  description: '',
  amount: '',
  id: '',
  index: '',
}

export const EditStore = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    db.collection('inventory').onSnapshot((res) => {
      let items = []
      res.forEach((doc) => items.push({ ...doc.data(), id: doc.id }))
      items.sort((a, b) => (a.title > b.title ? 1 : -1))
      dispatch({ type: 'set_items', payload: items })
    })
  }, [])

  const handleInputChange = (e) =>
    dispatch({ type: 'form_update', payload: { name: e.target.name, value: e.target.value } })
  const createItem = (newItem) => {
    const { title, amount } = state
    if (!title || !amount)
      return dispatch({ type: 'set_feedback', payload: 'Missing title or amount' })
    if (isNaN(amount)) return dispatch({ type: 'set_feedback', payload: 'Amount must be a number' })

    db.collection('inventory')
      .add(newItem)
      .then(() => dispatch({ type: 'reset_form' }))
      .catch((feedback) => dispatch({ type: 'set_feedback', payload: feedback }))
  }
  const deleteItem = (id) =>
    db
      .collection('inventory')
      .doc(id)
      .delete()
      .then(() => dispatch({ type: 'reset_form' }))
      .catch((feedback) => dispatch({ type: 'set_feedback', payload: feedback }))

  const updateItem = (newItem) => {
    const { title, amount } = state
    if (!title || !amount)
      return dispatch({ type: 'set_feedback', payload: 'Missing title or amount' })
    if (isNaN(amount)) return dispatch({ type: 'set_feedback', payload: 'Amount must be a number' })

    db.collection('inventory')
      .doc(newItem.id)
      .update(newItem)
      .then(() => dispatch({ type: 'reset_form' }))
      .catch((feedback) => dispatch({ type: 'set_feedback', payload: feedback }))
  }

  return (
    <Container>
      <ItemList>
        {state.items.map((item, i) => (
          <InventoryItem
            item={item}
            key={item.id}
            index={i}
            handleClick={(item) => dispatch({ type: 'select_item', payload: item })}
          />
        ))}
      </ItemList>
      <Form
        onSubmit={(e) => {
          e.preventDefault()
          const newItem = {
            title: state.title,
            description: state.description,
            amount: parseInt(state.amount),
            id: state.id,
          }
          state.creating ? createItem(newItem) : updateItem(newItem)
        }}
        autoComlete="none"
      >
        <Input
          name="title"
          type="text"
          value={state.title}
          placeholder="Item Title"
          onChange={handleInputChange}
        />
        <Input
          name="description"
          type="text"
          value={state.description}
          placeholder="Item Description"
          onChange={handleInputChange}
        />
        <Input
          name="amount"
          type="text"
          value={state.amount}
          placeholder="Item Amount"
          onChange={handleInputChange}
        />
        {state.creating ? (
          <SubmitBtn type="submit" width="100%">
            Create Item
          </SubmitBtn>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <SubmitBtn type="submit" width="48%">
              Update Item
            </SubmitBtn>
            <SubmitBtn
              onClick={(e) => {
                e.preventDefault()
                deleteItem(state.id)
              }}
              width="48%"
            >
              Delete Item
            </SubmitBtn>
          </div>
        )}
        {state.feedback ? <Feedback>{state.feedback}</Feedback> : null}
      </Form>
    </Container>
  )
}

const Container = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  height: 70vh;
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`
const ItemList = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 60%;
  overflow: auto;
`
const Form = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 40%;
`
const Input = styled.input`
  background: transparent;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  border-bottom: 1px solid white;
  color: white;
  font-size: 1.25rem;
  margin: 15px 0;
  :focus {
    outline: none;
  }
`
const SubmitBtn = styled.button`
  background: transparent;
  border: 1px solid white;
  border-radius: 15px;
  color: white;
  cursor: pointer;
  display: inline;
  font-size: 1.5rem;
  padding: 15px;
  margin: 15px 0;
  width: ${(props) => props.width}
  :hover {
    background: #444;
  }
`
const Feedback = styled.p`
  color: red;
  font-size: 1rem;
  margin: 0;
  text-align: center;
`
