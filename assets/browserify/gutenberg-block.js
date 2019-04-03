'use strict';

const __ = window.wp.i18n.__;
const { registerBlockType } = window.wp.blocks;
const { SelectControl } = window.wp.components;
const forms = window.html_forms;

registerBlockType( 'html-forms/form', {
    title: __( 'HTML Forms: Form' ),
    description: __( 'Block showing a HTML Forms form'),
    category: 'widgets',
    attributes: {
        slug: {
            type: 'string',
        },
    },
    supports: {
        html: false,
    },

    edit: function(props) {
        const options = forms.map(f => {
            return {
                label: f.title,
                value: f.slug,
            }
        });

        if (!props.attributes.slug && options.length > 0) {
            props.setAttributes({slug: options[0].value });
        }

        return (
            <div style={{ backgroundColor: '#f8f9f9', padding: '14px'  }}>
                <SelectControl
                    label={__('HTML Forms form')}
                    value={props.attributes.slug}
                    options={options}
                    onChange={value => {
                        props.setAttributes({ slug: value })
                    }}
                    />
            </div>
    )
    },

    // Render nothing in the saved content, because we render in PHP
    save: function(props) {
        return null;
       // return `[hf_form slug="${props.attributes.slug}"]`;
    },
});
