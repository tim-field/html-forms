<?php

use PHPUnit\Framework\TestCase;
use HTML_Forms\Submission;

class SubmissionTest extends TestCase {
	public function test_from_object() {
		$expected = new Submission();
		$expected->id = 1;
		$expected->form_id = 1;
		$expected->data = array();
		$expected->ip_address = '127.0.0.1';
		$expected->user_agent = 'user agent';
		$expected->referer_url = 'https://ibericode.com';
		$expected->submitted_at = time();

		$actual = Submission::from_object((object) array(
			'id' => (string) $expected->id,
			'form_id' => (string) $expected->form_id,
			'data' => json_encode( $expected->data ),
			'ip_address' => $expected->ip_address,
			'user_agent' => $expected->user_agent,
			'referer_url' => $expected->referer_url,
			'submitted_at' => (string) $expected->submitted_at,
		));

		self::assertEquals( $expected->id, $actual->id );
		self::assertEquals( $expected->form_id, $actual->form_id );
		self::assertEquals( $expected->data, $actual->data );
		self::assertEquals( $expected->ip_address, $actual->ip_address );
		self::assertEquals( $expected->user_agent, $actual->user_agent );
		self::assertEquals( $expected->referer_url, $actual->referer_url );
		self::assertEquals( $expected->submitted_at, $actual->submitted_at );
	}
}
