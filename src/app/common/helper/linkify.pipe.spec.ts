import { LinkifyPipe } from './linkify.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('LinkifyPipe', () => {
  it('create an instance', () => {
    const sanitizerMock = jasmine.createSpyObj('DomSanitizer', ['sanitize']);
    const pipe = new LinkifyPipe(sanitizerMock);
    expect(pipe).toBeTruthy();
  });
});
