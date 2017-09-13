<?php

namespace HTML_Forms\Admin;

class Admin {

    private $plugin_file;

    public function __construct( $plugin_file ) {
        $this->plugin_file = $plugin_file;
    }

    public function hook() {
        add_action( 'admin_menu', array( $this, 'menu' ) );
        add_action( 'init', array( $this, 'listen' ) );
        add_action( 'admin_print_styles', array( $this, 'assets' ) );
        add_action( 'html_forms_admin_action_create_form', array( $this, 'process_create_form' ) );
        add_action( 'html_forms_admin_action_save_form', array( $this, 'process_save_form' ) );
    }

    public function listen() {
        if( empty( $_REQUEST['_html_forms_admin_action'] ) ) {
            return;
        }

        // do nothing if logged in user is not of role administrator
        if( ! current_user_can( 'manage_options' ) ) {
            return;
        }

        $action = (string) $_REQUEST['_html_forms_admin_action'];

        /**
         * Allows you to hook into requests containing `_html_forms_admin_action` => action name.
         *
         * The dynamic portion of the hook name, `$action`, refers to the action name.
         *
         * By the time this hook is fired, the user is already authorized. After processing all the registered hooks,
         * the request is redirected back to the referring URL.
         *
         * @since 3.0
         */
        do_action( 'html_forms_admin_action_' . $action );

        // redirect back to where we came from
        $redirect_url = ! empty( $_REQUEST['_redirect_to'] ) ? $_REQUEST['_redirect_to'] : remove_query_arg( '_html_forms_admin_action' );
        wp_safe_redirect( $redirect_url );
        exit;
    }

    public function assets() {
        if( empty( $_GET['page'] ) || strpos( $_GET['page'], 'html-forms' ) !== 0 ) {
            return;
        }

        $suffix = defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ? '.min' : '';

        wp_enqueue_style( 'hf-admin', plugins_url( 'assets/css/admin'. $suffix .'.css', $this->plugin_file ), array(), HTML_FORMS_VERSION );
        wp_enqueue_script( 'hf-admin', plugins_url( 'assets/js/admin'. $suffix .'.js', $this->plugin_file ), array(), HTML_FORMS_VERSION, true  );
    }

    public function menu() {
        // add top menu item
        add_menu_page( 'HTML Forms', 'HTML Forms', 'manage_options', 'html-forms', array( $this, 'page_overview' ), plugins_url('assets/img/favicon.ico', $this->plugin_file ), '99.88491' );
        add_submenu_page( 'html-forms', 'All forms', 'All Forms', 'manage_options', 'html-forms', array( $this, 'page_overview' ) );
        add_submenu_page( 'html-forms', 'Add new form', 'Add New', 'manage_options', 'html-forms-add-form', array( $this, 'page_new_form' ) );
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
                'post_content' => '<!-- Nothing here... Add some fields! -->', // TODO: get from request data
            )
        );

        wp_redirect( admin_url( 'admin.php?page=html-forms&view=edit&form_id=' . $form_id ));
        exit;
    }

    public function page_edit_form() {
        $active_tab = ! empty( $_GET['tab'] ) ? $_GET['tab'] : 'fields';
        $form_id = (int) $_GET['form_id'];
        $form = hf_get_form( $form_id );
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

}