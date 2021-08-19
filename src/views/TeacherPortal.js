import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { logoutUtil, statusUtil } from '../firebase'
import Icon from '../components/Icon'

export const TeacherPortal = (props) => {
  useEffect(() => {
    const curUser = statusUtil()

    if (!curUser) {
      props.history.push('/login')
    } else if (curUser.track !== 'Teacher') {
      props.history.push('/student-portal')
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Container>
      <Title>Party Points Teacher Page</Title>
      <BtnPanel>
        <IconBtn>
          <CstmLink to="/dashboard">
            <p>Dashboard</p>
            <Icon icon="dashboard" />
          </CstmLink>
        </IconBtn>
        <IconBtn>
          <CstmLink to="/reporting">
            <p>Reporting</p>
            <Icon icon="description" />
          </CstmLink>
        </IconBtn>
        <IconBtn>
          <CstmLink to="/store">
            <p>Store</p>
            <Icon icon="store" />
          </CstmLink>
        </IconBtn>
        <IconBtn>
          <CstmLink to="/recognition">
            <p>Recognition</p>
            <Icon icon="star" />
          </CstmLink>
        </IconBtn>
        <IconBtn>
          <CstmLink to="/edit-user">
            <p>Update User</p>
            <Icon icon="person" />
          </CstmLink>
        </IconBtn>
        <IconBtn>
          <CstmLink to="/register">
            <p>New User</p>
            <Icon icon="person_add" />
          </CstmLink>
        </IconBtn>
      </BtnPanel>
      <Logout
        onClick={() => {
          logoutUtil()
          props.history.push('/login')
        }}
      >
        Logout
      </Logout>
      <br />
    </Container>
  )
}

const Container = styled.div`
  align-items: center;
  background-color: #282c34;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
  a {
    margin: 30px auto;
  }
`
const Title = styled.h1`
  font-size: 2.5rem;
  margin: 30px auto;
  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`
const BtnPanel = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  width: 65%;
  @media (max-width: 600px) {
    width: 100%;
  }
`
const IconBtn = styled.div`
  border: 1px solid white;
  border-radius: 15px;
  cursor: pointer;
  margin-top: 15px;
  padding: 15px;
  text-align: center;
  width: 25%;
  :hover {
    background: #444;
  }
  i {
    display: block;
    padding: 15px;
  }
`
const CstmLink = styled(Link)`
  color: white;
  font-size: 1.25rem;
  text-decoration: none;
`
const Logout = styled.h1`
  margin: 20px auto;
  text-decoration: none;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`
