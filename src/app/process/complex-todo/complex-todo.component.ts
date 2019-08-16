import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Description} from '../../todo-item/model/description';
import {TodoService} from '../../todo-item/services/todo.service';
import {AlertService} from '../../common/alert/services/alert.service';
import {CommonService} from '../../common/services/common.service';

@Component({
  selector: 'app-complex-todo',
  templateUrl: './complex-todo.component.html',
  styleUrls: ['./complex-todo.component.css']
})
export class ComplexTodoComponent implements OnInit {

  @Input() item: any;
  @Input() todo_id: string;
  displayDescription = false;
  displayUpdateDescription = false;
  description_id: number;
  descriptionForm: FormGroup;
  update_description_id: number;
  descriptionUpdateForm: FormGroup;
  valDescription: any;
  itemDescriptions: Description[];
  data: any;
  description: any;
  displayItem = false;
  display_item_id: number;
  loading = false;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private todoService: TodoService,
    private alertService: AlertService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.getDescriptionForm();
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

  get d() {
    return this.descriptionForm.controls;
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

  getItemDescriptions(item_id) {
    this.todoService.getItemDescriptions(this.todo_id, item_id).subscribe(data => {
      this.itemDescriptions = data;
    });
  }

  private getDescriptionForm() {
    this.descriptionForm = this.formBuilder.group({
      description: ['', Validators.required],
      item_id: []
    });
  }

  openItem(item_id) {
    this.displayItem = !this.displayItem;
    this.display_item_id = item_id;
    this.displayUpdateDescription = false;
    this.getItemDescriptions(item_id);
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
      // this.getTodoItems();
      this.loading = false;
      // this.displayDescription = false;
      this.displayItem = false;
    });
  }

  deleteItem(item_id) {
    this.loading = true;
    this.todoService.deleteTodoItem(this.todo_id, item_id).subscribe(data => {
      this.data = data;
      this.alertService.success(this.data.text, true);
      this.commonService.setItemSubject(true);
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

}
