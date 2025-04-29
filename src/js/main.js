const todoTitleInput = document.getElementById('todoTitleInput');
const todoDescInput = document.getElementById('todoDescInput');
const addtodoBtn = document.getElementById('addtodoBtn');
const todoList = document.getElementById('todoList');
const themeToggle = document.getElementById('themeToggle');

let todos = JSON.parse(localStorage.getItem('todos')) || [];

function savetodos() {
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem('todos', JSON.stringify(todos));
      resolve();
    }, 200);
  });
}

async function rendertodos() {
  todoList.innerHTML = '';

  todos.forEach((todo, index) => {
    const card = document.createElement('div');
    card.className = 'todo-card';

    const titleContainer = document.createElement('div');
    titleContainer.className = 'flex items-center justify-center gap-2 flex-wrap mb-2';

    const title = document.createElement('h3');
    title.textContent = todo.title;
    title.className = 'todo-title';

    const completedLabel = document.createElement('span');
    completedLabel.textContent = '✓ Completed';
    completedLabel.className = 'todo-completed-label';
    completedLabel.style.display = todo.completed ? 'inline' : 'none';

    titleContainer.appendChild(title);
    titleContainer.appendChild(completedLabel);

    const description = document.createElement('p');
    description.textContent = todo.description;
    description.className = `todo-description ${todo.completed ? 'line-through text-gray-400' : ''}`;

    const footer = document.createElement('div');
    footer.className = 'todo-footer';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.className = 'todo-checkbox';
    checkbox.onchange = () => {
      toggleComplete(index);
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = ` 
      <svg xmlns="http://www.w3.org/2000/svg" fill="none"
           viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
           class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round"
              d="M6 18L18 6M6 6l12 12" />
      </svg>
    `;
    deleteBtn.className = 'todo-delete-btn ml-3';
    deleteBtn.onclick = () => {
      if (confirm('Do you want to delete this todo?')) {
        removetodo(index);
      }
    };

    const seeToggle = document.createElement('button');
    seeToggle.className = 'see-toggle ml-auto';
    let isExpanded = false;

    if (todo.description.length > 150) {
      seeToggle.textContent = 'See more';
      seeToggle.onclick = () => {
        isExpanded = !isExpanded;
        description.classList.toggle('expanded', isExpanded);
        seeToggle.textContent = isExpanded ? 'See less' : 'See more';
      };
    } else {
      seeToggle.style.display = 'none';
    }

    footer.appendChild(checkbox);
    footer.appendChild(deleteBtn);
    footer.appendChild(seeToggle);

    card.appendChild(titleContainer);
    card.appendChild(description);
    card.appendChild(footer);

    todoList.appendChild(card);
  });
}

async function addtodo() {
  const title = todoTitleInput.value.trim();
  const description = todoDescInput.value.trim();

  if (title === '' || description === '') {
    alert('Please enter both todo title and description!');
    return;
  }

  if (description.length > 400) {
    alert('Description cannot be more than 400 characters.');
    return;
  }

  todos.push({ title, description, completed: false });
  await savetodos(); 
  await rendertodos();

  todoTitleInput.value = '';
  todoDescInput.value = '';
  descCounter.textContent = '0 / 400';
}

async function removetodo(index) {
  todos.splice(index, 1);
  await savetodos();
  await rendertodos();
}

function toggleComplete(index) {
  todos[index].completed = !todos[index].completed;
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
