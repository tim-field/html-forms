<?php

namespace HTML_Forms\Admin;

use HTML_Forms\Submission;

class Admin {

    /**
     * @var string
     */
    private $plugin_file;

    /**
     * Admin constructor.
     *
     * @param string $plugin_file
     */
    public function __construct( $plugin_file ) {
        $this->plugin_file = $plugin_file;
    }

    public function hook() {
        add_action( 'admin_menu', array( $this, 'menu' ) );
        add_action( 'init', array( $this, 'register_settings' ) );
        add_action( 'init', array( $this, 'listen' ) );
        add_action( 'admin_print_styles', array( $this, 'assets' ) );
        add_action( 'hf_admin_action_create_form', array( $this, 'process_create_form' ) );
        add_action( 'hf_admin_action_save_form', array( $this, 'process_save_form' ) );
        add_action( 'hf_admin_action_bulk_delete_submissions', array( $this, 'process_bulk_delete_submissions' ) );
        add_action ('hf_admin_action_delete_data_column', array( $this, 'process_delete_data_column' ) );
        add_action( 'hf_admin_action_rename_data_column', array( $this, 'process_rename_data_column' ) );
    }

    public function register_settings() {
        // register settings
        register_setting( 'hf_settings', 'hf_settings', array( $this, 'sanitize_settings' ) );
    }

    /**
     * @param array $dirty
     * @return array
     */
    public function sanitize_settings( $dirty ) {
        return $dirty;
    }

