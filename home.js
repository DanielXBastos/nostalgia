$(document).ready(function() {
  // Theme toggle
  $('#theme-toggle').click(function() {
    $('body').toggleClass('dark');
    const icon = $('body').hasClass('dark') ? '🌙' : '☀️';
    $(this).text(icon);
  });

  // Add column
  $('#add-column').click(function() {
    const columnCount = $('.column').length + 1;
    const newColumn = `
      <div class="column">
        <div class="column-header">
          <h2>Post-It ${columnCount}</h2>
          <span class="delete-column">🗑️</span>
        </div>
        <div class="card" contenteditable="true">New Post-It<span class="delete-card">🗑️</span></div>
        <button class="add-card">Add Card</button>
      </div>
    `;
    $('.board').append(newColumn);
  });

  // Add card
  $('.board').on('click', '.add-card', function() {
    const newCard = '<div class="card" contenteditable="true">New Post-It<span class="delete-card">🗑️</span></div>';
    $(this).before(newCard);
  });

  // Delete card
  $('.board').on('click', '.delete-card', function(e) {
    e.stopPropagation();
    $(this).parent().remove();
    saveBoard();
  });

  // Delete column
  $('.board').on('click', '.delete-column', function(e) {
    e.stopPropagation();
    $(this).closest('.column').remove();
    saveBoard();
  });

  // Add todo
  $('#add-todo').click(function() {
    const newTodo = `
      <div class="todo">
        <div class="todo-header">
          <h2>To-Do List</h2>
          <span class="delete-todo">🗑️</span>
        </div>
        <div class="task"><input type="checkbox"><span contenteditable>Task 1</span><span class="delete-task">🗑️</span></div>
        <button class="add-task">Add Task</button>
      </div>
    `;
    $('.board').append(newTodo);
  });

  // Add task
  $('.board').on('click', '.add-task', function() {
    const newTask = '<div class="task"><input type="checkbox"><span contenteditable>New Task</span><span class="delete-task">🗑️</span></div>';
    $(this).before(newTask);
  });

  // Delete task
  $('.board').on('click', '.delete-task', function(e) {
    e.stopPropagation();
    $(this).parent().remove();
    saveTodo();
  });

  // Delete todo
  $('.board').on('click', '.delete-todo', function(e) {
    e.stopPropagation();
    $(this).closest('.todo').remove();
    localStorage.removeItem('nostalgia-todo');
  });

  // Save and load board state
  function saveBoard() {
    const boardData = [];
    $('.column').each(function() {
      const column = { title: $(this).find('h2').text(), cards: [] };
      $(this).find('.card').each(function() {
        const text = $(this).clone().find('.delete-card').remove().end().text();
        column.cards.push(text);
      });
      boardData.push(column);
    });
    localStorage.setItem('nostalgia-board', JSON.stringify(boardData));
  }

  function saveTodo() {
    const todoData = [];
    $('.task').each(function() {
      const text = $(this).find('span').text();
      const checked = $(this).find('input').is(':checked');
      todoData.push({ text, checked });
    });
    localStorage.setItem('nostalgia-todo', JSON.stringify(todoData));
  }

  function loadBoard() {
    const data = localStorage.getItem('nostalgia-board');
    if (data) {
      const boardData = JSON.parse(data);
      $('.board').empty();
      boardData.forEach(col => {
        let cardsHtml = '';
        col.cards.forEach(card => {
          cardsHtml += `<div class="card" contenteditable="true">${card}<span class="delete-card">🗑️</span></div>`;
        });
        const columnHtml = `
          <div class="column">
            <div class="column-header">
              <span class="delete-column">🗑️</span>
              <h2>${col.title}</h2>
            </div>
            ${cardsHtml}
            <button class="add-card">Add Card</button>
          </div>
        `;
        $('.board').append(columnHtml);
      });
    }
  }

  function loadTodo() {
    const data = localStorage.getItem('nostalgia-todo');
    if (data) {
      const todoData = JSON.parse(data);
      if (todoData.length > 0) {
        let tasksHtml = '';
        todoData.forEach(task => {
          const checked = task.checked ? 'checked' : '';
          tasksHtml += `<div class="task"><input type="checkbox" ${checked}><span contenteditable>${task.text}</span><span class="delete-task">🗑️</span></div>`;
        });
        const todoHtml = `
          <div class="todo">
            <div class="todo-header">
              <h2>To-Do List</h2>
              <span class="delete-todo">🗑️</span>
            </div>
            ${tasksHtml}
            <button class="add-task">Add Task</button>
          </div>
        `;
        $('.board').append(todoHtml);
      }
    }
  }

  // Load on start
  loadBoard();
  loadTodo();

  // Save on changes
  $('.board').on('blur', '.card', saveBoard);
  $('#add-column').click(saveBoard);
  $('.board').on('click', '.add-card', function() {
    setTimeout(saveBoard, 100);
  });

  $('.board').on('change', '.task input', saveTodo);
  $('.board').on('blur', '.task span', saveTodo);
  $('#add-todo').click(saveTodo);
  $('.board').on('click', '.add-task', function() {
    setTimeout(saveTodo, 100);
  });
});

