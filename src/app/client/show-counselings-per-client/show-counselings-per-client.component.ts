import {ChangeDetectorRef, Component, DestroyRef, effect, inject, Input, OnInit} from '@angular/core';
import {Counseling} from '../model/counseling';
import {ModalDismissReasons, NgbModal} from '@ng-bootstrap/ng-bootstrap';
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
    CreateCommentComponent
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
    this.getCreateCounselingSubject();
    this.getCounselingsByClientId();
  }

  getCounselingDuration(requiredTime: number): string {
    return this.durationService.getCounselingDuration(requiredTime);
  }

  getCreateCounselingSubject() {
    // Use effect to watch for createCounseling signal changes
    effect(() => {
      if (this.commonService.createCounseling()) {
        this.modalService.dismissAll();
      }
    });
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
    if (this.counselingOrder === 'Asc') {
      this.counselingOrder = 'Desc';
    } else if (this.counselingOrder === 'Desc') {
      this.counselingOrder = 'Asc';
    }
    this.getCounselingsByClientId();
  }
}
