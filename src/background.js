// ugly chrome compatibility layer
if (typeof browser === 'undefined') {
  var browser = chrome;
}

/**
 * notify the content script to insert the lorem ipsum.
 * optionally notifiy if all fields of the form should be filled.
 *
 * @param fillAllFields
 */
function insertLoremIpsum(fillAllFields = false) {
  browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {status: 'insertLoremIpsum', fillAllFields});
  });
}

function toggleLoremIpsumEditmode() {
  browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {status: 'toggleLoremIpsumEditmode'});
  });
}

// register hotkey
browser.commands.onCommand.addListener((command) => {
  if (command === 'insert-lorem-ipsum') {
    insertLoremIpsum();
  }

  if (command === 'toggle-lorem-ipsum-editmode') {
    toggleLoremIpsumEditmode();
  }
});

// create context menus
browser.contextMenus.create({
  id: 'contextmenuInsertLoremIpsumSingleField',
  title: browser.i18n.getMessage('contextmenuInsertLoremIpsumSingleField'),
  contexts: ['editable'],
  onclick: () => {
    insertLoremIpsum();
  }
});
browser.contextMenus.create({
  id: 'contextmenuInsertLoremIpsumAllFields',
  title: browser.i18n.getMessage('contextmenuInsertLoremIpsumAllFields'),
  contexts: ['editable'],
  onclick: () => {
    insertLoremIpsum(true);
  }
});

browser.contextMenus.create({
  id: 'contextmenuToggleEditmode',
  title: browser.i18n.getMessage('contextmenuToggleEditmode'),
  onclick: () => {
    toggleLoremIpsumEditmode(true);
  }
});
