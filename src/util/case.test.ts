import { toCamelCase, toSnakeCase } from './case';

describe('case', () => {
  it('should convert to camel case', async function() {
    const input = {
      some_thing: {
        another_thing: 0,
      },
      some_string: 'some_string',
      an_array: [0, 1, 2],
      the_null: null as any,
      the_undefined: undefined as any,
    };
    const expected = {
      someThing: {
        anotherThing: 0,
      },
      someString: 'some_string',
      anArray: [0, 1, 2],
      theNull: null as any,
      theUndefined: undefined as any,
    };
    const actual = toCamelCase(input);
    expect(actual).toEqual(expected);
  });

  it('should convert to snake case', async function() {
    const input = {
      someThing: {
        anotherThing: 0,
      },
      someString: 'someString',
      anArray: [0, 1, 2],
      theNull: null as any,
      theUndefined: undefined as any,
    };
    const expected = {
      some_thing: {
        another_thing: 0,
      },
      some_string: 'someString',
      an_array: [0, 1, 2],
      the_null: null as any,
      the_undefined: undefined as any,
    };
    const actual = toSnakeCase(input);
    expect(actual).toEqual(expected);
  });
});
