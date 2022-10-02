import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DeleteTypes} from './delete-types';
import {Subject} from 'rxjs';
import {DeleteService} from '../service/delete.service';
import {Router} from '@angular/router';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {takeUntil} from 'rxjs/operators';
import {CommonService} from '../../common/services/common.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit, OnDestroy {

  deleteTypeClient: DeleteTypes = DeleteTypes.CLIENT;

  @Input() type: DeleteTypes;
  @Input() id_to_delete: string;
  @Input() delete_object_name: string;
  private unsubscribe$ = new Subject();
  confirmed: boolean;

  constructor(
    private deleteService: DeleteService,
    private router: Router,
    private alertService: AlertService,
    private commonService: CommonService
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(true);
  }

  delete() {
    switch (this.type) {
      case DeleteTypes.CLIENT:
        this.deleteService.deleteClient(this.id_to_delete).pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
          this.commonService.setAlertSubject('Client successfully deleted');
          this.router.navigate(['/clients/client-list']);
        }, error => {
          this.alertService.error('Sorry but something went wrong');
        });
        break;
      case DeleteTypes.EMPLOYER:
        this.deleteService.deleteEmployer(this.id_to_delete).pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
          this.commonService.setAlertSubject('Employer successfully deleted');
          this.router.navigate(['/clients/employers']);
        }, error => {
          this.alertService.error(error.error.text);
        });
        break;
      default:
        break;
    }
  }

  checkConfirmation(event: boolean) {
    this.confirmed = event;
    if (this.confirmed === true) {
      this.delete();
    }
  }
}
