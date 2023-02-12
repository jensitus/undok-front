import {Component, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Observable, Subject} from 'rxjs';
import {faUsers} from '@fortawesome/free-solid-svg-icons';
import {NgbdSortableHeader, SortEvent} from '../table/sortable.directive';
import {ClientTableService} from '../table/client-table.service';
import {CsvService} from '../service/csv.service';
import {AllClient} from '../model/all-client';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {CommonService} from '../../common/services/common.service';
import {takeUntil} from 'rxjs/operators';

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
  successMessage: string;
  columns = ['id', 'keyword', 'firstName', 'lastName', 'dateOfBirth', 'email', 'telephone', 'street', 'zipCode', 'city', 'country', 'education',
    'maritalStatus', 'interpreterNecessary', 'howHasThePersonHeardFromUs', 'vulnerableWhenAssertingRights',
    'counselings', 'nationality', 'language', 'currentResidentStatus', 'formerResidentStatus', 'labourMarketAccess', 'position',
    'sector', 'union', 'membership', 'organization', 'gender'];

  CSV_FILENAME = 'clients';

  constructor(
    private clientService: ClientService,
    public clientTableService: ClientTableService,
    private csvService: CsvService,
    private alertService: AlertService,
    private commonService: CommonService
  ) {
  }

  ngOnInit(): void {
    this.getAlertSubject();
    this.getClientsForTable();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(null);
  }

  getClientsForTable() {
    this.total$ = this.clientTableService.total$;
    this.clients$ = this.clientTableService.clients$;
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

  showAlert() {
    this.alertService.error(this.successMessage);
  }

  clickToCsv() {
    this.csvService.exportToCsv(this.clientTableService.allClients$, this.CSV_FILENAME, this.columns);
  }

  getAlertSubject() {
    this.commonService.alertSubject.pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      this.successMessage = result;
      if (result) {
        this.showAlert();
      }
    });
  }

}
