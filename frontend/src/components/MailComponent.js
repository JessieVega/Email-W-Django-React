import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Card, Fab, Modal, FormControl, Input, TextField, Button } from "@material-ui/core"
import { useHistory } from 'react-router-dom'

const MailComponent = () => {
    const [showAddEmailModal, setShowAddEmailModal] = useState(false)
    const [to, setTo] = useState('')
    const [subject, setSubject] = useState('')
    const [content, setContent] = useState('')
    const [errors, setErrors] = useState([])

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

    const [emails, setEmails] = useState([])
    const [emailsReceived, setEmailsReceived] = useState([])
    const [sentEmails, setSentEmails] = useState([])

    const [emailFeedFilterIdx, setEmailFeedFilterIdx] = useState(0)

    let history = useHistory()

    if (localStorage.getItem('user') == null)
        history.push('/login')

    useEffect(() => {
        axios.get(axios.defaults.baseURL + 'emails/').then(res => {
            setEmailsReceived(res.data.filter(email => email.to == user.id).reverse())
            setEmails(res.data.filter(email => email.to == user.id).reverse())
            setSentEmails(res.data.filter(email => email.by == user.id).reverse())
        })

    }, [])

    const sendMessage = () => {
        axios.get(axios.defaults.baseURL + 'users/users/').then(res => {
            const usersByEmail = to.split(" ").filter(value => value != "")
            const areAllEmailsValid = usersByEmail.every(item =>
                res.data.find(usr => usr.email == item && item != user.email)
            )

            if (areAllEmailsValid) {
                setErrors(errors.filter(err => err != "Email not found"))

                usersByEmail.forEach(
                    item => {
                        const userByEmail = res.data.find(usr => usr.email == item && item != user.email)

                        axios.post(axios.defaults.baseURL + 'emails/', {
                            by: user.id,
                            to: userByEmail.id,
                            subject: subject,
                            content: content
                        }).then(res => {
                            setErrors([])
                            window.location.reload()
                        }).catch(err => {
                            if (!errors.includes("Invalid email composition"))
                                setErrors([...errors, "Invalid email composition"]);
                        })
                    }
                )

            } else {
                if (!errors.includes("Email not found"))
                    setErrors([...errors, "Email not found"]);
            }
        })
    }

    const renderErrors = () => {
        return (
            errors.map((item, index) =>
                <p
                    key={index}
                    style={{
                        textTransform: "uppercase",
                        color: "red",
                        fontWeight: 900,
                        textAlign: "center"
                    }}
                >
                    {item}
                </p>
            )
        )
    }

    const setEmailAndFeedIdx = (array, idx) => {
        setEmails(array)
        setEmailFeedFilterIdx(idx)
    }

    return (
        <div>
            <style>{`
                .rr {
                    color:red;
                }

                .email-feed-filter {
                    background-color: #00000055;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    border-bottom: 1px solid black;
                    cursor: pointer;
                }

                .email-feed-filter * {
                    color: white;
                }

                .email-feed-filter-focus {
                    background-color: white;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    padding: 16px;
                    box-shadow: 0 0px 64px -2px black;
                    cursor: pointer;
                }

                .email-feed-filter-focus * {
                    color: #a0f;
                }

                .email-entry {
                    cursor: pointer;
                }
            `}</style>
            <div style={{ backgroundColor: "#a0f", margin: 0, display: "flex", height: 675, padding: 64 }}>
                <Card style={{ backgroundColor: "#fff8", height: 550, flex: 2, borderRadius: 15 }}>
                    <div
                        className={emailFeedFilterIdx == 0 ? "email-feed-filter-focus" : "email-feed-filter"}
                        onClick={() => setEmailAndFeedIdx(emailsReceived, 0)}
                    >
                        <p>Inbox</p>
                    </div>
                    <div
                        className={emailFeedFilterIdx == 1 ? "email-feed-filter-focus" : "email-feed-filter"}
                        onClick={() => setEmailAndFeedIdx(sentEmails, 1)}
                    >
                        <p>Sent</p>
                    </div>
                </Card>
                <div style={styles.inbox}>
                    {
                        emails.map((item, index) =>
                            <div
                                key={item.id}
                                style={styles.emailEntry}
                                className="email-entry"
                                onClick={() => history.push(`/mail/messages/${item.id}`)}
                            >
                                <p style={styles.emailEntrySender}>{item.sender_name}</p>
                                <p style={styles.emailEntryContent}>
                                    {item.subject}
                                </p>
                                <p style={styles.emailEntryDate}>{item.created_at_date}</p>
                            </div>
                        )
                    }
                </div>

            </div>
            <Modal open={showAddEmailModal} style={styles.addEmailModal}>
                <div style={{ outline: "none", border: "none" }}>
                    <h1 style={{ textAlign: "center" }}>Compose an email</h1>
                    <Button
                        onClick={() => setShowAddEmailModal(false)}
                        style={{ position: "absolute", top: 0, right: 0 }}
                    >
                        X
                    </Button>
                    <FormControl style={{ width: "100%", height: 420 }}>
                        <div style={{ textAlign: "center" }}>
                            <TextField
                                id="to"
                                style={{ display: "block", width: "65%", margin: "0 auto" }}
                                fullWidth={100}
                                onChange={(e) => setTo(e.target.value)}
                                value={to}
                            />
                            <label htmlFor="to">To</label>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <TextField
                                style={{ display: "block", width: "80%", margin: "auto" }}
                                rows={1}
                                rowsMax={2}
                                fullWidth={120}
                                onChange={(e) => setSubject(e.target.value)}
                                value={subject}
                            />
                            <label htmlFor="to">Subject</label>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <TextField
                                style={{ display: "block", width: "80%", margin: "auto" }}
                                multiline
                                rows={6}
                                rowsMax={8}
                                fullWidth={120}
                                onChange={(e) => setContent(e.target.value)}
                                value={content}
                            />
                            <label htmlFor="to">Content</label>
                        </div>
                        {renderErrors()}
                        <Button
                            onClick={sendMessage}
                            style={{
                                position: "absolute",
                                bottom: 0,
                                width: "100%",
                                textAlign: "center"
                            }}
                        >
                            Send
                        </Button>
                    </FormControl>
                </div>
            </Modal>
            <Fab onClick={() => setShowAddEmailModal(true)} style={styles.addFab}>+</Fab>
        </div>
    )
}

