import {Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Observable, Subject} from 'rxjs';
import {Counseling} from '../model/counseling';
import {faTasks} from '@fortawesome/free-solid-svg-icons';
import {CounselingTableService} from '../table/counseling-table.service';
import {NgbdSortableHeader, SortEvent} from '../table/sortable.directive';
import {CounselingService} from '../service/counseling.service';
import {DatePipe} from '@angular/common';
import {CsvService} from '../service/csv.service';

@Component({
  selector: 'app-show-counselings',
  templateUrl: './show-counselings.component.html',
  styleUrls: ['./show-counselings.component.css'],
  providers: [{provide: 'paramId', useValue: 'param-id-donner'}]
})
export class ShowCounselingsComponent implements OnInit, OnDestroy {

  // counselings: Counseling[];
  columns = ['id', 'counselingStatus', 'entryDate', 'concern', 'concernCategory', 'activity', 'activityCategory', 'registeredBy', 'counselingDate', 'clientId', 'clientFullName', 'comment'];
  total$: Observable<number>;
  counselings$: Observable<Counseling[]>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  documentName = 'DokumentenName';
  datePipe: DatePipe;

  @ViewChild('documentLink', {static: true}) documentLink: ElementRef;

  private unsubscribe$ = new Subject();
  faTasks = faTasks;

  constructor(
    private clientService: ClientService,
    public counselingTableService: CounselingTableService,
    private counselingService: CounselingService,
    private csvService: CsvService
  ) {
    this.total$ = counselingTableService.total$;
    this.counselings$ = counselingTableService.counselings$;
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.counselingTableService.sortColumn = column;
    this.counselingTableService.sortDirection = direction;
  }

  clickToCsv() {
    this.csvService.exportToCsv(this.counselingTableService.allCounselings, 'counselings', this.columns);
  }

}
