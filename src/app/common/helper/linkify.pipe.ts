import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Pipe({
  name: 'linkify',
  standalone: true
})
export class LinkifyPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string, options?: { maxLength?: number; showProtocol?: boolean }): SafeHtml {
    if (!text) { return ''; }

    const maxLength = options?.maxLength || 40;
    const showProtocol = options?.showProtocol !== false;

    // Enhanced URL regex that handles more cases
    const urlRegex = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;

    // Replace URLs with anchor tags
    const linkedText = text.replace(urlRegex, (url) => {
      const displayUrl = this.shortenUrl(url, maxLength, showProtocol);
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" title="${url}">${displayUrl}</a>`;
    });

    return this.sanitizer.sanitize(1, linkedText) || '';
  }

  private shortenUrl(url: string, maxLength: number, showProtocol: boolean): string {
    try {
      const urlObj = new URL(url);
      let displayUrl = showProtocol ? urlObj.host + urlObj.pathname : urlObj.host + urlObj.pathname;

      // Remove trailing slash
      displayUrl = displayUrl.replace(/\/$/, '');

      if (displayUrl.length <= maxLength) {
        return displayUrl;
      }

      // Keep the domain and shorten the path
      const domain = urlObj.host;
      const path = urlObj.pathname;

      if (domain.length >= maxLength - 3) {
        return domain.substring(0, maxLength - 3) + '...';
      }

      const remainingLength = maxLength - domain.length - 3; // -3 for "..."
      const shortenedPath = path.substring(0, remainingLength);

      return `${domain}${shortenedPath}...`;
    } catch (e) {
      // Fallback if URL parsing fails
      return url.length > maxLength
        ? url.substring(0, maxLength - 3) + '...'
        : url;
    }
  }

}
