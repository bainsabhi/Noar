import { describe, it, expect } from 'vitest';
import { calcDC, aptR, ssR, thR, lodgeR, regionR, eduDC, getRATotal } from './calculations';
import type { DCInputs } from './types';

/** Helper: build default inputs, overriding specific fields */
function inputs(overrides: Partial<DCInputs> = {}): DCInputs {
  return {
    category: 'detached', detType: 'duplex', thType: 'duplex', semiUPS: 2,
    aptUnits: 8, lodgeUnits: 6, ptype: 'infill', demolished: 'sfd',
    zone: 'central', br: 2, tenure: 'rental', affordable: 0,
    sb: 'wrdsb', dev: 'private',
    ...overrides,
  };
}

/* ═══════ Rate Helpers ═══════ */

describe('aptR — apartment city rate', () => {
  it('returns rental rate for 4+ unit rental building', () => {
    const p = inputs({ tenure: 'rental', br: 2, zone: 'central' });
    expect(aptR(p, 4)).toBe(8582);
  });

  it('returns ownership rate when tenure=own', () => {
    const p = inputs({ tenure: 'own', br: 2, zone: 'central' });
    expect(aptR(p, 8)).toBe(10727);
  });

  it('returns ownership rate for rental building < 4 units', () => {
    const p = inputs({ tenure: 'rental', br: 2, zone: 'central' });
    expect(aptR(p, 3)).toBe(10727);
  });

  it('returns suburban rates correctly', () => {
    const p = inputs({ tenure: 'rental', br: 2, zone: 'suburban' });
    expect(aptR(p, 8)).toBe(12776);
  });

  it('1BR rental gets 15% discount', () => {
    const p = inputs({ tenure: 'rental', br: 1, zone: 'central' });
    expect(aptR(p, 8)).toBe(9118);
  });

  it('3BR rental gets 25% discount', () => {
    const p = inputs({ tenure: 'rental', br: 3, zone: 'central' });
    expect(aptR(p, 8)).toBe(8045);
  });

  it('township returns 0 for city rate', () => {
    const p = inputs({ zone: 'township' });
    expect(aptR(p, 8)).toBe(0);
  });
});

describe('ssR / thR / lodgeR / regionR / eduDC', () => {
  it('ssR central = 21215', () => expect(ssR(inputs())).toBe(21215));
  it('ssR suburban = 31587', () => expect(ssR(inputs({ zone: 'suburban' }))).toBe(31587));
  it('ssR township = 0', () => expect(ssR(inputs({ zone: 'township' }))).toBe(0));
  it('thR central = 14900', () => expect(thR(inputs())).toBe(14900));
  it('lodgeR central = 6027', () => expect(lodgeR(inputs())).toBe(6027));
  it('regionR ss central = 43285', () => expect(regionR(inputs(), 'ss')).toBe(43285));
  it('regionR apt township = 21533', () => expect(regionR(inputs({ zone: 'township' }), 'apt')).toBe(21533));
  it('eduDC wrdsb = 3448', () => expect(eduDC(inputs({ sb: 'wrdsb' }))).toBe(3448));
  it('eduDC wcdsb = 3293', () => expect(eduDC(inputs({ sb: 'wcdsb' }))).toBe(3293));
  it('eduDC both = 6741', () => expect(eduDC(inputs({ sb: 'both' }))).toBe(6741));
});

/* ═══════ Detached ═══════ */

