<?php

namespace HTML_Forms\Actions;

class Email extends Action {

   public $type = 'email';
   public $label = 'Email';

   public function __construct() {
       $this->label = __( 'Email', 'html-forms' );
   }

   public function page_settings( $settings ) {
       echo 'Email settings come here.';
   }
}