import type { Subsection } from '../../../types/chapter'

export const section2Subsections: Subsection[] = [
  {
    id: 's2-intro',
    title: 'Europe Before Nation-States',
    narrativeCards: [
      // OPENING CARD — Story So Far
      {
        id: 's2-opener',
        title: 'The Story So Far...',
        type: 'text',
        text: 'Napoleon is gone. Defeated at Waterloo, exiled, finished. But the **idea he spread** — that people can govern themselves, that nations belong to their citizens — that idea is **very much alive**.\n\nNow the old kings are back on their thrones. They want to **undo everything**. But to understand what happens next, we first need to understand what Europe actually looked like before all of this began.',
        highlight: '**Recap:** Napoleon fell, but the idea of nationalism survived. Now we look at what Europe was like BEFORE the revolutions — and who would carry the dream forward.',
      },
      {
        id: 's2-intro-1',
        title: 'A Europe Without Nations',
        type: 'text',
        text: 'Look at a map of mid-eighteenth-century Europe and you\'ll notice something striking: **there were no "nation-states" as we know them today**. What we call Germany was broken into dozens of kingdoms and duchies. Italy was split into seven states. Switzerland was a patchwork of cantons. Each ruler controlled their own little territory.',
      },
      {
        id: 's2-intro-2',
        title: 'Many Peoples, No Shared Identity',
        type: 'text',
        text: 'Eastern and Central Europe were ruled by **autocratic monarchies** — but here\'s the key point: the people living under these monarchies had **nothing in common** with each other. A Hungarian farmer, a Czech merchant, and an Italian nobleman might all be subjects of the same emperor, but they spoke different languages, followed different customs, and **didn\'t think of themselves as one people**.',
        highlight: '**No nation-states** in 18th century Europe — diverse peoples under autocratic monarchies with no shared identity',
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
        title: 'The Old Rulers: Aristocrats Without Borders',
        type: 'text',
        text: 'Who actually ran Europe? The **landed aristocracy**. These were families who owned vast estates and held political power. Here\'s what\'s interesting: a French aristocrat had more in common with a Prussian aristocrat than with a French peasant living on his own land. They spoke French for diplomacy, intermarried across borders, and shared the same way of life. **They didn\'t need nations** — they already had power.',
      },
      {
        id: 's2-ar-2',
        title: 'The Majority: Peasants With No Voice',
        type: 'text',
        text: 'The vast majority of people were **peasants**. In Western Europe, they farmed as tenants or small landowners. In Eastern and Central Europe, they were **serfs** — bound to the land, essentially the property of their lords. Peasants had no political voice, no representation, and no shared identity beyond their village.',
      },
      {
        id: 's2-ar-3',
        title: 'The Game-Changer: Industrialisation',
        type: 'text',
        text: '**Industrialisation** began in England in the second half of the 18th century — and it changed everything. Factories created two entirely new social classes: a **working class** (factory workers, labourers) and a **middle class** (industrialists, businessmen, lawyers, teachers, professionals).',
        highlight: 'Industrialisation created new classes: **working class** + **middle class** (industrialists, businessmen, professionals)',
      },
      {
        id: 's2-ar-4',
        title: 'Why the Middle Class Wanted Nations',
        type: 'text',
        text: 'Here\'s **why this matters for nationalism**: the new middle class had **money and education** but **no political power**. Aristocrats controlled the governments. The middle class couldn\'t vote, couldn\'t hold office, couldn\'t change laws that restricted their businesses.\n\nThey needed a **new political system** — one based on constitutions, parliaments, and equal rights. That system was the **nation-state**. This is why ideas of national unity and the abolition of aristocratic privileges became popular among the educated, liberal middle classes — not the peasants, not the aristocrats.',
        highlight: '**WHY the middle class championed nationalism:** They had money and education but no political power. Nation-states with constitutions would give them a voice.',
      },
    ],
  },
  {
    id: 's2-liberalism',
    title: 'What did Liberal Nationalism Stand for?',
    narrativeCards: [
      {
        id: 's2-lib-1',
        title: 'The Ideology Behind the Dream: Liberalism',
        type: 'text',
        text: 'The dream of national unity wasn\'t just an emotion — it was built on a specific **ideology**: **liberalism**. The word comes from the Latin *liber*, meaning **free**. And that tells you everything about what the middle class wanted.',
      },
      {
        id: 's2-lib-2',
        title: 'What Liberalism Actually Meant',
        type: 'text',
        text: 'For the new middle classes, liberalism stood for three big ideas:\n\n**1. Personal freedom** — the individual is free, with rights no government can take away\n**2. Equality before the law** — no special privileges for aristocrats or clergy\n**3. Government by consent** — rulers must have the people\'s permission to govern, through a **constitution** and an elected **parliament**\n\nIn short: **end the kings, write a constitution, let the people vote**.',
        highlight: '**Liberalism =** individual freedom + equality before law + government by consent (constitution + parliament)',
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
      {
        id: 's2-lib-8',
        title: 'Why the Zollverein Mattered So Much',
        type: 'text',
        text: 'Think about it this way: when a merchant in Hamburg and a factory owner in Bavaria **traded freely for years** — no border taxes, same currency, same weights and measures — they started **feeling like one country** even though politically they weren\'t.\n\n**Economic unity came before political unity.** The Zollverein didn\'t create Germany, but it made Germans feel German. When Bismarck later unified Germany by force, the economic foundations were already in place.',
        highlight: '**WHY Zollverein matters:** Economic unity preceded political unity. Free trade made Germans feel like one nation before they officially became one.',
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
        title: 'The Backlash: Old Powers Strike Back',
        type: 'text',
        text: 'Napoleon is defeated in **1815**. The old kings are back. And they are **angry**. European governments swung hard toward conservatism — the belief that traditional institutions, the **monarchy, Church, and social hierarchies**, must be preserved at all costs. They had seen what revolution could do, and they were determined to make sure it never happened again.',
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
      // TIMELINE REFERENCE — Section 2 key dates
      {
        id: 's2-timeline',
        title: 'Section 2 Timeline: From Vienna to Secret Societies',
        type: 'timeline-ref',
        text: `1815 — **Congress of Vienna**: Metternich restores conservative order; redraws map of Europe
1815 — Bourbon dynasty restored in France; buffer states created around France
1820s — Secret societies spring up across Europe; liberal-nationalists go underground
1831 — Mazzini founds **Young Italy** in Marseilles
1833 — Mazzini founds **Young Europe** in Berne
1834 — **Zollverein** formed: Prussian customs union abolishes tariff barriers, reduces currencies from 30+ to 2`,
        highlight: '**Key exam dates:** 1815 (Congress of Vienna), 1831 (Young Italy), 1834 (Zollverein). The Zollverein is a favourite CBSE question topic.',
      },
      // MAP REFERENCE — Europe after Congress of Vienna
      {
        id: 's2-map',
        title: 'Map: Europe After the Congress of Vienna (1815)',
        type: 'map-ref',
        imageId: 'fig-3',
        text: 'This map shows how Metternich redrew the boundaries of Europe at the Congress of Vienna. Notice: **France** is surrounded by buffer states. **Prussia** gets important western frontiers. **Austria** controls northern Italy (Lombardy and Venetia). **Russia** gets part of Poland. The entire map is designed to **contain France** and prevent another Napoleon from rising.',
        highlight: '**Exam tip:** CBSE often asks "What changes were made by the Treaty of Vienna 1815?" Use this map to remember: Bourbon restoration, buffer states, Prussia expanded, Austria got N. Italy, Russia got Poland.',
      },
      // CLOSING CARD — What Comes Next
      {
        id: 's2-closing',
        title: 'What Comes Next...',
        type: 'text',
        text: 'The dream of nationalism was now **alive in two forms**: the **middle class** wanted constitutions and parliaments (political liberalism), and the **Zollverein** was quietly building economic unity. Meanwhile, revolutionaries like Mazzini were organising in secret, and conservatives like Metternich were trying to crush them.\n\nSomething had to give. In the next section, we\'ll see what happened when the pressure finally exploded — **in revolution after revolution, from Greece to Paris to Frankfurt**.',
        highlight: '**The story so far:** The idea of nationalism survived Napoleon\'s fall. It grew in secret societies, in economic unions, in liberal ideology. The old powers tried to crush it. They couldn\'t. The explosion is coming.',
      },
    ],
  },
]
