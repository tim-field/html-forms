<?php defined( 'ABSPATH' ) or exit; ?>

<div class="wrap">

    <p class="breadcrumbs">
        <span class="prefix"><?php echo __( 'You are here: ', 'html-forms' ); ?></span>
        <a href="<?php echo admin_url( 'admin.php?page=html-forms' ); ?>">HTML Forms</a> &rsaquo;
        <span class="current-crumb"><strong><?php _e( 'Add new form', 'html-forms' ); ?></strong></span>
    </p>

    <h1 class="page-title"><?php _e( 'Add new form', 'html-forms' ); ?></h1>

    <form method="post">
        <input type="hidden" name="_html_forms_admin_action" value="create_form" />
        <?php submit_button(); ?>
    </form>
</div>
