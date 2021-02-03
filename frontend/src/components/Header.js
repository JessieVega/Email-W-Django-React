import React, { useState } from 'react'
import { Link, Button } from '@material-ui/core'
import { useHistory } from 'react-router-dom'

const Header = (props) => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')))

    const logOut = () => {
        localStorage.removeItem('user')
        setUser({})
        window.location = window.location.origin + '/login'
    }

    const renderLogOutBtn = () => {
        if (user) {
            return (
                <div>
                    <Button
                        onClick={() => window.location = window.location.origin + '/mail'}
                    >
                        Mail
                    </Button>
                    <Button onClick={logOut}>Log out</Button>
                </div>
            )
        }
        else
            return null
    }

    return (
        <div style={styles.headerContainer}>
            <Link href="/"><h1 style={{ fontStyle: "italic" }}>MailSite</h1></Link>
            {renderLogOutBtn()}
        </div>
    )
}

const styles = {
    headerContainer: {
        display: "flex",
        alignItems: "center",
        padding: 16,
        paddingLeft: 64,
        margin: 0,
        justifyContent: "space-between"
    }
}

export default Header