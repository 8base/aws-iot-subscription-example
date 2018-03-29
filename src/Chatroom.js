import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

import Message from './Message.js';



import * as uuid from "uuid";
import { graphql } from "react-apollo";
import gql from "graphql-tag";
import { withApollo, compose } from "react-apollo"


const room = "room1";
const user = uuid.v4();
const topic = "test-topic";
const filter = "testfilter";


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
                message: {
                    text: ReactDOM.findDOMNode(this.refs.msg).value,
                    room: "room1"
                }
            }
        });

        ReactDOM.findDOMNode(this.refs.msg).value = "";
    }

    render() {
        
        const username = user;
        if (this.props.data && 
            this.props.data.onRoomMessage) {
                this.state.chats.push( {
                    content: this.props.data.onRoomMessage.text,
                    user: this.props.data.onRoomMessage.user
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



export default compose(graphql(gql`
        subscription ($filter: SubscriptionFilter!) {
            onRoomMessage(filter: $filter) {
            text,
            user
            }
        }`,
    {
        options: {
            variables:{
                filter: {
                }
            },
            
        }
    }),
    graphql(gql`
    mutation publish($message: PublishMessage!) {
        publishMessage(message:$message) {
          success
        }
      }
    `)
  )(Chatroom);