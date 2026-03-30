import type { SourceComprehensionActivity } from '../../types/activity'

export const sourceAnalysisActivities: SourceComprehensionActivity[] = [
  {
    id: 'src-001', type: 'source-comprehension', sectionId: 's1', difficulty: 'medium', examRelevance: 'high', tags: ['source-a'],
    sourceId: 'source-a',
    questions: [
      { question: 'According to Renan, what forms a nation?', answer: 'A long past of endeavours, sacrifice and devotion — not common language, race, religion, or territory. A nation is based on common glories in the past and a will to perform great deeds together.' },
      { question: 'What does Renan mean by "Its existence is a daily plebiscite"?', answer: 'A nation exists because its people continuously choose to be together — it requires ongoing consent and solidarity, like a daily vote (plebiscite) to remain united.', options: ['Nations hold elections every day', 'A nation exists through the ongoing consent of its people', 'Citizens must vote daily to maintain citizenship', 'The government holds referendums regularly'] },
      { question: 'Summarise the attributes of a nation as Renan understands them.', answer: 'A nation is: (1) culmination of a long past of endeavours, sacrifice and devotion; (2) based on common glories and a will to do great deeds together; (3) a large-scale solidarity; (4) a daily plebiscite (ongoing consent); (5) never annexes a country against its will.' },
    ],
  },
  {
    id: 'src-002', type: 'source-comprehension', sectionId: 's2', difficulty: 'medium', examRelevance: 'high', tags: ['source-b'],
    sourceId: 'source-b',
    questions: [
      { question: 'What was the aim of the Zollverein according to Friedrich List?', answer: 'To bind the Germans economically into a nation — strengthening the nation materially by protecting its interests and stimulating productivity.' },
      { question: 'What political ends did List hope to achieve through economic measures?', answer: 'List believed economic unification would awaken national sentiment, create a fusion of individual and provincial interests, and engender national feeling — leading to political unification.', options: ['Military conquest of neighbours', 'Economic prosperity leading to national sentiment and political unity', 'Isolation from world trade', 'Abolition of all private property'] },
      { question: 'Why does List say "a free economic system is the only means to engender national feeling"?', answer: 'He believed that when people could trade freely without tariff barriers, they would see themselves as part of one economic nation, which would naturally foster political unity and nationalist sentiment.' },
    ],
  },
  {
    id: 'src-003', type: 'source-comprehension', sectionId: 's3', difficulty: 'hard', examRelevance: 'high', tags: ['source-c', 'women'],
    sourceId: 'source-c',
    questions: [
      { question: 'What was Carl Welcker\'s view on the role of women?', answer: 'He argued that nature created men and women for different functions — men as protectors and public figures, women as homemakers. He opposed equality as endangering harmony and the family.' },
      { question: 'How does Louise Otto-Peters challenge this view?', answer: 'She argues that Liberty is indivisible — free men cannot exist while women are unfree. She asks how men who claim to fight for freedom can deny it to half of humanity.', options: ['She agrees with Welcker', 'She argues Liberty is indivisible and cannot exist for only half of humanity', 'She says women should focus on the home', 'She demands women join the army'] },
      { question: 'Compare the positions of the three writers. What do they reveal about liberal ideology?', answer: 'Welcker (conservative on gender): men and women have different natural roles. Otto-Peters (feminist): Liberty must be universal, including women. Anonymous reader: denying women rights despite their contributions is "ridiculous and unreasonable". Together they reveal that liberal ideology, while championing freedom and equality, was deeply contradictory on the question of women\'s rights.' },
    ],
  },
]
