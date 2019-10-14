import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TodoService} from '../../services/todo.service';
import {Description} from '../../model/description';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.css']
})
export class DescriptionComponent implements OnInit {

  descriptionForm: FormGroup;
  loading = false;
  submitted = false;
  displayDescription = false;
  description_id: number;
  displayUpdateDescription = false;
  description: any;
  itemDescriptions: Description[];
  update_description_id: number;
  data: any;
  closeResult: string;

  @Input() public item_id: number;
  @Input() todo_id: string;
  @Input() item: any;

  constructor(
    private formBuilder: FormBuilder,
    private todoService: TodoService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.getDescriptionForm();
    this.getItemDescriptions(this.item_id);
  }

  get f() {
    return this.descriptionForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.descriptionForm.invalid) {
      return;
    }
    this.loading = true;
  }

  addDescription(description_id) {
    this.displayDescription = !this.displayDescription;
    this.description_id = description_id;
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
      this.modalService.dismissAll();
    });
  }

  addEditDescription(description_id) {
    this.update_description_id = description_id;
  }

  editDescription(description, item_id) {
    this.submitted = true;
    this.addEditDescription(description.id);
    this.showUpdateDescription();
  }

  showUpdateDescription() {
    this.displayUpdateDescription = !this.displayUpdateDescription;
  }

  getItemDescriptions(item_id) {
    this.todoService.getItemDescriptions(this.todo_id, item_id).subscribe(data => {
      this.itemDescriptions = data;
    });
  }

  get d() {
    return this.descriptionForm.controls;
  }

  private getDescriptionForm() {
    this.descriptionForm = this.formBuilder.group({
      description: ['', Validators.required],
      item_id: []
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-description-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openEditModal(editdescription) {
    this.modalService.open(editdescription, {ariaLabelledBy: 'edit-modal-description'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
