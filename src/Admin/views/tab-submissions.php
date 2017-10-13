<?php

defined( 'ABSPATH' ) or exit;
$datetime_format = sprintf('%s %s', get_option( 'date_format' ), get_option( 'time_format' ) );

function hf_column_toolbox( $key ) {
    global $form;

    ?>
    <div class="hf-column-menu">
        <div class="submenu-toggle"></div>
        <div class="submenu">
            <a href="#"><?php echo __( 'Rename column', 'html-forms' ); ?></a>
            <a class="hf-danger" href="<?php echo esc_attr( add_query_arg( array( '_hf_admin_action' => 'delete_data_column', 'column_key' => $key ) ) ); ?>"><?php echo __( 'Delete column', 'html-forms' ); ?></a>
        </div>
    </div>
    <?php
}
?>

</form><?php // close main form. This means this always has to be the last tab or it will break stuff. ?>

<h2><?php _e( 'Form Submissions', 'html-forms' ); ?></h2>

<form method="post">
    <div class="tablenav top">
        <div class="alignleft actions bulkactions">
            <label for="bulk-action-selector-top" class="screen-reader-text"><?php _e( 'Select bulk action' ); ?></label>
            <select name="_hf_admin_action" id="bulk-action-selector-top">
                <option value=""><?php _e( 'Bulk Actions' ); ?></option>
                <option value="bulk_delete_submissions"><?php _e( 'Move to Trash' ); ?></option>
            </select>
            <input type="submit" class="button action" value="<?php _e( 'Apply' ); ?>">
        </div>

        <div class="tablenav-pages one-page">
            <span class="displaying-num"><?php echo sprintf( __( '%d items' ), count( $submissions ) ); ?></span>
        </div>

        <br class="clear">
    </div>

    <table class="wp-list-table widefat fixed striped">
        <thead>
            <tr>
                <td id="cb" class="manage-column column-cb check-column"><input type="checkbox" /></td>
                <th scope="col" class="hf-column manage-column">Timestamp</th>
                <?php foreach( $columns as $column ) {
                    echo '<th scope="col" class="hf-column manage-column">';
                    echo esc_html( ucfirst( strtolower( $column ) ) );
                    hf_column_toolbox( $column );
                    echo '</th>';
                } ?>
            </tr>
        </thead>
        <tbody>

        <?php foreach( $submissions as $s ) { ?>
           <tr>
               <th scope="row" class="check-column">
                   <input type="checkbox" name="id[]" value="<?php echo esc_attr( $s->id ); ?>"/>
               </th>
               <td>
                   <abbr title="<?php echo date( $datetime_format, strtotime( $s->submitted_at ) ); ?>"><?php echo esc_html( $s->submitted_at ); ?></abbr>
               </td>
               <?php foreach( $columns as $column ) {
                   $value = isset( $s->data[ $column ] ) ? $s->data[ $column ] : '';
                   if( is_array( $value ) ) {
                       $value = join( ', ', $value );
                   }
                   $value = esc_html( $value );

                   echo sprintf( '<td>%s%s</td>', substr( $value, 0, 100 ), strlen( $value ) > 100 ? '...' : '' );
               } ?>
            </tr>
        <?php } ?>
        <?php if ( empty( $submissions ) ) {
            printf( '<tr><td colspan="2">%s</td></tr>', __( 'Nothing to see here, yet!', 'html-forms' ) );
        } ?>
        </tbody>
    </table>

</form>


<form><?php // open new main form. This means this always has to be the last tab or it will break stuff. ?>
