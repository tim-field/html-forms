<?php
$available_actions = $this->get_available_form_actions();
?>

<h2><?php echo __( 'Form Actions', 'html-forms' ); ?></h2>

<div id="hf-form-actions">
    <?php
    if( ! empty( $form->settings['actions'] ) ) {
        foreach ($form->settings['actions'] as $action) {
            do_action( 'hf_render_form_action_settings_' . $action['type'], $action['settings'] );
        }
    } else {
        echo '<p>' . __( 'No form actions configured for this form.', 'html-forms' ) . '</p>';
    }
    ?>
</div>

<div class="hf-small-margin">
    <h4><?php echo __( 'Add form action', 'html-forms' ); ?></h4>
    <p>
        <?php
        foreach( $available_actions as $type => $label ) {
            echo sprintf( '<input type="button" value="%s" data-action-type="%s" class="button" />', esc_html( $label ), esc_attr( $type ) );
        };
        ?>
    </p>
</div>

<div style="display: none;" id="hf-action-templates">
    <?php
        foreach( $available_actions as $type => $label ) {
            echo sprintf( '<div id="hf-action-type-%s-template">', $type );
            do_action( 'hf_render_form_action_' . $type . '_settings', array() );
            echo '</div>';
        }
    ?>
</div>


