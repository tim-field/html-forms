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

		// existing replacer: no parameter, fallback value, parameter with dot
		self::assertEquals( hf_replace_template_tags( 'Hello {{user}}' ), "Hello " );
		self::assertEquals( hf_replace_template_tags( 'Hello {{user||visitor}}' ), "Hello visitor" );
		self::assertEquals( hf_replace_template_tags( 'Hello {{user.name||visitor}}' ), "Hello visitor" );
		self::assertEquals( hf_replace_template_tags( 'Hello {{user.nested.key||visitor}}' ), "Hello visitor" );

		// whitespace variations
		self::assertEquals( hf_replace_template_tags( 'Hello {{ user.name || visitor }}' ), "Hello visitor" );
		self::assertEquals( hf_replace_template_tags( 'Hello {{user.name || visitor}}' ), "Hello visitor" );
		self::assertEquals( hf_replace_template_tags( 'Hello {{ user.name   }}' ), "Hello " );
		self::assertEquals( hf_replace_template_tags( 'Hello {{    user.name ||     visitor}}' ), "Hello visitor" );

		// unexisting replacer: dot in parameter, fallback value
		self::assertEquals( hf_replace_template_tags( 'Hello {{ foobar }}' ), "Hello {{ foobar }}" );
		self::assertEquals( hf_replace_template_tags( 'Hello {{ foobar.foo.bar }}' ), 'Hello {{ foobar.foo.bar }}' );
		self::assertEquals( hf_replace_template_tags( 'Hello {{ foobar.foo.bar || visitor}}' ), 'Hello {{ foobar.foo.bar || visitor}}' );
		self::assertEquals( hf_replace_template_tags( 'Hello {{}}' ), "Hello {{}}" );
	}

}
