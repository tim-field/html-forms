'use strict';

import Tabs from './admin-tabs.js';
import Editor from './admin-form-editor.js';
import Actions from './admin-form-actions.js';

Tabs.init();

if( document.getElementById('hf-form-editor') ) {
    Editor.init();
    Actions.init();
}
