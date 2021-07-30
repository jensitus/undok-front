import {Component, OnDestroy, OnInit} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-show-employers-list',
  templateUrl: './show-employers-list.component.html',
  styleUrls: ['./show-employers-list.component.css']
})
export class ShowEmployersListComponent implements OnInit, OnDestroy {

  private unsubscribe$ = new Subject();

  constructor(
    private clientService: ClientService
  ) { }

  ngOnInit(): void {
    this.getEmployerList();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  getEmployerList(): any {
    this.clientService.getAllEmployers().pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      console.log(result);
    });
  }


}
