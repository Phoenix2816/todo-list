  const form = document.getElementById("todoForm");
  const input = document.getElementById("todoInput");
  const list = document.getElementById("todoList");
  const themeToggle = document.getElementById("themeToggle");

  const sunIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4" y1="12" x2="2" y2="12"/>
      <line x1="22" y1="12" x2="20" y2="12"/>
    </svg>
  `;

  const moonIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
      <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>
    </svg>
  `;

  const checkIcon = completed => `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
      ${completed
        ? '<polyline points="20 6 9 17 4 12"/>'
        : '<rect x="4" y="4" width="16" height="16" rx="3"/>'}
    </svg>
  `;

  const editIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
      <path d="M12 20h9"/>
      <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>
    </svg>
  `;

  const deleteIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke-width="2">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    </svg>
  `;

  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let theme = localStorage.getItem("theme") || "light";

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  function renderTodos() {
    list.innerHTML = "";

    todos.forEach((todo, index) => {
      const li = document.createElement("li");
      if (todo.completed) li.classList.add("completed");

      const row = document.createElement("div");
      row.className = "row";

      const text = document.createElement("span");
      text.textContent = todo.text;

      const actions = document.createElement("div");
      actions.className = "actions";

      const toggleBtn = document.createElement("button");
      toggleBtn.className = "icon-btn";
      toggleBtn.innerHTML = checkIcon(todo.completed);
      toggleBtn.onclick = () => {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodos();
      };

      const editBtn = document.createElement("button");
      editBtn.className = "icon-btn";
      editBtn.innerHTML = editIcon;
      editBtn.onclick = () => {
        const newText = prompt("Update task:", todo.text);
        if (newText && newText.trim()) {
          todo.text = newText.trim();
          saveTodos();
          renderTodos();
        }
      };

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "icon-btn delete";
      deleteBtn.innerHTML = deleteIcon;
      deleteBtn.onclick = () => {
        todos.splice(index, 1);
        saveTodos();
        renderTodos();
      };

      actions.append(toggleBtn, editBtn, deleteBtn);
      row.append(text, actions);
      li.append(row);
      list.append(li);
    });
  }

  function applyTheme() {
    document.body.classList.toggle("dark", theme === "dark");
    themeToggle.innerHTML = theme === "dark" ? sunIcon : moonIcon;
    localStorage.setItem("theme", theme);
  }

  themeToggle.onclick = () => {
    theme = theme === "light" ? "dark" : "light";
    applyTheme();
  };

  form.onsubmit = e => {
    e.preventDefault();
    todos.push({ text: input.value.trim(), completed: false });
    input.value = "";
    saveTodos();
    renderTodos();
  };

  applyTheme();
  renderTodos();