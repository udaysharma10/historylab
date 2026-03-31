// Map definitions with clickable region coordinates (percentage-based)
// Regions are defined as { x, y, width, height } in percentages of the image dimensions

export interface MapRegion {
  id: string
  label: string
  /** Top-left x as % of image width */
  x: number
  /** Top-left y as % of image height */
  y: number
  /** Width as % of image width */
  width: number
  /** Height as % of image height */
  height: number
  /** Brief description shown on hover/tap */
  description?: string
}

export interface MapDefinition {
  id: string
  title: string
  subtitle: string
  imagePath: string
  sectionId: string
  sectionColor: string
  regions: MapRegion[]
  examTip: string
}

export const mapDefinitions: MapDefinition[] = [
  {
    id: 'europe-1815',
    title: 'Europe after the Congress of Vienna, 1815',
    subtitle: 'Fig 3 — Major empires and kingdoms redrawn by conservative powers',
    imagePath: '/images/fig-03-europe-map.png',
    sectionId: 's1',
    sectionColor: '#C0392B',
    examTip: 'CBSE frequently asks: "Which territories did the Congress of Vienna give to which empires?" Know the major boundaries.',
    regions: [
      {
        id: 'great-britain',
        label: 'Great Britain',
        x: 15, y: 32, width: 10, height: 18,
        description: 'Island nation — the dominant naval and industrial power. Played a key role at the Congress of Vienna alongside Russia, Prussia and Austria.',
      },
      {
        id: 'france',
        label: 'France',
        x: 19, y: 52, width: 14, height: 18,
        description: 'Bourbon dynasty restored after Napoleon\'s defeat. France returned to its pre-Revolution boundaries, surrounded by buffer states.',
      },
      {
        id: 'prussia',
        label: 'Prussia',
        x: 34, y: 34, width: 14, height: 14,
        description: 'Given important new territories in western Germany (Rhineland) and part of Saxony. Would later lead German unification.',
      },
      {
        id: 'austrian-empire',
        label: 'Austrian Empire',
        x: 35, y: 50, width: 18, height: 16,
        description: 'Habsburg Empire — a patchwork of many peoples including Germans, Magyars, Czechs, Italians. Given control of northern Italy (Lombardy and Venetia).',
      },
      {
        id: 'russian-empire',
        label: 'Russian Empire',
        x: 58, y: 18, width: 35, height: 45,
        description: 'The largest empire in Europe. Given part of Poland by the Congress of Vienna. Its influence would grow throughout the 19th century.',
      },
      {
        id: 'ottoman-empire',
        label: 'Ottoman Empire',
        x: 48, y: 70, width: 25, height: 18,
        description: 'Controlled most of the Balkans including Greece, Serbia, Romania, Bulgaria. Its disintegration in the 19th century created the "powder keg" of Europe.',
      },
      {
        id: 'spain',
        label: 'Spain',
        x: 12, y: 70, width: 16, height: 16,
        description: 'Bourbon monarchy also restored here. Lost most of its Latin American colonies by the 1820s.',
      },
    ],
  },
  {
    id: 'germany-unification',
    title: 'Unification of Germany (1866–71)',
    subtitle: 'Fig 12 — Prussia\'s expansion and the formation of the German Empire',
    imagePath: '/images/fig-12-germany-unification-map.png',
    sectionId: 's4',
    sectionColor: '#27AE60',
    examTip: 'CBSE asks: "How did Bismarck unify Germany through wars?" Know Prussia, Schleswig-Holstein, Bavaria, and the excluded Austrian Empire.',
    regions: [
      {
        id: 'prussia',
        label: 'Prussia',
        x: 30, y: 12, width: 48, height: 50,
        description: 'The largest and most powerful German state. Led unification under Otto von Bismarck through three wars (1864, 1866, 1870).',
      },
      {
        id: 'bavaria',
        label: 'Bavaria',
        x: 25, y: 68, width: 22, height: 18,
        description: 'The largest south German state. Joined the German Empire in 1871 after the Franco-Prussian War.',
      },
      {
        id: 'austrian-empire',
        label: 'Austrian Empire',
        x: 40, y: 78, width: 30, height: 18,
        description: 'Excluded from the German Confederation after the Austro-Prussian War of 1866. Not part of unified Germany.',
      },
      {
        id: 'schleswig-holstein',
        label: 'Schleswig-Holstein',
        x: 20, y: 5, width: 16, height: 16,
        description: 'Won from Denmark in 1864 (first of Bismarck\'s three wars). The dispute over this territory triggered the Austro-Prussian War.',
      },
      {
        id: 'hanover',
        label: 'Hanover',
        x: 14, y: 28, width: 18, height: 18,
        description: 'Annexed by Prussia after the Austro-Prussian War of 1866. Previously ruled by British royal family.',
      },
      {
        id: 'rhineland',
        label: 'Rhineland',
        x: 4, y: 48, width: 14, height: 18,
        description: 'Western German territory. Given to Prussia at the Congress of Vienna (1815). Industrial heartland.',
      },
    ],
  },
  {
    id: 'italy-before',
    title: 'Italian States before Unification, 1858',
    subtitle: 'Fig 14(a) — Seven states divided among ruling families',
    imagePath: '/images/fig-14a-italy-before.png',
    sectionId: 's4',
    sectionColor: '#27AE60',
    examTip: 'CBSE asks: "Which Italian state led the unification?" and "Name the states before unification." Know Sardinia-Piedmont, Papal State, and Two Sicilies.',
    regions: [
      {
        id: 'sardinia-piedmont',
        label: 'Sardinia-Piedmont',
        x: 8, y: 14, width: 22, height: 22,
        description: 'The only Italian state ruled by an Italian princely house. Led unification under King Victor Emmanuel II and Chief Minister Cavour.',
      },
      {
        id: 'lombardy',
        label: 'Lombardy',
        x: 28, y: 10, width: 16, height: 14,
        description: 'Under Austrian Habsburg rule. Freed after the Austro-Sardinian War of 1859.',
      },
      {
        id: 'venetia',
        label: 'Venetia',
        x: 44, y: 10, width: 16, height: 14,
        description: 'Also under Austrian rule. Joined Italy in 1866 after the Austro-Prussian War.',
      },
      {
        id: 'papal-state',
        label: 'Papal State',
        x: 36, y: 38, width: 20, height: 18,
        description: 'Ruled by the Pope. Rome became the capital of unified Italy in 1870.',
      },
      {
        id: 'two-sicilies',
        label: 'Kingdom of Two Sicilies',
        x: 38, y: 60, width: 30, height: 28,
        description: 'Southern Italy and Sicily. Conquered by Garibaldi and his Red Shirts in 1860.',
      },
      {
        id: 'tuscany',
        label: 'Tuscany',
        x: 28, y: 30, width: 18, height: 14,
        description: 'Central Italian state under Austrian influence. Joined Sardinia-Piedmont through popular uprisings in 1860.',
      },
      {
        id: 'modena',
        label: 'Modena',
        x: 32, y: 22, width: 14, height: 10,
        description: 'Small central Italian duchy. Also under Austrian influence. Joined unified Italy in 1860.',
      },
    ],
  },
]

/** Get a map definition by ID */
export function getMapById(mapId: string): MapDefinition | undefined {
  return mapDefinitions.find(m => m.id === mapId)
}

/** Get all maps for a given section */
export function getMapsBySection(sectionId: string): MapDefinition[] {
  return mapDefinitions.filter(m => m.sectionId === sectionId)
}
