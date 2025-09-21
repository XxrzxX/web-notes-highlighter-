console.log('Highlighter loaded');

// Load saved highlights when page loads
loadHighlights();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'highlight') {
    highlightSelection(request.category, request.color);
  }
});

async function loadHighlights() {
  const url = window.location.href;
  const result = await chrome.storage.local.get([url]);
  if (result[url]) {
    result[url].forEach(highlight => {
      restoreHighlight(highlight.text, highlight.category, highlight.color);
    });
  }
}

async function saveHighlight(text, category, color) {
  const url = new URL(window.location.href).origin + new URL(window.location.href).pathname;
  const result = await chrome.storage.local.get([url]);
  const highlights = result[url] || [];
  if (highlights.length < 100) {
    highlights.push({ text, category, color, timestamp: Date.now() });
    await chrome.storage.local.set({ [url]: highlights });
  }
}

function restoreHighlight(text, category, color) {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let node;
  while (node = walker.nextNode()) {
    if (node.textContent.includes(text) && !node.parentElement.style.backgroundColor) {
      const content = node.textContent;
      const index = content.indexOf(text);
      if (index !== -1) {
        const before = content.substring(0, index);
        const highlighted = content.substring(index, index + text.length);
        const after = content.substring(index + text.length);

        const span = document.createElement('span');
        span.style.backgroundColor = color + '80';
        span.style.cursor = 'pointer';
        span.title = 'Double-click to remove';
        span.textContent = highlighted;
        
        span.addEventListener('dblclick', async () => {
          await removeHighlight(text);
          span.outerHTML = span.textContent;
        });

        const parent = node.parentNode;
        if (before) parent.insertBefore(document.createTextNode(before), node);
        parent.insertBefore(span, node);
        if (after) parent.insertBefore(document.createTextNode(after), node);
        parent.removeChild(node);
        break;
      }
    }
  }
}

async function removeHighlight(text) {
  const url = window.location.href;
  const result = await chrome.storage.local.get([url]);
  const highlights = result[url] || [];
  const filtered = highlights.filter(h => h.text !== text);
  await chrome.storage.local.set({ [url]: filtered });
}

function highlightSelection(category, color) {
  const selection = window.getSelection();
  if (!selection.rangeCount) return;

  const range = selection.getRangeAt(0);
  let text = selection.toString().trim();
  if (!text) return;
  // Security: sanitize only for storage, keep original for highlighting
  const sanitizedText = text.replace(/[<>"'&]/g, '').substring(0, 500);

  const span = document.createElement('span');
  span.style.backgroundColor = color + '80';
  span.style.cursor = 'pointer';
  span.title = 'Double-click to remove';
  span.setAttribute('data-category', category);
  
  span.addEventListener('dblclick', async () => {
    await removeHighlight(text);
    span.outerHTML = span.textContent;
  });

  try {
    range.surroundContents(span);
    selection.removeAllRanges();
    saveHighlight(sanitizedText, category, color);
    console.log('Highlighted and saved:', text);
  } catch (e) {
    console.log('Highlight failed:', e);
  }
}