import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
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
  size = 3;
  MULTIPLYING_FACTOR = 3;
  loading = false;

  constructor(
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.getClientList(this.page, this.size);
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  getThePageNumber() {
    if (this.page === 1) {
      this.offset = 0;
    } else if (this.page >= 2 ) {
      this.offset = (this.page - 1 ) * this.MULTIPLYING_FACTOR;
    }
    this.getClientList(this.page, this.size);
  }

  getClientList(page, size) {
    this.clientService.getAllClients(page, size).pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      console.log('result', result);
      this.clients = result;
    });
  }

}
