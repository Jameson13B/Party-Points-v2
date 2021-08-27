import React, { useReducer, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { db } from '../firebase'

const reducer = (state, action) => {
  switch (action.type) {
    case 'form_update':
      return { ...state, form: action.payload.form, feedback: action.payload.feedback || null }
    case 'set_items':
      return { ...state, items: action.payload }
    case 'set_display':
      return { ...state, display: action.payload, form: initialState.form }
    case 'set_feedback':
      return { ...state, feedback: action.payload }
    default:
      return { ...state }
  }
}
const initialState = {
  items: [],
  feedback: null,
  display: 'positive',
  form: {
    id: '',
    points: '',
    title: '',
  },
}

export const Recognition = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  useEffect(() => {
    db.collection(state.display).onSnapshot((res) => {
      let items = []
      res.forEach((item) => items.push({ ...item.data(), id: item.id }))
      items.sort((a, b) => a.points > b.points)
      dispatch({ type: 'set_items', payload: items })
    })
  }, [state.display])

  const selectItem = (button) => dispatch({ type: 'form_update', payload: { form: button } })
  const handleSubmit = (e) => {
    e.preventDefault()

    if (!state.form.title || !state.form.points) {
      dispatch({ type: 'set_feedback', payload: 'Title and points cannot be blank' })
    } else if (state.form.id) {
      const item = {
        title: state.form.title,
        points: parseInt(state.form.points),
      }

      db.collection(state.display)
        .doc(state.form.id)
        .update(item)
        .then(() =>
          dispatch({
            type: 'form_update',
            payload: { form: initialState.form, feedback: initialState.feedback },
          }),
        )
        .catch(() => alert('Error Updating: Please try again'))
    } else {
      const item = {
        title: state.form.title,
        points: parseInt(state.form.points),
      }

      db.collection(state.display)
        .add(item)
        .then(() =>
          dispatch({
            type: 'form_update',
            payload: { form: initialState.form, feedback: initialState.feedback },
          }),
        )
        .catch(() => alert('Error Adding: Please try again'))
    }
  }
  const handleDelete = (e) => {
    e.preventDefault()

    db.collection(state.display)
      .doc(state.form.id)
      .delete()
      .then(() =>
        dispatch({
          type: 'form_update',
          payload: { form: initialState.form, feedback: initialState.feedback },
        }),
      )
      .catch(() => alert('Error Deleting: Please try again'))
  }

  return (
    <Container>
      <Header>
        <Title>
          <CstmLink to="/">
            <Icon icon="home" />
          </CstmLink>
          <h3>Recognition</h3>
        </Title>
        <div>
          <NavBtn
            active={state.display === 'positive'}
            onClick={() => dispatch({ type: 'set_display', payload: 'positive' })}
          >
            Positive
          </NavBtn>
          <NavBtn
            active={state.display === 'negative'}
            onClick={() => dispatch({ type: 'set_display', payload: 'negative' })}
          >
            Negative
          </NavBtn>
        </div>
      </Header>
      <Body>
        <ItemList>
          {state.items.map((item) => (
            <Item key={item.id} onClick={() => selectItem(item)}>
              <p>{item.title}</p>
              <p>{item.points}</p>
            </Item>
          ))}
        </ItemList>
        <Form>
          <FormA onSubmit={handleSubmit}>
            <Input
              name="points"
              value={state.form.points}
              placeholder="Points"
              onChange={(e) =>
                dispatch({
                  type: 'form_update',
                  payload: { form: { ...state.form, points: e.target.value } },
                })
              }
              autoComplete="off"
            />
            <Input
              name="title"
              value={state.form.title}
              placeholder="Title"
              onChange={(e) =>
                dispatch({
                  type: 'form_update',
                  payload: { form: { ...state.form, title: e.target.value } },
                })
              }
              autoComplete="off"
            />
            <CreateBtn onClick={handleSubmit}>{state.form.id ? 'Update' : 'Create'}</CreateBtn>
          </FormA>
          <FormB>
            {state.form.id && (
              <DeleteBtn onClick={handleDelete}>
                <p>Delete</p>
              </DeleteBtn>
            )}
          </FormB>
        </Form>
      </Body>
    </Container>
  )
}

const Container = styled.div`
  align-items: center;
  background-color: #282c34;
  color: white;
  display: flex;
  flex-direction: column;
  font-size: calc(10px + 2vmin);
  min-height: 100vh;
  text-align: center;
`
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 75%;
  height: 9vh;
`
const Title = styled.div`
  display: flex;
  align-items: center;
`
const CstmLink = styled(Link)`
  text-decoration: none;
  color: white;
  vertical-align: middle;
  margin-right: 15px;
  :hover {
    color: #bbb;
  }
`
const NavBtn = styled.button`
  align-self: center;
  background: ${(props) => (props.active ? '#444' : 'transparent')};
  border: 1px solid white;
  border-radius: 15px;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 10px;
  margin: 10px 0 10px 10px;
  :hover {
    background: #444;
  }
  @media (max-width: 500px) {
    font-size: 0.75rem;
    padding: 5px;
  }
`
const Body = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid white;
  border-radius: 15px;
  height: 84vh;
  padding: 2vh;
  width: 75%;
`
const ItemList = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  height: 75%;
  overflow: auto;
  @media (max-width: 500px) {
    width: 100%;
  }
`
const Item = styled.div`
  border: 1px solid white;
  border-radius: 15px;
  flex-shrink: 0;
  margin-bottom: 15px;
  padding: 10px;
  text-align: center;
  width: 45%;
  :last-child {
    margin-bottom: 0;
  }
  :hover {
    background: #444;
  }
  p {
    font-size: 25px;
    margin: 13px 0;
  }
  @media (max-width: 500px) {
    box-sizing: border-box;
    width: 100%;
  }
`
const Form = styled.form`
  display: flex;
  flex-grow: 1;
  border-top: 3px dotted white;
  margin-top: 15px;
`
const FormA = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 75%;
`
const FormB = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-grow: 1;
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
  padding-left: 15px;
  :focus {
    outline: none;
  }
`
const CreateBtn = styled.button`
  background: transparent;
  border: 1px solid white;
  border-radius: 15px;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 15px;
  margin: 15px 0;
  @media (max-width: 500px) {
    font-size: 1rem;
  }
`
const DeleteBtn = styled.button`
  background: transparent;
  border: 1px solid white;
  border-radius: 15px;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 15px;
  margin: 15px 0;
  @media (max-width: 500px) {
    font-size: 1rem;
    padding: 10px;
    p {
      text-orientation: upright;
      writing-mode: vertical-rl;
    }
  }
`
