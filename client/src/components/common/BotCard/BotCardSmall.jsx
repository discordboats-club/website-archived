import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './BotCardSmall.css';

export default class BotCardSmall extends Component {
    constructor(props) {
        super(props)
        this.bot = props.bot
    }
    
    render() {
        return (
            <div className = "card">
                <img src={this.bot.avatarUrl} alt = {`${this.bot.username}'s icon`} width="196px" height="196px"/>
                <div className = "details">
                    <h2>{this.bot.username}<small>{this.bot.premium ? '[premium]' : ''}</small></h2>
                </div>
            </div>
        );
    }
}

BotCardSmall.propTypes = {
    bot: PropTypes.object
}
