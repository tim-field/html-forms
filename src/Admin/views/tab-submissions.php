<?php

defined( 'ABSPATH' ) or exit;
?>

<h2><?php _e( 'Form Submissions', 'html-forms' ); ?></h2>


<form method="get" action="<?php echo admin_url( 'admin.php' ); ?>">
    <input type="hidden" name="page" value="<?php echo esc_attr( $_GET['page'] ); ?>" />
</form>

<table class="wp-list-table widefat fixed striped">
    <thead>
        <tr>
            <th>Timestamp</th>
            <?php foreach( $columns as $column ) {
                echo sprintf( '<th>%s</th>', esc_html( ucfirst( strtolower( $column ) ) ) );
            } ?>
        </tr>
    </thead>
    <tbody>

    <?php foreach( $submissions as $s ) { ?>
       <tr>
           <td><?php echo esc_html( $s->submitted_at ); ?></td>
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
    </tbody>
</table>

