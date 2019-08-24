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

  valDescription: any;
  itemDescriptions: Description[];
  data: any;
  description: any;
  displayItem = false;
  display_item_id: number;
  loading = false;
  submitted = false;
  reload = false;

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
    this.update_description_id = description_id;
  }

  showUpdateDescription() {
    this.displayUpdateDescription = !this.displayUpdateDescription;
  }

  editDescription(description, item_id) {
    this.submitted = true;
    this.addEditDescription(description.id);
    this.showUpdateDescription();
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
    this.todoService.createItemDescription(this.description, this.todo_id, item_id, 'item').subscribe(data => {
      this.data = data;
      this.descriptionForm.reset();
      this.loading = false;
      this.addDescription(this.data.id);
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
    console.log('displayItem', this.displayItem);
    console.log('display_item_id', this.display_item_id);
    console.log('displayUpdateDescription', this.displayUpdateDescription);
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
      this.loading = false;
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
