import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TodoService} from '../services/todo.service';
import {AlertService} from '../../auth/services/alert.service';
import {Todo} from '../model/todo';
import {Item} from '../model/item';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-show-todo',
  templateUrl: './show-todo.component.html',
  styleUrls: ['./show-todo.component.css']
})
export class ShowTodoComponent implements OnInit {

  itemForm: FormGroup;
  todo_id: string;
  items: Item[];
  todo: Todo;
  loading = false;
  submitted = false;
  item: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private todoService: TodoService,
    private alertService: AlertService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.todo_id = params['id'];
    });
    this.todoService.getTodo(this.todo_id).subscribe(data => {
      this.todo = data;
    }, error => {
      this.alertService.error(error);
    });
    this.getTodoItems();
    this.getItemForm();
  }

  get f() {
    return this.itemForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.itemForm.invalid) {
      return;
    }
    this.loading = true;
    this.item = {
      name: this.itemForm.value.name,
      done: false
    };
    this.todoService.createTodoItem(this.todo_id, this.item).subscribe(data => {
      this.alertService.success('yes, you did it', false);
      this.getTodoItems();
      this.itemForm.reset();
      this.loading = false;
    }, error => {
      this.alertService.error(error);
    });
  }

  private getTodoItems() {
    this.todoService.getTodoItems(this.todo_id).subscribe(data => {
      this.items = data;
    }, error => {
      this.alertService.error(error);
    });
  }

  private getItemForm() {
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

}
