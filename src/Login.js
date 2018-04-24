import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import Message from './Message.js';



import * as uuid from "uuid";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withApollo, compose } from "react-apollo"
import Chatroom from './Chatroom.js';

const user = uuid.v4();

class Login extends React.Component {

    constructor(props) {
        super(props);
   }

    login(e) {
        this.props.mutate({
            variables: {
                email: ReactDOM.findDOMNode(this.refs.emailInput).value,
                password: ReactDOM.findDOMNode(this.refs.passInput).value
            }
        });

    }

    render() {
        console.log(this)
        return (
            <div className="login">
                
                <form className="input">
                    <input type="text" ref="emailInput" />
                </form>

                <form className="input" onSubmit={(e) => this.login(e)}>
                    <input type="text" ref="passInput" />
                </form>

                <form className="input" onSubmit={(e) => this.login(e)}>
                    <input type="submit" value="Login" />
                </form>

            </div>
        );
    }
}

export default graphql(gql`
    mutation Login($email:String!, $password:String!) {
        userLogin(
            data: {
                email: $email,
                password: $password
            }
        ) 
        {
            success auth { idToken }
        }
    }`
)(Login);
