import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import axios from 'axios';
import Messages, {IMessage} from "./Messages";
import socketIOClient from "socket.io-client";

interface IProps{
    currentUserName: string;
    currentUserId: string;
}
interface IState{
   message: string;
   messages: IMessage[]
}

class LoginForm extends Component<IProps, IState> {
    state={
        message: '',
        messages: []
    };
    componentDidMount(){
        this.getAllMessages()
            .then((res) => {
                this.setState({messages: res.data});
                this.connectToSocket();
            console.log(res);
        });
    }
    connectToSocket = () => {
        const socket = socketIOClient('http://localhost:4000');
        socket.emit('refreshChat', { data: 'some sample data' });
        socket.on("FromAPI", (data: any) => {
            this.setState({ messages: data.data })
        });
    }
    onChange = (event: any) => this.setState({message: event.currentTarget.value});
    postMessage = async () => axios({url:'http://localhost:4000/message',
        data: {message: this.state.message, author: this.props.currentUserId, authorName: this.props.currentUserName}, method: 'post'});
    getAllMessages = async () => axios({url:'http://localhost:4000/messages'});
    onSubmit = async() => {
        let user = null;
        try {
            const message = await this.postMessage();
            if(message && message.data ){
                this.setState({message: ''})
            }
            console.log(user);
        } catch (err) {
            console.log(err)
        }
    }

    render() {
        return (
            <>
                <Messages messages={this.state.messages} currentUserId={this.props.currentUserId}/>
                <p>Your message</p>
                <textarea
                    onChange={this.onChange}
                    value={this.state.message}
                />
                <Button onClick={this.onSubmit}>Submit</Button>
            </>

        )
    }
};
export default LoginForm;