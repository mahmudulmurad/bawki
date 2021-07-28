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
          {user ? <Messanger /> : <Login /> }
        </Route>

        <Route path="/register">
          {user ? <Redirect to="/" /> : <Signup />}
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
