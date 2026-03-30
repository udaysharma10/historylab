import type { ImageAnalysisActivity } from '../../types/activity'

export const imageAnalysisActivities: ImageAnalysisActivity[] = [
  {
    id: 'img-001', type: 'image-analysis', sectionId: 's1', difficulty: 'medium', examRelevance: 'high', tags: ['figure'],
    figureId: 'fig-1',
    questions: [
      { question: 'What is the female figure holding in this print?', answer: 'The torch of Enlightenment in one hand and the Charter of the Rights of Man in the other', options: ['A sword and shield', 'The torch of Enlightenment and the Charter of Rights of Man', 'A flag and a crown', 'A Bible and a cross'] },
      { question: 'What do the shattered remains on the ground represent?', answer: 'The symbols of absolutist institutions', options: ['Ancient ruins', 'War weapons', 'Symbols of absolutist institutions', 'Broken statues of kings'] },
      { question: 'Why is this print described as depicting a "utopian vision"?', answer: 'It shows an idealistic world of democratic and social republics where all nations march together in peace — a vision unlikely to actually exist' },
    ],
  },
  {
    id: 'img-002', type: 'image-analysis', sectionId: 's1', difficulty: 'medium', examRelevance: 'high', tags: ['figure'],
    figureId: 'fig-4',
    questions: [
      { question: 'How are the French soldiers portrayed in this painting?', answer: 'As oppressors — they seize a peasant\'s cart, harass women, and force a peasant to his knees', options: ['As liberators welcomed by the people', 'As oppressors harassing and forcing locals to their knees', 'As neutral traders', 'As religious missionaries'] },
      { question: 'What is sarcastic about the inscription on the plaque?', answer: 'It reads "Take freedom and equality from us, the model of humanity" — sarcastically mocking the French claim of being liberators while actually oppressing the people' },
      { question: 'What does this painting reveal about reactions to Napoleon\'s rule?', answer: 'Initial enthusiasm for French "liberation" turned to hostility — increased taxation, censorship, and forced conscription outweighed any benefits' },
    ],
  },
  {
    id: 'img-003', type: 'image-analysis', sectionId: 's2', difficulty: 'medium', examRelevance: 'high', tags: ['figure'],
    figureId: 'fig-6',
    questions: [
      { question: 'What is written on the plaque on the left?', answer: '"The most important question of today\'s meeting: How long will thinking be allowed to us?"' },
      { question: 'What are the rules of the Club of Thinkers?', answer: '"1. Silence is the first commandment. 2. Muzzles will be distributed to members upon entering."', options: ['Free speech and open debate', 'Silence as the first rule; muzzles for members', 'Weekly discussions on philosophy', 'Democratic voting on all issues'] },
      { question: 'What is the caricaturist trying to depict?', answer: 'The harsh censorship imposed by conservative regimes after 1815. Conservative governments did not tolerate criticism or dissent, controlling newspapers, books, plays and songs.' },
    ],
  },
  {
    id: 'img-004', type: 'image-analysis', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['figure', 'romanticism'],
    figureId: 'fig-8',
    questions: [
      { question: 'What historical event does this painting depict?', answer: 'The massacre at Chios (1824) where 20,000 Greeks were said to have been killed by Ottoman Turks', options: ['The French Revolution', 'The Battle of Leipzig', 'The Massacre at Chios', 'The Congress of Vienna'] },
      { question: 'What artistic technique did Delacroix use and why?', answer: 'He used vivid colours and focused on the suffering of women and children to dramatise the incident, appeal to emotions, and create sympathy for the Greeks — typical of Romantic art' },
      { question: 'How does this painting connect art to nationalism?', answer: 'It shows how Romantic artists used their work to mobilise public opinion for nationalist causes — in this case, generating European sympathy for Greek independence from the Ottoman Empire' },
    ],
  },
  {
    id: 'img-005', type: 'image-analysis', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['figure'],
    figureId: 'fig-10',
    questions: [
      { question: 'Where were the women positioned during the Frankfurt parliament session?', answer: 'In the upper left gallery — they were admitted only as observers, denied any voting or participation rights', options: ['Seated with the representatives', 'In the upper gallery as observers only', 'Outside the building entirely', 'On the stage speaking'] },
      { question: 'What does the position of women reveal about liberal nationalism in 1848?', answer: 'Despite women\'s active participation in liberal movements, they were excluded from political rights — showing the limitations of liberal ideology regarding gender equality' },
    ],
  },
  {
    id: 'img-006', type: 'image-analysis', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['figure', 'germany'],
    figureId: 'fig-11',
    questions: [
      { question: 'Where was this ceremony held and why was it significant?', answer: 'In the Hall of Mirrors at the Palace of Versailles — significant because holding a German ceremony in a French palace was a deliberate humiliation of France after the Franco-Prussian War' },
      { question: 'Who is at the centre of the painting?', answer: 'Kaiser William I (the Prussian king proclaimed German Emperor) and General von Roon, with Bismarck near them' },
      { question: 'What does the dominant presence of military figures tell us about German unification?', answer: 'That German unification was achieved through military power (Prussian army) rather than democratic means. The army, not parliament, was the architect of the nation', options: ['It was a peaceful democratic process', 'Military power was the basis of unification', 'The people voted for unification', 'It was led by the Church'] },
    ],
  },
  {
    id: 'img-007', type: 'image-analysis', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['figure', 'italy'],
    figureId: 'fig-15',
    questions: [
      { question: 'What statement is this caricature making about Italian unification?', answer: 'Garibaldi (holding the boot from the base = conquering the south) enables the King of Sardinia-Piedmont to enter from the top (ruling from the north). It shows unification was a partnership between popular revolt (south) and royal state-building (north)' },
      { question: 'Why is Italy depicted as a boot?', answer: 'The Italian peninsula is naturally shaped like a boot — the caricature cleverly uses this geography to show how different forces unified Italy from the south (Garibaldi) and north (King Victor Emmanuel II)' },
    ],
  },
  {
    id: 'img-008', type: 'image-analysis', sectionId: 's5', difficulty: 'medium', examRelevance: 'high', tags: ['figure', 'allegory'],
    figureId: 'fig-17',
    questions: [
      { question: 'Identify at least four symbolic attributes of Germania in this painting.', answer: 'Crown of oak leaves (heroism), sword (readiness to fight), olive branch around sword (willingness to make peace), breastplate with eagle (German empire/strength), black-red-gold tricolour (liberal flag), rays of rising sun (new era)' },
      { question: 'Where was this painting meant to be displayed?', answer: 'It was painted on a cotton banner to hang from the ceiling of the Church of St Paul, Frankfurt, where the Frankfurt parliament was convened in March 1848', options: ['The Berlin Cathedral', 'The Church of St Paul, Frankfurt', 'The Palace of Versailles', 'The Vienna Congress Hall'] },
      { question: 'In an earlier rendering (1836), Veit had placed the Kaiser\'s crown where he now shows broken chains. What is the significance?', answer: 'It shows the shift from royal authority to liberation — in 1836, the emphasis was on the Kaiser (monarchical power), but by 1848, the emphasis shifted to freedom from oppression (broken chains symbolising being freed)' },
    ],
  },
  {
    id: 'img-009', type: 'image-analysis', sectionId: 's6', difficulty: 'medium', examRelevance: 'high', tags: ['figure', 'imperialism'],
    figureId: 'fig-20',
    questions: [
      { question: 'What does Britannia sitting over the globe symbolise?', answer: 'British imperial domination over the world — nationalism merged with imperialism', options: ['British trade partnerships', 'Britannia ruling the waves and the world', 'British tourism', 'British scientific achievements'] },
      { question: 'What is ironic about the angels carrying the banner of "Freedom"?', answer: 'The banner of "Freedom" is used to celebrate and justify an empire that colonised and oppressed peoples around the world — the opposite of freedom for the colonised' },
      { question: 'How does this map show the transformation of nationalism?', answer: 'Nationalism evolved from a liberal-democratic force for liberation (early 19th century) to a tool of imperial domination (late 19th century). The same rhetoric of "freedom" is now used to justify conquest and colonialism' },
    ],
  },
]
