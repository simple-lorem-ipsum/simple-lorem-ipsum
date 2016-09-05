// ugly chrome compatibility layer
if (typeof browser === 'undefined') {
  var browser = chrome;
}

const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, ' +
  'sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ' +
  'At vero eos et accusam et justo duo dolores et ea rebum. ' +
  'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ';

let translate = browser.i18n.getMessage;

let loremIpsum = document.getElementById('loremipsum');
let loremIpsumLabel = document.getElementById('loremipsum_label');
let help = document.getElementById('help');
let bugs = document.getElementById('bugs');

// init labels and placeholders
help.textContent = translate('popupLinkHelp');
bugs.textContent = translate('popupLinkBugs');
loremIpsumLabel.textContent = translate('optionsLoremIpsumLabel');
loremIpsum.placeholder = LOREM_IPSUM;

// init default value from storage
browser.storage.local.get('loremIpsum', (item) => {
  if (!browser.runtime.lastError && item && item.loremIpsum) {
    loremIpsum.value = item.loremIpsum;
  }
});

// save modified value to local storage
function saveHandler() {
  browser.storage.local.set({loremIpsum: loremIpsum.value}, () => {
    if (browser.runtime.lastError) {
      alert(browser.i18n.getMessage('optionsStorageCannotSave'));
    }
  });
}

loremIpsum.addEventListener('keyup', saveHandler);
loremIpsum.addEventListener('change', saveHandler);
