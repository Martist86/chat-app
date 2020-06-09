import React from 'react';

export interface IMessage {
    message: string;
    authorName: string;
    author: string;
    _id: string;
}
interface IProps{
    messages: IMessage[],
    currentUserId: string
}

const Messages = (props: IProps) => {
    return(
        <div className="messages-box">
            {props.messages && props.messages.length ? props.messages.map(m => {
                return(
                    <div className="message" key={`m-${m._id}`}>
                        <p className="author-name">
                            {m.authorName}
                            {m.author === props.currentUserId && <span>(me)</span>}
                        </p>
                        <p className="message-item">{m.message}</p>
                    </div>
                )
            }) : <p>No messages yet</p> }
        </div>
    )

};
export default Messages;