import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Markdown from 'react-markdown';
import { Image, List, Header, Divider, Label, Segment } from 'semantic-ui-react';
import { Helmet } from "react-helmet";

import { BASE } from '../../api/index'

import './View.scss'
const prodURL = "https://api.discordboats.club/api/bots"
const devURL = "https://dboatsapi.sdfx.ga/api/bots"

export default class View extends Component {
    constructor(props) {
        super(props)
        this.id = props.params.id
    }
    
    async componentWillMount() {
        let res = await fetch(BASE + 'api/bots/' + this.id, {
            mode: 'no-cors'
        })
        this.bot = await JSON.parse(res)
    }
    
    render() {
        return (
            <div>
                <Helmet>
                    <title>Discordboats | {this.bot.username}</title>
                    
                    <meta property='og:title' content={'Discordboats | ' + this.bot.username} />
                    <meta property='og:url' content={'https://discordboats.club/view/' + this.bot.botId} />
                    <meta property='og:site_name' content='discordboats.club' />
                    <meta property='og:image' content={this.bot.avatarURL} />
                    <meta property='og:image:alt' content={this.bot.username + '\'s Avatar'} />
                    <meta property='og:type' content='website' />
                </Helmet>
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
