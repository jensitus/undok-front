import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Todo} from '../model/todo';
import {ActivatedRoute} from '@angular/router';
import {TodoService} from '../services/todo.service';
import {AlertService} from '../../common/alert/services/alert.service';
import {CommonService} from '../../common/common.service';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css']
})
export class AddTodoComponent implements OnInit {

  todoForm: FormGroup;
  todo: Todo;
  loading = false;
  submitted = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private todoService: TodoService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.todoForm = this.formBuilder.group({
      title: ['', Validators.required]
    });
  }

  get f() {
    return this.todoForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.todoForm.invalid) {
      return;
    }
    this.loading = true;
    this.todoService.createTodo(this.todoForm.value).subscribe(data => {
      this.commonService.setNewTodoSubject(true);
      this.loading = false;
      this.todoForm.reset();
    }, error => {
      // this.alertService.error(error);
    });
  }

}
