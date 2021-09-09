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
                await axios.post(`${process.env.REACT_APP_BACK_END_URL}/register`, user);
                history.push("/login");
            } catch (err) {
                console.log(err);
            }
        }
    }
    return (
        <div className="signup">
            <div className="signupWrapper">
                <div className="signupLeft">
                    <h4 className="signupLogo">h3llo</h4>
                    <span className="signupDesc">
                    Find your ChatMate.
                    </span>
                </div>
                <div className="signupRight">
                    <form className="signupBox" onSubmit={clickSignup}>
                        <input
                            placeholder="Username"
                            required
                            className="signupInput"
                            ref={username}
                        />
                        <input
                            placeholder="Email"
                            required
                            className="signupInput"
                            type="email"
                            ref={email}
                        />
                        <input
                            placeholder="Password"
                            required
                            className="signupInput"
                            type="password"
                            minLength="6"
                            ref={password}
                        />
                        <input
                            placeholder="Password Again"
                            required
                            className="signupInput"
                            type="password"
                            ref={passwordAgain}
                        />
                        <div className="buttondiv">
                            <button className="signupButton" type="submit">
                                Sign Up
                            </button>
                            <button className="signupRegisterButton">
                                <Link to="/login" style={{ textDecoration: "none", color: "white" }}>Login</Link>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}