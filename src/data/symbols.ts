import type { SymbolData } from '../types/chapter'

// === GERMANIA — Allegory of the German Nation ===
// From NCERT Box 3 and Figure analysis (Figs 17-19)
export const germaniaSymbols: SymbolData[] = [
  {
    symbol: 'Broken chains',
    meaning: 'Being freed from bondage and oppression',
  },
  {
    symbol: 'Breastplate with eagle',
    meaning: 'Symbol of the German empire — strength and power',
  },
  {
    symbol: 'Crown of oak leaves',
    meaning: 'Heroism (the German oak stands for bravery)',
  },
  {
    symbol: 'Sword',
    meaning: 'Readiness to fight',
  },
  {
    symbol: 'Olive branch around the sword',
    meaning: 'Willingness to make peace',
  },
  {
    symbol: 'Black, red and gold tricolour',
    meaning:
      'Flag of the liberal-nationalists in 1848, banned by the Dukes of the German states',
  },
  {
    symbol: 'Rays of the rising sun',
    meaning: 'Beginning of a new era',
  },
]

// === MARIANNE — Allegory of the French Republic ===
// From NCERT Section 5.2 and Figure 16
export const marianneSymbols: SymbolData[] = [
  {
    symbol: 'Red cap (Phrygian cap)',
    meaning: 'Liberty — worn by freed slaves in ancient Rome, adopted as symbol of the Revolution',
  },
  {
    symbol: 'Tricolour (blue, white, red)',
    meaning: 'The French Republic — replaced the royal standard after the Revolution',
  },
  {
    symbol: 'Cockade',
    meaning: 'Revolutionary badge of the Republic — worn by citizens to show allegiance',
  },
  {
    symbol: 'Statues in public squares',
    meaning: 'Making the Republic visible and tangible in everyday life',
  },
  {
    symbol: 'Images on coins and stamps',
    meaning: 'Embedding national identity into daily transactions — every citizen encounters Marianne',
  },
]

// === BRITANNIA — Allegory of the British Empire ===
// From NCERT Figure 20 and Section 6.3
export const britanniaSymbols: SymbolData[] = [
  {
    symbol: 'Trident',
    meaning: 'British naval supremacy — "Britannia rules the waves"',
  },
  {
    symbol: 'Shield with Union Jack',
    meaning: 'The United Kingdom — union of England, Scotland, and Ireland',
  },
  {
    symbol: 'Seated on a globe',
    meaning: 'Imperial dominance over the world — the British Empire',
  },
  {
    symbol: 'Angels carrying banner of "Freedom"',
    meaning: 'The irony: claiming to bring freedom while colonising nations',
  },
  {
    symbol: 'Lions, tigers, elephants',
    meaning: 'Stereotypical imagery of colonised lands — showing empire\'s reach',
  },
]

// === THE GERMANIA PROGRESSION ===
// Three paintings that tell the story of nationalism's transformation
export interface GermaniaProgression {
  year: number
  artist: string
  title: string
  figureId: string
  description: string
  symbolism: string
  nationalisticPhase: string
}

export const germaniaProgression: GermaniaProgression[] = [
  {
    year: 1848,
    artist: 'Philip Veit',
    title: 'Germania',
    figureId: 'fig-17',
    description: 'Germania on a cotton banner, meant to hang from the ceiling of the Church of St Paul where the Frankfurt parliament was convened. She wears broken chains and the tricolour.',
    symbolism: 'Broken chains = freedom from oppression. The tricolour = liberal-nationalist hope. An idealistic vision of a free, democratic Germany.',
    nationalisticPhase: 'Hope — liberal-democratic nationalism at its peak',
  },
  {
    year: 1850,
    artist: 'Julius Hübner',
    title: 'The Fallen Germania',
    figureId: 'fig-18',
    description: 'Germania lying defeated on the ground. Her sword has fallen. Her crown has been removed. She looks broken.',
    symbolism: 'The defeat of the Frankfurt Parliament. The failure of democratic nation-building. The dream of 1848 is crushed.',
    nationalisticPhase: 'Defeat — liberal nationalism fails, conservatives suppress the movement',
  },
  {
    year: 1860,
    artist: 'Lorenz Clasen',
    title: 'Germania Guarding the Rhine',
    figureId: 'fig-19',
    description: 'A more assertive, militaristic Germania. She wears armored breastplate, holds a drawn sword. Inscription: "The German sword protects the German Rhine."',
    symbolism: 'Nationalism has transformed from liberation to aggression. The sword is no longer defensive but offensive. Germany is now about military power.',
    nationalisticPhase: 'Power — nationalism becomes state-driven, militaristic, and aggressive',
  },
]

// === WHAT IS ALLEGORY? ===
export const allegoryExplanation = {
  definition: 'When an abstract idea (like a nation, liberty, or justice) is given a concrete form — usually a human figure. The figure does not represent a real person but a concept.',
  whyFemale: 'Nations were portrayed as female figures because in European tradition, abstract concepts like Liberty, Justice, and the Republic were grammatically feminine and culturally associated with nurturing and ideal forms.',
  whyItMatters: 'Allegory made invisible ideas VISIBLE. You cannot point to "Germany" or "France" — they are abstract concepts. But you can point to Germania or Marianne. These figures made citizens FEEL their nation was real, tangible, and worth fighting for.',
  examTip: 'CBSE frequently asks: "What is meant by allegory? Give examples." or "Describe the attributes of Marianne/Germania." Learn the symbols — they are tested almost every year.',
}
