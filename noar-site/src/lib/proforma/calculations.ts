/* DC Calculator V2 — Calculation engine */

import { getCityRates, getRegionRates, EDU_RATES } from './constants';
import type { DCInputs, DCResult, UnitResult } from './types';

/* ═══════ Rate Helpers (exported for testing) ═══════ */

export function aptR(p: DCInputs, totalUnits?: number): number {
  const city = getCityRates(p.zone);
  const qualifies = p.tenure === 'rental' && (totalUnits ?? 0) >= 4;
  const br = Math.min(p.br, 3) as 1 | 2 | 3;
  return qualifies ? city.rental[br] : city.own[br];
}

export function ssR(p: DCInputs): number {
  return getCityRates(p.zone).ss;
}

export function thR(p: DCInputs): number {
  return getCityRates(p.zone).th;
}

export function lodgeR(p: DCInputs): number {
  return getCityRates(p.zone).lodge;
}

export function regionR(p: DCInputs, type: 'ss' | 'th' | 'apt' | 'lodge'): number {
  return getRegionRates(p.zone)[type];
}

export function eduDC(p: DCInputs): number {
  if (p.sb === 'wrdsb') return EDU_RATES.wrdsb;
  if (p.sb === 'wcdsb') return EDU_RATES.wcdsb;
  return EDU_RATES.wrdsb + EDU_RATES.wcdsb;
}

/* ═══════ Unit Factories ═══════ */

function mkU(side: string, num: number, lbl: string): UnitResult {
  return { side, unitNum: num, label: lbl, status: 'charged', mechanism: '', cityDC: 0, regionDC: 0, eduDC: 0, total: 0, rateType: '' };
}

function applySSCharge(u: UnitResult, p: DCInputs): number {
  u.cityDC = p.dev === 'nonprofit' ? 0 : ssR(p);
  u.regionDC = p.dev === 'nonprofit' ? 0 : regionR(p, 'ss');
  u.eduDC = eduDC(p);
  u.total = u.cityDC + u.regionDC + u.eduDC;
  u.rateType = (p.dev === 'nonprofit' ? 'nonprofit — ' : '') + 'single/semi-detached';
  return u.total;
}

function applyTHCharge(u: UnitResult, p: DCInputs): number {
  u.cityDC = p.dev === 'nonprofit' ? 0 : thR(p);
  u.regionDC = p.dev === 'nonprofit' ? 0 : regionR(p, 'th');
  u.eduDC = eduDC(p);
  u.total = u.cityDC + u.regionDC + u.eduDC;
  u.rateType = (p.dev === 'nonprofit' ? 'nonprofit — ' : '') + 'townhouse/row dwelling';
  return u.total;
}

function applyAptCharge(u: UnitResult, p: DCInputs, totalUnits: number): number {
  u.cityDC = p.dev === 'nonprofit' ? 0 : aptR(p, totalUnits);
  u.regionDC = p.dev === 'nonprofit' ? 0 : regionR(p, 'apt');
  u.eduDC = eduDC(p);
  u.total = u.cityDC + u.regionDC + u.eduDC;
  u.rateType = (p.dev === 'nonprofit' ? 'nonprofit — ' : '')
    + 'apt ' + (p.tenure === 'rental' && totalUnits >= 4 ? p.br + 'BR rental' : 'ownership');
  return u.total;
}

function applyLodgeCharge(u: UnitResult, p: DCInputs): number {
  u.cityDC = p.dev === 'nonprofit' ? 0 : lodgeR(p);
  u.regionDC = p.dev === 'nonprofit' ? 0 : regionR(p, 'lodge');
  u.eduDC = eduDC(p);
  u.total = u.cityDC + u.regionDC + u.eduDC;
  u.rateType = (p.dev === 'nonprofit' ? 'nonprofit — ' : '') + 'lodging unit';
  return u.total;
}

function applyRA(u: UnitResult, demolished: string): void {
  const labels: Record<string, string> = { sfd: 'SFD', semi: 'semi unit', apt: 'apartment', th: 'townhouse', lodge: 'lodging house' };
  u.status = 'credit';
  u.mechanism = 'RA credit — demolished ' + (labels[demolished] || demolished);
  u.rateType = '(offset by RA)';
}

/* ═══════ Affordable Exemptions ═══════ */

function applyAffordable(units: UnitResult[], aff: number, totalCharged: number) {
  const charged = units
    .filter(u => u.status === 'charged')
    .sort((a, b) => b.total - a.total);
  const applied = Math.min(aff, charged.length);
  let reduction = 0;
  for (let i = 0; i < applied; i++) {
    reduction += charged[i].total;
    const target = units.find(u => u.side === charged[i].side && u.unitNum === charged[i].unitNum);
    if (target) target.affEx = true;
  }
  return { net: totalCharged - reduction, applied, reduction };
}

/* ═══════ RA Total ═══════ */

