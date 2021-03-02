

function getAllTodos() {
    // get data from api
    axios.get('/api/todos')
        .then(response => {
            const todosContainer = document.querySelector('#todosContainer');
            const todosHTML = response.data.map((todo) => {
                return `<li class="${todo.completed ? 'complete' : 'incomplete'} list-group-item ml-1">
                ${todo.description}
                <button onClick="deleteTodo(${todo.id})" class="ml-2 btn-primary">💩</button>
                <button onClick="patchTodo(${todo.id}, event)" class="ml-2 btn-primary">🤔</button
                ><button onClick="setComplete('${todo.id}',  '${!todo.completed}')" class="ml-2 btn-primary">
                ${todo.completed ? '❌' : '✅'}
                </button></li>`
            }).join('')
            todosContainer.innerHTML = todosHTML
        })
    // use data to render todos on page
}

function setComplete(id, status) {
    axios.patch(`api/todos/${id}`, {
        completed: status
    }).then(() => {
        getAllTodos();
    })
}

function addNewTodo(description) {
    return axios.post('/api/todos', {
        description: description
    })
}

function deleteTodo(id) {
    axios.delete(`/api/todos/${id}`)
        .then(() => {
            getAllTodos();
        })
}

function patchTodo(id, e) {
    const patchButton = e.currentTarget;
    const patchForm = document.createElement('form');
    patchForm.innerHTML = 
    `<label for="newDescription">New To-Do</label><br>
    <input type="text" id="newDescription">
    <button type="submit">Change</button>`;
    // patchButton.append(patchForm)
    patchButton.parentElement.append(patchForm)

    patchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const description = e.target.elements.newDescription.value;
        axios.patch(`api/todos/${id}`, {
            description: description
        }).then(() => {
            getAllTodos();
        })
    })
}



// function patchTodo(id) {
//     const description = prompt('Please enter the new value here');
//     axios.patch(`api/todos/${id}`, {
//         description: description    
//     }).then(() => {
//         getAllTodos();
//     })
// }


getAllTodos();

const todosForm = document.querySelector('#todosForm');
todosForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const description = todosForm.elements.description.value;
    addNewTodo(description)
        .then(() => {
            todosForm.elements.description.value = '';
            getAllTodos();
        })
})