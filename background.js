chrome.runtime.onInstalled.addListener(() => {
  const categories = ["Important", "Study", "Quote", "Reference", "Todo"];
  
  chrome.contextMenus.create({
    id: "highlight-menu",
    title: "Highlight as...",
    contexts: ["selection"]
  });
  
  categories.forEach(category => {
    chrome.contextMenus.create({
      id: `highlight-${category.toLowerCase()}`,
      parentId: "highlight-menu",
      title: category,
      contexts: ["selection"]
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId.startsWith("highlight-")) {
    const category = info.menuItemId.replace("highlight-", "");
    chrome.tabs.sendMessage(tab.id, {
      action: "highlight",
      category: category,
      color: "#ffd700"
    });
  }
});