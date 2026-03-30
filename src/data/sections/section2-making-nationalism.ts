import type { Subsection } from '../../types/chapter'

export const section2Subsections: Subsection[] = [
  {
    id: 's2-intro',
    title: 'Europe Before Nation-States',
    narrativeCards: [
      {
        id: 's2-intro-1',
        type: 'text',
        text: 'If you look at the map of mid-eighteenth-century Europe you will find that there were no "nation-states" as we know them today. What we know today as Germany, Italy and Switzerland were divided into kingdoms, duchies and cantons whose rulers had their own autonomous territories.',
      },
      {
        id: 's2-intro-2',
        type: 'text',
        text: 'Eastern and Central Europe were under autocratic monarchies within the territories of which lived diverse peoples. They did not see themselves as sharing a collective identity or common culture. They even spoke different languages and belonged to different ethnic groups.',
        highlight: 'No nation-states in 18th century Europe — diverse peoples under autocratic monarchies',
      },
      {
        id: 's2-intro-3',
        type: 'text',
        text: 'The Habsburg Empire, for example, was a patchwork of many different regions and peoples. It included the Alpine regions (Tyrol, Austria, Sudetenland), Bohemia (German-speaking aristocracy), Italian-speaking Lombardy and Venetia, and Hungary (Magyar-speaking).',
        inlineQuiz: {
          question: 'The Habsburg Empire was best described as:',
          options: ['A unified nation-state', 'A patchwork of diverse regions and peoples', 'A democratic republic', 'A collection of city-states'],
          correctIndex: 1,
          explanation: 'The Habsburg Empire was a multi-ethnic patchwork of regions — Alpine, Bohemian, Italian, Hungarian — with diverse languages and cultures.',
        },
      },
    ],
  },
  {
    id: 's2-aristocracy',
    title: 'The Aristocracy and the New Middle Class',
    narrativeCards: [
      {
        id: 's2-ar-1',
        type: 'text',
        text: 'Socially and politically, a landed aristocracy was the dominant class on the continent. They were united by a common way of life that cut across regional divisions — they owned estates, spoke French for diplomacy, and were connected by ties of marriage.',
      },
      {
        id: 's2-ar-2',
        type: 'text',
        text: 'The majority of the population was made up of the peasantry. In Western Europe, land was farmed by tenants and small owners. In Eastern and Central Europe, vast estates were cultivated by serfs.',
      },
      {
        id: 's2-ar-3',
        type: 'text',
        text: 'Industrialisation began in England in the second half of the 18th century. In its wake, new social groups came into being: a working-class population, and middle classes made up of industrialists, businessmen and professionals.',
        highlight: 'Industrialisation created new classes: working class + middle class (industrialists, businessmen, professionals)',
      },
      {
        id: 's2-ar-4',
        type: 'text',
        text: 'It was among the educated, liberal middle classes that ideas of national unity following the abolition of aristocratic privileges gained popularity.',
      },
    ],
  },
  {
    id: 's2-liberalism',
    title: 'What did Liberal Nationalism Stand for?',
    narrativeCards: [
      {
        id: 's2-lib-1',
        type: 'text',
        text: 'Ideas of national unity in early-nineteenth-century Europe were closely allied to the ideology of liberalism. The term derives from the Latin root liber, meaning free.',
      },
      {
        id: 's2-lib-2',
        type: 'text',
        text: 'For the new middle classes, liberalism stood for freedom of the individual and equality of all before the law. Politically, it emphasised government by consent, the end of autocracy and clerical privileges, a constitution and representative government through parliament.',
        highlight: 'Liberalism: individual freedom, equality before law, government by consent, constitution, parliament',
      },
      {
        id: 's2-lib-3',
        type: 'vocabulary',
        text: 'Suffrage — The right to vote. In revolutionary France, voting rights were granted exclusively to property-owning men. Women and non-propertied men were excluded.',
      },
      {
        id: 's2-lib-4',
        type: 'text',
        text: 'Equality before the law did not necessarily stand for universal suffrage. In revolutionary France, the right to vote was granted only to property-owning men. The Napoleonic Code reduced women to the status of a minor, subject to fathers and husbands.',
        inlineQuiz: {
          question: 'Under the Napoleonic Code, women were:',
          options: ['Given equal voting rights', 'Allowed to own property but not vote', 'Reduced to the status of a minor', 'Elected to the National Assembly'],
          correctIndex: 2,
          explanation: 'The Napoleonic Code went back to limited suffrage and reduced women to the status of a minor, subject to the authority of fathers and husbands.',
        },
      },
      {
        id: 's2-lib-5',
        type: 'text',
        text: 'In the economic sphere, liberalism stood for freedom of markets and the abolition of state-imposed restrictions on the movement of goods and capital. Napoleon\'s measures had created a confederation of 39 states with their own currencies, weights and measures.',
      },
      {
        id: 's2-lib-6',
        type: 'text',
        text: 'In 1834, a customs union or Zollverein was formed at the initiative of Prussia. It abolished tariff barriers and reduced the number of currencies from over thirty to two. Railways further stimulated economic nationalism.',
        highlight: 'Zollverein (1834): Customs union — abolished tariff barriers, reduced currencies from 30+ to 2',
      },
      {
        id: 's2-lib-7',
        type: 'source',
        text: 'Friedrich List, Professor of Economics at Tübingen, wrote in 1834: "The aim of the Zollverein is to bind the Germans economically into a nation. It will strengthen the nation materially... A free economic system is the only means to engender national feeling."',
      },
    ],
  },
  {
    id: 's2-conservatism',
    title: 'A New Conservatism after 1815',
    narrativeCards: [
      {
        id: 's2-con-1',
        type: 'vocabulary',
        text: 'Conservatism — A political philosophy that stressed the importance of tradition, established institutions and customs, and preferred gradual development to quick change.',
      },
      {
        id: 's2-con-2',
        type: 'text',
        text: 'Following the defeat of Napoleon in 1815, European governments were driven by conservatism. Conservatives believed that traditional institutions — the monarchy, Church, social hierarchies, property and family — should be preserved.',
      },
      {
        id: 's2-con-3',
        type: 'text',
        text: 'Most conservatives did not propose a return to pre-revolutionary days. They realised that modernisation could strengthen traditional institutions — a modern army, efficient bureaucracy, dynamic economy, and the abolition of feudalism could strengthen autocratic monarchies.',
        highlight: 'Conservatives accepted modernisation could strengthen monarchy — modern army, bureaucracy, economy',
      },
      {
        id: 's2-con-4',
        type: 'text',
        text: 'In 1815, representatives of European powers — Britain, Russia, Prussia and Austria — met at Vienna to draw up a settlement. The Congress was hosted by the Austrian Chancellor Duke Metternich.',
      },
      {
        id: 's2-con-5',
        type: 'text',
        text: 'The Treaty of Vienna of 1815 aimed to undo the changes of the Napoleonic wars: the Bourbon dynasty was restored in France, buffer states were created around France, Prussia got western frontiers, Austria got northern Italy, and Russia got part of Poland.',
        inlineQuiz: {
          question: 'Who hosted the Congress of Vienna in 1815?',
          options: ['Napoleon Bonaparte', 'Duke Metternich', 'Tsar Alexander I', 'Friedrich Wilhelm IV'],
          correctIndex: 1,
          explanation: 'The Congress of Vienna was hosted by the Austrian Chancellor Duke Metternich. It aimed to restore the conservative order in Europe.',
        },
      },
      {
        id: 's2-con-6',
        type: 'figure',
        text: 'Conservative regimes set up in 1815 were autocratic. They did not tolerate criticism or dissent, and imposed censorship laws to control newspapers, books, plays and songs that reflected ideas of liberty and freedom.',
        imageId: 'fig-6',
      },
    ],
  },
  {
    id: 's2-revolutionaries',
    title: 'The Revolutionaries',
    narrativeCards: [
      {
        id: 's2-rev-1',
        type: 'text',
        text: 'During the years following 1815, the fear of repression drove many liberal-nationalists underground. Secret societies sprang up in many European states to train revolutionaries and spread their ideas.',
      },
      {
        id: 's2-rev-2',
        type: 'text',
        text: 'To be revolutionary at this time meant a commitment to oppose monarchical forms established after the Vienna Congress, and to fight for liberty and freedom. Most revolutionaries saw the creation of nation-states as a necessary part of this struggle.',
      },
      {
        id: 's2-rev-3',
        type: 'figure',
        text: 'One such revolutionary was Giuseppe Mazzini. Born in Genoa in 1805, he became a member of the secret society of the Carbonari. Sent into exile at 26, he founded Young Italy in Marseilles and then Young Europe in Berne.',
        imageId: 'fig-7',
      },
      {
        id: 's2-rev-4',
        type: 'text',
        text: 'Mazzini believed that God had intended nations to be the natural units of mankind. Italy had to be forged into a single unified republic within a wider alliance of nations. Following his model, secret societies were set up in Germany, France, Switzerland and Poland.',
        highlight: 'Mazzini: nations are God\'s natural units; Italy must become a unified republic',
      },
      {
        id: 's2-rev-5',
        type: 'text',
        text: 'Mazzini\'s relentless opposition to monarchy and his vision of democratic republics frightened the conservatives. Metternich described him as "the most dangerous enemy of our social order".',
        inlineQuiz: {
          question: 'Who described Mazzini as "the most dangerous enemy of our social order"?',
          options: ['Napoleon', 'Bismarck', 'Metternich', 'Garibaldi'],
          correctIndex: 2,
          explanation: 'Austrian Chancellor Metternich described Mazzini as "the most dangerous enemy" because his ideas of democratic republics threatened the conservative order.',
        },
      },
    ],
  },
]
