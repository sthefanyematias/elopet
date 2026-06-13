import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CadastrarPet } from './cadastrar-pet';

describe('CadastrarPet', () => {
  let component: CadastrarPet;
  let fixture: ComponentFixture<CadastrarPet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CadastrarPet],
    }).compileComponents();

    fixture = TestBed.createComponent(CadastrarPet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
