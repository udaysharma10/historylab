import type { TimelinePlaceActivity } from '../../types/activity'

export const timelineActivities: TimelinePlaceActivity[] = [
  {
    id: 'tl-001', type: 'timeline-place', sectionId: 's1', difficulty: 'easy', examRelevance: 'high', tags: ['french-revolution', 'napoleon'],
    instruction: 'Place these events from the French Revolution and Napoleonic era in the correct chronological order.',
    events: [
      { id: 'e1', label: 'French Revolution begins', year: 1789, description: 'The first clear expression of nationalism — transfer of sovereignty from monarchy to citizens.' },
      { id: 'e2', label: 'Napoleonic Code introduced', year: 1804, description: 'Civil Code establishing equality before law, abolishing birth privileges.' },
      { id: 'e3', label: 'Battle of Leipzig', year: 1813, description: 'Napoleon\'s major defeat — beginning of his decline.' },
      { id: 'e4', label: 'Napoleon\'s final defeat at Waterloo', year: 1815, description: 'End of the Napoleonic era.' },
    ],
  },
  {
    id: 'tl-002', type: 'timeline-place', sectionId: 's2', difficulty: 'medium', examRelevance: 'high', tags: ['congress-of-vienna', 'key-person'],
    instruction: 'Place these events of the post-Napoleon conservative era in order.',
    events: [
      { id: 'e1', label: 'Congress of Vienna', year: 1815, description: 'European powers meet to undo Napoleonic changes.' },
      { id: 'e2', label: 'Greek war of independence begins', year: 1821, description: 'Greeks begin their struggle against the Ottoman Empire.' },
      { id: 'e3', label: 'Mazzini founds Young Italy', year: 1831, description: 'Secret society founded in Marseilles for Italian unification.' },
      { id: 'e4', label: 'Mazzini founds Young Europe', year: 1833, description: 'International revolutionary society founded in Berne.' },
      { id: 'e5', label: 'Zollverein (customs union) formed', year: 1834, description: 'Prussian-led customs union that abolished tariff barriers.' },
    ],
  },
  {
    id: 'tl-003', type: 'timeline-place', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['revolution'],
    instruction: 'Place these revolutionary events of the 1830s-1840s in chronological order.',
    events: [
      { id: 'e1', label: 'July Revolution in France (Louis Philippe)', year: 1830, description: 'Bourbon kings overthrown, constitutional monarchy installed.' },
      { id: 'e2', label: 'Belgium breaks from Netherlands', year: 1830, description: 'Inspired by the July Revolution in France.' },
      { id: 'e3', label: 'Treaty of Constantinople (Greek independence)', year: 1832, description: 'Greece recognised as an independent nation.' },
      { id: 'e4', label: 'Silesian weavers\' revolt', year: 1845, description: 'Weavers revolt against contractors who reduced payments.' },
      { id: 'e5', label: 'Revolutions of 1848 (Frankfurt parliament)', year: 1848, description: '831 representatives convene to draft a German constitution.' },
    ],
  },
  {
    id: 'tl-004', type: 'timeline-place', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['germany'],
    instruction: 'Place the key events of German unification in chronological order.',
    events: [
      { id: 'e1', label: 'Frankfurt parliament fails', year: 1848, description: 'Friedrich Wilhelm IV rejects the crown.' },
      { id: 'e2', label: 'War with Denmark', year: 1864, description: 'Bismarck\'s first war for unification.' },
      { id: 'e3', label: 'Austro-Prussian War', year: 1866, description: 'Austria excluded from the German Confederation.' },
      { id: 'e4', label: 'Franco-Prussian War begins', year: 1870, description: 'The final war that completed unification.' },
      { id: 'e5', label: 'German Empire proclaimed at Versailles', year: 1871, description: 'Kaiser William I proclaimed Emperor.' },
    ],
  },
  {
    id: 'tl-005', type: 'timeline-place', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['italy'],
    instruction: 'Place the key events of Italian unification in chronological order.',
    events: [
      { id: 'e1', label: 'Mazzini\'s Young Italy founded', year: 1831, description: 'Republican programme for Italian unification.' },
      { id: 'e2', label: 'Sardinia-Piedmont defeats Austria', year: 1859, description: 'Cavour\'s alliance with France defeats Austrian forces.' },
      { id: 'e3', label: 'Garibaldi\'s Expedition of the Thousand', year: 1860, description: 'Red Shirts march into South Italy.' },
      { id: 'e4', label: 'Victor Emmanuel II proclaimed king of Italy', year: 1861, description: 'United Italy proclaimed (except Venetia and Rome).' },
      { id: 'e5', label: 'Papal States join Italy', year: 1870, description: 'Rome joins after France withdraws troops during Franco-Prussian War.' },
    ],
  },
  {
    id: 'tl-006', type: 'timeline-place', sectionId: 's1', difficulty: 'hard', examRelevance: 'high', tags: ['full-chapter'],
    instruction: 'Place these major events from across the chapter in chronological order.',
    events: [
      { id: 'e1', label: 'French Revolution', year: 1789, description: 'First clear expression of nationalism.' },
      { id: 'e2', label: 'Congress of Vienna', year: 1815, description: 'Conservative powers redraw Europe.' },
      { id: 'e3', label: 'Revolutions across Europe', year: 1848, description: 'Liberal and nationalist uprisings.' },
      { id: 'e4', label: 'Unification of Italy', year: 1861, description: 'Victor Emmanuel II proclaimed king.' },
      { id: 'e5', label: 'Unification of Germany', year: 1871, description: 'German Empire proclaimed at Versailles.' },
      { id: 'e6', label: 'Slav nationalism in Balkans intensifies', year: 1905, description: 'Tensions that would lead to WWI.' },
    ],
  },
  {
    id: 'tl-007', type: 'timeline-place', sectionId: 's4', difficulty: 'hard', examRelevance: 'high', tags: ['britain'],
    instruction: 'Place these events in British nation-building in chronological order.',
    events: [
      { id: 'e1', label: 'English parliament seizes power from monarchy', year: 1688, description: 'The Glorious Revolution.' },
      { id: 'e2', label: 'Act of Union (England + Scotland)', year: 1707, description: 'Formation of United Kingdom of Great Britain.' },
      { id: 'e3', label: 'Wolfe Tone\'s revolt in Ireland', year: 1798, description: 'Failed revolt of the United Irishmen.' },
      { id: 'e4', label: 'Ireland forcibly incorporated into UK', year: 1801, description: 'Ireland becomes part of the United Kingdom.' },
    ],
  },
]
