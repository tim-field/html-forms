<?php

use HTML_Forms\Form;

/**
 * @param $form_id
 * @return Form
 * @throws Exception
 */
function hf_get_form( $form_id ) {
    $post = get_post( $form_id );

    if( ! $post || $post->post_type !== 'html-form' ) {
        throw new Exception( "Invalid form ID" );
    }

    $form = new Form( $post->ID );
    $form->title = $post->post_title;
    $form->slug = $post->post_name;
    $form->markup = $post->post_content;
    return $form;
}