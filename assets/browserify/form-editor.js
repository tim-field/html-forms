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


let element = document.querySelector('#hf-form-editor');
if( element ) {
    let editor = CodeMirror.fromTextArea(element, {
        selectionPointer: true,
        matchTags: { bothTags: true },
        mode: "htmlmixed",
        htmlMode: true,
        autoCloseTags: true,
        autoRefresh: true
    });
}
