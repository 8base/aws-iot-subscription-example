import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import { withRouter } from "react-router-dom";

import { graphql } from "react-apollo";
import gql from "graphql-tag";

class Login extends React.Component {

    login(e) {
        e.preventDefault();

        localStorage.setItem("idToken", "")
        localStorage.setItem("account-id", "")

        this.props.mutate({
            variables: {
                email: ReactDOM.findDOMNode(this.refs.emailInput).value,
                password: ReactDOM.findDOMNode(this.refs.passInput).value
            }
        })
        .then((data) => {
            try {
                localStorage.setItem("idToken", data.data.userLogin.auth.idToken)
                localStorage.setItem("account-id", data.data.userLogin.accounts[0].account)    
            } catch(ex) {
                console.log(ex.message)
            }

            this.props.history.replace("/chat");
        })
        .catch(() => {
        })

    }

    render() {
        return (
            <div className="login">
                
                <form className="input" onSubmit={(e) => this.login(e)}>
                    <input type="text" ref="emailInput" />
                    <input type="text" ref="passInput" />
                    <input type="submit" value="Login" />
                </form>

            </div>
        );
    }
}

export default withRouter(graphql(gql`
    mutation Login($email:String!, $password:String!) {
        userLogin(
            data: {
                email: $email,
                password: $password
            }
        ) 
        {
            success auth { idToken }  accounts {account}
        }
    }`
)(Login));

