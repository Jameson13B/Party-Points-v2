import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

import { db } from '../firebase'
import { PosBtnList } from '../components/PosBtnList'
import { NegBtnList } from '../components/NegBtnList'
import Icon from '../components/Icon'

export const Profile = (props) => {
  const [positive, togglePositive] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    db.collection('users')
      .doc(props.match.params.id)
      .onSnapshot((res) => setUser({ ...res.data(), id: res.id }))
  })

  if (props.match.params.id.includes('Class')) {
    return (
      <Container>
        <View>
          <Header>
            <CstmLink to="/dashboard">
              <Icon icon="arrow_back" />
            </CstmLink>
            <h4>Profile</h4>
          </Header>
          <Body>
            <Name>{props.match.params.id}</Name>
            <Item>Add/Remove points for the entire {props.match.params.id}</Item>
            <BtnPanel>
              <Btn onClick={() => togglePositive(true)} className={positive && 'active'}>
                Positive
              </Btn>
              <Btn onClick={() => togglePositive(false)} className={!positive && 'active'}>
                Needs Improvement
              </Btn>
            </BtnPanel>
            {positive ? (
              <PosBtnList id={props.match.params.id} history={props.history} />
            ) : (
              <NegBtnList id={props.match.params.id} history={props.history} />
            )}
          </Body>
        </View>
      </Container>
    )
  }

  return (
    <Container>
      <View>
        <Header>
          <CstmLink to="/dashboard">
            <Icon icon="arrow_back" />
          </CstmLink>
          <h3>Profile</h3>
        </Header>
        <Body>
          {!user ? (
            <h2>Loading...</h2>
          ) : (
            <React.Fragment>
              <Name>{user.name}</Name>
              <Item>Balance: {user.balance}</Item>
              <Item>{user.username}</Item>
              <BtnPanel>
                <Btn onClick={() => togglePositive(true)} className={positive && 'active'}>
                  Positive
                </Btn>
                <Btn onClick={() => togglePositive(false)} className={!positive && 'active'}>
                  Needs Improvement
                </Btn>
              </BtnPanel>
              {positive ? (
                <PosBtnList id={user.id} history={props.history} />
              ) : (
                <NegBtnList id={user.id} history={props.history} />
              )}
            </React.Fragment>
          )}
        </Body>
      </View>
    </Container>
  )
}

const Container = styled.div`
  background-color: #282c34;
  font-size: calc(10px + 2vmin);
  color: white;
`
const View = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
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
  height: 86vh
  overflow: auto;
  padding: 1vh 2vw;
  text-align: center;
  width: 75%;
`
const Name = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  line-height: 100%;
  margin: 5px 0 10px 0;
`
const Item = styled.p`
  margin: 10px 0;
  font-size: 1.5rem;
`
const BtnPanel = styled.div`
  display: flex;
  width: 40%;
  margin: 20px auto 0 auto;
  @media (max-width: 768px) {
    width: 100%;
  }
`
const Btn = styled.div`
  border: 1px solid white;
  border-radius: 15px;
  font-weight: bold;
  padding: 15px;
  cursor: pointer;
  font-size: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  :hover {
    background: #444;
  }
  :nth-child(1) {
    margin-right: 15px;
  }
  &.active {
    background: #444;
  }
`
