import type { MCQActivity, FillBlankActivity, TrueFalseActivity } from '../../types/activity'

export const mcqActivities: MCQActivity[] = [
  // === SECTION 1 ===
  {
    id: 'mcq-001', type: 'mcq', sectionId: 's1', difficulty: 'easy', examRelevance: 'high', tags: ['french-revolution'],
    question: 'Who prepared a series of four prints visualising "democratic and social Republics" in 1848?',
    options: ['Eugène Delacroix', 'Frédéric Sorrieu', 'Philip Veit', 'Karl Kaspar Fritz'],
    correctIndex: 1, explanation: 'Frédéric Sorrieu, a French artist, prepared these prints in 1848 showing peoples of Europe and America marching towards the Statue of Liberty.', hints: ['He was a French artist', 'His print is the first figure in the chapter'],
  },
  {
    id: 'mcq-002', type: 'mcq', sectionId: 's1', difficulty: 'easy', examRelevance: 'high', tags: ['napoleon'],
    question: 'The Civil Code of 1804 is also known as:',
    options: ['The French Code', 'The Revolutionary Code', 'The Napoleonic Code', 'The Vienna Code'],
    correctIndex: 2, explanation: 'The Civil Code of 1804 is usually known as the Napoleonic Code. It established equality before law, abolished birth privileges, and secured property rights.', hints: ['Named after the ruler who introduced it'],
  },
  {
    id: 'mcq-003', type: 'mcq', sectionId: 's1', difficulty: 'medium', examRelevance: 'high', tags: ['french-revolution'],
    question: 'Which of the following was NOT a measure taken by French revolutionaries to forge collective identity?',
    options: ['A new tricolour flag', 'Centralised administrative system', 'Uniform system of weights and measures', 'Granting equal voting rights to all women'],
    correctIndex: 3, explanation: 'Women were NOT granted voting rights. The Napoleonic Code actually reduced women to the status of a minor. All other options were measures taken by the revolutionaries.', hints: ['Think about who was excluded from political rights'],
  },
  {
    id: 'mcq-004', type: 'mcq', sectionId: 's1', difficulty: 'medium', examRelevance: 'high', tags: ['napoleon'],
    question: 'Why did the initial enthusiasm of the people in conquered territories towards French rule turn to hostility?',
    options: ['Napoleon gave them independence', 'Increased taxation, censorship and forced conscription', 'The Napoleonic Code was too liberal', 'Napoleon distributed all land to peasants'],
    correctIndex: 1, explanation: 'The new administrative arrangements did not go hand in hand with political freedom. Increased taxation, censorship, and forced conscription outweighed the benefits.', hints: ['Think about the negative impacts of Napoleon\'s rule'],
  },

  // === SECTION 2 ===
  {
    id: 'mcq-005', type: 'mcq', sectionId: 's2', difficulty: 'easy', examRelevance: 'high', tags: ['liberalism'],
    question: 'The term "liberalism" derives from the Latin root "liber" which means:',
    options: ['Equal', 'Free', 'Liberal', 'Law'],
    correctIndex: 1, explanation: 'Liberalism derives from the Latin root liber meaning free. For the new middle classes, it stood for freedom of the individual and equality before the law.', hints: ['Think of the English word "liberate"'],
  },
  {
    id: 'mcq-006', type: 'mcq', sectionId: 's2', difficulty: 'medium', examRelevance: 'high', tags: ['economic-nationalism'],
    question: 'The Zollverein, formed in 1834, was a:',
    options: ['Military alliance', 'Customs union', 'Political parliament', 'Secret revolutionary society'],
    correctIndex: 1, explanation: 'The Zollverein was a customs union formed at the initiative of Prussia. It abolished tariff barriers and reduced the number of currencies from over thirty to two.', hints: ['It dealt with trade and tariffs'],
  },
  {
    id: 'mcq-007', type: 'mcq', sectionId: 's2', difficulty: 'easy', examRelevance: 'high', tags: ['congress-of-vienna'],
    question: 'The Congress of Vienna (1815) was hosted by:',
    options: ['Napoleon Bonaparte', 'Tsar Alexander I', 'Duke Metternich', 'Friedrich Wilhelm IV'],
    correctIndex: 2, explanation: 'The Congress was hosted by the Austrian Chancellor Duke Metternich. Representatives of Britain, Russia, Prussia and Austria drew up the settlement.', hints: ['He was the Austrian Chancellor'],
  },
  {
    id: 'mcq-008', type: 'mcq', sectionId: 's2', difficulty: 'medium', examRelevance: 'high', tags: ['key-person'],
    question: 'Giuseppe Mazzini founded which two secret societies?',
    options: ['Carbonari and Young Italy', 'Young Italy and Young Europe', 'Young Europe and the Zollverein', 'The Carbonari and Young Europe'],
    correctIndex: 1, explanation: 'Mazzini founded Young Italy in Marseilles (1831) and Young Europe in Berne (1833). He was earlier a member of the Carbonari.', hints: ['Both had "Young" in the name'],
  },

  // === SECTION 3 ===
  {
    id: 'mcq-009', type: 'mcq', sectionId: 's3', difficulty: 'easy', examRelevance: 'high', tags: ['revolution'],
    question: 'The July Revolution of 1830 in France installed which ruler?',
    options: ['Napoleon III', 'Louis Philippe', 'Friedrich Wilhelm IV', 'Metternich'],
    correctIndex: 1, explanation: 'The Bourbon kings were overthrown and a constitutional monarchy was installed with Louis Philippe at its head.', hints: ['He became a constitutional monarch'],
  },
  {
    id: 'mcq-010', type: 'mcq', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['greece'],
    question: 'Which treaty recognised Greece as an independent nation?',
    options: ['Treaty of Vienna (1815)', 'Treaty of Constantinople (1832)', 'Treaty of Versailles (1871)', 'Treaty of Paris (1856)'],
    correctIndex: 1, explanation: 'The Treaty of Constantinople of 1832 recognised Greece as an independent nation after its struggle against the Ottoman Empire.', hints: ['It was signed in 1832 in a famous city'],
  },
  {
    id: 'mcq-011', type: 'mcq', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['romanticism'],
    question: 'Johann Gottfried Herder believed that the true spirit of a nation (volksgeist) was found in:',
    options: ['Royal courts and palaces', 'Universities and libraries', 'Folk songs, poetry and dances of common people', 'Military victories and conquests'],
    correctIndex: 2, explanation: 'Herder claimed true German culture was to be discovered among the common people — das volk. Folk culture carried the true spirit of the nation.', hints: ['Think of the common people — das volk'],
  },
  {
    id: 'mcq-012', type: 'mcq', sectionId: 's3', difficulty: 'hard', examRelevance: 'high', tags: ['revolution'],
    question: 'The Frankfurt parliament (1848) was convened in:',
    options: ['The Berlin Palace', 'The Church of St Paul', 'The Vienna Opera House', 'The Hall of Mirrors, Versailles'],
    correctIndex: 1, explanation: '831 elected representatives convened in the Church of St Paul, Frankfurt on 18 May 1848 to draft a constitution for a united Germany.', hints: ['It was a religious building in Frankfurt'],
  },
  {
    id: 'mcq-013', type: 'mcq', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['revolution'],
    question: 'Why did Friedrich Wilhelm IV reject the crown offered by the Frankfurt parliament?',
    options: ['He wanted to be Emperor of Austria instead', 'He would not accept a crown from a parliament elected by "the people"', 'He was already King of Bavaria', 'The crown was offered by Napoleon'],
    correctIndex: 1, explanation: 'Friedrich Wilhelm IV, King of Prussia, rejected the crown and joined other monarchs to oppose the elected assembly. He would not accept a crown "from the gutter".', hints: ['He was a monarch who did not respect democratic assemblies'],
  },

  // === SECTION 4 ===
  {
    id: 'mcq-014', type: 'mcq', sectionId: 's4', difficulty: 'easy', examRelevance: 'high', tags: ['germany'],
    question: 'Who was the architect of German unification?',
    options: ['Giuseppe Mazzini', 'Otto von Bismarck', 'Kaiser William I', 'Friedrich Wilhelm IV'],
    correctIndex: 1, explanation: 'Otto von Bismarck, Chief Minister of Prussia, was the architect of German unification. He carried it out with the Prussian army and bureaucracy through three wars.', hints: ['He was the Chief Minister of Prussia'],
  },
  {
    id: 'mcq-015', type: 'mcq', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['germany'],
    question: 'The German Empire was proclaimed in 1871 at:',
    options: ['The Church of St Paul, Frankfurt', 'The Reichstag, Berlin', 'The Hall of Mirrors, Versailles', 'The Vienna Congress Hall'],
    correctIndex: 2, explanation: 'On 18 January 1871, Kaiser William I was proclaimed German Emperor in the Hall of Mirrors at the Palace of Versailles — a deliberate humiliation of France.', hints: ['It was in a famous French palace'],
  },
  {
    id: 'mcq-016', type: 'mcq', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['italy'],
    question: 'Which Italian state led the process of unification?',
    options: ['Kingdom of Both Sicilies', 'Papal State', 'Sardinia-Piedmont', 'Tuscany'],
    correctIndex: 2, explanation: 'Sardinia-Piedmont, the only Italian state ruled by an Italian princely house, led the unification under King Victor Emmanuel II and Chief Minister Cavour.', hints: ['It was the only state with Italian rulers'],
  },
  {
    id: 'mcq-017', type: 'mcq', sectionId: 's4', difficulty: 'easy', examRelevance: 'high', tags: ['italy'],
    question: 'Garibaldi\'s volunteers were popularly known as:',
    options: ['Blue Coats', 'Red Shirts', 'Black Shirts', 'White Guards'],
    correctIndex: 1, explanation: 'Garibaldi\'s armed volunteers who marched into South Italy in 1860 were popularly known as Red Shirts. They grew from about 1,000 to 30,000.', hints: ['Named after the colour of their clothing'],
  },
  {
    id: 'mcq-018', type: 'mcq', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['britain'],
    question: 'The Act of Union (1707) united:',
    options: ['England and Wales', 'England and Ireland', 'England and Scotland', 'All of the British Isles'],
    correctIndex: 2, explanation: 'The Act of Union (1707) between England and Scotland resulted in the formation of the "United Kingdom of Great Britain".', hints: ['It involved two of the three main parts of Great Britain'],
  },

  // === SECTION 5 ===
  {
    id: 'mcq-019', type: 'mcq', sectionId: 's5', difficulty: 'easy', examRelevance: 'high', tags: ['allegory'],
    question: 'Marianne and Germania are examples of:',
    options: ['Real historical women', 'Female allegories of nations', 'Queens of France and Germany', 'Romantic painters'],
    correctIndex: 1, explanation: 'Marianne (France) and Germania (Germany) are female allegories — symbolic female figures used to personify their respective nations.', hints: ['They represent abstract ideas, not real people'],
  },
  {
    id: 'mcq-020', type: 'mcq', sectionId: 's5', difficulty: 'medium', examRelevance: 'high', tags: ['symbols'],
    question: 'In the allegory of Germania, the crown of oak leaves symbolises:',
    options: ['Royalty', 'Peace', 'Heroism', 'Wealth'],
    correctIndex: 2, explanation: 'The crown of oak leaves symbolises heroism — the German oak stands for bravery.', hints: ['The German oak is associated with bravery'],
  },

  // === SECTION 6 ===
  {
    id: 'mcq-021', type: 'mcq', sectionId: 's6', difficulty: 'medium', examRelevance: 'high', tags: ['balkans'],
    question: 'The inhabitants of the Balkans were broadly known as:',
    options: ['Gauls', 'Slavs', 'Celts', 'Franks'],
    correctIndex: 1, explanation: 'The inhabitants of the Balkans — Romania, Bulgaria, Albania, Greece, Serbia, etc. — were broadly known as the Slavs.', hints: ['This ethnic group is still associated with Eastern Europe'],
  },
  {
    id: 'mcq-022', type: 'mcq', sectionId: 's6', difficulty: 'hard', examRelevance: 'high', tags: ['balkans', 'imperialism'],
    question: 'Balkan tensions ultimately led to:',
    options: ['The French Revolution', 'The unification of Germany', 'The First World War', 'The Congress of Vienna'],
    correctIndex: 2, explanation: 'Intense rivalry among European powers over trade, colonies and military might, combined with Balkan nationalism, ultimately led to the First World War (1914).', hints: ['Think about the major global conflict of the early 20th century'],
  },
]

