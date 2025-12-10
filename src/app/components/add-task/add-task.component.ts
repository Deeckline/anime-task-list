import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.css',
})
export class AddTaskComponent {
  animeCategories = ['Shonen', 'Seinen', 'Isekai', 'Romance', 'Slice of Life', 'Comedy'];

  form = new FormGroup({
    text: new FormControl('', Validators.required),
    category: new FormControl(this.animeCategories[0], Validators.required),
  });

  constructor(private todoService: TodoService) {}

  onSubmit() {
    if (this.form.valid) {
      const { text, category } = this.form.value;
      this.todoService.addTodo(text!, category!);
      this.form.reset({ text: '', category: this.animeCategories[0] });
    }
  }
}
