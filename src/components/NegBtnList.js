import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { db, serverTimestamp } from '../firebase'

export const NegBtnList = (props) => {
  const [buttons, setButtons] = useState([])

  useEffect(() => {
    db.collection('negative').onSnapshot((res) => {
      let buttons = []
      res.forEach((doc) => buttons.push({ ...doc.data(), id: doc.id }))
      // Sort buttons by point amount
      buttons.sort((a, b) => (a.points > b.points ? 1 : -1))
      setButtons(buttons)
    })
  })

  const handleClassRemove = (e, button) => {
    e.preventDefault()

    if (isNaN(button.points)) {
      alert('This buttons point value is not a number')
    } else {
      const logRef = db.collection('log').doc()

      db.collection('users')
        .where('track', '==', props.id.split(' ')[0])
        .where('active', '==', true)
        .get()
        .then((res) => {
          res.docs.forEach((doc) => {
            const docRef = db.collection('users').doc(doc.id)

            docRef
              .update({
                balance: doc.data().balance - button.points,
              })
              .catch((err) => {
                throw err
              })

            logRef.set({
              change: -button.points,
              description: button.title,
              user: doc.id,
              balance: doc.data().balance - button.points,
              date: serverTimestamp(),
            })
          })
          props.history.replace('/dashboard')
        })
        .catch((err) => {
          console.log(err)
          alert(err)
        })
    }
  }
  const handleStudentRemove = (e, button) => {
    if (isNaN(button.points)) {
      alert('This buttons point value is not a number')
    } else {
      // Add Points to User
      const logRef = db.collection('log').doc()
      const userRef = db.collection('users').doc(props.id)

      db.runTransaction((transaction) => {
        return transaction.get(userRef).then((user) => {
          const newBalance = user.data().balance - button.points

          transaction.update(userRef, { balance: newBalance })
          transaction.set(logRef, {
            change: -button.points,
            description: button.title,
            user: user.id,
            balance: user.data().balance - button.points,
            date: serverTimestamp(),
          })
        })
      })
        .then(() => {
          console.log('Successfully Adding to Users Balance')
          props.history.replace('/dashboard')
        })
        .catch((err) => console.log('Error Adding to Users Balance', err))
    }
  }

  return (
    <Container>
      <List>
        {buttons.map((button) => {
          return (
            <Button
              key={button.id}
              onClick={(e) =>
                props.id.includes('Class')
                  ? handleClassRemove(e, button)
                  : handleStudentRemove(e, button)
              }
            >
              <p>{button.title}</p>
              <p>{isNaN(button.points) ? 'Error' : button.points}</p>
            </Button>
          )
        })}
      </List>
    </Container>
  )
}

// class NegBtnList extends Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       buttons: [],
//       deleting: false,
//     }
//   }
//   componentDidMount() {
//     if (this.state.buttons.length === 0) {
//       database.collection('negative').onSnapshot((res) => {
//         let buttons = []
//         res.forEach((doc) => buttons.push({ ...doc.data(), id: doc.id }))
//         // Sort buttons by point amount
//         buttons.sort((a, b) => (a.points > b.points ? 1 : -1))
//         this.setState({ buttons })
//       })
//     }
//   }
//   toggleDeleting = () => this.setState({ deleting: !this.state.deleting })
//   handleClassRemove = (e, button) => {
//     e.preventDefault()

//     if (this.state.deleting) {
//       // Delete Button from Firebase
//       database
//         .collection('negative')
//         .doc(button.id)
//         .delete()
//         .then(() => this.setState({ feedback: 'Successfully Deleted' }))
//         .catch(() => this.setState({ feedback: 'Failed to Deleted' }))
//     } else if (isNaN(button.points)) {
//       alert('This buttons point value is not a number')
//     } else {
//       const logRef = database.collection('log').doc()

//       database
//         .collection('users')
//         .where('track', '==', this.props.id.split(' ')[0])
//         .get()
//         .then((res) => {
//           res.docs.forEach((doc) => {
//             const docRef = database.collection('users').doc(doc.id)

//             docRef
//               .update({
//                 balance: doc.data().balance - button.points,
//               })
//               .catch((err) => {
//                 throw err
//               })

//             logRef.set({
//               change: -button.points,
//               description: button.title,
//               user: doc.id,
//               balance: doc.data().balance - button.points,
//               date: serverTimestamp(),
//             })
//           })
//           this.props.history.replace('/dashboard')
//         })
//         .catch((err) => {
//           console.log(err)
//           alert(err)
//         })
//     }
//   }
//   handleRemovePoints = (e, button) => {
//     e.preventDefault()

//     if (this.state.deleting) {
//       // Delete Button from firebase
//       database
//         .collection('negative')
//         .doc(button.id)
//         .delete()
//         .then(() => this.setState({ feedback: 'Successfully Deleted' }))
//         .catch(() => this.setState({ feedback: 'Failed to Delete' }))
//     } else if (isNaN(button.points)) {
//       alert('This buttons point value is not a number')
//     } else {
//       // Remove Points from User
//       const logRef = database.collection('log').doc()
//       const userRef = database.collection('users').doc(this.props.id)

//       database
//         .runTransaction((transaction) => {
//           return transaction.get(userRef).then((user) => {
//             const newBalance = user.data().balance - button.points
//             transaction.update(userRef, { balance: newBalance })
//             transaction.set(logRef, {
//               change: -button.points,
//               description: button.title,
//               user: user.id,
//               balance: user.data().balance - button.points,
//               date: serverTimestamp(),
//             })
//           })
//         })
//         .then(() => {
//           console.log('Successfully Removed from Users Balance')
//           this.props.history.replace('/dashboard')
//         })
//         .catch((err) => console.log('Error Removing from Users Balance', err))
//     }
//   }
//   render() {
//     return (
//       <Container>
//         <List>
//           {this.state.buttons.map((button) => {
//             return (
//               <Button
//                 key={button.id}
//                 deleting={this.state.deleting}
//                 onClick={(e) =>
//                   this.props.id.includes('Class')
//                     ? this.handleClassRemove(e, button)
//                     : this.handleRemovePoints(e, button)
//                 }
//               >
//                 <p>{button.title}</p>
//                 {!this.state.deleting ? <p>{button.points}</p> : <CustomIcon icon="delete" />}
//               </Button>
//             )
//           })}
//         </List>
//       </Container>
//     )
//   }
// }

// export default NegBtnList

const Container = styled.div`
  margin: 25px auto;
  max-width: 600px;
  width: 90%;
`
const List = styled.ul`
  align-content: space-between;
  border: 1px solid white;
  border-radius: 15px;
  display flex;
  flex-wrap: wrap;
  height: 85%;
  list-style: none;
  justify-content: space-evenly;
  padding: 0 0 25px 0;
`
const Button = styled.li`
  border: 1px solid white;
  border-radius: 15px;
  padding: 1% 0;
  cursor: pointer;
  width: 30%;
  font-size: 1rem;
  margin-top: 25px;
  :hover {
    background: #444;
    border: ${(props) => props.deleting && '1px solid red'};
    i {
      color: ${(props) => props.deleting && 'red'};
    }
  }
`
