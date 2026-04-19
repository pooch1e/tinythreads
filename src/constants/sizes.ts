import { BabySize } from '../types';

export const BABY_SIZES: Array<{
  label: string;
  sublabel: string;
  value: BabySize;
}> = [
  { label: '0-3m', sublabel: '50-62cm', value: '0-3m' },
  { label: '3-6m', sublabel: '62-68cm', value: '3-6m' },
  { label: '6-9m', sublabel: '68-74cm', value: '6-9m' },
  { label: '9-12m', sublabel: '74-80cm', value: '9-12m' },
  { label: '12-18m', sublabel: '80-86cm', value: '12-18m' },
  { label: '18-24m', sublabel: '86-92cm', value: '18-24m' },
  { label: '2-3y', sublabel: '92-98cm', value: '2-3y' },
  { label: '3-4y', sublabel: '98-104cm', value: '3-4y' },
];
