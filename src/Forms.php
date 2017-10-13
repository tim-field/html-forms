<?php

namespace HTML_Forms;

class Forms
{

    /**
     * @var string
     */
    private $plugin_file;

    /**
     * @var array
     */
    private $settings;

    /**
     * Forms constructor.
     *
     * @param string $plugin_file
     * @param array $settings
     */
    public function __construct($plugin_file, array $settings )
    {
        $this->plugin_file = $plugin_file;
        $this->settings = $settings;
    }

    public function hook()
    {
        add_action('init', array($this, 'register'));
        add_action('init', array($this, 'listen'));
        add_action('wp_enqueue_scripts', array($this, 'assets'));
    }

    public function register()
    {
        // register post type
        register_post_type('html-form', array(
                'labels' => array(
                    'name' => 'HTML Forms',
                    'singular_name' => 'HTML Form',
                ),
                'public' => false
            )
        );

        add_shortcode('html_form', array($this, 'shortcode'));
    }

    public function assets() {
        $suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';
        wp_enqueue_script('html-forms', plugins_url('assets/js/public'. $suffix .'.js', $this->plugin_file), array(), HTML_FORMS_VERSION, true);
        wp_localize_script('html-forms', 'hf_js_vars', array(
            'ajax_url' => admin_url('admin-ajax.php'),
        ));

        if( $this->settings['load_stylesheet'] ) {
            wp_enqueue_style( 'html-forms', plugins_url( 'assets/css/forms' . $suffix . '.css', $this->plugin_file ), array(), HTML_FORMS_VERSION );
        }
    }

    /**
     * @param Form $form
     * @param array $data
     * @return string
     */
    private function validate_form(Form $form, array $data) {
        $honeypot_key = sprintf( '_hf_h%d', $form->ID );
        if( ! isset( $data[$honeypot_key] ) || $data[$honeypot_key] !== "" ) {
            return 'spam';
        }

        /**
         * This filter allows you to perform your own form validation.
         *
         * Return a non-empty string if you want to raise an error.
         * Error codes with a specific error message are: "required_field_missing", "invalid_email", and "error"
         *
         * @param string $error_code
         * @param Form $form
         * @param array $data
         */
        $error = apply_filters( 'hf_validate_form', '', $form, $data );
        if( ! empty( $error ) ) {
            return $error;
        }

        $required_fields = $form->get_required_fields();
        foreach ($required_fields as $field_name) {
            $value = hf_array_get( $data, $field_name );
            if ( empty( $value ) ) {
                return 'required_field_missing';
            }
        }

        $email_fields = $form->get_email_fields();
        foreach ($email_fields as $field_name) {
            $value = hf_array_get( $data, $field_name );
            if ( ! empty( $value ) && ! is_email( $value ) ) {
                return 'invalid_email';
            }
        }

        // all good: no errors!
        return '';
    }

    public function sanitize( $value ) {
        if (is_string($value)) {
            // strip all HTML tags & whitespace
            $value = trim(strip_tags($value));

            // convert &amp; back to &
            $value = html_entity_decode($value, ENT_NOQUOTES);
        } elseif (is_array($value)) {
            $value = array_map(array( $this, 'sanitize' ), $value);
        } elseif (is_object($value)) {
            $vars = get_object_vars($value);
            foreach ($vars as $key => $data) {
                $value->{$key} = $this->sanitize($data);
            }
        }

        return $value;
    }

    public function listen() {
        if (empty($_POST['_hf_form_id'])) {
            return;
        }

        $data = $_POST;
        $form_id = (int) $data['_hf_form_id'];
        $form = hf_get_form($form_id);
        $error_code = $this->validate_form($form, $data);

        if (empty( $error_code ) ) {
            // filter out all field names starting with _
            $data = array_filter( $data, function( $k ) {
                return ! empty( $k ) && $k[0] !== '_';
            }, ARRAY_FILTER_USE_KEY );

            // strip slashes
            $data = stripslashes_deep( $data );

            // sanitize data: strip tags etc.
            $data = $this->sanitize( $data );

            // save form submission
            $submission = new Submission();
            $submission->form_id = $form_id;
            $submission->data = $data;
            $submission->ip_address = sanitize_text_field( $_SERVER['REMOTE_ADDR'] );
            $submission->user_agent = sanitize_text_field( $_SERVER['HTTP_USER_AGENT'] );
            $submission->save();

            // process form actions
            foreach( $form->settings['actions'] as $action_settings ) {
                /**
                 * Processes the specified form action and passes related data.
                 *
                 * @param array $action_settings
                 * @param Submission $submission
                 * @param Form $form
                 */
                do_action('hf_process_form_action_' . $action_settings['type'], $action_settings, $submission, $form );
            }

            /**
             * General purpose hook after all form actions have been processed.
             *
             * @param Submission $submission
             * @param Form $form
             */
            do_action( 'hf_form_success', $submission, $form );

            $response = array(
                'message' => array(
                    'type' => 'success',
                    'text' => $form->messages['success'],
                ),
                'hide_form' => (bool)$form->settings['hide_after_success'],
            );

            if (!empty($form->settings['redirect_url'])) {
                $response['redirect_url'] = $form->settings['redirect_url'];
            }
        } else {
            $response = array(
                'message' => array(
                    'type' => 'warning',
                    'text' => isset( $form->messages[ $error_code ] ) ? $form->messages[ $error_code ] : $form->messages['error'],
                ),
                'error' => $error_code,
            );

            /**
             * General purpose hook for when a form error occurred
             *
             * @param string $error_code
             * @param Form $form
             * @param array $data
             */
            do_action( 'hf_form_error', $error_code, $form, $data );
        }

        send_origin_headers();
        send_nosniff_header();
        nocache_headers();

        wp_send_json($response, 200);
        exit;
    }

    public function shortcode($attributes = array(), $content = '')
    {
        $form = hf_get_form($attributes['slug']);
        return $form . $content;
    }
}