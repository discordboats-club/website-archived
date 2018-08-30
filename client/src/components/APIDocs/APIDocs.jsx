import React, { Component} from 'react';

import {observable, action} from 'mobx';
import {observer} from 'mobx-react';

import Markdown from 'react-markdown';
import './APIDocs.css';

import docs from './docs.md';

@observer
export default class APIDocs extends Component {
    @observable
    markdown = null;

    @action
    async componentWillMount() {
      const res = await fetch(docs);

      this.markdown = await res.text();
    }

    render() {
        return (
            <div className="APIDocs">
				<Markdown source={this.markdown} />
            </div>
        );
    }
}
