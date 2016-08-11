// ugly chrome compatibility layer
if (typeof browser === 'undefined') {
  var browser = chrome;
}

// notify content script
function insertLoremIpsum(fillAllFields = false) {
  browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
    if (fillAllFields === true) {
      browser.tabs.sendMessage(tabs[0].id, {status: 'insertLoremIpsum', fillAllFields: true});
    } else {
      browser.tabs.sendMessage(tabs[0].id, {status: 'insertLoremIpsum', fillAllFields: false});
    }
  });
}

// register hotkey
browser.commands.onCommand.addListener((command) => {
  if (command === 'insert-lorem-ipsum') {
    insertLoremIpsum();
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
