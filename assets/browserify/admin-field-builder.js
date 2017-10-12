'use strict';

import { h, Component, render } from 'preact';
import linkState from 'linkstate';
import renderToString from 'preact-render-to-string';
import htmlutil from 'html';

class FieldBuilder extends Component {
    constructor() {
        super();

        this.state = {
            fieldType: "",
        };

        this.setFieldType = this.setFieldType.bind(this);
    }

    setFieldType(e) {
       this.setState({ fieldType: e.target.value });
    }

    render() {
        return (
            <div class="hf-field-builder">
                <h4>
                    Add field
                </h4>
                <div>
                    <button type="button" value="text" className="button" onClick={linkState(this, 'fieldType')}>Text</button> &nbsp;
                    <button type="button" value="email" className="button" onClick={linkState(this, 'fieldType')}>Email</button> &nbsp;
                    <button type="button" value="url" className="button" onClick={linkState(this, 'fieldType')}>URL</button> &nbsp;
                    <button type="button" value="number" className="button" onClick={linkState(this, 'fieldType')}>Number</button> &nbsp;
                    <button type="button" value="date" className="button" onClick={linkState(this, 'fieldType')}>Date</button> &nbsp;
                    <button type="button" value="textarea" className="button" onClick={linkState(this, 'fieldType')}>Textarea</button> &nbsp;
                    <button type="button" value="dropdown" className="button" onClick={linkState(this, 'fieldType')}>Dropdown Menu</button> &nbsp;
                    <button type="button" value="checkboxes" className="button" onClick={linkState(this, 'fieldType')}>Checkboxes</button> &nbsp;
                    <button type="button" value="radio-buttons" className="button" onClick={linkState(this, 'fieldType')}>Radio buttons</button> &nbsp;
                    <button type="button" value="submit" className="button" onClick={linkState(this, 'fieldType')}>Submit</button> &nbsp;
                </div>
                <div style="max-width: 480px;">
                    <FieldConfigurator fieldType={this.state.fieldType} />
                </div>
            </div>
        );
    }
}

class FieldConfigurator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fieldType: props.fieldType,
            required: false,
            placeholder: "",
            defaultValue: "",
            fieldLabel: "",
            wrap: true,
        };

        this.addToForm = this.addToForm.bind(this)
        this.handleKeyPress = this.handleKeyPress.bind(this)
    }

    componentWillReceiveProps(props) {
        this.setState({ fieldType: props.fieldType })
    }

    addToForm() {
        let label = this.state.fieldLabel.length ? h("label", {}, this.state.fieldLabel ) : "";
        let field = h("input", filterEmptyObjectValues({
            type: this.state.fieldType,
            required: this.state.required,
            placeholder: this.state.placeholder,
            value: this.state.defaultValue,
        }));

        let html = "";
        if( this.state.wrap ) {
           let tmpl = h("p", {}, [label, field]);
           html = renderToString(tmpl);
        } else {
           html += renderToString(label);
           html += renderToString(field);
        }

        html = htmlutil.prettyPrint(html);
        console.log(html);

        // TODO: Add to editor here.
    }

    handleKeyPress(e) {
        if(e.keyCode === 13) {
            this.addToForm();
            e.preventDefault();
        }
    }

    render() {
        console.log(this.state);
        switch(this.state.fieldType) {
            case "":
            default:
                return "";

            case "text":
            case "email":
            case "url":
                return (
                    <div onKeyPress={this.handleKeyPress}>
                        <Label value={this.state.fieldLabel} onChange={linkState(this, 'fieldLabel')} />
                        <Placeholder value={this.state.placeholder}  onChange={linkState(this, 'placeholder')} />
                        <DefaultValue value={this.state.defaultValue}  onChange={linkState(this, 'defaultValue')} />
                        <RequiredField checked={this.state.required}  onChange={linkState(this, 'required')} />
                        <Wrap checked={this.state.wrap} onChange={linkState(this, 'wrap')} />
                        <AddToForm onClick={this.addToForm} />
                    </div>
                );
        }
    }
}

function filterEmptyObjectValues(obj) {
    let newObj = {};
    for (var propName in obj) {
        if( obj[propName] !== false && obj[propName] !== "" ) {
            newObj[propName] = obj[propName];
        }
    }
    return newObj;
}

function AddToForm(props){
    return (
        <div class="hf-small-margin">
            <button class="button" type="button" onClick={props.onClick}>Add to form</button>
        </div>
    )
}

function Label(props){
    return (
        <div class="hf-small-margin">
            <label>Field label</label>
            <input type="text" value={props.value} onChange={props.onChange} />
        </div>
    )
}

function Placeholder(props){
    return (
        <div class="hf-small-margin">
            <label>Placeholder <span class="hf-italic hf-pull-right">Optional</span></label>
            <input type="text" value={props.value} onChange={props.onChange} />
            <p class="help">Text to show when field has no value.</p>
        </div>
    )
}

function DefaultValue(props){
    return (
        <div class="hf-small-margin">
            <label>Default value <span class="hf-italic hf-pull-right">Optional</span></label>
            <input type="text" value={props.value} onChange={props.onChange} />
            <p class="help">Text to pre-fill this field with.</p>
        </div>
    )
}

function Wrap(props) {
    return (
        <div class="hf-small-margin">
            <label  class="inline">
                <input type="checkbox" value="1" defaultChecked={props.checked} onChange={props.onChange} />
                Wrap field in paragraph tags?
            </label>
        </div>
    )
}

function RequiredField(props) {
    return (
        <div class="hf-small-margin">
            <label class="inline">
                <input type="checkbox" value="1" defaultChecked={props.checked} onChange={props.onChange} />
                Required field?
            </label>
        </div>
    )
}

export default {
    init: function() {
        render((
            <FieldBuilder />
        ), document.getElementById('hf-field-builder'));
    }
}