export function getRATotal(p: DCInputs): number {
  if (p.ptype === 'newbuild') return 0;
  const d = p.demolished;
  if (d === 'none') return 0;
  if (d === 'apt') return aptR(p) + regionR(p, 'apt') + eduDC(p);
  if (d === 'th') return thR(p) + regionR(p, 'th') + eduDC(p);
  if (d === 'lodge') return lodgeR(p) + regionR(p, 'lodge') + eduDC(p);
  // sfd or semi → SS rate
  return ssR(p) + regionR(p, 'ss') + eduDC(p);
}

/* ═══════ Benchmarks ═══════ */

function benchmarkDetached(p: DCInputs, n: number): number {
  const ss = ssR(p) + regionR(p, 'ss') + eduDC(p);
  const apt = aptR(p, n) + regionR(p, 'apt') + eduDC(p);
  return ss + (n - 1) * apt;
}

function benchmarkSemi(p: DCInputs, ups: number): number {
  const ss = ssR(p) + regionR(p, 'ss') + eduDC(p);
  const apt = aptR(p, ups * 2) + regionR(p, 'apt') + eduDC(p);
  return 2 * ss + (ups * 2 - 2) * apt;
}

function benchmarkTownhouse(p: DCInputs, n: number): number {
  const th = thR(p) + regionR(p, 'th') + eduDC(p);
  return n * th;
}

function benchmarkLodging(p: DCInputs, n: number): number {
  return n * (lodgeR(p) + regionR(p, 'lodge') + eduDC(p));
}

function benchmarkApartment(p: DCInputs, n: number): number {
  return n * (aptR(p, n) + regionR(p, 'apt') + eduDC(p));
}

/* ═══════ Category Calculators ═══════ */

function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function getDemo(p: DCInputs): string {
  return p.ptype === 'newbuild' ? 'none' : p.demolished;
}

function calcDetached(p: DCInputs): DCResult {
  const demo = getDemo(p);
  const detUnits = { single: 1, duplex: 2, triplex: 3, fourplex: 4 }[p.detType];
  const units: UnitResult[] = [];
  let totalCharged = 0;

  for (let u = 1; u <= detUnits; u++) {
    const lbl = u === 1 ? 'Unit 1 (Primary)' : `Unit ${u} (ADU ${u - 1})`;
    const unit = mkU('MAIN', u, lbl);

    if (u === 1 && demo !== 'none') {
      applyRA(unit, demo);
    } else if (u === 1) {
      unit.mechanism = 'Primary — single detached rate';
      totalCharged += applySSCharge(unit, p);
    } else if (u === 2) {
      unit.status = 'exempt';
      unit.mechanism = 'DCA s.3.3 — 2nd unit in new detached';
      unit.rateType = '—';
    } else if (u === 3) {
      unit.status = 'exempt';
      unit.mechanism = 'DCA s.3.3 — 3rd unit in new building';
      unit.rateType = '—';
    } else {
      unit.mechanism = `Unit ${u} — beyond s.3.3 limit`;
      totalCharged += applyAptCharge(unit, p, detUnits);
    }
    units.push(unit);
  }

  const af = applyAffordable(units, p.affordable, totalCharged);

  return {
    desc: `${cap(p.detType)} (${detUnits} units) | ${p.zone} | ${p.br}BR ${p.tenure} | ${p.ptype === 'infill' ? 'Infill — demo:' + demo : 'New Build'}`,
    units, totalCharged, netDC: af.net, netPerDoor: af.net / detUnits,
    affApplied: af.applied, affReduction: af.reduction, raTotal: getRATotal(p),
    benchmark: benchmarkDetached(p, detUnits), total: detUnits,
  };
}

function calcSemi(p: DCInputs): DCResult {
  const demo = getDemo(p);
  const ups = p.semiUPS;
  const total = ups * 2;
  const units: UnitResult[] = [];
  let totalCharged = 0;

  for (let si = 0; si < 2; si++) {
    const side = si === 0 ? 'A' : 'B';
    for (let u = 1; u <= ups; u++) {
      const lbl = `Unit ${u}${u === 1 ? ' (Primary)' : ` (ADU ${u - 1})`}`;
      const unit = mkU(side, u, lbl);

      if (u === 1 && si === 0 && demo !== 'none') {
        applyRA(unit, demo);
      } else if (u === 1) {
        unit.mechanism = si === 1
          ? 'Side B primary — single/semi-detached rate'
          : 'Side A primary — single/semi-detached rate (no RA)';
        totalCharged += applySSCharge(unit, p);
      } else if (u === 2) {
        unit.status = 'exempt';
        unit.mechanism = 'DCA s.3.3 — 2nd unit in new semi-detached';
        unit.rateType = '—';
      } else if (u === 3) {
        unit.status = 'exempt';
        unit.mechanism = 'DCA s.3.3 — 3rd unit in new semi-detached';
        unit.rateType = '—';
      } else {
        unit.mechanism = `Unit ${u} — beyond s.3.3 limit, no exemption`;
        totalCharged += applyAptCharge(unit, p, total);
      }
      units.push(unit);
    }
  }

  const af = applyAffordable(units, p.affordable, totalCharged);

  return {
    desc: `Semi-Detached ${ups}/side (${total} total) | ${p.zone} | ${p.br}BR ${p.tenure} | ${p.ptype === 'infill' ? 'Infill — demo:' + demo : 'New Build'}`,
    units, totalCharged, netDC: af.net, netPerDoor: af.net / total,
    affApplied: af.applied, affReduction: af.reduction, raTotal: getRATotal(p),
    benchmark: benchmarkSemi(p, ups), total,
  };
}

