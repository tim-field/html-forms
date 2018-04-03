'use strict';

import { h, Component, render } from 'preact';
import linkState from 'linkstate';
import { AddToForm, Required, DefaultValue, Placeholder, Label, Wrap, Choices, ButtonText } from './field-builder/config-fields.js';
import { htmlgenerate } from './field-builder/html.js';
import { bind } from 'decko';

function Field(key, label, configRows) {
    this.key = key;
    this.label = label;
    this.configRows = configRows || [];
}

let Editor;
let fields = [
    new Field("text", "Text", [ "label", "placeholder", "default-value", "required", "wrap", "add-to-form" ]),
    new Field("email", "Email", ["label", "placeholder", "default-value", "required", "wrap", "add-to-form"]),
    new Field("url", "URL", ["label", "placeholder", "default-value", "required", "wrap", "add-to-form"]),
    new Field("number", "Number", ["label", "placeholder", "default-value", "required", "wrap", "add-to-form"]),
    new Field("date", "Date", [ "label", "default-value", "required", "wrap", "add-to-form" ]),
    new Field("textarea", "Textarea", ["label", "placeholder", "default-value", "required", "wrap", "add-to-form"]),
    new Field("dropdown", "Dropdown", [ "label", "choices", "required", "wrap" ,"add-to-form" ]),
    new Field("checkboxes", "Checkboxes", [ "label", "choices", "wrap" ,"add-to-form" ]),
    new Field("radio-buttons", "Radio buttons", [ "label", "choices", "wrap" ,"add-to-form" ]),
    new Field("submit", "Submit button", [ "button-text", "wrap", "add-to-form" ]),
];

function getField(key) {
    for(let i=0; i<fields.length; i++) {
        if(fields[i].key === key) {
            return fields[i];
        }
    }

    return undefined;
}

class FieldBuilder extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeField: null,
        };
    }

    @bind
    handleCancel() {
        this.setState({
            activeField: null,
        });
    }

    @bind
    openFieldConfig(e) {
        let newFieldKey = e.target.value;
        let field = getField(newFieldKey);

        if( this.state.activeField === field ) {
            this.setState({ activeField: null });
        } else {
            this.setState({ activeField: field });
        }
    }

    render(props, state) {
        const fieldButtons = props.fields.map((f) => {
                return (
                    <button type="button" value={f.key} className={"button " + ( state.activeField === f ? "active" : "")} onClick={this.openFieldConfig}>{f.label}</button>
                )
            }
        );
        const fieldType = state.activeField ? state.activeField.key : "";
        const rows = state.activeField ? state.activeField.configRows : [];

        return (
            <div class="hf-field-builder">
                <h4>
                    Add field
                </h4>
                <div class="available-fields">
                    {fieldButtons}
                </div>
                <div style="max-width: 480px;">
                    <FieldConfigurator fieldType={fieldType} rows={rows} onCancel={this.handleCancel} />
                </div>
                {state.activeField === null ? <p class="help" style="margin-bottom: 0;">Use the buttons above to generate your field HTML, or manually modify your form below.</p> : ""}
            </div>
        );
    }
}

class FieldConfigurator extends Component {
    constructor(props) {
        super(props);

        this.state = this.getInitialState();
        this.choiceHandlers = {
            "add": this.addChoice,
            "delete": this.deleteChoice,
            "changeLabel": this.changeChoiceLabel,
            "toggleChecked": this.toggleChoiceChecked,
        }
    }

    getInitialState() {
       return {
            fieldType: "",
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
    }

    componentWillReceiveProps(props) { 
        this.setState({ fieldType: props.fieldType })
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
        // revert back to initial state
        this.setState(this.getInitialState());
        this.props.onCancel();
    }

    render(props, state) {
        if(props.rows.length == 0) {
            return "";
        }

        let formFields = [];

        for(let i=0; i < props.rows.length; i++) {
            switch(props.rows[i]) {
                case "label":
                    formFields.push(<Label value={state.fieldLabel} onChange={linkState(this, 'fieldLabel')}/>);
                break;

                case "placeholder":
                    formFields.push(<Placeholder value={state.placeholder} onChange={linkState(this, 'placeholder')}/>);
                break;

                case "default-value":
                    formFields.push(<DefaultValue value={state.value} onChange={linkState(this, 'value')}/>);
                break;

                case "required":
                    formFields.push(<Required checked={state.required} onChange={linkState(this, 'required')}/>);
                break;

                case "wrap":
                    formFields.push(<Wrap checked={state.wrap} onChange={linkState(this, 'wrap')}/>);
                break;

                case "add-to-form":
                    formFields.push(<AddToForm onSubmit={this.addToForm} onCancel={this.handleCancel} />);
                break;

                case "choices":
                    formFields.push(<Choices multiple={false} choices={state.choices} handlers={this.choiceHandlers} />);
                break;

                case "button-text":
                    formFields.push(<ButtonText value={state.value} onChange={linkState(this, 'value')}/>);
                break;

            }
        }

        return (
            <div class="field-config" onKeyPress={FieldConfigurator.handleKeyPress}>
                {formFields}
            </div>
        )
    }
}

let el;
function mount() {
    el = render(<FieldBuilder fields={fields} />, document.getElementById('hf-field-builder'), el);     
}

export default {
    init: function(editor) {
        Editor = editor;
        mount();
    },

    registerField: function(key, label, configRows) {
        fields.push(new Field(key, label, configRows));
        mount();
    }
}
