import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DeleteTypes} from '../delete-types';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent implements OnInit {

  @Input() deleteType: DeleteTypes;
  @Input() deleteObjectName: string;
  @Input() confirmText: string;
  @Output() confirmed = new EventEmitter<boolean>();
  private closeResult: string;

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
  }

  open(delete_object) {
    this.modalService.open(delete_object, {ariaLabelledBy: 'modal-basic-title', size: 'sm'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.confirmed.emit(true);
    }, (reason) => {
      // this.closeResult = `Dismissed ${ShowSingleClientComponent.getDismissReason(reason)}`;
      console.log(reason);
      this.confirmed.emit(false);
    });
  }
}