describe('calcDetached', () => {
  it('single unit, infill: RA credit, net DC = $0 (only edu)', () => {
    const r = calcDC(inputs({ detType: 'single', ptype: 'infill' }));
    expect(r.units).toHaveLength(1);
    expect(r.units[0].status).toBe('credit');
    expect(r.totalCharged).toBe(0);
  });

  it('single unit, new build: 1 unit at SS rate', () => {
    const r = calcDC(inputs({ detType: 'single', ptype: 'newbuild' }));
    expect(r.units).toHaveLength(1);
    expect(r.units[0].status).toBe('charged');
    const expected = 21215 + 43285 + 3448;
    expect(r.units[0].total).toBe(expected);
    expect(r.netDC).toBe(expected);
  });

  it('duplex, infill: unit 1 RA, unit 2 exempt, net = $0', () => {
    const r = calcDC(inputs({ detType: 'duplex', ptype: 'infill' }));
    expect(r.units).toHaveLength(2);
    expect(r.units[0].status).toBe('credit');
    expect(r.units[1].status).toBe('exempt');
    expect(r.totalCharged).toBe(0);
    expect(r.netDC).toBe(0);
  });

  it('duplex, new build: unit 1 SS, unit 2 exempt', () => {
    const r = calcDC(inputs({ detType: 'duplex', ptype: 'newbuild' }));
    expect(r.units[0].status).toBe('charged');
    expect(r.units[1].status).toBe('exempt');
    expect(r.totalCharged).toBe(r.units[0].total);
  });

  it('triplex, infill: unit 1 RA, units 2+3 exempt, net = $0', () => {
    const r = calcDC(inputs({ detType: 'triplex', ptype: 'infill' }));
    expect(r.units).toHaveLength(3);
    expect(r.units[0].status).toBe('credit');
    expect(r.units[1].status).toBe('exempt');
    expect(r.units[2].status).toBe('exempt');
    expect(r.netDC).toBe(0);
  });

  it('fourplex, infill: unit 1 RA, 2+3 exempt, unit 4 apt rate', () => {
    const r = calcDC(inputs({ detType: 'fourplex', ptype: 'infill' }));
    expect(r.units).toHaveLength(4);
    expect(r.units[0].status).toBe('credit');
    expect(r.units[1].status).toBe('exempt');
    expect(r.units[2].status).toBe('exempt');
    expect(r.units[3].status).toBe('charged');
    // Unit 4 = apt rate (rental 2BR central) + region apt + edu
    const u4 = 8582 + 23570 + 3448;
    expect(r.units[3].total).toBe(u4);
    expect(r.netDC).toBe(u4);
  });

  it('fourplex, new build: unit 1 SS, 2+3 exempt, unit 4 apt', () => {
    const r = calcDC(inputs({ detType: 'fourplex', ptype: 'newbuild' }));
    expect(r.units[0].status).toBe('charged');
    expect(r.units[1].status).toBe('exempt');
    expect(r.units[2].status).toBe('exempt');
    expect(r.units[3].status).toBe('charged');
    const u1 = 21215 + 43285 + 3448;
    const u4 = 8582 + 23570 + 3448;
    expect(r.netDC).toBe(u1 + u4);
  });
});

/* ═══════ Semi-Detached ═══════ */

describe('calcSemi', () => {
  it('1+1 infill: Side A U1 RA, Side B U1 SS rate', () => {
    const r = calcDC(inputs({ category: 'semi', semiUPS: 1, ptype: 'infill' }));
    expect(r.units).toHaveLength(2);
    expect(r.units[0].status).toBe('credit'); // Side A U1
    expect(r.units[1].status).toBe('charged'); // Side B U1
    const ss = 21215 + 43285 + 3448;
    expect(r.units[1].total).toBe(ss);
    expect(r.netDC).toBe(ss);
  });

  it('2+2 infill: RA + exempt + SS + exempt', () => {
    const r = calcDC(inputs({ category: 'semi', semiUPS: 2, ptype: 'infill' }));
    expect(r.units).toHaveLength(4);
    // Side A: U1=RA, U2=exempt
    expect(r.units[0].status).toBe('credit');
    expect(r.units[1].status).toBe('exempt');
    // Side B: U1=charged(SS), U2=exempt
    expect(r.units[2].status).toBe('charged');
    expect(r.units[3].status).toBe('exempt');
  });

  it('3+3 infill: units 2 and 3 exempt both sides', () => {
    const r = calcDC(inputs({ category: 'semi', semiUPS: 3, ptype: 'infill' }));
    expect(r.units).toHaveLength(6);
    expect(r.units[1].status).toBe('exempt'); // A U2
    expect(r.units[2].status).toBe('exempt'); // A U3
    expect(r.units[4].status).toBe('exempt'); // B U2
    expect(r.units[5].status).toBe('exempt'); // B U3
  });

  it('4+4 infill: unit 4 each side at apt rate', () => {
    const r = calcDC(inputs({ category: 'semi', semiUPS: 4, ptype: 'infill' }));
    expect(r.units).toHaveLength(8);
    // U4 on each side is charged
    expect(r.units[3].status).toBe('charged'); // A U4
    expect(r.units[7].status).toBe('charged'); // B U4
    // Both at apt rate
    const aptTotal = 8582 + 23570 + 3448;
    expect(r.units[3].total).toBe(aptTotal);
    expect(r.units[7].total).toBe(aptTotal);
  });

  it('2+2 new build: both U1s charged at SS', () => {
    const r = calcDC(inputs({ category: 'semi', semiUPS: 2, ptype: 'newbuild' }));
    expect(r.units[0].status).toBe('charged'); // A U1
    expect(r.units[2].status).toBe('charged'); // B U1
  });
});

