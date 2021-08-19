import React from 'react'
import styled from 'styled-components'
import { db } from '../firebase'
import { getInitials } from '../utils'
import Icon from '../components/Icon'
import { confirmAlert } from 'react-confirm-alert'
import './alert.css'

export const EditUserList = (props) => {
  const { setError, setUser, users } = props

  const handleDeleteUser = (id, name) => {
    db.collection('users')
      .doc(id)
      .delete()
      .then(() => {
        setError(`Successfully deleted ${name}`)
        setUser(null)
      })
      .catch(() => setError(`Failed to delete ${name}`))
  }

  return (
    <List>
      {users
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((user) => (
          <User key={user.id} id={user.id} name={user.name} onClick={() => setUser(user)}>
            <Initials>{getInitials(user)}</Initials>
            <Name>{user.name.substring(0, 20)}</Name>
            <CustomIcon
              icon="delete"
              onClick={(e) => {
                e.stopPropagation()
                confirmAlert({
                  title: 'Delete Student?',
                  message: `Are you sure you want to delete ${user.name}? This cannot be undone.`,
                  buttons: [
                    {
                      label: 'Yes',
                      onClick: () => handleDeleteUser(user.id, user.name),
                    },
                    {
                      label: 'No',
                      onClick: () => {},
                    },
                  ],
                })
              }}
              size="1.5"
            />
          </User>
        ))}
    </List>
  )
}

const List = styled.ul`
  flex: 1.5;
  height: 100%;
  list-style: none;
  padding-left: 0;
  margin: 5px 0 0 0;
  overflow: auto;
  @media (max-width: 600px) {
    flex: auto;
    height: 40%;
  }
`
const User = styled.li`
  display: flex;
  align-items: center;
  border: 1px solid white;
  border-radius: 15px;
  padding: 2% 0;
  margin: 0 0 5% 0;
  cursor: pointer;
  line-height: 200%;
  width: 96%;
  :hover {
    background: #444;
  }
`
const Initials = styled.h1`
  font-size: 2.5rem;
  margin: auto 25px;
  @media (max-width: 600px) {
    font-size: 2rem;
  }
`
const Name = styled.h1`
  flex: 3;
  text-align: left;
  font-size: 1rem;
  white-space: nowrap;
  overflow: hidden;
`
const CustomIcon = styled(Icon)`
  margin: 0 5%;
  :hover {
    color: red;
  }
`
