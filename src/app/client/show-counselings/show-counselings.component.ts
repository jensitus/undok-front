import {Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Counseling} from '../model/counseling';
import {faTasks} from '@fortawesome/free-solid-svg-icons';
import {CounselingTableService} from '../table/counseling-table.service';
import {NgbdSortableHeader, SortEvent} from '../table/sortable.directive';
import {CounselingService} from '../service/counseling.service';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-show-counselings',
  templateUrl: './show-counselings.component.html',
  styleUrls: ['./show-counselings.component.css'],
  providers: [{provide: 'paramId', useValue: 'param-id-donner'}]
})
export class ShowCounselingsComponent implements OnInit, OnDestroy {

  counselings: Counseling[];
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
    private counselingService: CounselingService
  ) {
    this.total$ = counselingTableService.total$;
    this.counselings$ = counselingTableService.counselings$;
  }

  ngOnInit(): void {
    this.counselingService.getCounselings().pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      this.counselings = result;
      console.log('ngOnInit: show counselings', this.counselings);
      this.parseCounselingsToTableService();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  parseCounselingsToTableService(): void {
    console.log('parseCounselingsToTableService: show-counselings', this.counselings);
    this.counselingTableService.getCounselings(this.counselings);
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


  exportTable(): void {

    const csvData = this.convertToCSV(this.counselings);

    const blob = new Blob([csvData], {type: 'text/csv'});
    const url = window.URL.createObjectURL(blob);

    // const date = new Date();
    // const dateFormat = 'yyyy-MM-dd';
    //
    const docName: string = this.documentName;
    // const dateString: string = this.datePipe.transform(date, dateFormat);
    // docName = docName.replace('{date}', dateString);

    console.log(this.documentLink);

    const documentLinkElement = this.documentLink.nativeElement;
    documentLinkElement.href = url;
    documentLinkElement.download = docName + '.csv';
    documentLinkElement.click();
  }

  convertToCSV(objArray: any): string {
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let str = '';

    const allowedColumnNames = this.columns; // this.columns.map( c => c.name );
    // str += this.columns.map( c => c.caption ).join(',') + '\r\n';

    for (const element of array) {
      let line = '';
      for (const col of allowedColumnNames) {
        console.log(col);
        if (line !== '') {
          line += ',';
        }
        line += element[col];
      }
      str += line + '\r\n';
    }
    return str;
  }

}
