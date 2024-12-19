const todoInput = document.getElementById("taskItem");
const todoListUL = document.getElementById("taskListUL");
const progressBar = document.getElementById("progress");
const progressNumber = document.getElementById("progress-number");

(async function initialize() {
    todos = await getTodos();
    console.log('Todos fetched:', todos);
    updateList();
})();

document.getElementById("newTask").addEventListener("click", function (e) {
    e.preventDefault();
    addListItem();
});

function addListItem() {
    const todoText = todoInput.value.trim();

    if (todoText.length > 0) {
        const todoObject = {
            text: todoText,
            completed: false
        }

        fetch('http://localhost:8080/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(todoObject)
        })
            .then(response => response.json())
            .then(() => {
                todos.push(todoObject);
                updateList();
            })
            .catch(error => console.error('Error adding Todo : ', error))
        todoInput.value = "";
    }
};

function updateList() {
    todoListUL.innerHTML = "";
    todos.forEach((todo, todoIndex) => {
        todoItem = createListItem(todo, todoIndex);
        todoListUL.append(todoItem);
    })

    updateProgressBar();
};

function createListItem(todo, todoIndex) {
    const todoID = "todo-" + todoIndex;
    const todoLi = document.createElement("li");

    todoLi.className = "todo";
    todoLi.innerHTML = `
        <input type="checkbox" id="${todoID}">
        <label class="custom-checkbox" for="${todoID}">
            <svg fill="transparent" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/>
            </svg>
        </label>
        <label for="${todoID}" class="todo-text">
            ${todo.text}
        </label>
        <button class="delete-button">
            <svg fill="var(--secondary-color)" xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24">
                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/>
            </svg>
        </button>   
    `;

    const deleteButton = todoLi.querySelector(".delete-button");
    deleteButton.addEventListener("click", () => {
        deleteTodo(todoIndex);
    });

    const checkbox = todoLi.querySelector("input");
    checkbox.addEventListener("change", () => {
        const todoId = todos[todoIndex].id;
        todos[todoIndex].completed = checkbox.checked;
        fetch(`http://localhost:8080/api/todos/${todoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                id: todoId,
                text: todos[todoIndex].text,
                completed: checkbox.checked })
        })
            .then(() => {
                updateProgressBar();
            })
            .catch(error => console.error('Error updating todo:', error));
    });
    checkbox.checked = todo.completed;

    return todoLi;
};

function deleteTodo(todoIndex) {
    const todoId = todos[todoIndex].id;
    fetch(`http://localhost:8080/api/todos/${todoId}`, {
        method: 'DELETE'
    })
        .then(() => {
            todos = todos.filter((_, i) => i !== todoIndex);
            updateList();
        })
        .catch(error => console.error('Error deleting todo:', error));
};

function updateProgressBar() {
    const totalTodos = todos.length;
    const completedTodos = todos.filter(todo => todo.completed).length;
    const percent = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

    progressBar.style.width = percent + "%";
    progressNumber.innerHTML = `${completedTodos}/${totalTodos}`;
}

function saveTodos() {
    const todosJSON = JSON.stringify(todos);
    localStorage.setItem("todos", todosJSON);
};

async function getTodos() {
    try {
        const response = await fetch('http://localhost:8080/api/todos');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
    
        return data.map(todo => ({
            id: todo.id,
            text: todo.text,
            completed: todo.completed
        }));
    } catch (error) {
        console.error('Error fetching todos:', error);
        return [];
    }
};
