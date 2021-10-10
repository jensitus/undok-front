import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {faUsers} from '@fortawesome/free-solid-svg-icons';
import {Client} from '../model/client';
import {NgbdSortableHeader, SortEvent} from '../table/sortable.directive';
import {ClientTableService} from '../table/client-table.service';

@Component({
  selector: 'app-show-clients',
  templateUrl: './show-clients.component.html',
  styleUrls: ['./show-clients.component.css']
})
export class ShowClientsComponent implements OnInit, OnDestroy {

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  total$: Observable<number>;
  clients: Client[];
  clients$: Observable<Client[]>;
  private unsubscribe$ = new Subject();
  count: number;
  loading = false;
  faUsers = faUsers;
  tableColumns: string[];

  constructor(
    private clientService: ClientService,
    public clientTableService: ClientTableService
  ) {
    this.total$ = this.clientTableService.total$;
    this.clients$ = this.clientTableService.clients$;
  }

  ngOnInit(): void {
    this.getClientList();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  getClientList() {
    this.clientService.getAllClientsPaginated().pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      console.log('result', result);
      this.clients = result;
      this.parseCounselingsToTableService();
    });
  }

  parseCounselingsToTableService(): void {
    console.log('parseCounselingsToTableService: show-counselings', this.clients);
    this.clientTableService.getClients(this.clients);
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.clientTableService.sortColumn = column;
    this.clientTableService.sortDirection = direction;
  }


}
