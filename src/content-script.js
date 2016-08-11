// ugly chrome compatibility layer
if (typeof browser === 'undefined') {
  var browser = chrome;
}

const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, ' +
  'sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ' +
  'At vero eos et accusam et justo duo dolores et ea rebum. ' +
  'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ';

function insertLoremIpsum(fillAllFields = false) {
  let node = document.activeElement;
  if (fillAllFields === true) {
    for (let item of node.form.elements) {
      if (item.tagName === 'TEXTAREA' || (item.tagName === 'INPUT' && /text|search|email/.test(item.type))) {
        item.value += LOREM_IPSUM;
      }
    }
  } else {
    if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
      node.value += LOREM_IPSUM;
    }
  }
}

browser.runtime.onMessage.addListener((request) => {
  if (request.status === 'insertLoremIpsum') {
    insertLoremIpsum(request.fillAllFields);
  }
});
