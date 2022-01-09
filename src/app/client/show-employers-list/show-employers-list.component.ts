import {Component, Input, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Employer} from '../model/employer';
import {EmployerService} from '../service/employer.service';
import {EmployerTableService} from '../table/employer-table.service';
import {NgbdSortableHeader, SortEvent} from '../table/sortable.directive';
import {CommonService} from '../../common/services/common.service';
import {faSurprise} from '@fortawesome/free-solid-svg-icons';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CreateClientEmployerJobDescriptionComponent} from '../create-client-employer-job-description/create-client-employer-job-description.component';

@Component({
  selector: 'app-show-employers-list',
  templateUrl: './show-employers-list.component.html',
  styleUrls: ['./show-employers-list.component.css']
})
export class ShowEmployersListComponent implements OnInit, OnDestroy {

  @Input() clientId: string;
  private unsubscribe$ = new Subject();
  employers: Employer[];
  total$: Observable<number>;
  employers$: Observable<Employer[]>;
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  faSurprise = faSurprise;
  private closeResult = '';

  constructor(
    private employerService: EmployerService,
    public employerTableService: EmployerTableService,
    private modalService: NgbModal,
    private commonService: CommonService
  ) {
    this.total$ = employerTableService.total$;
    this.employers$ = employerTableService.employers$;
  }

  private static getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  setEmployer(e_id) {
    this.employerService.checkClientEmployer(e_id, this.clientId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      console.log(res);
      if (res === true) {
        this.deleteEmployer(e_id, this.clientId);
      } else if (res === false) {
        this.addEmployer(e_id);
      }
    });
  }

  deleteEmployer(e_id: string, clientId: string) {
    this.employerService.deleteEmployerFromClient(e_id, this.clientId).pipe(takeUntil(this.unsubscribe$)).subscribe(r => {
      console.log(r);
    });
  }

  addEmployer(e_id: string) {
    this.employerService.setEmployerToClient(e_id, this.clientId).pipe(takeUntil(this.unsubscribe$)).subscribe(r => {
      console.log(r);
      this.commonService.setEmployerSubject(true);
    });
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.employerTableService.sortColumn = column;
    this.employerTableService.sortDirection = direction;
  }

  assignEmployer(content, employer: Employer) {
    const assignModal = this.modalService.open(CreateClientEmployerJobDescriptionComponent, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
    assignModal.componentInstance.employerId = employer.id;
    assignModal.componentInstance.clientId = this.clientId;
    assignModal.result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ShowEmployersListComponent.getDismissReason(reason)}`;
    });

  }


}
