import {inject, Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {

  private sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined, searchTerm: string): SafeHtml {
    if (!value) {
      return '';
    }

    if (!searchTerm || searchTerm.trim() === '') {
      return value;
    }

    // Split search term by spaces to highlight individual words
    const terms = searchTerm.trim().split(/\s+/);

    let highlighted = value;

    // Highlight each search term
    terms.forEach(term => {
      if (term.length > 0) {
        // Case-insensitive replacement with highlight
        const regex = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');
        highlighted = highlighted.replace(regex, '<mark class="search-highlight">$1</mark>');
      }
    });

    return this.sanitizer.sanitize(1, highlighted) || highlighted;
  }

  private escapeRegExp(text: string): string {
    // Escape special regex characters
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

}
