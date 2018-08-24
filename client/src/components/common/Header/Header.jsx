import React, {Component} from 'react';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PersonIcon from '@material-ui/icons/Person';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import {observer} from 'mobx-react';
import {observable, action} from 'mobx';

import store from '../../../store';

import './Header.css';

@observer
export default class Header extends Component {
    @observable
    menuAnchorEl = null;

    @action
    handleClick = (event) => {
        this.menuAnchorEl = event.currentTarget;
    }

    @action
    handleClose = () => {
        this.menuAnchorEl = null;
    }

    getSearchInput() {

        return (
            <div className ="search">
                <input 
                    onKeyDown={this.handleKeyDown} 
                    type="text"
                    maxLength={19}
                    placeholder="Search Bots"
                    spellCheck="false"
                />
            </div>
        );

    }

    handleKeyDown(event) {
        if (event.key === "Enter") {

            // search !

            console.log('search boats');

        }
    }
    

    getLeftButtons() {
        if(!store.loggedIn) {
            return (
                <Button className="loginbtn btn">
                    Login
                </Button>
            );
        } else {
            return (
                <div>
                    <IconButton className="btn" aria-label="My Account" onClick={this.handleClick} aria-haspopup="true" aria-owns={this.menuAnchorEl ? 'account-menu' : null}>
                        <PersonIcon />
                    </IconButton>

                    <Menu
                        id="account-menu"
                        anchorEl={this.menuAnchorEl}
                        open={Boolean(this.menuAnchorEl)}
                        onClose={this.handleClose}
                    >
                        <MenuItem onClick={this.handleClose}>Profile</MenuItem>
                        <MenuItem onClick={this.handleClose}>Dashboard</MenuItem>
                        <MenuItem onClick={this.handleClose}>Log Out</MenuItem>
                    </Menu>
                </div>
            );
        }
    }

    render() {
        return (
            <div className="header">
                <img src={require('../../../assets/white_boat.png')} alt=""/>

                {this.getSearchInput()}

                <div className="leftbuttons">
                    {this.getLeftButtons()}

                    <Button className="discordbtn btn" onClick={this.navigateToDiscord}>
                        Discord
                    </Button>
                </div>
            </div>
        );
    } 

    navigateToDiscord() {
        window.location = 'https://discord.gg/BJQKpts';
    }
}
