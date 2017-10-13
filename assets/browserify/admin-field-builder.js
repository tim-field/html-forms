'use strict';

import { h, Component, render } from 'preact';
import linkState from 'linkstate';
import { AddToForm, Required, DefaultValue, Placeholder, Label, Wrap, Choices, ButtonText } from './field-builder/config-fields.js';
import { htmlgenerate } from './field-builder/html.js';
let Editor;
import { bind } from 'decko';

const fields = {
    "text": "Text",
    "email": "Email",
    "url": "URL",
    "number": "Number",
    "date": "Date",
    "textarea": "Textarea",
    "dropdown": "Dropdown",
    "checkboxes": "Checkboxes",
    "radio-buttons": "Radio buttons",
    "submit": "Submit button",
};

class FieldBuilder extends Component {
    constructor() {
        super();

        this.state = {
            fieldType: "",
        };
    }

    @bind
    handleCancel() {
        this.setState({
            fieldType: "",
        });
    }

    render(props, state) {
        const fieldButtons = Object.keys(fields).map((key) => {
                let label = fields[key];
                return (
                    <button type="button" value={key} className={"button " + ( state.fieldType === key ? "active" : "")}
                        onClick={linkState(this, 'fieldType')}>{label}</button>
                )
            }
        );

        return (
            <div class="hf-field-builder">
                <h4>
                    Add field
                </h4>
                <div class="available-fields">
                    {fieldButtons}
                </div>
                <div style="max-width: 480px;">
                    <FieldConfigurator fieldType={state.fieldType} onCancel={this.handleCancel} />
                </div>
                {state.fieldType === "" ? <p class="help" style="margin-bottom: 0;">Use the buttons above to generate your field HTML, or manually modify your form below.</p> : ""}
            </div>
        );
    }
}

class FieldConfigurator extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fieldType: props.fieldType,
            fieldLabel: "",
            placeholder: "",
            value: "",
            wrap: true,
            required: false,
            choices: [
                {
                    checked: false,
                    label: "One",
                },
                {
                    checked: false,
                    label: "Two",
                },
            ],
        };

        this.choiceHandlers = {
            "add": this.addChoice,
            "delete": this.deleteChoice,
            "changeLabel": this.changeChoiceLabel,
            "toggleChecked": this.toggleChoiceChecked,
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            fieldType: props.fieldType,
        });
    }

    @bind
    addToForm() {
        const html = htmlgenerate(this.state);
        Editor.replaceSelection(html);
    }

    @bind
    addChoice() {
        let arr = this.state.choices;
        arr.push({ checked: false, label: "..." });
        this.setState({choices: arr });
    }

    @bind
    deleteChoice(e) {
        let arr = this.state.choices;
        let index = e.target.parentElement.getAttribute('data-key');
        arr.splice(index, 1);
        this.setState({choices: arr });
    }

    @bind
    changeChoiceLabel(e) {
        let arr = this.state.choices;
        let index = e.target.parentElement.getAttribute('data-key');
        arr[index].label = e.target.value;
        this.setState({choices: arr });
    }

    @bind
    toggleChoiceChecked(e) {
        let arr = this.state.choices;
        let index = e.target.parentElement.getAttribute('data-key');
        arr[index].checked = !arr[index].checked;
        this.setState({choices: arr });
    }

    @bind
    static handleKeyPress(e) {
        // stop RETURN from submitting the parent form.
        if(e.keyCode === 13) {
            e.preventDefault();
        }
    }

    @bind
    handleCancel() {
        this.props.onCancel();
    }

    render(props, state) {
        console.log(state);

        if(state.fieldType === "") {
            return "";
        }

        let formFields;

        switch(state.fieldType) {
            case "text":
            case "email":
            case "url":
            case "number":
            case "textarea":
                formFields = (
                    <div>
                        <Label value={state.fieldLabel} onChange={linkState(this, 'fieldLabel')}/>
                        <Placeholder value={state.placeholder} onChange={linkState(this, 'placeholder')}/>
                        <DefaultValue value={state.value} onChange={linkState(this, 'value')}/>
                        <Required checked={state.required} onChange={linkState(this, 'required')}/>
                        <Wrap checked={state.wrap} onChange={linkState(this, 'wrap')}/>
                        <AddToForm onSubmit={this.addToForm} onCancel={this.handleCancel} />
                    </div>
                );
                break;
            case "submit":
                formFields = (
                    <div>
                        <ButtonText value={state.value} onChange={linkState(this, 'value')}/>
                        <Wrap checked={state.wrap} onChange={linkState(this, 'wrap')}/>
                        <AddToForm onSubmit={this.addToForm} onCancel={this.handleCancel} />
                    </div>
                );
                break;

            case "date":
                formFields = (
                    <div>
                        <Label value={state.fieldLabel} onChange={linkState(this, 'fieldLabel')}/>
                        <DefaultValue value={state.value} onChange={linkState(this, 'value')}/>
                        <Required checked={state.required} onChange={linkState(this, 'required')}/>
                        <Wrap checked={state.wrap} onChange={linkState(this, 'wrap')}/>
                        <AddToForm onSubmit={this.addToForm} onCancel={this.handleCancel} />
                    </div>
                );
                break;
            case "dropdown":
                formFields = (
                    <div>
                        <Label value={state.fieldLabel} onChange={linkState(this, 'fieldLabel')} />
                        <Choices multiple={false} choices={state.choices} handlers={this.choiceHandlers} />
                        <Required checked={state.required} onChange={linkState(this, 'required')}/>
                        <Wrap checked={state.wrap} onChange={linkState(this, 'wrap')} />
                        <AddToForm onSubmit={this.addToForm} onCancel={this.handleCancel} />
                    </div>
                );
                break;

            case "radio-buttons":
            case "checkboxes":
                formFields = (
                    <div>
                        <Label value={state.fieldLabel} onChange={linkState(this, 'fieldLabel')}/>
                        <Choices multiple={state.fieldType === "checkboxes"} choices={state.choices} handlers={this.choiceHandlers} />
                        <Wrap checked={state.wrap} onChange={linkState(this, 'wrap')} />
                        <AddToForm onSubmit={this.addToForm} onCancel={this.handleCancel} />
                    </div>
                );
                break;
        }

        return (
            <div class="field-config" onKeyPress={FieldConfigurator.handleKeyPress}>
                {formFields}
            </div>
        )
    }
}



export default {
    init: function(editor) {
        Editor = editor;

        render((
            <FieldBuilder />
        ), document.getElementById('hf-field-builder'));
    }
}