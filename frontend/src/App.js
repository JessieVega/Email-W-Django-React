import React from 'react'
import axios from 'axios'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { HomeComponent, LoginComponent, RegisterComponent, MailComponent, Header, EmailMessageDetailComponent } from './components/index'

export default class App extends React.Component {
    render() {
        axios.defaults.baseURL = 'http://127.0.0.1:8000/'
        console.log(localStorage.getItem('user'));

        return (
            <div>
                <Header />
                <Router>
                    <Switch>
                        <Route exact path="/" render={() => <HomeComponent />} />
                        <Route exact path="/mail" render={() => <MailComponent />} />
                        <Route path="/login" render={() => <LoginComponent />} />
                        <Route path="/register" render={() => <RegisterComponent />} />
                        <Route path="/mail/messages/:id" render={({ match }) => <EmailMessageDetailComponent id={match.params.id} />} />
                    </Switch>
                </Router>
            </div>
        )
    }
}
