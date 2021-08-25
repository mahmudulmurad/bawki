import React, { useEffect,useContext } from 'react'
import Login from './pages/Login/login'
import Signup from './pages/signup/signup'
import Messanger from './pages/Messanger/messanger.jsx'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { AuthContext } from './context/authContext'
import { authenticatedUSer } from './apiCalls';

function App() {
  const { user,dispatch } = useContext(AuthContext)

  useEffect(() => {
    authenticatedUSer(dispatch)
  },[dispatch])
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <Messanger /> :<Signup /> }
        </Route>

        <Route path="/login">
          {user ? <Redirect to="/" /> : <Login />}
        </Route>

      </Switch>
    </Router>
  );
}

export default App;
