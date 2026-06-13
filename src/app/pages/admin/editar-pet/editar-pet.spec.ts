import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPet } from './editar-pet';

describe('EditarPet', () => {
  let component: EditarPet;
  let fixture: ComponentFixture<EditarPet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarPet],
    }).compileComponents();

    fixture = TestBed.createComponent(EditarPet);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
