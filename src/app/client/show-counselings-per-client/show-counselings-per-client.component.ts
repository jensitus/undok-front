import {ChangeDetectorRef, Component, DestroyRef, effect, inject, Input, OnInit} from '@angular/core';
import {Counseling} from '../model/counseling';
import {ModalDismissReasons, NgbCollapse, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CommonService} from '../../common/services/common.service';
import {CounselingService} from '../service/counseling.service';
import {DurationService} from '../service/duration.service';
import {CategoryTypes} from '../model/category-types';
import {CategoryService} from '../service/category.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {CommonModule} from '@angular/common';
import {RouterLink} from '@angular/router';
import {LinkifyPipe} from '../../common/helper/linkify.pipe';
import {NewLinePipe} from '../new-line.pipe';
import {CreateCommentComponent} from '../create-comment/create-comment.component';
import {FaIconComponent} from '@fortawesome/angular-fontawesome';
import {
  faCalendarAlt,
  faChevronDown,
  faChevronUp,
  faClock,
  faComment,
  faComments,
  faExternalLinkAlt,
  faGavel,
  faSort,
  faTag,
  faTasks,
  faUser
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-show-counselings-per-client',
  standalone: true,
  templateUrl: './show-counselings-per-client.component.html',
  styleUrls: ['./show-counselings-per-client.component.css'],
  imports: [
    CommonModule,
    RouterLink,
    LinkifyPipe,
    NewLinePipe,
    CreateCommentComponent,
    FaIconComponent,
    NgbCollapse,
  ]
})
export class ShowCounselingsPerClientComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private modalService = inject(NgbModal);
  private counselingService = inject(CounselingService);
  private commonService = inject(CommonService);
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);
  public durationService = inject(DurationService);

  counselings: Counseling[] = [];
  @Input() clientId: string;
  private closeResult = '';
  protected counselingOrder = 'Asc';

  // Collapse state: IDs in this set are expanded
  private expandedIds = new Set<string>();

  // Icons
  protected readonly faCalendarAlt = faCalendarAlt;
  protected readonly faComments = faComments;
  protected readonly faGavel = faGavel;
  protected readonly faTasks = faTasks;
  protected readonly faTag = faTag;
  protected readonly faClock = faClock;
  protected readonly faUser = faUser;
  protected readonly faComment = faComment;
  protected readonly faExternalLinkAlt = faExternalLinkAlt;
  protected readonly faSort = faSort;
  protected readonly faChevronDown = faChevronDown;
  protected readonly faChevronUp = faChevronUp;

  constructor() {
    effect(() => {
      if (this.commonService.createCounseling()) {
        this.modalService.dismissAll();
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

  ngOnInit(): void {
    this.getCounselingsByClientId();
  }

  isCollapsed(id: string): boolean {
    return !this.expandedIds.has(id);
  }

  toggleCollapsed(id: string): void {
    if (this.expandedIds.has(id)) {
      this.expandedIds.delete(id);
    } else {
      this.expandedIds.add(id);
    }
  }

  getCounselingDuration(requiredTime: number): string {
    return this.durationService.getCounselingDuration(requiredTime);
  }

  openEditCounseling(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${ShowCounselingsPerClientComponent.getDismissReason(reason)}`;
    });
  }

  yes(id: string) {
    this.counselingService.deleteCounseling(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.commonService.setCreateCounseling(true);
          },
          error: (err) => {
            console.error('Error deleting counseling:', err);
          }
        });
  }

  no() {
    this.modalService.dismissAll();
  }

  closeCommentModal() {
    this.getCounselingsByClientId();
    this.modalService.dismissAll();
  }

  getCounselingsByClientId() {
    this.counselingService.getCounselingsByClientId(this.clientId, this.counselingOrder)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (counselings) => {
            this.counselings = counselings;
            counselings.forEach(c => this.expandedIds.add(c.id));
            this.getCategories();
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading counselings:', err);
          }
        });
  }

  getCategories() {
    this.counselings.forEach((c) => {
      this.categoryService.getCategoriesByTypeAndEntity(CategoryTypes.LEGAL, c.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (categories) => {
              c.legalCategory = categories;
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error loading legal categories:', err);
            }
          });

      this.categoryService.getCategoriesByTypeAndEntity(CategoryTypes.ACTIVITY, c.id)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: (categories) => {
              c.activityCategories = categories;
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error loading activity categories:', err);
            }
          });
    });
  }

  changeCounselingOrder() {
    this.counselingOrder = this.counselingOrder === 'Asc' ? 'Desc' : 'Asc';
    this.getCounselingsByClientId();
  }
}
