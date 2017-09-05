<?php defined( 'ABSPATH' ) or exit; ?>

<div class="wrap">

    <p class="breadcrumbs">
        <span class="prefix"><?php echo __( 'You are here: ', 'html-forms' ); ?></span>
        <a href="<?php echo admin_url( 'admin.php?page=html-forms' ); ?>">HTML Forms</a> &rsaquo;
        <span class="current-crumb"><strong><?php _e( 'Edit form', 'html-forms' ); ?></strong></span>
    </p>

    <h1 class="page-title"><?php _e( 'Edit form', 'html-forms' ); ?></h1>

    <form method="post">
        <textarea></textarea>

        <?php submit_button(); ?>
    </form>
</div>
