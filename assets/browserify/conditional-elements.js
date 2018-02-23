'use strict';

function toggleElement(el, expectedValues, show ) {
    return function(input) {
        const checked = ( input.getAttribute('type') !== 'radio' && input.getAttribute('type') !== 'checkbox' ) || input.checked;
        const value = input.value.trim();
        const conditionMet = checked && ( ( expectedValues.indexOf(value) > -1 && expectedValues.length > 0 ) || ( expectedValues.length === 0 && value.length > 0 ) );
        
        if(show){
            el.style.display = ( conditionMet ) ? '' : 'none';
        } else {
            el.style.display = ( conditionMet ) ? 'none' : '';
        }  

        // find all input children and toggle [required] attr
        let inputs = el.querySelectorAll('input, select, textarea');
        [].forEach.call(inputs, (el) => {
            if(( conditionMet || show  ) && el.getAttribute('data-was-required')) {
                el.required = true;
                el.removeAttribute('data-was-required');
            }

            if(( !conditionMet || ! show ) && el.required) {
               el.setAttribute('data-was-required', "true");
               el.required = false;
            }
        });
    }
}

function toggleDependents(input) {
    const elements = input.form.querySelectorAll('[data-show-if],[data-hide-if]');
    let inputName = (input.getAttribute('name') || '').toLowerCase()

    // strip square brackets from array-style inputs
    inputName = inputName.replace(/\[\]$/, '');

    [].forEach.call(elements, function(el) {
        const show = !!el.getAttribute('data-show-if');
        const conditions = show ? el.getAttribute('data-show-if').split(':') : el.getAttribute('data-hide-if').split(':');
        const nameCondition = conditions[0].replace(/\[\]$/, '');;
        let valueCondition = (conditions[1] || "").split('|');

        if (inputName !== nameCondition.toLowerCase() ) {
            return;
        }

        const callback = toggleElement(el, valueCondition, show);
        callback(input);
    });
}

function findInputsAndToggleDepepents() {
    const inputElements = document.querySelectorAll('.hf-form input, .hf-form textarea, .hf-form select');
    [].forEach.call(inputElements, toggleDependents);
}

function handleInputEvent(evt) {
    if( evt.target && evt.target.form && evt.target.form.className.indexOf('hf-form') > -1 ) {
        toggleDependents(evt.target);
    }
}


export default {
    'init': function() {
        findInputsAndToggleDepepents();
        document.addEventListener('keyup', handleInputEvent, true);
        document.addEventListener('change', handleInputEvent, true);
        document.addEventListener('hf-refresh', findInputsAndToggleDepepents, true);
        window.addEventListener('load', findInputsAndToggleDepepents);
    }
}
