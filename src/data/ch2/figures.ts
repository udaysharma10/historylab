// Chapter 2: Nationalism in India — Figure definitions with hotspots and analysis

export interface Ch2Figure {
  id: string
  number: string
  title: string
  artist?: string
  year?: string
  type: 'photograph' | 'painting' | 'print' | 'illustration'
  imagePath: string
  sectionId: string
  examRelevance: 'high' | 'medium' | 'low'
  hotspots: { id: string; label: string; description: string; x: number; y: number }[]
  analysis: {
    whatYouSee: string[]
    whatItMeans: string[]
    examTip: string
  }
}

export const ch2Figures: Ch2Figure[] = [
  {
    id: 'ch2-fig-1',
    number: '1',
    title: '6 April 1919 — Mass Processions',
    year: '1919',
    type: 'photograph',
    imagePath: '/images/ch2/fig-01-mass-processions.png',
    sectionId: 's1',
    examRelevance: 'medium',
    hotspots: [
      { id: 'h1', label: 'Dense crowd', description: 'Thousands of people filling the entire street — showing the massive scale of the hartal', x: 50, y: 60 },
      { id: 'h2', label: 'Banners in Hindi', description: 'Protest banners in the local language — the movement was reaching ordinary people, not just English-speaking elites', x: 40, y: 30 },
      { id: 'h3', label: 'White clothing', description: 'Most participants wearing white — many would later adopt khadi as a symbol of the national movement', x: 60, y: 50 },
    ],
    analysis: {
      whatYouSee: [
        'A massive crowd filling an entire urban street — thousands of people',
        'Banners and placards in Hindi/local language',
        'People in white clothing packed shoulder to shoulder',
        'Buildings on both sides suggest a major city thoroughfare',
      ],
      whatItMeans: [
        'Mass processions became a defining feature of the national movement — showing collective strength through numbers',
        'The hartal of 6 April 1919 was the first truly nationwide protest — cities across India shut down simultaneously',
        'The use of local language on banners shows the movement was reaching beyond the English-speaking educated elite',
        'This was the beginning of mass politics in India — ordinary people, not just leaders, were now part of the struggle',
      ],
      examTip: 'This image shows the SCALE of the anti-Rowlatt Act protests. When writing about the hartal of 6 April 1919, mention: nationwide strikes, shops closed, workers in railway workshops on strike, rallies in every major city.',
    },
  },
  {
    id: 'ch2-fig-2',
    number: '2',
    title: 'Indian Workers in South Africa March through Volksrust',
    year: '1913',
    type: 'photograph',
    imagePath: '/images/ch2/fig-02-south-africa-march.png',
    sectionId: 's1',
    examRelevance: 'medium',
    hotspots: [
      { id: 'h1', label: 'Workers marching', description: 'Indian workers from Newcastle marching to Transvaal — defying racist laws that denied rights to non-whites', x: 40, y: 50 },
      { id: 'h2', label: 'Gandhi leading', description: 'Mahatma Gandhi was leading this march — his South African experience shaped satyagraha before he brought it to India', x: 20, y: 40 },
    ],
    analysis: {
      whatYouSee: [
        'A long procession of Indian workers marching along a road in South Africa',
        'Gandhi was leading these workers from Newcastle to Transvaal in November 1913',
        'When the marchers were stopped and Gandhi arrested, thousands more workers joined',
      ],
      whatItMeans: [
        'This is where satyagraha was born — in the struggle against racist laws in South Africa',
        'Gandhi developed his method of non-violent resistance here before bringing it to India',
        'The workers defied racist laws that denied basic rights to non-whites',
        'Key point: satyagraha was tested and proven in South Africa BEFORE it was used in India',
      ],
      examTip: 'When asked about Gandhi\'s idea of satyagraha, always mention his South African experience. He returned to India in 1915 with a PROVEN method of non-violent resistance.',
    },
  },
  {
    id: 'ch2-fig-3',
    number: '3',
    title: 'General Dyer\'s "Crawling Orders" — Amritsar, 1919',
    year: '1919',
    type: 'photograph',
    imagePath: '/images/ch2/fig-03-crawling-orders.png',
    sectionId: 's1',
    examRelevance: 'high',
    hotspots: [
      { id: 'h1', label: 'Narrow street', description: 'The narrow lane in Amritsar where Indians were forced to crawl on the ground under Dyer\'s orders', x: 50, y: 40 },
      { id: 'h2', label: 'British soldier', description: 'Armed British soldier enforcing the crawling order — a deliberate act of humiliation', x: 80, y: 50 },
    ],
    analysis: {
      whatYouSee: [
        'A narrow street in Amritsar, Punjab',
        'A British soldier standing guard while Indians were forced to crawl',
        'This was one of General Dyer\'s orders after the Jallianwala Bagh massacre',
      ],
      whatItMeans: [
        'After the massacre, Dyer imposed humiliating measures — Indians had to crawl on the ground, do salaam to all British officers',
        'People were publicly flogged, villages around Gujranwala were bombed',
        'These measures were designed to humiliate and terrorise — to break the spirit of resistance',
        'Instead, they deepened Indian anger and strengthened the demand for swaraj',
      ],
      examTip: 'CBSE asks about the aftermath of Jallianwala Bagh. Mention: crawling orders, forced salaam, public flogging, village bombings. Then explain how this INCREASED Indian resistance instead of crushing it.',
    },
  },
  {
    id: 'ch2-fig-4',
    number: '4',
    title: 'The Boycott of Foreign Cloth, July 1922',
    year: '1922',
    type: 'photograph',
    imagePath: '/images/ch2/fig-04-boycott-cloth.png',
    sectionId: 's2',
    examRelevance: 'high',
    hotspots: [
      { id: 'h1', label: 'Bonfire of cloth', description: 'Foreign cloth being burnt in huge bonfires — a powerful visual act of resistance', x: 50, y: 40 },
      { id: 'h2', label: 'Participants', description: 'People gathering to participate in the boycott — this was a public, communal act of defiance', x: 40, y: 60 },
    ],
    analysis: {
      whatYouSee: [
        'People gathered around a bonfire of foreign cloth',
        'Foreign cloth was seen as a symbol of Western economic and cultural domination',
        'This was part of the Non-Cooperation Movement\'s boycott programme',
      ],
      whatItMeans: [
        'Foreign cloth represented British economic exploitation — Indian raw materials exported cheap, finished goods imported at high prices',
        'The boycott had real economic impact: import of foreign cloth halved from Rs 102 crore to Rs 57 crore between 1921-22',
        'Bonfires were dramatic public acts — making resistance visible and communal',
        'BUT: khadi (Indian handspun cloth) was more expensive than mill cloth, making sustained boycott difficult for the poor',
      ],
      examTip: 'Key exam fact: Import of foreign cloth dropped from Rs 102 crore to Rs 57 crore during Non-Cooperation. But also explain WHY the boycott slowed down — khadi was expensive, poor people couldn\'t afford it.',
    },
  },
  {
    id: 'ch2-fig-5',
    number: '5',
    title: 'Chauri Chaura, 1922',
    year: '1922',
    type: 'photograph',
    imagePath: '/images/ch2/fig-05-chauri-chaura.png',
    sectionId: 's2',
    examRelevance: 'high',
    hotspots: [
      { id: 'h1', label: 'Burnt ruins', description: 'The ruins of the police station that was set on fire by an angry mob on 4 February 1922', x: 50, y: 40 },
    ],
    analysis: {
      whatYouSee: [
        'The aftermath of the Chauri Chaura incident — the burnt police station',
        'At Chauri Chaura in Gorakhpur (UP), a peaceful demonstration turned into a violent clash',
        'The crowd set fire to the police station, killing 22 policemen',
      ],
      whatItMeans: [
        'This single incident caused Gandhi to call off the ENTIRE Non-Cooperation Movement',
        'Gandhi believed that if the movement turned violent, it betrayed its fundamental principle — satyagraha',
        'Other leaders (Nehru, Patel) were furious — the movement was at its peak when Gandhi withdrew',
        'The incident showed that Gandhi could not control the movement completely — different groups interpreted his message differently',
      ],
      examTip: 'CBSE\'s MOST asked question about Non-Cooperation: "Why did Gandhi call off the movement?" Answer: Chauri Chaura violence (Feb 1922, 22 policemen killed) + Gandhi\'s belief that non-violence was a moral principle, not just a strategy.',
    },
  },
  {
    id: 'ch2-fig-6',
    number: '6',
    title: 'Meeting of Congress Leaders at Allahabad, 1931',
    year: '1931',
    type: 'photograph',
    imagePath: '/images/ch2/fig-06-congress-leaders.png',
    sectionId: 's3',
    examRelevance: 'medium',
    hotspots: [
      { id: 'h1', label: 'Gandhi', description: 'Mahatma Gandhi — the central figure of the Congress and the independence movement', x: 40, y: 50 },
      { id: 'h2', label: 'Sardar Patel', description: 'Vallabhbhai Patel (extreme left) — led the Bardoli Satyagraha, known as "Sardar"', x: 10, y: 40 },
      { id: 'h3', label: 'Jawaharlal Nehru', description: 'Jawaharlal Nehru (extreme right) — presided over the Lahore Congress demanding Purna Swaraj', x: 90, y: 40 },
      { id: 'h4', label: 'Subhas Chandra Bose', description: 'Subhas Chandra Bose (fifth from right) — represented the radical wing demanding mass agitation', x: 75, y: 40 },
    ],
    analysis: {
      whatYouSee: [
        'Congress leaders gathered for a meeting at Allahabad in 1931',
        'Identifiable figures include Gandhi, Sardar Patel, Jawaharlal Nehru, and Subhas Chandra Bose',
        'The leaders are seated in a garden setting — informal but purposeful',
      ],
      whatItMeans: [
        'This photograph captures the Congress leadership during a critical period — between the Salt March (1930) and the Round Table Conference (1931)',
        'The different leaders represent different approaches: Gandhi (non-violence), Nehru (socialism), Bose (radical mass agitation)',
        'Despite internal differences, they are working together — unity within diversity',
      ],
      examTip: 'Identify the key leaders in this image: Gandhi (centre), Patel (left), Nehru (right), Bose (fifth from right). Know each leader\'s approach and contribution.',
    },
  },
  {
    id: 'ch2-fig-7',
    number: '7',
    title: 'The Dandi March',
    year: '1930',
    type: 'photograph',
    imagePath: '/images/ch2/fig-07-dandi-march.png',
    sectionId: 's3',
    examRelevance: 'high',
    hotspots: [
      { id: 'h1', label: 'Gandhi leading', description: 'Gandhi walking with his famous staff — leading 78 volunteers on the 240-mile march from Sabarmati to Dandi', x: 30, y: 50 },
      { id: 'h2', label: '78 volunteers', description: 'The trusted volunteers who started the march — by the time they reached Dandi, thousands had joined', x: 60, y: 50 },
    ],
    analysis: {
      whatYouSee: [
        'Gandhi walking with volunteers during the Salt March',
        'He is accompanied by 78 trusted volunteers — they walked about 10 miles a day for 24 days',
        'The march covered 240 miles from Sabarmati Ashram to the coastal town of Dandi in Gujarat',
      ],
      whatItMeans: [
        'The Salt March is the most iconic moment of the Indian freedom struggle',
        'Gandhi chose salt because it united ALL Indians — rich and poor, Hindu and Muslim, everyone needs salt',
        'The British monopoly on salt production and the salt tax affected every Indian household',
        'The march demonstrated that civil disobedience could be dramatic, disciplined, and deeply symbolic',
        'On 6 April 1930, Gandhi picked up a handful of salt at Dandi — breaking British law and launching the Civil Disobedience Movement',
      ],
      examTip: 'The Salt March is asked EVERY year. Key facts: 12 March - 6 April 1930, Sabarmati to Dandi, 240 miles, 78 volunteers, 24 days. And ALWAYS explain WHY salt — it was consumed by all classes, the tax affected everyone, making it a universal symbol of resistance.',
    },
  },
  {
    id: 'ch2-fig-8',
    number: '8',
    title: 'Police Cracked Down on Satyagrahis, 1930',
    year: '1930',
    type: 'photograph',
    imagePath: '/images/ch2/fig-08-police-crackdown.png',
    sectionId: 's3',
    examRelevance: 'medium',
    hotspots: [
      { id: 'h1', label: 'Satyagrahis', description: 'Peaceful protestors being confronted by British police — maintaining non-violence under violent repression', x: 50, y: 50 },
    ],
    analysis: {
      whatYouSee: [
        'British police cracking down on satyagrahis during the Civil Disobedience Movement',
        'Peaceful protestors being physically confronted by armed police',
      ],
      whatItMeans: [
        'The British government responded to the Civil Disobedience Movement with brutal repression',
        'Peaceful satyagrahis were attacked, women and children beaten, about 100,000 people arrested',
        'Despite the repression, the movement continued — showing the strength of satyagraha as a method',
        'The contrast between peaceful protestors and violent police created international sympathy for India\'s cause',
      ],
      examTip: 'When writing about British repression during CDM, mention: ~100,000 arrested, peaceful satyagrahis beaten, women and children attacked. This repression ultimately strengthened the movement\'s moral authority.',
    },
  },
  {
    id: 'ch2-fig-9',
    number: '9',
    title: 'Women Join Nationalist Processions',
    type: 'photograph',
    imagePath: '/images/ch2/fig-09-women-processions.png',
    sectionId: 's3',
    examRelevance: 'high',
    hotspots: [
      { id: 'h1', label: 'Women marchers', description: 'Women participating in nationalist processions — many left their homes for the first time to join the movement', x: 50, y: 40 },
      { id: 'h2', label: 'Old women and mothers', description: 'Notice old women and mothers with children — showing that women of all ages joined', x: 60, y: 60 },
    ],
    analysis: {
      whatYouSee: [
        'Women participating in a nationalist procession during the Civil Disobedience Movement',
        'Women of all ages — including old women and mothers with children in their arms',
        'Many of these women were leaving their homes for a public cause for the first time in their lives',
      ],
      whatItMeans: [
        'The Civil Disobedience Movement saw unprecedented participation by women',
        'Thousands of women came out of their homes to participate in protest marches, manufacture salt, and picket foreign cloth and liquor shops',
        'In urban areas, women were from high-caste families; in rural areas, from rich peasant households',
        'However, Gandhi saw women\'s role primarily as SYMBOLIC — "good mothers and good wives" serving the nation',
        'Congress was reluctant to give women positions of authority within the organisation — they were valued for their presence, not their leadership',
      ],
      examTip: 'CBSE asks about women\'s participation in CDM. Important points: thousands joined salt marches + picketed shops + went to jail. BUT also note the limitation: Gandhi saw their role as symbolic, Congress wouldn\'t give women real leadership positions.',
    },
  },
  {
    id: 'ch2-fig-10',
    number: '10',
    title: 'Mahatma Gandhi, Jawaharlal Nehru and Maulana Azad at Sevagram Ashram, Wardha',
    year: '1935',
    type: 'photograph',
    imagePath: '/images/ch2/fig-10-gandhi-nehru-azad.png',
    sectionId: 's3',
    examRelevance: 'low',
    hotspots: [
      { id: 'h1', label: 'Gandhi', description: 'Mahatma Gandhi at his ashram — the spiritual centre of the national movement', x: 30, y: 50 },
      { id: 'h2', label: 'Nehru', description: 'Jawaharlal Nehru — by 1935, he was one of the most prominent Congress leaders', x: 60, y: 50 },
      { id: 'h3', label: 'Maulana Azad', description: 'Maulana Abul Kalam Azad — a Muslim leader who remained committed to Hindu-Muslim unity and the Congress', x: 80, y: 50 },
    ],
    analysis: {
      whatYouSee: [
        'Three key Congress leaders at Gandhi\'s Sevagram Ashram in Wardha, 1935',
        'Gandhi, Nehru, and Maulana Azad — representing different generations and communities',
      ],
      whatItMeans: [
        'The presence of Maulana Azad (a Muslim leader) alongside Gandhi and Nehru shows that the Congress still maintained Hindu-Muslim leadership at the top level',
        'By 1935, however, communal tensions were growing — many Muslims felt alienated from Congress',
        'This photograph captures a moment of unity that was becoming increasingly difficult to maintain',
      ],
      examTip: 'Identify the three leaders. Maulana Azad\'s presence is significant — he represents the Muslim leaders who stayed with Congress despite growing communal tensions.',
    },
  },
  {
    id: 'ch2-fig-11',
    number: '11',
    title: 'Bal Gangadhar Tilak — An Early-Twentieth-Century Print',
    type: 'print',
    imagePath: '/images/ch2/fig-11-tilak-print.png',
    sectionId: 's4',
    examRelevance: 'medium',
    hotspots: [
      { id: 'h1', label: 'Tilak', description: 'Bal Gangadhar Tilak — an early nationalist leader who popularised the idea of swaraj', x: 50, y: 50 },
      { id: 'h2', label: 'Symbols of unity', description: 'Notice the temple, church, and masjid framing the image — symbols of different faiths united around the national leader', x: 50, y: 15 },
    ],
    analysis: {
      whatYouSee: [
        'A popular print showing Bal Gangadhar Tilak as a central, revered figure',
        'Sacred institutions of different faiths — temple, church, masjid — frame the central figure',
        'The print glorifies Tilak as a unifying national leader',
      ],
      whatItMeans: [
        'Popular prints like this helped create a visual culture of nationalism',
        'The inclusion of temple, church, and masjid was deliberate — showing national unity across religions',
        'Such prints were widely circulated and helped spread nationalist ideas to people who couldn\'t read',
        'They turned political leaders into almost religious figures — deepening emotional connection to the movement',
      ],
      examTip: 'Note the symbols of unity in this print — temple, church, masjid. This was an attempt to show the national movement as inclusive of ALL communities. But compare this with the Bharat Mata images — were they equally inclusive?',
    },
  },
  {
    id: 'ch2-fig-12',
    number: '12',
    title: 'Bharat Mata — Abanindranath Tagore, 1905',
    artist: 'Abanindranath Tagore',
    year: '1905',
    type: 'painting',
    imagePath: '/images/ch2/fig-12-bharat-mata-tagore.png',
    sectionId: 's4',
    examRelevance: 'high',
    hotspots: [
      { id: 'h1', label: 'Ascetic figure', description: 'Bharat Mata is portrayed as calm, composed, divine, and spiritual — an ascetic, not a warrior', x: 50, y: 40 },
      { id: 'h2', label: 'Mala (prayer beads)', description: 'The mala in one hand emphasises her spiritual, ascetic quality — connected to dharma, not power', x: 35, y: 60 },
      { id: 'h3', label: 'Learning, food, clothing', description: 'She holds items representing what a mother provides — knowledge, nourishment, protection', x: 55, y: 55 },
      { id: 'h4', label: 'Four arms', description: 'Four arms like a Hindu goddess — dispensing learning, food, clothing, and spiritual guidance', x: 50, y: 50 },
    ],
    analysis: {
      whatYouSee: [
        'A female figure representing India as a mother — Bharat Mata',
        'She is calm, composed, and divine — an ascetic, spiritual figure',
        'She holds items representing a mother\'s gifts: learning, food, clothing',
        'The mala (prayer beads) emphasises her spiritual quality',
        'Painted by Abanindranath Tagore in 1905 during the Swadeshi movement',
      ],
      whatItMeans: [
        'Tagore tried to create an image that was distinctly Indian — rejecting Western artistic styles',
        'Bharat Mata as an ascetic mother represents India as nurturing, spiritual, and self-sufficient',
        'This image was widely circulated during the Swadeshi movement and became a symbol of national identity',
        'KEY EXAM QUESTION: Compare this with the later Bharat Mata (Fig 14a) — Tagore\'s version is spiritual; the later one is about POWER',
        'Also compare with Germania (Chapter 1) — both are female allegories of the nation, but with very different qualities',
      ],
      examTip: 'This is one of the most asked figures in CBSE. Know: (1) Painted by Abanindranath Tagore, 1905 (2) Ascetic, calm, spiritual (3) Holds learning, food, clothing (4) Compare with Fig 14a (power version) AND with Germania from Chapter 1.',
    },
  },
  {
    id: 'ch2-fig-13',
    number: '13',
    title: 'Jawaharlal Nehru — A Popular Print',
    type: 'print',
    imagePath: '/images/ch2/fig-13-nehru-print.png',
    sectionId: 's4',
    examRelevance: 'medium',
    hotspots: [
      { id: 'h1', label: 'Nehru with Bharat Mata', description: 'Nehru is shown holding the image of Bharat Mata and the map of India close to his heart', x: 50, y: 50 },
    ],
    analysis: {
      whatYouSee: [
        'A popular print showing Jawaharlal Nehru holding an image of Bharat Mata and the map of India close to his heart',
        'In many popular prints, nationalist leaders were shown offering their heads to Bharat Mata — the idea of sacrifice for the mother was powerful',
      ],
      whatItMeans: [
        'Popular prints turned political leaders into devotees of the motherland',
        'The image of sacrifice — leaders offering themselves to Bharat Mata — made nationalism feel like a religious duty',
        'Such prints were powerful tools of communication in a largely illiterate society',
      ],
      examTip: 'These prints show how nationalism was communicated visually to people who couldn\'t read. The idea of sacrificing for Bharat Mata made the political struggle feel deeply personal and sacred.',
    },
  },
  {
    id: 'ch2-fig-14a',
    number: '14a',
    title: 'Bharat Mata — With Trishul, Lion and Elephant',
    type: 'painting',
    imagePath: '/images/ch2/fig-14a-bharat-mata-trishul.png',
    sectionId: 's4',
    examRelevance: 'high',
    hotspots: [
      { id: 'h1', label: 'Trishul', description: 'The trident (trishul) — a weapon associated with Hindu deity Shiva. Unlike Tagore\'s version, this Bharat Mata is about POWER, not spirituality.', x: 40, y: 30 },
      { id: 'h2', label: 'Lion', description: 'Symbol of power and authority — a departure from Tagore\'s calm, ascetic mother figure', x: 30, y: 70 },
      { id: 'h3', label: 'Elephant', description: 'Another symbol of power, strength, and royalty — reinforcing the martial, powerful image', x: 70, y: 70 },
    ],
    analysis: {
      whatYouSee: [
        'A very different Bharat Mata from Tagore\'s version',
        'This Bharat Mata holds a trishul (trident), stands beside a lion and an elephant',
        'Both the lion and elephant are symbols of power and authority',
        'The figure is more assertive, martial — a queen, not an ascetic',
      ],
      whatItMeans: [
        'This version shows how the image of Bharat Mata CHANGED over time — from spiritual to powerful',
        'Like Germania in Chapter 1 (which evolved from hope to militarism), Bharat Mata also evolved',
        'The trishul, lion, and elephant are all drawn from HINDU iconography',
        'KEY QUESTION: Would this image appeal to ALL communities? Muslims, Christians, Dalits might not see themselves in it',
        'This is the central tension of cultural nationalism: symbols meant to unite can end up excluding',
      ],
      examTip: 'CBSE loves asking: "Compare the two images of Bharat Mata (Tagore vs trishul version). How are they different? Would they appeal to all communities?" Answer: Tagore = spiritual, inclusive; this version = powerful but Hindu-centric, potentially exclusionary.',
    },
  },
  {
    id: 'ch2-fig-14b',
    number: '14b',
    title: 'Women\'s Procession in Bombay during the Quit India Movement',
    year: '1942',
    type: 'photograph',
    imagePath: '/images/ch2/fig-14b-women-quit-india.png',
    sectionId: 's4',
    examRelevance: 'medium',
    hotspots: [
      { id: 'h1', label: 'Women marchers', description: 'Women marching in large numbers during the Quit India Movement — the final mass struggle against British rule', x: 50, y: 50 },
    ],
    analysis: {
      whatYouSee: [
        'A large procession of women in Bombay during the Quit India Movement (1942)',
        'The women are marching in organised formation — showing discipline and determination',
      ],
      whatItMeans: [
        'The Quit India Movement (1942) was the last great mass struggle against British rule',
        'Women\'s participation had grown from the Salt March (1930) to Quit India (1942) — becoming a significant force',
        'Key women leaders included Aruna Asaf Ali, Matangini Hazra (Bengal), Kanaklata Barua (Assam)',
        'The movement showed that by 1942, the demand for freedom had become truly mass-based',
      ],
      examTip: 'Know the key facts about Quit India: 8 August 1942, "Do or Die" speech, Congress Working Committee resolution at Wardha (14 July 1942), key leaders (Jayaprakash Narayan, Aruna Asaf Ali, Ram Manohar Lohia). British took over a year to suppress it.',
    },
  },
]
