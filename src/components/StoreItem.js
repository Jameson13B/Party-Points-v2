import React from 'react'
import styled from 'styled-components'
import Icon from './Icon'

export const StoreItem = (props) => {
  return (
    <Item onClick={props.onClick}>
      <Icon icon="local_atm" />
      <Details>
        <Title>{props.item.title}</Title>
        <Description>{props.item.description}</Description>
      </Details>
      <Amount>${props.item.amount}</Amount>
    </Item>
  )
}

const Item = styled.div`
  align-items: center;
  display: flex;
  border: 1px solid white;
  border-radius: 15px;
  padding: 15px;
  margin: 15px 0;
  width: 40%;
  cursor: pointer;
  :hover {
    background: #444;
  }
  @media (max-width: 500px) {
    width: 90%;
  }
`
const Details = styled.div`
  flex-grow: 2;
  margin: 0 1rem;
`
const Title = styled.p`
  font-size: 1.25rem;
  margin: 0;
`
const Description = styled.p`
  font-size: 0.75rem;
  font-style: italic;
  margin: 0;
`
const Amount = styled.p`
  font-size: 1.5rem;
  margin: 0;
`
