'use strict';

let tabs, tabNavs;
let Tabs = {};

Tabs.init = function() {
    tabs = document.querySelectorAll('.hf-tab');
    tabNavs = document.querySelectorAll('#hf-tabs-nav a');
    for(let i=0; i<tabNavs.length; i++) {
        tabNavs[i].addEventListener('click', Tabs.open);
    }
};

Tabs.open = function(e) {
    let tabTarget = this.getAttribute('data-tab-target');
    for(let i=0; i<tabNavs.length; i++) {
        tabNavs[i].classList.toggle('nav-tab-active', tabNavs[i] === this);
    }
    this.blur();

    for(let i=0; i<tabs.length; i++) {
        let tab = tabs[i];
        tab.classList.toggle('hf-tab-active', tab.getAttribute('data-tab') === tabTarget);
    }

    document.title = document.title.replace(document.title.split(' - ').shift(), this.innerText + " ");

    e.preventDefault();
};


export default Tabs;