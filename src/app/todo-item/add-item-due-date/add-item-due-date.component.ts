import {Component, Input, OnInit} from '@angular/core';
import {TodoService} from '../services/todo.service';
import {Item} from '../model/item';
import {CommonService} from '../../common/services/common.service';
import {ModalDismissReasons, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NgbFormatterService} from '../../common/services/ngb-formatter.service';

@Component({
  selector: 'app-add-item-due-date',
  templateUrl: './add-item-due-date.component.html',
  styleUrls: ['./add-item-due-date.component.css']
})
export class AddItemDueDateComponent implements OnInit {

  @Input() todo_id: string;
  @Input() item: Item;
  show_set_due_date: boolean;
  dueDate: any;
  dueDatePlaceholder: string;
  closeResult: string;

  constructor(
    private todoService: TodoService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private ngbFormatterService: NgbFormatterService
  ) {
  }

  ngOnInit() {
    this.show_set_due_date = false;
    if (this.item.dueDate === null) {
      this.dueDate = 'yyyy-mm-dd';
    } else {
      this.dueDate = this.item.dueDate;
      console.log(this.dueDate);
    }
    this.setDueDatePlaceholder();
  }

  setTheDueDate() {
    this.todoService.setItemDueDate(this.todo_id, this.item.id, this.ngbFormatterService.format(this.dueDate)).subscribe(result => {
      console.log(result);
      this.commonService.setDueDateSubject(true);
    });
  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.setTheDueDate();
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

  private setDueDatePlaceholder () {
    if (this.dueDate === null) {
      this.dueDatePlaceholder = 'yyyy-mm-dd';
    } else {
      console.log('this.dueDate', this.dueDate);
      // .day.toString() + '/' + this.dueDate.month.toString() + '/' + this.dueDate.year.toString();
      console.log(this.dueDatePlaceholder);
    }
  }

}
