import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcluirPet } from './excluir-pet';

describe('ExcluirPet', () => {
  let component: ExcluirPet;
  let fixture: ComponentFixture<ExcluirPet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExcluirPet],
    }).compileComponents();

    fixture = TestBed.createComponent(ExcluirPet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
