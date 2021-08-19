import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import moment from 'moment-timezone'
import { db } from '../firebase'

export const PurchaseLog = (props) => {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    // Set date to 1am this morning
    let date = new Date()
    date.setHours(0, 0, 1, 0)

    db.collection('purchases')
      .where('date', '>=', date)
      .orderBy('date', 'desc')
      .onSnapshot((res) => {
        let logs = []
        res.forEach((doc) => {
          logs.push({ ...doc.data(), id: doc.id })
        })
        setLogs(logs)
      })
  }, [])

  return (
    <Container>
      {logs.map((log) => {
        const date = moment(log.date.toDate())

        return (
          <Entry key={log.id}>
            <p>{log.postedBy.name}</p>
            <p>
              {log.description} - {log.change}
            </p>
            <p>{date.tz('America/Boise').format('MMM Do, LT')}</p>
          </Entry>
        )
      })}
    </Container>
  )
}

const Container = styled.div`
  padding: 10px 0;
  display: flex;
  flex-direction: column;
  height: 70vh;
  overflow: auto;
`
const Entry = styled.div`
  display: flex;
  font-size: 1.5rem;
  justify-content: space-between;
  padding: 15px 10px;
  border-top: 1px solid white;
  p {
    margin: 5px 0;
  }
  :last-child {
    border-bottom: 1px solid white;
  }
  @media (max-width: 768px) {
    align-items: center;
    flex-direction: column;
    font-size: 1rem;
  }
`
