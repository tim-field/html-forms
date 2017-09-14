'use strict';

import Tabs from './admin-tabs.js';
import Editor from './admin-form-editor.js';

Tabs.init();

if( document.getElementById('hf-form-editor') ) {
    Editor.init();
}
