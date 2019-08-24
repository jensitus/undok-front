import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TodoService} from '../../services/todo.service';
import {Description} from '../../model/description';
import {CommonService} from '../../../common/services/common.service';

@Component({
  selector: 'app-edit-description',
  templateUrl: './edit-description.component.html',
  styleUrls: ['./edit-description.component.css']
})
export class EditDescriptionComponent implements OnInit {

  @Input() item: any;
  @Input() todo_id: string;
  @Input() description: any;
  descriptionUpdateForm: FormGroup;
  data: any;
  valDescription: any;

  loading = false;
  submitted = false;

  constructor(
    private todoService: TodoService,
    private formBuilder: FormBuilder,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    console.log('description', this.description);
    this.descriptionUpdateForm = this.formBuilder.group({
      id: [],
      text: ['', Validators.required]
    });
    this.valDescription = {
      id: this.description.id,
      text: this.description.text
    };
    this.descriptionUpdateForm.setValue(this.valDescription);
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
    this.todoService.updateItemDescription(this.todo_id, item_id, this.description, 'item').subscribe(data => {
      this.data = data;
      this.loading = false;
      this.commonService.setDescriptionUpdateSubject(true);
      // this.submitted = false;
    });
  }

  get up() {
    return this.descriptionUpdateForm.controls;
  }

}
