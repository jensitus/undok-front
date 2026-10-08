import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StatComponent } from './stat.component';

import {defaultTestProviders} from '../../../../testing/test-providers';

import {faUser} from '@fortawesome/free-solid-svg-icons';
describe('StatComponent', () => {
    let component: StatComponent;
    let fixture: ComponentFixture<StatComponent>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
    imports: [StatComponent],
      providers: [...defaultTestProviders()]
}).compileComponents();
        })
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(StatComponent);
        component = fixture.componentInstance;
        fixture.componentRef.setInput('icon', faUser);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
