// import {Component, Input, OnInit} from '@angular/core';
// import {TodoService} from '../services/todo.service';
// import {Todo} from '../model/todo';
// import {Item} from '../model/item';
// import {FormBuilder, FormGroup, Validators} from '@angular/forms';
// import {AlertService} from '../../common/alert/services/alert.service';
//
// @Component({
//   selector: 'app-items',
//   templateUrl: './items.component.html',
//   styleUrls: ['./items.component.css']
// })
// export class ItemsComponent implements OnInit {
//
//   @Input() public todo: any;
//   loading = false;
//   submitted = false;
//   itemForm: FormGroup;
//   items: Item[];
//   item: any;
//   todo_id: string;
//   data: any;
//
//   constructor(
//     private todoService: TodoService,
//     private alertService: AlertService,
//     private formBuilder: FormBuilder,
//   ) { }
//
//   ngOnInit() {
//     console.log('this.item.todo', this.todo);
//     this.items = this.todo.items;
//     this.todo_id = this.todo.id;
//     this.getItemForm();
//   }
//
//   onSubmit(type) {
//     if (type === 'item') {
//       this.submitted = true;
//       if (this.itemForm.invalid) {
//         return;
//       }
//       this.loading = true;
//       this.item = {
//         name: this.itemForm.value.name,
//         done: false
//       };
//       this.todoService.createTodoItem(this.todo_id, this.item).subscribe(data => {
//         this.data = JSON.stringify({data});
//         this.alertService.success('yes, you did it', false);
//         this.getTodoItems();
//         this.itemForm.reset();
//         this.loading = false;
//         this.data = data;
//       }, error => {
//         // this.alertService.error(error, true);
//       });
//     } else if (type === 'descriptio') {
//
//     }
//   }
//
//   private getTodoItems() {
//     this.todoService.getTodoItems(this.todo_id).subscribe(data => {
//       this.items = data;
//
//     }, error => {
//       // this.alertService.error(error);
//     });
//   }
//
//   get f() {
//     return this.itemForm.controls;
//   }
//
//   private getItemForm() {
//     this.itemForm = this.formBuilder.group({
//       name: ['', Validators.required]
//     });
//   }
//
// }
