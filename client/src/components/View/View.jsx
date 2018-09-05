import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Markdown from 'react-markdown';

import { Image, List, Header, Divider, Label, Segment } from 'semantic-ui-react';

import './View.scss'
const prodURL = "https://api.discordboats.club/api/bots"
const devURL = "https://dboatsapi.sdfx.ga/api/bots"

export default class View extends Component {
    constructor(props) {
        super(props)
        this.match = props.match
    }
    
    componentWillMount() {
        fetch(devURL).then(res => {
            this.bot = JSON.parse(res).find(b => this.match.params.id === b.botId)
        })
    }
    
    render() {
        return (
            <div className="page">
                <aside>
                    <Image src={this.bot.avatarUrl} alt={`${this.bot.username}'s icon`} fluid/>
                    <Header as='h4'>{this.bot.username + this.bot.premium ? <Label color='green'>Premium</Label> : ''}</Header>
                    <Segment color='blue'>{this.bot.shortDesc}</Segment>
                    <List horizontal>
                        {this.bot.botTags.map(tag => {<List.Item>
                            <List.Content>
                                <List.Header>
                                    <Label color='blue'>{tag}</Label>
                                </List.Header>
                            </List.Content>
                        </List.Item>})}
                    </List>
                </aside>
                <article>
                    <Image src={this.bot.avatarUrl} alt={`${this.bot.username}'s icon`} size='medium' centered circular/>
                    <Header as='h1'>{this.bot.tag}</Header>
                    <Header as='h3'>{this.bot.shortDesc}</Header>
                    <List horizontal size='tiny'>
                        {this.bot.premium ? <List.Item>
                            <List.Content>
                                <List.Header>Premium</List.Header>
                            </List.Content>
                        </List.Item> : ''}
                        <List.Item>
                            <List.Content>
                                <List.Header>Views: {this.bot.views}</List.Header>
                            </List.Content>
                        </List.Item>
                    </List>
                    <Divider />
                    <Markdown source={this.bot.longDesc} />
                </article>
            </div>
        )
    }
}

View.propTypes = {
    bot: PropTypes.object
}
