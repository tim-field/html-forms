<?php

namespace HTML_Forms\Actions;

use HTML_Forms\Form;
use HTML_Forms\Submission;

class MailChimp extends Action {
	public $type = 'mailchimp';
	public $label = 'Subscribe to MailChimp';

	public function __construct() {
		$this->label = __( 'Subscribe to MailChimp', 'html-forms' );
	}

   /**
   * @return array
   */
   private function get_default_settings() {
   	$defaults = array(
   		'list_id' => '',
   		'field_map' => array(),
   	);
   	return $defaults;
   }

   /**
   * @param array $settings
   * @param string|int $index
   */ 
   public function page_settings( $settings, $index ) {
   	$settings = array_merge( $this->get_default_settings(), $settings );
   	?>
   	<span class="hf-action-summary"><?php printf( '' ); ?></span>
   	<input type="hidden" name="form[settings][actions][<?php echo $index; ?>][type]" value="<?php echo $this->type; ?>" />
   	<table class="form-table">

   	</table>
   	<?php
   }

   public function process( array $settings, Submission $submission, Form $form ) {
    // TODO: fill this
   }
}
