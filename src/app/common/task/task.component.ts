import {Component, OnInit} from '@angular/core';
import {TaskService} from '../task.service';
import {ActivatedRoute} from '@angular/router';
import {TodoService} from '../../todo-item/services/todo.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Item} from '../../todo-item/model/item';
import {User} from '../../auth/model/user';
import {Description} from '../../todo-item/model/description';
import {AlertService} from '../alert/services/alert.service';
import {UserService} from '../../auth/services/user.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {

  itemForm: FormGroup;
  items: Item[];
  todo: any;
  todo_title: string;
  loading = false;
  submitted = false;
  item: any;
  addUserForm: FormGroup;
  users: User[];
  user_id: string;
  todo_users: User[];
  selectedUser: User;
  data: any;
  e: any;

  valDescription: any;
  displayDescription = false;
  displayUpdateDescription = false;
  displayItem = false;
  display_item_id: number;
  update_description_id: number;
  descriptionUpdateForm: FormGroup;

  description_id: number;
  description: any;
  descriptionForm: FormGroup;
  itemDescriptions: Description[];

  task_id: string;
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
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.task_id = params['taskId'];
      this.formKey = params['formKey'];
    });
    this.taskService.getTask(this.task_id).toPromise().then(data => {
      this.task = data;
      console.log('this.task', this.task);
    }).then(response => {
      this.getTheTodoForThisTask(this.task.executionId);
    });
    this.getItemForm();
    this.getAddUserForm();
    this.getDescriptionForm();
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

  get d() {
    return this.descriptionForm.controls;
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

  onDescriptionSubmit(item_id) {
    this.submitted = true;
    if (this.descriptionForm.invalid) {
      return;
    }
    this.loading = true;
    this.description = {
      text: this.descriptionForm.value.description
    };
    this.todoService.createItemDescription(this.description, this.todo_id, item_id).subscribe(data => {
      this.data = data;
      this.descriptionForm.reset();
      this.loading = false;
      this.addDescription(this.data.id);
      this.getItemDescriptions(item_id);
    });
  }

  onDescriptionUpdateSubmit(item_id) {
    this.submitted = true;
    if (this.descriptionUpdateForm.invalid) {
      return;
    }
    this.loading = true;
    this.description = {
      id: this.descriptionUpdateForm.value.id,
      text: this.descriptionUpdateForm.value.text
    };
    this.todoService.updateItemDescription(this.todo_id, item_id, this.description).subscribe(data => {
      this.data = data;
      this.loading = false;
      this.addEditDescription(this.description.id);
      this.getItemDescriptions(item_id);
    });
  }

  get u() {
    return this.addUserForm.controls;
  }

  addUserToTodo() {
    this.submitted = true;
    if (this.addUserForm.invalid) {
      return;
    }
    this.loading = true;
    this.user_id = this.addUserForm.value['selectedUser'].id;
    this.todoService.addUserToTodo(this.todo.id, this.user_id).subscribe(data => {
      this.getUserForTodo();
      this.data = data;
      this.loading = false;
      this.alertService.success('user successfully added');
    }, error => {
      // this.alertService.error(error);
      this.loading = false;
    });
  }

  updateTodoItem(item_id) {
    this.loading = true;
    this.item = {
      id: item_id
    };
    this.todoService.updateTodoItem(this.todo_id, item_id, this.item).subscribe(data => {
      this.item = data;
      if (this.item.done === true) {
        this.alertService.success('item successfully done', false);
      } else if (this.item.done === false) {
        this.alertService.success('item is still open', false);
      }
      this.getTodoItems();
      this.loading = false;
      this.displayDescription = false;
      this.displayItem = false;
    });
  }

  openItem(item_id) {
    this.displayItem = !this.displayItem;
    this.display_item_id = item_id;
    this.displayUpdateDescription = false;
    this.getItemDescriptions(item_id);
  }

  addDescription(description_id) {
    this.displayDescription = !this.displayDescription;
    this.description_id = description_id;
  }

  addEditDescription(description_id) {
    this.displayUpdateDescription = !this.displayUpdateDescription;
    this.update_description_id = description_id;
  }

  editDescription(description) {
    this.submitted = true;
    this.descriptionUpdateForm = this.formBuilder.group({
      id: [],
      text: ['', Validators.required]
    });
    this.valDescription = {
      id: description.id,
      text: description.text
    };
    this.descriptionUpdateForm.setValue(this.valDescription);
    this.addEditDescription(description.id);
  }

  deleteItem(item_id) {
    this.loading = true;
    this.todoService.deleteTodoItem(this.todo_id, item_id).subscribe(data => {
      this.data = data;
      this.alertService.success(this.data.text, true);
      this.getTodoItems();
      this.loading = false;
    }, error => {
      this.loading = false;
    });
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

  private getDescriptionForm() {
    this.descriptionForm = this.formBuilder.group({
      description: ['', Validators.required],
      item_id: []
    });
  }

  private getAddUserForm() {
    this.addUserForm = this.formBuilder.group({
      user_id: [],
      selectedUser: this.selectedUser
    });
  }

  private getUsers() {
    this.userService.getAll().subscribe(data => {
      this.users = data;
    }, error => {
    });
  }

  private getUserForTodo() {
    this.todoService.getTodoUsers(this.todo_id).subscribe(data => {
      this.todo_users = data;
    }, error => {
      // this.alertService.error(error);
    });
  }

  loadUser() {
    console.log('loadUser()');
    this.getUsers();
  }

  getItemDescriptions(item_id) {
    this.todoService.getItemDescriptions(this.todo_id, item_id).subscribe(data => {
      this.itemDescriptions = data;
    });

  }

}
