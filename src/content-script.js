// ugly chrome compatibility layer
if (typeof browser === 'undefined') {
  var browser = chrome;
}

const LOREM_IPSUM = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, ' +
  'sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. \n\n' +
  'At vero eos et accusam et justo duo dolores et ea rebum. \n\n' +
  'Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. \n\n' +
  'Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, ' +
  'vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui ' +
  'blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. \n\n' +
  'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, ' +
  'sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. \n\n' +
  'Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis ' +
  'nisl ut aliquip ex ea commodo consequat. \n\n' +
  'Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id ' +
  'quod mazim placerat facer possim assum. ';

let isEditModeActive = false;
let editElement = null;
let isHoverAllowed = true;

const hoverClass = 'simple-lorem-ipsum__editmode-hover';
const editClass = 'simple-lorem-ipsum__editmode-edit';
const infoBoxClass = 'simple-lorem-ipsum__editmode-infobox';

const translatedCharacters = browser.i18n.getMessage('contentInfoboxCharacters');
const translatedWords = browser.i18n.getMessage('contentInfoboxWords');

let sentenceOffset = 0;

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
 * get next sentence from given text
 *
 * @param text
 * @returns {string}
 */
function getNextSentence(text) {
  const lines = text.split('\n\n');

  if (!lines[sentenceOffset]) {
    sentenceOffset = 0;
  }

  const currentText = lines[sentenceOffset].trimEnd() + ' ';
  sentenceOffset += 1;

  return currentText;
}

/**
 * check if the form element is valid to be filled
 *
 * @param item
 * @returns {boolean}
 */
function isValidFormElement(item) {
  const isTextarea = item.tagName === 'TEXTAREA';
  const isInput = item.tagName === 'INPUT' && /text|search|email/.test(item.type);
  return isTextarea || isInput;
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
    if (tempNode.contentEditable === 'true') {
      return true;
    }
    tempNode = tempNode.parentNode;
  }
  return false;
}

/**
 * check if the given node or parent node is a draggable link
 * as it causes strange behaviour
 * Typically found at news pages for teaser elements
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=738749
 *
 * @param node
 * @returns {boolean}
 */
function fixDraggableLink(node) {
  let tempNode = node;
  while (tempNode.parentNode) {
    if (tempNode.tagName === 'A') {
      tempNode.setAttribute('draggable', false);
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
    let node = editElement || document.activeElement;

    // handle iframes differently
    if (node.nodeName === 'IFRAME') {
      node = node.contentWindow.document.activeElement;
    }

    if (fillAllFields === true) {
      for (let currentNode of node.form.elements) {
        if (isValidFormElement(currentNode)) {
          insertFormText(currentNode, getNextSentence(text));
        }
      }
    } else {
      if (isValidFormElement(node)) {
        insertFormText(node, getNextSentence(text));
      } else if (isInsideEditable(node)) {
        insertEditableText(node, getNextSentence(text));
        if (editElement) {
          updateInfoBox();
        }
      }
    }
  });
}

/**
 * insert text into the given form element node at current cursor position
 *
 * @param node
 * @param newValue
 */
function insertFormText(node, newValue) {
  let start = node.selectionStart;
  let oldValue = node.value;
  let before = oldValue.substring(0, start);
  let after = oldValue.substring(node.selectionEnd, oldValue.length);
  node.value = before + newValue + after;
  // collapse node at the end to enable insertion of multiple texts
  node.selectionStart = node.selectionEnd = start + newValue.length;
  node.focus();
}

/**
 * insert text into given dom node at current cursor position
 * this works also within iframes, e.g. rich text editors
 *
 * @param node
 * @param newValue
 */
function insertEditableText(node, newValue) {
  const selection = node.getRootNode().getSelection();
  const range = selection.getRangeAt(0);
  const start = range.startOffset;
  const end = range.endOffset;
  const oldValue = range.startContainer.textContent;
  const before = oldValue.substring(0, start);
  const after = oldValue.substring(end, oldValue.length);
  range.startContainer.textContent = before + newValue + after;
  // collapse node at the end to enable insertion of multiple texts
  range.setStart(range.startContainer, start + newValue.length);
  range.setEnd(range.startContainer, start + newValue.length);
  if(range.startContainer === range.startContainer.TEXT_NODE) {
    range.startContainer.parentNode.focus();
  } else {
    range.startContainer.focus();
  }
}

/**
 * update infobox information
 *
 */
