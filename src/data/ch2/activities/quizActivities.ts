import type { MCQActivity, FillBlankActivity, TrueFalseActivity } from '../../../types/activity'

export const ch2McqActivities: MCQActivity[] = [
  // === SECTION 1: The First World War, Khilafat & Non-Cooperation ===
  {
    id: 'ch2-mcq-001', type: 'mcq', sectionId: 's1', difficulty: 'easy', examRelevance: 'high', tags: ['satyagraha', 'gandhi'],
    question: 'What does the term "Satyagraha" literally mean?',
    options: ['Passive resistance', 'Insistence on truth', 'Soul of India', 'Non-violent protest'],
    correctIndex: 1, explanation: 'Satyagraha = Satya (truth) + Agraha (insistence). Gandhi was clear that it was NOT passive resistance — it was an active force that "can be used only by the strong."', hints: ['Break the word into its two Sanskrit roots'],
  },
  {
    id: 'ch2-mcq-002', type: 'mcq', sectionId: 's1', difficulty: 'easy', examRelevance: 'high', tags: ['champaran', 'gandhi'],
    question: 'Gandhi\'s first satyagraha in India (1917) was on behalf of:',
    options: ['Cotton mill workers in Ahmedabad', 'Indigo planters in Champaran', 'Peasants hit by crop failure in Kheda', 'Tea plantation workers in Assam'],
    correctIndex: 1, explanation: 'In 1917, Gandhi organised his first Indian satyagraha in Champaran, Bihar, where indigo farmers were forced to grow indigo under conditions that destroyed soil fertility.', hints: ['It happened in Bihar and involved a crop used for blue dye'],
  },
  {
    id: 'ch2-mcq-003', type: 'mcq', sectionId: 's1', difficulty: 'medium', examRelevance: 'high', tags: ['rowlatt-act'],
    question: 'Why was the Rowlatt Act (1919) considered a threat to civil liberties?',
    options: ['It imposed heavy taxes on Indian traders', 'It allowed detention without trial and arrest without evidence', 'It banned the Indian National Congress', 'It forced Indians to serve in the British army'],
    correctIndex: 1, explanation: 'The Rowlatt Act gave the British government power to arrest anyone and detain them for up to two years without trial or evidence. Even Indian members of the Imperial Legislative Council unanimously opposed it.', hints: ['Think about what rights it took away from Indians'],
  },
  {
    id: 'ch2-mcq-004', type: 'mcq', sectionId: 's1', difficulty: 'medium', examRelevance: 'high', tags: ['jallianwala-bagh'],
    question: 'Many people at Jallianwala Bagh on 13 April 1919 were unaware of martial law because they:',
    options: ['Were from a neighbouring city and had just arrived', 'Were villagers who had come for the annual Baisakhi fair', 'Had deliberately come to defy the British orders', 'Were soldiers on leave from the war'],
    correctIndex: 1, explanation: 'Many in the crowd were villagers who had come to Amritsar for the annual Baisakhi fair and were unaware of the martial law that had been imposed. General Dyer opened fire without warning.', hints: ['April is a significant time for a Punjabi festival'],
  },
  {
    id: 'ch2-mcq-005', type: 'mcq', sectionId: 's1', difficulty: 'hard', examRelevance: 'high', tags: ['khilafat', 'hindu-muslim-unity'],
    question: 'Why did Gandhi support the Khilafat cause even though it was a Muslim religious issue?',
    options: ['He personally believed in the spiritual authority of the Khalifa', 'He saw it as an opportunity to unite Hindus and Muslims against the British', 'The British ordered him to support it', 'The Khilafat leaders threatened to oppose Congress'],
    correctIndex: 1, explanation: 'Gandhi\'s support for Khilafat was a strategic calculation: if he supported a Muslim cause, Muslims would support Congress. For the first time, Hindus and Muslims would fight together against the British in a united national movement.', hints: ['Think about what Gandhi needed most for a national movement'],
  },
  {
    id: 'ch2-mcq-006', type: 'mcq', sectionId: 's1', difficulty: 'easy', examRelevance: 'high', tags: ['non-cooperation'],
    question: 'Which of the following was NOT part of the Non-Cooperation programme?',
    options: ['Boycott of foreign goods', 'Surrender of government titles', 'Armed revolt against British officials', 'Boycott of legislative councils and courts'],
    correctIndex: 2, explanation: 'The Non-Cooperation programme was strictly non-violent: surrender titles, boycott institutions (schools, courts, councils), boycott foreign goods. Armed revolt was never part of Gandhi\'s programme.', hints: ['Gandhi\'s method was always based on non-violence'],
  },

  // === SECTION 2: Differing Strands Within the Movement ===
  {
    id: 'ch2-mcq-007', type: 'mcq', sectionId: 's2', difficulty: 'medium', examRelevance: 'high', tags: ['non-cooperation', 'towns'],
    question: 'Why did the Non-Cooperation Movement gradually slow down in the cities?',
    options: ['The British made too many concessions', 'Khadi was expensive and alternative Indian institutions were slow to develop', 'Gandhi personally asked city people to stop participating', 'The Muslim League opposed the movement in cities'],
    correctIndex: 1, explanation: 'The movement lost steam in towns because khadi was more expensive than mill cloth (poor people couldn\'t afford it) and alternative Indian schools and courts took time to set up. Without replacements for British institutions, the boycott couldn\'t sustain.', hints: ['Think about the practical problems of boycotting without alternatives'],
  },
  {
    id: 'ch2-mcq-008', type: 'mcq', sectionId: 's2', difficulty: 'medium', examRelevance: 'high', tags: ['awadh', 'peasants'],
    question: 'What did "Swaraj" mean for the peasants of Awadh?',
    options: ['A constitution based on British parliamentary democracy', 'An end to exorbitant rents, begar, and exploitation by talukdars', 'Reserved seats in legislative councils', 'Freedom to trade directly with Britain'],
    correctIndex: 1, explanation: 'For Awadh peasants, Swaraj had nothing to do with constitutions — it meant freedom from talukdars who charged exorbitant rents, demanded begar (unpaid forced labour), and offered no security of tenure.', hints: ['Peasants cared about their daily survival, not political structures'],
  },
  {
    id: 'ch2-mcq-009', type: 'mcq', sectionId: 's2', difficulty: 'easy', examRelevance: 'high', tags: ['baba-ramchandra', 'awadh'],
    question: 'Baba Ramchandra, who led the peasant movement in Awadh, had earlier been:',
    options: ['A wealthy landlord in Bengal', 'An indentured labourer in Fiji', 'A British-trained lawyer', 'A professor at Aligarh University'],
    correctIndex: 1, explanation: 'Baba Ramchandra was a sanyasi who had earlier been an indentured labourer in Fiji. He understood the exploitation of labourers firsthand, which gave him credibility among the Awadh peasants.', hints: ['He had personal experience of forced labour in a faraway country'],
  },
  {
    id: 'ch2-mcq-010', type: 'mcq', sectionId: 's2', difficulty: 'hard', examRelevance: 'high', tags: ['alluri-sitaram-raju', 'tribals'],
    question: 'What was the fundamental contradiction in Alluri Sitaram Raju\'s approach?',
    options: ['He opposed both Gandhi and the British equally', 'He invoked Gandhi and wore khadi but used guerrilla violence', 'He supported the British while pretending to oppose them', 'He rejected Indian nationalism in favour of tribal autonomy'],
    correctIndex: 1, explanation: 'Raju is a paradox: he wore khadi, invoked Gandhi, supported Non-Cooperation — but he used guerrilla warfare, attacked police stations, and killed British officials. He believed India could only be freed through force, not non-violence.', hints: ['He combined two seemingly opposite methods'],
  },
  {
    id: 'ch2-mcq-011', type: 'mcq', sectionId: 's2', difficulty: 'medium', examRelevance: 'high', tags: ['plantation-workers', 'assam'],
    question: 'For Assam plantation workers, "Swaraj" essentially meant:',
    options: ['Higher wages and shorter working hours', 'The right to move freely — to leave the plantations', 'Ownership of the tea gardens', 'The right to vote in provincial elections'],
    correctIndex: 1, explanation: 'Under the Inland Emigration Act of 1859, plantation workers were not allowed to leave tea gardens without permission. For them, swaraj was the simplest dream — just the freedom to go home.', hints: ['Think about what basic right was denied to them by law'],
  },
  {
    id: 'ch2-mcq-012', type: 'mcq', sectionId: 's2', difficulty: 'easy', examRelevance: 'high', tags: ['chauri-chaura'],
    question: 'Gandhi called off the entire Non-Cooperation Movement in February 1922 because:',
    options: ['The British agreed to grant Swaraj', 'A violent mob at Chauri Chaura killed 22 policemen', 'Hindu-Muslim unity had completely broken down', 'He was arrested and could not lead the movement'],
    correctIndex: 1, explanation: 'At Chauri Chaura, Gorakhpur, a peaceful demonstration turned violent and a mob set fire to the police station, killing 22 policemen. Gandhi was devastated and called off the entire movement — non-violence was not a tactic but the soul of the struggle.', hints: ['It involved a violent incident in a small town in UP'],
  },
  {
    id: 'ch2-mcq-013', type: 'mcq', sectionId: 's2', difficulty: 'hard', examRelevance: 'high', tags: ['non-cooperation', 'different-groups'],
    question: 'Why did different social groups interpret Gandhi\'s message in their own ways during Non-Cooperation?',
    options: ['Gandhi deliberately gave different messages to different groups', 'The British spread misinformation about Gandhi\'s goals', 'Each group filtered the idea of Swaraj through their own experiences and needs', 'Congress leaders in each region changed the message'],
    correctIndex: 2, explanation: 'Peasants thought Gandhi had declared no more taxes, workers believed "Gandhi Raj" meant land for all, tribals used his name for armed resistance. Each group understood Swaraj through the lens of their own suffering and aspirations — the movement grew, but grew out of Gandhi\'s control.', hints: ['Think about how the same word can mean different things to people in different situations'],
  },

  // === SECTION 3: Towards Civil Disobedience ===
  {
    id: 'ch2-mcq-014', type: 'mcq', sectionId: 's3', difficulty: 'easy', examRelevance: 'high', tags: ['simon-commission'],
    question: 'Indians opposed the Simon Commission (1928) primarily because:',
    options: ['It recommended Partition of India', 'It had no Indian members — all members were British', 'It wanted to extend the Rowlatt Act', 'It proposed abolishing the Congress party'],
    correctIndex: 1, explanation: 'The Simon Commission was set up to review India\'s constitutional progress but had no Indian member — all its members were British. This united Congress and the Muslim League in the "Go Back Simon!" protests.', hints: ['The issue was about representation'],
  },
  {
    id: 'ch2-mcq-015', type: 'mcq', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['lahore-congress', 'purna-swaraj'],
    question: 'The historic declaration of "Purna Swaraj" was made at the:',
    options: ['Nagpur Congress (1920)', 'Calcutta Congress (1920)', 'Lahore Congress (1929)', 'Karachi Congress (1931)'],
    correctIndex: 2, explanation: 'At the December 1929 Lahore Congress, under Jawaharlal Nehru\'s presidency, Congress formally demanded Purna Swaraj — complete independence. 26 January 1930 was declared Independence Day.', hints: ['It was the Congress session just before the Salt March'],
  },
  {
    id: 'ch2-mcq-016', type: 'mcq', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['salt-march', 'dandi'],
    question: 'Why did Gandhi choose salt as the symbol for the Civil Disobedience Movement?',
    options: ['Salt was India\'s largest export to Britain', 'Salt was consumed by rich and poor alike — it united all Indians regardless of caste or religion', 'The salt tax was the highest tax imposed by the British', 'Salt production was controlled by Indian industrialists'],
    correctIndex: 1, explanation: 'Salt was the perfect unifying symbol: rich and poor, Hindu and Muslim, Brahmin and Dalit — everyone needed salt daily. By taxing it, the British had turned every kitchen in India into a site of potential resistance.', hints: ['Think about what makes salt different from other goods — who uses it?'],
  },
  {
    id: 'ch2-mcq-017', type: 'mcq', sectionId: 's3', difficulty: 'easy', examRelevance: 'high', tags: ['salt-march', 'dandi'],
    question: 'The Dandi March began on 12 March 1930 from:',
    options: ['Porbandar', 'Sabarmati Ashram', 'Dandi beach', 'Champaran'],
    correctIndex: 1, explanation: 'Gandhi started the march from his Sabarmati Ashram with 78 trusted volunteers, walking 240 miles to the coastal town of Dandi in Gujarat, where he broke the salt law on 6 April 1930.', hints: ['It was Gandhi\'s own ashram in Gujarat'],
  },
  {
    id: 'ch2-mcq-018', type: 'mcq', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['cdm', 'non-cooperation'],
    question: 'How was Civil Disobedience fundamentally different from Non-Cooperation?',
    options: ['CDM was led by Nehru, not Gandhi', 'In Non-Cooperation, people refused to cooperate; in CDM, people actively broke the law', 'CDM was limited to cities while Non-Cooperation was rural', 'CDM demanded dominion status while Non-Cooperation demanded full independence'],
    correctIndex: 1, explanation: 'The key distinction: Non-Cooperation meant refusing to participate (boycotting institutions). Civil Disobedience meant actively BREAKING the law — manufacturing salt illegally, refusing to pay revenue, violating forest laws. It was a direct challenge to British authority.', hints: ['The clue is in the name — "disobedience" means something different from "non-cooperation"'],
  },
  {
    id: 'ch2-mcq-019', type: 'mcq', sectionId: 's3', difficulty: 'hard', examRelevance: 'high', tags: ['cdm', 'rich-peasants'],
    question: 'Why were rich peasants (Patidars, Jats) disappointed when Gandhi called off CDM in 1931?',
    options: ['Gandhi had promised them reserved seats in councils', 'The Gandhi-Irwin Pact did not guarantee any reduction in revenue rates', 'The British had already agreed to lower land taxes', 'Gandhi refused to acknowledge their contribution to the movement'],
    correctIndex: 1, explanation: 'Rich peasants like Patidars of Gujarat and Jats of UP had enthusiastically joined CDM because the Depression made it impossible to pay high revenue. When Gandhi signed the Gandhi-Irwin Pact without securing a reduction in revenue, many refused to rejoin the movement in 1932.', hints: ['Think about their main economic demand and whether it was met'],
  },
  {
    id: 'ch2-mcq-020', type: 'mcq', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['ambedkar', 'dalits', 'poona-pact'],
    question: 'The Poona Pact (1932) between Gandhi and Ambedkar resulted in:',
    options: ['Separate electorates for Dalits as Ambedkar originally demanded', 'Reserved seats for Dalits within joint electorates', 'Complete abolition of the caste system', 'Dalits joining the Congress party unconditionally'],
    correctIndex: 1, explanation: 'Ambedkar originally demanded separate electorates, but Gandhi opposed this and went on a fast unto death. The compromise — the Poona Pact — gave Dalits reserved seats but within joint electorates, not separate ones.', hints: ['It was a compromise — neither fully got what they wanted'],
  },
  {
    id: 'ch2-mcq-021', type: 'mcq', sectionId: 's3', difficulty: 'hard', examRelevance: 'high', tags: ['muslims', 'cdm'],
    question: 'Why were many Muslim organisations lukewarm towards the Civil Disobedience Movement?',
    options: ['Muslims had already gained independence through the Khilafat movement', 'After the decline of Khilafat, Congress became associated with Hindu groups and communal riots deepened distrust', 'The British promised Muslims a separate nation if they stayed out', 'Gandhi explicitly asked Muslims not to participate'],
    correctIndex: 1, explanation: 'After the Khilafat movement collapsed, Muslims felt alienated from Congress, which became increasingly associated with Hindu groups like the Hindu Mahasabha. Communal riots further deepened the divide, and Jinnah\'s demand for reserved Muslim seats was rejected at the 1928 All Parties Conference.', hints: ['Think about what happened AFTER the brief Hindu-Muslim unity of Khilafat'],
  },

  // === SECTION 4: The Sense of Collective Belonging ===
  {
    id: 'ch2-mcq-022', type: 'mcq', sectionId: 's4', difficulty: 'easy', examRelevance: 'high', tags: ['bharat-mata', 'allegory'],
    question: 'The image of "Bharat Mata" was first created by:',
    options: ['Rabindranath Tagore', 'Abanindranath Tagore', 'Bankim Chandra Chattopadhyay', 'Mahatma Gandhi'],
    correctIndex: 1, explanation: 'Abanindranath Tagore painted the famous image of Bharat Mata in 1905, portraying her as a calm, ascetic, divine figure holding learning, food, and clothing — a spiritual mother of the nation.', hints: ['He was a famous painter, not a writer or leader'],
  },
  {
    id: 'ch2-mcq-023', type: 'mcq', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['bharat-mata', 'limits'],
    question: 'Why was the image of Bharat Mata problematic for building truly inclusive nationalism?',
    options: ['The image was too modern and westernised', 'It drew from Hindu iconography, which could alienate Muslims, Christians, and Dalits', 'The British banned all images of Bharat Mata', 'It depicted a man, not a woman'],
    correctIndex: 1, explanation: 'Bharat Mata drew from Hindu iconography — Vande Mataram came from a Hindu novel, later images used trishul and lion (Hindu symbols). When the idea of the nation is wrapped in one religion\'s imagery, other communities may not see themselves in it.', hints: ['Think about whose cultural symbols were used in the image'],
  },
  {
    id: 'ch2-mcq-024', type: 'mcq', sectionId: 's4', difficulty: 'easy', examRelevance: 'high', tags: ['flag', 'symbols'],
    question: 'The spinning wheel (charkha) on Gandhi\'s Swaraj flag represented:',
    options: ['India\'s industrial power', 'Self-reliance', 'Hindu religious tradition', 'British textile trade'],
    correctIndex: 1, explanation: 'The charkha on the Swaraj flag (designed by Gandhiji in 1921 — red, green, white stripes) symbolised self-reliance. Spinning your own cloth meant rejecting dependence on British mill-made goods.', hints: ['Think about what the act of spinning cloth at home represents'],
  },
  {
    id: 'ch2-mcq-025', type: 'mcq', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['folklore', 'nationalism'],
    question: 'Nationalists collected folk tales and songs to build national identity — similar to the role played in Europe by:',
    options: ['Napoleon Bonaparte and the French army', 'The Grimm Brothers in Germany', 'Duke Metternich and the Congress of Vienna', 'Giuseppe Mazzini and Young Europe'],
    correctIndex: 1, explanation: 'Just as the Grimm Brothers collected German folk tales to promote German cultural nationalism, Indian nationalists like Rabindranath Tagore in Bengal and Natesa Sastri in Madras collected folk stories to build a sense of shared Indian identity.', hints: ['Think about Chapter 1 — who collected folk tales in Germany?'],
  },
]

