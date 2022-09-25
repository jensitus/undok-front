import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {DeleteTypes} from './delete-types';
import {Subject} from 'rxjs';
import {DeleteService} from '../service/delete.service';
import {Router} from '@angular/router';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {takeUntil} from 'rxjs/operators';

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
    private alertService: AlertService
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
          this.alertService.success('Client successfully deleted', true);
          this.router.navigate(['/dashboard']);
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
