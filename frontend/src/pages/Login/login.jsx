import { useRef,useContext } from "react"
import { Link } from "react-router-dom"
import "./login.css";
import { loginCall } from '../../apiCalls'
import { AuthContext } from '../../context/authContext'

export default function Login() {

    const email = useRef()
    const password = useRef()
    const {dispatch} = useContext(AuthContext)

    const onSubmitClick = e =>{
        e.preventDefault()
        loginCall({email:email.current.value,password:password.current.value},dispatch)
    }
  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">bawki?</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Lamasocial.
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={onSubmitClick}>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="loginInput"
              ref={password}
            />
            <button className="loginButton" type="submit">
              Log In
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton" >
                <Link to="/register" style={{textDecoration:"none",color:"white"}}>
                Create a New Account
                </Link>
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}