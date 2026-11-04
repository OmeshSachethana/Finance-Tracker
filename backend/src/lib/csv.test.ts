import { csvEscape, toCsv } from './csv.ts';

describe('csvEscape', () => {
  it('leaves simple values alone', () => {
    expect(csvEscape('Coffee')).toBe('Coffee');
    expect(csvEscape(12.5)).toBe('12.5');
  });

  it('quotes values with commas and quotes', () => {
    expect(csvEscape('Rent, May')).toBe('"Rent, May"');
    expect(csvEscape('Say "hi"')).toBe('"Say ""hi"""');
  });

  it('neutralizes spreadsheet formulas', () => {
    expect(csvEscape('=SUM(A1)')).toBe("'=SUM(A1)");
  });
});

describe('toCsv', () => {
  it('joins header and rows', () => {
    expect(toCsv(['a', 'b'], [[1, 'x']])).toBe('a,b\n1,x');
  });
});
