import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FormControl, Input, InputLabel, TextField, Card, Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

const LoginComponent = (props) => {
    const [email, setEmail] = useState({})
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

    let history = useHistory()

    if (localStorage.getItem('user') == null)
        history.push('/login')

    useEffect(() => {
        axios.get(axios.defaults.baseURL + `emails/${props.id}`).then(res => {
            if (res.data.to != user.id && res.data.by != user.id) {
                window.location = window.location.origin
            }

            setEmail(res.data)
        }).catch(err => window.location = window.location.origin)
    }, [])

    return (
        <div style={styles.background}>
            <Card style={styles.emailCard}>
                <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                    <div style={{ width: "40%", textAlign: "center" }}>
                        <p>{email.sender_email}</p>
                        <h3>From</h3>
                    </div>
                    <div style={{ width: "40%", textAlign: "center" }}>
                        <p>{email.to_email}</p>
                        <h3>To</h3>
                    </div>
                </div>
                <hr style={{ width: "80%", margin: "16px auto" }} />
                <div style={{ padding: "0px 64px", marginTop: 48 }}>
                    <h1>{email.subject}</h1>
                    <p style={{ marginBottom: 40, textAlign: "justify" }}>
                        {email.content}
                    </p>
                    <small style={{ display: "block", textAlign: "right" }}>{email.created_at_full}</small>
                </div>
            </Card>
        </div>
    )
}

const styles = {
    background: {
        backgroundColor: "#a0f",
        minHeight: 700,
        paddingTop: 72
    },
    emailCard: {
        margin: "auto",
        backgroundColor: "white",
        width: 800,
        borderRadius: 15,
        paddingTop: 48,
        paddingBottom: 40
    }
}

export default LoginComponent