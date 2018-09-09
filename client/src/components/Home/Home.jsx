import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Helmet } from "react-helmet";

import BotCardSmall from "../common/BotCard/BotCardSmall"

import { BASE } from '../../api/index'

import './Home.scss'

export default class Home extends Component {
    constructor(props) {
        super(props)
        this.bots = []
    }
    
    async componentWillMount() {
        let res = await fetch(BASE + '/api/bots')
        this.bots = JSON.parse(res)
    }
    
    render() {
        return (
            <div className="page">
                <Helmet>
                    <title>Discordboats | Home</title>
                    
                    <meta property='og:title' content='Discordboats | Home' />
                    <meta property='og:url' content='https://discordboats.club/'/>
                    <meta property='og:site_name' content='discordboats.club' />
                    <meta property='og:type' content='website' />
                    <meta property='og:image' content='LOGO URL' />
                </Helmet>
                {this.bots.map(bot => {<BotCardSmall bot={bot} />})}
            </div>
        )
    }
}

BotCardSmall.propTypes = {
    bots: PropTypes.array
}
