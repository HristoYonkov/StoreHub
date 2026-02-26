export const COLOR_MAP: Record<string, string> = {
  Black: '#222222',
  White: '#f5f5f5',
  Brown: '#8B4513',
  Tan: '#d2b48c',
  Beige: '#e8dcc8',
  Navy: '#1a2e4a',
  Olive: '#556b2f',
  Grey: '#9e9e9e',
  Cognac: '#c47c2b',
  Camel: '#c19a6b',
  Red: '#cc2200',
  Blue: '#4a6fa5',
}

export function getColor(color: string): string {
  return COLOR_MAP[color] ?? '#cccccc'
}