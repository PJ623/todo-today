document.addEventListener("DOMContentLoaded", (event) => {
    let createTodoButton = document.getElementById("create-todo-button");

    createTodoButton.addEventListener("click", (event) => {
        let titleInput = document.getElementById("title-input");
        let descriptionInput = document.getElementById("description-input");

        let title = titleInput.value;
        let description = descriptionInput.value;

        todoManager.createTodo(title, description);

        titleInput.value = "";
        descriptionInput.value = "";

        todoManager.loadTodos(renderTodo);
    }, false);

    let deleteAllTodosButton = document.getElementById("delete-all-todos-button");

    deleteAllTodosButton.addEventListener("click", () => {
        while (document.getElementsByClassName("todo").length > 0) {
            document.getElementsByClassName("todo")[0].remove();
        }
        todoManager.deleteAllTodos();
    }, false);

    let resetAllTodosButton = document.getElementById("reset-all-todos-button");

    resetAllTodosButton.addEventListener("click", () => {
        todoManager.resetAllTodos();
        todoManager.loadTodos(renderTodo);
    }, false);

}, false);

let lastAccessDate = localStorage.getItem("last-access-date");
let currentDate;

if (!lastAccessDate) {
    console.log("No last-access-date.");
    localStorage.setItem("last-access-date", new Date().toDateString());
    lastAccessDate = localStorage.getItem("last-access-date");
    console.log("Set last-access-date.");
    console.log("Last access date:", localStorage.getItem("last-access-date"));
}

setInterval(() => {
    currentDate = new Date();

    if (lastAccessDate != currentDate.toDateString()) {

        console.log("A new day has dawned.");

        lastAccessDate = currentDate.toDateString();
        localStorage.setItem("last-access-date", currentDate.toDateString());
        console.log("Updated last-access-date.");

        todoManager.resetAllTodos();
        console.log("Reset todos.");
        todoManager.loadTodos(renderTodo);
        console.log("Todos reloaded.");
    }
}, 1000);

todoManager.loadTodos(renderTodo);