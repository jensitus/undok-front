import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ClientService} from '../service/client.service';
import {Subscription} from 'rxjs';
import {CounselingForm} from '../model/counseling-form';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {User} from '../../auth/model/user';
import {Category} from '../model/category';
import {CategoryService} from '../service/category.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Client} from '../model/client';

@Component({
  selector: 'app-create-counseling',
  templateUrl: './create-counseling.component.html',
  styleUrls: ['./create-counseling.component.css']
})
export class CreateCounselingComponent implements OnInit, OnDestroy {

  clientId: string;
  client: Client;
  @Input() clientFirstName: string;
  @Input() clientLastName: string;
  @Input() clientKeyword: string;

  private counselingId: string;
  currentUser: User;

  private subscription$: Subscription[] = [];

  loading = false;
  counselingForm: CounselingForm;
  counselingDate: string;
  concern: string;
  activity: string;
  registeredBy: string;
  faBars = faBars;
  category: Category;

  constructor(
    private clientService: ClientService,
    private categoryService: CategoryService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.clientId = params['id'];
    });
    this.getCurrentUser();
    this.subscription$.push(this.clientService.getSingleClient(this.clientId).subscribe(client => {
      this.client = client;
      this.onSubmit();
    }));
  }

  private getCurrentUser() {
    this.currentUser = JSON.parse(<string>localStorage.getItem('currentUser'));
    this.registeredBy = this.currentUser.username;
  }

  onSubmit() {
    this.loading = true;
    this.counselingForm = {
      registeredBy: this.registeredBy,
      clientId: this.clientId,
    };
    this.subscription$.push(this.clientService.createCounseling(this.clientId, this.counselingForm).subscribe(result => {
      this.counselingId = result.id;
      this.loading = false;
      this.router.navigate(['/clients/' + this.clientId + '/counselings/' + this.counselingId]);
    }));
  }

  ngOnDestroy(): void {
    if (this.subscription$) {
      this.subscription$.forEach((s) => {
        s.unsubscribe();
      });
    }
  }

}
