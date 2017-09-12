"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
    var require = undefined;var module = undefined;var exports = undefined;var define = undefined;(function e(t, n, r) {
        function s(o, u) {
            if (!n[o]) {
                if (!t[o]) {
                    var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
                }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
                    var n = t[o][1][e];return s(n ? n : e);
                }, l, l.exports, e, t, n, r);
            }return n[o].exports;
        }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
            s(r[o]);
        }return s;
    })({ 1: [function (require, module, exports) {
            'use strict';

            function getButtonText(button) {
                return button.innerHTML ? button.innerHTML : button.value;
            }

            function setButtonText(button, text) {
                button.innerHTML ? button.innerHTML = text : button.value = text;
            }

            function Loader(formElement) {
                this.form = formElement;
                this.button = formElement.querySelector('input[type="submit"], button[type="submit"]');
                this.loadingInterval = 0;
                this.character = "\xB7";

                if (this.button) {
                    this.originalButton = this.button.cloneNode(true);
                }
            }

            Loader.prototype.setCharacter = function (c) {
                this.character = c;
            };

            Loader.prototype.start = function () {
                if (this.button) {
                    // loading text
                    var loadingText = this.button.getAttribute('data-loading-text');
                    if (loadingText) {
                        setButtonText(this.button, loadingText);
                        return;
                    }

                    // Show AJAX loader
                    var styles = window.getComputedStyle(this.button);
                    this.button.style.width = styles.width;
                    setButtonText(this.button, this.character);
                    this.loadingInterval = window.setInterval(this.tick.bind(this), 500);
                } else {
                    this.form.style.opacity = '0.5';
                }
            };

            Loader.prototype.tick = function () {
                // count chars, start over at 5
                var text = getButtonText(this.button);
                var loadingChar = this.character;
                setButtonText(this.button, text.length >= 5 ? loadingChar : text + " " + loadingChar);
            };

            Loader.prototype.stop = function () {
                if (this.button) {
                    this.button.style.width = this.originalButton.style.width;
                    var text = getButtonText(this.originalButton);
                    setButtonText(this.button, text);
                    window.clearInterval(this.loadingInterval);
                } else {
                    this.form.style.opacity = '';
                }
            };

            module.exports = Loader;
        }, {}], 2: [function (require, module, exports) {
            "use strict";

            var serialize = require('form-serialize');
            var Loader = require('./form-loading-indicator.js');
            var vars = window.hf_js_vars || { ajax_url: window.location.href };

            function cleanFormMessages(formElement) {
                var messageElements = formElement.querySelectorAll('.hf-message');
                messageElements.forEach(function (el) {
                    el.parentNode.removeChild(el);
                });
            }

            function addFormMessage(formElement, message) {
                var txtElement = document.createElement('p');
                txtElement.className = 'hf-message hf-message-' + message.type;
                txtElement.innerHTML = message.text;
                formElement.insertBefore(txtElement, formElement.firstElementChild);
            }

            document.addEventListener('submit', function (e) {
                var formElement = e.target;
                if (formElement.className.indexOf('hf-form') < 0) {
                    return;
                }

                e.preventDefault();
                var loader = new Loader(formElement);
                var data = serialize(formElement);
                var request = new XMLHttpRequest();

                cleanFormMessages(formElement);
                loader.start();
                request.onreadystatechange = function () {
                    var response = void 0;

                    // are we done?
                    if (this.readyState === 4) {
                        loader.stop();

                        if (this.status >= 200 && this.status < 400) {
                            try {
                                response = JSON.parse(this.responseText);
                            } catch (error) {
                                console.log('HTML Forms: failed to parse AJAX response.\n\nError: "' + error + '"');

                                return;
                            }

                            // Show form message
                            if (response.message) {
                                addFormMessage(formElement, response.message);
                            }

                            if (response.hide_form) {
                                formElement.querySelector('.hf-fields-wrap').style.display = 'none';
                            }

                            // Should we redirect?
                            if (response.redirect_url) {
                                window.location = response.redirect_url;
                            }
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
            }, true);
        }, { "./form-loading-indicator.js": 1, "form-serialize": 3 }], 3: [function (require, module, exports) {
            // get successful control from form and assemble into object
            // http://www.w3.org/TR/html401/interact/forms.html#h-17.13.2

            // types which indicate a submit action and are not successful controls
            // these will be ignored
            var k_r_submitter = /^(?:submit|button|image|reset|file)$/i;

            // node names which could be successful controls
            var k_r_success_contrls = /^(?:input|select|textarea|keygen)/i;

            // Matches bracket notation.
            var brackets = /(\[[^\[\]]*\])/g;

            // serializes form fields
            // @param form MUST be an HTMLForm element
            // @param options is an optional argument to configure the serialization. Default output
            // with no options specified is a url encoded string
            //    - hash: [true | false] Configure the output type. If true, the output will
            //    be a js object.
            //    - serializer: [function] Optional serializer function to override the default one.
            //    The function takes 3 arguments (result, key, value) and should return new result
            //    hash and url encoded str serializers are provided with this module
            //    - disabled: [true | false]. If true serialize disabled fields.
            //    - empty: [true | false]. If true serialize empty fields
            function serialize(form, options) {
                if ((typeof options === "undefined" ? "undefined" : _typeof(options)) != 'object') {
                    options = { hash: !!options };
                } else if (options.hash === undefined) {
                    options.hash = true;
                }

                var result = options.hash ? {} : '';
                var serializer = options.serializer || (options.hash ? hash_serializer : str_serialize);

                var elements = form && form.elements ? form.elements : [];

                //Object store each radio and set if it's empty or not
                var radio_store = Object.create(null);

                for (var i = 0; i < elements.length; ++i) {
                    var element = elements[i];

                    // ingore disabled fields
                    if (!options.disabled && element.disabled || !element.name) {
                        continue;
                    }
                    // ignore anyhting that is not considered a success field
                    if (!k_r_success_contrls.test(element.nodeName) || k_r_submitter.test(element.type)) {
                        continue;
                    }

                    var key = element.name;
                    var val = element.value;

                    // we can't just use element.value for checkboxes cause some browsers lie to us
                    // they say "on" for value when the box isn't checked
                    if ((element.type === 'checkbox' || element.type === 'radio') && !element.checked) {
                        val = undefined;
                    }

                    // If we want empty elements
                    if (options.empty) {
                        // for checkbox
                        if (element.type === 'checkbox' && !element.checked) {
                            val = '';
                        }

                        // for radio
                        if (element.type === 'radio') {
                            if (!radio_store[element.name] && !element.checked) {
                                radio_store[element.name] = false;
                            } else if (element.checked) {
                                radio_store[element.name] = true;
                            }
                        }

                        // if options empty is true, continue only if its radio
                        if (val == undefined && element.type == 'radio') {
                            continue;
                        }
                    } else {
                        // value-less fields are ignored unless options.empty is true
                        if (!val) {
                            continue;
                        }
                    }

                    // multi select boxes
                    if (element.type === 'select-multiple') {
                        val = [];

                        var selectOptions = element.options;
                        var isSelectedOptions = false;
                        for (var j = 0; j < selectOptions.length; ++j) {
                            var option = selectOptions[j];
                            var allowedEmpty = options.empty && !option.value;
                            var hasValue = option.value || allowedEmpty;
                            if (option.selected && hasValue) {
                                isSelectedOptions = true;

                                // If using a hash serializer be sure to add the
                                // correct notation for an array in the multi-select
                                // context. Here the name attribute on the select element
                                // might be missing the trailing bracket pair. Both names
                                // "foo" and "foo[]" should be arrays.
                                if (options.hash && key.slice(key.length - 2) !== '[]') {
                                    result = serializer(result, key + '[]', option.value);
                                } else {
                                    result = serializer(result, key, option.value);
                                }
                            }
                        }

                        // Serialize if no selected options and options.empty is true
                        if (!isSelectedOptions && options.empty) {
                            result = serializer(result, key, '');
                        }

                        continue;
                    }

                    result = serializer(result, key, val);
                }

                // Check for all empty radio buttons and serialize them with key=""
                if (options.empty) {
                    for (var key in radio_store) {
                        if (!radio_store[key]) {
                            result = serializer(result, key, '');
                        }
                    }
                }

                return result;
            }

            function parse_keys(string) {
                var keys = [];
                var prefix = /^([^\[\]]*)/;
                var children = new RegExp(brackets);
                var match = prefix.exec(string);

                if (match[1]) {
                    keys.push(match[1]);
                }

                while ((match = children.exec(string)) !== null) {
                    keys.push(match[1]);
                }

                return keys;
            }

            function hash_assign(result, keys, value) {
                if (keys.length === 0) {
                    result = value;
                    return result;
                }

                var key = keys.shift();
                var between = key.match(/^\[(.+?)\]$/);

                if (key === '[]') {
                    result = result || [];

                    if (Array.isArray(result)) {
                        result.push(hash_assign(null, keys, value));
                    } else {
                        // This might be the result of bad name attributes like "[][foo]",
                        // in this case the original `result` object will already be
                        // assigned to an object literal. Rather than coerce the object to
                        // an array, or cause an exception the attribute "_values" is
                        // assigned as an array.
                        result._values = result._values || [];
                        result._values.push(hash_assign(null, keys, value));
                    }

                    return result;
                }

                // Key is an attribute name and can be assigned directly.
                if (!between) {
                    result[key] = hash_assign(result[key], keys, value);
                } else {
                    var string = between[1];
                    // +var converts the variable into a number
                    // better than parseInt because it doesn't truncate away trailing
                    // letters and actually fails if whole thing is not a number
                    var index = +string;

                    // If the characters between the brackets is not a number it is an
                    // attribute name and can be assigned directly.
                    if (isNaN(index)) {
                        result = result || {};
                        result[string] = hash_assign(result[string], keys, value);
                    } else {
                        result = result || [];
                        result[index] = hash_assign(result[index], keys, value);
                    }
                }

                return result;
            }

            // Object/hash encoding serializer.
            function hash_serializer(result, key, value) {
                var matches = key.match(brackets);

                // Has brackets? Use the recursive assignment function to walk the keys,
                // construct any missing objects in the result tree and make the assignment
                // at the end of the chain.
                if (matches) {
                    var keys = parse_keys(key);
                    hash_assign(result, keys, value);
                } else {
                    // Non bracket notation can make assignments directly.
                    var existing = result[key];

                    // If the value has been assigned already (for instance when a radio and
                    // a checkbox have the same name attribute) convert the previous value
                    // into an array before pushing into it.
                    //
                    // NOTE: If this requirement were removed all hash creation and
                    // assignment could go through `hash_assign`.
                    if (existing) {
                        if (!Array.isArray(existing)) {
                            result[key] = [existing];
                        }

                        result[key].push(value);
                    } else {
                        result[key] = value;
                    }
                }

                return result;
            }

            // urlform encoding serializer
            function str_serialize(result, key, value) {
                // encode newlines as \r\n cause the html spec says so
                value = value.replace(/(\r)?\n/g, '\r\n');
                value = encodeURIComponent(value);

                // spaces should be '+' rather than '%20'.
                value = value.replace(/%20/g, '+');
                return result + (result ? '&' : '') + encodeURIComponent(key) + '=' + value;
            }

            module.exports = serialize;
        }, {}] }, {}, [2]);
    ;
})();