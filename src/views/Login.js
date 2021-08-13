import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router'
import styled from 'styled-components'

import { auth, db } from '../firebase'

export const Login = (props) => {
  const [user, setUser] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    auth.onAuthStateChanged((logInUser) => {
      logInUser && setUser(logInUser)
    })
  }, [])

  const handleLogin = (e) => {
    // Validation
    e.preventDefault()
    if (!username || !password) setError('Username and Password Required')

    // Retrieve token
    db.collection('users')
      .where('username', '==', username)
      .where('password', '==', password)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((userObj) => {
          console.log(userObj.data())
          // Sign in with token
          auth
            .signInWithCustomToken(userObj.data().token)
            .then((user) =>
              props.history.push(
                userObj.data().track === 'Teacher' ? '/teacher-portal' : '/student-portal',
              ),
            )
            .catch((error) => setError(error.message))
        })
      })
  }

  if (user) {
    return <Redirect to={user.track === 'Teacher' ? '/teacher-portal' : '/student-portal'} />
  }

  return (
    <Container>
      <Title>Party Points</Title>
      <Message>Login Here</Message>
      <Form>
        <Label>Username:</Label>
        <Input
          autoComplete="off"
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Label>Password:</Label>
        <Input
          autoComplete="off"
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>Login</Button>
        {error && <Feedback>{error}</Feedback>}
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
const Feedback = styled.p`
  color: red;
  font-style: italic;
`
