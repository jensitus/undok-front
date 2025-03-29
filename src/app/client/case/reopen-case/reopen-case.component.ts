import {Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Case} from '../../model/case';
import {CaseService} from '../../service/case.service';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reopen-case',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './reopen-case.component.html',
  styleUrl: './reopen-case.component.css'
})
export class ReopenCaseComponent implements OnInit, OnDestroy {

  @Input() inputCase: Case;
  @Output() caseEitherNewOrReOpened = new EventEmitter<boolean>();
  private subscription$: Subscription[] = [];
  protected createNewCase = false;
  protected newCaseName: string | undefined;
  private caseService = inject(CaseService);
  private modalService = inject(NgbModal);
  closeResult: WritableSignal<string> = signal('');

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.newCaseName = this.inputCase.name + '-02';
  }

  createNewCaseForm() {
    this.createNewCase = !this.createNewCase;
  }

  newCase() {
    const newCase: Case = {
      name: this.newCaseName ? this.newCaseName : this.inputCase.name + '-02',
      status: 'OPEN',
      startTime: null,
      clientId: this.inputCase.clientId,
    };
    this.subscription$.push(
      this.caseService.newCase(newCase).subscribe({
        next: value => {
          console.log(value);
          this.caseEitherNewOrReOpened.emit(true);
        },
        error: error => {
          console.log(error);
        }
      })
    );
  }

  checkReopenCase() {
    const openCase: Case = {
      id:         this.inputCase ? this.inputCase.id         : null,
      name:       this.inputCase ? this.inputCase.name       : null,
      referredTo: this.inputCase ? this.inputCase.referredTo : null,
      status: 'OPEN',
      startTime:  this.inputCase ? this.inputCase.startTime  : null,
      endTime:    this.inputCase ? this.inputCase.endTime    : null,
      clientId:   this.inputCase ? this.inputCase.clientId   : undefined,
    };
  }

  openReopenCaseModal(reopen_case) {
    this.modalService.open(reopen_case, {ariaLabelledBy: 'modal-basic-title', size: 'md'}).result.then((result) => {
      this.closeResult.set(`Closed with: ${result}`);
    }, (reason) => {
      this.closeResult.set(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

}