export const fillBlankActivities: FillBlankActivity[] = [
  {
    id: 'fb-001', type: 'fill-blank', sectionId: 's1', difficulty: 'easy', examRelevance: 'high', tags: ['napoleon'],
    sentence: 'The Civil Code of 1804, also known as the _____ Code, established equality before the law.',
    blanks: [{ position: 0, answer: 'Napoleonic', alternatives: ['Napoleon\'s', 'Napoleon'] }],
    hints: ['Named after the French ruler who introduced it'],
  },
  {
    id: 'fb-002', type: 'fill-blank', sectionId: 's2', difficulty: 'easy', examRelevance: 'high', tags: ['economic-nationalism'],
    sentence: 'In 1834, a customs union called the _____ was formed at the initiative of Prussia.',
    blanks: [{ position: 0, answer: 'Zollverein', alternatives: ['zollverein'] }],
    hints: ['It\'s a German word meaning "customs union"'],
  },
  {
    id: 'fb-003', type: 'fill-blank', sectionId: 's2', difficulty: 'medium', examRelevance: 'high', tags: ['congress-of-vienna'],
    sentence: 'The Congress of Vienna in 1815 was hosted by the Austrian Chancellor Duke _____.',
    blanks: [{ position: 0, answer: 'Metternich', alternatives: ['metternich'] }],
    hints: ['He later called Mazzini "the most dangerous enemy"'],
  },
  {
    id: 'fb-004', type: 'fill-blank', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['greece'],
    sentence: 'The Treaty of _____ of 1832 recognised Greece as an independent nation.',
    blanks: [{ position: 0, answer: 'Constantinople', alternatives: ['constantinople'] }],
    hints: ['Named after a famous city that was once the capital of the Byzantine Empire'],
  },
  {
    id: 'fb-005', type: 'fill-blank', sectionId: 's3', difficulty: 'easy', examRelevance: 'high', tags: ['romanticism'],
    sentence: 'The German philosopher _____ claimed that true German culture was found among the common people — das volk.',
    blanks: [{ position: 0, answer: 'Herder', alternatives: ['Johann Gottfried Herder', 'herder'] }],
    hints: ['He lived from 1744 to 1803'],
  },
  {
    id: 'fb-006', type: 'fill-blank', sectionId: 's4', difficulty: 'easy', examRelevance: 'high', tags: ['germany'],
    sentence: 'Otto von Bismarck unified Germany through three wars over _____ years.',
    blanks: [{ position: 0, answer: 'seven', alternatives: ['7'] }],
    hints: ['The wars were fought from 1864 to 1871'],
  },
  {
    id: 'fb-007', type: 'fill-blank', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['italy'],
    sentence: 'In 1860, _____ led the Expedition of the Thousand into South Italy.',
    blanks: [{ position: 0, answer: 'Garibaldi', alternatives: ['Giuseppe Garibaldi', 'garibaldi'] }],
    hints: ['His volunteers were called Red Shirts'],
  },
  {
    id: 'fb-008', type: 'fill-blank', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['britain'],
    sentence: 'The Act of Union of _____ united England and Scotland into the "United Kingdom of Great Britain".',
    blanks: [{ position: 0, answer: '1707', alternatives: [] }],
    hints: ['It happened in the early 18th century'],
  },
  {
    id: 'fb-009', type: 'fill-blank', sectionId: 's5', difficulty: 'easy', examRelevance: 'high', tags: ['allegory'],
    sentence: 'The female allegory of the French nation was christened _____.',
    blanks: [{ position: 0, answer: 'Marianne', alternatives: ['marianne'] }],
    hints: ['A popular French Christian name'],
  },
  {
    id: 'fb-010', type: 'fill-blank', sectionId: 's5', difficulty: 'medium', examRelevance: 'high', tags: ['symbols'],
    sentence: 'In the allegory of Germania, the _____ symbolises heroism.',
    blanks: [{ position: 0, answer: 'crown of oak leaves', alternatives: ['oak crown', 'oak leaves', 'crown of oak'] }],
    hints: ['It\'s a type of headwear made from a specific tree\'s leaves'],
  },
  {
    id: 'fb-011', type: 'fill-blank', sectionId: 's1', difficulty: 'medium', examRelevance: 'high', tags: ['french-revolution'],
    sentence: 'The ideas of _____ (the fatherland) and _____ (the citizen) emphasised a united community with equal rights.',
    blanks: [
      { position: 0, answer: 'la patrie', alternatives: ['la Patrie', 'patrie'] },
      { position: 1, answer: 'le citoyen', alternatives: ['le Citoyen', 'citoyen'] },
    ],
    hints: ['These are French terms used during the Revolution'],
  },
  {
    id: 'fb-012', type: 'fill-blank', sectionId: 's6', difficulty: 'medium', examRelevance: 'high', tags: ['balkans'],
    sentence: 'The inhabitants of the Balkans were broadly known as the _____.',
    blanks: [{ position: 0, answer: 'Slavs', alternatives: ['slavs'] }],
    hints: ['This ethnic group is still associated with Eastern European countries'],
  },
]

