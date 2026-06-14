import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarPet } from './listar-pet';

describe('ListarPet', () => {
  let component: ListarPet;
  let fixture: ComponentFixture<ListarPet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListarPet],
    }).compileComponents();

    fixture = TestBed.createComponent(ListarPet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
