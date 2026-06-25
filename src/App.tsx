import { Construction } from "lucide-react";
import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";

type Priority = "Urgente" | "Moyenne" | "Basse";

type Todo = {
  id: number;
  text: string;
  priority: Priority;
};

function App() {
  const [input, setINPUT] = useState("");
  const [priority, setPRIORITY] = useState<Priority>("Moyenne");
  const savedTodos = localStorage.getItem("todos");
  const initialTodos = savedTodos ? JSON.parse(savedTodos) : [];
  const [todos, setTODOS] = useState<Todo[]>([initialTodos]);
  const [filter, setFILTER] = useState<Priority | "All">("All");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addTodo() {
    if (input.trim() == "") {
      return;
    }

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      priority: priority,
    };

    const newTodos = [newTodo, ...todos];
    setTODOS(newTodos);
    setINPUT("");
    setPRIORITY("Moyenne");
    console.log(newTodos);
  }

  let filteredtodos: Todo[] = [];
  if (filter === "All") {
    filteredtodos = todos;
  } else {
    filteredtodos = todos.filter((todo) => todo.priority === filter);
  }

  const urgentCount = todos.filter((t) => t.priority === "Urgente").length;
  const mediumCount = todos.filter((t) => t.priority === "Moyenne").length;
  const lowCount = todos.filter((t) => t.priority === "Basse").length;
  const totalCount = todos.length;

  function deleteTodo(id: number) {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTODOS(newTodos);
  }

  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set());
  function toggleSelectTodo(id: number) {
    const newSelected = new Set(selectedTodos);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedTodos(newSelected);
  }

  function finishSelected() {
    const newTodos = todos.filter((todo) => {
      if (selectedTodos.has(todo.id)) {
        return false;
      } else {
        return true;
      }
    });

    setTODOS(newTodos);
    setSelectedTodos(new Set());
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2x1">
        <div className="flex gap-4">
          <input
            type="text"
            className="input w-full"
            placeholder="Add Yours task"
            value={input}
            onChange={(e) => setINPUT(e.target.value)}
          />

          <select
            className="select w-full"
            value={priority}
            onChange={(e) => setPRIORITY(e.target.value as Priority)}
          >
            <option value="Urgente">Urgente</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>

          <button className="btn btn-primary" onClick={addTodo}>
            Add
          </button>
        </div>
        <div className="space-y-2 flex-1 h-fit">
          <div className="flex flex-wrap gap-4">
            <button
              className={`btn btn-soft ${
                filter === "All" ? "btn-primary" : ""
              }`}
              onClick={() => setFILTER("All")}
            >
              All {totalCount}
            </button>

            <button
              className={`btn btn-soft ${
                filter === "Urgente" ? "btn-primary" : ""
              }`}
              onClick={() => setFILTER("Urgente")}
            >
              Urgent {urgentCount}
            </button>

            <button
              className={`btn btn-soft ${
                filter === "Moyenne" ? "btn-primary" : ""
              }`}
              onClick={() => setFILTER("Moyenne")}
            >
              Medium {mediumCount}
            </button>

            <button
              className={`btn btn-soft ${
                filter === "Basse" ? "btn-primary" : ""
              }`}
              onClick={() => setFILTER("Basse")}
            >
              Low {lowCount}
            </button>
            <button
              onClick={finishSelected}
              className="btn btn-primary"
              disabled={selectedTodos.size == 0}
            >
              Finir la sélection ({selectedTodos.size})
            </button>
          </div>

          {filteredtodos.length > 0 ? (
            <ul className="divide-y divide-primary/20">
              {filteredtodos.map((todo) => (
                <li key={todo.id}>
                  <TodoItem
                    todo={todo}
                    isSelected={selectedTodos.has(todo.id)}
                    onDelete={() => deleteTodo(todo.id)}
                    onToggleSelect={toggleSelectTodo}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center flex-col p-5">
              <div>
                <Construction
                  strokeWidth={1}
                  className="w-40 h-40 text-primary"
                />
              </div>
              <p className="text-sm">Aucune tâche pour ce filtre</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
