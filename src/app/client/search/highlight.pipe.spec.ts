import {TestBed} from '@angular/core/testing';

import {HighlightPipe} from './highlight.pipe';

describe('HighlightPipe', () => {
  let pipe: HighlightPipe;

  beforeEach(() => {
    // the pipe injects DomSanitizer, so it has to be built inside an injection context
    pipe = TestBed.runInInjectionContext(() => new HighlightPipe());
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns the value unchanged when there is no search term', () => {
    expect(pipe.transform('Rot-Weiss-Rot', '')).toBe('Rot-Weiss-Rot');
  });

  it('wraps the match in a mark element', () => {
    const result = pipe.transform('Rot-Weiss-Rot', 'Weiss') as any;
    expect(String(result.changingThisBreaksApplicationSecurity ?? result)).toContain('<mark');
  });
});
