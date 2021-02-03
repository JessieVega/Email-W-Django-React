import { Link } from '@material-ui/core'

import cyberSpaceEamil from '../static/images/cyberspace-email.jpg'

const HomeComponent = () => {
    const renderRegisterLoginOrMail = () => {
        if (localStorage.getItem('user')) {
            return (
                <div style={{ margin: "40px 0" }}>
                    <Link href="/mail" style={styles.registerLoginBtn}>Mail</Link>
                </div>
            )
        } else {
            return (
                <div>
                    <div style={{ margin: "40px 0" }}>
                        <Link href="/register" style={styles.registerLoginBtn}>Register</Link>
                    </div>
                    <div style={{ margin: "40px 0" }}>
                        <Link href="/login" style={styles.registerLoginBtn}>Log in</Link>
                    </div>
                </div>
            )
        }
    }

    return (
        <div>
            <div style={styles.logoLoginRegister}>
                <h1 style={styles.logo}>MailSite</h1>
                <div>
                    {renderRegisterLoginOrMail()}

                </div>
                <img style={{ backgroundImage: cyberSpaceEamil }}></img>
            </div>
        </div>
    )
}

const styles = {
    logoLoginRegister: {
        padding: 25,
        height: 400,
        margin: "auto",
        textAlign: "center",
        backgroundColor: "red",
        background: `linear-gradient(#330066bb, #330066bb), url(${cyberSpaceEamil}) no-repeat center`,
        backgroundSize: "cover"
    },
    logo: {
        fontSize: 100,
        color: "white",
        fontStyle: "italic",
        fontWeight: 100
    },
    registerLoginBtn: {
        backgroundColor: "white",
        padding: 15,
        borderRadius: 10
    }
}

export default HomeComponent