"use client";
import React, { useEffect } from "react";
import axios, { AxiosResponse } from "axios";

interface TodoItem {
  id: string;
}

export default function Home(): JSX.Element {
  const [todoObj, setTodoObj] = React.useState<TodoItem[]>([]); // state for the todo object to send to backend!
  const [newTodo, setNewTodo] = React.useState<string>("");
  const [editItemId, setEditItemId] = React.useState<string | null>(null);

  const fetchTodos = async () => {
    try {
      const { data } = await axios.get("/api/fetchPrisma");
      setTodoObj(data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmitTodo = async (e: React.FormEvent) => {
    // function to handle todo submission
    e.preventDefault();
    try {
      const { data }: AxiosResponse<any> = await axios.post(`/api/todo`, {
        title: newTodo,
      });

      setTodoObj([...todoObj, data]);
      setNewTodo(""); // delete the current state after submission!
    } catch (err) {
      console.log("the handlesub error: ", err);
    }
  };

  const handleDelete = (itemid: string) => {
    const updatedObject = todoObj.filter((item) => item.id !== itemid); // simply delete item matching id
    setTodoObj(updatedObject);
  };

  const handleUpdate = (itemId: string, newTitle: string) => {
    const updatedTodos = todoObj.map((todo) =>
      todo.id === itemId ? { ...todo, title: newTitle } : todo
    );
    setTodoObj(updatedTodos);
    setEditItemId(null); // Reset edit mode after update
  };
  const toggleEditMode = (itemId: string) => {
    setEditItemId(itemId);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
          {/* Header of todo list */}
          <h1 className="text-2xl font-bold mb-4">To-Do List for sentiment!</h1>
          <form className="mb-4">
            <input
              type="text"
              placeholder="Add a new task"
              className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => {
                setNewTodo(e.target.value);
              }}
              value={newTodo}
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              onClick={handleSubmitTodo}
            >
              Add Task
            </button>
          </form>
          {/* list that will update for the to-do*/}
          {todoObj.map((todo: any) => {
            console.log(todo);
            return (
              <ul>
                <li
                  key={todo.id}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded mb-2"
                >
                  {editItemId === todo.id ? (
                    <input
                      type="text"
                      defaultValue={todo.title}
                      autoFocus
                      onBlur={(e) => handleUpdate(todo.id, e.target.value)}
                    />
                  ) : (
                    <span className="text-black">{todo.title}</span>
                  )}

                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => toggleEditMode(todo.id)}
                    className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600"
                  >
                    {todo.id == editItemId ? "Save" : "Update"}
                  </button>
                </li>
              </ul>
            );
          })}
          {/* end of list section */}
        </div>
      </div>
    </main>
  );
}
