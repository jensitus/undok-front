import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {min, Subscription} from 'rxjs';
import {CounselingService} from '../service/counseling.service';
import {Counseling} from '../model/counseling';
import {CommonService} from '../../common/services/common.service';
import {ModalDismissReasons, NgbDateStruct, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CategoryService} from '../service/category.service';
import {CategoryTypes} from '../model/category-types';
import {Router} from '@angular/router';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {DropdownItem} from '../model/dropdown-item';
import {EntityTypes} from '../model/entity-types';
import {JoinCategory} from '../model/join-category';
import {Label} from '../model/label';
import {faBars} from '@fortawesome/free-solid-svg-icons';
import {Time} from '../model/time';
import {DateTimeService} from '../service/date-time.service';

@Component({
  selector: 'app-counseling',
  templateUrl: './counseling.component.html',
  styleUrls: ['./counseling.component.css']
})
export class CounselingComponent implements OnInit, OnDestroy {

  CONCERN_MAX_LENGTH = 4080;
  ACTIVITY_MAX_LENGTH = 4080;
  @Input() counselingId: string;
  @Input() clientId: string;
  private subscription$: Subscription[] = [];
  counseling: Counseling | undefined;
  private closeResult = '';
  loading: boolean;
  editConcern = false;
  editActivity = false;
  editActivityCategory = false;
  editLegalCategory = false;
  joinCategories: JoinCategory[] = [];
  joinCategory: JoinCategory;
  deSelectedItems: DropdownItem[] = [];
  legalCategoryType: CategoryTypes = CategoryTypes.LEGAL;
  activityCategoryType: CategoryTypes = CategoryTypes.ACTIVITY;
  legalLabel: Label = Label.LEGAL;
  activityLabel: Label = Label.ACTIVITY;
  deSelectedCategories: JoinCategory[] = [];
  faBars = faBars;
  time: Time = {hour: 13, minute: 30};
  dateObject: NgbDateStruct;
  counselingDate: string;
  editCounselingDate = false;

  constructor(
    private counselingService: CounselingService,
    private commonService: CommonService,
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private router: Router,
    private alertService: AlertService,
    public dateTimeService: DateTimeService,
  ) {
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
    this.getCounseling();
    this.getReloadSubject();
    this.getDeleteSubject();
  }

  ngOnDestroy(): void {
    this.subscription$.forEach((s) => {
      s.unsubscribe();
    });
  }

  getCounseling() {
    this.subscription$.push(this.counselingService.getCounseling(this.counselingId).subscribe(counseling => {
      this.counseling = counseling;
      this.subscription$.push(this.categoryService.getCategoriesByTypeAndEntity(
        CategoryTypes.LEGAL, this.counselingId
      ).subscribe(categories => {
        this.counseling.legalCategory = categories;
      }));
      this.subscription$.push(this.categoryService.getCategoriesByTypeAndEntity(
        CategoryTypes.ACTIVITY, this.counselingId
      ).subscribe(categories => {
        this.counseling.activityCategories = categories;
      }));
      this.setDateObject();
    }, error => {
      this.router.navigate(['/clients', this.clientId]);
    }));
  }

  openDeleteConfirmationModal(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${CounselingComponent.getDismissReason(reason)}`;
    });
  }

  yes(id: string) {
    this.subscription$.push(this.counselingService.deleteCounseling(id).subscribe(result => {
      this.router.navigate(['/clients', this.clientId]);
      this.modalService.dismissAll();
    }, error => {
      this.alertService.error('sorry, that didn\'t work');
    }));
  }

  no() {
    this.modalService.dismissAll();
  }

  openEditCounseling(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${CounselingComponent.getDismissReason(reason)}`;
    });
  }

  getReloadSubject() {
    this.subscription$.push(this.commonService.reloadSubject.subscribe(result => {
      if (result === true) {
        this.getCounseling();
        this.modalService.dismissAll();
      }
    }));
  }

  getDeleteSubject() {
    this.subscription$.push(this.commonService.deleteSubject.subscribe(result => {
      if (result === true) {
        this.router.navigate(['/clients/', this.counseling.clientId]);
      }
    }));
  }

  addActivityCategory() {
    this.editActivityCategory = !this.editActivityCategory;
  }

  showCategoryValue(event: DropdownItem[], categoryType: CategoryTypes) {
    this.joinCategories = [];
    event.forEach(e => {
      this.joinCategory = {
        categoryId: e.itemId,
        categoryType: categoryType,
        entityId: this.counseling.id,
        entityType: EntityTypes.COUNSELING
      };
      this.joinCategories.push(this.joinCategory);
    });
  }

  showDeSelected(event: DropdownItem[]) {
    console.log('event', event);
    this.deSelectedItems = event;
    console.log('deselectedItems', this.deSelectedItems);
  }

  saveCategories(categoryType: CategoryTypes) {
    this.deSelectedItems.forEach((deSelected) => {
      const deselect: JoinCategory = {
        entityType: 'COUNSELING',
        entityId: this.counseling.id,
        categoryType: categoryType,
        categoryId: deSelected.itemId
      };
      this.deSelectedCategories.push(deselect);
    });
    console.log(this.deSelectedCategories);
    this.subscription$.push(this.categoryService.deleteJoinCategories(this.deSelectedCategories).subscribe(res => {
    }));
    console.log('joinCategories', this.joinCategories);
    this.subscription$.push(this.categoryService.addJoinCategories(this.joinCategories).subscribe(join => {
      this.commonService.setReloadSubject(true);
    }));
    switch (categoryType) {
      case CategoryTypes.ACTIVITY:
        this.addActivityCategory();
        break;
      case CategoryTypes.LEGAL:
        this.addLegalCategory();
        break;
    }
  }

  addLegalCategory() {
    this.editLegalCategory = !this.editLegalCategory;
  }

  update(type: string) {
    this.loading = true;
    if (this.dateObject) {
      console.log('DATE OBJECT UPDATE', this.dateObject);
      this.counselingDate = this.dateTimeService.mergeDateAndTime(this.dateObject, this.time);
      this.counseling.counselingDate = this.counselingDate;
    }
    console.log('counselingDate', this.counselingDate);
    this.subscription$.push(this.counselingService.updateCounseling(this.counseling.id, this.counseling).subscribe(res => {
      this.getCounseling();
    }));
    this.editCounselingDate = false;
    this.editActivity = false;
    this.editConcern = false;
    this.editActivityCategory = false;
    this.editLegalCategory = false;
    this.loading = false;
  }

  chooseEditConcern() {
    this.editConcern = !this.editConcern;
  }

  chooseEditActivity() {
    this.editActivity = !this.editActivity;
  }

  chooseEditCounselingDate() {
    this.editCounselingDate = !this.editCounselingDate;
  }

  setDateObject() {
    if (this.counseling) {
      console.log('set Date Object', this.counseling.counselingDate);
      const strings = this.counseling.counselingDate.split('T');
      this.dateObject = new class implements NgbDateStruct {
        day: number;
        month: number;
        year: number;
      };
      this.dateObject.day = Number.parseInt(strings[0].split('-')[2], 10);
      this.dateObject.month = Number.parseInt(strings[0].split('-')[1], 10);
      this.dateObject.year = Number.parseInt(strings[0].split('-')[0], 10);
      const hour = Number.parseInt(strings[1].split(':')[0], 10);
      const minute = Number.parseInt(strings[1].split(':')[1], 10);
      console.log('hour', hour);
      console.log('minute', minute);
      this.time = {
        hour: hour,
        minute: minute
      };
      console.log(this.dateObject);
      console.log(this.time);
    }
  }

}
