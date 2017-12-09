"use strict";

const shim = require('es5-shim');
const serialize = require('form-serialize');
const Loader = require('./form-loading-indicator.js');
const vars = window.hf_js_vars || { ajax_url: window.location.href };
const EventEmitter = require('wolfy87-eventemitter');
const events = new EventEmitter();
import ConditionalElements from './conditional-elements.js';

function cleanFormMessages(formEl) {
    let messageElements = formEl.querySelectorAll('.hf-message');
    messageElements.forEach((el) => {
        el.parentNode.removeChild(el);
    })
}

function addFormMessage(formEl, message) {
    let txtElement = document.createElement('p');
    txtElement.className = 'hf-message hf-message-' + message.type;
    txtElement.innerHTML = message.text;
    formEl.insertBefore(txtElement, formEl.lastElementChild.nextElementSibling);
}

function handleSubmitEvents(e) {
    const formEl = e.target;

    // only act on html-forms
    if( formEl.className.indexOf('hf-form') < 0 ) {
        return;
    }

    e.preventDefault();
    submitForm(formEl);
}

function submitForm(formEl) {
    events.emit('submit', [formEl]);

    const data = serialize(formEl, { "hash": false, "empty": true });
    let request = new XMLHttpRequest();

    cleanFormMessages(formEl);
    request.onreadystatechange = createRequestHandler(formEl);
    request.open('POST', vars.ajax_url, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    request.send(data);
    request = null;
}

function createRequestHandler(formEl) {
    const loader = new Loader(formEl);
    loader.start();

    return function() {
        // are we done?
        if (this.readyState === 4) {
            let response;
            loader.stop();

            if (this.status >= 200 && this.status < 400) {
                try {
                    response = JSON.parse(this.responseText);
                } catch (error) {
                    console.log('HTML Forms: failed to parse AJAX response.\n\nError: "' + error + '"');
                    return;
                }

                events.emit('submitted', [formEl]);

                if( response.error ) {
                    events.emit('error', [formEl]);
                } else {
                    events.emit('success', [formEl]);
                }

                // Show form message
                if (response.message) {
                    addFormMessage(formEl, response.message);
                }

                // Should we hide form?
                if (response.hide_form) {
                    formEl.querySelector('.hf-fields-wrap').style.display = 'none';
                }

                // Should we redirect?
                if (response.redirect_url) {
                    window.location = response.redirect_url;
                }

                // clear form
                if (!response.error) {
                    formEl.reset();
                }
            } else {
                // Server error :(
                console.log(this.responseText);
            }
        }
    }
}


document.addEventListener('submit', handleSubmitEvents, true);
ConditionalElements.init();

window.html_forms = {
    'on': events.on.bind(events),
};
