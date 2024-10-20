// Get references to UI elements
const tabList = document.getElementById('tabList');
const groupSelectedTabsBtn = document.getElementById('groupSelectedTabs');

// Function to get all tabs and display them
chrome.tabs.query({}, (tabs) => {
  tabs.forEach((tab) => {
    const listItem = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = tab.id;

    listItem.appendChild(checkbox);
    listItem.appendChild(document.createTextNode(tab.title));
    tabList.appendChild(listItem);
  });
});

// Handle group button click
groupSelectedTabsBtn.addEventListener('click', () => {
  const selectedTabIds = [];
  const checkboxes = tabList.querySelectorAll('input[type="checkbox"]');

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedTabIds.push(parseInt(checkbox.value));
    }
  });

  if (selectedTabIds.length > 0) {
    chrome.tabs.group({ tabIds: selectedTabIds }, (groupId) => {
      // Optionally, set a title or color for the group
      chrome.tabGroups.update(groupId, { title: 'My Group', color: 'blue' });
    });
  }
});
