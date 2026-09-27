import {Component, input} from '@angular/core';
import {Case} from '../../model/case';

/**
 * The "Fall geschlossen" banner on the client detail page. Display only; reopening happens via
 * the "Fall wieder öffnen" button in the case card (see ReopenCaseComponent), and
 * CounselingService also revives a case automatically when a counseling is logged for a client
 * with no open case.
 */
@Component({
  selector: 'app-closed-case-banner',
  standalone: true,
  templateUrl: './closed-case-banner.component.html',
  styleUrl: './closed-case-banner.component.css'
})
export class ClosedCaseBannerComponent {

  closedCase = input.required<Case>();

}
