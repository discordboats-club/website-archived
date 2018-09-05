import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Label, Card } from 'semantic-ui-react';

import './BotCardSmall.scss'

export default class BotCardSmall extends Component {
    constructor(props) {
        super(props)
        this.bot = props.bot
    }
    
    render() {
        return (
            <Card
                image={this.bot.avatarURL}
                header={this.bot.username}
                meta={this.bot.library}
                description={this.bot.shortDesc}
                extra={this.bot.botTags.map(t => {<Label color='blue'>{t}</Label>})}
            />
        )
    }
}

BotCardSmall.propTypes = {
    bot: PropTypes.object
}
