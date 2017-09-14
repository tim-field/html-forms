<?php

namespace HTML_Forms\Actions;

abstract class Action {

    public $type = '';
    public $label = '';

    public function hook() {
        add_action( 'hf_available_form_actions', array( $this, 'register' ) );
        add_action( 'hf_render_form_action_' . $this->type . '_settings', array( $this, 'page_settings' ) );
    }

    /**
     * Renders the settings for this action.
     *
     * @param array $settings
     */
    abstract function page_settings( $settings );

    /**
     * @param array $actions
     * @return array
     */
    public function register( array $actions ) {
        $actions[$this->type] = $this->label;
        return $actions;
    }
}