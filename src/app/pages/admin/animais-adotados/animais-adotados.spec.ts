import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimaisAdotados } from './animais-adotados';

describe('AnimaisAdotados', () => {
  let component: AnimaisAdotados;
  let fixture: ComponentFixture<AnimaisAdotados>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnimaisAdotados],
    }).compileComponents();

    fixture = TestBed.createComponent(AnimaisAdotados);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
