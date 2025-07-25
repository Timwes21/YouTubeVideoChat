import { useState } from "react"
import { Link } from "react-router-dom"
import { authBase } from "../routes";

export default function CreateAccount(){
    const [ username, setUsername ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");

    const createAccount = () => {
        if (username.length === 0 && password.length === 0){
            return
        }
        fetch(authBase + "/create-account", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username, password})
        })
    }

    
    return (
        <div className="auth">
            <div className="auth-box">
                <label htmlFor="">Username</label>
                <input value={username} onChange={e=>setUsername(e.target.value)} type="text" />
                <label htmlFor="">Password</label>
                <input value={password} onChange={e=>setPassword(e.target.value)} type="text" />
                <p>Already have an account? <Link to="/login">Login</Link></p>
                <div className="login-buttons">
                    <button onClick={createAccount}>Create Your Account</button>
                </div>
            </div>
        </div>
    )
}