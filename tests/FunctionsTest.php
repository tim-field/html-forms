<?php

use PHPUnit\Framework\TestCase;

use Brain\Monkey;
use Brain\Monkey\Functions;

class FunctionsTest extends TestCase {

	protected function setUp() {
        parent::setUp();
        Monkey\setUp();
    }

    protected function tearDown() {
        Monkey\tearDown();
        parent::tearDown();
    }

	/**
	 * @covers hf_replace_template_tags
	 */
	public function test_hf_replace_template_tags() {
		Functions\when('is_user_logged_in')->justReturn(false);
		$template = 'Hello {{user.name || visitor}}';
		$result = hf_replace_template_tags( $template );
		self::assertEquals( $result, "Hello visitor" );
	}

}
