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
        add_action( 'html_forms_admin_action_create_form', array( $this, 'process_create_form' ) );
        add_action( 'html_forms_admin_action_save_form', array( $this, 'process_save_form' ) );
    }

    public function listen() {
        if( empty( $_REQUEST['_html_forms_admin_action'] ) ) {
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
    }
}