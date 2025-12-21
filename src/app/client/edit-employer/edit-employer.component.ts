import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Employer} from '../model/employer';
import {EmployerService} from '../service/employer.service';
import {Subscription} from 'rxjs';
import {CommonService} from '../../common/services/common.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-edit-employer',
  templateUrl: './edit-employer.component.html',
  imports: [
    FormsModule
  ],
  styleUrls: ['./edit-employer.component.css']
})
export class EditEmployerComponent implements OnInit, OnDestroy {

  @Input() employer: Employer;
  loading = false;
  private subscription$: Subscription[] = [];

  constructor(
    private employerService: EmployerService,
    private commonService: CommonService
  ) { }

  ngOnInit(): void {
  }

  updateEmployer(): void {
    console.log(this.employer);
    this.subscription$.push(this.employerService.updateEmployer(this.employer.id, this.employer).subscribe(result => {
      console.log(result);
      this.commonService.setCreateEmployerSubject(true);
    }));
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.forEach(s => {
        s.unsubscribe();
      });
    }
  }

}
