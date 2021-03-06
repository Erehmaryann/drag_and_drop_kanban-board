const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {


  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.getItem('backlogItems'));
    progressListArray = JSON.parse(localStorage.getItem('progressItems'));
    completeListArray = JSON.parse(localStorage.getItem('completeItems'));
    onHoldListArray = JSON.parse(localStorage.getItem('onHoldItems'));
    // backlogListArray = JSON.parse(localStorage.backlogItems);
    // progressListArray = JSON.parse(localStorage.progressItems);
    // completeListArray = JSON.parse(localStorage.completeItems);
    // onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    // Set Default Array Values
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
  const arrNames = ['backlogItems', 'progressItems', 'completeItems', 'onHoldItems'];
  arrNames.forEach((arrName, index) => {
    localStorage.setItem(arrName, JSON.stringify(listArrays[index]));
  });
  // localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  // localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  // localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  // localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
}



// Update Item - Delete if necessary, or Update Array values.;
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  // If dragging is false
  if (!dragging) {
    // If selected column element is empty, remove it
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    // Update DOM
    updateDOM();
  }
}

// filter arrays to remove empty items
function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  // make the item draggable
  listEl.setAttribute("draggable", true);
  // what should happen when the element is dragged.
  listEl.setAttribute("ondragstart", "drag(event)");
  // Make list item editable
  listEl.setAttribute("contenteditable", true);
  // Set Id of each list item
  listEl.id = index;
  // Set focusOut attribute on each list item
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  // Append to Column
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }

  // Backlog Column
  backlogList.textContent = '';
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);

  // Progress Column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  // Complete Column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold Column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Add to Column List, Reset TextBox.
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  // Add to Array
  if (itemText !== "") {
    selectedArray.push(itemText);
    // Reset TextBox
    addItems[column].textContent = '';
    // Update DOM
    updateDOM();
  }
}

// Show Add Item Input Box
const showInputBox = (column) => {
  // Hide Item btn
  addBtns[column].style.visibility = "hidden";
  // Show save item btn
  saveItemBtns[column].style.display = "flex";
  // Show Add Item Container
  addItemContainers[column].style.display = "flex";
};

// Hide Item Input Box
const hideInputBox = (column) => {
  // Show Item btn
  addBtns[column].style.visibility = "visible";
  // Hide save item btn
  saveItemBtns[column].style.display = "none";
  // Hide Add Item Container
  addItemContainers[column].style.display = "none";
  addToColumn(column);
};

// Allows arrays to reflect Drag and Drop changes
function rebuildArrays() {
  // Map func is better when you want to rebuild an array or add to an array
  // whereas forEach is better when you want to iterate over an array without changing it.
  // Anytime you see an empty array then a for loop it will be better to use map
  backlogListArray = Array.from(backlogList.children).map((item) => item.textContent);
  progressListArray = Array.from(progressList.children).map((item) => item.textContent);
  completeListArray = Array.from(completeList.children).map((item) => item.textContent);
  onHoldListArray = Array.from(onHoldList.children).map((item) => item.textContent);
  updateDOM();
  // backlogListArray = [];
  // for (let i = 0; i < backlogList.children.length; i++) {
  //   backlogListArray.push(backlogList.children[i].textContent);
  // }
  // progressListArray = [];
  // for (let i = 0; i < progressList.children.length; i++) {
  //   progressListArray.push(progressList.children[i].textContent);
  // }
  // completeListArray = [];
  // for (let i = 0; i < completeList.children.length; i++) {
  //   completeListArray.push(completeList.children[i].textContent);
  // }
  // onHoldListArray = [];
  // for (let i = 0; i < onHoldList.children.length; i++) {
  //   onHoldListArray.push(onHoldList.children[i].textContent);
  // }
}

// When Item Starts Dragging
const drag = (e) => {
  draggedItem = e.target;
  dragging = true;
};

// To allow a drop, we must prevent the default handling of the element.
// Column Allows for Item to Drop
const allowDrop = (e) => {
  e.preventDefault();
};

// When Item Enters Column Area
const dragEnter = (column) => {
  listColumns[column].classList.add("over");
  currentColumn = column;
};

// Dropping Item in Column
const drop = (e) => {
  e.preventDefault();
  // Remove bg color and padding
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  // Add Item to column
  const parentEl = listColumns[currentColumn];
  parentEl.appendChild(draggedItem);
  // Dragging Complete
  dragging = false;
  rebuildArrays();
};

// onload
updateDOM();