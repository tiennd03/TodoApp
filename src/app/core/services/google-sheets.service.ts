import { Injectable } from '@angular/core';
import { Todo } from '../../features/todos/models/todo.model';

@Injectable({ providedIn: 'root' })
export class GoogleSheetsService {
  private readonly URL = 'https://script.google.com/macros/s/AKfycbyzWyCoIGvuDNFJYm9R7U2itPaIMM4GE1Q8WC1jaQj3cUZnl4ep6b13cYq2Q9vpGiwOJQ/exec';

  private async send(params: Record<string, string>): Promise<void> {
    const query = new URLSearchParams(params).toString();
    await fetch(`${this.URL}?${query}`, { mode: 'no-cors' });
  }

  async add(todo: Todo): Promise<void> {
    await this.send({
      action: 'add',
      id: todo.id,
      title: todo.title,
      completed: String(todo.completed),
      createdAt: todo.createdAt.toISOString()
    });
  }

  async toggle(id: string, completed: boolean): Promise<void> {
    await this.send({ action: 'toggle', id, completed: String(completed) });
  }

  async delete(id: string): Promise<void> {
    await this.send({ action: 'delete', id });
  }

  async update(id: string, title: string): Promise<void> {
    await this.send({ action: 'update', id, title });
  }
}