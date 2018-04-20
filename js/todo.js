function Todo(title, description) {
    this.title = title;
    this.description = description;
    this.complete = false;

    // Maybe not needed:
    this.update = (property, value) => {
        this[property] = value;
    };
}

// An index of non-to-do items to be stored in local storage.
let reservedItems = {
    "last-access-date": /*new Date().getDate(),*/ true,
    "getLength": () => {
        let length = 0;
        for (item in reservedItems) {
            if (reservedItems.hasOwnProperty(item) && item != "getLength") {
                length++;
            }
        }
        return length;
    }
}

let todoManager = {
    createTodo: (title, description) => {
        localStorage.setItem(title, JSON.stringify(new Todo(title, description)));
    },

    deleteTodo: (title) => {
        localStorage.removeItem(title);
    },
    // Write todo upkeep. set Todo.complete: false
    dismissTodo: (title) => {
        let todo = JSON.parse(localStorage.getItem(title));
        todo.complete = true;
        localStorage.setItem(title, JSON.stringify(todo));
    },

    loadedTodos: {},

    // Takes callback function to process each todo's data.
    // Callback: (todo) => {} 
    // Let the callback filter the todos
    loadTodos: (cb) => {
        if (localStorage && localStorage.length > reservedItems.getLength() && typeof cb == "function") {
            for (let item in localStorage) {
                if (localStorage.getItem(item) && !reservedItems[item]) {
                    let todo = JSON.parse(localStorage.getItem(item));

                    if (!todoManager.loadedTodos[todo.title]) {
                        cb(todo);
                        todoManager.loadedTodos[todo.title] = todo;
                    }
                }
            }
        } else if (localStorage.length <= reservedItems.getLength()) {
            alert("Local Storage is empty.");
        } else if (typeof cb != "function") {
            alert("Callback is not a function.");
        } else {
            alert("Local Storage does not exist!");
        }
    },

    // JANK AF
    resetAllTodos: () => {
        if (localStorage && localStorage.length > reservedItems.getLength()) {
            for (let item in localStorage) {
                if (localStorage.getItem(item) && !reservedItems[item]) {
                    let todo = JSON.parse(localStorage.getItem(item));

                    if (todoManager.loadedTodos[todo.title]) {
                        if (todo.complete == true) {
                            delete todoManager.loadedTodos[todo.title];
                        }
                    }

                    todo.complete = false;
                    localStorage.setItem(todo.title, JSON.stringify(todo));
                }
            }
        } else if (localStorage.length <= reservedItems.getLength()) {
            alert("Local Storage is empty.");
        } else if (typeof cb != "function") {
            alert("Callback is not a function.");
        } else {
            alert("Local Storage does not exist!");
        }
    },

    // TODO: Revamp to avoid deleting reserved items.
    deleteAllTodos: () => {
        if (localStorage && localStorage.length > reservedItems.getLength()) {
            for (let item in localStorage) {
                if (localStorage.getItem(item) && !reservedItems[item]) {
                    localStorage.removeItem(item);
                }
            }
        } else if (localStorage.length <= reservedItems.getLength()) {
            alert("Local Storage is empty.");
        } else if (typeof cb != "function") {
            alert("Callback is not a function.");
        } else {
            alert("Local Storage does not exist!");
        }
    }
}

function renderTodo(todo) {

    if (todo.complete == false) {

        let todoContainer = document.getElementById("todo-container");

        let todoElement = document.createElement("LI");
        todoElement.className = "todo";
        todoElement.id = "todo-" + todo.title;

        let title = document.createElement("H1");
        title.innerText = todo.title;

        let description = document.createElement("P");
        description.innerText = todo.description;

        let deleteTodoButton = document.createElement("BUTTON");
        deleteTodoButton.innerText = "X";

        let dismissTodoButton = document.createElement("BUTTON");
        dismissTodoButton.innerText = "-";

        deleteTodoButton.addEventListener("click", () => {
            todoManager.deleteTodo(todo.title);
            document.getElementById(todoElement.id).remove();
        }, false);

        dismissTodoButton.addEventListener("click", () => {
            todoManager.dismissTodo(todo.title);
            document.getElementById(todoElement.id).remove();
        }, false);

        todoElement.appendChild(title);
        todoElement.appendChild(description);
        todoElement.appendChild(deleteTodoButton);
        todoElement.appendChild(dismissTodoButton);
        todoContainer.appendChild(todoElement);
    }
}