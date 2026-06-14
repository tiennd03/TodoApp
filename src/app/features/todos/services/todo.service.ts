import { Injectable, signal, computed, inject } from '@angular/core';
import { Todo } from '../models/todo.model';
import { GoogleSheetsService } from '../../../core/services/google-sheets.service';
@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly STORAGE_KEY = 'todos';
  private sheetsService = inject(GoogleSheetsService);
  private _todos = signal<Todo[]>(this.loadFromStorage());

  todos = this._todos.asReadonly();
  remaining = computed(() => this._todos().filter(t => !t.completed).length);

  async add(title: string): Promise<void> {
    const todo: Todo = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      createdAt: new Date()
    };
    this._todos.update(todos => [...todos, todo]);
    this.saveToStorage();
    await this.sheetsService.add(todo);
  }

  async toggle(id: string): Promise<void> {
    const todo = this._todos().find(t => t.id === id);
    if (!todo) return;
    this._todos.update(todos =>
      todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
    this.saveToStorage();
    await this.sheetsService.toggle(id, !todo.completed);
  }

  async delete(id: string): Promise<void> {
    this._todos.update(todos => todos.filter(t => t.id !== id));
    this.saveToStorage();
    await this.sheetsService.delete(id);
  }

  async update(id: string, title: string): Promise<void> {
    this._todos.update(todos =>
      todos.map(t => t.id === id ? { ...t, title } : t)
    );
    this.saveToStorage();
    await this.sheetsService.update(id, title);
  }

  private loadFromStorage(): Todo[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveToStorage(): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._todos()));
  }
}