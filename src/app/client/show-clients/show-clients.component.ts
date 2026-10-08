import {Component, computed, effect, inject, OnInit, signal} from '@angular/core';
import {faTachometerAlt, faUsers} from '@fortawesome/free-solid-svg-icons';
import {ClientTableService, matchesClient, residenceStatusNames, sectorNames} from '../table/client-table.service';
import {CsvService} from '../service/csv.service';
import {AllClient} from '../model/all-client';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {CommonService} from '../../common/services/common.service';
import {StatusUtility} from '../../common/helper/status-utility';
import {saveAs} from '../../common/helper/file-utility';
import {AlertComponent} from '../../admin-template/layout/components/alert/alert.component';
import {PageHeaderComponent} from '../../admin-template/shared/page-header/page-header.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {NgbHighlight, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-show-clients',
  standalone: true,
  templateUrl: './show-clients.component.html',
  imports: [
    AlertComponent,
    PageHeaderComponent,
    FaIconComponent,
    NgbPaginationModule,
    FormsModule,
    NgbHighlight,
    RouterLink
  ],
  styleUrls: ['./show-clients.component.css']
})
export class ShowClientsComponent implements OnInit {

  readonly residenceStatusNames = residenceStatusNames;
  readonly sectorNames = sectorNames;
  readonly caseStatusBadgeClass = StatusUtility.getCaseStatusBadgeClass;
  readonly caseStatusLabel = StatusUtility.getCaseStatusLabel;

  protected readonly faUsers = faUsers;
  protected readonly faTachometerAlt = faTachometerAlt;

  private clientTableService = inject(ClientTableService);
  private csvService = inject(CsvService);
  private alertService = inject(AlertService);
  private commonService = inject(CommonService);

  allClients = signal<AllClient[]>([]);
  loading = signal(true);
  searchTerm = signal('');
  pageSize = signal(20);
  openPage = signal(1);
  closedPage = signal(1);

  private filtered = computed(() => {
    const term = this.searchTerm().trim();
    const clients = this.allClients();
    return term ? clients.filter(client => matchesClient(client, term)) : clients;
  });

  /**
   * Clients with no case at all sit in the open section rather than the closed one — they are
   * not concluded, and hiding them under "abgeschlossen" would be wrong. The table marks them
   * "kein Fall".
   */
  openClients = computed(() => this.filtered().filter(client => client.caseStatus !== 'CLOSED'));
  closedClients = computed(() => this.filtered().filter(client => client.caseStatus === 'CLOSED'));

  openPageItems = computed(() => this.paginate(this.openClients(), this.openPage()));
  closedPageItems = computed(() => this.paginate(this.closedClients(), this.closedPage()));

  constructor() {
    effect(() => {
      const message = this.commonService.alert();
      if (message) {
        this.alertService.error(message);
      }
    });
    // A delete elsewhere in the app signals a reload; refetch so the sections stay accurate.
    effect(() => {
      if (this.commonService.reload()) {
        this.loadClients();
      }
    });
  }

  ngOnInit(): void {
    this.loadClients();
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    // Both sections shrink as you type, so an old page number would land on nothing.
    this.openPage.set(1);
    this.closedPage.set(1);
  }

  onPageSize(size: number): void {
    this.pageSize.set(size);
    this.openPage.set(1);
    this.closedPage.set(1);
  }

  clickToCsv(): void {
    this.csvService.downloadCsv('/service/undok/clients').subscribe(blob => saveAs(blob, 'clients.csv'));
  }

  private loadClients(): void {
    this.loading.set(true);
    this.clientTableService.getAllClients().subscribe({
      next: clients => {
        this.allClients.set(clients);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private paginate(clients: AllClient[], page: number): AllClient[] {
    const size = this.pageSize();
    return clients.slice((page - 1) * size, page * size);
  }

}
