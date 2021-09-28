import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {faUsers} from '@fortawesome/free-solid-svg-icons';
import {Client} from '../model/client';

@Component({
  selector: 'app-show-clients',
  templateUrl: './show-clients.component.html',
  styleUrls: ['./show-clients.component.css']
})
export class ShowClientsComponent implements OnInit, OnDestroy {

  clients: Client[];
  private unsubscribe$ = new Subject();
  count: number;
  page = 1;
  offset = 0;
  pageSize = 3;
  MULTIPLYING_FACTOR = 2;
  loading = false;
  resultMap: any;
  faUsers = faUsers;

  constructor(
    private clientService: ClientService
  ) {
  }

  ngOnInit(): void {
    this.getClientList(this.offset, this.pageSize)
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  getThePageNumber() {
    if (this.page === 0) {
      this.offset = 0;
    } else if (this.page >= 1 ) {
      this.offset = this.page - 1;  // (this.page - 1 ) * this.MULTIPLYING_FACTOR;
      console.log(this.offset);
    }
    this.getClientList(this.offset, this.pageSize);
  }

  getClientList(page, size) {
    this.clientService.getAllClientsPaginated(page, size).pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      console.log('result', result);
      this.resultMap = result;
      this.clients = this.resultMap.clientMap.clientList;
      this.count = this.resultMap.countMap.count;
    });
  }



}