/* ═══════ Townhouse ═══════ */

describe('calcTownhouse', () => {
  it('duplex TH, infill: U1 RA, U2 exempt, net = $0', () => {
    const r = calcDC(inputs({ category: 'townhouse', thType: 'duplex', ptype: 'infill' }));
    expect(r.units).toHaveLength(2);
    expect(r.units[0].status).toBe('credit');
    expect(r.units[1].status).toBe('exempt');
    expect(r.netDC).toBe(0);
  });

  it('single TH, new build: U1 at TH rate', () => {
    const r = calcDC(inputs({ category: 'townhouse', thType: 'single', ptype: 'newbuild' }));
    expect(r.units).toHaveLength(1);
    expect(r.units[0].status).toBe('charged');
    const th = 14900 + 32350 + 3448;
    expect(r.units[0].total).toBe(th);
  });

  it('fourplex TH, new build: U1 TH, U2+U3 exempt, U4 apt', () => {
    const r = calcDC(inputs({ category: 'townhouse', thType: 'fourplex', ptype: 'newbuild' }));
    expect(r.units).toHaveLength(4);
    expect(r.units[0].status).toBe('charged');
    expect(r.units[1].status).toBe('exempt');
    expect(r.units[2].status).toBe('exempt');
    expect(r.units[3].status).toBe('charged');
    // U1 at TH rate
    expect(r.units[0].cityDC).toBe(14900);
    expect(r.units[0].regionDC).toBe(32350);
    // U4 at apt rate
    expect(r.units[3].cityDC).toBe(8582); // 2BR rental central
    expect(r.units[3].regionDC).toBe(23570);
  });
});

/* ═══════ Apartment ═══════ */

describe('calcApartment', () => {
  it('8 units, infill, rental: U1 RA, 7 charged at apt rate', () => {
    const r = calcDC(inputs({ category: 'apartment', aptUnits: 8, ptype: 'infill' }));
    expect(r.units).toHaveLength(8);
    expect(r.units[0].status).toBe('credit');
    const charged = r.units.filter(u => u.status === 'charged');
    expect(charged).toHaveLength(7);
    const aptTotal = 8582 + 23570 + 3448;
    charged.forEach(u => expect(u.total).toBe(aptTotal));
  });

  it('8 units, new build: all 8 charged', () => {
    const r = calcDC(inputs({ category: 'apartment', aptUnits: 8, ptype: 'newbuild' }));
    const charged = r.units.filter(u => u.status === 'charged');
    expect(charged).toHaveLength(8);
  });

  it('8 units, ownership: all at ownership rate', () => {
    const r = calcDC(inputs({ category: 'apartment', aptUnits: 8, ptype: 'newbuild', tenure: 'own' }));
    expect(r.units[0].cityDC).toBe(10727);
  });

  it('clamps minimum to 5 units', () => {
    const r = calcDC(inputs({ category: 'apartment', aptUnits: 3 }));
    expect(r.units.length).toBeGreaterThanOrEqual(5);
  });
});

/* ═══════ Lodging ═══════ */

describe('calcLodging', () => {
  it('6 units, infill: U1 RA, 5 at lodge rate', () => {
    const r = calcDC(inputs({ category: 'lodging', lodgeUnits: 6, ptype: 'infill' }));
    expect(r.units).toHaveLength(6);
    expect(r.units[0].status).toBe('credit');
    const charged = r.units.filter(u => u.status === 'charged');
    expect(charged).toHaveLength(5);
    const lodgeTotal = 6027 + 15020 + 3448;
    charged.forEach(u => expect(u.total).toBe(lodgeTotal));
  });

  it('6 units, new build: all 6 charged', () => {
    const r = calcDC(inputs({ category: 'lodging', lodgeUnits: 6, ptype: 'newbuild' }));
    const charged = r.units.filter(u => u.status === 'charged');
    expect(charged).toHaveLength(6);
  });
});

