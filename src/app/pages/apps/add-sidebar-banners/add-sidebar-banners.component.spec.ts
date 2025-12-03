import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSidebarBannersComponent } from './add-sidebar-banners.component';

describe('AddSidebarBannersComponent', () => {
  let component: AddSidebarBannersComponent;
  let fixture: ComponentFixture<AddSidebarBannersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSidebarBannersComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddSidebarBannersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
