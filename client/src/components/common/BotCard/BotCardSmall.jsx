import React, { Component} from 'react';

import './BotCardSmall.css';

export default class BotCardSmall extends Component {
    render() {
        return (
            <div className = "card">
                <img src = "http://icons.iconarchive.com/icons/graphicloads/100-flat/256/home-icon.png" alt = "bot's icon" width="196px" height="196px"/>
                <div className = "details">
                    <h2>Bot's Name</h2>
                </div>
            </div>
        );
    }

}