export const ch2FillBlankActivities: FillBlankActivity[] = [
  {
    id: 'ch2-fb-001', type: 'fill-blank', sectionId: 's1', difficulty: 'easy', examRelevance: 'high', tags: ['satyagraha', 'gandhi'],
    sentence: 'Satyagraha = Satya (truth) + Agraha (insistence) = insistence on _____.',
    blanks: [{ position: 0, answer: 'truth', alternatives: ['Truth'] }],
    hints: ['The first part of the word gives you the answer'],
  },
  {
    id: 'ch2-fb-002', type: 'fill-blank', sectionId: 's1', difficulty: 'easy', examRelevance: 'high', tags: ['rowlatt-act'],
    sentence: 'The _____ Act of 1919 allowed the British to arrest and detain Indians without trial.',
    blanks: [{ position: 0, answer: 'Rowlatt', alternatives: ['rowlatt', 'Rowlett'] }],
    hints: ['Named after the judge who headed the committee that recommended it'],
  },
  {
    id: 'ch2-fb-003', type: 'fill-blank', sectionId: 's1', difficulty: 'medium', examRelevance: 'high', tags: ['khilafat'],
    sentence: 'The Khilafat Committee was formed in Bombay in March 1919, led by brothers _____ Ali and _____ Ali.',
    blanks: [
      { position: 0, answer: 'Muhammad', alternatives: ['Mohammed', 'mohammad', 'muhammad'] },
      { position: 1, answer: 'Shaukat', alternatives: ['shaukat', 'Shoukat'] },
    ],
    hints: ['They were brothers who led the Khilafat movement in India'],
  },
  {
    id: 'ch2-fb-004', type: 'fill-blank', sectionId: 's1', difficulty: 'medium', examRelevance: 'high', tags: ['non-cooperation'],
    sentence: 'In his book _____, Gandhi declared that British rule in India could collapse within a year if Indians refused to cooperate.',
    blanks: [{ position: 0, answer: 'Hind Swaraj', alternatives: ['hind swaraj', 'Hind swaraj'] }],
    hints: ['The title means "Indian Self-Rule" — written in 1909'],
  },
  {
    id: 'ch2-fb-005', type: 'fill-blank', sectionId: 's2', difficulty: 'easy', examRelevance: 'high', tags: ['boycott'],
    sentence: 'The word "boycott" originates from Captain Charles _____, an Irish land agent who was ostracised by his community.',
    blanks: [{ position: 0, answer: 'Boycott', alternatives: ['boycott', 'BOYCOTT'] }],
    hints: ['The word itself is this person\'s surname'],
  },
  {
    id: 'ch2-fb-006', type: 'fill-blank', sectionId: 's2', difficulty: 'medium', examRelevance: 'high', tags: ['begar', 'awadh'],
    sentence: '_____ was forced unpaid labour that villagers were compelled to contribute to landlords.',
    blanks: [{ position: 0, answer: 'Begar', alternatives: ['begar', 'BEGAR'] }],
    hints: ['A Hindi/Urdu term for a specific type of exploitation by talukdars'],
  },
  {
    id: 'ch2-fb-007', type: 'fill-blank', sectionId: 's2', difficulty: 'medium', examRelevance: 'high', tags: ['plantation-workers', 'assam'],
    sentence: 'Under the Inland Emigration Act of _____, plantation workers in Assam were not allowed to leave tea gardens without permission.',
    blanks: [{ position: 0, answer: '1859', alternatives: [] }],
    hints: ['It was passed just after the revolt of 1857'],
  },
  {
    id: 'ch2-fb-008', type: 'fill-blank', sectionId: 's2', difficulty: 'easy', examRelevance: 'high', tags: ['chauri-chaura'],
    sentence: 'Gandhi called off the Non-Cooperation Movement in February 1922 after the violent incident at _____ in Gorakhpur.',
    blanks: [{ position: 0, answer: 'Chauri Chaura', alternatives: ['chauri chaura', 'Chauri chaura'] }],
    hints: ['A small town in UP where 22 policemen were killed'],
  },
  {
    id: 'ch2-fb-009', type: 'fill-blank', sectionId: 's3', difficulty: 'easy', examRelevance: 'high', tags: ['purna-swaraj'],
    sentence: 'At the Lahore Congress of December 1929, under Jawaharlal Nehru\'s presidency, the demand for _____ (complete independence) was formally adopted.',
    blanks: [{ position: 0, answer: 'Purna Swaraj', alternatives: ['purna swaraj', 'Purna swaraj', 'complete independence'] }],
    hints: ['It literally means "complete self-rule" in Hindi'],
  },
  {
    id: 'ch2-fb-010', type: 'fill-blank', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['ambedkar', 'dalits'],
    sentence: 'Dr. B.R. Ambedkar organised Dalits into the _____ Association in 1930.',
    blanks: [{ position: 0, answer: 'Depressed Classes', alternatives: ['depressed classes', 'Depressed classes'] }],
    hints: ['The name reflected how Dalits referred to themselves — as "oppressed" or "depressed"'],
  },
  {
    id: 'ch2-fb-011', type: 'fill-blank', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['gandhi-irwin-pact'],
    sentence: 'In March 1931, Gandhi signed the _____-_____ Pact and agreed to attend the Round Table Conference in London.',
    blanks: [
      { position: 0, answer: 'Gandhi', alternatives: ['gandhi'] },
      { position: 1, answer: 'Irwin', alternatives: ['irwin'] },
    ],
    hints: ['Named after the two people who negotiated it — one Indian leader and one British Viceroy'],
  },
  {
    id: 'ch2-fb-012', type: 'fill-blank', sectionId: 's4', difficulty: 'easy', examRelevance: 'high', tags: ['vande-mataram'],
    sentence: 'The hymn _____ was written by Bankim Chandra Chattopadhyay and was included in his novel Anandamath.',
    blanks: [{ position: 0, answer: 'Vande Mataram', alternatives: ['vande mataram', 'Vande mataram', 'Vandemataram'] }],
    hints: ['It means "I bow to thee, Mother" — it became a national anthem of resistance'],
  },
]

