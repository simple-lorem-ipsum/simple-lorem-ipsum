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

const translate = browser.i18n.getMessage;

const loremIpsum = document.getElementById('loremipsum');
const loremIpsumLabel = document.getElementById('loremipsum_label');
const hotkeys = document.querySelector('.hotkeys');
const help = document.getElementById('help');
const bugs = document.getElementById('bugs');

// init labels and placeholders
help.textContent = translate('popupLinkHelp');
bugs.textContent = translate('popupLinkBugs');
loremIpsumLabel.textContent = translate('optionsLoremIpsumLabel');
loremIpsum.placeholder = LOREM_IPSUM;

const invalidKey = translate('optionsInvalidKey');

// init default value from storage
browser.storage.local.get('loremIpsum', (item) => {
  if (!browser.runtime.lastError && item && item.loremIpsum) {
    loremIpsum.value = item.loremIpsum;
  }
});

browser.commands.getAll((commands) => {
  let html = '';
  commands.forEach((item) => {
    if (item.name !== '_execute_browser_action') {
      html += `<label for="${item.name}">${item.description}</label>`;
      html += `<input type="text" id="${item.name}" name="${item.name}" class="" value="${item.shortcut}" />`;
    }
  });
  hotkeys.innerHTML = html;
});

// save modified value to local storage
function saveLoremIpsumHandler() {
  browser.storage.local.set({ loremIpsum: loremIpsum.value }, () => {
    if (browser.runtime.lastError) {
      alert(browser.i18n.getMessage('optionsStorageCannotSave'));
    }
  });
}

loremIpsum.addEventListener('keyup', saveLoremIpsumHandler);
loremIpsum.addEventListener('change', saveLoremIpsumHandler);

hotkeys.addEventListener('keydown', function (e) {
  e.preventDefault();
  e.stopPropagation();
  if (e.key !== 'Shift' && e.key !== 'Control' && e.key !== 'Alt' && e.key !== 'OS') {
    const hotKey = [];
    if (e.ctrlKey) hotKey.push('Ctrl');
    if (e.altKey) hotKey.push('Alt');
    if (e.shiftKey) hotKey.push('Shift');
    let key = e.key
      .replace('Arrow', '')
      .replace('.', 'Period')
      .replace(',', 'Comma')
      .replace(' ', 'Space');
    if (key.length === 1) {
      key = key.toUpperCase();
    }
    hotKey.push(key);
    e.target.value = hotKey.join('+');

    hotkeys.querySelectorAll('input').forEach((item) => {
      try {
        // TODO: i would expect that Firefox would return a valid promise here even when it fails - unfortunately not...
        // TODO: remove regular try-catch when Firefox catches internal exceptions...
        browser.commands.update({
          name: item.name,
          shortcut: item.value,
        }).then(
          () => {
            item.classList.remove('warning');
          },
          () => {
            item.value = invalidKey;
            item.classList.add('warning');
          }
        );
      } catch (e) {
        item.value = invalidKey;
        item.classList.add('warning');
      }
    });
  }
});
