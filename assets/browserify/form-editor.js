'use strict';

// load CodeMirror & plugins
const CodeMirror = require('codemirror');
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/css/css');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/addon/fold/xml-fold');
require('codemirror/addon/edit/matchtags');
require('codemirror/addon/edit/closetag.js');

let editor, element, dom, requiredFieldsInput, emailFieldsInput;

function init() {
    element = document.getElementById('hf-form-editor');
    dom = document.createElement('form');
    requiredFieldsInput = document.getElementById('hf-required-fields');
    emailFieldsInput = document.getElementById('hf-email-fields');

    dom.innerHTML = element.value;

    editor = CodeMirror.fromTextArea(element, {
        selectionPointer: true,
        matchTags: { bothTags: true },
        mode: "htmlmixed",
        htmlMode: true,
        autoCloseTags: true,
        autoRefresh: true
    });

    editor.on('update', updateShadowDOM);
    editor.on('blur', updateRequiredFields);
    editor.on('blur', updateEmailFields);
}

function updateShadowDOM() {
    dom.innerHTML = editor.getValue();
}

function updateRequiredFields() {
    let fields = dom.querySelectorAll('[required]');
    let fieldNames = [].map.call(fields, (f) => f.name.replace('[]', '').replace(/\[(\w+)\]/g, '.$1' ));
    requiredFieldsInput.value = fieldNames.join(',');
}

function updateEmailFields() {
    let fields = dom.querySelectorAll('input[type="email"]');
    let fieldNames = [].map.call(fields, (f) => f.name.replace('[]', '').replace(/\[(\w+)\]/g, '.$1' ));
    emailFieldsInput.value = fieldNames.join(',');
}

export default {
    'init': init,
};