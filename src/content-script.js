// ugly chrome compatibility layer
if (typeof browser === 'undefined') {
    var browser = chrome;
}

const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, ' +
    'sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. ' +
    'At vero eos et accusam et justo duo dolores et ea rebum. ' +
    'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. ';

function insertLoremIpsum() {

    let node = document.activeElement;

    if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
        node.value += LOREM_IPSUM;
    }
}

browser.runtime.onMessage.addListener((request) => {
    if (request.status === 'insertLoremIpsum') {
        insertLoremIpsum();
    }
});