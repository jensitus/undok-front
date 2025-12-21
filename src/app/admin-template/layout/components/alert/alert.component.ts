import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {AlertService} from './services/alert.service';
import {takeUntil} from 'rxjs/operators';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  private subscription$ = new Subject<any>();
  message: any;
  messagetype: string;

   constructor(
     private alertService: AlertService
   ) {
   }

   ngOnInit() {
    this.alertService.getMessage().pipe(takeUntil(this.subscription$)).subscribe(message => {
      this.message = message;
      this.messagetype = this.message.type;
    }, error => {
      console.log('error Alert', alert);
    });
   }

   ngOnDestroy() {
     this.subscription$.next(true);
   }

}
