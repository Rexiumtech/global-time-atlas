"use client";

import { useEffect, useRef, useState } from "react";
import { CalendarClock } from "lucide-react";
import cityCatalog from "@/data/cities.json";

type CityRecord = {
  city: string;
  country: string;
  countryCode: string;
  zone: string;
  population: number;
  major: boolean;
  capital: boolean;
};

type PickerCity = Pick<CityRecord, "city" | "country" | "countryCode" | "zone">;

type Language = "en" | "es";

type Copy = {
  language: string;
  heroEyebrow: string;
  heroHeading: string;
  heroHeadingAccent: string;
  date: string;
  time: string;
  starting: string;
  helper: string;
  showIn: string;
  search: string;
  noCities: string;
  sameDate: string;
  differentDate: string;
  compare: string;
  kicker: string;
  heading: string;
  citiesKicker: string;
  citiesHeading: string;
  majorKicker: string;
  majorHeading: string;
  citySearch: string;
  cityPlaceholder: string;
  capitals: string;
  capitalsHeading: string;
  capitalSearch: string;
  capitalPlaceholder: string;
  cities: string;
  capitalsWord: string;
  capitalCount: string;
  liveTime: string;
  browserClock: string;
  heroCopy: string;
  coordinated: string;
  population: string;
  copyLink: string;
  copied: string;
};

type SavedState = {
  language?: string;
  date?: string;
  time?: string;
  zone?: string;
  city?: string;
  targets?: string[];
  targetCities?: string[];
} | null;

const catalog = cityCatalog as CityRecord[];

const zones = [
  { city: "San Francisco", country: "United States", zone: "America/Los_Angeles", code: "PST", region: "West coast", color: "#f47f63" },
  { city: "New York", country: "United States", zone: "America/New_York", code: "EST", region: "East coast", color: "#edb84a" },
  { city: "London", country: "United Kingdom", zone: "Europe/London", code: "GMT", region: "Europe", color: "#8fc9a8" },
  { city: "Nairobi", country: "Kenya", zone: "Africa/Nairobi", code: "EAT", region: "East Africa", color: "#81b8d8" },
  { city: "San José", country: "Costa Rica", zone: "America/Costa_Rica", code: "CST", region: "Central America", color: "#d99567" },
  { city: "Madrid", country: "Spain", zone: "Europe/Madrid", code: "CET/CEST", region: "Europe", color: "#e2a45f" },
  { city: "Barcelona", country: "Spain", zone: "Europe/Madrid", code: "CET/CEST", region: "Europe", color: "#d47f5f" },
  { city: "Bangalore", country: "India", zone: "Asia/Calcutta", code: "IST", region: "South Asia", color: "#a8c98d" },
  { city: "Tokyo", country: "Japan", zone: "Asia/Tokyo", code: "JST", region: "East Asia", color: "#c3a1d9" },
  { city: "Sydney", country: "Australia", zone: "Australia/Sydney", code: "AEDT", region: "Oceania", color: "#e69a9b" },
];

const cityOptions: PickerCity[] = [
  { city: "UTC", country: "Universal time", countryCode: "UTC", zone: "UTC" },
  ...catalog,
].filter(
  (city, index, all) =>
    all.findIndex(
      (candidate) =>
        candidate.city === city.city &&
        candidate.countryCode === city.countryCode &&
        candidate.zone === city.zone
    ) === index
);

const zoneDisplayNames: Record<string, string> = {
  "Asia/Calcutta": "Bangalore",
};

const zoneAliases: Record<string, string> = {
  "Asia/Calcutta": "Bangalore Bengaluru Kolkata India",
  "Europe/Madrid": "Madrid Barcelona Spain Catalonia",
  "Australia/Sydney": "Sydney Australia",
};

const majorCities = catalog.filter((city) => city.major);
const capitals = catalog.filter((city) => city.capital);

