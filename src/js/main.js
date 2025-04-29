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

