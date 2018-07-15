# Simple Lorem Ipsum

This extension inserts a simple Lorem Ipsum text into form fields and editable content elements.
Furthermore it provides an edit mode to customize any content on your webpage.


## How to use

* insert dummy text via context menu on form fields.
* insert dummy text via hotkey ```F9``` in form fields or editable content elements (e.g. richtext editors).
* toggle edit mode on and off via hotkey ```F10``` to edit any content on your page.

You can also fill all sibling form fields of the selected form field automatically.
Please consider, that currently only textarea, 
input[text], input[search] and input[email] will be filled automatically.

Furthermore you can specify your own dummy text in the extension options dialog and customize
the given hotkeys.


## Changelog

Version 1.0.0:
* **[breaking change]** new hotkey ```F9``` because ```Ctrl+Alt+V``` was a registered Firefox hotkey to
  insert plain text from clipboard. This conflicted with this extension within contenteditable elements. 
  Therefore the support for richtext editors should be better now. 
* **[feature]** new editmode to edit any content on the page (use hotkey ```F10```), 
  so you are also able to insert dummy text via ```F9``` on any part of the page.
* **[feature]** new infobox in editmode which will show up a character and word count.


## Requirements

This extension has been successfully tested with:
- Mozilla Firefox 61.0.1
- Chromium 66.0

Minimum requirement is Firefox 60.0.

## Privacy

The extension injects a so-called content-script into all webpages to insert
the Lorem Ipsum text, therefore access to all web pages is required.

The application will not send any data to anywhere.

The application stores the defined dummy text and your hotkeys within Firefox storages.

There will be some download statistics of this application collected by Mozilla via https://addons.mozilla.org/.

The source code can be found at [github](https://github.com/simple-lorem-ipsum/simple-lorem-ipsum).



## Contributing

If you want to contribute, please use Javascript ES6 (2015).
Translations for any language are always welcome.
