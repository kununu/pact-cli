import {bumpVersion} from './helpers';

describe('version handled correctly', () => {
  test('bump version if no branch given', () => {
    expect(bumpVersion('1.0.0')).toBe('1.0.1');
  });

  test('bump minor version if master is given', () => {
    expect(bumpVersion('1.0.0', 'master')).toBe('1.1.0');
  });

  test('bump to rc version if feature branch and verions given', () => {
    expect(bumpVersion('1.0.0', 'feature')).toBe('1.1.0-rc.0');
  });

  test('bump to rc version if feature branch and rc-verions given', () => {
    expect(bumpVersion('1.0.1-rc.1', 'feature')).toBe('1.0.1-rc.2');
  });
});
