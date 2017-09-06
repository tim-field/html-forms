<?php

namespace HTML_Forms;

class Forms {

    public function hook() {
        add_action( 'init', array( $this, 'register' ) );
    }

    public function register() {
        // register post type
        register_post_type( 'html-form', array(
            'labels' => array(
					'name' => 'HTML Forms',
					'singular_name' => 'HTML Form',
				),
				'public' => false
            )
        );

        add_shortcode( 'html_form', array( $this, 'shortcode' ) );
    }

    public function shortcode( $attributes = array(), $content = '' ) {
        $form = hf_get_form( $attributes['slug'] );
        return $form . $content;
    }
}