"use strict";

require('es5-shim');
const serialize = require('form-serialize');
const Loader = require('./form-loading-indicator.js');
const vars = window.hf_js_vars || { ajax_url: window.location.href };

function cleanFormMessages(formElement) {
    let messageElements = formElement.querySelectorAll('.hf-message');
    messageElements.forEach((el) => {
        el.parentNode.removeChild(el);
    })
}

function addFormMessage(formElement, message) {
    let txtElement = document.createElement('p');
    txtElement.className = 'hf-message hf-message-' + message.type;
    txtElement.innerHTML = message.text;
    formElement.insertBefore(txtElement, formElement.lastElementChild.nextElementSibling);
}


document.addEventListener('submit', function(e) {
    const formElement = e.target;
    if( formElement.className.indexOf('hf-form') < 0 ) {
        return;
    }

    e.preventDefault();

    submitForm(formElement);
}, true );


function submitForm(formElement) {
    const loader = new Loader(formElement);
    const data = serialize(formElement, { "hash": false, "empty": true });
    let request = new XMLHttpRequest();

    cleanFormMessages(formElement);
    loader.start();
    request.onreadystatechange = function() {
        let response;

        // are we done?
        if (this.readyState === 4) {
            loader.stop();

            if (this.status >= 200 && this.status < 400) {
                try {
                    response = JSON.parse(this.responseText);
                } catch(error) {
                    console.log( 'HTML Forms: failed to parse AJAX response.\n\nError: "' + error + '"' );

                    return;
                }

                // Show form message
                if(response.message) {
                    addFormMessage(formElement, response.message);
                }

                if( response.hide_form ) {
                    formElement.querySelector('.hf-fields-wrap').style.display = 'none';
                }

                // Should we redirect?
                if( response.redirect_url ) {
                    window.location = response.redirect_url;
                }

                // clear form
                formElement.reset();
            } else {
                // Server error :(
                console.log(this.responseText);
            }
        }
    };

    request.open('POST', vars.ajax_url, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    request.send(data);
    request = null;
}