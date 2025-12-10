import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const ANIME_TASKS_LOCAL_STORAGE = 'anime-tasks';

export interface Todo {
  id: number;
  text: string;
  done: boolean;
  category: string;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private platformId = inject(PLATFORM_ID);

  todos = signal<Todo[]>([
    { id: 1, text: 'Jujutsu Kaisen', done: false, category: 'Shonen' },
    { id: 2, text: 'Kubo-san', done: true, category: 'Romance' },
    { id: 3, text: 'Re:Zero', done: false, category: 'Isekai' },
    { id: 4, text: 'Berserk', done: true, category: 'Seinen' },
  ]);

  constructor() {
    this.loadFromStorage();
  }

  addTodo(text: string, category: string) {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      done: false,
      category,
    };
    this.todos.update((t) => [...t, newTodo]);
    this.saveToStorage();
  }

  toggleTodo(id: number) {
    this.todos.update((todos) =>
      todos.map((todo) => (todo.id === id ? { ...todo, done: !todo.done } : todo))
    );
    this.saveToStorage();
  }

  deleteTodo(id: number) {
    this.todos.update((todos) => todos.filter((todo) => todo.id !== id));
    this.saveToStorage();
  }

  private saveToStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(ANIME_TASKS_LOCAL_STORAGE, JSON.stringify(this.todos()));
    }
  }

  private loadFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(ANIME_TASKS_LOCAL_STORAGE);
      if (saved) {
        this.todos.set(JSON.parse(saved));
      }
    }
  }
}
