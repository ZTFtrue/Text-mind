import { TestBed } from '@angular/core/testing';

import { SvgConfig } from './svg-config';

describe('SvgConfig', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const svgConfig: SvgConfig = TestBed.get(SvgConfig);
    expect(svgConfig).toBeTruthy();
  });
});
