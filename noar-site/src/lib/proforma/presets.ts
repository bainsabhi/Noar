import type { DCInputs } from './types';

export type PresetKey = 'detached' | 'semi' | 'townhouse' | 'apartment';

const BASE: DCInputs = {
  category: 'detached', detType: 'duplex', thType: 'duplex', semiUPS: 2,
  aptUnits: 8, lodgeUnits: 6, ptype: 'infill', demolished: 'sfd',
  zone: 'central', br: 2, tenure: 'rental', affordable: 0,
  sb: 'wrdsb', dev: 'private',
};

const PRESETS: Record<PresetKey, Partial<DCInputs>> = {
  detached:  { category: 'detached', detType: 'duplex' },
  semi:      { category: 'semi', semiUPS: 2 },
  townhouse: { category: 'townhouse', thType: 'duplex' },
  apartment: { category: 'apartment', aptUnits: 8 },
};

export function loadPreset(key: PresetKey): DCInputs {
  return { ...BASE, ...PRESETS[key] };
}
