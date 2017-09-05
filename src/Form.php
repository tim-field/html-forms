<?php

namespace HTML_Forms;

class Form {

    public $ID;
    public $title;
    public $slug;
    public $markup;

    public function __construct( $ID ) {
        $this->ID = $ID;
    }


}