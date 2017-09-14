'use strict';

import { Component } from 'preact';

class Clock extends Component {
    render() {
        let time = new Date().toLocaleTimeString();
        return <span data-slug="foofooofoooo">{ time }</span>;
    }
}

export default Clock;