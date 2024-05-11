const todos = [];
const list = document.getElementById('todo-list');
const itemCountSpan = document.getElementById('item-count');
const uncheckedCountSpan = document.getElementById('unchecked-count');

function newTodo() {
    const text = prompt("Enter new TODO:");
    if (text) {
        const todo = { id: Date.now(), text, completed: false };
        todos.push(todo);
        render();
        updateCounter();
    }
}

function renderTodo(todo) {
    const checked = todo.completed ? 'checked' : '';
    const textStyle = todo.completed ? 'text-decoration-line-through text-success' : '';
    return `
        <li class="list-group-item" id="${todo.id}">
            <input type="checkbox" class="form-check-input me-2" ${checked} onclick="checkTodo(${todo.id})" />
            <label class="${textStyle}">${todo.text}</label>
            <button class="btn btn-danger btn-sm float-end" onclick="deleteTodo(${todo.id})">delete</button>
        </li>
    `;
}

function render() {
    const todoItems = todos.map(renderTodo).join('');
    list.innerHTML = todoItems;
}

function updateCounter() {
    const totalCount = todos.length;
    const uncheckedCount = todos.filter(todo => !todo.completed).length;
    itemCountSpan.textContent = totalCount;
    uncheckedCountSpan.textContent = uncheckedCount;
}

function deleteTodo(id) {
    const index = todos.findIndex(todo => todo.id === id);
    if (index > -1) {
        todos.splice(index, 1);
        render();
        updateCounter();
    }
}

function checkTodo(id) {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        render();
        updateCounter();
    }
}

render();
updateCounter();

