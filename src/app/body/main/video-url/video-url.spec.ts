import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoUrl } from './video-url';

describe('VideoUrl', () => {
  let component: VideoUrl;
  let fixture: ComponentFixture<VideoUrl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoUrl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoUrl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
