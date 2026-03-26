/* DC Calculator V2 — Type definitions */

export type BuildingCategory = 'detached' | 'semi' | 'townhouse' | 'lodging' | 'apartment';
export type SubConfig = 'single' | 'duplex' | 'triplex' | 'fourplex';
export type ZoneKey = 'central' | 'suburban' | 'township';
export type SchoolBoard = 'wrdsb' | 'wcdsb' | 'both';
export type Tenure = 'rental' | 'own';
export type ProjectType = 'infill' | 'newbuild';
export type DeveloperType = 'private' | 'nonprofit';
export type DemolishedType = 'sfd' | 'semi' | 'th' | 'apt' | 'lodge' | 'none';
export type BedroomType = 1 | 2 | 3;

export interface DCInputs {
  category: BuildingCategory;
  detType: SubConfig;
  thType: SubConfig;
  semiUPS: 1 | 2 | 3 | 4;
  aptUnits: number;
  lodgeUnits: number;
  ptype: ProjectType;
  demolished: DemolishedType;
  zone: ZoneKey;
  br: BedroomType;
  tenure: Tenure;
  affordable: number;
  sb: SchoolBoard;
  dev: DeveloperType;
}

export interface UnitResult {
  side: string;
  unitNum: number;
  label: string;
  status: 'charged' | 'exempt' | 'credit';
  mechanism: string;
  cityDC: number;
  regionDC: number;
  eduDC: number;
  total: number;
  rateType: string;
  affEx?: boolean;
}

export interface DCResult {
  desc: string;
  units: UnitResult[];
  totalCharged: number;
  netDC: number;
  netPerDoor: number;
  affApplied: number;
  affReduction: number;
  raTotal: number;
  benchmark: number;
  total: number;
}
