"use strict";

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

            var tabs = document.querySelectorAll('.hf-tab');
            var tabNavs = document.querySelectorAll('#hf-tabs-nav a');
            for (var i = 0; i < tabNavs.length; i++) {
                tabNavs[i].addEventListener('click', openTab);
            }

            function openTab(e) {
                var tabTarget = this.getAttribute('data-tab-target');
                for (var _i = 0; _i < tabs.length; _i++) {
                    var tab = tabs[_i];
                    tab.classList.toggle('hf-tab-active', tab.getAttribute('data-tab') === tabTarget);
                }

                e.preventDefault();
            }
        }, {}] }, {}, [1]);
    ;
})();