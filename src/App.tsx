/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import 'bulma/css/bulma.css';
import '@fortawesome/fontawesome-free/css/all.css';

import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { TodoModal } from './components/TodoModal';
import { Loader } from './components/Loader';
import { Todo } from './types/Todo';
import { getActiveTodos, getCompletedTodos, getTodos } from './api';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectTodo, setSelectTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState('all');
  const [textFilter, setTextFilter] = useState('');

  useEffect(() => {
    const loader =
      filter === 'all'
        ? getTodos
        : filter === 'completed'
          ? getCompletedTodos
          : getActiveTodos;

    loader()
      .then(todos =>
        todos.filter(todo =>
          textFilter
            ? todo.title.toLowerCase().includes(textFilter.toLowerCase())
            : todo,
        ),
      )
      .then(setTodos)
      .catch(() => {
        setTodos([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [filter, textFilter]);

  const handleSelectTodo = (todo: Todo) => {
    setSelectTodo(todo);
  };

  const handleCloseTodo = () => {
    setSelectTodo(null);
  };

  return (
    <>
      <div className="section">
        <div className="container">
          <div className="box">
            <h1 className="title">Todos:</h1>

            <div className="block">
              <TodoFilter
                onSelect={value => setFilter(value)}
                onQuery={query => setTextFilter(query)}
              />
            </div>

            <div className="block">
              {loading ? (
                <Loader />
              ) : (
                <TodoList todos={todos} onSelect={handleSelectTodo} />
              )}
            </div>
          </div>
        </div>
      </div>

      <TodoModal todo={selectTodo} onClose={handleCloseTodo} />
    </>
  );
};
