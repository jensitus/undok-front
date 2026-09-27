import {Component, computed, inject, input, output, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Case} from '../../model/case';
import {CaseService} from '../../service/case.service';
import {AlertService} from '../../../admin-template/layout/components/alert/services/alert.service';

/**
 * Reopens a closed case so the counsellor can edit its properties again. With several closed
 * cases the counsellor picks which one — most recently closed first, preselected.
 */
@Component({
  selector: 'app-reopen-case',
  standalone: true,
  templateUrl: './reopen-case.component.html',
  imports: [
    DatePipe
  ],
  styleUrl: './reopen-case.component.css'
})
export class ReopenCaseComponent {

  /** As the backend delivers them: end date ascending, so the last one closed most recently. */
  closedCases = input.required<Case[]>();
  caseReopened = output<boolean>();

  private caseService = inject(CaseService);
  private alertService = inject(AlertService);

  /** Most recently closed first — that is the one counsellors reach for. */
  protected readonly candidates = computed(() => [...this.closedCases()].reverse());

  protected selectedId = signal<string | undefined>(undefined);
  protected saving = signal(false);

  protected readonly selectedCase = computed(() => {
    const id = this.selectedId();
    const list = this.candidates();
    return id ? list.find(c => c.id === id) : list[0];
  });

  reopenCase(): void {
    const caseId = this.selectedCase()?.id;
    if (!caseId || this.saving()) {
      return;
    }
    this.saving.set(true);
    this.caseService.reopenCase(caseId).subscribe({
      next: () => {
        this.saving.set(false);
        this.alertService.success('Fall wieder geöffnet');
        this.caseReopened.emit(true);
      },
      error: error => {
        this.saving.set(false);
        // 409 is silent in the ErrorInterceptor, so the message has to come from here.
        // The backend's Message DTO carries the text under `text`, not `message`.
        this.alertService.error(error?.error?.text ?? 'Der Fall konnte nicht wieder geöffnet werden');
        this.caseReopened.emit(false);
      }
    });
  }

}
