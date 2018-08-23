import React, {Component} from 'react';

import Button from '@material-ui/core/Button';

import './Header.css';

export default class Header extends Component {
    render() {
        return (
            <div className="header">
                <img src={require('../../../assets/white_boat.png')} alt=""/>

                <div className="leftbuttons">
                    <Button color="white" className="discordbtn">
                        Our Discord
                    </Button>
                </div>
            </div>
        );
    }
}