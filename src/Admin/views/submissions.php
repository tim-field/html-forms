<?php

defined( 'ABSPATH' ) or exit;
?>

<style>
    .hf-nested-table th,
    .hf-nested-table td { padding: 0; }
</style>
<div class="wrap">

    <p class="breadcrumbs">
        <span class="prefix"><?php echo __( 'You are here: ', 'html-forms' ); ?></span>
        <a href="<?php echo admin_url( 'admin.php?page=html-forms' ); ?>">HTML Forms</a> &rsaquo;
        <span class="current-crumb"><strong><?php _e( 'Submissions', 'html-forms' ); ?></strong></span>
    </p>

    <h1 class="page-title"><?php _e( 'Submissions', 'html-forms' ); ?>

        <?php if ( ! empty( $_GET['s'] ) ) {
            printf(' <span class="subtitle">' . __('Search results for &#8220;%s&#8221;') . '</span>', sanitize_text_field( $_GET['s'] ) );
        } ?>
    </h1>


    <form method="get" action="<?php echo admin_url( 'admin.php' ); ?>">
        <input type="hidden" name="page" value="<?php echo esc_attr( $_GET['page'] ); ?>" />
    </form>

    <table class="wp-list-table widefat fixed striped">
        <thead>
            <tr>
                <th>Form</th>
                <th>Timestamp</th>
                <?php foreach( $columns as $column ) {
                    echo sprintf( '<th>%s</th>', esc_html( ucfirst( strtolower( $column ) ) ) );
                } ?>
            </tr>
        </thead>
        <tbody>

        <?php foreach( $submissions as $s ) { ?>
           <tr>
               <td>
                    <?php
                    $form = hf_get_form( $s->form_id );
                    echo sprintf( '<a href="%s">%s</a>', admin_url( 'admin.php?page=html-forms&view=edit&form_id=' . $s->form_id ), esc_html( $form->title ) );
                    ?>
               </td>
               <td><?php echo esc_html( $s->submitted_at ); ?></td>
               <?php foreach( $columns as $column ) {
                   // TODO: Support array values here.
                   $value = isset( $s->data[ $column ] ) ? $s->data[ $column ] : '';
                   echo sprintf( '<td>%s</td>', esc_html( $value ) );
               } ?>
            </tr>
        <?php } ?>
        </tbody>
    </table>

</div>