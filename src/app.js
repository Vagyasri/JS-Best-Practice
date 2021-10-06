/* eslint-disable no-loop-func */
import './style.css';

const LIST_KEY = 'task.list';
let todoList = JSON.parse(localStorage.getItem(LIST_KEY)) || [];

const save = () => {
  localStorage.setItem(LIST_KEY, JSON.stringify(todoList));
};

const status = (checkbox, task) => {
  if (checkbox.checked) {
    task.completed = true;
  } else {
    task.completed = false;
  }
};

const container = document.querySelector('.list-container');
const newList = document.querySelector('.new-data');
const newBar = document.querySelector('.add-bar');
const refresh = document.querySelector('.fa-sync-alt');
const all = document.querySelector('.all');

const clear = (element) => {
  while (element.firstChild) element.removeChild(element.firstChild);
};

const render = () => {
  clear(container);
  todoList.forEach((todo) => {
    const div = document.createElement('div');
    const listElement = document.createElement('li');
    const input = document.createElement('input');
    const span = document.createElement('span');
    const icon = document.createElement('i');
    const dlt = document.createElement('i');
    const edit = document.createElement('input');

    input.type = 'checkbox';
    input.name = 'name';
    input.value = 'value';
    input.id = 'id';
    input.classList.add('cursor');
    input.classList.add('check');

    edit.type = 'text';
    edit.value = `${todo.description}`;
    edit.id = `${todo.index}`;
    edit.classList.add('grow');

    input.checked = todo.completed;
    input.addEventListener('change', () => {
      status(input, todo);
      save(todoList);
    });

    div.classList.add('listcont-prop');
    listElement.classList.add('list-prop');
    span.classList.add('grow');
    span.innerHTML = `${todo.description}`;

    icon.classList.add('fas');
    icon.classList.add('fa-ellipsis-v');
    icon.classList.add('show-more');
    dlt.classList.add('fas');
    dlt.classList.add('fa-trash-alt');
    dlt.setAttribute('data-index', todo.index);

    listElement.appendChild(input);
    listElement.appendChild(span);
    listElement.appendChild(icon);
    div.appendChild(listElement);
    container.appendChild(div);

    icon.addEventListener('click', () => {
      icon.replaceWith(dlt);
      span.replaceWith(edit);
    });
  });
};

refresh.addEventListener('click', () => {
  window.location.reload();
});

render();

const saveAndRender = () => {
  save();
  render();
};

const createList = (task) => (
  {
    index: todoList.length,
    description: task,
    completed: false,
  });

const removeLocal = (index) => {
  todoList = todoList.filter((task) => task.index !== index);
  save();
  window.location.reload();
};

const deleteList = (e) => {
  const deleteButton = e.target;
  if (deleteButton.classList[1] === 'fa-trash-alt') {
    const indexToDelete = Number(deleteButton.getAttribute('data-index'));
    removeLocal(indexToDelete);
  }
};

const deleteAllDone = () => {
  const completed = document.querySelectorAll('.check');
  completed.forEach((checkbox) => {
    if (checkbox.checked) {
      checkbox.parentElement.parentElement.remove();
    }
  });
  for (let i = 0; i < todoList.length; i += 1) {
    // eslint-disable-next-line array-callback-return
    todoList.filter((task) => {
      if (task.completed) {
        const index = todoList.indexOf(task);
        todoList.splice(index, 1);
        let i = 0;
        while (i < todoList.length) {
          if (todoList[i].id > task.id) {
            todoList[i].id -= 1;
          }
          i += 1;
        }
        save();
        window.location.reload();
      }
    });
  }
};

newList.addEventListener('submit', (e) => {
  e.preventDefault();
  const listName = newBar.value;
  if (listName == null || listName === '') return;
  const list = createList(listName);
  newBar.value = null;
  todoList.push(list);
  saveAndRender();
});

container.addEventListener('click', deleteList);

all.addEventListener('click', deleteAllDone);
