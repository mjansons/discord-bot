import { parseId, parseMessage } from '../templates.schema';

describe('parseId', () => {
  it('should parse a valid number id', () => {
    const id = 123;
    expect(parseId(id)).toEqual(id);
  });

  it('should coerce a string id to a number', () => {
    const id = '123';
    expect(parseId(id)).toEqual(123);
  });

  it('should throw an error for a non-numeric string', () => {
    const id = 'abc';
    expect(() => parseId(id)).toThrow('Expected number, received nan');
  });
});

describe('parseMessage', () => {
  it('should parse a valid message', () => {
    const message = 'This is a valid message.';
    expect(parseMessage(message)).toEqual(message);
  });

  it('should throw an error for a non-string message', () => {
    const message = 12345;
    expect(() => parseMessage(message)).toThrow(
      'Expected string, received number'
    );
  });
});
