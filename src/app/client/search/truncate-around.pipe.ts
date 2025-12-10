import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncateAround',
  standalone: true
})
export class TruncateAroundPipe implements PipeTransform {

  /**
   * Truncates text around the search term, showing context
   * @param value - The text to truncate
   * @param searchTerm - The term to find and show context around
   * @param maxLength - Maximum length of result (default: 150)
   * @param contextChars - Characters to show before/after match (default: 60)
   */
  transform(
    value: string | null | undefined,
    searchTerm: string,
    maxLength: number = 150,
    contextChars: number = 60
  ): string {

    if (!value) {
      return '';
    }

    // If no search term or text is short enough, return as-is
    if (!searchTerm || searchTerm.trim() === '' || value.length <= maxLength) {
      return value;
    }

    // Find the first occurrence of any search term (case-insensitive)
    const terms = searchTerm.trim().split(/\s+/);
    let firstMatchIndex = -1;
    let matchLength = 0;

    for (const term of terms) {
      if (term.length > 0) {
        const regex = new RegExp(this.escapeRegExp(term), 'i');
        const match = value.match(regex);
        if (match && match.index !== undefined) {
          if (firstMatchIndex === -1 || match.index < firstMatchIndex) {
            firstMatchIndex = match.index;
            matchLength = match[0].length;
          }
        }
      }
    }

    // If no match found, truncate from start
    if (firstMatchIndex === -1) {
      return value.length > maxLength
        ? value.substring(0, maxLength) + '...'
        : value;
    }

    // Calculate start and end positions
    const matchCenter = firstMatchIndex + Math.floor(matchLength / 2);
    let start = Math.max(0, matchCenter - contextChars);
    let end = Math.min(value.length, matchCenter + contextChars);

    // Adjust to word boundaries for better readability
    if (start > 0) {
      const spaceIndex = value.lastIndexOf(' ', start);
      if (spaceIndex > Math.max(0, start - 20)) {
        start = spaceIndex + 1;
      }
    }

    if (end < value.length) {
      const spaceIndex = value.indexOf(' ', end);
      if (spaceIndex !== -1 && spaceIndex < end + 20) {
        end = spaceIndex;
      }
    }

    // Build the result with ellipsis
    let result = '';
    if (start > 0) {
      result += '...';
    }
    result += value.substring(start, end);
    if (end < value.length) {
      result += '...';
    }

    return result;
  }

  private escapeRegExp(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

}
