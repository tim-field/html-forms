<?php

namespace HTML_Forms;

class Forms {

    private $plugin_file;

    public function __construct( $plugin_file ) {
        $this->plugin_file = $plugin_file;
    }

    public function hook() {
        add_action( 'init', array( $this, 'register' ) );
        add_action( 'init', array( $this, 'listen' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'assets' ) );
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

    public function assets() {
        wp_enqueue_script( 'html-forms', plugins_url( 'assets/js/public.js', $this->plugin_file ), array(), HTML_FORMS_VERSION, true );
        wp_localize_script( 'html-forms', 'hf_js_vars', array(
            'ajax_url' => admin_url( 'admin-ajax.php' ),
        ));
    }

    public function listen() {
        if( empty( $_POST['_hf_form_id'] ) ) {
            return;
        }

        $form_id = (int) $_POST['_hf_form_id'];
        $form = hf_get_form( $form_id );

        send_origin_headers();
        send_nosniff_header();
        nocache_headers();

        $data = array(
            'message' => array(
                'type' => 'success',
                'text' => $form->messages['success'],
            )
        );

        if( ! empty( $form->settings['redirect_url'] ) ) {
            $data['redirect_url'] = $form->settings['redirect_url'];
        }

        wp_send_json( $data, 200 );
        exit;

        // TODO: Save form entry

        // TODO: Process form actions
    }

    public function shortcode( $attributes = array(), $content = '' ) {
        $form = hf_get_form( $attributes['slug'] );
        return $form . $content;
    }
}