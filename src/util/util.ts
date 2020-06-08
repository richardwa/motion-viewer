import { parse } from './apache-index-parser';
import fetch from 'cross-fetch';

export type Item = {
  type: 'file' | 'directory',
  name: string,
  path: string,
  size: number,
  description: string,
  lastModified: string
};

export type Listing = {
  dir: string,
  files: Item[]
}

// parses an apache directory index
export const getListing = (url: string): Promise<Listing> =>
  fetch(url)
    .then(r => r.text())
    .then(t => parse(t));