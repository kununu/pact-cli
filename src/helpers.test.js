import {bumpVersion} from './helpers';

describe('version handled correctly', () => {
  test('bump version if on master', () => {
    expect(bumpVersion('1.0.0')).toBe('1.0.1');
  });
});
