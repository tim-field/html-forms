Changelog
=========

#### 1.1 - December 21, 2017

**Fixes**

- JavaScript error in some older browser when submitting the form.

**Improvements**

- Use custom user capability base for editing & viewing forms.
- Delay form response until a later hook so other plugins get a chance to hook in.
- Disable client-side validation for conditional fields marked as required.

**Additions**

- Added live preview to the form editor.


#### 1.0.6 - December 11, 2017

**Fixes**

- Array replacements in email message were showing "Array" instead of a comma separated list of values.
- Don't reset form when there are errors. Thanks [Jeroen Sormani](https://github.com/JeroenSormani)!

**Additions**

- You can now use certain [template variables](https://kb.htmlforms.io/template-variables/) in the form content which will be dynamically replaced. 
- Added `hf_validate_form_{$form_slug}` filter hook.
- Added `hf_form_{$form_slug}_success` action hook.


#### 1.0.5 - November 18, 2017

**Fixes**

- Could not save more than one "Email" action.


#### 1.0.4 - November 10, 2017

**Fixes**

- Incompatibility with PHP versions before 5.6.
- Data variables could not be placed on the same line.

**Improvements**

- Clear output buffer before sending AJAX response to prevent issues with response parsing.

**Additions**

- Added `hf_form_message_{$code}` filter hook.



#### 1.0.3 - November 6, 2017

**Additions**

- Added [support for conditional elements](https://kb.htmlforms.io/conditional-elements/) by using `data-show-if` and `data-hide-if` attributes.

**Improvements**

- Accept `id` argument in `[hf_form]` shortcode.
- Catch errors in shortcode's `slug` attribute.
- Allow changing form slug after initial form is saved.

**Fixes**

- Fixes stylesheet URL when option to load stylesheet is toggled.



#### 1.0.2 - October 30, 2017

**Fixes**

- Form validation always failing when form has 0 required fields.

**Improvements**

- Fake success response when honeypot validation fails.
- Validate request by comparing size of POST array with number of form fields.
- Ensure submit button never has label element when using the field helper.
- Optimize URL generation of asset files on frontend.

**Additions**

- Added `hf_validate_form_request_size` filter hook.


#### 1.0.1 - October 28, 2017

**Improvements**
- Added SVG admin menu icon.
- Field names are now sanitized before they are saved in the database.
- Submit button was missing for default form fields.
- Unneeded `<form>` tags are now stripped from the form before saving.

**Additions**
- Added `data-title` and `data-slug` attributes to the `<form>` element on the frontend.


#### 1.0 - October 25, 2017

Introducing a first version of HTML Forms, a different approach to forms for WordPress sites.


