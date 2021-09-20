import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Counseling} from '../model/counseling';
import {faTasks} from '@fortawesome/free-solid-svg-icons';
import {CounselingTableService} from '../table/counseling-table.service';
import {NgbdSortableHeader, SortEvent} from '../table/sortable.directive';
import {CounselingService} from '../service/counseling.service';

@Component({
  selector: 'app-show-counselings',
  templateUrl: './show-counselings.component.html',
  styleUrls: ['./show-counselings.component.css'],
  providers: [{provide: 'paramId', useValue: 'param-id-donner'}]
})
export class ShowCounselingsComponent implements OnInit, OnDestroy {

  counselings: Counseling[];
  total$: Observable<number>;
  counselings$: Observable<Counseling[]>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

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
      console.log('show counselings', this.counselings);
      this.parseCounselingsToTableService();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  parseCounselingsToTableService(): void {
    console.log('show-counselings', this.counselings);
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

}
