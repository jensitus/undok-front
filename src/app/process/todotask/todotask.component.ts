import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Item} from '../../todo-item/model/item';
import {User} from '../../auth/model/user';
import {Description} from '../../todo-item/model/description';
import {TaskService} from '../../common/services/task.service';
import {ActivatedRoute} from '@angular/router';
import {TodoService} from '../../todo-item/services/todo.service';
import {AlertService} from '../../common/alert/services/alert.service';
import {UserService} from '../../auth/services/user.service';
import {CommonService} from '../../common/services/common.service';

@Component({
  selector: 'app-todotask',
  templateUrl: './todotask.component.html',
  styleUrls: ['./todotask.component.css']
})
export class TodotaskComponent implements OnInit {

  itemForm: FormGroup;
  items: Item[];
  todo: any;
  todo_title: string;
  loading = false;
  submitted = false;
  item: any;
  users: User[];
  user_id: string;
  todo_users: User[];
  selectedUser: User;
  data: any;
  e: any;
  reload = false;

  description: any;


  @Input() taskId: string;
  formKey: string;
  task: any;
  todo_id: string;

  constructor(
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute,
    private todoService: TodoService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    // this.activatedRoute.params.subscribe(params => {
    //   this.task_id = params['taskId'];
    //   this.formKey = params['formKey'];
    // });
    this.taskService.getTask(this.taskId).toPromise().then(data => {
      this.task = data;
      console.log('this.task', this.task);
    }).then(response => {
      this.getTheTodoForThisTask(this.task.executionId);
    });
    this.getItemForm();
    this.reloadIfItemIsDeleted();
  }

  private getTheTodoForThisTask(executionId) {
    this.taskService.getVariable(executionId, 'entityId').toPromise().then(data => {
      this.todo_id = data.toString();
      console.log('todo_id', this.todo_id);
      this.todoService.getTodo(this.todo_id).subscribe(todo => {
        this.todo = todo;
        console.log('task.this.todo', this.todo);
        this.todo_title = this.todo.title;
        this.todo_users = this.todo.users;
        this.items = this.todo.items;
        this.items = this.items.sort();
        this.todo_id = this.todo.id;
        this.alertService.success('here you can manage your business', true);
      }, error => {
        this.alertService.error(error);
      });
    });
  }

  get f() {
    return this.itemForm.controls;
  }

  onSubmit(type) {
    if (type === 'item') {
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
        this.data = JSON.stringify({data});
        this.alertService.success('yes, you did it', false);
        this.getTodoItems();
        this.itemForm.reset();
        this.loading = false;
        this.data = data;
      }, error => {
        // this.alertService.error(error, true);
      });
    } else if (type === 'descriptio') {

    }
  }

  private getTodoItems() {
    this.todoService.getTodoItems(this.todo_id).subscribe(data => {
      this.items = data;

    }, error => {
      // this.alertService.error(error);
    });
  }

  private getItemForm() {
    this.itemForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  private reloadIfItemIsDeleted() {
    this.commonService.itemSubject.subscribe(res => {
      this.reload = res;
      if (this.reload) {
        this.getTodoItems();
      }
    });
  }

}