/* ═══════ Non-Profit Developer ═══════ */

describe('non-profit developer', () => {
  it('city DC = 0 and region DC = 0 for non-profit', () => {
    const r = calcDC(inputs({ detType: 'single', ptype: 'newbuild', dev: 'nonprofit' }));
    expect(r.units[0].cityDC).toBe(0);
    expect(r.units[0].regionDC).toBe(0);
    // edu DC still applies
    expect(r.units[0].eduDC).toBe(3448);
    expect(r.units[0].total).toBe(3448);
  });

  it('non-profit semi: charged units have only edu DC', () => {
    const r = calcDC(inputs({ category: 'semi', semiUPS: 1, ptype: 'newbuild', dev: 'nonprofit' }));
    r.units.filter(u => u.status === 'charged').forEach(u => {
      expect(u.cityDC).toBe(0);
      expect(u.regionDC).toBe(0);
      expect(u.eduDC).toBe(3448);
    });
  });
});

/* ═══════ Affordable Exemptions ═══════ */

describe('affordable exemptions', () => {
  it('2 affordable in 4-unit fourplex removes highest 2 charged', () => {
    const r = calcDC(inputs({ detType: 'fourplex', ptype: 'newbuild', affordable: 2 }));
    // U1(SS) charged, U2 exempt, U3 exempt, U4(apt) charged
    // 2 affordable exemptions: removes U1 and U4
    expect(r.affApplied).toBe(2);
    expect(r.netDC).toBe(0);
  });

  it('1 affordable in duplex new build removes the charged unit', () => {
    const r = calcDC(inputs({ detType: 'duplex', ptype: 'newbuild', affordable: 1 }));
    // U1 charged, U2 exempt. 1 affordable → removes U1
    expect(r.affApplied).toBe(1);
    expect(r.netDC).toBe(0);
  });

  it('affordable count clamped to charged units', () => {
    const r = calcDC(inputs({ detType: 'duplex', ptype: 'newbuild', affordable: 5 }));
    // Only 1 charged unit, so only 1 can be affordable-exempted
    expect(r.affApplied).toBe(1);
  });
});

/* ═══════ Benchmark ═══════ */

describe('benchmark', () => {
  it('benchmark for detached duplex = SS + apt (all fully charged)', () => {
    const r = calcDC(inputs({ detType: 'duplex', ptype: 'newbuild' }));
    const ss = 21215 + 43285 + 3448;
    // Duplex = 2 units, so aptR uses ownership rate (rental discount only for 4+)
    const apt = 10727 + 23570 + 3448;
    expect(r.benchmark).toBe(ss + apt);
  });

  it('savings = benchmark - netDC', () => {
    const r = calcDC(inputs({ detType: 'duplex', ptype: 'infill' }));
    expect(r.benchmark - r.netDC).toBeGreaterThan(0);
  });
});

/* ═══════ RA Total ═══════ */

describe('getRATotal', () => {
  it('SFD demolished = SS total', () => {
    const p = inputs();
    expect(getRATotal(p)).toBe(21215 + 43285 + 3448);
  });

  it('no demo on newbuild = 0', () => {
    expect(getRATotal(inputs({ ptype: 'newbuild' }))).toBe(0);
  });
});

/* ═══════ Zone Tests ═══════ */

describe('zone differences', () => {
  it('suburban rates higher than central', () => {
    const c = calcDC(inputs({ detType: 'single', ptype: 'newbuild', zone: 'central' }));
    const s = calcDC(inputs({ detType: 'single', ptype: 'newbuild', zone: 'suburban' }));
    expect(s.netDC).toBeGreaterThan(c.netDC);
  });

  it('township has no city DC', () => {
    const r = calcDC(inputs({ detType: 'single', ptype: 'newbuild', zone: 'township' }));
    expect(r.units[0].cityDC).toBe(0);
    expect(r.units[0].regionDC).toBe(39542); // township SS region rate
  });
});
