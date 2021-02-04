import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { FormControl, Input, InputLabel, TextField, Card, Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

const LoginComponent = (props) => {
    const [email, setEmail] = useState({})
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))
    const [updateMode, setUpdateMode] = useState(false)
    const [replyMode, setReplyMode] = useState(false)
    const [replyEditMode, setReplyEditMode] = useState(-1)

    const [subject, setSubject] = useState('')
    const [content, setContent] = useState('')

    const [title, setTitle] = useState('')
    const [reply, setReply] = useState('')

    const [replyTitle, setReplyTitle] = useState('')
    const [replyContent, setReplyContent] = useState('')

    const [replies, setReplies] = useState([])

    let history = useHistory()

    if (localStorage.getItem('user') == null)
        history.push('/login')

    useEffect(() => {
        axios.get(axios.defaults.baseURL + `emails/${props.id}`).then(res => {
            if (res.data.to != user.id && res.data.by != user.id) {
                window.location = window.location.origin
            }

            setEmail(res.data)
            setContent(res.data.content)
            setSubject(res.data.subject)

            loadReplies(res.data)
        }).catch(err => window.location = window.location.origin)
    }, [])

    const loadReplies = (data) => {
        axios.get(axios.defaults.baseURL + 'emails/replies/').then(response => {
            setReplies(response.data.filter(reply => reply.to == data.id))
        })
    }

    const renderEditDeleteBtns = () => {
        if (email.by == user.id) {
            return (
                <div style={{ float: "right" }}>
                    <EditButton />
                    <Button onClick={deleteEmail}>Delete</Button>
                </div>
            )
        } else {
            return null;
        }
    }

    const EditButton = () => {
        if (updateMode) {
            return (
                <div style={{ display: "inline-block" }}>
                    <Button onClick={updateEmail}>Update</Button>
                    <Button onClick={() => setUpdateMode(false)}>Cancel</Button>
                </div>
            )
        } else {
            return (
                <Button onClick={() => setUpdateMode(true)}>Edit</Button>
            )
        }
    }
    const updateEmail = () => {
        axios.put(axios.defaults.baseURL + `emails/${props.id}`, {
            subject: subject,
            content: content
        }).then(res => {
            window.location.reload()
        })
    }

    const deleteEmail = () => {
        if (window.confirm("Delete this message?")) {
            axios.delete(axios.defaults.baseURL + `emails/${props.id}`).then(res => {
                history.push("/mail")
            })
        }
    }

    const EmailContent = () => {
        if (!updateMode) {
            return (
                <div>
                    <h1>{email.subject}</h1>
                    <p style={{ marginBottom: 40, textAlign: "justify" }}>
                        {email.content}
                    </p>
                </div>
            )
        } else {
            return null
        }
    }

    const renderReplyBtn = () => {
        if (email.to == user.id) {
            if (replyMode) {
                return (
                    <div>
                        <Button style={{ float: "right" }} onClick={postReply}>Confirm</Button>
                        <Button
                            style={{ float: "right" }}
                            onClick={() => setReplyMode(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                )
            } else {
                return (
                    <Button
                        style={{ float: "right" }}
                        onClick={() => { setReplyMode(true) }}
                    >
                        Reply
                    </Button>
                )
            }
        } else {
            return null
        }
    }

    const postReply = () => {
        axios.post(axios.defaults.baseURL + 'emails/replies/', {
            by: user.id,
            to: email.id,
            title: title,
            content: reply
        }).then(res => {
            setTitle('')
            setReply('')
            setReplyMode(false)
            loadReplies(email)
        })
    }

    const deleteReply = (title, id) => {
        if (window.confirm(`Delete reply with title of '${title}'`)) {
            axios.delete(axios.defaults.baseURL + `emails/replies/${id}`).then(res => {
                loadReplies(email)
            })
        }
    }

    const renderEditReplyBtn = (item, idx) => {
        if (replyEditMode === idx) {
            return (
                <div style={{ display: "inline-block" }}>
                    <Button onClick={() => updateReply(item.id)}>Confirm</Button>
                    <Button onClick={() => setReplyEditMode(-1)}>Cancel</Button>
                </div>
            )
        } else {
            return (
                <Button onClick={() => {
                    setReplyTitle(item.title)
                    setReplyContent(item.content)
                    setReplyEditMode(idx)
                }}>
                    Edit
                </Button>
            )
        }
    }

    const updateReply = (id) => {
        axios.put(axios.defaults.baseURL + `emails/replies/${id}`, {
            title: replyTitle,
            content: replyContent
        }).then(res => {
            loadReplies(email)
            setReplyEditMode(-1)
        })
    }

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

                <div
                    style={{
                        padding: "0px 64px",
                        marginTop: 48,
                    }}
                >
                    <EmailContent />
                    <FormControl style={{ marginBottom: 64, display: updateMode ? "inherit" : "none" }}>
                        <TextField
                            onChange={(e) => setSubject(e.target.value)}
                            value={subject}
                            inputProps={{
                                style: {
                                    fontSize: 32,
                                    fontWeight: "bold"
                                }
                            }}
                            style={{
                                marginBottom: 32,
                                width: 650
                            }}
                        />
                        <TextField
                            multiline={true}
                            rowsMax={100}
                            onChange={(e) => setContent(e.target.value)}
                            value={content}
                            style={{
                                width: 680
                            }}
                            inputProps={{
                                style: {
                                    textAlign: "justify"
                                }
                            }}
                        />

                    </FormControl>
                    {renderReplyBtn()}
                    {renderEditDeleteBtns()}
                    <small style={{ textAlign: "right" }}>{email.created_at_full}</small>
                </div>
                <div
                    style={{
                        clear: "both",
                        margin: "auto",
                        width: "95%",
                        textAlign: "center",
                        paddingTop: 32,
                        display: replyMode ? "inherit" : "none"
                    }}
                >
                    <div style={{ width: "70%", margin: "auto" }}>
                        <TextField
                            style={{ width: "100%" }}
                            inputProps={{
                                style: {
                                    fontSize: 24,
                                    color: "#0009",
                                    fontWeight: "bold"
                                }
                            }}
                            onChange={e => setTitle(e.target.value)}
                            value={title}
                        />
                        <label style={{ display: "block", textAlign: "left", marginTop: 8 }}>Title</label>
                    </div>

                    <div style={{ width: "80%", margin: "auto", marginTop: 16 }}>
                        <TextField
                            multiline={true}
                            rows={4}
                            rowsMax={7}
                            style={{ width: "100%" }}
                            onChange={e => setReply(e.target.value)}
                            value={reply}
                        />
                        <label style={{ display: "block", textAlign: "left", marginTop: 8 }}>Content</label>
                    </div>


                </div>
                <div style={{ marginTop: 64 }}>
                    {
                        replies.map((item, index) =>
                            <div
                                style={{ clear: "both", marginTop: 16 }}
                                key={item.id}
                            >
                                <hr
                                    style={{
                                        width: "75%",
                                        border: "none",
                                        borderTop: "0.5px solid #0004",
                                        margin: "16px auto"
                                    }}
                                />
                                <div style={{ margin: "0 96px" }}>
                                    <div>
                                        <small style={{ fontWeight: 400, color: "#0009" }}>{item.created_at_full}</small>
                                        <h3 style={{ marginRight: 32, marginTop: 0 }}>{item.replier_name} ({item.replier_email}) replied:</h3>
                                    </div>
                                    <div style={{ display: replyEditMode == index ? "none" : "inherit" }}>
                                        <h2 style={{ clear: "both", color: "#0009" }}>{item.title}</h2>
                                        <p style={{ fontSize: 14, color: "#0009" }}>
                                            {item.content}
                                        </p>
                                    </div>
                                    <div style={{ display: replyEditMode == index ? "inherit" : "none" }}>
                                        <TextField
                                            style={{ width: "100%" }}
                                            inputProps={{
                                                style: {
                                                    fontSize: 24,
                                                    color: "#0009",
                                                    fontWeight: "bold"
                                                }
                                            }}
                                            onChange={e => setReplyTitle(e.target.value)}
                                            value={replyTitle}
                                        />
                                        <TextField
                                            multiline={true}
                                            rows={1}
                                            rowsMax={100}
                                            style={{ width: "100%", paddingTop: 16 }}
                                            onChange={e => setReplyContent(e.target.value)}
                                            value={replyContent}
                                            inputProps={{
                                                style: {
                                                    fontSize: 14,
                                                    color: "#0009"
                                                }
                                            }}
                                        />
                                    </div>
                                    <div style={{ marginTop: 16, textAlign: "right" }}>
                                        {
                                            item.by == user.id ?

                                                <div>
                                                    {renderEditReplyBtn(item, index)}
                                                    <Button onClick={() => deleteReply(item.title, item.id)}>Delete</Button>
                                                </div>


                                                :

                                                null
                                        }

                                    </div>
                                </div>
                            </div>
                        )
                    }
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