function calcTownhouse(p: DCInputs): DCResult {
  const demo = getDemo(p);
  const thUnits = { single: 1, duplex: 2, triplex: 3, fourplex: 4 }[p.thType];
  const units: UnitResult[] = [];
  let totalCharged = 0;

  for (let u = 1; u <= thUnits; u++) {
    const lbl = u === 1 ? 'Unit 1 (Primary TH)' : `Unit ${u} (ADU ${u - 1})`;
    const unit = mkU('MAIN', u, lbl);

    if (u === 1 && demo !== 'none') {
      applyRA(unit, demo);
    } else if (u === 1) {
      unit.mechanism = 'Primary — townhouse/row rate';
      totalCharged += applyTHCharge(unit, p);
    } else if (u === 2) {
      unit.status = 'exempt';
      unit.mechanism = 'DCA s.3.3 — 2nd unit in new rowhouse';
      unit.rateType = '—';
    } else if (u === 3) {
      unit.status = 'exempt';
      unit.mechanism = 'DCA s.3.3 — 3rd unit in new building';
      unit.rateType = '—';
    } else {
      unit.mechanism = `Unit ${u} — beyond s.3.3 limit`;
      totalCharged += applyAptCharge(unit, p, thUnits);
    }
    units.push(unit);
  }

  const af = applyAffordable(units, p.affordable, totalCharged);

  return {
    desc: `${cap(p.thType)} Townhouse (${thUnits} units) | ${p.zone} | ${p.br}BR ${p.tenure} | ${p.ptype === 'infill' ? 'Infill — demo:' + demo : 'New Build'}`,
    units, totalCharged, netDC: af.net, netPerDoor: af.net / thUnits,
    affApplied: af.applied, affReduction: af.reduction, raTotal: getRATotal(p),
    benchmark: benchmarkTownhouse(p, thUnits), total: thUnits,
  };
}

function calcApartment(p: DCInputs): DCResult {
  const demo = getDemo(p);
  const n = Math.max(5, p.aptUnits);
  const units: UnitResult[] = [];
  let totalCharged = 0;

  for (let u = 1; u <= n; u++) {
    const unit = mkU('APT', u, `Unit ${u}${u === 1 ? ' (Primary)' : ''}`);
    if (u === 1 && demo !== 'none') {
      applyRA(unit, demo);
    } else {
      unit.mechanism = 'Purpose-built apartment — no s.3.3 exemption';
      totalCharged += applyAptCharge(unit, p, n);
    }
    units.push(unit);
  }

  const af = applyAffordable(units, p.affordable, totalCharged);

  return {
    desc: `Low-Rise Apartment (${n} units) | ${p.zone} | ${p.br}BR ${p.tenure} | ${p.ptype === 'infill' ? 'Infill — demo:' + demo : 'New Build'}`,
    units, totalCharged, netDC: af.net, netPerDoor: af.net / n,
    affApplied: af.applied, affReduction: af.reduction, raTotal: getRATotal(p),
    benchmark: benchmarkApartment(p, n), total: n,
  };
}

function calcLodging(p: DCInputs): DCResult {
  const demo = getDemo(p);
  const n = Math.max(1, p.lodgeUnits);
  const units: UnitResult[] = [];
  let totalCharged = 0;

  for (let u = 1; u <= n; u++) {
    const unit = mkU('LODGE', u, `Lodging Unit ${u}${u === 1 ? ' (Primary)' : ''}`);
    if (u === 1 && demo !== 'none') {
      applyRA(unit, demo);
    } else {
      unit.mechanism = 'Lodging house — no s.3.3 exemption';
      totalCharged += applyLodgeCharge(unit, p);
    }
    units.push(unit);
  }

  const af = applyAffordable(units, p.affordable, totalCharged);

  return {
    desc: `Lodging House (${n} units) | ${p.zone} | ${p.ptype === 'infill' ? 'Infill — demo:' + demo : 'New Build'}`,
    units, totalCharged, netDC: af.net, netPerDoor: af.net / n,
    affApplied: af.applied, affReduction: af.reduction, raTotal: getRATotal(p),
    benchmark: benchmarkLodging(p, n), total: n,
  };
}

/* ═══════ Dispatcher ═══════ */

export function calcDC(p: DCInputs): DCResult {
  switch (p.category) {
    case 'detached': return calcDetached(p);
    case 'semi': return calcSemi(p);
    case 'townhouse': return calcTownhouse(p);
    case 'lodging': return calcLodging(p);
    case 'apartment': return calcApartment(p);
  }
}
