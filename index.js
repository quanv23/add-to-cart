import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

// Imports and variables for setting up Google Firebase 
const appSettings = {
    projectId: "playground-f231b",
    datebaseURL: "https://playground-f231b-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, 'shoppingList');

// Setting elements as constants 
const inputFieldEl = document.getElementById('input-field');
const addButtonEl = document.getElementById('add-button');
const shoppingListEl = document.getElementById('shopping-list');

// Event listener for when 'add to cart' is pressed
addButtonEl.addEventListener("click", () => {
    let inputValue = inputFieldEl.value; // pulling the value from the element 

    if (inputValue !== '') {
        push(shoppingListInDB, inputValue); // pushes inputValue at ref itemsInDB inside database
    }
    
    clearInputFieldEl();
})

// reads snapshot of database when changes are made and applies updates 
onValue(shoppingListInDB, function(snapshot) {

    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val());

        clearShoppingListEl();
    
        // Adds the new elements into the list
        itemsArray.forEach((currentItem) => {
            appendItemToShoppingListEl(currentItem);
        })
    } else {
        shoppingListEl.innerHTML = 'No items here... yet!';
    }

})

// clears shoppingListEl 
function clearShoppingListEl() {
    shoppingListEl.innerHTML = '';
}

// clears input value
function clearInputFieldEl() {
    inputFieldEl.value = null; 
}

// adding item into shopping list 
function appendItemToShoppingListEl(item) {
    // Declaring item variables since itemValue is 2D array
    let itemID = item[0];
    let itemValue = item[1];

    // Creating list item and appending it to HTML
    let newEl = document.createElement('li');

    newEl.textContent = itemValue;
    newEl.addEventListener('click', () => {

        // Gets location of item using directories and removes it 
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB);
    })

    shoppingListEl.append(newEl);
}