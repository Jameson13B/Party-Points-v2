import './App.css'
import { Switch, Route } from 'react-router-dom'

import { EditUser } from './views/EditUser'
import { Login } from './views/Login'
import { Register } from './views/Register'
import { TeacherPortal } from './views/TeacherPortal'
import { Dashboard } from './views/Dashboard'
import { Profile } from './views/Profile'
import { Reporting } from './views/Reporting'
import { Store } from './views/Store'
import { Recognition } from './views/Recognition'
import { Student } from './views/Student'
import { Shopping } from './views/Shopping'

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/teacher-portal" component={TeacherPortal} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/reporting" component={Reporting} />
        <Route path="/store" component={Store} />
        <Route path="/recognition" component={Recognition} />
        <Route path="/edit-user" component={EditUser} />
        <Route path="/profile/:id" component={Profile} />
        <Route path="/student-portal" component={Student} />
        <Route path="/shopping" component={Shopping} />
      </Switch>
    </div>
  )
}

export default App

// Max purchase one of each item - You can only buy 1 {type}.
