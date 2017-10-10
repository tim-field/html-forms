<?php defined( 'ABSPATH' ) or exit; ?>

<div class="wrap">

    <style type="text/css" scoped>
        label{ display: block; font-weight: bold; font-size: 18px; }
    </style>

    <p class="breadcrumbs">
        <span class="prefix"><?php echo __( 'You are here: ', 'html-forms' ); ?></span>
        <a href="<?php echo admin_url( 'admin.php?page=html-forms' ); ?>">HTML Forms</a> &rsaquo;
        <span class="current-crumb"><strong><?php _e( 'Add new form', 'html-forms' ); ?></strong></span>
    </p>

    <h1 class="page-title"><?php _e( 'Add new form', 'html-forms' ); ?></h1>

    <form method="post" style="max-width: 600px;">
        <input type="hidden" name="_hf_admin_action" value="create_form" />

        <p>
            <label>Form title</label>
            <input type="text" name="form[title]" value="" placeholder="Your form title.." class="widefat" required />
        </p>

        <?php submit_button(); ?>
    </form>
</div>
