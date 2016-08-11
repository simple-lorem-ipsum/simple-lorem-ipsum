// ugly chrome compatibility layer
if (typeof browser === 'undefined') {
  var browser = chrome;
}

let translate = browser.i18n.getMessage;

// notify content script
function insertLoremIpsum() {
  browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
    browser.tabs.sendMessage(tabs[0].id, {status: 'insertLoremIpsum'});
  });
}

// register hotkey
browser.commands.onCommand.addListener((command) => {
  if (command === 'insert-lorem-ipsum') {
    insertLoremIpsum();
  }
});

// create context menu
browser.contextMenus.create({
  id: 'contextmenuInsertLoremIpsum',
  title: translate('contextmenuInsertLoremIpsum'),
  contexts: ['editable']
});

// create context menu handler
browser.contextMenus.onClicked.addListener((info) => {
  if (
    info.menuItemId === 'contextmenuInsertLoremIpsum' &&
    info.editable
  ) {
    insertLoremIpsum();
  }
});
