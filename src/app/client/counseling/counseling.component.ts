import {Component, computed, DestroyRef, effect, inject, input, signal} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {forkJoin} from 'rxjs';
import {CounselingService} from '../service/counseling.service';
import {Counseling} from '../model/counseling';
import {CommonService} from '../../common/services/common.service';
import {ModalDismissReasons, NgbDateStruct, NgbInputDatepicker, NgbModal, NgbTimepicker} from '@ng-bootstrap/ng-bootstrap';
import {CategoryService} from '../service/category.service';
import {CategoryTypes} from '../model/category-types';
import {Router, RouterLink} from '@angular/router';
import {AlertService} from '../../admin-template/layout/components/alert/services/alert.service';
import {DropdownItem} from '../model/dropdown-item';
import {EntityTypes} from '../model/entity-types';
import {JoinCategory} from '../model/join-category';
import {Label} from '../model/label';
import {faBars, faTachometerAlt} from '@fortawesome/free-solid-svg-icons';
import {Time} from '../model/time';
import {DateTimeService} from '../service/date-time.service';
import {DurationService} from '../service/duration.service';
import {PageHeaderComponent} from '../../admin-template/shared/modules/page-header/page-header.component';
import {FormsModule} from '@angular/forms';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {DatePipe} from '@angular/common';
import {MultiSelectBoxComponent} from '../select-box/multi/multi-select-box.component';
import {NewLinePipe} from '../new-line.pipe';
import {CreateCommentComponent} from '../create-comment/create-comment.component';

@Component({
  selector: 'app-counseling',
  standalone: true,
  templateUrl: './counseling.component.html',
  imports: [
    PageHeaderComponent,
    RouterLink,
    FormsModule,
    FaIconComponent,
    NgbInputDatepicker,
    NgbTimepicker,
    MultiSelectBoxComponent,
    NewLinePipe,
    CreateCommentComponent,
    DatePipe
  ],
  styleUrls: ['./counseling.component.css']
})
export class CounselingComponent {
  // Dependency injection using inject()
  private readonly counselingService = inject(CounselingService);
  private readonly commonService = inject(CommonService);
  private readonly modalService = inject(NgbModal);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly alertService = inject(AlertService);
  readonly dateTimeService = inject(DateTimeService);
  private readonly durationService = inject(DurationService);
  private readonly destroyRef = inject(DestroyRef);

  // Signal-based inputs (Angular 21)
  readonly counselingId = input.required<string>();
  readonly clientId = input.required<string>();

  // Signals for reactive state
  readonly counseling = signal<Counseling | undefined>(undefined);
  readonly loading = signal(false);
  readonly editConcern = signal(false);
  readonly editActivity = signal(false);
  readonly editActivityCategory = signal(false);
  readonly editLegalCategory = signal(false);
  readonly editCounselingDate = signal(false);
  readonly editRequiredTime = signal(false);
  readonly counselingDateRequired = signal(false);
  readonly counselingDuration = signal<string>('');
  readonly dateObject = signal<NgbDateStruct | undefined>(undefined);
  readonly time = signal<Time>({hour: 13, minute: 30});

  // Regular properties for non-reactive data
  readonly CONCERN_MAX_LENGTH = 4080;
  readonly ACTIVITY_MAX_LENGTH = 4080;
  private closeResult = '';
  joinCategories: JoinCategory[] = [];
  joinCategory: JoinCategory;
  deSelectedItems: DropdownItem[] = [];
  deSelectedCategories: JoinCategory[] = [];
  counselingDate: string;

  // Constants
  readonly legalCategoryType = CategoryTypes.LEGAL;
  readonly activityCategoryType = CategoryTypes.ACTIVITY;
  readonly legalLabel = Label.LEGAL;
  readonly activityLabel = Label.ACTIVITY;
  readonly faBars = faBars;
  protected readonly faTachometerAlt = faTachometerAlt;

  // Computed values
  readonly concernRemainingChars = computed(() => {
    const c = this.counseling();
    return this.CONCERN_MAX_LENGTH - (c?.concern?.length ?? 0);
  });

  readonly activityRemainingChars = computed(() => {
    const c = this.counseling();
    return this.ACTIVITY_MAX_LENGTH - (c?.activity?.length ?? 0);
  });