const copy: Record<Language, Copy> = {
  en: {
    language: "ES",
    heroEyebrow: "Timezone to timezone",
    heroHeading: "Know the",
    heroHeadingAccent: "local time.",
    date: "Date",
    time: "Time",
    starting: "Starting timezone/city",
    helper: "Enter a date and time, then choose where that time starts. The same moment is converted into each destination below.",
    showIn: "Show in",
    search: "Search a city or region",
    noCities: "No cities found",
    sameDate: "same date",
    differentDate: "different date",
    compare: "Compare regions side by side",
    kicker: "ONE MOMENT, THREE VIEWS",
    heading: "See the same moment everywhere.",
    citiesKicker: "A QUICK REFERENCE",
    citiesHeading: "Around the world, right now.",
    majorKicker: "MAJOR CITIES",
    majorHeading: "One world, many local clocks.",
    citySearch: "Search cities, countries, or timezones",
    cityPlaceholder: "Try Barcelona, India, or Europe/Madrid",
    capitals: "CAPITALS FIRST",
    capitalsHeading: "National capitals, mapped to time.",
    capitalSearch: "Search capitals, countries, or ISO zones",
    capitalPlaceholder: "Try Madrid, India, or Europe/Madrid",
    cities: "cities",
    capitalsWord: "capitals",
    capitalCount: "capitals",
    liveTime: "Live universal time",
    browserClock: "Uses your browser clock",
    heroCopy: "Translate any moment from one timezone to another, anywhere on earth.",
    coordinated: "Coordinated Universal Time",
    population: "population 500k+",
    copyLink: "Copy link",
    copied: "Copied",
  },
  es: {
    language: "EN",
    heroEyebrow: "De zona horaria a zona horaria",
    heroHeading: "Conoce la",
    heroHeadingAccent: "hora local.",
    date: "Fecha",
    time: "Hora",
    starting: "Zona horaria/ciudad inicial",
    helper: "Ingresa una fecha y hora, luego elige dónde comienza. El mismo momento se convierte para cada destino abajo.",
    showIn: "Ver en",
    search: "Buscar ciudad o región",
    noCities: "No se encontraron ciudades",
    sameDate: "misma fecha",
    differentDate: "fecha diferente",
    compare: "Comparar regiones lado a lado",
    kicker: "UN MOMENTO, TRES VISTAS",
    heading: "Ve el mismo momento en todas partes.",
    citiesKicker: "REFERENCIA RÁPIDA",
    citiesHeading: "Ahora mismo, alrededor del mundo.",
    majorKicker: "CIUDADES PRINCIPALES",
    majorHeading: "Un mundo, muchos relojes locales.",
    citySearch: "Buscar ciudades, países o zonas horarias",
    cityPlaceholder: "Prueba Barcelona, India o Europe/Madrid",
    capitals: "PRIMERO LAS CAPITALES",
    capitalsHeading: "Capitales nacionales, asignadas a su hora.",
    capitalSearch: "Buscar capitales, países o zonas IANA",
    capitalPlaceholder: "Prueba Madrid, India o Europe/Madrid",
    cities: "ciudades",
    capitalsWord: "capitales",
    capitalCount: "capitales",
    liveTime: "Hora universal en vivo",
    browserClock: "Usa el reloj de tu navegador",
    heroCopy: "Convierte cualquier momento de una zona horaria a otra, en cualquier lugar del mundo.",
    coordinated: "Tiempo Universal Coordinado",
    population: "población de 500 mil+",
    copyLink: "Copiar enlace",
    copied: "Copiado",
  },
};

const zoneLabel = (zone: string) => (zone === "UTC" ? "UTC" : zoneDisplayNames[zone] || zone.split("/").pop()!.replaceAll("_", " "));
const zoneRegion = (zone: string) => (zone === "UTC" ? "Universal time" : zone.split("/").slice(0, -1).join(" / ").replaceAll("_", " "));
const normalizeSearch = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

const formatTime = (date: Date, zone: string, options: Intl.DateTimeFormatOptions = {}) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
    ...options,
  }).format(date);

const formatDate = (date: Date, zone: string, language: Language = "en") =>
  new Intl.DateTimeFormat(language === "es" ? "es-ES" : "en-US", {
    timeZone: zone,
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);

const formatLongDate = (date: Date, zone: string, language: Language = "en") =>
  new Intl.DateTimeFormat(language === "es" ? "es-ES" : "en-US", {
    timeZone: zone,
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

const offsetFor = (date: Date, zone: string) => {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: zone, timeZoneName: "longOffset" }).formatToParts(date);
  const value = parts.find((part) => part.type === "timeZoneName")?.value || "GMT";
  return value.replace("GMT", "UTC").replace(":00", "");
};

const partsFor = (date: Date, zone: string) =>
  Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(date)
      .filter(({ type }) => type !== "literal")
      .map(({ type, value }) => [type, Number(value)])
  ) as Record<string, number>;

const localTimeToUtc = (date: string, time: string, zone: string) => {
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  const desired = Date.UTC(year!, month! - 1, day!, hour!, minute!);
  let instant = new Date(desired);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const actual = partsFor(instant, zone);
    const actualAsUtc = Date.UTC(actual.year!, actual.month! - 1, actual.day!, actual.hour!, actual.minute!);
    instant = new Date(instant.getTime() + desired - actualAsUtc);
  }
  return instant;
};

