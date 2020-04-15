const input = document.querySelector('.input');
const listElement = document.querySelector('.todoList');
const templateTask = document.querySelector('.template');
const menu = document.querySelector('.menu');
const clearCompleted = document.querySelector('.clearall');

let todoList = [];

const updateItemsLeft = () => {
  let tasks = document.querySelectorAll('.todoList>li');
  tasks = Array.prototype.slice.call(tasks);
  const tasksLeft = document.querySelector('.tasksLeft');
  const tasksLeftCount = tasks.reduce((counter, task) =>{
    const checkbox = task.querySelector('.selected');
    if(!checkbox.checked && !task.classList.contains('template')){
      return counter+1;
    }
    return counter;
  },0);
  
  tasksLeft.textContent = tasksLeftCount + " items left";
};

const createTask = async (task) => {
  const clone = templateTask.cloneNode(true);
  const text = clone.querySelector('.text');
  const button = clone.querySelector('.button');
  const selectedTask = clone.querySelector('.selected');
  const input = clone.querySelector('.editing');
  const taskTodo = clone.querySelector('.task');
  
  clone.classList.remove('template');
  listElement.appendChild(clone);
  
  text.textContent = task.title;
  if(!task.id){
    task.id = await api.create(task.title);
  }
  task.completed = task.status;

  if(task.completed === true){
    text.classList.toggle('lineThrough');
    selectedTask.checked = true;
    clearCompleted.classList.remove('hidden');
  }

  updateItemsLeft();
  menu.classList.remove('hidden');

  button.onclick = (e) => {
    todoList = todoList.filter((item) => item.title !== text.textContent);
    api.delete(task.id);
    listElement.removeChild(clone);
    updateItemsLeft();
  };
  
  selectedTask.onclick = (e) => {
    text.classList.toggle('lineThrough');
    task.completed = !task.completed;
    api.edit(task.id, {status: task.completed});
    updateItemsLeft();
    
    if(task.completed){
      clearCompleted.classList.remove('hidden');
    } else {
      const foundCompleted = todoList.find(task => task.completed);
      if(!foundCompleted){
        clearCompleted.classList.add('hidden');
      }
    }
  };

  clone.ondblclick = () => {
    input.value = task.title;
    taskTodo.classList.add('hidden');
    input.classList.remove('hidden');
  };

  const inputEdit = () => {
    taskTodo.classList.remove('hidden');
    input.classList.add('hidden');
    task.title = input.value;
    text.textContent = task.title;
    api.edit(task.id, {title: task.title});
  };

  input.onchange = inputEdit;
  input.onblur = inputEdit;
  input.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
      inputEdit();
    }
  });

  clone.onmouseover = () => {
    button.classList.remove('hidden');
  };

  clone.onmouseout = () => {
    button.classList.add('hidden');
  };
};

const select = document.querySelector('.select');
select.onclick = () => {
  let deselectAll = true;
  const uncompleted = todoList.find((task) => !task.completed);
  if(uncompleted){
    deselectAll = false;
    select.style.color = "#737373";
  } else {
    select.style.color = "#e6e6e6";
  }
  const lists = document.querySelectorAll('.todoList>li');
  lists.forEach((li) => {
    const text = li.querySelector('.text');
    if(!li.classList.contains('template') && (deselectAll || !text.classList.contains('lineThrough'))){
      li.querySelector('.selected').click();
    } 
  })
  
};

window.onhashchange = () => {
  
  const lists = document.querySelectorAll('.todoList>li');
  
  switch(location.hash) {
    case '#completed':
      lists.forEach((li) => {
        const p = li.querySelector('p');
        if (!p.classList.contains('lineThrough')) {
          li.classList.add('hidden');
        } else {
          li.classList.remove('hidden');
        }
      });
      break;
    case '#active':
      lists.forEach((li) => {
        const p = li.querySelector('p');
        if (p.classList.contains('lineThrough')) {
          li.classList.add('hidden');
        } else {
          li.classList.remove('hidden');
        }
      });
      break;
    default:
      lists.forEach((li) => {
        li.classList.remove('hidden');
    })
  } 
};
      
input.onchange = (e) => {
  let task = {
    title: input.value,
    completed: false
  };
  todoList.push(task);
  createTask(task);
  input.value = '';
};

const clearButton = document.querySelector('footer>.clearall');
clearButton.onclick = () => {
  const lists = document.querySelectorAll('.todoList>li');
  lists.forEach((li) => {
    const p = li.querySelector('.text');
    const clearCompleted = document.querySelector('.clearall');
    if(p.classList.contains('lineThrough') && !li.classList.contains('template')){
      li.querySelector('.button').click();
      clearCompleted.classList.add('hidden');
    }
  })
};

const api = {};
api.getAll = async () => {
  const response = await fetch('/api/task');
  return await response.json();
};

api.create = async (title) => {
  const formatData = new URLSearchParams();
  formatData.append('title', title);
  const result = await fetch('/api/task', {
    method: 'POST',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: formatData.toString()
  });
  return result.id;
};

api.delete = async (id) => {
  await fetch(`/api/task/${id}`, {
    method: 'DELETE'
  })
};

api.deleteAll = async () => {
  await api.delete('all');
};

api.edit = async (id, params) => {
  const formatData = new URLSearchParams();
  for(const property in params){
    formatData.append(property, params[property]);
  }
  await fetch(`/api/task/${id}`, {
    method: 'PUT',
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    body: formatData.toString()
  })
};

api.changeStatusAll = async(status) => {
  await api.edit('all', {status});
};

//main
api.getAll().then(data => {
  todoList = data;
  todoList.forEach(createTask);
  updateItemsLeft();
});




