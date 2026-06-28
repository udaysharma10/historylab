import type { Subsection } from '../../../types/chapter'

export const section1Subsections: Subsection[] = [
  {
    id: 'ch2-s1-backdrop',
    title: 'The Backdrop — 300 Years in 5 Minutes',
    narrativeCards: [
      // HOOK — storyteller opening
      {
        id: 'ch2-s1-hook',
        title: 'The Man Who Changed Everything',
        type: 'text',
        text: 'It\'s **1919**. India is exhausted. The First World War has drained everything — taxes doubled, millions forcibly recruited into the army, crops failed, and an influenza epidemic has killed **12 to 13 million people**. The British promised that peace would bring relief. Instead, they pass a law that allows them to **jail anyone, without trial, for two years**.\n\nInto this anger walks a man who has just returned from South Africa with a dangerous idea: you can **defeat an empire** — not with guns, but by **refusing to cooperate** with it.\n\nHis name is **Mohandas Karamchand Gandhi**. And his idea will change India forever.',
        highlight: '**This chapter tells the story of how one man tried to unite 300 million people — and what happened when they discovered they all wanted different things from freedom.**',
      },
      // Historical backdrop — Neha's approach
      {
        id: 'ch2-s1-backdrop-1',
        title: 'Before Gandhi: 300 Years of Resistance',
        type: 'text',
        text: 'To understand WHY Gandhi mattered, you need to know what came before him.\n\n**1612**: The East India Company arrives in India — just to trade.\n**1757**: They\'re ruling India.\n**1857**: The first major revolt — the Sepoy Mutiny. But it\'s **regional** (Meerut, Delhi, Lucknow), **fragmented** (no single leader), and **crushed** within a year.\n\nFor the next **60 years**, there are scattered protests, petitions, and revolts. All defeated. All regional. All without a unifying leader or method.',
        highlight: '**Before Gandhi:** Every revolt was (1) regional — not national (2) fragmented — no single leader (3) quickly crushed. India resisted for 300 years. But never **together**.',
      },
      {
        id: 'ch2-s1-backdrop-2',
        title: 'What Was the Pattern?',
        type: 'text',
        text: 'Here\'s the pattern across **every resistance before Gandhi**:\n\n**1.** All were about **economic exploitation** — taxes, land, wages\n**2.** All were **regional** — one district, one province at a time\n**3.** All had **no single unifying leader** — local heroes, not national ones\n**4.** All were **short-lived** — put down within months or years\n\nFor a movement to succeed against the British Empire, it needed to be **national**, **united**, **sustained**, and led by someone who could speak to **all of India**. That\'s what Gandhi brought.',
        highlight: '**The pattern:** Every pre-Gandhi revolt was regional + fragmented + short-lived. Gandhi\'s genius was making the movement **national, united, and non-violent**.',
        inlineQuiz: {
          question: 'What was common across all Indian revolts before Gandhi?',
          options: [
            'They were regional, fragmented, and quickly crushed',
            'They were all successful in driving out the British',
            'They all used non-violent methods',
            'They were all led by the Indian National Congress',
          ],
          correctIndex: 0,
          explanation: 'Before Gandhi, every revolt was regional (limited to one area), fragmented (no single leader), and short-lived (quickly suppressed). Gandhi\'s contribution was making the movement national, united, and sustained.',
        },
      },
    ],
  },
  {
    id: 'ch2-s1-wwi',
    title: 'The First World War and Its Impact',
    narrativeCards: [
      {
        id: 'ch2-s1-wwi-intro',
        title: 'A New Political and Economic Situation',
        type: 'text',
        text: 'Before we meet Gandhi, we must understand the **world he stepped into** — because, as the NCERT puts it, the **First World War (1914–1918) created a new economic and political situation** in India. The war was fought thousands of kilometres away in Europe, yet it **changed the lives of ordinary Indians** completely. The hardship it caused is the soil in which Indian nationalism grew. Let\'s see exactly how the war broke India.',
        highlight: '**Start here (NCERT):** The First World War created a new economic and political situation in India. Understanding the war\'s impact is the foundation of this whole chapter.',
      },
      {
        id: 'ch2-s1-wwi-impact',
        title: 'The War That Broke India',
        type: 'text',
        text: 'The First World War **devastated India** even though the fighting was in Europe:\n\n**1.** **Defence spending soared**, paid for by **war loans** and by **raising taxes** — customs duties were raised and **income tax was introduced** for the first time.\n**2.** **Prices doubled** — between 1913 and 1918, prices roughly doubled, hitting the common people hardest.\n**3.** **Forced recruitment** — villages were compelled to supply soldiers for a war they had nothing to do with, causing deep anger.\n**4.** **Crops failed** (1918–19 and 1920–21), leading to acute **food shortages**.\n**5.** An **influenza epidemic** struck — and according to the 1921 census, **12 to 13 million people** died of famine and disease.\n\nPeople hoped that when the war ended, their hardship would end too. **It didn\'t.**',
        highlight: '**WWI\'s impact on India (very frequently asked):** higher taxes + war loans • prices doubled • forced recruitment • crop failures & food shortages • influenza epidemic (12–13 million dead).',
        inlineQuiz: {
          question: 'Roughly how many people in India died due to famine and the influenza epidemic linked to the war years?',
          options: ['1–2 million', '12–13 million', '5 million', '20 million'],
          correctIndex: 1,
          explanation: 'According to the 1921 census, 12 to 13 million people perished as a result of famines and the influenza epidemic during 1918–1921.',
        },
      },
      {
        id: 'ch2-s1-wwi-vocab',
        type: 'vocabulary',
        text: 'Forced Recruitment — A process by which the colonial state **forced people to join the army against their will**. During the First World War, the British compelled villages in many parts of India to supply young men as soldiers. It was **coercion, not voluntary service** — and the resentment it caused ran deep across the countryside.',
      },
    ],
  },
  {
    id: 'ch2-s1-satyagraha',
    title: 'The Idea of Satyagraha',
    narrativeCards: [
      {
        id: 'ch2-s1-gandhi-returns',
        title: 'Gandhi Returns — January 1915',
        type: 'text',
        text: '**January 1915.** A 45-year-old lawyer returns to India after **21 years in South Africa**. There, he had fought against racist laws using a method he called **satyagraha** — and won. He is already famous. The Indian National Congress welcomes him. But Gandhi doesn\'t rush into politics. He spends his first years **travelling India**, understanding the lives of ordinary people — peasants, workers, the poor.',
      },
      {
        id: 'ch2-s1-satyagraha-define',
        type: 'vocabulary',
        text: 'Satyagraha — **Satya** (truth) + **Agraha** (insistence) = **insistence on / holding firmly to the truth**. It was the novel method of mass agitation that Gandhi had developed in South Africa and now brought to India.',
      },
      // NEW — NCERT-aligned, broken-down explanation of the IDEA (Neha: simplify, align to NCERT)
      {
        id: 'ch2-s1-satyagraha-idea',
        title: 'The Idea of Satyagraha — In Simple Steps',
        type: 'flowchart',
        text: 'NCERT explains satyagraha as a chain of simple ideas. Tap each one to understand it:',
        steps: [
          { label: 'The power of truth', detail: 'Satyagraha emphasised the **power of truth** and the **need to search for truth**. Gandhi believed truth itself was a force more powerful than any weapon.' },
          { label: 'If the cause is true, no violence is needed', detail: 'If the cause was **true** and the struggle was **against injustice**, then **physical force was not necessary** to fight the oppressor. A just cause does not need a sword.' },
          { label: 'Win without vengeance — through non-violence', detail: 'Without seeking **vengeance** or being **aggressive**, a satyagrahi could **win the battle through non-violence**. The satyagrahi is patient and self-suffering, never hateful.' },
          { label: 'Appeal to the oppressor\'s conscience', detail: 'This was done by **appealing to the conscience of the oppressor**. People — including the oppressors — had to be **persuaded to see the truth**, not forced to accept it through violence.' },
          { label: 'Truth must ultimately triumph', detail: 'By this struggle, **truth was bound to ultimately triumph**. Gandhi believed this *dharma* of non-violence could **unite all Indians** in a single struggle.' },
        ],
        highlight: '**Satyagraha (NCERT):** power of truth → a true cause needs no physical force → win through non-violence without vengeance → appeal to the oppressor\'s conscience → truth must finally win. It is "the weapon of the strong, not the weak."',
      },
      {
        id: 'ch2-s1-source-a',
        type: 'source',
        text: 'Gandhi on Satyagraha: "It is said of \'passive resistance\' that it is the weapon of the weak, but the power which is the subject of this article can be used only by the strong. This power is not passive resistance; indeed it calls for intense activity... Satyagraha is pure soul-force. Truth is the very substance of the soul... Non-violence is the supreme dharma."',
      },
      {
        id: 'ch2-s1-satyagraha-why',
        title: 'Why Non-Violence? Was Gandhi Just Being Idealistic?',
        type: 'text',
        text: 'Here\'s the practical reality Gandhi understood: **India could never defeat Britain in a military war.** The British had the most powerful army in the world. India\'s hundreds of millions could never match that firepower.\n\nBut there was something India had that Britain didn\'t: **numbers**. If 300 million people simply **refused to cooperate** — refused to work in British offices, refused to buy British goods, refused to obey British laws — the entire system would **collapse**. You don\'t need guns when you have 300 million people saying "No."\n\nNon-violence wasn\'t just moral. It was **strategic**.',
        highlight: '**WHY non-violence:** (1) India couldn\'t match British military power (2) But 300 million people refusing to cooperate = the empire collapses (3) Non-violence was BOTH a moral principle AND a practical strategy.',
      },
    ],
  },
  {
    id: 'ch2-s1-early-satyagrahas',
    title: 'Gandhi Proves the Method — Three Satyagrahas',
    narrativeCards: [
      {
        id: 'ch2-s1-champaran',
        title: 'Champaran, 1917 — The First Test',
        type: 'text',
        text: '**Bihar, 1917.** Indigo farmers in Champaran were forced to grow indigo on their land — a crop that **destroyed soil fertility** and was sold at prices fixed by European planters. Gandhi travelled there, listened to the farmers, and organised his **first satyagraha in India**.\n\nHe was **arrested**. But the movement didn\'t die — it grew. Public pressure forced the British to appoint an inquiry. The result: **tax relief for farmers** and the right to grow crops of their own choice.',
        highlight: '**Champaran (1917):** Gandhi\'s first Indian satyagraha. Against indigo planters. Gandhi arrested → movement grew → farmers won tax relief.',
      },
      {
        id: 'ch2-s1-ahmedabad-kheda',
        title: 'Ahmedabad & Kheda, 1918 — The Method Works',
        type: 'text',
        text: '**Ahmedabad, 1918:** Cotton mill workers demanded fair wages. Gandhi supported them with a satyagraha. **Workers won.**\n\n**Kheda, Gujarat, 1918:** Crops failed. Peasants couldn\'t pay revenue. Gandhi organised them to demand tax relief. **The British agreed.**\n\nThree satyagrahas in two years. All three won. Gandhi had proved the method worked.',
        highlight: '**Three satyagrahas, three wins:** Champaran (1917), Ahmedabad (1918), Kheda (1918). All about economic exploitation. All won through non-violent pressure.',
      },
      // FLOWCHART — the three early satyagrahas (Neha requested, important for boards)
      {
        id: 'ch2-s1-three-satyagrahas',
        title: 'Gandhi\'s Three Early Satyagrahas (1916–1918)',
        type: 'flowchart',
        text: 'Three local satyagrahas in which Gandhi tested and proved his method. Tap each:',
        steps: [
          { label: 'Champaran, 1917 — Indigo farmers (Bihar)', detail: 'Gandhi travelled to **Champaran in Bihar** to inspire the peasants to struggle against the **oppressive plantation system** that forced them to grow indigo. This was his **first satyagraha in India** — and it won the farmers relief.' },
          { label: 'Kheda, 1917–18 — Peasants (Gujarat)', detail: 'In the **Kheda district of Gujarat**, **crops failed** and a plague spread, yet the government demanded full **land revenue**. Gandhi organised a satyagraha to support the peasants\' demand for **relaxation of revenue collection**.' },
          { label: 'Ahmedabad, 1918 — Cotton mill workers', detail: 'In **1918, Gandhi went to Ahmedabad** to organise a satyagraha movement among **cotton mill workers**, helping them demand **fair wages**.' },
        ],
        highlight: '**The three satyagrahas (commonly asked):** Champaran 1917 (indigo farmers, Bihar) • Kheda 1917–18 (peasants, Gujarat) • Ahmedabad 1918 (cotton mill workers). All local, all about economic injustice, all successful.',
      },
      {
        id: 'ch2-s1-pattern',
        title: 'But Notice the Pattern...',
        type: 'text',
        text: 'These three victories were impressive. But look carefully — they had the **same limitations** as every revolt before Gandhi:\n\n**1.** All three were about **economic exploitation** — indigo, wages, taxes\n**2.** All three were **regional** — one district at a time\n**3.** All three were **short-lived** — resolved in weeks or months\n\nGandhi had proved satyagraha **works**. But he hadn\'t yet built a **national movement**. For that, he needed something bigger — something that could unite ALL of India. That something was about to arrive.',
        highlight: '**Pattern:** Early satyagrahas were successful BUT still regional + short-lived. Gandhi needed a trigger for a NATIONAL movement.',
        inlineQuiz: {
          question: 'In which place did Gandhi organise his first satyagraha in India?',
          options: ['Ahmedabad', 'Dandi', 'Kheda', 'Champaran'],
          correctIndex: 3,
          explanation: 'Gandhi\'s first satyagraha in India was at Champaran in Bihar (1917), where indigo farmers were being exploited by European planters.',
        },
      },
    ],
  },
  {
    id: 'ch2-s1-tipping-point',
    title: 'The Tipping Point — Rowlatt Act & Jallianwala Bagh',
    narrativeCards: [
      {
        id: 'ch2-s1-rowlatt',
        title: 'The Rowlatt Act — The Spark',
        type: 'text',
        text: 'Gandhi\'s three victories had a deeper effect than just helping farmers and workers. Across India, ordinary people now saw that the British **could be challenged** — and **anti-British feeling was rising fast**. The government grew alarmed at this growing political activity.\n\nSo, in **February 1919**, the British struck back with a harsh new law to **crush political activity** — the **Rowlatt Act**. It gave the government enormous powers:\n\n- **Arrest anyone** suspected of anti-government activity\n- **Detain them without trial** for up to **two years**\n- **No evidence needed** — just suspicion\n\nThe Act was rushed through despite the **unanimous opposition** of the Indian members of the Imperial Legislative Council. Indians realised they had **no real voice** in their own government. Gandhi saw the Act as an insult to every Indian and called for a **nationwide hartal** on **6 April 1919**.',
        highlight: '**Why the Rowlatt Act? (NCERT framing):** Gandhi\'s satyagrahas had stirred rising nationalist feeling → the alarmed government passed the Rowlatt Act to crush political activity → arrest without evidence, detention without trial for 2 years → Gandhi called a nationwide hartal (6 April 1919).',
        inlineQuiz: {
          question: 'Why were Indians outraged by the Rowlatt Act?',
          options: [
            'It increased taxes on Indian goods',
            'It banned the Indian National Congress',
            'It allowed detention without trial and was passed despite Indian opposition',
            'It forced Indians to fight in World War I',
          ],
          correctIndex: 2,
          explanation: 'The Rowlatt Act gave the government power to detain political prisoners without trial for two years. It was passed despite unanimous opposition from Indian members of the Legislative Council — showing Indians had no real voice.',
        },
      },
      {
        id: 'ch2-s1-hartal',
        title: '6 April 1919 — India Stops',
        type: 'figure',
        text: 'On **6 April**, the hartal began. Rallies were organised across the country. Workers went on strike in railway workshops. Shops closed down. The British were alarmed — they had never seen protest on this scale. Scared that communications would be disrupted, they decided to **clamp down**. Local leaders were arrested in Amritsar. Gandhi was barred from entering Delhi. On **10 April**, police in Amritsar fired on a peaceful procession.',
        imageId: 'ch2-fig-1',
      },
      // Vocabulary — Martial Law (Neha: not explained; it followed the Rowlatt Act and led to the massacre)
      {
        id: 'ch2-s1-martial-law',
        type: 'vocabulary',
        text: 'Martial Law — **Rule by the army instead of the normal government.** Ordinary laws and courts are suspended, and a military commander takes charge with the power to ban gatherings, arrest people and use force. As the Rowlatt protests spread in Amritsar, the British **imposed martial law** there as an extension of their crackdown, and handed command to **General Dyer**. It was under this martial law that the Jallianwala Bagh massacre took place.',
      },
      {
        id: 'ch2-s1-jallianwala-buildup',
        title: '13 April 1919 — The Day That Changed India',
        type: 'figure',
        text: 'With **martial law in force and General Dyer in command**, the city of Amritsar was tense. Then, on **13 April 1919**, a large crowd gathered in the enclosed ground of **Jallianwala Bagh** (shown here in a photograph taken in 1919, months after the massacre).\n\nSome had come to protest the Rowlatt Act. But many were **villagers from outside the city** who had come for the annual **Baisakhi fair**. Crucially, **they did not even know that martial law had been imposed** — so they had no idea they were breaking any order by gathering.\n\nAs you can see, the ground was surrounded by **high walls and houses on all sides**, with only a few **narrow exits**.',
        imageId: 'ch2-fig-15',
      },
      {
        id: 'ch2-s1-jallianwala',
        title: 'Jallianwala Bagh',
        type: 'figure',
        text: '**General Dyer** (pictured here) entered the ground with his troops. He didn\'t warn the crowd. He didn\'t ask them to leave. He **blocked the exits**.\n\nThen he **ordered his troops to open fire**.\n\nFor **ten minutes**, they fired on an unarmed crowd — men, women, children, elderly people who had only come for a fair.\n\n**Hundreds were killed.** Many jumped into a well inside the compound trying to escape the bullets.\n\nWhen asked later why he did it, Dyer said his object was **"to produce a moral effect"** — to create a feeling of **terror and awe** in the minds of satyagrahis.',
        imageId: 'ch2-fig-16',
        highlight: '**Jallianwala Bagh (13 April 1919):** General Dyer blocked exits and ordered firing on unarmed crowd for 10 minutes. Hundreds killed. His goal: "to produce a moral effect." This became the tipping point of Indian nationalism.',
      },
      {
        id: 'ch2-s1-jallianwala-figure',
        type: 'figure',
        text: 'The aftermath was horrifying. As news of the massacre spread, crowds took to the streets in many North Indian towns. There were strikes, clashes with police, and attacks on government buildings. The government responded with **brutal repression**: satyagrahis were forced to rub their noses on the ground, crawl on the streets, and do *salaam* to British officers. Villages around Gujranwala were bombed from the air.',
        imageId: 'ch2-fig-3',
      },
      {
        id: 'ch2-s1-jallianwala-aftermath',
        title: 'After the Massacre',
        type: 'text',
        text: 'Seeing the violence spread, Gandhi called off the Rowlatt satyagraha. He realised something crucial: the movement had been limited mostly to **cities and towns**. If he wanted to truly challenge the British, he needed a movement that went **deeper** — into the villages, into the countryside, across religious lines.\n\nHe needed to unite **Hindus and Muslims**. And he found a way to do it — through an issue that had nothing to do with India.',
      },
    ],
  },
  {
    id: 'ch2-s1-khilafat',
    title: 'The Khilafat Connection — Uniting Hindus and Muslims',
    narrativeCards: [
      {
        id: 'ch2-s1-khilafat-issue',
        title: 'An Unexpected Bridge',
        type: 'text',
        text: 'Here\'s how it happened: the First World War ended with the **defeat of the Ottoman Empire** (Turkey). There were rumours that a harsh peace treaty would be imposed, stripping the **Ottoman emperor** — known as the **Khalifa** — of his powers.\n\nThe Khalifa wasn\'t just a political leader. He was the **spiritual head of the Islamic world**. Muslims across the globe were outraged. In India, a **Khilafat Committee** was formed in Bombay in **March 1919**. Young Muslim leaders — brothers **Muhammad Ali and Shaukat Ali** — began discussing possible action.',
        highlight: '**Khilafat issue:** Ottoman Empire defeated in WWI → Khalifa (spiritual head of Islam) threatened → Muslims worldwide outraged → Khilafat Committee formed in Bombay (March 1919).',
      },
      {
        id: 'ch2-s1-khilafat-gandhi',
        title: 'Gandhi\'s Strategic Calculation',
        type: 'text',
        text: 'Gandhi saw an **opportunity**. He wanted to launch a broad national movement, but India was deeply divided between Hindus and Muslims. The Khilafat issue gave him a bridge.\n\nHis calculation: **if Congress supports the Khilafat cause, Muslims will support Congress**. For the first time in Indian history, **Hindus and Muslims would fight together** against the British.\n\nAt the **Calcutta Congress session** (September 1920), Gandhi convinced other leaders to launch a **Non-Cooperation movement** in support of **both Khilafat and Swaraj**.',
        highlight: '**Gandhi\'s strategy:** Support Khilafat → win Muslim support → unite Hindus and Muslims → launch a truly NATIONAL movement. This was the first Hindu-Muslim alliance in the freedom struggle.',
        inlineQuiz: {
          question: 'Why did Gandhi support the Khilafat Movement?',
          options: [
            'Because he was personally devoted to the Ottoman Khalifa',
            'Because he saw it as an opportunity to unite Hindus and Muslims in a national movement',
            'Because the British asked him to support it',
            'Because the Khilafat Committee promised to fund the Congress',
          ],
          correctIndex: 1,
          explanation: 'Gandhi supported the Khilafat cause because he saw it as an opportunity to bring Hindus and Muslims together under one movement. By linking Khilafat with Swaraj, he created the first Hindu-Muslim alliance in the freedom struggle.',
        },
      },
    ],
  },
  {
    id: 'ch2-s1-noncooperation',
    title: 'Non-Cooperation Launched',
    narrativeCards: [
      {
        id: 'ch2-s1-hind-swaraj',
        title: 'Gandhi\'s Promise — The Theory',
        type: 'text',
        text: 'In his famous book **Hind Swaraj** (1909), Gandhi had made a bold claim: **British rule in India survived only because Indians cooperated with it.** Indian clerks ran their offices. Indian soldiers fought their wars. Indian consumers bought their goods.\n\nIf Indians simply **refused to cooperate** — refused to work in British offices, fight in British wars, buy British goods — the entire system would **collapse within a year**, and **swaraj would come**.\n\nThat was the theory. Now it would be tested.',
        highlight: '**Gandhi\'s promise (Hind Swaraj, 1909):** British rule survives through Indian cooperation. If Indians refuse to cooperate → the empire collapses within a year → swaraj comes. This promise would be tested — and would fail.',
      },
      {
        id: 'ch2-s1-swaraj-vocab',
        type: 'vocabulary',
        text: 'Swaraj — **Swa** (self) + **Raj** (rule) = **self-rule**. This is the most important word in the chapter. But here\'s the thing CBSE always asks about: **swaraj meant different things to different people**. For the middle class, it meant constitutions and parliaments. For peasants, it meant land and no rent. For plantation workers, it meant freedom to move. The word united people — but the meaning divided them.',
      },
      {
        id: 'ch2-s1-programme',
        title: 'The Non-Cooperation Programme',
        type: 'text',
        text: 'Gandhi proposed that the movement should unfold in **stages**:\n\n**Stage 1:** Surrender government-awarded **titles**\n**Stage 2:** **Boycott** civil services, army, police, courts, legislative councils, schools\n**Stage 3:** **Boycott** foreign goods — wear khadi instead\n**Stage 4:** If the government uses repression → launch full **civil disobedience**\n\nThrough the summer of 1920, **Gandhi and Shaukat Ali** toured India extensively, building support. The response was electric.',
        highlight: '**Non-Cooperation programme (stages):** Surrender titles → Boycott institutions (courts, schools, councils) → Boycott foreign goods → If repressed, launch civil disobedience.',
      },
      {
        id: 'ch2-s1-nagpur',
        title: 'December 1920 — The Movement Begins',
        type: 'text',
        text: 'At the **Nagpur Congress session** in December 1920, after intense debate, the Congress formally adopted the Non-Cooperation programme. The movement would begin in **January 1921**.\n\nGandhi made his promise: **refuse to cooperate, and the British would leave within a year.**\n\nThe whole nation believed him. Hindus and Muslims were united. Peasants and workers and students and lawyers — all were ready.\n\nBut what happened next would show that **unity is much harder to build than anger**.',
        highlight: '**Nagpur Congress (December 1920):** Non-Cooperation programme formally adopted. Gandhi promises swaraj within one year. The movement launches January 1921.',
      },
      // CLOSER — What Comes Next
      {
        id: 'ch2-s1-closer',
        title: 'What Comes Next...',
        type: 'text',
        text: 'Gandhi made a promise: refuse to cooperate, and the British would leave within a year. The whole nation believed him. Hindus and Muslims marched together for the first time.\n\nBut here\'s what nobody expected: **everyone joined for different reasons**. The middle class wanted constitutions. Peasants wanted land. Tribals wanted forests. Workers wanted wages. And each group interpreted Gandhi\'s message in their own way — sometimes going far beyond what he intended.\n\nIn the next section, we\'ll see how this movement — which was supposed to be ONE struggle — turned into **five different struggles** wearing the same name.',
        highlight: '**The story so far:** WWI + Jallianwala Bagh + Khilafat → Gandhi launches Non-Cooperation (1921). The whole nation is united. But unity is about to fracture — because swaraj means different things to different people.',
      },
      // Timeline reference
      {
        id: 'ch2-s1-timeline',
        title: 'Section 1 Timeline',
        type: 'timeline-ref',
        text: `1915 — **Gandhi returns** to India from South Africa
1917 — **Champaran Satyagraha** — first satyagraha in India (Bihar, indigo farmers)
1918 — **Ahmedabad** (mill workers) and **Kheda** (peasants) satyagrahas — both successful
1919 — **Rowlatt Act** passed — detention without trial; Gandhi calls hartal (6 April)
1919 — **Jallianwala Bagh massacre** (13 April) — General Dyer fires on unarmed crowd
1919 — **Khilafat Committee** formed in Bombay (March)
1920 — **Calcutta Congress** (September) — Gandhi links Khilafat with Non-Cooperation
1920 — **Nagpur Congress** (December) — Non-Cooperation programme formally adopted`,
        highlight: '**Key exam dates:** 1919 (Rowlatt Act + Jallianwala Bagh), 1920 (Nagpur Congress — Non-Cooperation launched). These appear in every CBSE paper.',
      },
      // Impact card — Neha's approach
      {
        id: 'ch2-s1-significance',
        title: 'Why This Section Matters',
        type: 'exam-prep',
        text: `Q: How did the First World War help in the growth of the National Movement in India?
Marks: 3 Marks
A: The war created massive economic hardship — taxes doubled, prices rose, forced recruitment caused anger, crop failures and influenza killed 12-13 million people.
A: People expected relief after the war but instead got the Rowlatt Act (detention without trial), which showed Indians had no real voice in governance.
A: The Jallianwala Bagh massacre (1919) became the tipping point — turning widespread anger into a demand for swaraj.
A: Gandhi linked the Khilafat issue with the independence struggle, creating the first Hindu-Muslim alliance — making the movement truly national.
Tip: This is a frequently asked 3-mark question. Cover: WWI hardship → Rowlatt Act → Jallianwala Bagh → Khilafat unity. Each point = 1 mark.
Tip: For 5-mark version: add Gandhi's early satyagrahas (Champaran, Ahmedabad, Kheda) and the Non-Cooperation programme details.`,
      },
    ],
  },
]
