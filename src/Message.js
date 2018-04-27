import React from 'react';

const Message = ({chat, user}) => (
    <li className = {`chat ${user === chat.user ? "right" : "left"}`}>
        {user !== chat.user}
            {chat.content}
    </li>
);

export default Message;
