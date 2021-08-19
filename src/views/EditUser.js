import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { db } from '../firebase'
import Icon from '../components/Icon'
import { EditUserList } from '../components/EditUserList'
import { EditUserForm } from '../components/EditUserForm'

export const EditUser = (props) => {
  const [code, setCode] = useState('')
  const [users, setUsers] = useState([])
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    db.collection('users').onSnapshot((res) => {
      let users = []
      res.forEach((doc) => users.push({ ...doc.data(), id: doc.id }))
      setUsers(users)
    })
  }, [])

  return (
    <Container>
      <Header>
        <CstmLink to="/">
          <Icon icon="home" />
        </CstmLink>
        <h3>Edit User</h3>
      </Header>
      <Body>
        <EditUserList setError={setError} setUser={setUser} users={users} />
        <EditUserForm
          code={code}
          error={error}
          setCode={setCode}
          setError={setError}
          setUser={setUser}
          user={user}
        />
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
  justify-content: flex-start;
  align-items: center;
  width: 75%;
  height: 9vh;
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
const Body = styled.div`
  border: 1px solid white;
  border-radius: 15px;
  display: flex;
  height: 84vh;
  padding: 2vh;
  width: 75%;
  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`
