export function initTodoList() {
  let todos = [];

  const input = document.getElementById("todoInput");
  const button = document.getElementById("addBtn");
  const list = document.getElementById("list");

  function render() {
    list.innerHTML = todos.map(t => `<li>${t}</li>`).join("");
  }

  button.addEventListener("click", () => {
    todos.push(input.value);
    input.value = "";
    render();
  });

  render();
}