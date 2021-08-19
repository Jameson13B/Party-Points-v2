import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { db } from '../firebase'

export const EditUserForm = (props) => {
  const { code, error, setCode, setError, setUser, user } = props
  const [form, setForm] = useState({
    name: '',
    username: '',
    track: '',
  })

  useEffect(() => {
    user && setForm({ name: user.name, username: user.username, track: user.track })
  }, [user])

  const handleInputChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const updateUser = (e) => {
    e.preventDefault()
    db.collection('users')
      .doc(user.id)
      .update(form)
      .then(() => {
        setError(`Updated ${user.name}`)
        setUser(null)
        setForm({ name: '', username: '', track: '' })
      })
      .catch(() => setError('Failed to update user'))
  }
  const updateCode = (e) => {
    e.preventDefault()
    if (!user) {
      return setError('Select a user first')
    }

    db.collection('users')
      .doc(user.id)
      .update({ code })
      .then(() => {
        setError(`Updated ${user.name}'s passworrd`)
        setUser(null)
        setForm({ name: '', username: '', track: '' })
        setCode('')
      })
      .catch(() => setError('Failed to change password'))
  }

  return (
    <Container>
      <Form onSubmit={updateUser} autoComplete="none">
        <Input
          name="name"
          type="text"
          value={form.name}
          placeholder="Students Name"
          onChange={handleInputChange}
        />
        <Input
          name="username"
          type="text"
          value={form.username}
          placeholder="Students Username"
          onChange={handleInputChange}
        />
        <Input
          name="track"
          type="text"
          value={form.track}
          placeholder="Class Name"
          onChange={handleInputChange}
        />
        <UpdateButton type="submit">Update</UpdateButton>
      </Form>

      <Form onSubmit={updateCode} autoComplete="none">
        <Input
          name="code"
          type="password"
          value={code}
          placeholder="New Password"
          onChange={(e) => setCode(e.target.value)}
        />
        <UpdateButton type="submit">Update</UpdateButton>
      </Form>

      {error && <Feedback>{error}</Feedback>}
    </Container>
  )
}

const Container = styled.div`
  flex: 1;
  display: flex,
  flex-direction: column;
`
const Form = styled.form`
  display: flex;
  flex-direction: column;
  &:last-of-type {
    border-top: 2px dashed white;
  }
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
  &:last-of-type {
    margin-bottom: 0;
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`
const UpdateButton = styled.button`
  background: transparent;
  border: 1px solid white;
  border-radius: 15px;
  color: white;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 15px;
  margin: 5px 0 15px 0;
  :hover {
    background: #444;
  }
  @media (max-width: 768px) {
    padding: 10px;
  }
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`
const Feedback = styled.p`
  color: red;
  font-size: 1rem;
  margin-top: 5px;
`
