import { Link } from "react-router-dom"
import "./signup.css";
import { useRef } from "react"
import axios from 'axios'
import { useHistory } from "react-router"

export default function Signup() {
    const username = useRef()
    const email = useRef()
    const password = useRef()
    const passwordAgain = useRef()
    const history = useHistory()

    const clickSignup = async (e) => {
        e.preventDefault()
        if (passwordAgain.current.value !== password.current.value) {
            passwordAgain.current.setCustomValidity("Passwords don't match!");
        }
        else {
            const user = {
                username: username.current.value,
                email: email.current.value,
                password: password.current.value,
            };
            try {
                await axios.post("http://localhost:3030/register", user);
                history.push("/login");
            } catch (err) {
                console.log(err);
            }
        }
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
                    <form className="loginBox" onSubmit={clickSignup}>
                        <input
                            placeholder="Username"
                            required
                            className="loginInput"
                            ref={username}
                        />
                        <input
                            placeholder="Email"
                            required
                            className="loginInput"
                            type="email"
                            ref={email}
                        />
                        <input
                            placeholder="Password"
                            required
                            className="loginInput"
                            type="password"
                            minLength="6"
                            ref={password}
                        />
                        <input
                            placeholder="Password Again"
                            required
                            className="loginInput"
                            type="password"
                            ref={passwordAgain}
                        />
                        <button className="loginButton" type="submit">
                            Sign Up
                        </button>
                        <button className="loginRegisterButton">
                            <Link to="/login" style={{ textDecoration: "none", color: "white" }}>Log into Account</Link>
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}