function ZonePicker({
  label,
  value,
  onChange,
  cityName,
  language,
}: {
  label: string;
  value: string;
  onChange: (city: PickerCity) => void;
  cityName: string;
  language: Language;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<PickerCity | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const currentLabel = cityName || (selectedCity?.zone === value ? selectedCity.city : zoneLabel(value));
  const text = copy[language];
  const normalizedQuery = normalizeSearch(query);
  const filteredCities = cityOptions
    .filter((city) =>
      normalizeSearch(`${city.city} ${city.country} ${city.countryCode} ${city.zone} ${zoneAliases[city.zone] || ""}`).includes(normalizedQuery)
    )
    .sort((a, b) => {
      const aExact = normalizeSearch(a.city) === normalizedQuery;
      const bExact = normalizeSearch(b.city) === normalizedQuery;
      return Number(bExact) - Number(aExact);
    });

  useEffect(() => {
    const closePicker = (event: MouseEvent) => {
      if (!pickerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closePicker);
    return () => document.removeEventListener("mousedown", closePicker);
  }, []);

  const chooseCity = (city: PickerCity) => {
    onChange(city);
    setSelectedCity(city);
    setQuery("");
    setActiveIndex(0);
    setOpen(false);
  };

  return (
    <div className={`zone-picker ${open ? "is-open" : ""}`} ref={pickerRef}>
      <span>{label}</span>
      <button
        type="button"
        className="zone-picker-button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${label} timezone/city`}
      >
        {currentLabel}
        <span className="picker-chevron">⌄</span>
      </button>
      {open && (
        <div className="zone-menu">
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((index) => Math.min(index + 1, filteredCities.length - 1));
              }
              if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((index) => Math.max(index - 1, 0));
              }
              if (event.key === "Enter" && filteredCities[activeIndex]) {
                event.preventDefault();
                chooseCity(filteredCities[activeIndex]);
              }
              if (event.key === "Escape") setOpen(false);
            }}
            placeholder={text.search}
            aria-label={`${text.search} ${label.toLowerCase()}`}
            aria-controls="timezone-city-options"
          />
          <div className="zone-options" id="timezone-city-options" role="listbox" aria-label={text.search}>
            {filteredCities.length ? (
              filteredCities.map((city, cityIndex) => (
                <button
                  type="button"
                  role="option"
                  aria-selected={city.city === currentLabel && city.zone === value}
                  className={`${city.city === currentLabel && city.zone === value ? "selected " : ""}${cityIndex === activeIndex ? "active" : ""}`}
                  key={`${city.countryCode}-${city.city}-${city.zone}-${cityIndex}`}
                  onMouseEnter={() => setActiveIndex(cityIndex)}
                  onClick={() => chooseCity(city)}
                >
                  {city.city}
                  <small>
                    {city.country} · {city.zone}
                  </small>
                </button>
              ))
            ) : (
              <div className="no-results">{text.noCities}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AtlasApp() {
  const [now, setNow] = useState<Date | null>(null);
  const [conversionDate, setConversionDate] = useState("2026-08-24");
  const [conversionTime, setConversionTime] = useState("13:00");
  const [sourceZone, setSourceZone] = useState("UTC");
  const [sourceCity, setSourceCity] = useState("UTC");
  const [language, setLanguage] = useState<Language>("en");
  const [targetZones, setTargetZones] = useState(["America/Costa_Rica", "America/New_York", "Asia/Tokyo"]);
  const [targetCities, setTargetCities] = useState(["Costa Rica", "New York", "Tokyo"]);
  const [cityQuery, setCityQuery] = useState("");
  const [capitalQuery, setCapitalQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("utc-atlas-conversion") || "null") as SavedState;
      const params = new URLSearchParams(window.location.search);
      if (saved) {
        if (saved.language === "es" || saved.language === "en") setLanguage(saved.language);
        if (params.get("date") || saved.date) setConversionDate(params.get("date") || saved.date!);
        if (params.get("time") || saved.time) setConversionTime(params.get("time") || saved.time!);
        if (params.get("from") || saved.zone) setSourceZone(params.get("from") || saved.zone!);
        if (params.get("fromCity") || saved.city) setSourceCity(params.get("fromCity") || saved.city!);
        if (params.get("to")) setTargetZones(params.get("to")!.split(",").filter(Boolean));
        else if (Array.isArray(saved.targets)) setTargetZones(saved.targets);
        if (params.get("cities")) setTargetCities(params.get("cities")!.split(",").filter(Boolean));
        else if (Array.isArray(saved.targetCities)) setTargetCities(saved.targetCities);
      } else if (params.get("date") || params.get("time") || params.get("from") || params.get("to")) {
        if (params.get("date")) setConversionDate(params.get("date")!);
        if (params.get("time")) setConversionTime(params.get("time")!);
        if (params.get("from")) setSourceZone(params.get("from")!);
        if (params.get("to")) setTargetZones(params.get("to")!.split(",").filter(Boolean));
        if (params.get("fromCity")) setSourceCity(params.get("fromCity")!);
        if (params.get("cities")) setTargetCities(params.get("cities")!.split(",").filter(Boolean));
      }
    } catch {
      /* ignore invalid local state */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      "utc-atlas-conversion",
      JSON.stringify({ language, date: conversionDate, time: conversionTime, zone: sourceZone, city: sourceCity, targets: targetZones, targetCities })
    );
  }, [language, conversionDate, conversionTime, sourceZone, sourceCity, targetZones, targetCities, hydrated]);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const visibleMajorCities = majorCities.filter((city) =>
    normalizeSearch(`${city.city} ${city.country} ${city.countryCode} ${city.zone}`).includes(normalizeSearch(cityQuery))
  );
  const visibleCapitals = capitals.filter((capital) =>
    normalizeSearch(`${capital.city} ${capital.country} ${capital.countryCode} ${capital.zone}`).includes(normalizeSearch(capitalQuery))
  );
  const conversionInstant = localTimeToUtc(conversionDate, conversionTime, sourceZone);
  const text = copy[language];
  const copyLink = async () => {
    const params = new URLSearchParams({
      date: conversionDate,
      time: conversionTime,
      from: sourceZone,
      fromCity: sourceCity,
      to: targetZones.join(","),
      cities: targetCities.join(","),
    });
    await navigator.clipboard?.writeText(`${window.location.origin}${window.location.pathname}?${params}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };
  const changeTarget = (index: number, city: PickerCity) => {
    setTargetZones((current) => current.map((item, itemIndex) => (itemIndex === index ? city.zone : item)));
    setTargetCities((current) => current.map((item, itemIndex) => (itemIndex === index ? city.city : item)));
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="wordmark">
          <img src="/logo.svg" alt="" className="wordmark-logo" />
          GLOBAL TIME ATLAS
        </div>
        <div className="topbar-right">
          <button
            type="button"
            className="language-toggle"
            onClick={() => setLanguage((current) => (current === "en" ? "es" : "en"))}
            aria-label={`Switch to ${language === "en" ? "Spanish" : "English"}`}
          >
            {text.language}
          </button>
          <span className="status-dot" /> {text.liveTime} <span className="topbar-divider" /> <span className="topbar-date">{now ? formatDate(now, "UTC", language) : ""}</span>
        </div>
      </header>

      <section className="hero">
        <div className="eyebrow">
          <span className="eyebrow-line" /> {text.heroEyebrow}
        </div>
        <h1>
          {text.heroHeading} <em>{text.heroHeadingAccent}</em>
        </h1>
        <p className="hero-copy">{text.heroCopy}</p>
        <div className="hero-meta">
          <div className="hero-clock">
            {now ? formatTime(now, "UTC") : "—"} <span>UTC</span>
          </div>
          <div className="hero-meta-copy">
            {text.coordinated}
            <br />
            <strong>{now ? formatDate(now, "UTC", language) : ""}</strong>
          </div>
        </div>
      </section>

      <section className="converter-section">
        <div className="section-heading converter-heading">
          <div>
            <span className="section-kicker">{text.kicker}</span>
            <h2>{text.heading}</h2>
          </div>
          <div className="converter-actions">
            <div className="converter-hint">
              <CalendarClock size={15} /> {text.compare}
            </div>
            <button type="button" className="text-button" onClick={copyLink}>
              {copied ? text.copied : text.copyLink}
            </button>
          </div>
        </div>
        <div className="converter-card">
          <div className="converter-inputs">
            <label>
              <span>{text.date}</span>
              <input type="date" value={conversionDate} onChange={(event) => setConversionDate(event.target.value)} />
            </label>
            <label>
              <span>{text.time}</span>
              <input type="time" value={conversionTime} onChange={(event) => setConversionTime(event.target.value)} />
            </label>
            <ZonePicker
              label={text.starting}
              value={sourceZone}
              cityName={sourceCity}
              language={language}
              onChange={(city) => {
                setSourceZone(city.zone);
                setSourceCity(city.city);
              }}
            />
          </div>
          <div className="converter-source-note">
            <span>{text.helper}</span>
          </div>
        </div>
        <div className="comparison-grid">
          {targetZones.map((zone, index) => {
            const target = zones.find((item) => item.zone === zone);
            const localDayDifference =
              new Intl.DateTimeFormat("en-CA", { timeZone: zone, year: "numeric", month: "2-digit", day: "2-digit" }).format(conversionInstant) ===
              conversionDate
                ? "same date"
                : "different date";
            return (
              <article className="comparison-card" key={`${zone}-${index}`} style={{ "--accent": target?.color || "#ea795d", "--delay": `${index * 80}ms` } as React.CSSProperties}>
                <div className="comparison-card-top">
                  <span className="comparison-number">0{index + 1}</span>
                  <ZonePicker label={text.showIn} value={zone} cityName={targetCities[index]} language={language} onChange={(nextCity) => changeTarget(index, nextCity)} />
                </div>
                <div className="comparison-time">{formatTime(conversionInstant, zone, { hour12: true })}</div>
                <div className="comparison-date">{formatLongDate(conversionInstant, zone, language)}</div>
                <div className="comparison-offset">
                  <span>{offsetFor(conversionInstant, zone)}</span>
                  <span>{localDayDifference === "same date" ? text.sameDate : text.differentDate}</span>
                </div>
                <div className="comparison-region">
                  <span className="result-dot" style={{ background: target?.color || "#ea795d" }} /> <strong>{targetCities[index] || zoneLabel(zone)}</strong>
                  <small>{zone}</small>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="cities-section">
        <div className="section-heading city-heading">
          <div>
            <span className="section-kicker">{text.citiesKicker}</span>
            <h2>{text.citiesHeading}</h2>
          </div>
        </div>
        <div className="city-grid">
          {zones.map((zone, index) => (
            <article className="city-card" key={`${zone.zone}-${zone.city}`} style={{ "--accent": zone.color, "--delay": `${index * 70}ms` } as React.CSSProperties}>
              <div className="city-card-top">
                <span className="city-region">{zone.region}</span>
              </div>
              <div className="city-name-row">
                <div>
                  <h3>{zone.city}</h3>
                  <p>{zone.country}</p>
                </div>
                <span className="city-code">{zone.code}</span>
              </div>
              <div className="local-time">{now ? formatTime(now, zone.zone, { hour12: true }) : "—"}</div>
              <div className="city-card-bottom">
                <span>{now ? formatDate(now, zone.zone, language) : ""}</span>
                <strong>{now ? offsetFor(now, zone.zone) : ""}</strong>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="major-cities-section">
        <div className="section-heading city-heading">
          <div>
            <span className="section-kicker">{text.majorKicker}</span>
            <h2>{text.majorHeading}</h2>
          </div>
          <span className="catalog-count">
            {visibleMajorCities.length} {text.cities} · {text.population}
          </span>
        </div>
        <label className="capital-search">
          <span>{text.citySearch}</span>
          <input value={cityQuery} onChange={(event) => setCityQuery(event.target.value)} placeholder={text.cityPlaceholder} />
        </label>
        <div className="major-city-list">
          {visibleMajorCities.map((city) => (
            <article className="major-city-row" key={`${city.countryCode}-${city.city}-${city.zone}`}>
              <div>
                <strong>{city.city}</strong>
                <span>
                  {city.country} · {city.countryCode}
                </span>
              </div>
              <small>{city.zone}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="capitals-section">
        <div className="section-heading city-heading">
          <div>
            <span className="section-kicker">{text.capitals}</span>
            <h2>{text.capitalsHeading}</h2>
          </div>
          <span className="catalog-count">
            {visibleCapitals.length} {text.capitalCount}
          </span>
        </div>
        <label className="capital-search">
          <span>{text.capitalSearch}</span>
          <input value={capitalQuery} onChange={(event) => setCapitalQuery(event.target.value)} placeholder={text.capitalPlaceholder} />
        </label>
        <div className="major-city-list">
          {visibleCapitals.map((capital) => (
            <article className="major-city-row" key={`capital-${capital.countryCode}`}>
              <div>
                <strong>{capital.city}</strong>
                <span>
                  {capital.country} · {capital.countryCode}
                </span>
              </div>
              <small>{capital.zone}</small>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <span>GLOBAL TIME ATLAS</span>
        <span>{text.browserClock}</span>
      </footer>
    </main>
  );
}
