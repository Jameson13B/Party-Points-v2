import './App.css'
import { Switch, Route } from 'react-router-dom'

import { TeacherPortal } from './views/TeacherPortal'
import { Login } from './views/Login'

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/teacher-portal" component={TeacherPortal} />
      </Switch>
    </div>
  )
}

export default App
