import {Directive, HostListener} from '@angular/core';
import {NavService} from './nav.service';

@Directive({
  selector: '[appBackButton]'
})
export class BackButtonDirective {

  constructor(
    private nav: NavService
  ) { }

  @HostListener('click')
  onClick(): void {
    this.nav.back();
  }

}
