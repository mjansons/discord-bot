import { parseSprintCode, parseUsername } from '../messages.schema';

describe('parseSprintCode', () => {
  it('should parse a valid sprint code', () => {
    const record = 'WD-1.1';
    expect(parseSprintCode(record)).toEqual(record);
  });

  it('should throw an error for an invalid sprint code format', () => {
    const record = '1-WD-1';
    expect(() => parseSprintCode(record)).toThrow(
      'Invalid sprint code! Format example: WD-1.1'
    );
  });

  it('should throw an error for a missing dash in sprint code', () => {
    const record = 'WD1.1';
    expect(() => parseSprintCode(record)).toThrow(
      'Invalid sprint code! Format example: WD-1.1'
    );
  });

  it('should throw an error for a lowercase sprint code', () => {
    const record = 'wd-1.1';
    expect(() => parseSprintCode(record)).toThrow(
      'Invalid sprint code! Format example: WD-1.1'
    );
  });

  it('should throw an error for non-numeric version in sprint code', () => {
    const record = 'WD-A.B';
    ('');
    expect(() => parseSprintCode(record)).toThrow(
      'Invalid sprint code! Format example: WD-1.1'
    );
  });

  it('should throw an error for missing version in sprint code', () => {
    const record = 'WD-';
    expect(() => parseSprintCode(record)).toThrow(
      'Invalid sprint code! Format example: WD-1.1'
    );
  });
});

describe('parseUsername', () => {
  it('should parse a valid username', () => {
    const record = 'John';
    expect(parseUsername(record)).toEqual(record);
  });

  it('should throw an error for an empty username', () => {
    const record = '';
    expect(() => parseUsername(record)).toThrow();
  });

  it('should throw an error for a username that is too long', () => {
    const record = 'a'.repeat(33); // 33 characters long
    expect(() => parseUsername(record)).toThrow();
  });

  it('should throw an error for a null username', () => {
    const record = null;
    expect(() => parseUsername(record)).toThrow();
  });
});
