import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css',
})
export class TaskListComponent {
  // === ESTADO PRINCIPAL ===
  filter = signal<'all' | 'pending' | 'done'>('all');
  searchTerm = signal<string>('');

  constructor(public todoService: TodoService) {}

  // === MÉTODOS AUXILIARES ===
  private normalize(s: string) {
    return (s ?? '').toLowerCase().trim();
  }
  search = signal('');

  // === CONTADORES ===
  totalCount = computed(() => this.todoService.todos().length);

  pendingCount = computed(() => this.todoService.todos().filter((t) => !t.done).length);

  doneCount = computed(() => this.todoService.todos().filter((t) => t.done).length);

  // === PROGRESO ===
  progressPercent = computed(() => {
    const total = this.totalCount();
    return total ? Math.round((this.doneCount() / total) * 100) : 0;
  });

  // === FILTRO PRINCIPAL (estado + búsqueda) ===
  filteredTodos = computed(() => {
    const list = this.todoService.todos();
    const f = this.filter();
    const term = this.normalize(this.searchTerm());

    let result = list;
    if (f === 'done') result = result.filter((t) => t.done);
    if (f === 'pending') result = result.filter((t) => !t.done);

    if (term) {
      result = result.filter(
        (t) => this.normalize(t.text).includes(term) || this.normalize(t.category).includes(term)
      );
    }

    return result;
  });

  // === EVENTOS ===
  clearSearch() {
    this.searchTerm.set('');
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  toggleDone(id: number) {
    this.todoService.toggleTodo(id);
  }

  delete(id: number) {
    this.todoService.deleteTodo(id);
  }

  // === UTILIDADES ===
  getCategoryClass(category: string) {
    return category.toLowerCase().replace(/ /g, '-');
  }

  trackById(_i: number, t: { id: number }) {
    return t.id;
  }
}
