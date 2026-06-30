import type { MapIdentifyActivity, MapLabelActivity } from '../../../types/activity'

// "Identify" = tap the correct city. Uses well-separated cities so the tap
// target is unambiguous on a national map (clustered Gujarat cities are
// practised via the label activity instead).
export const ch2MapIdentifyActivities: MapIdentifyActivity[] = [
  {
    id: 'ch2-map-id-001', type: 'map-identify', sectionId: 's1', difficulty: 'easy', examRelevance: 'high', tags: ['jallianwala'],
    mapId: 'india-national-movement',
    question: 'Identify the city where the Jallianwala Bagh massacre took place on 13 April 1919.',
    correctRegionId: 'amritsar',
    hints: ['It is in Punjab, in the north-west', 'General Dyer ordered the firing here'],
  },
  {
    id: 'ch2-map-id-002', type: 'map-identify', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['salt-march'],
    mapId: 'india-national-movement',
    question: 'Identify the coastal town where Gandhi broke the salt law in 1930, launching the Civil Disobedience Movement.',
    correctRegionId: 'dandi',
    hints: ['On the Gujarat coast', 'End-point of the 240-mile Salt March from Sabarmati'],
  },
  {
    id: 'ch2-map-id-003', type: 'map-identify', sectionId: 's1', difficulty: 'medium', examRelevance: 'high', tags: ['champaran'],
    mapId: 'india-national-movement',
    question: 'Identify the place in Bihar where Gandhi led his first satyagraha in India (1917).',
    correctRegionId: 'champaran',
    hints: ['In Bihar, in the north', 'Indigo planters\' movement'],
  },
  {
    id: 'ch2-map-id-004', type: 'map-identify', sectionId: 's1', difficulty: 'medium', examRelevance: 'high', tags: ['non-cooperation'],
    mapId: 'india-national-movement',
    question: 'Identify the city where a violent clash in February 1922 led Gandhi to call off the Non-Cooperation Movement.',
    correctRegionId: 'chauri-chaura',
    hints: ['In the United Provinces (Uttar Pradesh)', 'A police station was set on fire'],
  },
  {
    id: 'ch2-map-id-005', type: 'map-identify', sectionId: 's1', difficulty: 'easy', examRelevance: 'medium', tags: ['congress-session'],
    mapId: 'india-national-movement',
    question: 'Identify the eastern city where the special Congress session of September 1920 adopted Non-Cooperation.',
    correctRegionId: 'calcutta',
    hints: ['Capital of Bengal', 'On the eastern side of the map'],
  },
]

// "Label" = name the highlighted markers. Works even for clustered cities,
// since each marker is shown one at a time.
export const ch2MapLabelActivities: MapLabelActivity[] = [
  {
    id: 'ch2-map-lb-001', type: 'map-label', sectionId: 's1', difficulty: 'medium', examRelevance: 'high', tags: ['congress-session'],
    mapId: 'india-national-movement',
    instruction: 'Label the three Indian National Congress sessions on the map.',
    labels: [
      { id: 'lb1', text: 'Calcutta (Sept 1920)', correctRegionId: 'calcutta' },
      { id: 'lb2', text: 'Nagpur (Dec 1920)', correctRegionId: 'nagpur' },
      { id: 'lb3', text: 'Lahore (Dec 1929)', correctRegionId: 'lahore' },
    ],
  },
  {
    id: 'ch2-map-lb-002', type: 'map-label', sectionId: 's3', difficulty: 'hard', examRelevance: 'high', tags: ['satyagraha'],
    mapId: 'india-national-movement',
    instruction: 'Label the early satyagraha centres led by Gandhi.',
    labels: [
      { id: 'lb1', text: 'Champaran (indigo planters)', correctRegionId: 'champaran' },
      { id: 'lb2', text: 'Kheda (peasants)', correctRegionId: 'kheda' },
      { id: 'lb3', text: 'Ahmedabad (mill workers)', correctRegionId: 'ahmedabad' },
    ],
  },
  {
    id: 'ch2-map-lb-003', type: 'map-label', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['civil-disobedience'],
    mapId: 'india-national-movement',
    instruction: 'Label the key sites of mass protest.',
    labels: [
      { id: 'lb1', text: 'Amritsar (Jallianwala Bagh)', correctRegionId: 'amritsar' },
      { id: 'lb2', text: 'Chauri Chaura', correctRegionId: 'chauri-chaura' },
      { id: 'lb3', text: 'Dandi (Salt March)', correctRegionId: 'dandi' },
    ],
  },
]
