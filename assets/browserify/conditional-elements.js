'use strict';

function toggleElement(el, expectedValue, show ) {
    return function(input) {
        const value = input.value.trim();
        const checked = ( input.getAttribute('type') !== 'radio' && input.getAttribute('type') !== 'checked' ) || input.checked;
        const conditionMet = checked && ( ( value === expectedValue && expectedValue !== "" ) || ( expectedValue === "" && value.length > 0 ) );
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
    const elements = input.form.querySelectorAll('[data-show-if], [data-hide-if]');
    const inputName = (input.getAttribute('name') || '').toLowerCase();

    [].forEach.call(elements, function(el) {
        const show = !!el.getAttribute('data-show-if');
        const conditions = show ? el.getAttribute('data-show-if').split(':') : el.getAttribute('data-hide-if').split(':');
        const nameCondition = conditions[0];
        const valueCondition = conditions[1] || "";

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
        document.addEventListener('click', handleInputEvent, true);
        document.addEventListener('keyup', handleInputEvent, true);
        document.addEventListener('change', handleInputEvent, true);
        window.addEventListener('load', findInputsAndToggleDepepents);
    }
}
