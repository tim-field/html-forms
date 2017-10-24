'use strict';

import Tabs from './tabs.js';
import Editor from './form-editor.js';
import Actions from './form-actions.js';
import FieldBuilder from './field-builder.js';
import Confirmations from './action-confirmations.js';
Tabs.init();
Confirmations.init();

if( document.getElementById('hf-form-editor') ) {
    Editor.init();
    Actions.init();

    FieldBuilder.init(Editor);
}
