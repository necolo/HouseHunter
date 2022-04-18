import { Keyword, Rule } from '../types';

export function filterTitle(title: string, rules: Rule[]) {
  for (let i = 0; i < rules.length; i++) {
    const { includeThenPass, excludes } = rules[i];
    const pass = includeThenPass?.some(word => matches(title, word));
    if (pass) { continue; }

    const fail = excludes?.some(word => matches(title, word));
    if (fail) { return false; }
  }

  return true;
}

function matches(value: string, keyword: Keyword) {
  return new RegExp(keyword).test(value);
}