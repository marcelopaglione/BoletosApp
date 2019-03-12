import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenovaBoletoComponent } from './renova-boleto.component';

describe('RenovaBoletoComponent', () => {
  let component: RenovaBoletoComponent;
  let fixture: ComponentFixture<RenovaBoletoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenovaBoletoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenovaBoletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