export const trueFalseActivities: TrueFalseActivity[] = [
  {
    id: 'tf-001', type: 'true-false', sectionId: 's1', difficulty: 'easy', examRelevance: 'medium', tags: ['french-revolution'],
    statement: 'The French Revolution of 1789 transferred sovereignty from the people to the monarchy.',
    isTrue: false, explanation: 'It was the opposite — the Revolution transferred sovereignty FROM the monarchy TO the people (French citizens).',
  },
  {
    id: 'tf-002', type: 'true-false', sectionId: 's1', difficulty: 'easy', examRelevance: 'high', tags: ['napoleon'],
    statement: 'The Napoleonic Code established equality before the law and abolished birth-based privileges.',
    isTrue: true, explanation: 'The Civil Code of 1804 (Napoleonic Code) did away with all privileges based on birth and established equality before the law.',
  },
  {
    id: 'tf-003', type: 'true-false', sectionId: 's2', difficulty: 'medium', examRelevance: 'high', tags: ['liberalism'],
    statement: 'In revolutionary France, all adults including women were granted the right to vote.',
    isTrue: false, explanation: 'Voting rights were granted exclusively to property-owning men. Women and non-propertied men were excluded. The Napoleonic Code reduced women to the status of a minor.',
  },
  {
    id: 'tf-004', type: 'true-false', sectionId: 's2', difficulty: 'easy', examRelevance: 'high', tags: ['economic-nationalism'],
    statement: 'The Zollverein reduced the number of currencies in German states from over thirty to two.',
    isTrue: true, explanation: 'The Zollverein (1834), formed at Prussia\'s initiative, abolished tariff barriers and reduced currencies from over thirty to two.',
  },
  {
    id: 'tf-005', type: 'true-false', sectionId: 's2', difficulty: 'medium', examRelevance: 'high', tags: ['congress-of-vienna'],
    statement: 'The Congress of Vienna aimed to continue the changes brought by Napoleon.',
    isTrue: false, explanation: 'The Congress of Vienna aimed to UNDO the changes of the Napoleonic wars and restore the conservative order — Bourbon dynasty restored, buffer states created, etc.',
  },
  {
    id: 'tf-006', type: 'true-false', sectionId: 's3', difficulty: 'easy', examRelevance: 'high', tags: ['greece'],
    statement: 'Lord Byron was an English poet who died fighting for Greek independence.',
    isTrue: true, explanation: 'Lord Byron organised funds, went to fight in the Greek war of independence, and died of fever in Greece in 1824.',
  },
  {
    id: 'tf-007', type: 'true-false', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['grimm-brothers'],
    statement: 'The Grimm Brothers collected folktales because they believed they expressed a pure German spirit.',
    isTrue: true, explanation: 'The Grimm Brothers saw French domination as a threat to German culture and believed the folktales they collected were expressions of a pure and authentic German spirit.',
  },
  {
    id: 'tf-008', type: 'true-false', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['revolution'],
    statement: 'The Frankfurt parliament succeeded in creating a united Germany in 1848.',
    isTrue: false, explanation: 'The Frankfurt parliament failed. Friedrich Wilhelm IV rejected the crown, and the combined opposition of monarchs, military and Junkers forced the assembly to disband.',
  },
  {
    id: 'tf-009', type: 'true-false', sectionId: 's4', difficulty: 'easy', examRelevance: 'high', tags: ['germany'],
    statement: 'Bismarck unified Germany through democratic elections and parliamentary debates.',
    isTrue: false, explanation: 'Bismarck unified Germany through "blood and iron" — three wars with the Prussian army and bureaucracy, NOT through democratic means.',
  },
  {
    id: 'tf-010', type: 'true-false', sectionId: 's4', difficulty: 'easy', examRelevance: 'high', tags: ['italy'],
    statement: 'Victor Emmanuel II was proclaimed king of united Italy in 1861.',
    isTrue: true, explanation: 'In 1861, Victor Emmanuel II was proclaimed king of united Italy, though the Papal States only joined in 1870.',
  },
  {
    id: 'tf-011', type: 'true-false', sectionId: 's4', difficulty: 'medium', examRelevance: 'medium', tags: ['britain'],
    statement: 'The British nation-state was formed through a sudden revolution like France.',
    isTrue: false, explanation: 'British nation-building was a long-drawn-out process through English dominance, parliament (1688), Act of Union with Scotland (1707), and incorporation of Ireland (1801).',
  },
  {
    id: 'tf-012', type: 'true-false', sectionId: 's5', difficulty: 'easy', examRelevance: 'high', tags: ['allegory'],
    statement: 'Marianne was a real French woman chosen to represent the nation.',
    isTrue: false, explanation: 'Marianne was NOT a real woman. She was a female allegory — a symbolic figure who personified the French nation. The name was a popular Christian name.',
  },
  {
    id: 'tf-013', type: 'true-false', sectionId: 's5', difficulty: 'medium', examRelevance: 'high', tags: ['symbols'],
    statement: 'In Germania, the black, red and gold tricolour was the official flag of the German Dukes.',
    isTrue: false, explanation: 'The black, red and gold tricolour was the flag of the liberal-nationalists in 1848 — it was actually BANNED by the Dukes of the German states.',
  },
  {
    id: 'tf-014', type: 'true-false', sectionId: 's6', difficulty: 'medium', examRelevance: 'high', tags: ['balkans'],
    statement: 'The Balkans were under the control of the Russian Empire in the 19th century.',
    isTrue: false, explanation: 'A large part of the Balkans was under the control of the OTTOMAN Empire, not the Russian Empire. Russia was one of the big powers competing for influence there.',
  },
  {
    id: 'tf-015', type: 'true-false', sectionId: 's6', difficulty: 'easy', examRelevance: 'high', tags: ['imperialism'],
    statement: 'Nationalism aligned with imperialism eventually led to the First World War.',
    isTrue: true, explanation: 'By the late 19th century, nationalism had merged with imperialism. Intense rivalry among European powers over trade, colonies and the Balkans led to WWI (1914).',
  },
]
