/**
 * Extract keywords from job description
 */
export function extractKeywords(jobDescription: string): { keywords: string[]; importantKeywords: string[] } {
  // Convert to lowercase for consistent processing
  const text = jobDescription.toLowerCase()

  // Extract all potential keywords
  const words = text.split(/\W+/).filter((word) => word.length > 2)
  const wordFrequency: Record<string, number> = {}

  // Count word frequency
  for (const word of words) {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1
  }

  // Extract phrases (2-3 word combinations)
  const phrases: string[] = []
  for (let i = 0; i < words.length - 1; i++) {
    phrases.push(`${words[i]} ${words[i + 1]}`)
    if (i < words.length - 2) {
      phrases.push(`${words[i]} ${words[i + 1]} ${words[i + 2]}`)
    }
  }

  // Count phrase frequency
  const phraseFrequency: Record<string, number> = {}
  for (const phrase of phrases) {
    phraseFrequency[phrase] = (phraseFrequency[phrase] || 0) + 1
  }

  // Filter common words and get top keywords by frequency
  const commonWords = new Set([
    "the",
    "and",
    "that",
    "for",
    "with",
    "this",
    "you",
    "are",
    "from",
    "have",
    "will",
    "your",
    "our",
    "their",
    "about",
    "what",
    "who",
    "when",
    "where",
    "why",
    "how",
    "can",
    "all",
    "been",
    "but",
    "not",
    "they",
    "has",
    "more",
    "must",
  ])

  // Filter out common words and sort by frequency
  const filteredWords = Object.entries(wordFrequency)
    .filter(([word]) => !commonWords.has(word))
    .sort((a, b) => b[1] - a[1])

  const filteredPhrases = Object.entries(phraseFrequency)
    .filter(([phrase]) => {
      const phraseWords = phrase.split(" ")
      return !phraseWords.every((word) => commonWords.has(word))
    })
    .sort((a, b) => b[1] - a[1])

  // Get top keywords
  const topWords = filteredWords.slice(0, 20).map(([word]) => word)
  const topPhrases = filteredPhrases.slice(0, 15).map(([phrase]) => phrase)

  // Combine words and phrases
  const keywords = [...topWords, ...topPhrases]

  // Identify important keywords (higher frequency or specific patterns)
  const importantKeywords = [
    ...filteredWords.slice(0, 10).map(([word]) => word),
    ...filteredPhrases.slice(0, 7).map(([phrase]) => phrase),
  ]

  // Add required/must-have keywords
  const requiredPatterns = [/required/i, /must have/i, /essential/i, /necessary/i, /key skill/i]

  const sentences = jobDescription.split(/[.!?]+/)
  for (const sentence of sentences) {
    if (requiredPatterns.some((pattern) => pattern.test(sentence))) {
      // Extract potential keywords from this sentence
      const words = sentence
        .toLowerCase()
        .split(/\W+/)
        .filter((w) => w.length > 3 && !commonWords.has(w))
      importantKeywords.push(...words)
    }
  }

  return {
    keywords: [...new Set(keywords)],
    importantKeywords: [...new Set(importantKeywords)],
  }
}
