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
    }
}