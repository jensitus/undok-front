import { Component, inject, input, output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteTypes } from '../delete-types';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  imports: [FaIconComponent],
  standalone: true,
  styleUrl: './delete-modal.component.css'
})
export class DeleteModalComponent {
  private modalService = inject(NgbModal);

  deleteType = input<DeleteTypes>();
  deleteObjectName = input<string>('');
  confirmText = input<string>('');
  confirmed = output<boolean>();

  protected readonly faTrash = faTrash;

  open(deleteObject: any) {
    this.modalService.open(deleteObject, {
      ariaLabelledBy: 'modal-basic-title',
      size: 'md'
    }).result.then(
      () => this.confirmed.emit(true),
      () => this.confirmed.emit(false)
    );
  }
}
