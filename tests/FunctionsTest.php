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

		// existing replacer, whitespace and fallback value.
		self::assertEquals( hf_replace_template_tags( 'Hello {{user.name||visitor}}' ), "Hello visitor" );
		self::assertEquals( hf_replace_template_tags( 'Hello {{user.name || visitor}}' ), "Hello visitor" );
		self::assertEquals( hf_replace_template_tags( 'Hello {{ user.name   }}' ), "Hello " );
		self::assertEquals( hf_replace_template_tags( 'Hello {{ user.name || visitor }}' ), "Hello visitor" );
		self::assertEquals( hf_replace_template_tags( 'Hello {{    user.name ||     visitor}}' ), "Hello visitor" );

		// unexisting replacer (with dot in param)
		self::assertEquals( hf_replace_template_tags( 'Hello {{ foobar.foo.bar }}' ), "Hello " );
		self::assertEquals( hf_replace_template_tags( 'Hello {{ foobar.foo.bar || visitor}}' ), "Hello visitor" );
	}

}
