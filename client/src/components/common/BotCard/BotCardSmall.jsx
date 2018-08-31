import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './BotCardSmall.css'

export default class BotCardSmall extends Component {
    constructor(props) {
        super(props)
        this.bot = props.bot
    }
    
    render() {
        return (
            <div className="card">
                <img src={this.bot.avatarUrl} alt={`${this.bot.username}'s icon`} className="image"/>
                <div className="details">
                    <h2>{this.bot.username + this.bot.premium ? <small>[premium]</small> : ''}</h2>
                    <p>{this.bot.shortDesc}</p>
                    <h5>Tags</h5>
                    <ul className="horizontal-list">
                        {this.bot.botTags.map(tag => {<li>{tag}</li>})}
                    </ul>
                </div>
            </div>
        )
    }
}

BotCardSmall.propTypes = {
    bot: PropTypes.object
}
