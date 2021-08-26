import React, { useState, useEffect } from 'react'
import { db, serverTimestamp, statusUtil } from '../firebase'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { StoreItem } from '../components/StoreItem'
import Icon from '../components/Icon'
import { confirmAlert } from 'react-confirm-alert'
import '../components/alert.css'

export const Shopping = (props) => {
  const [user, setUser] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [items, setItems] = useState([])

  useEffect(() => {
    const curUser = statusUtil()

    if (!curUser) {
      props.history.push('/login')
    } else if (curUser.track === 'Teacher') {
      props.history.push('/student-portal')
    } else {
      db.collection('users')
        .doc(curUser.id)
        .onSnapshot((res) => {
          setUser({ ...res.data(), id: res.id })
        })
    }

    db.collection('inventory').onSnapshot((res) => {
      let items = []
      res.forEach((doc) => items.push({ ...doc.data(), id: doc.id }))
      setItems(items)
    })
  }, [props.history])

  const handlePurchase = (item) => {
    if (item.amount > user.balance) {
      setFeedback('Error: Not enough Party Points')
    } else {
      // Set date to 1am this morning
      let date = new Date()
      date.setHours(0, 0, 1, 0)
      const userRef = db.collection('users').doc(user.id)
      const logRef = db.collection('log').doc()
      const purchasesRef = db.collection('purchases').doc()
      const batch = db.batch()

      db.collection('purchases')
        .where('postedBy.id', '==', user.id)
        .where('date', '>=', date)
        .get()
        .then((res) => {
          res.forEach((doc) => {
            if (doc.exists && doc.data().description.includes(item.title)) {
              alert(`You can only buy 1 ${item.title} each day.`)
            } else {
              // If allowed, update the users balance, add purchase to the log,
              // and create the purchase
              batch.update(userRef, { balance: user.balance - item.amount })
              batch.set(logRef, {
                change: item.amount,
                description: item.title,
                user: user.id,
                balance: user.balance - item.amount,
                date: serverTimestamp(),
              })
              batch.set(purchasesRef, {
                change: item.amount,
                description: `Purchased ${item.title}`,
                date: serverTimestamp(),
                postedBy: { id: user.id, name: user.name },
                claimed: false,
                itemId: item.id,
              })

              batch
                .commit()
                .then(() => {
                  setUser({ ...user, balance: user.balance - item.amount })
                  setFeedback(`Successfully purchased ${item.title}`)
                })
                .catch((err) => {
                  console.log(err)
                  setFeedback('Error: Please try again')
                })
            }
          })
        })
    }
  }

  if (!user) {
    return (
      <Container>
        <h1>Loading</h1>
      </Container>
    )
  }

  return (
    <Container>
      <Header>
        <CstmLink to="/student-portal">
          <Icon icon="home" />
        </CstmLink>
        <h3>Shopping</h3>
        <CurBal>Balance - ${user.balance}</CurBal>
      </Header>
      <ItemList>
        {feedback ? <Feedback>{feedback}</Feedback> : null}
        {items.map((item) => (
          <StoreItem
            key={item.id}
            item={item}
            onClick={() =>
              confirmAlert({
                title: 'Purchase Item?',
                message: `Are you sure you want to purchase a ${item.title}? This cannot be undone.`,
                buttons: [
                  {
                    label: 'Yes',
                    onClick: () => handlePurchase(item),
                  },
                  {
                    label: 'No',
                    onClick: () => setFeedback(null),
                  },
                ],
              })
            }
          />
        ))}
      </ItemList>
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
const CstmLink = styled(Link)`
  color: white;
  margin: 0 10px;
  text-decoration: none;
  vertical-align: middle;
  :hover {
    color: #bbb;
  }
`
const CurBal = styled.h5`
  flex-grow: 2;
  text-align: right;
`
const ItemList = styled.div`
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
const Feedback = styled.p`
  color: red;
  font-size: 1rem;
  font-style: italic;
  margin: 0 0 0 1.5rem;
  text-align: center;
  width: 100%;
`
