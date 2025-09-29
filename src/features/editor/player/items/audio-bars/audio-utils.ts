export const getRMS = (spectrum: number[]) => {
  let rms = 0;

  // sum the squared amplitudes
  for (let i = 0; i < spectrum.length; i++) {
    rms += spectrum[i] * spectrum[i];
  }

  // divide by number of amplitudes to get average
  rms = rms / spectrum.length;

  // take square root of average to get rms
  rms = Math.sqrt(rms);

  return rms;
};

export const toDecibel = (v: number) => 20 * Math.log10(v);

export const range = (v: number, min: number, max: number) =>
  (v - min) / (max - min);

export const clamp = (v: number, min: number, max: number) => {
  return Math.max(Math.min(v, max), min);
};

// Default scaling factors from W3C getByteFrequencyData
const DEFAULT_MIN_DB = -100;
const DEFAULT_MAX_DB = -30;

export const processAudioFftValue: (
  v: number,
  options: {
    minDb?: number;
    maxDb?: number;
  }
) => number = (v, options = {}) => {
  const { minDb = DEFAULT_MIN_DB, maxDb = DEFAULT_MAX_DB } = options;

  // convert to decibels (will be in range [-Infinity, 0])
  const db = toDecibel(v);

  // scale to fit between min and max
  const scaled = clamp(range(db, minDb, maxDb), 0, 1);

  return scaled;
};
