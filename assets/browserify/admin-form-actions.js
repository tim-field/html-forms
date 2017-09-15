'use strict';

let availableActions, actionTemplates, actions;

function init() {
    actions = document.getElementById('hf-form-actions');
    availableActions = document.getElementById('hf-available-form-actions');
    actionTemplates = document.getElementById('hf-form-action-templates');

    availableActions.addEventListener('click', function(e) {
        let el = e.target || e.srcElement;

        if( el.tagName !== 'INPUT' ) {
            return;
        }
        let actionType = el.getAttribute('data-action-type');
        let actionTemplate = actionTemplates.querySelector(`#hf-action-type-${actionType}-template`);


        let wrap = document.createElement('div');
        wrap.className = "hf-action-settings accordion expanded ";

        let heading = document.createElement('h4');
        heading.className = "accordion-heading";
        heading.innerText = el.value;
        wrap.appendChild(heading);

        let content = document.createElement('div');
        content.className = "accordion-content";
        content.innerHTML = actionTemplate.innerHTML;
        wrap.appendChild(content);

        let deleteWrap = document.createElement('p');
        deleteWrap.style.textAlign = 'right';
        let deleteLink = document.createElement('a');
        deleteLink.className = "danger";
        deleteLink.innerText = 'Delete this action';
        deleteWrap.appendChild(deleteLink);
        content.appendChild(deleteWrap);

        // add toggle function
        heading.addEventListener('click', (function(wrap, content) {
            return function() {
                let show = content.offsetParent === null;
                wrap.className = wrap.className.replace('expanded', '');
                if(show) {
                    wrap.className = wrap.className + " expanded";
                }
                content.style.display = show? 'block' : 'none';
            }
        })(wrap, content));

        deleteLink.addEventListener('click', function() {
            let actionWrap = this.parentElement.parentElement;
            actionWrap.parentElement.removeChild(actionWrap);
        });

        actions.appendChild(wrap);

        // hide "no form actions" message
        actions.querySelector('#hf-form-actions-empty').style.display = 'none';
    }, true);
}


export default {
    'init': init,
};