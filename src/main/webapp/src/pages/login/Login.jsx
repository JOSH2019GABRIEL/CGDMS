import "./login.scss"

const Login = () => {
  return (
    <div className="login">
        <div className="loginwrapper">
            <form action="./">
            <span className="desk">Login Credentials</span>
            <div className="formInput">
                <label>Username</label>
                <input type="text" placeholder="Enter Username"/>
           </div>
           <div className="formInput">
                <label>Password</label>
                <input type="password" placeholder="Enter Password"/>
           </div>
           <button>Login</button>
           </form>
        </div>
    </div>
  )
}

export default Login