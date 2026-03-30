import type { MatchActivity } from '../../types/activity'

export const matchActivities: MatchActivity[] = [
  {
    id: 'match-001', type: 'match-following', sectionId: 's1', difficulty: 'easy', examRelevance: 'high', tags: ['napoleon', 'french-revolution'],
    title: 'Match the Napoleonic reform with its description',
    leftColumn: [
      { id: 'l1', text: 'Napoleonic Code (1804)' },
      { id: 'l2', text: 'Abolition of feudal system' },
      { id: 'l3', text: 'Uniform weights & measures' },
      { id: 'l4', text: 'Removal of guild restrictions' },
    ],
    rightColumn: [
      { id: 'r1', text: 'Freed peasants from serfdom and manorial dues' },
      { id: 'r2', text: 'Equality before law, abolished birth privileges' },
      { id: 'r3', text: 'Allowed free trade in towns' },
      { id: 'r4', text: 'Standardised measurements across regions' },
    ],
    correctPairs: [['l1', 'r2'], ['l2', 'r1'], ['l3', 'r4'], ['l4', 'r3']],
  },
  {
    id: 'match-002', type: 'match-following', sectionId: 's2', difficulty: 'medium', examRelevance: 'high', tags: ['key-person'],
    title: 'Match the historical figure with their role',
    leftColumn: [
      { id: 'l1', text: 'Giuseppe Mazzini' },
      { id: 'l2', text: 'Duke Metternich' },
      { id: 'l3', text: 'Friedrich List' },
      { id: 'l4', text: 'Ernst Renan' },
    ],
    rightColumn: [
      { id: 'r1', text: 'Hosted Congress of Vienna' },
      { id: 'r2', text: 'Wrote "What is a Nation?" (1882)' },
      { id: 'r3', text: 'Founded Young Italy and Young Europe' },
      { id: 'r4', text: 'Advocated for the Zollverein' },
    ],
    correctPairs: [['l1', 'r3'], ['l2', 'r1'], ['l3', 'r4'], ['l4', 'r2']],
  },
  {
    id: 'match-003', type: 'match-following', sectionId: 's2', difficulty: 'easy', examRelevance: 'high', tags: ['vocabulary'],
    title: 'Match the vocabulary word with its definition',
    leftColumn: [
      { id: 'l1', text: 'Absolutist' },
      { id: 'l2', text: 'Utopian' },
      { id: 'l3', text: 'Plebiscite' },
      { id: 'l4', text: 'Suffrage' },
    ],
    rightColumn: [
      { id: 'r1', text: 'The right to vote' },
      { id: 'r2', text: 'A direct vote to accept or reject a proposal' },
      { id: 'r3', text: 'A vision so ideal it is unlikely to exist' },
      { id: 'r4', text: 'Centralised, militarised monarchical government' },
    ],
    correctPairs: [['l1', 'r4'], ['l2', 'r3'], ['l3', 'r2'], ['l4', 'r1']],
  },
  {
    id: 'match-004', type: 'match-following', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['romanticism'],
    title: 'Match the cultural figure with their contribution to nationalism',
    leftColumn: [
      { id: 'l1', text: 'Grimm Brothers' },
      { id: 'l2', text: 'Karol Kurpinski' },
      { id: 'l3', text: 'Eugène Delacroix' },
      { id: 'l4', text: 'Johann Gottfried Herder' },
    ],
    rightColumn: [
      { id: 'r1', text: 'Popularised volksgeist (spirit of the nation)' },
      { id: 'r2', text: 'Collected German folktales to preserve culture' },
      { id: 'r3', text: 'Painted "The Massacre at Chios" for Greek cause' },
      { id: 'r4', text: 'Turned polonaise and mazurka into nationalist symbols' },
    ],
    correctPairs: [['l1', 'r2'], ['l2', 'r4'], ['l3', 'r3'], ['l4', 'r1']],
  },
  {
    id: 'match-005', type: 'match-following', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['germany', 'italy'],
    title: 'Match the leader with their role in unification',
    leftColumn: [
      { id: 'l1', text: 'Otto von Bismarck' },
      { id: 'l2', text: 'Count Cavour' },
      { id: 'l3', text: 'Giuseppe Garibaldi' },
      { id: 'l4', text: 'Victor Emmanuel II' },
    ],
    rightColumn: [
      { id: 'r1', text: 'King who was proclaimed ruler of united Italy' },
      { id: 'r2', text: 'Led the Expedition of the Thousand (Red Shirts)' },
      { id: 'r3', text: 'Used diplomatic alliance with France for Italy' },
      { id: 'r4', text: 'Unified Germany through "blood and iron"' },
    ],
    correctPairs: [['l1', 'r4'], ['l2', 'r3'], ['l3', 'r2'], ['l4', 'r1']],
  },
  {
    id: 'match-006', type: 'match-following', sectionId: 's4', difficulty: 'hard', examRelevance: 'high', tags: ['germany'],
    title: 'Match Bismarck\'s wars with their opponents and years',
    leftColumn: [
      { id: 'l1', text: 'First war (1864)' },
      { id: 'l2', text: 'Second war (1866)' },
      { id: 'l3', text: 'Third war (1870-71)' },
    ],
    rightColumn: [
      { id: 'r1', text: 'Austria' },
      { id: 'r2', text: 'France' },
      { id: 'r3', text: 'Denmark' },
    ],
    correctPairs: [['l1', 'r3'], ['l2', 'r1'], ['l3', 'r2']],
  },
  {
    id: 'match-007', type: 'match-following', sectionId: 's5', difficulty: 'medium', examRelevance: 'high', tags: ['symbols'],
    title: 'Match the Germania symbol with its meaning',
    leftColumn: [
      { id: 'l1', text: 'Broken chains' },
      { id: 'l2', text: 'Crown of oak leaves' },
      { id: 'l3', text: 'Sword' },
      { id: 'l4', text: 'Olive branch around sword' },
      { id: 'l5', text: 'Breastplate with eagle' },
    ],
    rightColumn: [
      { id: 'r1', text: 'Readiness to fight' },
      { id: 'r2', text: 'Being freed' },
      { id: 'r3', text: 'Symbol of German empire — strength' },
      { id: 'r4', text: 'Heroism' },
      { id: 'r5', text: 'Willingness to make peace' },
    ],
    correctPairs: [['l1', 'r2'], ['l2', 'r4'], ['l3', 'r1'], ['l4', 'r5'], ['l5', 'r3']],
  },
  {
    id: 'match-008', type: 'match-following', sectionId: 's5', difficulty: 'medium', examRelevance: 'high', tags: ['allegory'],
    title: 'Match the allegory/painting with its artist and year',
    leftColumn: [
      { id: 'l1', text: 'Germania (1848)' },
      { id: 'l2', text: 'The fallen Germania (1850)' },
      { id: 'l3', text: 'Germania guarding the Rhine (1860)' },
      { id: 'l4', text: 'Marianne (stamps, 1850)' },
    ],
    rightColumn: [
      { id: 'r1', text: 'Julius Hübner — defeat after failed revolution' },
      { id: 'r2', text: 'Philip Veit — hopeful, for Frankfurt parliament' },
      { id: 'r3', text: 'French Republic — red cap, tricolour, cockade' },
      { id: 'r4', text: 'Lorenz Clasen — militaristic, protecting the Rhine' },
    ],
    correctPairs: [['l1', 'r2'], ['l2', 'r1'], ['l3', 'r4'], ['l4', 'r3']],
  },
  {
    id: 'match-009', type: 'match-following', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['britain'],
    title: 'Match the British nation-building event with its year',
    leftColumn: [
      { id: 'l1', text: 'English parliament seizes power from monarchy' },
      { id: 'l2', text: 'Act of Union (England + Scotland)' },
      { id: 'l3', text: 'Wolfe Tone\'s failed revolt in Ireland' },
      { id: 'l4', text: 'Ireland forcibly incorporated into UK' },
    ],
    rightColumn: [
      { id: 'r1', text: '1707' },
      { id: 'r2', text: '1801' },
      { id: 'r3', text: '1688' },
      { id: 'r4', text: '1798' },
    ],
    correctPairs: [['l1', 'r3'], ['l2', 'r1'], ['l3', 'r4'], ['l4', 'r2']],
  },
  {
    id: 'match-010', type: 'match-following', sectionId: 's6', difficulty: 'medium', examRelevance: 'high', tags: ['balkans'],
    title: 'Match the concept with its description in the Balkans context',
    leftColumn: [
      { id: 'l1', text: 'Slavs' },
      { id: 'l2', text: 'Ottoman Empire' },
      { id: 'l3', text: 'Big-power rivalry' },
      { id: 'l4', text: 'Romantic nationalism' },
    ],
    rightColumn: [
      { id: 'r1', text: 'Controlled most of the Balkans, was disintegrating' },
      { id: 'r2', text: 'Russia, Germany, England, Austro-Hungary competed for control' },
      { id: 'r3', text: 'Broad term for the inhabitants of the Balkans' },
      { id: 'r4', text: 'Ideas that inspired Balkan peoples to demand independence' },
    ],
    correctPairs: [['l1', 'r3'], ['l2', 'r1'], ['l3', 'r2'], ['l4', 'r4']],
  },
]
