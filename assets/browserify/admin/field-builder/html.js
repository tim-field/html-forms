import renderToString from 'preact-render-to-string';
import { h } from 'preact';


function htmlgenerate(conf) {
    const label = conf.fieldLabel.length && conf.fieldType !== 'submit' ? h("label", {}, conf.fieldLabel ) : "";
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
                html("option", { selected: choice.checked }, choice.label )
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
        str = renderToString(tmpl, null, { pretty: true });
    } else {
        str += renderToString(label, null, { pretty: true });
        str += "\n";
        str += renderToString(field, null, { pretty: true });
    }

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
