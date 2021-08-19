import React from 'react'
import styled from 'styled-components'

export const InventoryItem = (props) => {
  return (
    <Container
      data-index={props.index}
      data-id={props.item.id}
      onClick={(e) =>
        props.handleClick({
          title: props.item.title,
          description: props.item.description,
          amount: props.item.amount,
          id: props.item.id,
          index: props.index,
        })
      }
    >
      <Title>{props.item.title}</Title>
      <Description>{props.item.description}</Description>
      <Amount>{props.item.amount}</Amount>
    </Container>
  )
}

const Container = styled.div`
  border: 1px solid white;
  border-radius: 15px;
  flex-shrink: 0;
  margin-bottom: 15px;
  max-width: 550px;
  padding: 10px;
  text-align: center;
  width: 100%;
  :last-child {
    margin-bottom: 0;
  }
  :hover {
    background: #444;
  }
  p {
    margin: 10px 0;
  }
`
const Title = styled.p`
  font-size: 1.5rem;
`
const Description = styled.p`
  font-size: 1rem;
  font-style: italic;
`
const Amount = styled.p`
  font-size: 1.5rem;
`
