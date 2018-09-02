<<<<<<< HEAD
import React, { Component } from 'react';
import PropTypes from 'prop-types';
=======
import React, { Component } from 'react'
import PropTypes from 'prop-types'
>>>>>>> 414d14fd0f3c3cc1c40c7db420594095092a7bb9

import './BotCardSmall.scss'

export default class BotCardSmall extends Component {
    constructor(props) {
        super(props)
        this.bot = props.bot
    }
    
    render() {
        return (
<<<<<<< HEAD
            <div className = "card">
                <img src={this.bot.avatarUrl} alt = {`${this.bot.username}'s icon`} width="196px" height="196px"/>
                <div className = "details">
                    <h2>{this.bot.username}<small>{this.bot.premium ? '[premium]' : ''}</small></h2>
=======
            <div className="card">
                <img src={this.bot.avatarUrl} alt={`${this.bot.username}'s icon`} className="image"/>
                <div className="details">
                    <h2>{this.bot.username + this.bot.premium ? <small>[premium]</small> : ''}</h2>
                    <p>{this.bot.shortDesc}</p>
                    <h5>Tags</h5>
                    <ul className="horizontal-list">
                        {this.bot.botTags.map(tag => {<li>{tag}</li>})}
                    </ul>
>>>>>>> 414d14fd0f3c3cc1c40c7db420594095092a7bb9
                </div>
            </div>
        )
    }
}

BotCardSmall.propTypes = {
    bot: PropTypes.object
}
