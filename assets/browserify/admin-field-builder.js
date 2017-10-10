'use strict';

import { h, Component, render } from 'preact';

class Clock extends Component {
    render() {
        return (
            <div>
                <h4>
                    Add field
                </h4>
                <div>
                    <a className="button">Text</a> &nbsp;
                    <a className="button">Email</a> &nbsp;
                    <a className="button">URL</a> &nbsp;
                    <a className="button">Number</a> &nbsp;
                    <a className="button">Date</a> &nbsp;
                    <a className="button">Textarea</a> &nbsp;
                    <a className="button">Dropdown Menu</a> &nbsp;
                    <a className="button">Checkboxes</a> &nbsp;
                    <a className="button">Radio buttons</a> &nbsp;
                    <a className="button">Submit</a> &nbsp;
                </div>
            </div>
        );
    }
}

export default {
    init: function() {
        render((
            <Clock />
        ), document.getElementById('hf-field-builder'));
    }
}