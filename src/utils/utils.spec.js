import Utils from './utils';

test('Get data without null, undefined, and empty string', () => {
  const personA = {
    id: '1',
    value: 'carlos',
    figure: undefined,
    empty: '',
    extra: null,
    extra2: 'test',
  };
  const personB = {
    id: '1',
    value: 'carlos',
    extra2: 'test',
  };
  const result1 = JSON.stringify(Utils.getValidData(personA));
  const result2 = JSON.stringify(personB);
  expect(result1).toBe(result2);
});

test('Compare equaltiy properties between two objects.', () => {
  const personA = {
    id: '1',
    value: 'carlos',
  };
  const personB = {
    id: '1',
    value: 'carlos',
  };
  expect(Utils.compare(personA, personB)).toBe(true);
});

test('The object are not equals.', () => {
  const personA = {
    id: '1',
    value: 'carlos',
  };
  const personB = {
    id: '1',
    value: 'carlos',
    extra: 'extradata',
  };
  expect(Utils.compare(personA, personB)).toBe(false);
});
