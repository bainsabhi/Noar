import type { DCInputs, DCResult } from './types';

function fmt(n: number): string {
  return n === 0 ? '$0' : '$' + Math.round(n).toLocaleString();
}

/* ═══════ CSV Export ═══════ */

export function exportCSV(p: DCInputs, r: DCResult): void {
  const lines: string[] = [];
  const add = (l: string, v: string) => lines.push(`"${l}","${v}"`);
  const blank = () => lines.push('');

  add('DC CALCULATOR SUMMARY', '');
  add('Description', r.desc);
  blank();

  add('=== SUMMARY ===', '');
  add('Net DC Owing', fmt(r.netDC));
  add('Per Door', fmt(r.netPerDoor));
  add('Gross DC (Chargeable)', fmt(r.totalCharged));
  add('RA Credit', fmt(r.raTotal));
  add('Benchmark (no exemptions)', fmt(r.benchmark));
  add('Savings vs Benchmark', fmt(r.benchmark - r.netDC));
  if (r.affApplied > 0) {
    add('Affordable Units Applied', String(r.affApplied));
    add('Affordable Reduction', fmt(r.affReduction));
  }
  blank();

  add('=== UNIT BREAKDOWN ===', '');
  lines.push('"Side","Unit","Label","Status","Mechanism","City DC","Region DC","Edu DC","Total"');
  r.units.forEach(u => {
    const status = u.affEx ? 'AFFORDABLE' : u.status === 'exempt' ? 'EXEMPT' : u.status === 'credit' ? 'RA CREDIT' : 'CHARGED';
    lines.push(`"${u.side}","${u.unitNum}","${u.label}","${status}","${u.mechanism}","${fmt(u.cityDC)}","${fmt(u.regionDC)}","${fmt(u.eduDC)}","${fmt(u.total)}"`);
  });
  blank();

  add('=== CONFIGURATION ===', '');
  add('Category', p.category);
  add('Zone', p.zone);
  add('School Board', p.sb);
  add('Bedroom Type', `${p.br}BR`);
  add('Tenure', p.tenure);
  add('Developer', p.dev);
  add('Project Type', p.ptype);
  if (p.ptype === 'infill') add('Demolished', p.demolished);

  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'dc_calculator_export.csv';
  a.click();
  URL.revokeObjectURL(url);
}

/* ═══════ PDF Export ═══════ */

export function exportPDF(containerId: string, filename: string): void {
  const el = document.getElementById(containerId);
  if (!el) return;

  // Clone children only — skip the hidden container's own class
  const wrapper = document.createElement('div');
  Array.from(el.children).forEach(child => {
    wrapper.appendChild(child.cloneNode(true));
  });

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const styles = Array.from(document.styleSheets)
    .map(sheet => {
      try { return Array.from(sheet.cssRules).map(r => r.cssText).join('\n'); }
      catch { return ''; }
    })
    .join('\n');

  printWindow.document.write(`<!DOCTYPE html>
<html><head><title>${filename}</title>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<style>
${styles}
body { padding: 32px; background: white; font-family: 'DM Sans', sans-serif; max-width: 960px; margin: 0 auto; }
.watermark {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  pointer-events: none; z-index: 9999;
}
.watermark span {
  font-family: 'DM Sans', sans-serif; font-size: 82px; font-weight: 600;
  color: rgba(0,0,0,0.04); transform: rotate(-35deg);
  white-space: nowrap; letter-spacing: 0.08em;
  text-shadow: 0 1px 3px rgba(0,0,0,0.015);
}
@media print {
  body { padding: 16px; }
  * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
  .watermark { position: fixed; }
}
</style>
</head><body><div class="watermark"><span>buildnoar.ca</span></div>${wrapper.innerHTML}</body></html>`);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => { printWindow.print(); printWindow.close(); }, 600);
}
