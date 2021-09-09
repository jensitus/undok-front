import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Counseling} from '../model/counseling';
import {faTasks} from '@fortawesome/free-solid-svg-icons';
import {CounselingService} from './counseling.service';
import {NgbdSortableHeader, SortEvent} from '../table/sortable.directive';

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
    private counselingService: CounselingService
  ) {
    this.total$ = counselingService.total$;
    this.counselings$ = counselingService.counselings$;
  }

  ngOnInit(): void {
    this.clientService.getCounselings().pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      console.log(result);
      this.counselings = result;
      this.parseCounselingsToService();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  parseCounselingsToService(): void {
    this.counselingService.getCounselings(this.counselings);
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.counselingService.sortColumn = column;
    this.counselingService.sortDirection = direction;
  }

}