export const ch2TrueFalseActivities: TrueFalseActivity[] = [
  {
    id: 'ch2-tf-001', type: 'true-false', sectionId: 's1', difficulty: 'easy', examRelevance: 'high', tags: ['satyagraha'],
    statement: 'Satyagraha means passive resistance — the weapon of the weak.',
    isTrue: false, explanation: 'Gandhi explicitly rejected the term "passive resistance." He said satyagraha was the weapon of the STRONG, not the weak. It was an active force based on truth, not mere passivity.',
  },
  {
    id: 'ch2-tf-002', type: 'true-false', sectionId: 's1', difficulty: 'easy', examRelevance: 'high', tags: ['jallianwala-bagh'],
    statement: 'General Dyer ordered firing at Jallianwala Bagh to produce what he called "a moral effect" on Indians.',
    isTrue: true, explanation: 'General Dyer later stated that his purpose in ordering the firing on an unarmed crowd — without warning, with exits blocked — was to "produce a moral effect" and intimidate Indians into submission.',
  },
  {
    id: 'ch2-tf-003', type: 'true-false', sectionId: 's1', difficulty: 'medium', examRelevance: 'high', tags: ['non-cooperation'],
    statement: 'The Non-Cooperation programme was adopted at the Lahore Congress session in December 1920.',
    isTrue: false, explanation: 'The Non-Cooperation programme was adopted at the Nagpur Congress in December 1920, not Lahore. The Lahore Congress (December 1929) was where Purna Swaraj was declared — a common mix-up.',
  },
  {
    id: 'ch2-tf-004', type: 'true-false', sectionId: 's1', difficulty: 'medium', examRelevance: 'high', tags: ['non-cooperation', 'impact'],
    statement: 'During Non-Cooperation, the import of foreign cloth halved — from Rs 102 crore to Rs 57 crore.',
    isTrue: true, explanation: 'The boycott of foreign goods had a real economic impact: foreign cloth imports dropped from Rs 102 crore to Rs 57 crore as Indians burnt foreign cloth in bonfires and switched to Indian-made products.',
  },
  {
    id: 'ch2-tf-005', type: 'true-false', sectionId: 's2', difficulty: 'medium', examRelevance: 'high', tags: ['awadh', 'peasants'],
    statement: 'Peasants in Awadh strictly followed Congress guidelines and limited their protests to non-violent methods approved by Gandhi.',
    isTrue: false, explanation: 'Peasants went BEYOND what Congress intended — they attacked talukdars\' houses, looted bazaars, and took over grain hoards. Local leaders told peasants that Gandhi had declared no more taxes and land would be redistributed, though Gandhi had never authorised such actions.',
  },
  {
    id: 'ch2-tf-006', type: 'true-false', sectionId: 's2', difficulty: 'easy', examRelevance: 'high', tags: ['alluri-sitaram-raju'],
    statement: 'Alluri Sitaram Raju led tribal resistance in the Gudem Hills of Andhra Pradesh using guerrilla methods.',
    isTrue: true, explanation: 'Alluri Sitaram Raju led the tribal rebellion in the Gudem Hills against the colonial government\'s forest restrictions and begar demands. Despite invoking Gandhi, he used guerrilla warfare — attacking police stations and killing British officials.',
  },
  {
    id: 'ch2-tf-007', type: 'true-false', sectionId: 's2', difficulty: 'hard', examRelevance: 'high', tags: ['chauri-chaura', 'gandhi'],
    statement: 'Gandhi called off Non-Cooperation at Chauri Chaura because the movement was failing and losing support.',
    isTrue: false, explanation: 'This is a common misconception. The movement was actually at its PEAK when Gandhi called it off. He withdrew it specifically because of the violence — 22 policemen were killed. Gandhi believed a movement that kills is no different from the empire it fights. Non-violence was the soul of the struggle, not just a tactic.',
  },
  {
    id: 'ch2-tf-008', type: 'true-false', sectionId: 's3', difficulty: 'easy', examRelevance: 'high', tags: ['simon-commission'],
    statement: 'The Simon Commission was opposed because it had only one Indian member.',
    isTrue: false, explanation: 'The Simon Commission had NO Indian members at all — not even one. All members were British. This is why it was opposed so strongly, uniting even Congress and the Muslim League in the "Go Back Simon!" protests.',
  },
  {
    id: 'ch2-tf-009', type: 'true-false', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['salt-march'],
    statement: 'Gandhi marched to Dandi with thousands of followers from the very beginning of the Salt March.',
    isTrue: false, explanation: 'Gandhi started the Dandi March with only 78 trusted volunteers from Sabarmati Ashram. Thousands joined along the way as he walked through villages over 24 days, but the starting group was deliberately small and disciplined.',
  },
  {
    id: 'ch2-tf-010', type: 'true-false', sectionId: 's3', difficulty: 'easy', examRelevance: 'high', tags: ['cdm'],
    statement: 'In the Civil Disobedience Movement, people actively broke British laws — manufacturing salt, refusing to pay taxes, and violating forest laws.',
    isTrue: true, explanation: 'CDM was fundamentally about actively BREAKING the law, not just refusing to cooperate. Indians manufactured salt illegally, refused to pay revenue, violated forest laws, and boycotted foreign cloth as direct acts of defiance.',
  },
  {
    id: 'ch2-tf-011', type: 'true-false', sectionId: 's3', difficulty: 'hard', examRelevance: 'high', tags: ['congress', 'poor-peasants'],
    statement: 'Congress supported "no rent" campaigns for poor peasants and sharecroppers during the Civil Disobedience Movement.',
    isTrue: false, explanation: 'Congress deliberately did NOT support "no rent" campaigns. They feared alienating rich peasants and zamindars who were important Congress supporters. As a result, poor peasants and sharecroppers turned to Socialist and Communist movements instead.',
  },
  {
    id: 'ch2-tf-012', type: 'true-false', sectionId: 's3', difficulty: 'medium', examRelevance: 'high', tags: ['women', 'cdm'],
    statement: 'Women participated extensively in Civil Disobedience and were given important positions of authority within Congress.',
    isTrue: false, explanation: 'While thousands of women participated — in salt marches, picketing, manufacturing salt, going to jail — Gandhi saw their role as largely SYMBOLIC. Congress was reluctant to give women real positions of authority. Their role was celebrated but limited.',
  },
  {
    id: 'ch2-tf-013', type: 'true-false', sectionId: 's4', difficulty: 'easy', examRelevance: 'high', tags: ['bharat-mata'],
    statement: 'Bankim Chandra Chattopadhyay wrote "Vande Mataram," which became an anthem of resistance during the Swadeshi movement.',
    isTrue: true, explanation: 'Bankim Chandra Chattopadhyay wrote Vande Mataram in the 1870s and included it in his novel Anandamath. It gained massive popularity as a song of resistance during the Swadeshi movement in Bengal.',
  },
  {
    id: 'ch2-tf-014', type: 'true-false', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['folklore', 'nationalism'],
    statement: 'The nationalist rewriting of Indian history celebrated a past that was equally representative of all Indian communities — Hindu, Muslim, and Dalit.',
    isTrue: false, explanation: 'The "glorious past" that nationalists celebrated was largely HINDU past — temples, Sanskrit, Vedic achievements. Muslims, Christians, and Dalits did not see themselves in this version of history. The very tools meant to unite were inadvertently dividing.',
  },
  {
    id: 'ch2-tf-015', type: 'true-false', sectionId: 's4', difficulty: 'medium', examRelevance: 'high', tags: ['flag', 'symbols'],
    statement: 'The tricolour flag used during the Swadeshi movement in Bengal included a crescent moon to represent Hindu-Muslim unity.',
    isTrue: true, explanation: 'The Swadeshi-era tricolour (red, green, yellow) included 8 lotuses for 8 provinces AND a crescent moon — the crescent was specifically included to symbolise Hindu-Muslim unity within the national movement.',
  },
]
