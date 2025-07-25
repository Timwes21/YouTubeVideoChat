import { Link, useNavigate } from "react-router-dom"
import { authBase } from "../routes"
import { useState } from "react"
import { setToken } from "../token";

export default function Login(){
    const [ username, setUsername ] = useState<string>("");
    const [ password, setPassword ] = useState<string>("");
    const [ error, setError ] = useState<string>("");
    const nav = useNavigate();

    const login = () => {
        if (username.length === 0 && password.length === 0){
            return;
        }
        console.log("here is login");
        
        fetch(authBase + "/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({username: username, password: password})
        })
        .then(async(response)=>{
            if (response.status === 200 ){
                setToken(username);
                nav("/home")
            }
            else{
                const data = await response.json()
                setError(data.message)
            }
        })
    }


    return (
        <div className="auth">
            <div className="auth-box">
                <label htmlFor="">Username</label>
                <input value={username} onChange={e=>setUsername(e.target.value)} type="text" />
                <label htmlFor="">Password</label>
                <input onChange={e=>setPassword(e.target.value)} type="text" />
                <p>Don't have an account? <Link to="/create-account">Create One</Link></p>
                <div className="login-buttons">
                    <button onClick={login}>Login</button>
                </div>
                <span>{error}</span>
            </div>
        </div>
    )
}