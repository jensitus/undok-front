import {Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Observable, Subject} from 'rxjs';
import {faTasks} from '@fortawesome/free-solid-svg-icons';
import {CounselingTableService} from '../table/counseling-table.service';
import {NgbdSortableHeader, SortEvent} from '../table/sortable.directive';
import {CounselingService} from '../service/counseling.service';
import {DatePipe} from '@angular/common';
import {CsvService} from '../service/csv.service';
import {AllCounseling} from '../model/all-counseling';
import {saveAs} from 'file-saver';
import {takeUntil} from 'rxjs/operators';
import {currentDate, currentDateTime} from '../../common/helper/date-utility';

@Component({
             selector: 'app-show-counselings',
             templateUrl: './show-counselings.component.html',
             styleUrls: ['./show-counselings.component.css'],
             providers: [{provide: 'paramId', useValue: 'param-id-donner'}]
           })
export class ShowCounselingsComponent implements OnInit, OnDestroy {

  total$: Observable<number>;
  counselings$: Observable<AllCounseling[]>;
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
    this.csvService
        .downloadCsv('/service/undok/counselings')
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe(blob => saveAs(blob, currentDate + '-counselings.csv'));
  }

}
