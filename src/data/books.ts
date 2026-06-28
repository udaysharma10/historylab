// Book and chapter registry for the NCERT learning platform
// Currently: Class 10 History only. Expandable to other books/classes.

export interface BookChapter {
  id: string
  number: number
  title: string
  subtitle: string
  icon: string
  status: 'live' | 'coming-soon'
  isFree: boolean
}

export interface Book {
  id: string
  title: string
  subtitle: string
  classNumber: number
  subject: string
  icon: string
  color: string
  chapters: BookChapter[]
}

export const historyBook: Book = {
  id: 'history-10',
  title: 'India and the Contemporary World – II',
  subtitle: 'NCERT History — Class 10',
  classNumber: 10,
  subject: 'History',
  icon: '📜',
  color: '#C36B53',
  chapters: [
    {
      id: 'ch1',
      number: 1,
      title: 'The Rise of Nationalism in Europe',
      subtitle: 'Section I: Events and Processes',
      icon: '🏛️',
      status: 'live',
      isFree: true,
    },
    {
      id: 'ch2',
      number: 2,
      title: 'Nationalism in India',
      subtitle: 'Section I: Events and Processes',
      icon: '🇮🇳',
      status: 'live',
      isFree: false,
    },
    {
      id: 'ch3',
      number: 3,
      title: 'The Making of a Global World',
      subtitle: 'Section II: Livelihoods, Economies and Societies',
      icon: '🌍',
      status: 'coming-soon',
      isFree: false,
    },
    {
      id: 'ch4',
      number: 4,
      title: 'The Age of Industrialisation',
      subtitle: 'Section II: Livelihoods, Economies and Societies',
      icon: '🏭',
      status: 'coming-soon',
      isFree: false,
    },
    {
      id: 'ch5',
      number: 5,
      title: 'Print Culture and the Modern World',
      subtitle: 'Section III: Everyday Life, Culture and Politics',
      icon: '📰',
      status: 'coming-soon',
      isFree: false,
    },
  ],
}

// For future expansion
export const allBooks: Book[] = [historyBook]

export function getBook(bookId: string): Book | undefined {
  return allBooks.find(b => b.id === bookId)
}

export function getChapter(bookId: string, chapterId: string): BookChapter | undefined {
  const book = getBook(bookId)
  return book?.chapters.find(c => c.id === chapterId)
}
