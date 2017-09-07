'use strict';

// load CodeMirror & plugins
var CodeMirror = require('codemirror');
require('codemirror/mode/xml/xml');
require('codemirror/mode/javascript/javascript');
require('codemirror/mode/css/css');
require('codemirror/mode/htmlmixed/htmlmixed');
require('codemirror/addon/fold/xml-fold');
require('codemirror/addon/edit/matchtags');
require('codemirror/addon/edit/closetag.js');


let element = document.querySelector('#hf-form-editor');
let editor = CodeMirror.fromTextArea(element, {
    selectionPointer: true,
    matchTags: { bothTags: true },
    mode: "htmlmixed",
    htmlMode: true,
    autoCloseTags: true,
    autoRefresh: true
});

let tabs = document.querySelectorAll('.hf-tab');
let tabNavs = document.querySelectorAll('#hf-tabs-nav a');
for(let i=0; i<tabNavs.length; i++) {
    tabNavs[i].addEventListener('click', openTab);
}

function openTab(e) {
    let tabTarget = this.getAttribute('data-tab-target');
    for(let i=0; i<tabs.length; i++) {
        let tab = tabs[i];
        tab.classList.toggle('hf-tab-active', tab.getAttribute('data-tab') === tabTarget);
    }

    e.preventDefault();
}