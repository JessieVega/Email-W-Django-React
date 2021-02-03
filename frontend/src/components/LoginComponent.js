import React, { useState } from 'react'
import axios from 'axios'
import { FormControl, Input, InputLabel, TextField, Card, Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

const LoginComponent = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    let history = useHistory()

    if (localStorage.getItem('user') != null)
        history.push('/mail')

    const logIn = () => {
        axios.post(axios.defaults.baseURL + 'token-auth', {
            email: email,
            password: password
        }).then(res => {
            localStorage.setItem('user', JSON.stringify(res.data.user))
            setError('')
            history.push('/mail')
        }).catch(res => setError("Invalid login credentials"))
    }

    return (
        <div style={styles.background}>
            <FormControl>
                <Card style={{ padding: 32, textAlign: "center", width: 700, width: "100%" }}>
                    <h1>Login</h1>
                    <div style={{ width: "100%" }}>
                        <div style={{ width: "100%" }}>
                            <div style={{ width: "100%" }}>
                                <TextField
                                    id="email"
                                    style={{ display: "block", width: 500, margin: "auto", marginBottom: 16 }}
                                    fullWidth={150}
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                />
                                <label htmlFor="email">Email</label>
                            </div>
                        </div>
                        <div>
                            <div style={{ margin: "16px 32px" }}>
                                <TextField
                                    type="password"
                                    id="password"
                                    style={{ display: "block", width: 300, margin: "auto", marginBottom: 16 }}
                                    fullWidth={90}
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                    </div>
                    <Button
                        style={{ marginTop: 16, backgroundColor: "#a0f3" }}
                        onClick={logIn}
                    >
                        Log in
                    </Button>
                    <p
                        style={{
                            textTransform: "uppercase",
                            color: "red",
                            fontWeight: 900
                        }}
                    >
                        {error ? error : null}
                    </p>
                </Card>
            </FormControl>
        </div>
    )
}

const styles = {
    background: {
        margin: "auto",
        textAlign: "center",
        backgroundColor: "#a0f",
        padding: 96,
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0
    }
}

export default LoginComponent