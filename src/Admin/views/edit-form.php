<?php defined( 'ABSPATH' ) or exit;

$tabs = array(
    'fields'        => __( 'Fields', 'html-forms' ),
    'messages'      => __( 'Messages', 'html-forms' ),
    'settings'      => __( 'Settings', 'html-forms' ),
    'actions'       => __( 'Actions', 'html-forms' ),
    'submissions'   => __( 'Submissions', 'html-forms' ),
);

?>
<script>document.title = 'Edit form' + ' - ' + document.title;</script>
<div class="wrap">

    <p class="breadcrumbs">
        <span class="prefix"><?php echo __( 'You are here: ', 'html-forms' ); ?></span>
        <a href="<?php echo admin_url( 'admin.php?page=html-forms' ); ?>">HTML Forms</a> &rsaquo;
        <span class="current-crumb"><strong><?php _e( 'Edit form', 'html-forms' ); ?></strong></span>
    </p>

    <h1 class="page-title"><?php _e( 'Edit form', 'html-forms' ); ?></h1>

    <form method="post">
        <input type="hidden" name="_hf_admin_action" value="save_form" />
        <input type="hidden" name="form_id" value="<?php echo esc_attr( $form->ID ); ?>" />
        <input type="submit" style="display: none; " />


        <div id="titlediv" class="hf-small-margin">
            <div id="titlewrap">
                <label class="screen-reader-text" for="title"><?php _e( 'Enter form title here', 'html-forms' ); ?></label>
                <input type="text" name="form[title]" size="30" value="<?php echo esc_attr( $form->title ); ?>" id="title" spellcheck="true" autocomplete="off" placeholder="<?php echo __( "Enter the title of your sign-up form", 'html-forms' ); ?>" style="line-height: initial;" >
            </div>
            <div class="inside" style="margin-top: 3px;">
                <label for="shortcode"><?php _e( 'Copy this shortcode and paste it into your post, page, or text widget content:', 'html-forms' ); ?></label><br />
                <input id="shortcode" type="text" class="regular-text" value="<?php echo esc_attr( sprintf( '[html_form slug="%s"]', $form->slug ) ); ?>" readonly onclick="this.select()">
            </div>
        </div>

        <div class="hf-small-margin">
            <h2 class="nav-tab-wrapper" id="hf-tabs-nav">
                <?php foreach( $tabs as $tab => $name ) {
                    $class = ( $active_tab === $tab ) ? 'nav-tab-active' : '';
                    echo sprintf( '<a class="nav-tab nav-tab-%s %s" data-tab-target="%s" href="%s">%s</a>', $tab, $class, $tab, $this->get_tab_url( $tab ), $name );
                } ?>
            </h2>

            <div id="tabs">
                <?php
                // output each tab
                foreach( $tabs as $tab => $name ) {
                    $class = ($active_tab === $tab) ? 'hf-tab-active' : '';
                    echo sprintf('<div class="hf-tab %s" id="tab-%s" data-tab="%s">', $class, $tab, $tab);
                    include __DIR__ . '/tab-' . $tab . '.php';;
                    echo '</div>';
                } // end foreach tab
                ?>

            </div><!-- / tabs -->
        </div>

    </form>
</div>
