import { h } from 'preact';

function AddToForm(props){
    return (
        <div class="hf-small-margin">
            <button class="button" type="button" onClick={props.onSubmit}>Add to form</button> &nbsp; <a href="javascript:void(0);" class="hf-small" style="vertical-align: middle;" onClick={props.onCancel}>or close field helper</a>
        </div>
    )
}

function Label(props){
    return (
        <div class="hf-small-margin">
            <label for="hf-fg-field-label">Field label</label>
            <input id="hf-fg-field-label" type="text" value={props.value} onChange={props.onChange} />
        </div>
    )
}

function Placeholder(props){
    return (
        <div class="hf-small-margin">
            <label for="hf-fg-placeholder">Placeholder <span class="hf-italic hf-pull-right">Optional</span></label>
            <input id="hf-fg-placeholder" type="text" value={props.value} onChange={props.onChange} />
            <p class="help">Text to show when field has no value.</p>
        </div>
    )
}

function DefaultValue(props){
    return (
        <div class="hf-small-margin">
            <label for="hf-fg-default-value">Default value <span class="hf-italic hf-pull-right">Optional</span></label>
            <input id="hf-fg-default-value" type="text" value={props.value} onChange={props.onChange} />
            <p class="help">Text to pre-fill this field with.</p>
        </div>
    )
}

function Wrap(props) {
    return (
        <div class="hf-small-margin">
            <label class="inline">
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

export {
    AddToForm, Label, Placeholder, DefaultValue, Wrap, RequiredField
}