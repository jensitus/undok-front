import { Component, input, output, computed, inject, signal, effect, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CounselingService } from '../service/counseling.service';
import { CommonService } from '../../common/services/common.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-comment',
  standalone: true,
  templateUrl: './create-comment.component.html',
  imports: [FormsModule],
  styleUrls: ['./create-comment.component.css']
})
export class CreateCommentComponent {
  // Services using inject()
  private readonly counselingService = inject(CounselingService);
  private readonly commonService = inject(CommonService);

  // Signal-based inputs
  readonly clientId = input.required<string>();
  readonly initialComment = input<string>('', { alias: 'comment' });
  readonly delete = input<boolean>(false);

  // Signal-based output
  readonly commentSaved = output<boolean>();

  // Internal state as signal - ensure it's never null
  readonly comment = signal<string>('');

  // Computed signal for comment length - with null safety
  readonly commentLength = computed(() => {
    const commentText = this.comment();
    return commentText ? commentText.length : 0;
  });

  // Loading state
  readonly isSubmitting = signal<boolean>(false);

  // Injector for takeUntilDestroyed outside constructor
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Initialize comment from input when it changes
    effect(() => {
      const initial = this.initialComment();
      // Ensure we never set null or undefined
      this.comment.set(initial || '');
    });
  }

  onSubmit(): void {
    const clientId = this.clientId();
    const commentText = this.comment();

    if (this.isSubmitting()) {
      return; // Prevent double submission
    }

    this.isSubmitting.set(true);

    this.counselingService
        .createUpdateComment(clientId, commentText)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.commentSaved.emit(true);
            this.isSubmitting.set(false);
          },
          error: (err) => {
            console.error('Failed to save comment:', err);
            this.isSubmitting.set(false);
          }
        });
  }

  deleteComment(): void {
    const clientId = this.clientId();

    if (this.isSubmitting()) {
      return; // Prevent double deletion
    }

    this.isSubmitting.set(true);
    // Set to empty string instead of 'null'
    this.comment.set('');

    this.counselingService
        .createUpdateComment(clientId, 'null')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.commonService.setReload(true);
            this.isSubmitting.set(false);
          },
          error: (err) => {
            console.error('Failed to delete comment:', err);
            this.isSubmitting.set(false);
          }
        });
  }
}
