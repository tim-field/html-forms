<?php

namespace HTML_Forms;

class Form {

    public $ID = 0;
    public $title = '';
    public $slug = '';
    public $markup = '';
    public $messages = array();
    public $settings = array();

    public function __construct( $ID ) {
        $this->ID = $ID;
    }

    public function __toString() {
        $form_classes = apply_filters( 'hf_form_classes', array(), $this );
        $form_action = apply_filters( 'hf_form_action', null, $this );
        $form_action_attr = is_null( $form_action ) ? '' : sprintf('action="%s"', $form_action );

        $html = '';
        $html .= sprintf( '<!-- HTML Forms v%s - %s -->', HTML_FORMS_VERSION, 'https://wordpress.org/plugins/html-forms/' );
        $html .= sprintf( '<form method="post" %s class="html-form %s">', $form_action_attr, join( ' ', $form_classes ) );
        $html .= $this->markup;
        $html .= '</form>';
        $html .= '<!-- / HTML Forms -->';
        return $html;
    }


}