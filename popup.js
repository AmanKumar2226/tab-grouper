// Get references to UI elements
const tabList = document.getElementById('tabList');
const groupSelectedTabsBtn = document.getElementById('groupSelectedTabs');
const groupSelectDropdown = document.getElementById('groupSelect'); // Dropdown for groups

// Function to get all tabs and display only ungrouped tabs
chrome.tabs.query({}, (tabs) => {
  const ungroupedTabs = tabs.filter(tab => tab.groupId === -1);
  const groupIds = new Set(tabs.map(tab => tab.groupId).filter(id => id !== -1)); // Unique group IDs

  // Populate the group dropdown with existing groups
  groupIds.forEach(groupId => {
    chrome.tabGroups.get(groupId, (group) => {
      const option = document.createElement('option');
      option.value = group.id;
      option.textContent = group.title || `Group ${group.id}`; // Fallback if no title
      groupSelectDropdown.appendChild(option);
    });
  });

  // Populate the list with ungrouped tabs
  ungroupedTabs.forEach((tab) => {
    const listItem = document.createElement('li');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = tab.id;

    listItem.appendChild(checkbox);
    listItem.appendChild(document.createTextNode(tab.title));
    tabList.appendChild(listItem);
  });

  // If no ungrouped tabs, display a message
  if (ungroupedTabs.length === 0) {
    const noTabsMessage = document.createElement('li');
    noTabsMessage.textContent = 'No ungrouped tabs available.';
    tabList.appendChild(noTabsMessage);
    groupSelectedTabsBtn.disabled = true; // Disable button if no tabs to group
  }
});

// Handle group button click
groupSelectedTabsBtn.addEventListener('click', () => {
  const selectedTabIds = [];
  const checkboxes = tabList.querySelectorAll('input[type="checkbox"]');

  // Collect IDs of selected ungrouped tabs
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      selectedTabIds.push(parseInt(checkbox.value));
    }
  });

  // Get selected group ID from dropdown
  const selectedGroupId = parseInt(groupSelectDropdown.value);

  // Check if any tabs are selected and a valid group is selected
  if (selectedTabIds.length > 0 && !isNaN(selectedGroupId)) {
    // Add selected tabs to the chosen group
    chrome.tabs.group({ tabIds: selectedTabIds, groupId: selectedGroupId }, (groupId) => {
      // Optionally update the group if needed
      chrome.tabGroups.update(selectedGroupId, { title: 'Updated Group Title', color: 'blue' });
    });
  } else if (selectedTabIds.length > 0) {
    // If no group is selected, create a new group with selected tabs
    chrome.tabs.group({ tabIds: selectedTabIds }, (newGroupId) => {
      chrome.tabGroups.update(newGroupId, { title: 'New Group', color: 'blue' });
    });
  }
});
