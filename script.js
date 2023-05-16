import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://daily-dont-forget-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const taskListInDB = ref(database, "taskList");

const inputFieldEl = document.querySelector("#task-input");
const addButtonEl = document.querySelector("#task-btn");
const taskListEl = document.querySelector("#task-list");

addButtonEl.addEventListener("click", function () {
  let inputValue = inputFieldEl.value;
  if (inputValue === "") {
    taskListEl.innerHTML = "Please enter a task.";
  } else {
    push(taskListInDB, inputValue);
    clearInputFieldEl();
  }
});

onValue(taskListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearTaskListEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let currentItemID = currentItem[0];
      let currentItemValue = currentItem[1];
      appendItemToTaskListEl(currentItem);
    }
  } else {
    taskListEl.innerHTML = "No tasks here... yet.";
  }
});

function clearTaskListEl() {
  taskListEl.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemToTaskListEl(item) {
  let itemID = item[0];
  let itemValue = item[1];
  let newEl = document.createElement("li");
  newEl.textContent = itemValue;
  taskListEl.append(newEl);
  // event listener to remove item from database
  newEl.addEventListener("click", function () {
    let exactLocationOfItemInDB = ref(database, `taskList/${itemID}`);
    remove(exactLocationOfItemInDB);
  });
}
