import type { Subsection } from '../../../types/chapter'

export const section1Subsections: Subsection[] = [
  {
    id: 's1-intro',
    title: 'Introduction: Sorrieu\'s Vision',
    narrativeCards: [
      // Card 1: THE HOOK + why 1848 (merged)
      {
        id: 's1-hook',
        title: 'The Dream That Changed Europe',
        type: 'text',
        text: 'It\'s **1848**, and Europe is on fire. In Paris, workers are tearing up cobblestones to build barricades. In Vienna, the most powerful minister on the continent — **Metternich** — is fleeing in disguise. In **Frankfurt**, professors and lawyers are drafting a constitution for a German nation that **does not yet exist**. Across the continent, people are **rising in revolt** — demanding **democratic rights, national unification, and an end to autocratic monarchies**.\n\nAnd in a small studio in France, an artist named **Frédéric Sorrieu** is painting a dream — a dream of all nations, free and equal, marching together **towards** liberty.\n\nIt\'s a beautiful dream. And by the end of this chapter, you\'ll understand **why it died**.',
        highlight: '**1848 — the year of revolutions.** People across Europe demanded democracy, liberty and national unification. This chapter tells how that dream was born, fought for, and ultimately betrayed.',
      },
      // Card 2: Meet Sorrieu + the print itself (merged figure card)
      {
        id: 's1-intro-2',
        title: 'Meet Frédéric Sorrieu',
        type: 'figure',
        text: '**Frédéric Sorrieu**, a **French artist**, prepared a series of **four prints** in **1848** visualising his dream of a world made up of **"democratic and social Republics"**.\n\nThis **first print** shows the peoples of **Europe and America** — men and women of all ages and social classes — **marching in a long train**, offering **homage to the Statue of Liberty** as they pass by it. Tap the dots on the picture to explore each part of it.',
        imageId: 'fig-1',
        highlight: '**Who:** Frédéric Sorrieu, French artist. **What:** four prints (1848). **Theme:** a world of democratic and social republics.',
      },
      // Card 4: Liberty symbolism
      {
        id: 's1-intro-3',
        title: 'The Statue of Liberty — What She Holds',
        type: 'text',
        text: 'Why is there a **woman** at the centre of the picture? Because artists of the time could not draw an idea like "liberty" directly — so they **personified Liberty as a female figure** (this is called an *allegory*, something we\'ll study in detail later). She is the link that ties the whole march together: every nation in the procession is walking **towards her**.\n\nIn Sorrieu\'s print she bears the **torch of Enlightenment** in one hand and the **Charter of the Rights of Man** in the other. The torch stands for **knowledge and reason** lighting the way; the Charter stands for the **universal rights** that every citizen of a free nation deserved.',
        highlight: '**Statue of Liberty holds:** torch of Enlightenment (knowledge/reason) + Charter of Rights of Man (universal rights). She is the female *allegory* of Liberty that every nation marches towards. This is asked almost every year!',
      },
      // Card 5: Vocabulary — Absolutist (defined BEFORE first use, below)
      {
        id: 's1-intro-5',
        type: 'vocabulary',
        text: 'Absolutist — A government or system of rule that has **no restraints on the power exercised**. In history, it refers to a form of **monarchical government** that was **centralised, militarised and repressive**. Think: kings with unlimited power, no parliament, no constitution. Keep this word in mind — you\'ll see it in the very next picture.',
      },
      // Card 4: Vocabulary — Utopian (defined BEFORE first use; carries the "why utopian" check)
      {
        id: 's1-intro-6',
        type: 'vocabulary',
        text: 'Utopian — A vision of a society that is **so ideal that it is unlikely to actually exist**. The word comes from Thomas More\'s 1516 book "Utopia". You\'re about to read that Sorrieu painted a **utopian vision** — meaning a beautiful, perfect dream of free nations that, in **1848, did not yet exist** because most of Europe was still ruled by absolute monarchs.',
        inlineQuiz: {
          question: 'Why is Sorrieu\'s vision called "utopian"?',
          options: [
            'Because it showed real events happening in Europe',
            'Because it depicted an ideal world of democratic republics that did not yet exist',
            'Because it was painted in the city of Utopia',
            'Because the French government commissioned it',
          ],
          correctIndex: 1,
          explanation: 'It is called "utopian" because it depicted an ideal world — all nations as democratic republics living in fraternity — which was far from reality in 1848 when most of Europe was still under absolute monarchies.',
        },
      },
      // Card 7: Shattered absolutism + nations by flags (terms above are now defined)
      {
        id: 's1-intro-4',
        title: 'Shattered Symbols on the Ground',
        type: 'text',
        text: 'Now look at the ground. On the earth in the foreground lie the **shattered remains of the symbols of absolutist institutions** — the broken crowns, sceptres and chains of the old kings. In Sorrieu\'s **utopian vision**, the peoples of the world are grouped as **distinct nations**, each identified through its own **flag and national costume**.',
        inlineQuiz: {
          question: 'In Sorrieu\'s print, what do the shattered symbols on the ground represent?',
          options: ['Broken weapons of war', 'Remains of absolutist institutions', 'Ruins of ancient temples', 'Fragments of old maps'],
          correctIndex: 1,
          explanation: 'The shattered remains represent the destruction of absolutist institutions — monarchies with unchecked, centralised power. This symbolises the rejection of autocratic rule.',
        },
      },
      // Card 6: The marching nations + the nations that didn't exist yet (merged)
      {
        id: 's1-intro-7',
        title: 'The Marching Nations',
        type: 'text',
        text: 'The **order** of the march is not random — it tells a story. Leading the procession are the **United States and Switzerland**, **already nation-states** by 1848. **France**, identifiable by the **revolutionary tricolour**, has **just reached the statue** — shown as the next nation to arrive at liberty, fitting because the French Revolution lit the spark for the rest of Europe. Behind France come the peoples of **Germany**, bearing the **black, red and gold flag**.\n\nHere\'s what makes the print so powerful: when Sorrieu painted it, **Germany and Italy did not yet exist as united nations!** The German flag was an expression of **liberal hopes in 1848** to unite the many German-speaking states into one nation. Sorrieu was painting nations that were still **dreams**.',
        highlight: '**Procession:** USA & Switzerland (already nations) → France (tricolour, just arriving) → Germany (black-red-gold, still on the way). **Germany & Italy did NOT exist as nations in 1848** — Sorrieu painted them as he hoped they would become.',
      },
      // Card 7: Fraternity — Christ, saints, angels
      {
        id: 's1-intro-9',
        title: 'The Heavenly Symbol — Fraternity',
        type: 'text',
        text: 'Finally, look up. From the heavens above, **Christ, saints and angels** gaze upon the scene, symbolising **fraternity among the nations** of the world. This is a key detail that students often miss — Sorrieu\'s vision was not just about individual nations gaining freedom, but about **all nations living together in brotherhood and harmony**.',
        highlight: '**Christ, saints and angels = fraternity among nations.** Sorrieu\'s full message: **liberty + equality + fraternity** for ALL nations of the world.',
      },
      // Card 8: EXAM PREP — Synthesis card for 1, 3, and 5 mark answers
      {
        id: 's1-intro-exam',
        type: 'exam-prep',
        text: `Q: Describe Frederic Sorrieu's utopian vision. What was its significance in the context of nationalism in Europe?
Marks: 5 Marks
A: Frédéric Sorrieu was a French artist who in 1848 prepared a series of four prints visualising his dream of a world made up of democratic and social republics.
A: The first print shows peoples of Europe and America — men and women of all ages and social classes — marching in a long train, offering homage to the Statue of Liberty as they pass by it.
A: The Statue of Liberty bears the torch of Enlightenment in one hand and the Charter of the Rights of Man in the other — symbolising knowledge, reason, and universal rights.
A: On the ground lie the shattered remains of symbols of absolutist institutions — representing the overthrow of autocratic monarchies.
A: The peoples of the world are grouped as distinct nations, identified by their flags and national costumes. Leading the procession are the USA and Switzerland (already nation-states), followed by France (tricolour) and Germany (black-red-gold).
A: From the heavens above, Christ, saints and angels gaze down, symbolising fraternity among the nations of the world.
A: Significantly, many of the nations shown (like Germany and Italy) did not yet exist as unified states in 1848 — Sorrieu was painting an ideal, "utopian" vision of nations that were still dreams, reflecting the liberal-democratic aspirations of the 1848 revolutions.
Tip: This is the opening figure of Chapter 1 and is asked almost every year in CBSE boards. For 1-mark: know WHO (Sorrieu), WHEN (1848), WHAT (four prints, democratic republics). For 3-mark: add Liberty symbolism + shattered absolutism + nations by flags. For 5-mark: add fraternity (Christ/angels), significance (nations didn't exist yet), and why it's "utopian".
Tip: CBSE frequently asks source-based questions using the exact NCERT paragraph about Sorrieu's print. Read the textbook paragraph carefully — the questions will test specific details like "What does the Statue of Liberty hold?" or "Who leads the procession?"`,
      },
    ],
  },
  {
    id: 's1-nation-state',
    title: 'The Emergence of the Nation-State',
    narrativeCards: [
      {
        id: 's1-ns-1',
        title: 'What Changed — And Why It Matters',
        type: 'text',
        text: 'Sorrieu\'s painting shows us a **dream**. But how did that dream actually reshape Europe? Here\'s the big picture: before the nineteenth century, Europe was ruled by **multi-national dynastic empires** — a single king might rule over Germans, Italians, Hungarians, and Czechs who shared nothing in common except the same ruler.\n\nNationalism changed that. It replaced empires with **nation-states** — countries where the people, not just the king, felt they belonged together.',
        highlight: '**Key shift:** Multi-national empires (one king, many peoples) → Nation-states (one people, one country)',
      },
      {
        id: 's1-ns-2',
        title: 'What Is a Nation-State?',
        type: 'text',
        text: 'A **nation-state** is a country where the majority of citizens — not just the rulers — share a **sense of common identity**, a shared history, and a feeling of belonging together. Here\'s the crucial point: this "commonness" didn\'t exist from ancient times. **It was forged through struggles** — revolutions, wars, cultural movements, and political action. Nations aren\'t born. They are **built**.',
        highlight: '**Nation-state** = citizens share common identity + shared history. This identity was **built through struggle**, not inherited from ancient times.',
      },
      {
        id: 's1-ns-3',
        type: 'source',
        text: 'Ernst Renan, in his 1882 lecture "What is a Nation?", argued: "A nation is the culmination of a long past of endeavours, sacrifice and devotion... Its existence is a daily plebiscite." He rejected the idea that nations are formed by common language, race, religion, or territory.',
      },
      {
        id: 's1-ns-4',
        title: 'Why Renan\'s Definition Matters',
        type: 'text',
        text: 'Pay close attention to what Renan is saying — it\'s **not what most people assume**. He says a nation is NOT about shared DNA, language, or religion. It\'s about **a daily choice** — people choosing, every day, to belong together because of shared memories and shared purpose. He calls it a **"daily plebiscite"** — a daily vote.\n\nThis matters because it challenged the dangerous idea that nations are based on **race or blood**. That idea would later fuel the worst atrocities of the twentieth century.',
        highlight: '**Renan\'s key argument:** A nation = daily choice to belong together (shared memory + purpose). NOT based on race, language, or religion. This is frequently tested in CBSE source-based questions.',
      },
    ],
  },
  {
    id: 's1-french-rev',
    title: 'The French Revolution and the Idea of the Nation',
    narrativeCards: [
      {
        id: 's1-fr-1',
        title: 'Before 1789: France Under an Absolute Monarch',
        type: 'text',
        text: 'The first clear expression of nationalism came with the **French Revolution in 1789**. Before the revolution, France was already a territorial state — but power lay entirely in the hands of the **king**. An **absolute monarch** ruled with unlimited authority; the ordinary people were his **subjects**, not citizens with rights.',
      },
      // Vocabulary — Sovereignty (defined before it is used below)
      {
        id: 's1-fr-sovereignty',
        type: 'vocabulary',
        text: 'Sovereignty — The **supreme, ultimate power** to govern a country and take decisions for it. The key question in any state is: *who holds sovereignty?* Before 1789 it lay with the **king**. The French Revolution\'s biggest change was to shift sovereignty to the **people** (the citizens).',
      },
      {
        id: 's1-fr-2',
        title: 'After 1789: Sovereignty Passes to the People',
        type: 'text',
        text: 'The revolution changed one fundamental thing: **sovereignty** moved from the **monarchy** to the **body of citizens**. The nation\'s authority would no longer flow from a king on a throne — it would flow from the **people themselves**.\n\nThis single shift is what created the modern idea of a **nation**: a community of citizens who together hold sovereignty and shape the destiny of their country.',
        highlight: '**The key shift:** Sovereignty moved from monarchy → the people. The citizens now constituted the nation and shaped its destiny.',
      },
      // FLOWCHART — intro + tappable measures. Merged from the old standalone text card so the
      // "tap each step below" prompt sits directly above the steps it refers to (frequently asked 5-marker).
      {
        id: 's1-fr-measures',
        title: 'How Do You Make Strangers Feel Like One Nation?',
        type: 'flowchart',
        text: 'Shifting sovereignty to the people raised a practical problem: how do you make millions of strangers — who spoke different dialects and lived under different local laws — **feel** that they belonged to **one** nation?\n\nThe French revolutionaries answered with a series of deliberate **measures to create a sense of collective belonging**. Tap each step below to see how it worked — this is one of the most frequently asked questions in the board exam.',
        steps: [
          { label: 'The ideas of *la patrie* and *le citoyen*', detail: 'The ideas of **la patrie** (the fatherland) and **le citoyen** (the citizen) emphasised the notion of a **united community enjoying equal rights under a constitution**. Every person was now a citizen of the fatherland, not a subject of a king.' },
          { label: 'A new tricolour flag', detail: 'A **new French flag, the tricolour** (blue-white-red), replaced the former **royal standard**. A shared flag gave people a single symbol to rally around.' },
          { label: 'The Estates General becomes the National Assembly', detail: 'The **Estates General** was elected by the body of **active citizens** and renamed the **National Assembly**. For the first time, the assembly represented the people rather than the three old estates.' },
          { label: 'Hymns, oaths and martyrs', detail: 'New **hymns** were composed, **oaths** taken, and **martyrs commemorated** — all in the name of the nation. These shared rituals built emotional attachment to the country.' },
          { label: 'A centralised system with uniform laws', detail: 'A **centralised administrative system** was put in place, framing **uniform laws** for all citizens within its territory. Everyone now lived under the same set of rules.' },
          { label: 'Internal customs duties abolished', detail: 'Internal **customs duties and dues** were abolished. Earlier, goods were taxed at every regional border; removing these barriers helped knit the regions into one economy.' },
          { label: 'A uniform system of weights and measures', detail: 'A **uniform system of weights and measures** was adopted, so that grain, cloth and land were measured the same way everywhere — replacing the confusing patchwork of regional units.' },
          { label: 'A common national language', detail: 'The **dialect of Paris** (French) became the **common language** of the nation. **Regional dialects** were discouraged. The aim was to make every person — whether Breton, Provençal or Alsatian — **feel French**.' },
        ],
        highlight: '**Frequently asked (5 marks): "List the measures taken by the French revolutionaries to create a sense of collective identity/belonging."** Learn these eight steps — they are almost guaranteed in the board exam.',
        inlineQuiz: {
          question: 'What replaced the Estates General during the French Revolution?',
          options: ['The Parliament', 'The National Assembly', 'The Senate', 'The Council of Ministers'],
          correctIndex: 1,
          explanation: 'The Estates General was elected by the body of active citizens and renamed the National Assembly.',
        },
      },
      {
        id: 's1-fr-6',
        title: 'France\'s Mission — Liberate Europe',
        type: 'text',
        text: 'The revolutionaries went further — they declared it was **France\'s mission** to liberate the peoples of Europe from despotism. France wouldn\'t just free itself; it would help **all peoples** become nations. This was an extraordinary claim — and it set the stage for what Napoleon would do next.',
      },
      // Spread of the revolution — Jacobin clubs and French armies (moved here from Napoleon unit: it belongs to the French Revolution's export of its ideas)
      {
        id: 's1-fr-7',
        title: 'The Revolution Spreads Beyond France',
        type: 'figure',
        text: 'And spread it did. When news of the revolution reached other countries, **students and members of the educated middle classes** began setting up **Jacobin clubs**. Their activities and campaigns prepared the way for the **French armies** which moved into **Holland, Belgium, Switzerland and much of Italy** in the **1790s** — carrying the idea of the nation with them.',
        imageId: 'fig-2',
      },
    ],
  },
  {
    id: 's1-napoleon',
    title: 'Napoleon and the Spread of Nationalism',
    narrativeCards: [
      // NEW — Who was Napoleon and how he rose to power (story opener Neha asked for)
      {
        id: 's1-nap-intro',
        title: 'Who Was Napoleon?',
        type: 'text',
        text: 'So who was this man whose armies carried the revolution across Europe? **Napoleon Bonaparte** was a brilliant young **general** who made his name winning battles for the French Republic. As the revolution at home slid into chaos and infighting, France longed for a strong hand — and in **1799 Napoleon seized power**, later crowning himself **Emperor of France in 1804**.\n\nHere lies the great irony of his story: Napoleon had **destroyed democracy in France** (an emperor is not elected) — yet in the way he *ran* his empire, he **kept many of the revolution\'s best ideas**.',
        highlight: '**Napoleon:** a French general who seized power in **1799** and became Emperor in **1804**. He ended democracy at home but spread the revolution\'s administrative ideas across Europe.',
      },
      {
        id: 's1-nap-2',
        title: 'What Was Napoleon Famous For?',
        type: 'text',
        text: 'Napoleon is remembered above all as a **reformer of administration**. He took the messy, unequal systems of the old kingdoms and made them **rational and efficient** — applying the principles of the revolution to law and government. His single most famous achievement was a new law code that still shapes legal systems today: the **Napoleonic Code**.',
      },
      // Napoleonic Code — own heading + point-wise reforms as a flowchart (Neha: separate heading, make point-wise, connect)
      {
        id: 's1-nap-code',
        title: 'The Napoleonic Code (1804)',
        type: 'flowchart',
        text: 'The **Civil Code of 1804** — usually called the **Napoleonic Code** — swept away the privileges of the old order and was **exported to every region under French control**. Tap each reform to understand it:',
        steps: [
          { label: 'Did away with privileges based on birth', detail: 'No longer would a person\'s rights depend on whether they were born a noble or a commoner. **Birth-based privilege was abolished** — a revolutionary idea in a Europe ruled by aristocrats.' },
          { label: 'Established equality before the law', detail: '**Every citizen was equal in the eyes of the law.** The same rules applied to rich and poor, noble and peasant alike.' },
          { label: 'Secured the right to property', detail: 'The Code **guaranteed the right to own property** — protecting people\'s land and possessions from arbitrary seizure.' },
          { label: 'Simplified administrative divisions', detail: 'In the **Dutch Republic, Switzerland, Italy and Germany**, Napoleon **simplified administrative divisions**, making government clearer and more uniform.' },
          { label: 'Abolished feudalism and serfdom', detail: 'He **abolished the feudal system** and **freed peasants from serfdom** and from **manorial dues** — releasing millions from obligations to local lords.' },
          { label: 'Removed guild restrictions', detail: '**Guild restrictions** on trade and crafts were removed, allowing businesses and markets to grow more freely.' },
          { label: 'Improved transport and communication', detail: '**Transport and communication systems were improved**, helping trade, travel and the spread of ideas across the empire.' },
        ],
        highlight: '**Napoleonic Code (1804):** no birth privileges • equality before law • right to property • simplified administration • end of feudalism/serfdom • no guild restrictions • better transport. **Initially, businessmen and small-scale producers welcomed these changes.**',
        inlineQuiz: {
          question: 'Which of these was NOT a reform introduced by Napoleon in conquered territories?',
          options: ['Abolition of feudal system', 'Freedom of peasants from serfdom', 'Universal adult suffrage', 'Simplification of administrative divisions'],
          correctIndex: 2,
          explanation: 'Napoleon did not introduce universal adult suffrage. The Napoleonic Code actually reduced women\'s status and brought back limited suffrage.',
        },
      },
      // Why he came to be disliked — tree of liberty (Neha: connect, then show tree picture)
      {
        id: 's1-nap-5',
        title: 'From Liberators to Oppressors',
        type: 'figure',
        text: 'At first, this all sounded wonderful — and in the conquered lands the French armies were **welcomed as harbingers of liberty**. The tree of liberty in this image was actually **planted by local people** to celebrate their new freedoms.\n\nBut the **enthusiasm soon turned to hostility**. The reality of being a conquered territory set in: **increased taxation, censorship, and forced conscription** of young men into Napoleon\'s armies. For most people these burdens **outweighed** the benefits of the new administrative system — and they began to see the French not as liberators, but as **occupiers**.',
        imageId: 'fig-4',
        highlight: '**WHY people turned against Napoleon:** heavy taxation + censorship + forced conscription outweighed the benefits of his reforms. Liberty imposed by a foreign army no longer felt like liberty.',
      },
      {
        id: 's1-nap-6',
        title: 'The Fall of Napoleon',
        type: 'figure',
        text: 'The end came on the battlefield. After the **Battle of Leipzig in 1813**, Napoleon\'s power declined rapidly, and he was finally defeated at **Waterloo in 1815**. This caricature captures it perfectly: Napoleon is drawn as a **postman losing his letters** — each falling letter bearing the name of a territory he has lost.',
        imageId: 'fig-5',
      },
      // TIMELINE REFERENCE — Section 1 key dates
      {
        id: 's1-timeline',
        title: 'Section 1 Timeline: Revolution to Napoleon',
        type: 'timeline-ref',
        text: `1789 — **French Revolution** begins; sovereignty transfers from monarchy to citizens
1791 — National Assembly formed; new constitution; tricolour flag adopted
1799 — Napoleon rises to power in France
1804 — **Napoleonic Code** introduced: equality before law, abolished birth privileges, right to property
1806 — Napoleon dissolves the Holy Roman Empire
1813 — **Battle of Leipzig**: Napoleon defeated; begins losing territories
1815 — Napoleon defeated at **Waterloo**; exiled; old powers gather at Vienna`,
        highlight: '**Key exam dates from this section:** 1789 (Revolution), 1804 (Napoleonic Code), 1815 (Waterloo). These dates appear in almost every CBSE paper.',
      },
      // CLOSING CARD — What Comes Next
      {
        id: 's1-closing',
        title: 'What Comes Next...',
        type: 'text',
        text: 'So here\'s where we stand: the French Revolution proved that **people can overthrow kings** and build nations. Napoleon **carried that idea across Europe** — but on the tip of a bayonet, not through democracy. He freed peasants from feudalism but crushed their freedom with taxes and conscription.\n\nNow Napoleon has fallen. The old kings are gathering to **put the genie back in the bottle**. But here\'s what they don\'t understand: **you can\'t kill an idea**.\n\nIn the next section, we\'ll see what happened when the old powers tried to crush the dream of nationalism — and why they failed.',
        highlight: '**The story so far:** French Revolution created the idea of the nation → Napoleon spread it across Europe → He fell, and the old kings tried to reverse everything. But the idea survived.',
      },
    ],
  },
]
