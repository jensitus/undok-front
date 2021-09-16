import {Component, Input, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {Employer} from '../model/employer';
import {EmployerService} from '../service/employer.service';
import {EmployerTableService} from '../table/employer-table.service';
import {Counseling} from '../model/counseling';
import {NgbdSortableHeader, SortEvent} from '../table/sortable.directive';

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

  constructor(
    private employerService: EmployerService,
    public employerTableService: EmployerTableService
  ) {
    this.total$ = employerTableService.total$;
    this.employers$ = employerTableService.employers$;
  }

  ngOnInit(): void {
    this.getEmployerList();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
  }

  getEmployerList(): any {
    this.employerService.getAllEmployers(this.clientId).pipe(takeUntil(this.unsubscribe$)).subscribe(result => {
      this.employers = result;
      this.parseEmployersToTableService();
    });
  }

  setEmployer(e_id) {
    this.employerService.checkClientEmployer(e_id, this.clientId).pipe(takeUntil(this.unsubscribe$)).subscribe(res => {
      console.log(res);
      if (res === true) {
        this.deleteEmployer(e_id, this.clientId);
      } else if (res === false) {
        this.addEmployer(e_id, this.clientId);
      }
    });
  }

  deleteEmployer(e_id: string, clientId: string) {
    this.employerService.deleteEmployerFromClient(e_id, this.clientId).pipe(takeUntil(this.unsubscribe$)).subscribe(r => {
      console.log(r);
    });
  }

  addEmployer(e_id: string, clientId: string) {
    this.employerService.setEmployerToClient(e_id, this.clientId).pipe(takeUntil(this.unsubscribe$)).subscribe(r => {
      console.log(r);
    });
  }

  parseEmployersToTableService(): void {
    console.log('parseEmployersToTable', this.employers);
    this.employerTableService.getEmployers(this.employers);
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


}
