<?php

use HTML_Forms\Form;

/**
 * @param $form_id_or_slug int|string
 * @return Form
 * @throws Exception
 */
function hf_get_form( $form_id_or_slug ) {

    if( is_numeric( $form_id_or_slug ) ) {
        $post = get_post( $form_id_or_slug );

        if( ! $post || $post->post_type !== 'html-form' ) {
            throw new Exception( "Invalid form ID" );
        }
    } else {
        $posts = get_posts(
            array(
                'post_type' => 'html-form',
                'post_name' => $form_id_or_slug,
                'numberposts' => 1,
            )
        );

        if( empty( $posts ) ) {
            throw new Exception( 'Invalid form slug' );
        }
        $post = $posts[0];
    }

    $settings = array();
    $post_meta = get_post_meta( $post->ID );
    if( ! empty( $post_meta['_hf_settings'][0] ) ) {
        $settings = (array) maybe_unserialize( $post_meta['_hf_settings'][0] );
    }

    $messages = array();
    foreach( $post_meta as $meta_key => $meta_values ) {
        if( strpos( $meta_key, 'hf_message_' ) === 0 ) {
            $message_key = substr( $meta_key, strlen( 'hf_message_' ) );
            $messages[$message_key] = (string) $meta_values[0];
        }
    }

    $form = new Form( $post->ID );
    $form->title = $post->post_title;
    $form->slug = $post->post_name;
    $form->markup = $post->post_content;
    $form->settings = $settings;
    $form->messages = $messages;
    return $form;
}