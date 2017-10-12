import htmlutil from 'html';
import renderToString from 'preact-render-to-string';
import { h } from 'preact';


function htmlgenerate(conf) {
    const label = conf.fieldLabel.length ? h("label", {}, conf.fieldLabel ) : "";
    let fieldAttr, field;

    switch(conf.fieldType) {
        case "text":
        default:
            fieldAttr = {
                type: conf.fieldType,
                required: conf.required,
                placeholder: conf.placeholder,
                name: namify(conf.fieldLabel),
                value: conf.defaultValue,
            };
            field = html("input", fieldAttr);
            break;
        case "textarea":
            fieldAttr = {
                required: conf.required,
                placeholder: conf.placeholder,
                name: namify(conf.fieldLabel),
            };
            field = html("textarea", fieldAttr, conf.value);
            break;

    }

    let str = "";
    if( conf.wrap ) {
        let tmpl = h("p", {}, [label, field]);
        str = renderToString(tmpl);
    } else {
        str += renderToString(label);
        str += renderToString(field);
    }

    str = htmlutil.prettyPrint(str);
    return str;
}

function html(tag, attr, children) {
    return h(tag, filterEmptyObjectValues(attr), children);
}

function namify(str) {
    return str.replace(/ /g, '_').replace(/[^\w\[\]_]*/g, "").toUpperCase();
}

function filterEmptyObjectValues(obj) {
    let newObj = {};
    for (let propName in obj) {
        if( obj[propName] !== false && obj[propName] !== "" ) {
            newObj[propName] = obj[propName];
        }
    }
    return newObj;
}


export {
    htmlgenerate
}