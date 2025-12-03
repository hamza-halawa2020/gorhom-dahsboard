import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainSlidersComponent } from './main-sliders.component';

describe('MainSlidersComponent', () => {
  let component: MainSlidersComponent;
  let fixture: ComponentFixture<MainSlidersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainSlidersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainSlidersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
