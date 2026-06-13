import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciarAdmins } from './gerenciar-admins';

describe('GerenciarAdmins', () => {
  let component: GerenciarAdmins;
  let fixture: ComponentFixture<GerenciarAdmins>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GerenciarAdmins],
    }).compileComponents();

    fixture = TestBed.createComponent(GerenciarAdmins);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
