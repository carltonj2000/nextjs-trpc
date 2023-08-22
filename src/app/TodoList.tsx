"use client";
import { useState } from "react";

import { trpc } from "./_trpc/client";

export default function TodoList() {
  const getTodos = trpc.getTodos.useQuery();
  const addTodo = trpc.addTodo.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });
  const setDone = trpc.setDone.useMutation({
    onSettled: () => {
      getTodos.refetch();
    },
  });

  const [content, setContent] = useState("");

  return (
    <div>
      <div className="flex gap-2">
        <label htmlFor="content">Content</label>
        <input
          id="conent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="text-black rounded px-1"
        />
        <button
          onClick={async () => {
            if (content.length) {
              addTodo.mutate(content);
              setContent("");
            }
          }}
          className="border px-1 rounded-full"
        >
          Add Todo
        </button>
      </div>
      <div>
        {getTodos?.data?.map((todo) => (
          <div key={todo.id} className="flex gap-3 items-center">
            <input
              type="checkbox"
              style={{ zoom: 1.5 }}
              id={`check=${todo.id}`}
              checked={!!todo.done}
              onClick={async () => {
                setDone.mutate({ id: todo.id, done: todo.done ? 0 : 1 });
              }}
            />
            <label htmlFor={`check-${todo.id}`}>{todo.content}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
