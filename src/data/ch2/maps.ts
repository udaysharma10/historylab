// Chapter 2: Nationalism in India — interactive map(s)
// Coordinates are % of the displayed image. The base map (India + faint
// neighbours) is rendered from public-domain Natural Earth data; each city's
// x/y was computed from its real latitude/longitude, so the pins are exact.
import type { MapDefinition } from '../ch1/maps'

export const ch2MapDefinitions: MapDefinition[] = [
  {
    id: 'india-national-movement',
    title: 'Centres of the Indian National Movement',
    subtitle: 'Satyagrahas, Congress sessions and the Civil Disobedience Movement',
    imagePath: '/images/ch2/india-national-movement-map.png',
    sectionId: 's3',
    sectionColor: '#C2893E',
    examTip: 'CBSE Map Question (2 marks): be ready to LOCATE and LABEL on the political map of India — Congress sessions (Calcutta 1920, Nagpur 1920, Lahore 1929) and movement centres (Champaran, Kheda, Ahmedabad, Amritsar, Chauri Chaura, Dandi).',
    regions: [
      { id: 'amritsar', label: 'Amritsar', x: 28.6, y: 16.6, width: 6, height: 4,
        description: 'Amritsar, Punjab — site of the Jallianwala Bagh massacre (13 April 1919), when General Dyer\'s troops fired on a peaceful gathering, killing hundreds.' },
      { id: 'lahore', label: 'Lahore', x: 26.5, y: 16.9, width: 6, height: 4,
        description: 'Lahore — Congress session of December 1929 where "Purna Swaraj" (complete independence) was declared; 26 January 1930 was fixed as the first Independence Day.' },
      { id: 'champaran', label: 'Champaran', x: 66.5, y: 32.4, width: 6, height: 4,
        description: 'Champaran, Bihar (1917) — Gandhi\'s first satyagraha in India, supporting peasants forced to grow indigo under the oppressive tinkathia system.' },
      { id: 'chauri-chaura', label: 'Chauri Chaura', x: 61.9, y: 32.4, width: 6, height: 4,
        description: 'Chauri Chaura, United Provinces (Feb 1922) — a crowd set fire to a police station; in response Gandhi called off the Non-Cooperation Movement.' },
      { id: 'ahmedabad', label: 'Ahmedabad', x: 19.9, y: 43.9, width: 6, height: 4,
        description: 'Ahmedabad, Gujarat (1918) — Gandhi led a satyagraha of cotton mill workers demanding higher wages.' },
      { id: 'kheda', label: 'Kheda', x: 20.3, y: 44.8, width: 6, height: 4,
        description: 'Kheda, Gujarat (1918) — peasant satyagraha; Gandhi supported farmers who could not pay revenue after their crops failed.' },
      { id: 'nagpur', label: 'Nagpur', x: 44.5, y: 49.9, width: 6, height: 4,
        description: 'Nagpur — Congress session of December 1920 that adopted the Non-Cooperation Movement.' },
      { id: 'dandi', label: 'Dandi', x: 20.5, y: 50.6, width: 6, height: 4,
        description: 'Dandi, Gujarat (1930) — end-point of Gandhi\'s Salt March; he broke the salt law here, launching the Civil Disobedience Movement.' },
      { id: 'calcutta', label: 'Calcutta', x: 79.5, y: 45.4, width: 6, height: 4,
        description: 'Calcutta — special Congress session of September 1920 that adopted the Non-Cooperation programme.' },
    ],
  },
]

export function getCh2MapById(id: string): MapDefinition | undefined {
  return ch2MapDefinitions.find(m => m.id === id)
}

export function getCh2MapsBySection(sectionId: string): MapDefinition[] {
  return ch2MapDefinitions.filter(m => m.sectionId === sectionId)
}
