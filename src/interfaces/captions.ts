export interface Word {
  end: number;
  start: number;
  word: string;
}
export interface CaptionsSegment {
  start: number;
  end: number;
  text: string;
  words: Word[];
}
export interface CaptionsData {
  segments: CaptionsSegment[];
}
