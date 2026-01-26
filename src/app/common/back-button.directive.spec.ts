import { BackButtonDirective } from './back-button.directive';
import { NavService } from './nav.service';

describe('BackButtonDirective', () => {
  it('should create an instance', () => {
    const navServiceMock = jasmine.createSpyObj('NavService', ['back']);
    const directive = new BackButtonDirective(navServiceMock);
    expect(directive).toBeTruthy();
  });
});
