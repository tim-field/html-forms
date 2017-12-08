<?php

namespace HTML_Forms;

class Form {

    public $ID = 0;
    public $title = '';
    public $slug = '';
    public $markup = '';
    public $messages = array();
    public $settings = array();

    /**
     * Form constructor.
     *
     * @param $ID
     */
    public function __construct( $ID ) 
    {
        $this->ID = $ID;
    }

    public function get_html() 
    {
        $form = $this;

        /**
         * Filters the CSS classes to be added to this form's class attribute.
         *
         * @param array $form_classes
         * @param Form $form
         */
        $form_classes_attr = apply_filters( 'hf_form_element_class_attr', '', $form );

        /**
         * Filters the action attribute for this form.
         *
         * @param string $form_action
         * @param Form $form
         */
        $form_action = apply_filters( 'hf_form_element_action_attr', null, $form );
        $form_action_attr = is_null( $form_action ) ? '' : sprintf('action="%s"', $form_action );

        $html = '';
        $html .= sprintf( '<!-- HTML Forms v%s - %s -->', HTML_FORMS_VERSION, 'https://wordpress.org/plugins/html-forms/' );
        $html .= sprintf( '<form method="post" %s class="hf-form hf-form-%d %s" data-title="%s" data-slug="%s">', $form_action_attr, $this->ID, esc_attr( $form_classes_attr ), esc_attr( $this->title ), esc_attr( $this->slug ) );

        $html .= '<div class="hf-fields-wrap">';
        $html .= sprintf( '<input type="hidden" name="_hf_form_id" value="%d" />', $this->ID );
        $html .= sprintf( '<div style="display: none;"><input type="text" name="_hf_h%d" value="" /></div>', $this->ID );
        $html .= $this->get_markup();
        $html .= '<noscript>' . __( "Please enable JavaScript for this form to work.", 'html-forms' ) . '</noscript>';
        $html .= '</div>';
        $html .= '</form>';
        $html .= '<!-- / HTML Forms -->';

        /**
         * Filters the resulting HTML for this form.
         *
         * @param string $html
         * @param Form $form
         */
        $html = apply_filters( 'hf_form_html', $html, $form );
        return $html;
    }

    /**
     * @return string
     */
    public function __toString() 
    {
        return $this->get_html();
    }

    /**
     * @return array
     */
    public function get_required_fields() 
    {
        if( empty( $this->settings['required_fields'] ) ) {
            return array();
        }

        $required_fields = explode( ',', $this->settings['required_fields'] );
        return $required_fields;
    }

    /**
     * @return array
     */
    public function get_email_fields() 
    {
        if( empty( $this->settings['email_fields'] ) ) {
            return array();
        }

        $email_fields = explode( ',', $this->settings['email_fields'] );
        return $email_fields;
    }

    /**
    * @param string $code
    */
    public function get_message( $code ) 
    {
        $form = $this;
        $message = isset( $this->messages[ $code ] ) ? $this->messages[ $code ] : '';

        /**
        * @param string $message
        * @param Form $form
        */
        $message = apply_filters( 'hf_form_message_' . $code, $message, $form );
        return $message;
    }

    /**
     * @return mixed|void
     */
    public function get_markup()
    {
        $markup = $this->markup_replace_variables( $this->markup );

        return apply_filters( 'hf_form_markup', $markup, $this );
    }

    /**
     * Replace variables.
     *
     * Replace variables in the form. For example you can set a default value in a email field like so:
     * <input type="email" value="{{ user.email }}">
     *
     * Or if you want to pass on a default value:
     * <input type="text" value="{{ user.name || John Doe }}">
     *
     * @param $markup
     * @return mixed
     */
    private function markup_replace_variables( $markup ) {
        $variable_replace = apply_filters( 'hf_form_markup_replace_variables', $variable_replace = $this->default_variable_replace(), $this );

        $markup = preg_replace_callback( '/\{\{([^}]+)\}\}/', function( $matches ) use ( $variable_replace ) {
            $default = '';
            $variable = trim( $matches[1] );

            if ( ( $default_pos = strpos( $variable, '||' ) ) !== false ) { // A fallback/default value has been set
                $default = trim( substr( $variable, $default_pos +2 ) );
                $variable = trim( substr( $variable, 0, $default_pos ) );
            }

            return isset( $variable_replace[ $variable ] ) ? $variable_replace[ $variable ] : $default;
        }, $markup );

        return $markup;
    }

    /**
     * Default replaced variables.
     *
     * @return mixed
     */
    private function default_variable_replace() {
        $variable_replace = array();
        if ( is_user_logged_in() && $user = wp_get_current_user() ) {
            $variable_replace['user.email'] = $user->user_email;
            $variable_replace['user.first_name'] = $user->user_firstname;
            $variable_replace['user.last_name'] = $user->user_lastname;
            $variable_replace['user.login'] = $user->user_login;
            $variable_replace['user.display_name'] = $user->display_name;
        }

        return $variable_replace;
    }

}
