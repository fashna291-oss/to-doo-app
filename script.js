
const { createClient } = supabase;

const supabaseURL = 'https://xwbitrmhxhqiczyplzfk.supabase.co';

const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3Yml0cm1oeGhxaWN6eXBsemZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExNzM1MTIsImV4cCI6MjEwNjc0OTUxMn0.mxsYxznrdK2J7Nf1M49pSiOlD1bmCEVLI0GghQlKz8o';

const supabaseclient = createClient(supabaseURL, supabaseKey);

// Todo data
let todos = [];

// HTML elements
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");


// =========================
// ADD TODO
// =========================

addBtn.addEventListener("click", async function () {

    const task = taskInput.value.trim();

    if (task === "") {
        alert("Please enter a task");
        return;
    }

    const newTodo = {
        text: task,
        iscompleted: false
    };

    const { data, error } = await supabaseclient
        .from("todo")
        .insert([newTodo])
        .select();

    if (error) {
        console.log("Add error:", error);
        alert("Task add nahi hua!");
        return;
    }

    console.log("Task added:", data);

    taskInput.value = "";

    await gettodo();
});


// =========================
// GET TODOS
// =========================

async function gettodo() {

    const { data, error } = await supabaseclient
        .from("todo")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.log("Fetch error:", error);
        return;
    }

    todos = data || [];

    console.log("Todos:", todos);

    renderTodos();
}


// =========================
// SHOW TODOS
// =========================

function renderTodos() {

    todoList.innerHTML = "";

    todos.forEach(function (todo) {

        const todoDiv = document.createElement("div");
        todoDiv.className = "todo";

        // Task text
        const taskText = document.createElement("span");
        taskText.className = "todo-text";
        taskText.textContent = todo.text;

        // Buttons container
        const actions = document.createElement("div");
        actions.className = "actions";

        // Edit button
        const editBtn = document.createElement("button");
        editBtn.className = "edit-btn";
        editBtn.textContent = "Edit";

        editBtn.addEventListener("click", function () {
            editTodo(todo.id);
        });

        // Delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "Delete";

        deleteBtn.addEventListener("click", function () {
            deleteTodo(todo.id);
        });

        // Append buttons
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        // Append task and buttons
        todoDiv.appendChild(taskText);
        todoDiv.appendChild(actions);

        todoList.appendChild(todoDiv);
    });
}


// =========================
// DELETE TODO
// =========================

async function deleteTodo(id) {

    const confirmDelete = confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) {
        return;
    }

    const { error } = await supabaseclient
        .from("todo")
        .delete()
        .eq("id", id);

    if (error) {
        console.log("Delete error:", error);
        alert("Task delete nahi hua!");
        return;
    }

    todos = todos.filter(function (todo) {
        return todo.id !== id;
    });

    renderTodos();

    console.log("Task deleted successfully");
}


// =========================
// EDIT TODO
// =========================

async function editTodo(id) {

    const todo = todos.find(function (item) {
        return item.id === id;
    });

    if (!todo) {
        console.log("Todo not found");
        return;
    }

    const newTask = prompt("Edit your task:", todo.text);

    if (newTask === null) {
        return;
    }

    if (newTask.trim() === "") {
        alert("Task cannot be empty!");
        return;
    }

    const updatedTask = newTask.trim();

    const { error } = await supabaseclient
        .from("todo")
        .update({
            text: updatedTask
        })
        .eq("id", id);

    if (error) {
        console.log("Edit error:", error);
        alert("Task update nahi hua!");
        return;
    }

    todo.text = updatedTask;

    renderTodos();

    console.log("Task updated successfully");
}


// =========================
// LOAD TODOS ON PAGE START
// =========================

gettodo();

