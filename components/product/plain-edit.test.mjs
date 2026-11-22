import test from 'node:test';
import assert from 'node:assert/strict';
import {plainEdit} from './plain-edit.ts';
test('simplifies phrases while retaining names, numbers, punctuation and capitalization', () => {
  assert.equal(plainEdit('Mira utilized 17 reports in order to help Ravi.'),'Mira used 17 reports to help Ravi.');
  assert.equal(plainEdit('Due to the fact that WE UTILIZE data.'),'Because WE USE data.');
});
test('leaves unmatched wording and partial words unchanged', () => {
  const text='Mira delivered 17 reports. The underutilized shelf remained.';
  assert.equal(plainEdit(text), text);
});
