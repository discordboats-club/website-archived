import React, { Component} from 'react';

import Markdown from 'react-markdown';
import './APIDocs.scss';

import docs from './docs.md';

export default class APIDocs extends Component {
    markdown = null;

    async componentWillMount() {
      const res = await fetch(docs);

      this.markdown = await res.text();
    }

    render() {
        return (
            <div className="page">
				<Markdown source={this.markdown} />
            </div>
        );
    }
}
