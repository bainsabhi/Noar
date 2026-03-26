import { useState, useMemo, useCallback } from 'react';
import { calcDC, loadPreset, exportCSV, exportPDF } from '../lib/proforma';
import type { DCInputs, DCResult } from '../lib/proforma';
import type { BuildingCategory, SubConfig, ZoneKey, SchoolBoard, BedroomType } from '../lib/proforma/types';
import s from './ProFormaPage.module.css';

function fmt(n: number): string {
  return n === 0 ? '$0' : '$' + Math.round(n).toLocaleString();
}

const SIDE_LABEL: Record<string, string> = { A: 'SIDE A', B: 'SIDE B', MAIN: 'MAIN BUILDING', APT: 'APARTMENT', LODGE: 'LODGING HOUSE' };
const SIDE_TAG: Record<string, string> = { A: 'tagA', B: 'tagB', MAIN: 'tagA', APT: 'tagA', LODGE: 'tagA' };

/* ═══════ INPUT PANEL ═══════ */

function InputPanel({ inputs, setInputs }: { inputs: DCInputs; setInputs: React.Dispatch<React.SetStateAction<DCInputs>> }) {
  const set = useCallback(<K extends keyof DCInputs>(k: K, v: DCInputs[K]) => {
    setInputs(p => ({ ...p, [k]: v }));
  }, [setInputs]);

  const toggleBtn = (active: boolean, onClick: () => void, label: string) => (
    <button className={`${s.toggleBtn} ${active ? s.toggleBtnActive : ''}`} onClick={onClick}>{label}</button>
  );

  const configBtn = (active: boolean, onClick: () => void, icon: string, label: string, count: string) => (
    <div className={`${s.configBtn} ${active ? s.configBtnActive : ''}`} onClick={onClick}>
      <div className={s.configIcon}>{icon}</div>
      <div className={s.configLabel}>{label}</div>
      <div className={s.configCount}>{count}</div>
    </div>
  );

  return (
    <div className={s.sidebar}>
      {/* Building Category */}
      <div className={s.sectionLabel}>Building Type</div>
      <div className={s.inputGroup}>
        <div className={s.inputLabel}>Category</div>
        <div className={s.toggleRow} style={{ flexWrap: 'wrap' }}>
          {(['detached', 'semi', 'townhouse', 'lodging', 'apartment'] as BuildingCategory[]).map(c =>
            toggleBtn(inputs.category === c, () => set('category', c), c === 'semi' ? 'SEMI-DET.' : c.toUpperCase())
          )}
        </div>
      </div>

      {/* Detached config */}
      {inputs.category === 'detached' && (
        <div className={s.inputGroup}>
          <div className={s.inputLabel}>Building Config</div>
          <div className={s.configGrid}>
            {configBtn(inputs.detType === 'single', () => set('detType', 'single'), '🏠', 'SINGLE', '1 unit')}
            {configBtn(inputs.detType === 'duplex', () => set('detType', 'duplex'), '🏠', 'DUPLEX', '2 units')}
            {configBtn(inputs.detType === 'triplex', () => set('detType', 'triplex'), '🏠', 'TRIPLEX', '3 units')}
            {configBtn(inputs.detType === 'fourplex', () => set('detType', 'fourplex'), '🏠', 'FOURPLEX', '4 units')}
          </div>
        </div>
      )}

      {/* Semi config */}
      {inputs.category === 'semi' && (
        <div className={s.inputGroup}>
          <div className={s.inputLabel}>Semi Config <small>units per half</small></div>
          <div className={s.configGrid}>
            {([1, 2, 3, 4] as const).map(ups =>
              configBtn(inputs.semiUPS === ups, () => set('semiUPS', ups), '🏡🏡',
                ups === 1 ? 'STANDARD' : `+${ups - 1} ADU EACH`, `${ups}+${ups} = ${ups * 2} total`)
            )}
          </div>
        </div>
      )}

      {/* Townhouse config */}
      {inputs.category === 'townhouse' && (
        <div className={s.inputGroup}>
          <div className={s.inputLabel}>Townhouse Config</div>
          <div className={s.configGrid}>
            {(['single', 'duplex', 'triplex', 'fourplex'] as SubConfig[]).map(t => {
              const n = { single: 1, duplex: 2, triplex: 3, fourplex: 4 }[t];
              return configBtn(inputs.thType === t, () => set('thType', t), '🏘️', `${t.toUpperCase()} TH`, `${n} unit${n > 1 ? 's' : ''}`);
            })}
          </div>
        </div>
      )}

      {/* Lodging units */}
      {inputs.category === 'lodging' && (
        <div className={s.inputGroup}>
          <div className={s.inputLabel}>Lodging Units <small>rooming/lodging house</small></div>
          <input type="number" value={inputs.lodgeUnits} min={1} max={100} onChange={e => set('lodgeUnits', Math.max(1, +e.target.value))} />
        </div>
      )}

      {/* Apartment units */}
      {inputs.category === 'apartment' && (
        <div className={s.inputGroup}>
          <div className={s.inputLabel}>Total Units <small>5+ units</small></div>
          <input type="number" value={inputs.aptUnits} min={5} max={100} onChange={e => set('aptUnits', Math.max(5, +e.target.value))} />
        </div>
      )}

      {/* Project Details */}
      <div className={s.sectionLabel}>Project Details</div>

      <div className={s.inputGroup}>
        <div className={s.inputLabel}>Project Type</div>
        <div className={s.toggleRow}>
          {toggleBtn(inputs.ptype === 'infill', () => set('ptype', 'infill'), 'INFILL (DEMO)')}
          {toggleBtn(inputs.ptype === 'newbuild', () => set('ptype', 'newbuild'), 'NEW BUILD')}
        </div>
      </div>

      {inputs.ptype === 'infill' && (
        <div className={s.inputGroup}>
          <div className={s.inputLabel}>Demolished Building <small>RA credit source</small></div>
          <select value={inputs.demolished} onChange={e => set('demolished', e.target.value as DCInputs['demolished'])}>
            <option value="sfd">Single Family Dwelling</option>
            <option value="semi">Semi-Detached Unit</option>
            {(inputs.category === 'apartment' || inputs.category === 'townhouse' || inputs.category === 'lodging') &&
              <option value="th">Townhouse</option>}
            {inputs.category === 'apartment' && <option value="apt">Apartment/Multiple Dwelling</option>}
            {inputs.category === 'lodging' && <option value="lodge">Lodging House</option>}
          </select>
        </div>
      )}

      {inputs.ptype === 'newbuild' && (
        <div className={s.infoBox} style={{ borderLeftColor: '#C0392B' }}>
          New build — no Redevelopment Allowance credit. All primary units charged at full rate.
        </div>
      )}

      <div className={s.inputGroup}>
        <div className={s.inputLabel}>Location Zone</div>
        <select value={inputs.zone} onChange={e => set('zone', e.target.value as ZoneKey)}>
          <option value="central">Central Neighbourhood</option>
          <option value="suburban">Suburban</option>
          <option value="township">Township</option>
        </select>
      </div>

      <div className={s.inputGroup}>
        <div className={s.inputLabel}>School Board</div>
        <div className={s.toggleRow}>
          {(['wrdsb', 'wcdsb', 'both'] as SchoolBoard[]).map(sb =>
            toggleBtn(inputs.sb === sb, () => set('sb', sb), sb.toUpperCase())
          )}
        </div>
      </div>

      <div className={s.inputGroup}>
        <div className={s.inputLabel}>Developer Type <small>affects City & Region DC</small></div>
        <div className={s.toggleRow}>
          {toggleBtn(inputs.dev === 'private', () => set('dev', 'private'), 'PRIVATE')}
          {toggleBtn(inputs.dev === 'nonprofit', () => set('dev', 'nonprofit'), 'NON-PROFIT')}
        </div>
      </div>

      <div className={s.inputGroup}>
        <div className={s.inputLabel}>Bedroom Type</div>
        <div className={s.toggleRow}>
          {([1, 2, 3] as BedroomType[]).map(br =>
            toggleBtn(inputs.br === br, () => set('br', br), br === 3 ? '3BR+' : `${br}BR`)
          )}
        </div>
      </div>

      <div className={s.inputGroup}>
        <div className={s.inputLabel}>Tenure</div>
        <div className={s.toggleRow}>
          {toggleBtn(inputs.tenure === 'rental', () => set('tenure', 'rental'), 'ALL RENTAL')}
          {toggleBtn(inputs.tenure === 'own', () => set('tenure', 'own'), 'OWNERSHIP')}
        </div>
      </div>

      <div className={s.inputGroup}>
        <div className={s.inputLabel}>Affordable Units <small>Prov. Bulletin + 25yr covenant</small></div>
        <input type="number" value={inputs.affordable} min={0} max={100} onChange={e => set('affordable', Math.max(0, +e.target.value))} />
      </div>

      {/* Rate Reference */}
      <div className={s.sectionLabel}>Rate Reference</div>
      <div className={s.rateSection}>
        <div className={s.rateHeader}>City — Central</div>
        <div className={s.rateRow}><span className={s.rateLbl}>Single/Semi</span><span className={s.rateVal}>$21,215</span></div>
        <div className={s.rateRow}><span className={s.rateLbl}>Townhouse</span><span className={s.rateVal}>$14,900</span></div>
        <div className={s.rateRow}><span className={s.rateLbl}>Apt 2BR Rental</span><span className={s.rateVal}>$8,582</span></div>
        <div className={s.rateRow}><span className={s.rateLbl}>Lodging</span><span className={s.rateVal}>$6,027</span></div>

        <div className={s.rateHeader}>Region — City Area</div>
        <div className={s.rateRow}><span className={s.rateLbl}>Single/Semi</span><span className={s.rateVal}>$43,285</span></div>
        <div className={s.rateRow}><span className={s.rateLbl}>Townhouse</span><span className={s.rateVal}>$32,350</span></div>
        <div className={s.rateRow}><span className={s.rateLbl}>Apartment</span><span className={s.rateVal}>$23,570</span></div>

        <div className={s.rateHeader}>Education DC</div>
        <div className={s.rateRow}><span className={s.rateLbl}>WRDSB</span><span className={s.rateVal}>$3,448</span></div>
        <div className={s.rateRow}><span className={s.rateLbl}>WCDSB</span><span className={s.rateVal}>$3,293</span></div>
      </div>
    </div>
  );
}