    public function listen() {
        $request = array_merge( $_GET, $_POST );
        if( empty( $request['_hf_admin_action'] ) ) {
            return;
        }

        // do nothing if logged in user is not of role administrator
        if( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        $action = (string) $request['_hf_admin_action'];

        /**
         * Allows you to hook into requests containing `_hf_admin_action` => action name.
         *
         * The dynamic portion of the hook name, `$action`, refers to the action name.
         *
         * By the time this hook is fired, the user is already authorized. After processing all the registered hooks,
         * the request is redirected back to the referring URL.
         *
         * @since 3.0
         */
        do_action( 'hf_admin_action_' . $action );

        // redirect back to where we came from
        $redirect_url = ! empty( $_REQUEST['_redirect_to'] ) ? $_REQUEST['_redirect_to'] : remove_query_arg( '_hf_admin_action' );
        wp_safe_redirect( $redirect_url );
        exit;
    }

    public function assets() {
        if( empty( $_GET['page'] ) || strpos( $_GET['page'], 'html-forms' ) !== 0 ) {
            return;
        }

        $suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '' : '.min';

        wp_enqueue_style( 'hf-admin', plugins_url( 'assets/css/admin'. $suffix .'.css', $this->plugin_file ), array(), HTML_FORMS_VERSION );
        wp_enqueue_script( 'hf-admin', plugins_url( 'assets/js/admin'. $suffix .'.js', $this->plugin_file ), array(), HTML_FORMS_VERSION, true  );
    }

    public function menu() {
        // add top menu item
        add_menu_page( 'HTML Forms', 'HTML Forms', 'manage_options', 'html-forms', array( $this, 'page_overview' ), plugins_url('assets/img/favicon.ico', $this->plugin_file ), '99.88491' );
        add_submenu_page( 'html-forms', 'Forms', 'All Forms', 'manage_options', 'html-forms', array( $this, 'page_overview' ) );
        add_submenu_page( 'html-forms', 'Add new form', 'Add New', 'manage_options', 'html-forms-add-form', array( $this, 'page_new_form' ) );
        add_submenu_page( 'html-forms', 'Settings', 'Settings', 'manage_options', 'html-forms-settings', array( $this, 'page_settings' ) );
    }

    public function page_overview() {
        if( ! empty( $_GET['view'] ) && $_GET['view'] === 'edit' ) {
            $this->page_edit_form();
            return;
        }

        $table = new Table();
        $table->prepare_items();

        require __DIR__ . '/views/overview.php';
    }

    public function page_new_form() {
        require __DIR__ . '/views/add-form.php';
    }


    public function page_settings() {
        $settings = hf_get_settings();
        require __DIR__ . '/views/global-settings.php';
    }

     public function process_create_form() {
        // Fix for MultiSite stripping KSES for roles other than administrator
        remove_all_filters( 'content_save_pre' );

        $data = $_POST['form'];
        $form_title = sanitize_text_field( $data['title'] );
        $form_id = wp_insert_post(
            array(
                'post_type' => 'html-form',
                'post_status' => 'publish',
                'post_title' => $form_title,
                'post_content' => $this->get_default_form_content(),
            )
        );

        wp_redirect( admin_url( 'admin.php?page=html-forms&view=edit&form_id=' . $form_id ));
        exit;
    }

    public function page_edit_form() {
        $active_tab = ! empty( $_GET['tab'] ) ? $_GET['tab'] : 'fields';
        $form_id = (int) $_GET['form_id'];
        $form = hf_get_form( $form_id );

        global $wpdb;
        $table = $wpdb->prefix .'hf_submissions';

        // TODO: Abstract this away in helper function?
        $results = $wpdb->get_results( $wpdb->prepare( "SELECT s.* FROM {$table} s WHERE s.form_id = %d ORDER BY s.submitted_at DESC LIMIT 100;", $form_id ), OBJECT_K );
        $submissions = array();
        foreach( $results as $key => $object ) {
            $submission = new Submission();
            $submission->id = $object->id;
            $submission->form_id = $object->form_id;
            $submission->data = json_decode( $object->data, true );
            $submission->ip_address = (string) $object->ip_address;
            $submission->user_agent = (string) $object->user_agent;
            $submission->submitted_at = $object->submitted_at;
            $submissions[$key] = $submission;
        }

        $columns = array();
        foreach( $submissions as $submission ) {
            foreach( $submission->data as $field => $value ) {
                if (!array_key_exists($field, $columns)) {
                    $columns[$field] = true;
                }
            }
        }
        $columns = array_keys( $columns );


        require __DIR__ . '/views/edit-form.php';
    }

    public function process_save_form() {
        $form_id = (int) $_POST['form_id'];
        $form = hf_get_form( $form_id );
        $data = $_POST['form'];

        // Fix for MultiSite stripping KSES for roles other than administrator
        remove_all_filters( 'content_save_pre' );

        $form_id = wp_insert_post( array(
            'ID' => $form_id,
            'post_type' => 'html-form',
            'post_status' => 'publish',
            'post_title' => $data['title'],
            'post_content' => $data['markup'],
        ) );

        if( ! empty( $data['settings'] ) ) {
            update_post_meta( $form_id, '_hf_settings', $data['settings'] );
        }

        // save form messages in individual meta keys
        foreach( $data['messages'] as $key => $message ) {
            update_post_meta( $form_id, 'hf_message_' . $key, $message );
        }

    }

    /**
     * Get URL for a tab on the current page.
     *
     * @since 3.0
     * @internal
     * @param $tab
     * @return string
     */
    public function get_tab_url( $tab ) {
        return add_query_arg( array( 'tab' => $tab ), remove_query_arg( 'tab' ) );
    }

    /**
     * @return array
     */
    public function get_available_form_actions() {
        $actions = array();

        /**
         * Filters the available form actions
         *
         * @param array $actions
         */
        $actions = apply_filters( 'hf_available_form_actions', $actions );

        return $actions;
    }

    public function process_bulk_delete_submissions() {
        global $wpdb;
        $table = $wpdb->prefix .'hf_submissions';
        $ids = join( ',', array_map( 'esc_sql', $_POST['id'] ) );
        $wpdb->query( sprintf( "DELETE FROM {$table} WHERE id IN( %s );", $ids ) );
    }

    public function process_delete_data_column() {
        global $wpdb;
        $form_id = (int) $_GET['form_id'];
        $column_key = (string) $_GET['column_key'];
        $table = $wpdb->prefix .'hf_submissions';

        $results = $wpdb->get_results( $wpdb->prepare( "SELECT s.id, s.data FROM {$table} s WHERE s.form_id = %d;", $form_id ), OBJECT_K );
        foreach( $results as $result ) {
            $data = json_decode( $result->data, true );
            unset( $data[ $column_key] );
            $wpdb->update( $table, array( 'data' => json_encode( $data ) ), array( 'id' => $result->id ) );
        }
    }

    public function process_rename_data_column() {
        // TODO: Implement this method.
    }

    private function get_default_form_content() {
        $html = '';
        $html .= sprintf( "<p>\n\t<label>%1\$s</label>\n\t<input type=\"text\" name=\"NAME\" placeholder=\"%1\$s\" required />\n</p>", __( 'Your name', 'html-forms' ) ) . PHP_EOL;
        $html .= sprintf( "<p>\n\t<label>%1\$s</label>\n\t<input type=\"email\" name=\"EMAIL\" placeholder=\"%1\$s\" required />\n</p>", __( 'Your email', 'html-forms' ) ) . PHP_EOL;
        $html .= sprintf( "<p>\n\t<label>%1\$s</label>\n\t<input type=\"text\" name=\"SUBJECT\" placeholder=\"%1\$s\" required />\n</p>", __( 'Subject', 'html-forms' ) ) . PHP_EOL;
        $html .= sprintf( "<p>\n\t<label>%1\$s</label>\n\t<textarea name=\"MESSAGE\" placeholder=\"%1\$s\" required></textarea>\n</p>", __( 'Message', 'html-forms' ) ). PHP_EOL;
        return $html;
    }

}