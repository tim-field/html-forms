<?php

defined( 'ABSPATH' ) or exit;
$datetime_format = sprintf('%s %s', get_option( 'date_format' ), get_option( 'time_format' ) );

add_action( 'hf_admin_form_submissions_table_output_column_header', function( $column ) {
   echo esc_html( str_replace( '_', ' ', ucfirst( strtolower( $column ) ) ) );
});

$bulk_actions = apply_filters( 'hf_admin_form_submissions_bulk_actions', array(
  'bulk_delete_submissions' => __( 'Move to Trash' ),
));
?>

<h2><?php _e( 'Form Submissions', 'html-forms' ); ?></h2>

</form><?php // close main form. This means this always has to be the last tab or it will break stuff. ?>
<form method="post">
    <div class="tablenav top">
        <div class="alignleft actions bulkactions">
            <label for="bulk-action-selector-top" class="screen-reader-text"><?php _e( 'Select bulk action' ); ?></label>
            <select name="_hf_admin_action" id="bulk-action-selector-top">
                <option value=""><?php _e( 'Bulk Actions' ); ?></option>
                <?php foreach( $bulk_actions as $key => $label ) { 
                  echo sprintf( '<option value="%s">%s</option>', esc_attr( $key ), $label );
                } ?>
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
                <th scope="col" class="hf-column manage-column column-primary" style="width: 160px;">
                  <?php _e( 'Timestamp', 'html-forms' ); ?>
                </th>
                <?php foreach( $columns as $column ) {
                    echo sprintf( '<th scope="col" class="hf-column manage-column hf-column-%s">', esc_attr( $column ) );
                    do_action( 'hf_admin_form_submissions_table_output_column_header', $column );
                    echo '</th>';
                } ?>
            </tr>
        </thead>
        <tbody>

        <?php foreach( $submissions as $s ) { ?>
           <tr id="hf-submissions-item-<?php echo $s->id; ?>">
               <th scope="row" class="check-column">
                   <input type="checkbox" name="id[]" value="<?php echo esc_attr( $s->id ); ?>"/>
               </th>
               <td class="has-row-actions column-primary">
                   <strong><abbr title="<?php echo date( $datetime_format, strtotime( $s->submitted_at ) ); ?>">
                       <?php echo sprintf( '<a href="%s">%s</a>', esc_attr( add_query_arg( array( 'tab' => 'submissions', 'submission_id' => $s->id ) ) ), esc_html( $s->submitted_at ) ); ?>
                   </abbr></strong>
                  <div class="row-actions">
                    <?php do_action( 'hf_admin_form_submissions_table_output_row_actions', $s ); ?>
                  </div>
               </td>

               <?php foreach( $columns as $column ) {
                   echo "<td>";
                   $value = isset( $s->data[ $column ] ) ? $s->data[ $column ] : '';

                   if( hf_is_file( $value ) ) {
                      $file_url = isset( $value['url'] ) ? $value['url'] : '';
                      if( isset( $value['attachment_id'] ) ) {
                        $file_url = admin_url( 'post.php?action=edit&post=' . $value['attachment_id'] );
                      }
                      $short_name = substr( $value['name'], 0, 20 );
                      $suffix = strlen( $value['name'] ) > 20 ? '...' : '';
                      echo sprintf( '<a href="%s">%s%s</a> (%s)', $file_url, $short_name, $suffix, hf_human_filesize( $value['size'] ) );
                   } else {
                     // regular (scalar) values
                     if( is_array( $value ) ) {
                        $value = join( ', ', $value );
                     }
                     $value = esc_html( $value );
                     echo sprintf( '%s%s', substr( $value, 0, 100 ), strlen( $value ) > 100 ? '...' : '' );
                   }
                   echo '</td>';
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
