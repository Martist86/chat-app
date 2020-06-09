import React, {Component} from 'react';
import {Button} from 'react-bootstrap';
import axios from 'axios';

interface IProps{
    onSubmit: (id: string, authorName: string) => void;
}
interface IState{
    pass: string | null;
    login: string | null;
    toLogin: boolean;
}

class LoginForm extends Component<IProps, IState> {
    state={
        login: '',
        pass: '',
        toLogin: true
    }
    onChangeLogin = (event: React.FormEvent<HTMLInputElement>) => this.setState({login: event.currentTarget.value});
    onChangePass = (event: React.FormEvent<HTMLInputElement>) => this.setState({pass: event.currentTarget.value});
    login = async() => axios({url:'http://localhost:4000/login', data: {email: this.state.login, password: this.state.pass}, method: 'post'});
    register = async() => axios.post('http://localhost:4000/register', {email: this.state.login, password: this.state.pass});
    onSubmit = async() => {
        let user = null;
        try {
            user =  this.state.toLogin ?  await this.login() : await this.register();
            console.log(user);
        } catch(err) {
           console.log(err);
        }
        if (user && user.data) {
            this.props.onSubmit(user.data._id, user.data.email )
        }
    }

    render() {
        return (
            <>
                <h3>Login or register</h3>
                <div>
                <label>
                    Login
                    <input type="radio" checked={this.state.toLogin} onClick={() => this.setState({toLogin: true})} />
                </label>
                <label>
                    Register
                    <input type="radio" checked={!this.state.toLogin} onClick={() => this.setState({toLogin: false})} />
                </label>
                </div>
                <input
                    placeholder="Username"
                    onChange={this.onChangeLogin}
                    type="text"
                    value={this.state.login || ''}
                />
                <input
                    placeholder="Pass"
                    onChange={this.onChangePass}
                    type="password"
                    value={this.state.pass || ''}
                />
                <Button onClick={this.onSubmit}>Submit</Button>
            </>

        )
    }
};
export default LoginForm;