const styles = {
    inbox: {
        backgroundColor: "#fff8",
        height: 550,
        flex: 6,
        marginLeft: 64,
        borderRadius: 15,
        padding: 10,
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    emailEntry: {
        width: "100%",
        height: 64,
        backgroundColor: "white",
        borderRadius: 5,
        marginBottom: 5,
        display: "flex",
        alignItems: "center"
    },
    emailEntrySender: {
        flex: 5,
        textAlign: "left",
        marginLeft: 16,
        fontWeight: 300,
        fontSize: 18
    },
    emailEntryContent: {
        flex: 18,
        textAlign: "left",
        color: "#000b",
        fontWeight: "bold",
        WebkitLineClamp: 3,
        maxHeight: 56.5,
        wordBreak: "break-word",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },
    emailEntryDate: {
        flex: 2,
        marginRight: 16,
        fontSize: 13,
        fontWeight: "bold",
        textAlign: "right"
    },
    addFab: {
        fontSize: 30,
        color: "white",
        backgroundColor: "red",
        position: "fixed",
        bottom: 32,
        right: 32
    },
    addEmailModal: {
        width: 800,
        height: 500,
        backgroundColor: "white",
        margin: "auto",
        borderRadius: 15,
        boxShadow: "0 0 20px 5px #000",
        outline: "none",
        bordre: "none"
    }
}

export default MailComponent