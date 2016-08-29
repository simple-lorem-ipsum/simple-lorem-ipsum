// ugly chrome compatibility layer
if (typeof browser === 'undefined') {
  var browser = chrome;
}

const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, ' +
  'sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ' +
  'At vero eos et accusam et justo duo dolores et ea rebum. ' +
  'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ';

// load text from config, use constant as fallback
function getLoremIpsumFromConfig(cb) {
  browser.storage.local.get('loremIpsum', (item) => {
    if (!browser.runtime.lastError && item && item.loremIpsum) {
      cb(item.loremIpsum);
    } else {
      cb(LOREM_IPSUM);
    }
  });
}

function isValidFormElement(item) {
  return item.tagName === 'TEXTAREA' ||
    (
      item.tagName === 'INPUT' &&
      /text|search|email/.test(item.type)
    );
}

function insertLoremIpsum(fillAllFields = false) {
  getLoremIpsumFromConfig((text) => {
    let node = document.activeElement;
    if (fillAllFields === true) {
      for (let item of node.form.elements) {
        if (isValidFormElement(item)) {
          item.value += text;
        }
      }
    } else {
      if (isValidFormElement(node)) {
        node.value += text;
      } else if (node.contentEditable == 'true') {
        node.innerHTML += text;
      }
    }
  });
}

browser.runtime.onMessage.addListener((request) => {
  if (request.status === 'insertLoremIpsum') {
    insertLoremIpsum(request.fillAllFields);
  }
});
