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
	 * @covers hf_template
	 */
	public function test_hf_template() {
		Functions\when('is_user_logged_in')->justReturn(false);

		// existing replacer: no parameter, fallback value, parameter with dot
		self::assertEquals( hf_template( 'Hello {{user}}' ), "Hello " );
		self::assertEquals( hf_template( 'Hello {{user||visitor}}' ), "Hello visitor" );
		self::assertEquals( hf_template( 'Hello {{user.name||visitor}}' ), "Hello visitor" );
		self::assertEquals( hf_template( 'Hello {{user.nested.key||visitor}}' ), "Hello visitor" );

		// whitespace variations
		self::assertEquals( hf_template( 'Hello {{ user.name || visitor }}' ), "Hello visitor" );
		self::assertEquals( hf_template( 'Hello {{user.name || visitor}}' ), "Hello visitor" );
		self::assertEquals( hf_template( 'Hello {{ user.name   }}' ), "Hello " );
		self::assertEquals( hf_template( 'Hello {{    user.name ||     visitor}}' ), "Hello visitor" );

		// unexisting replacer: dot in parameter, fallback value
		self::assertEquals( hf_template( 'Hello {{ foobar }}' ), "Hello {{ foobar }}" );
		self::assertEquals( hf_template( 'Hello {{ foobar.foo.bar }}' ), 'Hello {{ foobar.foo.bar }}' );
		self::assertEquals( hf_template( 'Hello {{ foobar.foo.bar || visitor}}' ), 'Hello {{ foobar.foo.bar || visitor}}' );
		self::assertEquals( hf_template( 'Hello {{}}' ), "Hello {{}}" );
	}

	/**
	 * @covers hf_replace_data_variables
	 */
	public function test_hf_replace_data_variables() {
		self::assertEquals( 'Hi ', hf_replace_data_variables( 'Hi [NAME]' ) );
		self::assertEquals( 'Hi John', hf_replace_data_variables( 'Hi [NAME]', array( 'NAME' => 'John' ) ) );
		self::assertEquals( 'Hi John', hf_replace_data_variables( 'Hi [USER.NAME]', array( 'USER' => array( 'NAME' => 'John' ) ) ) );
	}

}