function updateInfoBox() {
  if (editElement) {
    const pos = editElement.getBoundingClientRect();
    const bottom = Math.ceil((window.pageYOffset || document.documentElement.scrollTop) + pos.bottom);
    const left = Math.ceil((window.pageXOffset || document.documentElement.scrollLeft) + pos.left);
    const box = document.querySelector('.' + infoBoxClass);
    box.style.top = `${bottom}px`;
    box.style.left = `${left}px`;
    let text = isValidFormElement(editElement) ? editElement.value : editElement.textContent;
    let wordCount = text.trim().split(' ').length;
    box.textContent = `<${editElement.tagName}>, ${text.length} ${translatedCharacters}, ${wordCount} ${translatedWords}`;
  }
}

/**
 * reset all highlighting back to defaults
 *
 */
function cleanupHighlighting() {
  editElement = null;
  isHoverAllowed = true;
  document.querySelectorAll('.' + hoverClass).forEach((item) => item.classList.remove(hoverClass));
  document.querySelectorAll('.' + editClass).forEach((item) => {
    item.classList.remove(editClass);
    item.removeAttribute('contenteditable');
    item.removeEventListener('keyup', updateInfoBox, true);
    item.removeEventListener('input', updateInfoBox, true);
    item.removeEventListener('mouseup', updateInfoBox, true);
    item.removeEventListener('click', preventPropagation, true);
    item.blur();
  });
}

/**
 * disable default event handling
 *
 * @param e
 * @returns {boolean}
 */
function preventPropagation(e) {
  e.preventDefault();
  e.stopPropagation();
  return false;
}

document.body.addEventListener('mouseover', function (e) {
  if (isEditModeActive && isHoverAllowed) {
    if (!e.target.classList.contains(editClass)) {
      e.target.classList.add(hoverClass);
    }
    editElement = e.target;
    updateInfoBox();
  }
}, true);

document.body.addEventListener('mouseout', function (e) {
  e.target.classList.remove(hoverClass);
}, true);

document.body.addEventListener('click', function (e) {
  if (isEditModeActive && isHoverAllowed) {
    cleanupHighlighting();
    editElement = e.target;
    fixDraggableLink(editElement);
    isHoverAllowed = false;
    updateInfoBox();
    e.target.classList.add(editClass);
    e.target.contentEditable = true;

    e.target.addEventListener('keyup', updateInfoBox, true);
    e.target.addEventListener('input', updateInfoBox, true);
    e.target.addEventListener('mouseup', updateInfoBox, true);
    e.target.addEventListener('click', preventPropagation, true);
    e.target.addEventListener('dragover', preventPropagation, true);
    e.target.addEventListener('drop', preventPropagation, true);

    e.preventDefault();
    e.stopPropagation();

    return false;
  }
}, true);


browser.runtime.onMessage.addListener((request) => {
  if(!document.hasFocus()) {
    // only process hotkeys when document has the focus
    return;
  }

  if (request.status === 'insertLoremIpsum') {
    insertLoremIpsum(request.fillAllFields);
  }

  if (request.status === 'toggleLoremIpsumEditmode') {
    isEditModeActive = !isEditModeActive;
    if (isEditModeActive) {
      cleanupHighlighting();

      const style = document.createElement('style');
      style.type = 'text/css';
      style.id = 'simple-lorem-ipsum';
      style.textContent = `
        .${hoverClass} {
          outline: 3px dashed red !important;
          outline-offset: -3px;
        }
        .${editClass} {
          outline: 3px solid red !important;
          outline-offset: -3px;
        }
        .${infoBoxClass} {
          position: absolute;
          z-index: 9999;
          color: red;
          pointer-events: none;
          margin-top: 2px;
          background: #ddd;
          padding: 3px 8px;
          font-size: 14px;
          font-family: arial;
          left: 0;
          top: 0;
        }
      `;
      document.head.appendChild(style);

      const box = document.createElement('div');
      box.classList.add(infoBoxClass);
      document.body.appendChild(box);

      // find out the element which the mouse is currently on
      const elements = document.querySelectorAll(':hover');
      const currentElement = [].slice.call(elements).pop();
      currentElement.classList.add(hoverClass);
      editElement = currentElement;
      updateInfoBox();

    } else {
      // cleanup
      document.querySelector('.' + infoBoxClass).remove();
      document.querySelector('style#simple-lorem-ipsum').remove();
      cleanupHighlighting();
    }
  }
});
