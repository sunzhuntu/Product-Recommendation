import React, { useState } from 'react'
import loginService from '../services/login'
import productService from '../services/products'

const buttonStyle = {
    backgroundColor: 'white',
    color: 'black',
    padding: 4,
    margin: 4,
    fontSize: 16,
    cursor: 'pointer',
    fontStyle: 'italic',
    borderRadius: 12
}

const inputStyle = {
    backgroundColor: 'white',
    color: 'black',
    padding: 5,
    margin: 0,
    fontSize: 16,
    borderRadius: 12
}

const contentStyle = {
    backgroundColor: 'white',
    color: '#800000',
    padding: 10,
    margin: 20,
    fontSize: 16
}

const LoginForm = ({ user, userLoginHandler }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    console.log('the passed user value is:', user)

    const handleLogin = async (event) => {
        event.preventDefault()
        user = await loginService.login({
            username, password,
        })
        window.localStorage.setItem(
            'loggedProductAppUser', JSON.stringify(user)
        )
        productService.setToken(user.token)
        userLoginHandler(user)
        setUsername('')
        setPassword('')
    }

    return (
        user === null
            ? <div style={contentStyle}>
                <strong> Please login </strong>
                <form onSubmit={handleLogin}>
                    <div style={inputStyle}>
                        <span> Username: </span>
                        <input
                            type="text"
                            value={username}
                            name="Username"
                            onChange={({ target }) => setUsername(target.value)}
                        />
                    </div>
                    <div style={inputStyle}>
                        <span> Password: </span>
                        <input
                            type="password"
                            value={password}
                            name="Password"
                            onChange={({ target }) => setPassword(target.value)}
                        />
                    </div>
                    <button type="submit" style={buttonStyle}>Login</button>
                </form>
            </div>
            : null
    )
}

export default LoginForm