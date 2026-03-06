import { Component, input, output } from '@angular/core';
import { IconDefinition, faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  imports: [RouterLink, FaIconComponent],
  styleUrl: './stat.component.scss'
})
export class StatComponent {
  bgClass = input<string>('');
  icon = input.required<IconDefinition>();
  count = input<number>(0);
  label = input<string>('');
  // data = input<number>(0);
  link = input<string>('');
  event = output<any>();

  faArrowCircleRight = faArrowAltCircleRight;
}
