const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');
const firebaseUrl = `https://todoapp-ca5da-default-rtdb.firebaseio.com/todos.json`;
let todos = [];

function fetchTodos() {
    fetch(firebaseUrl)
        .then(response => response.json())
        .then(data => {
            todos = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
            render();
            updateCounters();
        })
        .catch(error => console.error('Error fetching todos:', error));
}

function addTodoToDB(todo) {
    return fetch(firebaseUrl, {
        method: 'POST',
        body: JSON.stringify(todo),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
}

function newTodo() {
    const task = prompt("Enter new TODO:");
    if (task) {
        const newTodo = { text: task, completed: false };
        addTodoToDB(newTodo).then(data => {
            newTodo.id = data.name;
            todos.push(newTodo);
            render();
            updateCounters();
        }).catch(error => console.error('Error adding todo:', error));
    }
}

function renderTodo(todo) {
    const checked = todo.completed ? 'checked' : '';
    const textStyle = todo.completed ? 'text-success text-decoration-line-through' : '';
    return `
        <li class="list-group-item">
            <input type="checkbox" class="form-check-input me-2" ${checked} onclick="checkTodo('${todo.id}')" />
            <span class="${textStyle}">${todo.text}</span>
            <button class="btn btn-danger btn-sm float-end" onclick="deleteTodo('${todo.id}')">delete</button>
        </li>
    `;
}

function render() {
    list.innerHTML = todos.map(renderTodo).join('');
}

function updateCounters() {
    const totalTodos = todos.length;
    const uncheckedTodos = todos.filter(todo => !todo.completed).length;
    itemCountSpan.textContent = totalTodos;
    uncheckedCountSpan.textContent = uncheckedTodos;
}

function deleteTodoFromDB(id) {
    return fetch(`https://todoapp-ca5da-default-rtdb.firebaseio.com/todos.json/${id}.json`, {
        method: 'DELETE'
    });
}

function deleteTodo(id) {
    deleteTodoFromDB(id).then(() => {
        todos = todos.filter(todo => todo.id !== id);
        render();
        updateCounters();
    }).catch(error => console.error('Error deleting todo:', error));
}

function updateTodoInDB(id, updatedTodo) {
    return fetch(`https://todoapp-ca5da-default-rtdb.firebaseio.com/todos.json/${id}.json`, {
        method: 'PATCH',
        body: JSON.stringify(updatedTodo),
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

function checkTodo(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        updateTodoInDB(id, { completed: todo.completed }).then(() => {
            render();
            updateCounters();
        }).catch(error => console.error('Error updating todo:', error));
    }
}

fetchTodos();
