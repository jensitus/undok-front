import {Component, computed, DestroyRef, effect, inject} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {ActivatedRoute} from '@angular/router';
import {CounselingComponent} from '../counseling/counseling.component';
import {SidebarService} from '../../admin-template/shared/services/sidebar.service';

@Component({
  selector: 'app-show-counseling',
  standalone: true,
  templateUrl: './show-counseling.component.html',
  imports: [
    CounselingComponent
  ],
  styleUrls: ['./show-counseling.component.css']
})
export class ShowCounselingComponent {

  private activatedRoute = inject(ActivatedRoute);
  private sidebarService = inject(SidebarService);
  private destroyRef = inject(DestroyRef);

  private params = toSignal(this.activatedRoute.params);
  clientId = computed(() => this.params()?.['client_id'] as string);
  counselingId = computed(() => this.params()?.['counseling_id'] as string);

  constructor() {
    effect(() => {
      const id = this.clientId();
      this.sidebarService.setClientIdForCreateCounseling(id);
    });

    this.destroyRef.onDestroy(() => {
      this.sidebarService.setClientIdForCreateCounseling(null);
    });
  }

}
