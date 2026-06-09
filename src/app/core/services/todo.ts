import { Injectable, signal , computed } from '@angular/core';
import { Todo } from '../models/todo';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly STORAGE_KEY = 'todos';
  private _todos = signal<Todo[]>(this.loadFromStorage());

  todos = this._todos.asReadonly();
  remaining = computed(() => this._todos().filter(t => !t.completed).length)

  add(title:string): void{
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      createdAt: new Date()
    };
    this._todos.update(todos => [...todos,todo]);
    this.saveToStorage();
  }

  toggle(id:string): void{
    this._todos.update(todos => todos.map(t => t.id === id ?{...t,completed: !t.completed} : t));
    this.saveToStorage();
  }

  delete(id:string): void{
    this._todos.update(todos => todos.filter(t => t.id !== id));
    this.saveToStorage();
  }

  update(id: string, title: string): void {
    this._todos.update(todos => todos.map(t => t.id === id ? { ...t, title } : t))
    this.saveToStorage();
  }

  private loadFromStorage():Todo []{
    const data = localStorage.getItem(this.STORAGE_KEY);
    return(data ? JSON.parse(data): []);
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY,JSON.stringify(this._todos()));
  }
}
