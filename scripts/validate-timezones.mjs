import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const cities = JSON.parse(await readFile('src/data/cities.json', 'utf8'));
const capitals = cities.filter((city) => city.capital);
const madrid = cities.find((city) => city.city === 'Madrid' && city.countryCode === 'ES');
const barcelona = cities.find((city) => city.city === 'Barcelona' && city.countryCode === 'ES');

assert.equal(capitals.length, 195);
assert.equal(madrid.zone, 'Europe/Madrid');
assert.equal(barcelona.zone, madrid.zone);
assert.equal(new Intl.DateTimeFormat('en-US', { timeZone: madrid.zone, timeZoneName: 'longOffset' }).format(new Date('2026-07-15T12:00:00Z')), '7/15/2026, GMT+02:00');
assert.equal(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Singapore', hour: 'numeric' }).format(new Date('2026-08-24T17:30:00Z')), '1 AM');
console.log(`Validated ${capitals.length} capitals and ${cities.length} city records.`);