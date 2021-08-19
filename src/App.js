import './App.css'
import { Switch, Route } from 'react-router-dom'

import { EditUser } from './views/EditUser'
import { Login } from './views/Login'
import { Register } from './views/Register'
import { TeacherPortal } from './views/TeacherPortal'

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/teacher-portal" component={TeacherPortal} />
        <Route path="/edit-user" component={EditUser} />
      </Switch>
    </div>
  )
}

export default App
