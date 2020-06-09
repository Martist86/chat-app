import React, { Component } from 'react';
import './App.css';
import LoginForm from "./LoginForm";
import ChatForm from "./ChatForm";

interface IState{
  currentUserId: string;
  currentUserName: string;
}
interface IProps{}
class App extends Component<IProps, IState> {
  state = {
    currentUserId: '',
    currentUserName: ''
  };

  loginUser = (currentUserId: string,currentUserName: string) =>  this.setState({currentUserName, currentUserId});

  render() {
    return (
        <div className="App">
          {this.state.currentUserId ?
          <ChatForm currentUserId={this.state.currentUserId} currentUserName={this.state.currentUserName} /> : <LoginForm onSubmit={this.loginUser} />
          }
        </div>
    );
  }
}

export default App;
