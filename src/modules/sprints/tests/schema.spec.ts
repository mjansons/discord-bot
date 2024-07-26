import { parseSprintCode, parseTitle } from '../sprints.schema';

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

describe('parseTitle', () => {
  it('should parse a valid title', () => {
    const record = 'Valid Title';
    expect(parseTitle(record)).toEqual(record);
  });

  it('should throw an error for an empty title', () => {
    const record = '';
    expect(() => parseTitle(record)).toThrow(
      'String must contain at least 1 character(s)'
    );
  });

  it('should throw an error for a title that is too long', () => {
    const record = 'a'.repeat(101); // 101 characters long
    expect(() => parseTitle(record)).toThrow(
      'String must contain at most 100 character(s)'
    );
  });

  it('should throw an error for a null title', () => {
    const record = null;
    expect(() => parseTitle(record)).toThrow();
  });
});
