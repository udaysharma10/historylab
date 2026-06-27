import type { Subsection } from '../../../types/chapter'

export const section2Subsections: Subsection[] = [
  {
    id: 'ch2-s2-towns',
    title: 'The Movement in the Towns',
    narrativeCards: [
      // OPENER — connects from Section 1 closer
      {
        id: 'ch2-s2-opener',
        title: 'One Movement, Five Different Dreams',
        type: 'text',
        text: 'At the end of Section 1, we said Gandhi made a promise: refuse to cooperate, and swaraj would come within a year. The whole nation believed him. Hindus and Muslims marched together for the first time.\n\nBut here\'s what the textbook wants you to understand: **everyone joined for DIFFERENT reasons**. The middle class wanted constitutions and parliaments. Peasants wanted land and no rent. Tribals wanted forests. Workers wanted the freedom to go home. And each group interpreted Gandhi\'s message in their own way — sometimes going far beyond what he intended.\n\nThis section is the **most tested section in CBSE board exams**. The 5-mark question "Why did different social groups join the Non-Cooperation Movement?" appears almost every year. You must know each group separately.',
        highlight: '**The core tension:** Everyone wanted swaraj. But swaraj meant different things to different people. This section breaks down WHAT each group did, WHY they joined, and what went wrong.',
      },
      // Middle class action
      {
        id: 'ch2-s2-towns-action',
        title: 'January 1921 — The Cities Erupt',
        type: 'text',
        text: 'The Non-Cooperation-Khilafat Movement began in **January 1921**. In the cities and towns, the response was electric:\n\n**Students** — Thousands left government-controlled schools and colleges\n**Teachers** — Many resigned from government positions\n**Lawyers** — Gave up their lucrative legal practices (including leaders like Motilal Nehru and C.R. Das)\n**Council elections** — Boycotted in most provinces\n**Foreign goods** — Boycotted and burnt in public bonfires\n\nThe economic impact was real: **import of foreign cloth halved** — from **Rs 102 crore to Rs 57 crore** between 1921 and 1922.',
        highlight: '**Impact in towns:** Students left schools, lawyers quit courts, councils boycotted, foreign cloth imports halved (Rs 102 crore → Rs 57 crore). The boycott was hitting the British where it hurt — their wallets.',
      },
      // Boycott vocabulary card
      {
        id: 'ch2-s2-boycott-vocab',
        type: 'vocabulary',
        text: 'Boycott — The refusal to deal with, participate in, or buy something as a form of protest. The word comes from **Captain Charles Boycott**, an Irish land agent who was completely ostracised by his community in **1880** when he tried to evict tenants. In India, boycott meant refusing to buy British goods, attend British schools, or serve in British courts. It was the **main weapon** of Non-Cooperation.',
      },
      // WHY it slowed
      {
        id: 'ch2-s2-towns-slowed',
        title: 'Why Did It Slow Down?',
        type: 'text',
        text: 'But the movement in the towns gradually **lost steam**. WHY? Three reasons:\n\n**1. Khadi was expensive.** Indian cloth made on handlooms cost more than mass-produced British mill cloth. Poor people simply couldn\'t afford it. Burning foreign cloth felt noble — but you still needed something to wear.\n\n**2. Alternative institutions were slow to set up.** Students who left British schools had nowhere to go. Indian national schools and colleges came up — but they were too few, too slow. Without replacements, the boycott couldn\'t sustain.\n\n**3. People drifted back.** Teachers, lawyers, and students who had sacrificed their careers began returning — because there were no Indian alternatives ready.\n\nThe lesson: **you can\'t just tear down a system — you need to build a replacement**. The towns showed that boycott alone isn\'t enough.',
        highlight: '**WHY it slowed in towns:** (1) Khadi was expensive — poor couldn\'t afford it (2) Indian schools/courts were slow to set up — no alternatives (3) Students and lawyers drifted back. Boycott without replacement = unsustainable.',
        inlineQuiz: {
          question: 'Why did the Non-Cooperation Movement slow down in the cities?',
          options: [
            'The British arrested all the leaders immediately',
            'Khadi was expensive, alternative institutions were slow, and people drifted back',
            'Muslims refused to participate in the towns',
            'Gandhi asked people to stop the boycott in cities',
          ],
          correctIndex: 1,
          explanation: 'The urban movement slowed because khadi was more expensive than British cloth, Indian schools and courts were slow to replace British ones, and without alternatives, students and lawyers gradually returned to British institutions.',
        },
      },
    ],
  },
  {
    id: 'ch2-s2-countryside',
    title: 'Rebellion in the Countryside',
    narrativeCards: [
      // Transition
      {
        id: 'ch2-s2-countryside-intro',
        title: 'From Cities to Villages — A Different Fight',
        type: 'text',
        text: 'From the cities, the movement spread to the countryside. But here\'s the crucial thing: **peasants and tribals didn\'t join because of constitutions or councils**. They had never been inside a court or a college. They joined because of **land, rent, and survival**.\n\nAnd this is where the movement gets complicated — because the countryside had its own grievances, its own leaders, and its own methods. Not all of them matched what Gandhi had in mind.',
      },
      // Awadh peasants — stakeholder card
      {
        id: 'ch2-s2-awadh',
        title: 'Awadh Peasants — What Swaraj Meant to Them',
        type: 'text',
        text: '**Awadh (present-day Uttar Pradesh)** was one of the most oppressed regions in India. Peasants here suffered under **talukdars** (large landowners) and landlords:\n\n**Exorbitant rents** — sometimes 50% or more of the harvest\n**Begar** — forced unpaid labour on landlords\' lands\n**No security of tenure** — a peasant could be thrown off land at any time\n\nTheir leader was an extraordinary man: **Baba Ramchandra** — a sanyasi who had earlier been to **Fiji as an indentured labourer**. He knew exploitation firsthand. He began organising peasants, moving from village to village, talking about overthrowing the oppressive system.\n\nFor these peasants, **swaraj didn\'t mean parliaments or constitutions**. It meant: **no more rent. No more begar. No more landlords.**',
        highlight: '**Awadh peasants:** Led by Baba Ramchandra (a sanyasi, former indentured labourer in Fiji). Grievances: exorbitant rents + begar + no security of tenure. Their swaraj = no more landlords.',
      },
      // Begar vocabulary
      {
        id: 'ch2-s2-begar-vocab',
        type: 'vocabulary',
        text: 'Begar — Labour that villagers were **forced to contribute without any payment**. Landlords would compel peasants to work on their fields, build roads, or carry goods — for free. It was a form of **bonded exploitation**. The demand to abolish begar was one of the strongest grievances of the Awadh peasant movement.',
      },
      // Oudh Kisan Sabha
      {
        id: 'ch2-s2-oudh-kisan-sabha',
        title: 'The Peasant Movement Organises',
        type: 'text',
        text: 'In **June 1920**, **Jawaharlal Nehru** visited the villages of Awadh. What he saw shocked him — the depth of poverty, the cruelty of landlords, the desperation of peasants.\n\nBy **October 1920**, the **Oudh Kisan Sabha** was set up — by Nehru, Baba Ramchandra, and a few others. Within a month, it had over **300 branches**. The peasant movement was organised and ready — even BEFORE Non-Cooperation formally began in January 1921.\n\nBut when Non-Cooperation started, something dangerous happened...',
      },
      // Peasants exceed limits
      {
        id: 'ch2-s2-peasants-exceed',
        title: 'When the Movement Went Beyond Gandhi',
        type: 'text',
        text: 'When the movement began, the peasants went **far beyond** what Congress or Gandhi had intended:\n\n**Houses of talukdars and merchants were attacked**\n**Bazaars were looted**\n**Grain hoards were taken over**\n\nLocal leaders told peasants that **Gandhi had declared**: no more taxes, land will be redistributed to the poor. The name of the **Mahatma** was being used to justify actions **Gandhi never authorised**.\n\nThis is a pattern you\'ll see again and again: Gandhi says one thing, but by the time his message reaches a village 500 miles away, it has been **reinterpreted** to match local grievances. The peasants weren\'t disobeying Gandhi — they genuinely believed this was what he wanted.',
        highlight: '**The fracture:** Peasants used Gandhi\'s name to justify looting, attacking landlords, and seizing grain — things Gandhi never authorised. His message was reinterpreted to match local grievances.',
      },
      // Source B — Nehru on peasants
      {
        id: 'ch2-s2-source-b',
        type: 'source',
        text: '**Source B — Jawaharlal Nehru on the peasant uprising at Rae Bareli:**\n\n"They behaved as brave men, calm and unruffled in the face of danger... Many received lathi blows, which drew blood. Many were seriously hurt, but no one ran away... For a moment my blood was up, non-violence was almost forgotten — but for a moment only."\n\n**What this source tells us:** Even Nehru — one of Gandhi\'s closest allies — admits that watching police brutality against unarmed peasants almost made HIM forget non-violence. If a committed Gandhian nearly lost control, imagine what ordinary peasants felt. This source is CBSE gold — it shows the tension between non-violence as a principle and human anger as a reality.',
      },
      // Gudem Hills tribals — stakeholder card
      {
        id: 'ch2-s2-gudem',
        title: 'Gudem Hills Tribals — A Different Kind of Swaraj',
        type: 'text',
        text: '**Gudem Hills, Andhra Pradesh.** The colonial government had done two things that destroyed tribal life:\n\n**1. Closed the forests** — no grazing, no firewood, no collecting forest produce. For tribals, the forest wasn\'t just land — it was **livelihood, culture, home**.\n**2. Demanded begar** — forced tribals to build roads through their own hills for free.\n\nTheir leader was **Alluri Sitaram Raju** — a charismatic figure who claimed he had **special powers**: the ability to make correct astrological predictions, the ability to heal people, and — his followers believed — he could **survive bullets**.\n\nThe hill people proclaimed him an **incarnation of God**.',
        highlight: '**Gudem Hills tribals:** Colonial government closed forests + demanded begar. Leader: Alluri Sitaram Raju (claimed special powers, followers believed he could survive bullets). Tribal swaraj = forest rights.',
      },
      // Raju's contradiction
      {
        id: 'ch2-s2-raju-paradox',
        title: 'Raju\'s Paradox — Gandhi\'s Name, Not Gandhi\'s Method',
        type: 'text',
        text: 'Here\'s what makes Alluri Sitaram Raju fascinating — and what CBSE loves to test:\n\nHe **wore khadi**. He **invoked Gandhi\'s name**. He said he supported **Non-Cooperation**.\n\nBut he used **guerrilla warfare**. He **attacked police stations**. He **seized weapons**. He **killed British officials**.\n\nRaju believed that India could only be freed through **force**, not non-violence. He was Gandhi\'s follower in spirit but his **opposite** in method.\n\nHe was **captured and executed in 1924**. He became a **folk hero**.\n\nThis is the contradiction at the heart of the movement: people across India adopted Gandhi\'s NAME and CAUSE — but not always his METHOD.',
        highlight: '**Raju\'s paradox:** Wore khadi + invoked Gandhi + supported Non-Cooperation — BUT used guerrilla warfare and violence. Captured and executed 1924. Shows how Gandhi\'s message was reinterpreted across India.',
        inlineQuiz: {
          question: 'What was contradictory about Alluri Sitaram Raju\'s role in the movement?',
          options: [
            'He supported the British but claimed to be a nationalist',
            'He invoked Gandhi and wore khadi but used violent guerrilla methods',
            'He was a tribal leader who opposed forest rights',
            'He supported Non-Cooperation but refused to boycott foreign goods',
          ],
          correctIndex: 1,
          explanation: 'Raju claimed to be inspired by Gandhi, wore khadi, and supported Non-Cooperation — but he used violent guerrilla methods, attacking police stations and killing British officials. This shows how the movement was reinterpreted differently across India.',
        },
      },
      // Picket vocabulary
      {
        id: 'ch2-s2-picket-vocab',
        type: 'vocabulary',
        text: 'Picket — A form of demonstration or protest in which people **stand or march outside a shop, factory, or office** to discourage others from entering. During the Non-Cooperation Movement, volunteers picketed shops selling foreign cloth and liquor — standing at the entrance and persuading (sometimes pressuring) customers not to go in. Picketing was a key tactic of the boycott.',
      },
    ],
  },
  {
    id: 'ch2-s2-plantations',
    title: 'Swaraj in the Plantations',
    narrativeCards: [
      // Workers' story — stakeholder card
      {
        id: 'ch2-s2-plantation-intro',
        title: 'Assam Plantation Workers — The Simplest Dream',
        type: 'text',
        text: 'Of all the groups who joined the movement, **plantation workers in Assam** had the simplest definition of swaraj.\n\nFor them, freedom meant one thing: **the right to move**.\n\nUnder the **Inland Emigration Act of 1859**, plantation workers were **not allowed to leave the tea gardens** without permission. Read that again. They couldn\'t leave. They were not slaves in name — but they were **trapped** in practice. They couldn\'t visit their villages, couldn\'t seek better work, couldn\'t go home.\n\nFor 62 years, this law had kept them prisoner. Then they heard about Gandhi and Non-Cooperation.',
        highlight: '**Assam plantation workers:** Trapped by the Inland Emigration Act of 1859 — couldn\'t leave tea gardens without permission. Their swaraj = the simple freedom to go home.',
      },
      // What they did
      {
        id: 'ch2-s2-plantation-action',
        title: 'What They Did — And What Happened',
        type: 'text',
        text: 'When news of Non-Cooperation reached the plantations, **thousands of workers defied the authorities**. They left the tea gardens and headed home. They believed **"Gandhi Raj"** was coming — a time when everyone would have land, when all suffering would end, when they would be free.\n\nBut they **never reached their destinations**.\n\nStranded on the way by a **railway and steamer strike** (part of the very movement they were joining), they were **caught by the police and brutally beaten**.\n\nTheir vision of swaraj was the simplest of all — just the **freedom to go home**. And even that was denied.',
        highlight: '**What happened:** Workers left plantations believing "Gandhi Raj" was coming. Stranded by railway strike. Caught by police. Beaten. Their swaraj — just the freedom to go home — was denied.',
      },
      // Pattern recognition card
      {
        id: 'ch2-s2-pattern',
        title: 'Recap — Who Joined, and Why',
        type: 'table',
        text: 'Step back and see the whole movement at a glance. Each social group joined the Non-Cooperation Movement for its **own reasons** and gave swaraj its **own meaning**:',
        table: {
          headers: ['Group', 'What they did', 'What swaraj meant', 'What went wrong'],
          rows: [
            ['**Middle class (towns)**', 'Boycotted schools, courts and foreign goods', 'Constitutions and parliaments', 'Khadi was costly; no Indian alternatives ready'],
            ['**Awadh peasants**', 'Attacked landlords, seized grain', 'No rent, no begar, land', 'Went beyond Gandhi\'s non-violent programme'],
            ['**Gudem tribals**', 'Guerrilla warfare against the British', 'Forest rights, end of begar', 'Used violence, not non-violence'],
            ['**Assam plantation workers**', 'Left the tea gardens, headed home', 'Freedom to move', 'Stranded by a strike, beaten by police'],
          ],
        },
        highlight: '**The pattern:** Every group joined for its own reasons and read Gandhi in its own way. The movement was ONE struggle in name — but several different struggles in practice. (Frequently asked 5-marker: "Why did different social groups join the Non-Cooperation Movement?")',
        inlineQuiz: {
          question: 'What did "swaraj" mean to plantation workers in Assam?',
          options: [
            'The right to vote in elections',
            'Higher wages and better working conditions',
            'The freedom to leave the plantations and go home',
            'The right to own tea gardens',
          ],
          correctIndex: 2,
          explanation: 'For Assam plantation workers, swaraj meant the most basic freedom — the right to move freely and go home. They were trapped under the Inland Emigration Act of 1859, which prevented them from leaving tea gardens without permission.',
        },
      },
    ],
  },
  {
    id: 'ch2-s2-chauri-chaura',
    title: 'Chauri Chaura — The Movement Dies',
    narrativeCards: [
      // Emotional escalation — pattern card
      {
        id: 'ch2-s2-escalation',
        title: 'A Movement Growing Out of Control',
        type: 'text',
        text: 'Look at what has happened across India by early 1922:\n\n**In the towns** — people exceeded the boycott, burning cloth and picketing aggressively\n**In Awadh** — peasants attacked landlords and looted grain in Gandhi\'s name\n**In Gudem Hills** — tribals launched guerrilla warfare\n**In Assam** — workers abandoned plantations en masse\n\nThe movement was **growing** — but it was growing **out of control**. Violence was creeping in from every direction. Each group was pushing further than Congress intended. Gandhi\'s non-violent national movement was fracturing into a dozen local revolts, each with its own logic, its own anger.\n\nAnd then came **Chauri Chaura**.',
      },
      // The incident
      {
        id: 'ch2-s2-chauri-chaura-event',
        title: '4 February 1922 — The Day That Ended Everything',
        type: 'text',
        text: '**4 February 1922. Chauri Chaura, a small town in Gorakhpur district, Uttar Pradesh.**\n\nA peaceful demonstration was marching through the town. Some accounts say the police provoked the crowd. Whatever the trigger, the situation escalated rapidly.\n\nThe crowd turned on the police. They set fire to the **police station**.\n\n**22 policemen were killed.**\n\nIn one afternoon, in one small town, the entire moral foundation of Gandhi\'s movement was shattered.',
        highlight: '**Chauri Chaura (4 Feb 1922):** Peaceful demonstration turns violent. Crowd sets fire to police station. 22 policemen killed. This single incident ends the entire Non-Cooperation Movement.',
      },
      // Gandhi's decision
      {
        id: 'ch2-s2-gandhi-decision',
        title: 'Gandhi\'s Devastating Decision',
        type: 'text',
        text: 'When Gandhi heard the news, he was **devastated**. He didn\'t hesitate. He called off the **ENTIRE Non-Cooperation Movement**.\n\nThe whole country was **stunned**. Other Congress leaders were **furious**:\n\n"The movement is at its **peak**!"\n"The British are **rattled** for the first time!"\n"We\'re **winning** — and you\'re pulling the plug?"\n\nJawaharlal Nehru later wrote that he felt **anguish and bewilderment** — how could one incident in one town justify ending a movement that had mobilised millions?\n\nBut Gandhi was firm. Absolutely, completely firm.',
      },
      // WHY card — the moral principle
      {
        id: 'ch2-s2-why-called-off',
        title: 'WHY Did Gandhi Call Off the Movement?',
        type: 'text',
        text: 'This is the **most important WHY** in the chapter — and CBSE tests it repeatedly.\n\nGandhi\'s reasoning was simple and unshakeable:\n\n**"A movement that kills is no different from the empire it fights."**\n\nFor Gandhi, non-violence was **not a tactic**. It was not a strategy you use when it\'s convenient and drop when it\'s not. Non-violence was the **soul** of the struggle. If the movement became violent, it would **corrupt** the people fighting it — and the freedom they won would be built on blood, not truth.\n\nHe believed that **the means shape the ends**. If you win through violence, you create a violent nation. If you win through truth, you create a truthful one.\n\n**One incident. 22 deaths. The entire movement — cancelled.**\n\nThat\'s how seriously Gandhi took non-violence.',
        highlight: '**WHY Gandhi called off the movement:** Non-violence was not a tactic — it was the SOUL of the struggle. A movement that kills is no different from the empire it fights. The means shape the ends. This is the most tested explanation in CBSE exams on this chapter.',
      },
      // CLOSER — measuring against Gandhi's promise
      {
        id: 'ch2-s2-closer',
        title: 'The Promise vs. The Reality',
        type: 'text',
        text: 'Remember Gandhi\'s promise from *Hind Swaraj*? **"Refuse to cooperate, and the British will leave within a year."**\n\nLet\'s measure reality against that promise:\n\n**The promise:** Swaraj in one year.\n**The reality:** In February 1922, **Gandhi himself** called off the movement — because his own people couldn\'t stay non-violent.\n\nThe British were still here. The movement was in pieces. The unity between Hindus and Muslims — so carefully built — would begin to crack. Gandhi was arrested in March 1922 and sentenced to **six years in prison**.\n\nBut was it all for nothing? The answer is no — and the significance card tells you why.',
        highlight: '**Promise vs. Reality:** Gandhi promised swaraj in one year. Instead, HE ended the movement in February 1922 because Indians couldn\'t stay non-violent. The British stayed. Gandhi went to prison. But the movement wasn\'t wasted.',
      },
      // Impact/significance card
      {
        id: 'ch2-s2-significance',
        title: 'The Significance of Non-Cooperation (Despite Its Failure)',
        type: 'exam-prep',
        text: `Q: What was the significance of the Non-Cooperation Movement even though it was withdrawn?
Marks: 5 Marks
A: It was the **first truly national movement** — not limited to one region or one city, but spread across all of India, from cities to villages to plantations.
A: The British economy was directly hit — **foreign cloth imports halved** from Rs 102 crore to Rs 57 crore.
A: The **working class was awakened** — peasants, tribals, and plantation workers participated in a national movement for the first time in Indian history.
A: **Hindu-Muslim unity** was achieved, even if briefly — the Khilafat-Non-Cooperation alliance was unprecedented.
A: It **inspired the next generation** — leaders like Bhagat Singh, Subhas Chandra Bose, and Jawaharlal Nehru would build on the political consciousness it created. The movement died. But the idea of swaraj survived.
Tip: For 3-mark version: pick any 3 points. For 5-mark: cover all 5. Each point = 1 mark. Always end with "The movement failed but its legacy endured."`,
      },
      // Timeline reference
      {
        id: 'ch2-s2-timeline',
        title: 'Section 2 Timeline',
        type: 'timeline-ref',
        text: `January 1921 — **Non-Cooperation-Khilafat Movement begins** — boycotts in cities, students leave schools
1921 — **Awadh peasant movement** — Baba Ramchandra, Oudh Kisan Sabha, attacks on talukdars
1921-22 — **Gudem Hills rebellion** — Alluri Sitaram Raju leads guerrilla warfare against British
1921 — **Assam plantation workers** leave tea gardens, believe "Gandhi Raj" is coming
4 February 1922 — **Chauri Chaura incident** — crowd burns police station, 22 policemen killed
February 1922 — **Gandhi calls off Non-Cooperation Movement**
March 1922 — **Gandhi arrested**, sentenced to 6 years in prison`,
        highlight: '**Key exam dates:** January 1921 (movement begins), 4 February 1922 (Chauri Chaura), February 1922 (movement called off). The Chauri Chaura date appears in almost every CBSE paper.',
      },
      // Final inline quiz
      {
        id: 'ch2-s2-final-quiz',
        title: 'Section Check',
        type: 'text',
        text: 'You\'ve now covered the most exam-heavy section of Chapter 2. The key things to remember:\n\n**1.** Different groups joined for different reasons — know each group\'s grievance and their definition of swaraj\n**2.** The movement grew out of control — peasants, tribals, and workers all went beyond what Gandhi intended\n**3.** Chauri Chaura (4 Feb 1922) — 22 policemen killed — Gandhi calls off the entire movement\n**4.** WHY he called it off — non-violence was not a tactic but the soul of the struggle\n**5.** Despite failure, the movement\'s significance was enormous — first national movement, economy hit, working class awakened, Hindu-Muslim unity',
        inlineQuiz: {
          question: 'Gandhi called off the Non-Cooperation Movement after Chauri Chaura because:',
          options: [
            'The British promised to grant swaraj if Gandhi stopped',
            'He believed a violent movement would corrupt the freedom it won',
            'The movement had already achieved all its goals',
            'Muslim leaders withdrew their support from the movement',
          ],
          correctIndex: 1,
          explanation: 'Gandhi called off the movement because non-violence was the SOUL of the struggle, not just a tactic. He believed that if the movement became violent, it would corrupt the people and the freedom they eventually won. The means shape the ends.',
        },
      },
    ],
  },
]
