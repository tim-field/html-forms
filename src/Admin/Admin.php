<?php

namespace HTML_Forms\Admin;

class Admin {

    private $plugin_file;

    public function __construct( $plugin_file ) {
        $this->plugin_file = $plugin_file;
    }

    public function hook() {
        add_action( 'admin_menu', array( $this, 'menu' ) );
    }

    public function menu() {
        // add top menu item
        add_menu_page( 'HTML Forms', 'HTML Forms', 'manage_options', 'html-forms', array( $this, 'page_overview' ), plugins_url('assets/img/favicon.ico', $this->plugin_file ), '99.88491' );
    }

    public function page_overview() {
        $table = new Table();

        require __DIR__ . '/views/overview.php';
    }
}