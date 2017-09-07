<div class="hf-small-margin">
    <label>Form code</label>
    <textarea id="hf-form-editor" class="widefat" name="form[markup]" cols="160" rows="20" autocomplete="false" autocorrect="false" autocapitalize="false" spellcheck="false"><?php echo htmlspecialchars( $form->markup, ENT_QUOTES, get_option( 'blog_charset' ) ); ?></textarea>
    <?php submit_button(); ?>
</div>