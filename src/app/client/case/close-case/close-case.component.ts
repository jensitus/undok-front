import {Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output, signal, WritableSignal} from '@angular/core';
import {Label} from '../../model/label';
import {CategoryTypes} from '../../model/category-types';
import {Case} from '../../model/case';
import {CaseService} from '../../service/case.service';
import {SelectBoxComponent} from '../../select-box/single/select-box.component';
import {ModalDismissReasons, NgbCalendar, NgbDateStruct, NgbInputDatepicker, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {NgbFormatterService} from '../../../common/services/ngb-formatter.service';
import {Subscription} from 'rxjs';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faCalendar} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-close-case',
  standalone: true,
  templateUrl: './close-case.component.html',
  imports: [
    SelectBoxComponent,
    NgbInputDatepicker,
    FormsModule,
    FaIconComponent
  ],
  styleUrl: './close-case.component.css'
})
export class CloseCaseComponent implements OnInit, OnDestroy {

  @Input() inputCase: Case | undefined;
  @Input() closeCaseProperty = false;
  @Input() reopenProperty = false;
  @Output() caseClosed = new EventEmitter<boolean>();
  protected forwardedTo: string = undefined;
  protected cat_forwarded = CategoryTypes.REFERRED_TO;
  private counselingCase: Case;
  protected readonly Label = Label;
  dateStruct: NgbDateStruct;
  today = inject(NgbCalendar).getToday();
  private modalService = inject(NgbModal);
  private caseService = inject(CaseService);
  private ngbFormatter = inject(NgbFormatterService);
  closeResult: WritableSignal<string> = signal('');
  private subscription$: Subscription[] = [];
  protected readonly faCalendar = faCalendar;

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

  ngOnInit(): void {
    this.dateStruct = this.today;
  }

  selectOrganization(event: string) {
    this.forwardedTo = event;
  }

  closeCase(): void {
    const closeCase: Case = {
      id: this.inputCase ? this.inputCase.id : undefined,
      startTime: this.inputCase ? this.inputCase.startTime : null,
      name: this.inputCase ? this.inputCase.name : undefined,
      status: 'CLOSED',
      referredTo: this.forwardedTo || undefined,
      clientId: this.inputCase ? this.inputCase.clientId : undefined,
    };
    this.subscription$.push(
      this.caseService.closeCase(closeCase).subscribe({
        next: value => {
          console.log(value);
          this.caseClosed.emit(true);
        }, error: error => {
          console.log(error);
          this.caseClosed.emit(false);
        }
      })
    );
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
