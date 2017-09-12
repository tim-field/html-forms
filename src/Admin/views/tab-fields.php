<div class="hf-small-margin">
    <label>Form code</label>
    <textarea id="hf-form-editor" class="widefat" name="form[markup]" cols="160" rows="20" autocomplete="false" autocorrect="false" autocapitalize="false" spellcheck="false"><?php echo htmlspecialchars( $form->markup, ENT_QUOTES, get_option( 'blog_charset' ) ); ?></textarea>
    <?php submit_button(); ?>
</div>

<input type="hidden" id="hf-required-fields" name="form[settings][required_fields]" value="<?php echo esc_attr( $form->settings['required_fields'] ); ?>" />
<input type="hidden" id="hf-email-fields" name="form[settings][email_fields]" value="<?php echo esc_attr( $form->settings['email_fields'] ); ?>" />