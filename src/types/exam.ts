
export interface Question {
  type: string;
  content: string;
}

export interface UserAnswer {
  [questionIndex: number]: any;
}

export interface CompletionStatus {
  [questionIndex: number]: boolean;
}

export interface DrawingData {
  strokes: Stroke[];
}

export interface Stroke {
  points: Point[];
  color: string;
  width: number;
}

export interface Point {
  x: number;
  y: number;
}
