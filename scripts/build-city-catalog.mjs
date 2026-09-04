import { mkdir, writeFile } from 'node:fs/promises';
import countryData from 'world-countries';
import cityTimezoneData from 'city-timezones';
import { getCountry } from 'countries-and-timezones';
import capitalData from 'country-json/src/country-by-capital-city.json' with { type: 'json' };

const normalize = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
const capitalsByCountry = new Map(capitalData.map((entry) => [entry.country, entry.city]));
const cities = new Map();
const { cityMapping } = cityTimezoneData;

for (const city of cityMapping) {
  if (!city.timezone || city.pop < 500000) continue;
  const key = `${city.iso2}:${normalize(city.city)}:${city.timezone}`;
  cities.set(key, { city: city.city, country: city.country, countryCode: city.iso2, zone: city.timezone, population: city.pop, major: true, capital: false });
}

for (const country of countryData) {
  if (!(country.unMember || country.cca2 === 'VA' || country.cca2 === 'PS')) continue;
  const cityName = capitalsByCountry.get(country.name.common) || country.capital?.[0];
  if (!cityName) continue;
  const match = cityMapping.find((city) => city.iso2 === country.cca2 && normalize(city.city_ascii) === normalize(cityName));
  const zone = match?.timezone || getCountry(country.cca2)?.timezones?.[0];
  if (!zone) continue;
  const key = `${country.cca2}:${normalize(cityName)}:${zone}`;
  cities.set(key, { city: cityName, country: country.name.common, countryCode: country.cca2, zone, population: match?.pop || 0, major: true, capital: true });
}

await mkdir('src/data', { recursive: true });
await writeFile('src/data/cities.json', `${JSON.stringify([...cities.values()].sort((a, b) => a.country.localeCompare(b.country) || a.city.localeCompare(b.city)), null, 2)}\n`);