import { describe, it, expect } from 'vitest';
import { getFromTo } from './pagination';

describe('getFromTo', () => {
  it('calculates range for offset 0 and limit 5', () => {
    expect(getFromTo(0, 5)).toEqual({ from: 0, to: 4 });
  });

  it('calculates range for offset 5 and limit 5', () => {
    expect(getFromTo(5, 5)).toEqual({ from: 5, to: 9 });
  });
});
