import React, { Component } from 'react'
import PropTypes from 'prop-types'

import BotCardSmall from "../common/BotCard/BotCardSmall"

import './Home.scss'

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.bots = [ // some test data, soon will be replaced with `props.bots`
            {
                username: "List Boat",
                avatarUrl: "https://this-is-why.nobody-loves.me/i/a9d9g7n1.png",
                shortDesc: "A Boat",
                premium: true,
                botTags: ['list', 'bot']
            },
            {
                username: "Mini Me",
                avatarUrl: "https://this-is-why.nobody-loves.me/i/a9d9g7n1.png",
                shortDesc: "Another Boat",
                premium: false,
                botTags: ['sidekick', 'bot']
            }
        ]
    }
    
    render() {
        return (
            <div className="page">
                {this.bots.map(bot => {<BotCardSmall bot={bot} />})}
            </div>
        )
    }
}

BotCardSmall.propTypes = {
    bots: PropTypes.array
}
