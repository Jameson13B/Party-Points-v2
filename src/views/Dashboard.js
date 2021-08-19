import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { db } from '../firebase'
import { UserSummary } from '../components/UserSummary'
import Icon from '../components/Icon'

export const Dashboard = (props) => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    db.collection('users').onSnapshot((res) => {
      let users = []
      res.forEach((doc) => {
        if (doc.data().track !== 'Teacher') users.push({ ...doc.data(), id: doc.id })
      })
      setUsers(users)
    })
  }, [])

  return (
    <Container>
      <Header>
        <CstmLink
          to="/teacher-portal"
          // onClick={() => localStorage.removeItem('PP:dashboardFilter')}
        >
          <Icon icon="home" />
        </CstmLink>
        <h3>Dashboard</h3>
        {/* <Select onChange={this.handleFilterChange} value={this.state.track}>
          <option value="All">All</option>
          {classes.map((clas, i) => (
            <option value={clas} key={i}>
              {clas.charAt(0).toUpperCase() + clas.slice(1)}
            </option>
          ))}
        </Select> */}
        <NavBtn to="/recognition">Edit Recognition</NavBtn>
      </Header>
      <UserList>
        {/* If class is filtered show class button */}
        {/* {this.state.track !== 'All' && ( */}
        <UserSummary
          user={{
            id: `Main Class`,
            name: `Main Class`,
            balance: 0,
            active: true,
          }}
        />
        {/* )} */}
        {/* List all users for current filter */}
        {users
          .sort((a, b) => {
            return a.name > b.name ? 1 : -1
          })
          .map((user) => (
            <UserSummary key={user.id} user={user} />
          ))}
      </UserList>
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
`
const Header = styled.div`
  align-items: center;
  display: flex;
  height: 9vh;
  justify-content: flex-start;
  width: 75%;
`
// const Select = styled.select`
//   background: #444;
//   border-bottom: 1px solid white;
//   border-left: 0;
//   border-right: 0;
//   border-top: 0;
//   color: white;
//   font-size: 1rem;
//   margin-left: 15px;
//   :focus {
//     outline: none;
//   }
//   option {
//     text-transform: uppercase;
//   }
// `
const NavBtn = styled(Link)`
  align-self: center;
  background: transparent;
  border: 1px solid white;
  border-radius: 15px;
  color: white;
  cursor: pointer;
  font-size: 0.75rem;
  padding: 7px;
  margin: 7px 0 7px 15px;
  text-decoration: none;
  :hover {
    background: #444;
  }
`
const UserList = styled.div`
  align-content: flex-start;
  border: 1px solid white;
  border-radius: 15px;
  display: flex;
  flex-wrap: wrap;
  height: 84vh;
  justify-content: space-evenly;
  overflow: auto;
  padding: 2vh;
  width: 75%;
`
const CstmLink = styled(Link)`
  color: white;
  margin: 0 10px;
  text-decoration: none;
  vertical-align: middle;
  :hover {
    color: #bbb;
  }
`
