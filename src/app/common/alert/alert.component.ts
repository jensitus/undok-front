import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AlertService} from './services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  message: any;
  messagetype: string;

  constructor(private alertService: AlertService) {
  }

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe(message => {
      this.message = message;
      console.log('this.message: ', this.message );
      console.log(this.message.type);
      this.messagetype = this.message.type;
      console.log(this.message.text);
    });
    // this.messagetype = this.message.type;

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
