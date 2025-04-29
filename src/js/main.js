const todoTitleInput = document.getElementById('todoTitleInput');
const todoDescInput = document.getElementById('todoDescInput');
const addtodoBtn = document.getElementById('addtodoBtn');
const todoTodos = document.getElementById('todoTodos');
const incompleteTodos = document.getElementById('incompleteTodos');
const completedTodos = document.getElementById('completedTodos');
const themeToggle = document.getElementById('themeToggle');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function savetodos() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

function rendertodos() {
  todoTodos.innerHTML = '';
  incompleteTodos.innerHTML = '';
  completedTodos.innerHTML = '';

  const todosTodo = todos.filter(t => t.status === 'todo');
  const todosIncomplete = todos.filter(t => t.status === 'incomplete');
  const todosCompleted = todos.filter(t => t.status === 'completed');

  const addPlaceholder = (container) => {
    const msg = document.createElement('p');
    msg.textContent = 'Drop tasks here';
    msg.className = 'text-center text-gray-400 italic';
    msg.style.minHeight = '80px';
    container.appendChild(msg);
  };

  if (todosTodo.length === 0) addPlaceholder(todoTodos);
  if (todosIncomplete.length === 0) addPlaceholder(incompleteTodos);
  if (todosCompleted.length === 0) addPlaceholder(completedTodos);

  todos.forEach(todo => {
    const card = document.createElement('div');
    card.className = 'todo-card item';
    card.setAttribute('draggable', 'true');
    card.dataset.id = todo.id;

    const titleContainer = document.createElement('div');
    titleContainer.className = 'flex items-center justify-center gap-2 flex-wrap mb-2';

    const title = document.createElement('h3');
    title.textContent = todo.title;
    title.className = 'todo-title';
    titleContainer.appendChild(title);

    const descriptionWrapper = document.createElement('div');
    descriptionWrapper.className = 'overflow-hidden transition-all duration-500 ease-in-out max-h-20';
    descriptionWrapper.dataset.expanded = 'false';

    const description = document.createElement('p');
    description.textContent = todo.description;
    description.className = `todo-description whitespace-pre-wrap ${todo.status === 'completed' ? 'line-through text-gray-400' : ''}`;
    descriptionWrapper.appendChild(description);

    const isLong = todo.description.length > 100;
    const footer = document.createElement('div');
    footer.className = 'todo-footer flex justify-between items-center';

    const editBtn = document.createElement('button');
    editBtn.innerHTML = `
    <div class="flex items-center gap-1">
      <i class="fas fa-pencil-alt"></i>
      <i class="fas fa-file"></i>
    </div>
  `;  
    editBtn.className = 'see-toggle flex items-center gap-2';
    editBtn.onclick = () => editTodo(todo.id);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = `
    <div class="flex items-center gap-1">
    <i class="fa-solid fa-circle-xmark"></i>
    </div>
    `;
    deleteBtn.className = 'todo-delete-btn ml-3';
    deleteBtn.onclick = () => {
      if (confirm('Delete this todo?')) removetodo(todo.id);
    };

    footer.innerHTML = '';


    const left = document.createElement('div');
    left.appendChild(editBtn);

    const right = document.createElement('div');
    right.appendChild(deleteBtn);

    footer.appendChild(left);
    footer.appendChild(right);


    card.appendChild(titleContainer);
    card.appendChild(descriptionWrapper);
    if (isLong) {
      const toggleBtn = document.createElement('button');
      toggleBtn.textContent = 'See More';
      toggleBtn.className = 'see-toggle';

      toggleBtn.addEventListener('click', () => {
        const descriptionWrapper = card.querySelector('.todo-description');
        const expanded = descriptionWrapper.classList.contains('expanded');
        descriptionWrapper.classList.toggle('expanded', !expanded);
        toggleBtn.textContent = expanded ? 'See More' : 'See Less';
      });

      card.appendChild(toggleBtn);
    }
    card.appendChild(footer);


    card.addEventListener('dragstart', () => {
      setTimeout(() => card.classList.add('dragging'), 0);
    });
    card.addEventListener('dragend', () => {
      card.classList.remove('dragging');
      updateOrderAfterDrag();
    });

    if (todo.status === 'todo') {
      todoTodos.appendChild(card);
    } else if (todo.status === 'incomplete') {
      incompleteTodos.appendChild(card);
    } else {
      completedTodos.appendChild(card);
    }
  });
}

function updateOrderAfterDrag() {
  let todoOrder = [...todoTodos.querySelectorAll('.item')].map(el => Number(el.dataset.id));
  let incompleteOrder = [...incompleteTodos.querySelectorAll('.item')].map(el => Number(el.dataset.id));
  let completedOrder = [...completedTodos.querySelectorAll('.item')].map(el => Number(el.dataset.id));

  let newTodos = [];
  todoOrder.forEach(id => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.status = 'todo';
      newTodos.push(todo);
    }
  });
  incompleteOrder.forEach(id => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.status = 'incomplete';
      newTodos.push(todo);
    }
  });
  completedOrder.forEach(id => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.status = 'completed';
      newTodos.push(todo);
    }
  });

  todos = newTodos;
  savetodos();
}

function initSortableList(container) {
  container.addEventListener('dragover', (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    const siblings = [...container.querySelectorAll('.item:not(.dragging)')];
    let nextSibling = siblings.find(sibling => {
      return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });
    container.insertBefore(draggingItem, nextSibling);
  });
}

function enableDropZone(container, newStatus) {
  container.addEventListener('drop', (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector('.dragging');
    const draggedId = Number(draggingItem.dataset.id);
    const todo = todos.find(t => t.id === draggedId);

    if (todo && todo.status !== newStatus) {
      todo.status = newStatus;
      savetodos();
      rendertodos();
    } else {
      updateOrderAfterDrag();
    }
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
  });
}

function addtodo() {
  const title = todoTitleInput.value.trim();
  const description = todoDescInput.value.trim();

  if (!title || !description) {
    alert('Please fill both Title and Description.');
    return;
  }

  todos.push({
    id: Date.now(),
    title,
    description,
    status: 'todo',
  });

  savetodos();
  rendertodos();

  todoTitleInput.value = '';
  todoDescInput.value = '';
  descCounter.textContent = '0 / 400';
}

function removetodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  savetodos();
  rendertodos();
}

function editTodo(id) {
  const todo = todos.find(t => t.id === id);
  const newTitle = prompt('Edit title:', todo.title);
  const newDesc = prompt('Edit description:', todo.description);

  if (newTitle !== null && newDesc !== null) {
    todo.title = newTitle.trim();
    todo.description = newDesc.trim();
    savetodos();
    rendertodos();
  }
}

addtodoBtn.addEventListener('click', addtodo);

[todoTitleInput, todoDescInput].forEach(input => {
  input.addEventListener('keypress', e => {
    if (e.key === 'Enter') addtodo();
  });
});

themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', document.documentElement.classList.contains('dark') ? 'dark' : 'light');
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
}

const descCounter = document.getElementById('descCounter');
todoDescInput.addEventListener('input', () => {
  descCounter.textContent = `${todoDescInput.value.length} / 400`;
});

rendertodos();
enableDropZone(todoTodos, 'todo');
enableDropZone(incompleteTodos, 'incomplete');
enableDropZone(completedTodos, 'completed');
initSortableList(todoTodos);
initSortableList(incompleteTodos);
initSortableList(completedTodos);
