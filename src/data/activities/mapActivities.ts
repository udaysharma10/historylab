import type { MapIdentifyActivity, MapLabelActivity } from '../../types/activity'

export const mapIdentifyActivities: MapIdentifyActivity[] = [
  {
    id: 'map-id-001', type: 'map-identify', sectionId: 's1', difficulty: 'easy', examRelevance: 'high', tags: ['congress-of-vienna'],
    mapId: 'europe-1815',
    question: 'Identify the country where the Bourbon dynasty was restored after the Congress of Vienna (1815).',
    correctRegionId: 'france',
    hints: ['This country had the French Revolution in 1789', 'The Bourbon dynasty had ruled here before Napoleon'],
  },
  {
    id: 'map-id-002', type: 'map-identify', sectionId: 's1', difficulty: 'medium', examRelevance: 'high', tags: ['congress-of-vienna'],
    mapId: 'europe-1815',
    question: 'Identify the empire that was given control of northern Italy by the Congress of Vienna.',
    correctRegionId: 'austrian-empire',
    hints: ['This empire was a patchwork of many regions and peoples', 'It was headed by the Habsburg dynasty'],
  },
  {
    id: 'map-id-003', type: 'map-identify', sectionId: 's2', difficulty: 'medium', examRelevance: 'medium', tags: ['congress-of-vienna'],
    mapId: 'europe-1815',
    question: 'Identify the empire that received part of Poland at the Congress of Vienna.',
    correctRegionId: 'russian-empire',
    hints: ['The largest empire by area in Europe', 'Located to the east'],
  },
  {
    id: 'map-id-004', type: 'map-identify', sectionId: 's4', difficulty: 'easy', examRelevance: 'high', tags: ['germany'],
    mapId: 'germany-unification',
    question: 'Identify Prussia — the state that led German unification.',
    correctRegionId: 'prussia',
    hints: ['It was the largest German state', 'Located in the north-east'],
  },
  {
    id: 'map-id-005', type: 'map-identify', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['italy'],
    mapId: 'italy-before',
    question: 'Identify Sardinia-Piedmont — the only Italian state with an Italian princely house.',
    correctRegionId: 'sardinia-piedmont',
    hints: ['Located in the north-west of Italy', 'It includes the island of Sardinia'],
  },
  {
    id: 'map-id-006', type: 'map-identify', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['italy'],
    mapId: 'italy-before',
    question: 'Identify the Kingdom of the Two Sicilies — conquered by Garibaldi in 1860.',
    correctRegionId: 'two-sicilies',
    hints: ['Located in southern Italy', 'It was under Bourbon kings of Spain'],
  },
  {
    id: 'map-id-007', type: 'map-identify', sectionId: 's6', difficulty: 'medium', examRelevance: 'high', tags: ['balkans'],
    mapId: 'europe-1815',
    question: 'Identify the Ottoman Empire — which controlled most of the Balkans.',
    correctRegionId: 'ottoman-empire',
    hints: ['Located in south-eastern Europe and beyond', 'Its disintegration led to Balkan tensions'],
  },
]

export const mapLabelActivities: MapLabelActivity[] = [
  {
    id: 'map-lb-001', type: 'map-label', sectionId: 's1', difficulty: 'medium', examRelevance: 'high', tags: ['congress-of-vienna'],
    mapId: 'europe-1815',
    instruction: 'Label the major empires and kingdoms on the map of Europe after the Congress of Vienna (1815).',
    labels: [
      { id: 'lb1', text: 'France (Bourbon restored)', correctRegionId: 'france' },
      { id: 'lb2', text: 'Russian Empire', correctRegionId: 'russian-empire' },
      { id: 'lb3', text: 'Austrian Empire', correctRegionId: 'austrian-empire' },
      { id: 'lb4', text: 'Prussia', correctRegionId: 'prussia' },
      { id: 'lb5', text: 'Ottoman Empire', correctRegionId: 'ottoman-empire' },
    ],
  },
  {
    id: 'map-lb-002', type: 'map-label', sectionId: 's4', difficulty: 'hard', examRelevance: 'high', tags: ['italy'],
    mapId: 'italy-before',
    instruction: 'Label the seven Italian states before unification (1858).',
    labels: [
      { id: 'lb1', text: 'Sardinia-Piedmont', correctRegionId: 'sardinia-piedmont' },
      { id: 'lb2', text: 'Lombardy', correctRegionId: 'lombardy' },
      { id: 'lb3', text: 'Venetia', correctRegionId: 'venetia' },
      { id: 'lb4', text: 'Papal State', correctRegionId: 'papal-state' },
      { id: 'lb5', text: 'Kingdom of Two Sicilies', correctRegionId: 'two-sicilies' },
      { id: 'lb6', text: 'Tuscany', correctRegionId: 'tuscany' },
      { id: 'lb7', text: 'Modena', correctRegionId: 'modena' },
    ],
  },
  {
    id: 'map-lb-003', type: 'map-label', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['germany'],
    mapId: 'germany-unification',
    instruction: 'Label the key territories in the unification of Germany (1866-71).',
    labels: [
      { id: 'lb1', text: 'Prussia', correctRegionId: 'prussia' },
      { id: 'lb2', text: 'Bavaria', correctRegionId: 'bavaria' },
      { id: 'lb3', text: 'Austrian Empire (excluded)', correctRegionId: 'austrian-empire' },
      { id: 'lb4', text: 'Schleswig-Holstein', correctRegionId: 'schleswig-holstein' },
    ],
  },
]
