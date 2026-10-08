import {Component, inject, input, output, signal} from '@angular/core';
import {Label} from '../../model/label';
import {CategoryTypes} from '../../model/category-types';
import {Case} from '../../model/case';
import {CaseService} from '../../service/case.service';
import {DateTimeService} from '../../service/date-time.service';
import {SelectBoxComponent} from '../../select-box/single/select-box.component';
import {NgbCalendar, NgbDateStruct, NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {faCalendar} from '@fortawesome/free-solid-svg-icons';
import {AlertService} from '../../../admin-template/layout/components/alert/services/alert.service';

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
export class CloseCaseComponent {

  caseToClose = input.required<Case>();
  caseClosed = output<boolean>();

  protected readonly Label = Label;
  protected readonly faCalendar = faCalendar;
  protected readonly catForwarded = CategoryTypes.REFERRED_TO;

  private caseService = inject(CaseService);
  private dateTimeService = inject(DateTimeService);
  private alertService = inject(AlertService);

  /** A case cannot end in the future, so the picker stops at today. */
  protected readonly today: NgbDateStruct = inject(NgbCalendar).getToday();
  protected endDate = signal<NgbDateStruct>(this.today);
  protected referredTo = signal<string | undefined>(undefined);
  protected saving = signal(false);

  selectOrganization(event: string): void {
    this.referredTo.set(event || undefined);
  }

  closeCase(): void {
    const caseId = this.caseToClose().id;
    if (!caseId || this.saving()) {
      return;
    }
    this.saving.set(true);
    this.caseService.closeCase(caseId, {
      endDate: this.dateTimeService.toIsoDate(this.endDate()),
      referredTo: this.referredTo()
    }).subscribe({
      next: () => {
        this.saving.set(false);
        this.alertService.success('Fall abgeschlossen');
        this.caseClosed.emit(true);
      },
      error: error => {
        this.saving.set(false);
        // 409/422 are silent in the ErrorInterceptor, so the message has to come from here.
        // The backend's Message DTO carries the text under `text`, not `message`.
        this.alertService.error(error?.error?.text ?? 'Der Fall konnte nicht abgeschlossen werden');
        this.caseClosed.emit(false);
      }
    });
  }

}
