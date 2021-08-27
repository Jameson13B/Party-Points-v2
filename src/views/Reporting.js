import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import moment from 'moment-timezone'
import { db } from '../firebase'

export const Reporting = (props) => {
  const [students, setStudents] = useState([])
  const [logs, setLogs] = useState([])
  const [student, setStudent] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')

  useEffect(() => {
    db.collection('users').onSnapshot((res) => {
      let students = []
      res.forEach((doc) => students.push({ ...doc.data(), id: doc.id }))
      setStudents(students)
    })
  }, [])
  useEffect(() => {
    if (student) {
      db.collection('log')
        .where('user', '==', student)
        .onSnapshot((res) => {
          let logs = []
          res.forEach((doc) => logs.push({ ...doc.data(), id: doc.id }))
          setLogs(logs)
        })
    }
  }, [student])

  return (
    <Container>
      <View>
        {/* Header */}
        <Header>
          <CstmLink to="/">
            <Icon icon="home" />
          </CstmLink>
          <Title>Reporting</Title>
          {/* Student Dropodown */}
          <Select onChange={(e) => setStudent(e.target.value)} value={student}>
            <option value="">Select Student</option>
            {students
              .filter((student) => student.track !== 'Teacher')
              .map((student) => (
                <option value={student.id} key={student.id}>
                  {student.name}
                </option>
              ))}
          </Select>
          {/* Start Date */}
          <DateLabel>Start: </DateLabel>
          <DateInput
            type="date"
            name="start"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
          {/* End Date */}
          <DateLabel>End: </DateLabel>
          <DateInput type="date" name="end" value={end} onChange={(e) => setEnd(e.target.value)} />
        </Header>
        {/* Body */}
        <Body>
          {/* If log is empty return 'nothing to show' */}
          {logs.length === 0 && <Entry>Nothing to show yet...</Entry>}
          {logs
            .filter((log) =>
              start && end
                ? log.date.toMillis() > moment(start).format('x') &&
                  log.date.toMillis() <= moment(end + ' 23:59:59').format('x')
                : true,
            )
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((log) => {
              const date = moment(log.date.toDate())
              // If there is only the default change return 'select student'
              return !log.change ? (
                <Entry key={log.id}>
                  <p>Select Student Above</p>
                </Entry>
              ) : (
                // Else if there is a log with change, create an Entry for each
                <Entry key={log.id}>
                  <p>{log.change}</p>
                  <p>{log.description}</p>
                  <p>{date.tz('America/Boise').format('l LT')}</p>
                </Entry>
              )
            })}
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
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  width: 75%;
  height: 9vh;
  @media (max-height: 675px) {
    height: 20vh;
  }
`
const CstmLink = styled(Link)`
  text-decoration: none;
  color: white;
  vertical-align: middle;
  margin-right: 15px;
  :hover {
    color: #bbb;
  }
  @media (max-height: 675px) {
    width: 10%;
  }
`
const Title = styled.h3`
  @media (max-height: 675px) {
    width: 25%;
  }
`
const Select = styled.select`
  background: #444;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  border-bottom: 1px solid white;
  color: white;
  font-size: 1rem;
  margin-left: 15px;
  :focus {
    outline: none;
  }
  option {
    text-transform: uppercase;
  }
  @media (max-height: 675px) {
    width: 50%;
  }
`
const DateInput = styled.input`
  background: #444;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  border-bottom: 1px solid white;
  border-radius: 5px;
  color: white;
  font-size: 1rem;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  margin-left: 5px;
  :focus {
    outline: none;
  }
  @media (max-height: 675px) {
    width: 100%;
  }
`
const DateLabel = styled.h1`
  margin-left: 20px;
  font-size: 1.25rem;
`
const Body = styled.div`
  border: 1px solid white;
  border-radius: 15px;
  height: 84vh;
  padding: 2vh;
  width: 75%;
  overflow: auto;
  @media (max-height: 675px) {
    height: 75vh;
  }
`
const Entry = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border-top: 1px solid white;
  :last-child {
    border-bottom: 1px solid white;
  }
`
