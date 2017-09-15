<?php

namespace HTML_Forms\Actions;

class Email extends Action {

   public $type = 'email';
   public $label = 'Email';

   public function __construct() {
       $this->label = __( 'Email', 'html-forms' );
   }

   public function page_settings( $settings ) {
       ?>
       <table class="form-table">
           <tr>
               <th>From</th>
               <td>
                   <input type="email" class="regular-text" placeholder="jane@email.com" />
               </td>
           </tr>
           <tr>
               <th>To</th>
               <td>
                   <input type="email" class="regular-text" placeholder="john@email.com" />
               </td>
           </tr>
           <tr>
               <th>Subject</th>
               <td>
                   <input type="text" class="regular-text" placeholder="Your email subject" />
               </td>
           </tr>
           <tr>
               <th>Message body</th>
               <td>
                   <textarea rows="8" class="widefat"></textarea>
               </td>
           </tr>
       </table>
        <?php
   }
}