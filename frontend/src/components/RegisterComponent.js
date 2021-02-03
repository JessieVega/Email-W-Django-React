import React, { useState } from 'react'
import axios from 'axios'
import { FormControl, Input, InputLabel, TextField, Card, Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

const RegisterComponent = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dob, setDob] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [errors, setErrors] = useState([])

    let history = useHistory()

    if (localStorage.getItem('user') != null)
        history.push('/mail')

    const signUp = () => {
        if (password != confirmPassword) {
            if (!errors.includes("Passwords do not match"))
                setErrors(errors => [...errors, "Passwords do not match"])

            return
        } else {
            setErrors(errors.filter(err => err != "Passwords do not match"))
        }

        axios.post(axios.defaults.baseURL + 'users/users/', {
            email: email + '@mailsite.com',
            first_name: firstName,
            last_name: lastName,
            dob: dob,
            phone: phone,
            password: password
        }).then(res => {
            localStorage.setItem('user', JSON.stringify(res.data))
            history.push('/mail')
        }).catch(err => {
            if (!errors.includes("Registration credentials"))
                setErrors(errors => [...errors, "Registration credentials"])
        })
    }

    return (
        <div style={styles.background}>
            <FormControl>
                <Card style={{ padding: 32, textAlign: "center" }}>
                    <h1>Register</h1>
                    <div style={{ display: "flex" }}>
                        <div style={{ margin: "16px 32px" }}>
                            <TextField
                                id="first-name"
                                style={{ display: "block", marginBottom: 16 }}
                                onChange={(e) => setFirstName(e.target.value)}
                                value={firstName}
                            />
                            <label htmlFor="first-name">First Name</label>
                        </div>
                        <div style={{ margin: "16px 32px" }}>
                            <TextField
                                id="last-name"
                                style={{ display: "block", marginBottom: 16 }}
                                onChange={(e) => setLastName(e.target.value)}
                                value={lastName}
                            />
                            <label htmlFor="last-name">Last Name</label>
                        </div>
                    </div>
                    <div>
                        <div style={{ margin: "16px auto" }}>
                            <TextField
                                type="date"
                                id="dob"
                                style={{ display: "block", marginBottom: 16 }}
                                onChange={(e) => setDob(e.target.value)}
                                value={dob}
                            />
                            <label htmlFor="dob" >Date of birth</label>
                        </div>
                    </div>
                    <div style={{ display: "flex" }}>
                        <div style={{ margin: "16px 32px" }}>
                            <TextField
                                id="email"
                                style={{ display: "block", marginBottom: 16 }}
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                            <label htmlFor="email">@mailsite.com</label>
                        </div>
                        <div style={{ margin: "16px 32px" }}>
                            <TextField
                                id="phone"
                                style={{ display: "block", marginBottom: 16 }}
                                onChange={(e) => setPhone(e.target.value)}
                                value={phone}
                            />
                            <label htmlFor="phone">Phone</label>
                        </div>
                    </div>
                    <div style={{ display: "flex" }}>
                        <div style={{ margin: "16px 32px" }}>
                            <TextField
                                id="password"
                                type="password"
                                style={{ display: "block", marginBottom: 16 }}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                            />
                            <label htmlFor="password">Password</label>
                        </div>
                        <div style={{ margin: "16px 32px" }}>
                            <TextField
                                id="password-confirm"
                                type="password"
                                style={{ display: "block", marginBottom: 16 }}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                value={confirmPassword}
                            />
                            <label htmlFor="password-confirm">Confirm Password</label>
                        </div>
                    </div>
                    <Button style={{ marginTop: 16, backgroundColor: "#a0f3" }} onClick={signUp}>Sign up</Button>
                    <div>
                        {
                            errors.map((item, index) =>
                                <p
                                    key={index}
                                    style={{
                                        textTransform: "uppercase",
                                        color: "red",
                                        fontWeight: 900
                                    }}
                                >
                                    {item}
                                </p>)
                        }

                    </div>
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

export default RegisterComponent