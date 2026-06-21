import {inject, Pipe, PipeTransform} from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true
})
export class HighlightPipe implements PipeTransform {

  private sanitizer = inject(DomSanitizer);

  transform(value: string | null | undefined, searchTerm: string): SafeHtml {
    if (!value) return '';
    if (!searchTerm || searchTerm.trim() === '') return value;

    const terms = this.parseTerms(searchTerm);
    let highlighted = value;

    terms.forEach(term => {
      if (term.length > 0) {
        const regex = new RegExp(`(${this.escapeRegExp(term)})`, 'gi');
        highlighted = highlighted.replace(regex, '<mark class="search-highlight">$1</mark>');
      }
    });

    return this.sanitizer.sanitize(1, highlighted) || highlighted;
  }

  /**
   * Mirrors the backend prepareSearchTerm logic:
   * - Quoted strings (e.g. "foo bar") → single phrase token, quotes stripped
   * - Unquoted words → each word is a separate token
   */
  private parseTerms(searchTerm: string): string[] {
    const tokens: string[] = [];
    const regex = /"([^"]+)"|(\S+)/g;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(searchTerm)) !== null) {
      // match[1] = content inside quotes, match[2] = unquoted word
      tokens.push(match[1] ?? match[2]);
    }

    return tokens;
  }

  private escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
