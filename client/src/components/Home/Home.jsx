import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import { Header } from 'semantic-ui-react'

import BotCardSmall from "../common/BotCard/BotCardSmall";

import { BASE } from '../../api/index';

import './Home.scss';

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.bots = [];
        this.featuredBots= []
    }
    
    async componentWillMount() {
        const res = await fetch(`${BASE}/api/bots`, { mode: 'no-cors' });
        const json = await res.json();
        this.bots = json.bots;

        // featured bots
        const res = await fetch(`${BASE}/api/bots/featured`, { mode: 'no-cors' });
        const json = await res.json();
        this.featuredBots = json.bots;
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
                <hr />
                <Header as='h3'>Featured</Header>
                {this.featuredBots.map(bot => {<BotCardSmall bot={bot} />})}
            </div>
        );
    }
}

Home.propTypes = {
    bots: PropTypes.array,
    featuredBots: PropTypes.array
};
