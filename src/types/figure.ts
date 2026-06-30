// Figure and infographic types

export type FigureType = 'painting' | 'caricature' | 'map' | 'photograph' | 'stamp' | 'banner' | 'almanac' | 'illustration' | 'print'

export interface Figure {
  id: string
  number: string
  title: string
  artist?: string
  year?: string
  type: FigureType
  imagePath: string
  caption?: string
  sectionId: string
  examRelevance: 'high' | 'medium' | 'low'
  hotspots: Hotspot[]
  analysis: FigureAnalysis
}

export interface Hotspot {
  id: string
  x: number
  y: number
  label: string
  description: string
}

export interface FigureAnalysis {
  whatYouSee: string[]
  whatItMeans: string[]
  examTip: string
}
