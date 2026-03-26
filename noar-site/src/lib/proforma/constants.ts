/* DC Calculator V2 — Rate tables, Kitchener Dec 2025 bylaws */

import type { ZoneKey } from './types';

interface ZoneRates {
  ss: number;
  th: number;
  lodge: number;
  rental: Record<1 | 2 | 3, number>;
  own: Record<1 | 2 | 3, number>;
}

export const CITY_RATES: Record<'central' | 'suburban', ZoneRates> = {
  central: {
    ss: 21215, th: 14900, lodge: 6027,
    // Post-discount rental: 1BR -15%, 2BR -20%, 3BR -25% off base $10,727
    rental: { 1: 9118, 2: 8582, 3: 8045 },
    // Ownership: flat base multiple dwelling rate
    own: { 1: 10727, 2: 10727, 3: 10727 },
  },
  suburban: {
    ss: 31587, th: 22184, lodge: 8975,
    // Post-discount rental: off base $15,970
    rental: { 1: 13575, 2: 12776, 3: 11978 },
    own: { 1: 15970, 2: 15970, 3: 15970 },
  },
};

// Township has no city DC — all zeros
export const CITY_TOWNSHIP: ZoneRates = {
  ss: 0, th: 0, lodge: 0,
  rental: { 1: 0, 2: 0, 3: 0 },
  own: { 1: 0, 2: 0, 3: 0 },
};

export const REGION_RATES = {
  city: { ss: 43285, th: 32350, apt: 23570, lodge: 15020 },
  township: { ss: 39542, th: 29553, apt: 21533, lodge: 13720 },
};

export const EDU_RATES = {
  wrdsb: 3448,
  wcdsb: 3293,
};

export function getCityRates(zone: ZoneKey): ZoneRates {
  if (zone === 'township') return CITY_TOWNSHIP;
  return CITY_RATES[zone];
}

export function getRegionRates(zone: ZoneKey) {
  return zone === 'township' ? REGION_RATES.township : REGION_RATES.city;
}
