import React,{useState} from 'react'

const Login = () => {

  const [username,setUsername] = useState('');
  const [password,setPassword] = useState('');
  const [rememberMe,setRememberMe] = useState(false)
  const [message,setMessage] = useState('');

  const handleSubmit=(e)=>{
    e.preventDefault();

    if(!username || !password){
      setMessage("Please fill in all fields")
      return;
    }

    if(username==='admin' && password==="password"){
      setMessage("Login successful!");
    }else{
      setMessage("Invalid credentials.");
    }
  }

  const handleForgotPassword=()=>{
    setMessage("Password reset link would be sent to your email.")
  }

  const handleSignup = () =>{
    setMessage("Redirecting to SignUp Page");
  }
  

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Username</label><br />
          <input type="text" value={username} onChange={(e)=>{setUsername(e.target.value)} } required />
        </div>
        <div>
          <label>Password</label><br />
          <input type="password" value={password} onChange={(e)=>{setPassword(e.target.value)}} required />
        </div>
        <div>
          <label>
            <input type="checkbox" checked={rememberMe} onChange={(e)=>{setRememberMe(e.target.checked)}} />
            Remember me
          </label>
        </div>

        <div>
          <button type='submit'>Login</button>
        </div>
      </form>

      <div>
        <button onClick={handleForgotPassword}>Forgot Password?</button>
        <button onClick={handleSignup}>SignUp</button>
      </div>

      {message && <div>{message}</div>}
    </div>
  )
}

export default Login
