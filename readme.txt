=== HTML Forms ===
Contributors: Ibericode, DvanKooten, hchouhan, lapzor
Donate link: https://htmlforms.io/#utm_source=wp-plugin-repo&utm_medium=html-forms&utm_campaign=donate-link
Tags: form, contact form, email, contact, contact form 7
Requires at least: 4.5
Tested up to: 4.8.2
Stable tag: 1.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Requires PHP: 5.3

Not just another contact form plugin.

== Description ==

HTML Forms is not just another form plugin and certainly not just another form builder.

While form builders can be great for some, we think they are also severely limiting your flexibility and slow to work with.
Add to that the fact that most form builders drastically slow down your site and we're convinced a better (and simpler!) alternative exists.

HTML Forms aims to be that simpler alternative. Here's what makes HTML Forms different from other form builders.

- You have full control over the form HTML. No limitations. If you want, we'll help you in generating the field HTML though.
- You can configure an unlimited amount of actions to run when a form is successfully submitted. For example, to send an email to yourself and another to the person that submitted the form.
- In these emails, you can access your form field values by referencing the field name. For example: `[NAME]` or `[EMAIL]`.
- Each form submission is automatically saved in your database and can be viewed in a simple table format.

Other features include:

- Hide form or redirect to URL after a successful submission.
- Configurable form messages.
- Field validation.
- Developer friendly. HTML Forms comes with a myriad of JavaScript events and WordPress hooks that allow you to modify or extend the plugin's default behavior.


== Installation ==

1. In your WordPress admin panel, go to *Plugins > New Plugin*, search for **HTML Forms** and click "*Install now*"
1. Alternatively, download the plugin and upload the contents of `html-forms.zip` to your plugins directory, which usually is `/wp-content/plugins/`.
1. Activate the plugin

== Frequently Asked Questions ==

#### How to display a form in posts or pages?
Use the `[hf_form]` shortcode.

#### How to display a form in widget areas like the sidebar or footer?
Go to **Appearance > Widgets**, add the "Text Widget" to any of your widget areas and use the `[hf_form]` shortcode.

#### How do I show a form in a pop-up?

We recommend the [Boxzilla pop-up plugin](https://wordpress.org/plugins/boxzilla/) for this. You can use the `[hf_form]` shortcode in your pop-up box to render any of your forms.

#### Can I send an email when the form is submitted?

Yes! You can configure this by opening up the "Actions" tab when editing your form and clicking the "Email" button under "Available actions".


== Other Notes ==

#### Support

Use the [WordPress.org plugin forums](https://wordpress.org/support/plugin/html-forms) for community support where we try to help all of our users. If you found a bug, please create an issue on Github where we can act upon them more efficiently.

#### Development

HTML Forms is being developed on GitHub. If you want to collaborate, please look at [ibericode/html-forms](https://github.com/ibericode/html-forms).


== Screenshots ==

1. Overview of forms in HTML Forms.
2. Editing form fields.
3. Sending an email when a form is submitted.
4. Viewing saved form submissions.
5. Hide form or redirect to URL after form submission.

== Changelog ==


##### 1.0 - In development

Introducing HTML Forms, a different approach to forms for WordPress websites.



