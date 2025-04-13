export interface EmbeddingMatch {
  score: number
  relevantSections: string[]
}

export interface GrammarIssue {
  message: string
  offset: number
  length: number
  replacements: string[]
  context: string
  severity: "low" | "medium" | "high"
}

export interface KeywordMatch {
  keyword: string
  found: boolean
  importance: number
  context?: string
}

export interface ScoringOptions {
  useEmbeddings: boolean
  checkGrammar: boolean
  includeContextForKeywords: boolean
}

export interface ResumeScoreResult {
  overallScore: number
  keywordMatchScore: number
  contentRelevanceScore: number
  formatScore: number
  grammarScore?: number
  missingKeywords: string[]
  suggestions: string[]
}
