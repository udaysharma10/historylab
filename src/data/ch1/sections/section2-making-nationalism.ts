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
      // MAP — visualise the fragmented Europe (Neha: "put a map so as to make it clear")
      {
        id: 's2-intro-map',
        title: 'See It on the Map',
        type: 'map-ref',
        imageId: 'fig-3',
        text: 'This map of Europe shows just how **fragmented** the continent was. Where we expect to see one "Germany" or one "Italy", there were instead **many small states** packed together. Run your eye across the centre of the map: dozens of separate borders, each a different ruler. This is the patchwork that nationalists would later dream of stitching into single nations.',
        highlight: '**Map work tip:** In the exam, be able to point out that Germany and Italy did NOT exist as single countries — they were collections of many states.',
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
        title: 'Case Study: The Habsburg Empire',
        type: 'text',
        text: 'Take the **Habsburg Empire** — the perfect example of this patchwork. A single emperor ruled over a bewildering mix of regions and peoples who shared **no common language, religion or culture**. The only thing tying them together was their **ruler**. Look at the table below to see just how many different peoples lived under one crown.',
      },
      // TABLE — Habsburg composition (Neha: depict the patchwork visually, lots of content)
      {
        id: 's2-intro-habsburg-table',
        title: 'The Habsburg Empire — A Patchwork of Peoples',
        type: 'table',
        text: 'One empire, many peoples and languages — with nothing in common but the same emperor:',
        table: {
          headers: ['Region', 'People / Language'],
          rows: [
            ['Alpine regions — Tyrol, Austria, the Sudetenland', 'German-speaking'],
            ['Bohemia', 'German-speaking aristocracy over a Czech-speaking majority'],
            ['Lombardy and Venetia (northern Italy)', 'Italian-speaking'],
            ['Hungary', 'Half spoke Magyar, the other half a variety of dialects'],
            ['Galicia', 'Polish-speaking aristocracy'],
            ['Across the empire', 'A mass of **Slavs** — Bohemians, Slovaks, Slovenes, Croats'],
          ],
        },
        highlight: '**The big idea:** The Habsburg Empire was held together only by its ruler, not by any shared national identity. This is exactly the kind of empire that nationalism would later tear apart.',
        inlineQuiz: {
          question: 'The Habsburg Empire was best described as:',
          options: ['A unified nation-state', 'A patchwork of diverse regions and peoples', 'A democratic republic', 'A collection of city-states'],
          correctIndex: 1,
          explanation: 'The Habsburg Empire was a multi-ethnic patchwork of regions — Alpine, Bohemian, Italian, Hungarian, Galician — with diverse languages and cultures, held together only by a common ruler.',
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
        title: 'Who Ran This Patchwork? The Aristocracy',
        type: 'text',
        text: 'We just saw that empires like the Habsburgs\' were a jumble of peoples. So **who actually held power** across all these states? One small group: the **landed aristocracy**.\n\nThese were families who **owned vast estates** in the countryside (and often a town-house as well) and dominated **politics, the army and society**. Socially and politically, they were **the dominant class** of Europe. Here\'s what\'s striking — a French aristocrat had more in common with a Prussian aristocrat than with a French peasant in his own village. They **spoke French** for diplomacy and high society, and **intermarried across borders**. Because they already held all the power, **they didn\'t need nations.**',
      },
      {
        id: 's2-ar-2',
        title: 'The Majority: Peasants With No Voice',
        type: 'text',
        text: 'But the aristocracy was a **tiny minority**. The **vast majority** of people were **peasants**. In Western Europe, they farmed as tenants or small landowners. In Eastern and Central Europe, they were **serfs** — bound to the land and obliged to work for their lords. Peasants had no political voice, no representation, and no shared identity beyond their village. To picture the society of the time, compare the two groups side by side:',
      },
      // TABLE — societal structure (Neha: tabular presentation of society's divisions + features)
      {
        id: 's2-ar-society-table',
        title: 'European Society in the Mid-18th Century',
        type: 'table',
        text: 'Two groups, worlds apart:',
        table: {
          headers: ['Class', 'Size', 'Position & Features'],
          rows: [
            ['**Landed aristocracy**', 'Tiny minority', 'Dominant class — owned vast estates, controlled politics, army and society. United across Europe by a common way of life; spoke French; intermarried across borders.'],
            ['**Peasantry**', 'Overwhelming majority', 'Tenants and small owners in the west; **serfs** bound to the land in the east. No political rights, no voice, identity limited to the village.'],
          ],
        },
        highlight: '**Remember:** Power rested with a tiny landed aristocracy; the vast majority were voiceless peasants. The class that would later demand a *nation* — the middle class — did not yet exist in strength. That changes next.',
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
        id: 's2-lib-1b',
        title: 'Liberalism Had Two Sides — Political and Economic',
        type: 'text',
        text: 'Here\'s the key to understanding liberalism for the exam: it meant **different things in different spheres of life**. We\'ll take them one at a time — first what liberalism meant in **politics**, then what it meant for **society**, and finally what it meant in the **economy**.',
        highlight: '**Exam structure:** Liberalism = (1) Political sphere + (2) Social limits + (3) Economic sphere. Answer in these three parts.',
      },
      // FLOWCHART — Political liberalism, three pillars each clickable (Neha: each point separate + explanation)
      {
        id: 's2-lib-2',
        title: '1. Liberalism in the Political Sphere',
        type: 'flowchart',
        text: 'In politics, liberalism rested on **three pillars**. Tap each one:',
        steps: [
          { label: 'Personal freedom', detail: 'The individual is **free**, with rights that **no government can take away** — freedom of speech, opinion and belief.' },
          { label: 'Equality before the law', detail: 'Everyone is **equal in the eyes of the law** — an end to the **special privileges** that aristocrats and the clergy had enjoyed for centuries.' },
          { label: 'Government by consent', detail: 'No one may rule without the **people\'s permission**. This meant an end to autocracy and clerical privileges, a **written constitution**, and government through an **elected parliament**.' },
        ],
        highlight: '**Political liberalism =** individual freedom + equality before law + government by consent (constitution + elected parliament). In short: end absolute kings, write a constitution, let the people\'s representatives govern.',
      },
      {
        id: 's2-lib-3',
        type: 'vocabulary',
        text: 'Suffrage — The **right to vote** in elections. Watch this word: liberals demanded *government by the people*, but in practice they did **not** mean *all* the people — as the next card shows.',
      },
      // Social sphere — the limits of liberal equality (suffrage now defined just above)
      {
        id: 's2-lib-4',
        title: '2. Liberalism in the Social Sphere — Who Was Left Out?',
        type: 'text',
        text: 'There was a **catch**. Liberalism preached equality, but **equality before the law did not mean the right to vote for everyone (universal suffrage)**. Throughout the nineteenth century, the **right to vote was restricted to property-owning men**. **Women and the property-less were left out** entirely. In fact, the **Napoleonic Code reduced women to the status of a minor**, subject to the authority of their fathers and husbands.\n\nThis is why, all through the century, **women and non-propertied men ran movements demanding equal political rights.** Liberalism was a great step forward — but it was **not yet democracy**.',
        highlight: '**Important nuance (often tested):** Liberal "equality before law" ≠ universal suffrage. Only property-owning men could vote; women and the poor were excluded.',
        inlineQuiz: {
          question: 'Under the Napoleonic Code, women were:',
          options: ['Given equal voting rights', 'Allowed to own property but not vote', 'Reduced to the status of a minor', 'Elected to the National Assembly'],
          correctIndex: 2,
          explanation: 'The Napoleonic Code went back to limited suffrage and reduced women to the status of a minor, subject to the authority of fathers and husbands.',
        },
      },
      {
        id: 's2-lib-5',
        title: '3. Liberalism in the Economic Sphere',
        type: 'text',
        text: 'In the **economy**, liberalism meant the **freedom of markets** and the **abolition of state-imposed restrictions** on the movement of goods and capital. To see why this mattered, picture the problem the middle-class businessman faced: the German-speaking lands were a **confederation of 39 states, each with its own currency, weights and measures**.\n\nA merchant sending goods from Hamburg to Nuremberg had to pass through **numerous customs barriers**, paying a duty at each — and every duty was calculated differently because the weights and measures kept changing. It was a nightmare for trade. The liberal solution? **Sweep the barriers away.**',
        highlight: '**Economic liberalism =** free markets + no state restrictions on goods/capital. The obstacle: 39 states, each with its own currency, weights, measures and customs duties.',
      },
      // FLOWCHART — the Zollverein chain and its implications (Neha: Zollverein + implications + example)
      {
        id: 's2-lib-6',
        title: 'The Zollverein — Economic Unity Builds a Nation',
        type: 'flowchart',
        text: 'How free trade quietly built Germany — tap each step:',
        steps: [
          { label: '1834 — Prussia forms the Zollverein (customs union)', detail: 'In **1834**, a **customs union** called the **Zollverein** was formed at the initiative of **Prussia**. Most of the German states joined it.' },
          { label: 'Tariff barriers abolished, currencies cut from 30+ to 2', detail: 'The union **abolished tariff (customs) barriers** between member states and **reduced the number of currencies from over thirty to just two**, making trade vastly simpler.' },
          { label: 'A railway network ties the states together', detail: 'A growing **network of railways** further stimulated mobility and **economic nationalism**, physically connecting the German states and binding their economies together.' },
          { label: 'Implication: economic unity creates national feeling', detail: 'As Friedrich List put it, the Zollverein **bound the Germans economically into a nation** and **awakened national feeling** through material prosperity — *before* Germany was politically united.' },
        ],
        highlight: '**Zollverein (1834):** Prussian customs union → abolished tariff barriers, cut currencies 30+ → 2, railways added. **Implication: economic unity came before, and helped create, political unity.**',
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
        title: 'The Treaty of Vienna, 1815 — What Changed',
        type: 'flowchart',
        text: 'The settlement had one big aim: **undo the changes of the Napoleonic wars and contain France**. Tap each change — this is a favourite **5-mark** question:',
        steps: [
          { label: 'The Bourbon dynasty was restored in France', detail: 'The **Bourbon dynasty**, deposed during the revolution, was **put back on the throne** in France — turning the clock back to before 1789.' },
          { label: 'France lost the territories Napoleon had annexed', detail: 'France was **stripped of the lands it had annexed** under Napoleon, shrinking it back towards its old borders.' },
          { label: 'A ring of buffer states was set up around France', detail: 'A series of **buffer states** was created on France\'s borders to **block any future French expansion** — for example, the **Kingdom of the Netherlands** in the north and the addition of **Genoa to Piedmont** in the south.' },
          { label: 'Prussia gained important new territory in the west', detail: '**Prussia** was given **new western frontiers** (parts of the Rhineland and Saxony) as a reward and as a strong guard against France.' },
          { label: 'Austria gained control of northern Italy', detail: '**Austria** was handed control of **northern Italy — Lombardy and Venetia**, tightening its grip on the Italian peninsula.' },
          { label: 'Russia received part of Poland', detail: '**Russia** was given a **part of Poland**, while Prussia received a portion of Saxony — the great powers simply redrew the map among themselves.' },
        ],
        highlight: '**Treaty of Vienna 1815 (5 marks):** Bourbons restored • France shrunk & ringed with buffer states • Prussia expanded west • Austria got N. Italy (Lombardy-Venetia) • Russia got part of Poland. **The whole aim: restore the old order and contain France.**',
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
