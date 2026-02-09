import { Component, computed, input } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { RouterLink } from '@angular/router';

interface BreadcrumbItem {
  label: string;
  icon?: IconDefinition;
  link: string;
}

@Component({
  selector: 'app-page-header',
  imports: [RouterLink],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  firstPoint = input.required<string>();
  firstIcon = input<IconDefinition>();
  firstLink = input<string>('');

  secondPoint = input<string>('');
  secondIcon = input<IconDefinition>();
  secondLink = input<string>('');

  thirdPoint = input<string>('');
  thirdIcon = input<IconDefinition>();
  thirdLink = input<string>('');

  fourthPoint = input<string>('');
  fourthIcon = input<string>('');
  fourthLink = input<string>('');

  endPoint = input.required<string>();
  endPointIcon = input<IconDefinition>();

  heading = input<string>('');
  icon = input<string>('');

  breadcrumbs = computed<BreadcrumbItem[]>(() => {
    const items: BreadcrumbItem[] = [];

    if (this.firstLink()) {
      items.push({ label: this.firstPoint(), icon: this.firstIcon(), link: this.firstLink() });
    }
    if (this.secondLink()) {
      items.push({ label: this.secondPoint(), icon: this.secondIcon(), link: this.secondLink() });
    }
    if (this.thirdLink()) {
      items.push({ label: this.thirdPoint(), icon: this.thirdIcon(), link: this.thirdLink() });
    }

    return items;
  });
}
