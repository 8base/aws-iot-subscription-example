import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import Message from './Message.js';


import * as uuid from "uuid";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { compose } from "react-apollo"

const user = uuid.v4();

class Chatroom extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            chats: []
        };

        this.submitMessage = this.submitMessage.bind(this);

        if (!localStorage.getItem("idToken")) {
            this.props.history.replace("/")
        }
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
                message: ReactDOM.findDOMNode(this.refs.msg).value,
                user: user
            }
        });

        ReactDOM.findDOMNode(this.refs.msg).value = "";
    }

    render() {
        
        const username = user; //localStorage.getItem("chat-username");
        if (this.props.data && 
            this.props.data.Chat) {
                this.state.chats.push( {
                    content: this.props.data.Chat.node.message,
                    user: this.props.data.Chat.node.user,
                })
        
            }
        const { chats } = this.state;
        
        return (
            <div className="chatroom">

                <h3>Chilltime</h3>
                <ul className="chats" ref="chats">
                    {
                        React.Children.toArray(chats.map((chat) => <Message chat={chat} user={username} />))
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
                node { message, user }
            }
        }`
    ),
    graphql(gql`
        mutation CreateMessage($message: String! $user: String) {
            chatCreate(data:{message:$message user:$user}) {
                id
            }
        }`
    )
  )(Chatroom);