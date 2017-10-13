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
                name: namify(conf.fieldLabel),
                value: conf.value,
                placeholder: conf.placeholder,
                required: conf.required,
            };
            field = html("input", fieldAttr);
            break;
        case "textarea":
            fieldAttr = {
                name: namify(conf.fieldLabel),
                placeholder: conf.placeholder,
                required: conf.required,
            };
            field = html("textarea", fieldAttr, conf.value);
            break;

        case "dropdown":
            fieldAttr = {
                name: namify(conf.fieldLabel),
                required: conf.required,
            };
            const opts = conf.choices.map((choice) => (
                html("option", { defaultChecked: choice.checked }, choice.label )
            ));
            field = html("select", fieldAttr, opts);
            break;

        case "radio-buttons":
            field = conf.choices.map((choice) => (
                html("label", {}, [
                    html("input", {
                        type:"radio",
                        name: namify(conf.fieldLabel),
                        value: choice.label,
                        selected: choice.checked,
                    }),
                    " ",
                    html("span", {}, choice.label )
                ])
            ));
            break;

        case "checkboxes":
            field = conf.choices.map((choice) => (
                html("label", {}, [
                    html("input", {
                        type: "checkbox",
                        name: namify(conf.fieldLabel) + "[]",
                        value: choice.label,
                        checked: choice.checked,
                    }),
                    " ",
                    html("span", {}, choice.label )
                ])
            ));
            break;

        case "submit":
            fieldAttr = {
                type: "submit",
                value: conf.value,
            };
            field = html("input", fieldAttr);
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