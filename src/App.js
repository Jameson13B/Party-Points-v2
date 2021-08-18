import './App.css'
import { Switch, Route } from 'react-router-dom'

import { TeacherPortal } from './views/TeacherPortal'
import { Login } from './views/Login'
import { Register } from './views/Register'

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/teacher-portal" component={TeacherPortal} />
      </Switch>
    </div>
  )
}

export default App