/* ═══════ RESULT PANEL ═══════ */

function ResultPanel({ inputs, result }: { inputs: DCInputs; result: DCResult }) {
  const r = result;
  const savings = r.benchmark - r.netDC;

  // Group units by side
  const groups: Record<string, typeof r.units> = {};
  r.units.forEach(u => { (groups[u.side] = groups[u.side] || []).push(u); });

  // Path to zero
  const charged = r.units.filter(u => u.status === 'charged').sort((a, b) => b.total - a.total);
  const pathRows: { label: string; pct: string; net: number }[] = [
    { label: 'No affordable units', pct: '', net: r.totalCharged },
  ];
  let cumReduction = 0;
  for (let i = 0; i < charged.length; i++) {
    cumReduction += charged[i].total;
    const net = r.totalCharged - cumReduction;
    const pct = Math.round(((i + 1) / r.total) * 100) + '%';
    pathRows.push({ label: `${i + 1} unit${i > 0 ? 's' : ''} affordable`, pct, net });
    if (net === 0) break;
  }

  const badgeCls = (u: typeof r.units[0]) =>
    u.affEx ? s.badgeAff : u.status === 'exempt' ? s.badgeExempt : u.status === 'credit' ? s.badgeCredit : s.badgeCharged;
  const badgeText = (u: typeof r.units[0]) =>
    u.affEx ? 'AFFORDABLE' : u.status === 'exempt' ? 'EXEMPT' : u.status === 'credit' ? 'RA CREDIT' : 'CHARGED';

  const allSections = () => (
    <>
      {/* Context */}
      <div className={s.ctxBar}>{r.desc}</div>

      {/* Stat cards */}
      <div className={s.statGrid}>
        <div className={s.statCard}>
          <div className={s.statLabel}>Net DC Owing</div>
          <div className={`${s.statValue} ${s.red}`}>{fmt(r.netDC)}</div>
          <div className={s.statSub}>{fmt(r.netPerDoor)}/door &middot; {r.total} units</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statLabel}>DC Savings vs Benchmark</div>
          <div className={`${s.statValue} ${s.green}`}>{fmt(savings)}</div>
          <div className={s.statSub}>{fmt(savings / r.total)} saved per door</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statLabel}>Gross DC (Chargeable)</div>
          <div className={`${s.statValue} ${s.gold}`}>{fmt(r.totalCharged)}</div>
          <div className={s.statSub}>{r.units.filter(u => u.status === 'charged').length} charged &middot; {r.units.filter(u => u.status === 'exempt').length} exempt</div>
        </div>
        <div className={s.statCard}>
          <div className={s.statLabel}>RA Credit Applied</div>
          <div className={`${s.statValue} ${s.blue}`}>{fmt(r.raTotal)}</div>
          <div className={s.statSub}>{r.raTotal > 0 ? 'Demolition credit — Unit 1' : 'No demolition / new build'}</div>
        </div>
      </div>

      {/* Unit tables grouped by side */}
      {Object.keys(groups).map(side => (
        <div key={side} className={s.unitSection}>
          <div className={s.unitSectionHead}>
            <span className={s.unitSectionTitle}>{SIDE_LABEL[side] || side}</span>
            <span className={`${s.sideTag} ${s[SIDE_TAG[side]] || s.tagA}`}>{side}</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className={s.unitTable}>
              <thead><tr><th>Unit</th><th>Status</th><th>Mechanism</th><th>Rate Type</th><th>DC Amount</th></tr></thead>
              <tbody>
                {groups[side].map(u => (
                  <tr key={`${u.side}-${u.unitNum}`}>
                    <td>{u.label}</td>
                    <td><span className={`${s.badge} ${badgeCls(u)}`}>{badgeText(u)}</span></td>
                    <td style={{ fontSize: 10, color: 'var(--bark-light)' }}>{u.mechanism}</td>
                    <td style={{ fontSize: 10, color: 'var(--bark-light)' }}>{u.rateType}</td>
                    <td style={{ fontWeight: 500, color: u.affEx ? '#a78bfa' : u.total > 0 ? 'var(--forest)' : 'var(--bark-light)' }}>
                      {u.affEx ? <><span style={{ color: 'var(--bark-light)' }}>{fmt(u.total)}</span> &rarr; <span style={{ color: '#a78bfa' }}>$0</span></> : fmt(u.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {/* DC Summary */}
      <div className={s.unitSection}>
        <div className={s.unitSectionHead}><span className={s.unitSectionTitle}>DC Summary</span></div>
        <table className={s.summaryTable}>
          <tbody>
            <tr><td>Gross DC — charged units</td><td>{fmt(r.totalCharged)}</td></tr>
            {r.affApplied > 0 && <tr><td style={{ color: '#2D8F5E' }}>Less: Affordable exemptions ({r.affApplied} unit{r.affApplied > 1 ? 's' : ''})</td><td style={{ color: '#2D8F5E' }}>&minus;{fmt(r.affReduction)}</td></tr>}
            <tr className={s.summaryRow}><td>NET DC OWING</td><td>{fmt(r.netDC)}</td></tr>
            <tr><td style={{ color: 'var(--bark-light)' }}>Per door ({r.total} units)</td><td style={{ color: 'var(--bark-light)' }}>{fmt(r.netPerDoor)}</td></tr>
            <tr><td style={{ color: 'var(--bark-light)' }}>Benchmark (no exemptions, no RA)</td><td style={{ color: 'var(--bark-light)' }}>{fmt(r.benchmark)}</td></tr>
            <tr><td style={{ color: '#2D8F5E' }}>Total saved via exemptions + RA</td><td style={{ color: '#2D8F5E' }}>{fmt(savings)}</td></tr>
          </tbody>
        </table>
      </div>

      {/* Path to Zero */}
      <div className={s.pathCard}>
        <div className={s.pathTitle}>Path to Zero — Affordable Unit Strategy</div>
        {pathRows.map((row, i) => (
          <div key={i} className={s.pathRow}>
            <div className={s.pathLabel}>
              {i === 0 ? row.label : <><strong>{row.label}</strong> <span style={{ fontSize: 10, color: 'var(--bark-light)' }}>— {row.pct} of building</span></>}
            </div>
            <div className={s.pathVal} style={{ color: row.net === 0 ? '#2D8F5E' : i === 0 ? '#C0392B' : 'var(--amber-dark)' }}>
              {fmt(row.net)}
            </div>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      <div className={s.exportBar}>
        <button className={s.exportBtn} onClick={() => exportCSV(inputs, r)}>Export CSV</button>
        <button className={s.exportBtn} onClick={() => exportPDF('dc-print-all', 'dc_calculator_export')}>Export PDF</button>
      </div>

      {/* Interactive view */}
      {allSections()}

      {/* Hidden print container for PDF */}
      <div id="dc-print-all" className={s.printAll}>
        {allSections()}
      </div>
    </>
  );
}

/* ═══════ MAIN PAGE ═══════ */

export function ProFormaPage() {
  const [inputs, setInputs] = useState<DCInputs>(() => loadPreset('detached'));

  const result = useMemo<DCResult | null>(() => {
    try { return calcDC(inputs); }
    catch (e) { console.error(e); return null; }
  }, [inputs]);

  return (
    <div className={s.page}>
      <div className={s.hero}>
        <h1 className={s.heroTitle}>DC Calculator</h1>
        <p className={s.heroSub}>Kitchener development charge calculator with s.3.3 exemptions, RA credits, and affordable unit strategy.</p>
        <p className={s.heroDisclaimer}>Disclaimer: This tool provides estimates only. Always verify rates and exemptions with the City of Kitchener, Region of Waterloo, and other relevant authorities before making financial decisions.</p>
      </div>

      <div className={s.app}>
        <InputPanel inputs={inputs} setInputs={setInputs} />

        <main className={s.resultsCol}>
          {result ? (
            <ResultPanel inputs={inputs} result={result} />
          ) : (
            <div className={s.placeholder}>
              <div className={s.phTitle}>Configure &amp; Calculate</div>
              <div className={s.phSub}>Select your building type and project details. Results update live.</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
