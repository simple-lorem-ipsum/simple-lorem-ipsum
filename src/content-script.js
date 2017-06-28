// ugly chrome compatibility layer
if (typeof browser === 'undefined') {
  var browser = chrome;
}

const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, ' +
  'sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ' +
  'At vero eos et accusam et justo duo dolores et ea rebum. ' +
  'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ';

/**
 * load text from config, use constant as fallback
 *
 * @param cb
 */
function getLoremIpsumFromConfig(cb) {
  browser.storage.local.get('loremIpsum', (item) => {
    if (!browser.runtime.lastError && item && item.loremIpsum) {
      cb(item.loremIpsum);
    } else {
      cb(LOREM_IPSUM);
    }
  });
}

/**
 * check if the form element is valid to be filled
 *
 * @param item
 * @returns {boolean}
 */
function isValidFormElement(item) {
  return item.tagName === 'TEXTAREA' ||
    (
      item.tagName === 'INPUT' &&
      /text|search|email/.test(item.type)
    );
}

/**
 * check if the given node is editable or
 * is inside of an editable parent element
 *
 * @param node
 * @returns {boolean}
 */
function isInsideEditable(node) {
  let tempNode = node;
  while (tempNode.parentNode) {
    if (tempNode.contentEditable) {
      return true;
    }
    tempNode = tempNode.parentNode;
  }
  return false;
}

/**
 * insert lorem ipsum dummy text
 *
 * @param fillAllFields
 */
function insertLoremIpsum(fillAllFields = false) {
  getLoremIpsumFromConfig((text) => {
    let node = document.activeElement;
    if (fillAllFields === true) {
      for (let currentNode of node.form.elements) {
        if (isValidFormElement(currentNode)) {
          insertText(currentNode, text);
        }
      }
    } else {
      if (isValidFormElement(node)) {
        insertText(node, text);
      } else if (isInsideEditable(node)) {
        node.innerHTML += `<p>${text}</p>`;
      }
    }
  });
}

/**
 * insert text into the given dom node at current cursor position
 *
 * @param node
 * @param newValue
 */
function insertText(node, newValue) {
  let start = node.selectionStart;
  let oldValue = node.value;
  let before = oldValue.substring(0, start);
  let after = oldValue.substring(node.selectionEnd, oldValue.length);
  node.value = before + newValue + after;
  node.selectionStart = node.selectionEnd = start + newValue.length;
  node.focus();
}

browser.runtime.onMessage.addListener((request) => {
  if (request.status === 'insertLoremIpsum') {
    insertLoremIpsum(request.fillAllFields);
  }
});
