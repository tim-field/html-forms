<?php
/*
Plugin Name: HTML Forms
Plugin URI: https://htmlformsplus.com/#utm_source=wp-plugin&utm_medium=html-forms&utm_campaign=plugins-page
Description: Not just another forms plugin. Simple and flexible.
Version: 1.0
Author: ibericode
Author URI: https://ibericode.com/
License: GPL v3
Text Domain: html-forms

HTML Forms Plus
Copyright (C) 2017, Danny van Kooten, danny@ibericode.com

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

namespace HTML_Forms;

function _bootstrap() {

    if( ! function_exists( 'hf' ) ) {
        require __DIR__ . '/vendor/autoload.php';
    }

    define( 'HTML_FORMS_VERSION', '1.0' );

    require __DIR__ .'/src/functions.php';

    load_plugin_textdomain( 'html-forms', '', dirname( __FILE__ ) . '/languages' );

    $forms = new Forms( __FILE__ );
    $forms->hook();

    if( is_admin() ) {
        if( ! defined( 'DOING_AJAX' ) || ! DOING_AJAX ) {
            $admin = new Admin\Admin( __FILE__ );
            $admin->hook();
        }
    }

}

add_action( 'plugins_loaded', 'HTML_Forms\\_bootstrap', 10 );