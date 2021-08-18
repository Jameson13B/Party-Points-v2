import React, { useEffect, useState } from 'react'
import { db, statusUtil } from '../firebase'
import styled from 'styled-components'

export const Register = (props) => {
  const [state, setState] = useState({ username: '', code: '', track: '', name: '', error: null })

  useEffect(() => {
    const curUser = statusUtil()

    if (!curUser) {
      props.history.push('/login')
    } else if (curUser && curUser.track !== 'Teacher') {
      props.history.push('/student-portal')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleRegister = (e) => {
    e.preventDefault()
    // const registerUser = functions.httpsCallable('registerUser')

    if (!state.username || !state.code || !state.track || !state.name) {
      return setState({ ...state, error: 'Missing Required Fields' })
    }

    db.collection('users')
      .add({
        name: state.name,
        username: state.username,
        track: state.track,
        code: state.code,
        balance: 0,
        active: true,
      })
      .then((docRef) =>
        setState({
          username: '',
          code: '',
          track: '',
          name: '',
          error: `Successfully added ${state.name}!`,
        }),
      )
  }

  return (
    <Container>
      <Title>Power Points</Title>
      <Message>Register Here</Message>
      <Form>
        <Label>Name:</Label>
        <Input
          autoComplete="off"
          type="text"
          id="name"
          value={state.name}
          onChange={(e) => setState({ ...state, name: e.target.value })}
        />
        <Label>Class:</Label>
        <Input
          autoComplete="off"
          type="text"
          id="track"
          value={state.track}
          onChange={(e) => setState({ ...state, track: e.target.value })}
        />
        <Label>Email:</Label>
        <Input
          autoComplete="off"
          type="text"
          id="username"
          value={state.username}
          onChange={(e) => setState({ ...state, username: e.target.value })}
        />
        <Label>Password:</Label>
        <Input
          autoComplete="off"
          type="password"
          id="code"
          value={state.code}
          onChange={(e) => setState({ ...state, code: e.target.value })}
        />
        <Button onClick={handleRegister}>Register</Button>
        {state.error ? <Feedback>{state.error}</Feedback> : null}
        <DashboardLink onClick={() => props.history.push('/teacher-portal')}>
          Go To Portal
        </DashboardLink>
      </Form>
    </Container>
  )
}

const Container = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  margin: 20px;
`
const Title = styled.h1`
  margin-bottom: 5px;
`
const Message = styled.p`
  margin: 10px 0;
`
const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  margin: 15px 0;
  max-width: 450px;
`
const Label = styled.label`
  margin-right: 5%;
  width: 20%;
`
const Input = styled.input`
  border-top: none;
  border-right: none;
  border-left: none;
  border-bottom: 1px solid lightgrey;
  margin-bottom: 20px;
  width: 70%;
`
const Button = styled.button`
  background: black;
  border-radius: 15px;
  color: white;
  padding: 10px 0;
  width: 100%;
`
const DashboardLink = styled.h1`
  color: black;
  font-size: 1rem;
  font-weight: normal;
  margin: 20px auto;
  text-decoration: none;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`
const Feedback = styled.p`
  color: red;
  font-size: 0.9rem;
  font-style: italic;
  font-weight: bold;
  margin-bottom: 0px;
  margin-top: 14px;
  text-align: center;
  width: 100%;
`
