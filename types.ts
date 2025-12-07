export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface NewsData {
  country: string;
  headline: string;
  summary: string;
  imageUrl: string;
  sources: {
    title: string;
    url: string;
  }[];
  timestamp: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  SEARCHING = 'SEARCHING',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR',
}