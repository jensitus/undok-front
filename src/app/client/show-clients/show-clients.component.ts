import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Person} from '../model/person';

@Component({
  selector: 'app-show-clients',
  templateUrl: './show-clients.component.html',
  styleUrls: ['./show-clients.component.css']
})
export class ShowClientsComponent implements OnInit, OnDestroy {

  clients: Person[];
  private unsubscribe$ = new Subject();
  count: number;
  page = 1;
  offset = 0;
  size = 10;
  MULTIPLYING_FACTOR = 2;
  loading = false;
  resultMap: any;

  constructor(
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.getClientList(this.offset, this.size);
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
    this.getClientList(this.offset, this.size);
  }

  getClientList(page, size) {
    this.clientService.getAllClients(page, size).pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      console.log('result', result);
      this.resultMap = result;
      this.clients = this.resultMap.personMap.personList;
      this.count = this.resultMap.countMap.count;
    });
  }

}
