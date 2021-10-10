import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {faUsers} from '@fortawesome/free-solid-svg-icons';
import {Client} from '../model/client';
import {NgbdSortableHeader, SortEvent} from '../table/sortable.directive';
import {ClientTableService} from '../table/client-table.service';
import {CsvService} from '../service/csv.service';
import {MaritalStatus} from '../model/marital-status.enum';
import {Counseling} from '../model/counseling';
import {Person} from '../model/person';
import {AllClient} from '../model/all-client';

@Component({
  selector: 'app-show-clients',
  templateUrl: './show-clients.component.html',
  styleUrls: ['./show-clients.component.css']
})
export class ShowClientsComponent implements OnInit, OnDestroy {

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  total$: Observable<number>;
  clients: AllClient[];
  clients$: Observable<AllClient[]>;
  private unsubscribe$ = new Subject();
  count: number;
  loading = false;
  faUsers = faUsers;
  tableColumns: string[];
  columns = ['id', 'firstName', 'lastName', 'street', 'zipCode', 'city', 'country', 'keyword', 'education', 'maritalStatus', 'interpreterNecessary', 'howHasThePersonHeardFromUs', 'vulnerableWhenAssertingRights',
    'counselings', 'nationality', 'language', 'currentResidentStatus', 'formerResidentStatus', 'labourMarketAccess', 'position',
    'sector', 'union', 'membership', 'organization'];

  CSV_FILENAME = 'clients';

  constructor(
    private clientService: ClientService,
    public clientTableService: ClientTableService,
    private csvService: CsvService
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
      console.log(result);
      this.clients = result;
      this.parseCounselingsToTableService();
    });
  }

  parseCounselingsToTableService(): void {
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

  clickToCsv() {
    this.csvService.exportToCsv(this.clients, this.CSV_FILENAME, this.columns);
  }

}
