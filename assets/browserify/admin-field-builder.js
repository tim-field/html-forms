'use strict';

import { h, Component, render } from 'preact';
import linkState from 'linkstate';
import { AddToForm, Required, DefaultValue, Placeholder, Label, Wrap, Choices, ButtonText } from './field-builder/config-fields.js';
import { htmlgenerate } from './field-builder/html.js';
let Editor;


class FieldBuilder extends Component {
    constructor() {
        super();

        this.state = {
            fieldType: "",
        };

        this.handleCancel = this.handleCancel.bind(this)
    }

    handleCancel() {
        this.setState({ fieldType: "" })
    }

    render(props, state) {
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
                    <FieldConfigurator fieldType={this.state.fieldType} onCancel={this.handleCancel} />
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

        this.addToForm = this.addToForm.bind(this);
        FieldConfigurator.handleKeyPress = FieldConfigurator.handleKeyPress.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

        this.choiceHandlers = {
            "add": this.addChoice.bind(this),
            "delete": this.deleteChoice.bind(this),
            "changeLabel": this.changeChoiceLabel.bind(this),
            "toggleChecked": this.toggleChoiceChecked.bind(this),
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ fieldType: props.fieldType })
    }

    addToForm() {
        const html = htmlgenerate(this.state);
        Editor.replaceSelection(html);
    }

    addChoice(e) {
        let arr = this.state.choices;
        arr.push({ checked: false, label: "..." });
        this.setState({choices: arr });
    }

    deleteChoice(e) {
        let arr = this.state.choices;
        let index = e.target.parentElement.getAttribute('data-key');
        arr.splice(index, 1);
        this.setState({choices: arr });
    }

    changeChoiceLabel(e) {
        let arr = this.state.choices;
        let index = e.target.parentElement.getAttribute('data-key');
        arr[index].label = e.target.value;
        this.setState({choices: arr });
    }

    toggleChoiceChecked(e) {
        let arr = this.state.choices;
        let index = e.target.parentElement.getAttribute('data-key');
        arr[index].checked = !arr[index].checked;
        this.setState({choices: arr });
    }

    static handleKeyPress(e) {
        // stop RETURN from submitting the parent form.
        if(e.keyCode === 13) {
            e.preventDefault();
        }
    }

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