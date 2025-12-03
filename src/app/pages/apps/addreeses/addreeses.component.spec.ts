import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddreesesComponent } from './addreeses.component';

describe('AddreesesComponent', () => {
  let component: AddreesesComponent;
  let fixture: ComponentFixture<AddreesesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddreesesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddreesesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
