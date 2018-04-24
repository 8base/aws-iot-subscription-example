import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import Message from './Message.js';



import * as uuid from "uuid";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withApollo, compose } from "react-apollo"

const user = uuid.v4();

class Chatroom extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            chats: []
        };

        this.submitMessage = this.submitMessage.bind(this);

    }

    componentDidMount() {
        this.scrollToBot();
    }

    componentDidUpdate() {
        this.scrollToBot();
    }

    scrollToBot() {
        ReactDOM.findDOMNode(this.refs.chats).scrollTop = ReactDOM.findDOMNode(this.refs.chats).scrollHeight;
    }

    submitMessage(e) {
        e.preventDefault();
        
        this.props.mutate({
            variables: {
                message: ReactDOM.findDOMNode(this.refs.msg).value
            }
        });

        ReactDOM.findDOMNode(this.refs.msg).value = "";
    }

    login(e) {
        e.preventDefault();
        
        console.log(this.props)
        this.props.mutate({
            variables: {
                email: ReactDOM.findDOMNode(this.refs.emailInput).value,
                password: ReactDOM.findDOMNode(this.refs.passInput).value
            }
        });
    }

    render() {
        const username = user;
        if (this.props.data && 
            this.props.data.Chat) {
                this.state.chats.push( {
                    content: this.props.data.Chat.node.message,
                    user: "user"
                })
        
            }
        const { chats } = this.state;
        
        return (
            <div className="chatroom">
                
                <h3>Chilltime</h3>
                <ul className="chats" ref="chats">
                    {
                        chats.map((chat) => 
                            <Message chat={chat} user={username} />
                        )
                    }
                </ul>

                <form className="input" onSubmit={(e) => this.submitMessage(e)}>
                    <input type="text" ref="msg" />
                    <input type="submit" value="Submit" />
                    
                </form>

            </div>
        );
    }
}

export default compose(
    graphql(gql`
        subscription ChatRoomSubscription {
            Chat(filter:{mutation_in:[create]}) {
                node { id, message }
            }
        }`
    ),
    graphql(gql`
        mutation CreateMessage($message: String!) {
            chatCreate(data:{message:$message}) {
                id
            }
        }`
    ),
    graphql(gql`
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
    )
  )(Chatroom);
