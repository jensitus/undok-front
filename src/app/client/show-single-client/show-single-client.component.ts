import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ClientService} from '../service/client.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Client} from '../model/client';
import {Person} from '../model/person';

@Component({
  selector: 'app-show-single-client',
  templateUrl: './show-single-client.component.html',
  styleUrls: ['./show-single-client.component.css']
})
export class ShowSingleClientComponent implements OnInit, OnDestroy {

  private id: string;
  private unsubscribe$ = new Subject();
  person: Person;
  client: Client;

  constructor(
    private activatedRoute: ActivatedRoute,
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
      this.id = params['id'];
      this.getClient();
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  getClient() {
    this.clientService.getSingleClient(this.id).pipe(takeUntil(this.unsubscribe$)).subscribe( res => {
      this.person = res;
    });
  }

}
