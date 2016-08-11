// ugly chrome compatibility layer
if (typeof browser === 'undefined') {
  var browser = chrome;
}

const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, ' +
  'sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ' +
  'At vero eos et accusam et justo duo dolores et ea rebum. ' +
  'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ';

let loremIpsum = document.getElementById('loremipsum');
let loremIpsumLabel = document.getElementById('loremipsum_label');

// init labels and placeholders
loremIpsumLabel.textContent = browser.i18n.getMessage('optionsLoremIpsumLabel');
loremIpsum.placeholder = LOREM_IPSUM;

// init default value from storage
browser.storage.local.get('loremIpsum', (item) => {
  if (!browser.runtime.lastError && item && item.loremIpsum) {
    loremIpsum.value = item.loremIpsum;
  }
});

// save modified value on keyup to storage
loremIpsum.addEventListener('keyup', () => {
  browser.storage.local.set({loremIpsum: loremIpsum.value}, () => {
    if (browser.runtime.lastError) {
      alert(browser.i18n.getMessage('optionsStorageCannotSave'));
    }
  });
});
