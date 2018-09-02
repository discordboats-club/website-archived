import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Markdown from 'react-markdown';

import './View.scss'

export default class View extends Component {
    constructor(props) {
        super(props)
        this.bot = props.bot
    }
    
    render() {
        return (
            <div className="page">
                <div class="sidebar">
                    <img src={this.bot.avatarUrl} alt={`${this.bot.username}'s icon`} className="image"/>
                    <h3>{this.bot.username + this.bot.premium ? <small>[premium]</small> : ''}</h3>
                    <p>{this.bot.shortDesc}</p>
                    <ul className="horizontal-list">
                        {this.bot.botTags.map(tag => {<li className="tag">{tag}</li>})}
                    </ul>
                </div>
                <div className="main-article">
                    <img src={this.bot.avatarUrl} alt={`${this.bot.username}'s icon`} className="image-center"/>
                    <h1>{this.bot.tag}</h1>
                    <ul className="attr-list">
                        <li className="attr">Views: {this.bot.views}</li>
                        {this.bot.premium ? <li className="attr">Premium</li> : ''}
                    </ul>
                    <Markdown source={this.bot.longDesc} />
                </div>
            </div>
        )
    }
}

View.propTypes = {
    bot: PropTypes.object
}
