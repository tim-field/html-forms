(function () { var require = undefined; var module = undefined; var exports = undefined; var define = undefined;(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var __ = window.wp.i18n.__;
var registerBlockType = window.wp.blocks.registerBlockType;
var SelectControl = window.wp.components.SelectControl;
var forms = window.html_forms;
registerBlockType('html-forms/form', {
  title: __('HTML Forms: Form'),
  description: __('Block showing a HTML Forms form'),
  category: 'widgets',
  attributes: {
    slug: {
      type: 'string'
    }
  },
  supports: {
    html: false
  },
  edit: function edit(props) {
    var options = forms.map(function (f) {
      return {
        label: f.title,
        value: f.slug
      };
    });

    if (!props.attributes.slug && options.length > 0) {
      props.setAttributes({
        slug: options[0].value
      });
    }

    return React.createElement("div", {
      style: {
        backgroundColor: '#f8f9f9',
        padding: '14px'
      }
    }, React.createElement(SelectControl, {
      label: __('HTML Forms form'),
      value: props.attributes.slug,
      options: options,
      onChange: function onChange(value) {
        props.setAttributes({
          slug: value
        });
      }
    }));
  },
  // Render nothing in the saved content, because we render in PHP
  save: function save(props) {
    return null; // return `[hf_form slug="${props.attributes.slug}"]`;
  }
});

},{}]},{},[1]);
; })();