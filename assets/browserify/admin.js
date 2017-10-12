'use strict';

import Tabs from './admin-tabs.js';
import Editor from './admin-form-editor.js';
import Actions from './admin-form-actions.js';
import FieldBuilder from './admin-field-builder.js';

Tabs.init();

if( document.getElementById('hf-form-editor') ) {
    Editor.init();
    Actions.init();

    FieldBuilder.init(Editor);
}
