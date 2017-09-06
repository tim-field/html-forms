<?php defined( 'ABSPATH' ) or exit; ?>

<div class="wrap">

    <p class="breadcrumbs">
        <span class="prefix"><?php echo __( 'You are here: ', 'html-forms' ); ?></span>
        <a href="<?php echo admin_url( 'admin.php?page=html-forms' ); ?>">HTML Forms</a> &rsaquo;
        <span class="current-crumb"><strong><?php _e( 'Edit form', 'html-forms' ); ?></strong></span>
    </p>

    <h1 class="page-title"><?php _e( 'Edit form', 'html-forms' ); ?></h1>

    <form method="post">
        <input type="hidden" name="_html_forms_admin_action" value="save_form" />
        <input type="hidden" name="form_id" value="<?php echo esc_attr( $form->ID ); ?>" />
        <input type="submit" style="display: none; " />


        <div id="titlediv" class="small-margin">
            <div id="titlewrap">
                <label class="screen-reader-text" for="title"><?php _e( 'Enter form title here', 'html-forms' ); ?></label>
                <input type="text" name="form[title]" size="30" value="<?php echo esc_attr( $form->title ); ?>" id="title" spellcheck="true" autocomplete="off" placeholder="<?php echo __( "Enter the title of your sign-up form", 'html-forms' ); ?>" style="line-height: initial;" >
            </div>
            <div class="inside" style="margin-top: 3px;">
                <label for="shortcode">Shortcode: </label>
                <input id="shortcode" type="text" class="regular-text" value="<?php echo esc_attr( sprintf( '[html_form slug="%s"]', $form->slug ) ); ?>" readonly onclick="this.select()">
            </div>
        </div>

        <div style="margin-top: 20px;">
            <label>Form code</label>
            <textarea class="widefat" name="form[markup]" rows="16"><?php echo esc_html( $form->markup ); ?></textarea>
        </div>

        <?php submit_button(); ?>
    </form>
</div>