  constructor() {
    // Effect to load counseling data when counselingId changes
    effect(() => {
      const id = this.counselingId();
      if (id) {
        this.getCounseling();
      }
    });

    // Effect to watch for reload signal changes
    effect(() => {
      if (this.commonService.reload()) {
        this.getCounseling();
        this.modalService.dismissAll();
      }
    });

    // Effect to watch for delete signal changes
    effect(() => {
      if (this.commonService.delete()) {
        const c = this.counseling();
        if (c) {
          this.router.navigate(['/clients/', c.clientId]);
        }
      }
    });
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

  getCounseling(): void {
    const counselingId = this.counselingId();
    this.counselingService.getCounseling(counselingId).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: (counseling) => {
        // Fetch both category types in parallel
        forkJoin({
          legal: this.categoryService.getCategoriesByTypeAndEntity(CategoryTypes.LEGAL, counselingId),
          activity: this.categoryService.getCategoriesByTypeAndEntity(CategoryTypes.ACTIVITY, counselingId)
        }).pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe({
          next: ({legal, activity}) => {
            counseling.legalCategory = legal;
            counseling.activityCategories = activity;
            this.counseling.set(counseling);
            this.setDateObject();
            this.counselingDuration.set(
              this.durationService.getCounselingsDurationForEditing(counseling.requiredTime)
            );
          }
        });
      },
      error: () => {
        this.router.navigate(['/clients', this.clientId()]);
      }
    });
  }

  openDeleteConfirmationModal(content: any): void {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then(
      (result) => this.closeResult = `Closed with: ${result}`,
      (reason) => this.closeResult = `Dismissed ${CounselingComponent.getDismissReason(reason)}`
    );
  }

  yes(id: string): void {
    this.counselingService.deleteCounseling(id).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.router.navigate(['/clients', this.clientId()]);
        this.modalService.dismissAll();
      },
      error: () => {
        this.alertService.error('sorry, that didn\'t work');
      }
    });
  }

  no(): void {
    this.modalService.dismissAll();
  }

  openEditCounseling(content: any): void {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then(
      (result) => this.closeResult = `Closed with: ${result}`,
      (reason) => this.closeResult = `Dismissed ${CounselingComponent.getDismissReason(reason)}`
    );
  }

  toggleEditActivityCategory(): void {
    this.editActivityCategory.update(v => !v);
  }

  showCategoryValue(event: DropdownItem[], categoryType: CategoryTypes): void {
    const counseling = this.counseling();
    if (!counseling) { return; }

    this.joinCategories = event.map(e => ({
      categoryId: e.itemId,
      categoryType: categoryType,
      entityId: counseling.id,
      entityType: EntityTypes.COUNSELING
    }));
  }

  showDeSelected(event: DropdownItem[]): void {
    this.deSelectedItems = event;
  }

  saveCategories(categoryType: CategoryTypes): void {
    const counseling = this.counseling();
    if (!counseling) { return; }

    this.deSelectedCategories = this.deSelectedItems.map(deSelected => ({
      entityType: 'COUNSELING' as const,
      entityId: counseling.id,
      categoryType: categoryType,
      categoryId: deSelected.itemId
    }));

    // Execute delete and add operations, then fetch updated categories
    forkJoin({
      delete: this.categoryService.deleteJoinCategories(this.deSelectedCategories),
      add: this.categoryService.addJoinCategories(this.joinCategories)
    }).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        // Fetch updated categories and update the counseling signal directly
        this.categoryService.getCategoriesByTypeAndEntity(categoryType, counseling.id).pipe(
          takeUntilDestroyed(this.destroyRef)
        ).subscribe({
          next: (categories) => {
            this.counseling.update(c => {
              if (!c) { return c; }
              if (categoryType === CategoryTypes.LEGAL) {
                return {...c, legalCategory: categories};
              } else if (categoryType === CategoryTypes.ACTIVITY) {
                return {...c, activityCategories: categories};
              }
              return c;
            });
          }
        });

        // Close the edit panel
        if (categoryType === CategoryTypes.ACTIVITY) {
          this.toggleEditActivityCategory();
        } else if (categoryType === CategoryTypes.LEGAL) {
          this.toggleEditLegalCategory();
        }

        // Reset arrays
        this.deSelectedCategories = [];
        this.joinCategories = [];
      }
    });
  }

  toggleEditLegalCategory(): void {
    this.editLegalCategory.update(v => !v);
  }

  update(type: string): void {
    const counseling = this.counseling();
    if (!counseling) { return; }

    this.loading.set(true);
    const dateObj = this.dateObject();
    if (dateObj) {
      this.counselingDate = this.dateTimeService.mergeDateAndTime(dateObj, this.time());
      counseling.counselingDate = this.counselingDate;
    }

    this.counselingService.updateCounseling(counseling.id, counseling).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.getCounseling();
      },
      error: (err) => {
        if (err.status === 428) {
          this.counselingDateRequired.set(true);
        }
      }
    });

    this.editCounselingDate.set(false);
    this.editActivity.set(false);
    this.editConcern.set(false);
    this.editActivityCategory.set(false);
    this.editLegalCategory.set(false);
    this.loading.set(false);
  }

  toggleEditConcern(): void {
    this.editConcern.update(v => !v);
  }

  toggleEditActivity(): void {
    this.editActivity.update(v => !v);
  }

  toggleEditCounselingDate(): void {
    this.editCounselingDate.update(v => !v);
  }

  toggleEditRequiredTime(): void {
    this.editRequiredTime.update(v => !v);
  }

  saveRequiredTime(): void {
    const duration = this.counselingDuration();
    const hours = parseInt(duration.split(':')[0], 10);
    const minutes = parseInt(duration.split(':')[1], 10);
    const totalMinutes = hours * 60 + minutes;

    this.counselingService.setCounselingDuration(this.counselingId(), totalMinutes).pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.toggleEditRequiredTime();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  private setDateObject(): void {
    const counseling = this.counseling();
    if (counseling?.counselingDate) {
      const [datePart, timePart] = counseling.counselingDate.split('T');
      const [year, month, day] = datePart.split('-').map(s => Number.parseInt(s, 10));
      const [hour, minute] = timePart.split(':').map(s => Number.parseInt(s, 10));

      this.dateObject.set({year, month, day});
      this.time.set({hour, minute});
    }
  }

  closeCommentModal(): void {
    this.getCounseling();
    this.modalService.dismissAll();
  }

  // Helper method for template two-way binding with signals
  updateCounselingConcern(value: string): void {
    this.counseling.update(c => c ? {...c, concern: value} : c);
  }

  updateCounselingActivity(value: string): void {
    this.counseling.update(c => c ? {...c, activity: value} : c);
  }

  updateDateObject(value: NgbDateStruct): void {
    this.dateObject.set(value);
  }

  updateTime(value: Time): void {
    this.time.set(value);
  }

  updateTimeHour(hour: number): void {
    this.time.update(t => ({...t, hour}));
  }

  updateTimeMinute(minute: number): void {
    this.time.update(t => ({...t, minute}));
  }

  updateCounselingDuration(value: string): void {
    this.counselingDuration.set(value);
  }
}
