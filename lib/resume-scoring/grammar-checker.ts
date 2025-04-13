import type { GrammarIssue } from "./types"

/**
 * Check grammar in resume text
 */
export async function checkGrammar(text: string): Promise<{ score: number; issues: GrammarIssue[] }> {
  try {
    // Try to use LanguageTool API if available
    const issues = await checkWithLanguageTool(text)

    // Calculate score based on issues
    const score = calculateGrammarScore(text, issues)

    return { score, issues }
  } catch (error) {
    console.error("Error using LanguageTool API:", error)

    // Fallback to basic grammar checking
    return basicGrammarCheck(text)
  }
}

/**
 * Check grammar using LanguageTool API
 */
async function checkWithLanguageTool(text: string): Promise<GrammarIssue[]> {
  try {
    const response = await fetch("https://api.languagetool.org/v2/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        text: text,
        language: "en-US",
        enabledOnly: "false",
      }),
    })

    if (!response.ok) {
      throw new Error(`LanguageTool API error: ${response.status}`)
    }

    const data = await response.json()

    // Convert LanguageTool format to our format
    return data.matches.map((match: any) => ({
      message: match.message,
      offset: match.offset,
      length: match.length,
      replacements: match.replacements.map((r: any) => r.value),
      context: match.context.text,
      severity: getSeverity(match.rule.category.id),
    }))
  } catch (error) {
    console.error("Error using LanguageTool API:", error)
    throw error
  }
}

/**
 * Map LanguageTool category to severity
 */
function getSeverity(category: string): "low" | "medium" | "high" {
  const highSeverity = ["TYPOS", "CASING", "GRAMMAR", "PUNCTUATION"]
  const mediumSeverity = ["STYLE", "REDUNDANCY", "CONSISTENCY"]

  if (highSeverity.includes(category)) return "high"
  if (mediumSeverity.includes(category)) return "medium"
  return "low"
}

/**
 * Calculate grammar score based on issues
 */
function calculateGrammarScore(text: string, issues: GrammarIssue[]): number {
  if (issues.length === 0) return 100

  // Count words in text
  const wordCount = text.split(/\s+/).filter(Boolean).length

  // Calculate weighted issue count
  let weightedIssueCount = 0
  for (const issue of issues) {
    switch (issue.severity) {
      case "high":
        weightedIssueCount += 1.5
        break
      case "medium":
        weightedIssueCount += 1
        break
      case "low":
        weightedIssueCount += 0.5
        break
    }
  }

  // Calculate score (100 - issues per 100 words * 10)
  const issuesPerHundredWords = (weightedIssueCount / wordCount) * 100
  const score = 100 - Math.min(50, issuesPerHundredWords * 10)

  return Math.round(score)
}

/**
 * Basic grammar check as fallback
 */
function basicGrammarCheck(text: string): { score: number; issues: GrammarIssue[] } {
  const issues: GrammarIssue[] = []

  // Check for common grammar issues
  const commonErrors = [
    { pattern: /\s\s+/g, message: "Multiple spaces detected" },
    { pattern: /[,.!?][A-Za-z]/g, message: "Missing space after punctuation" },
    { pattern: /\bi\b/g, message: "Lowercase 'i' should be uppercase" },
    { pattern: /\s+,/g, message: "Space before comma" },
    { pattern: /\s+\./g, message: "Space before period" },
    { pattern: /\b(their|there|they're|your|you're|its|it's|to|too|two)\b/gi, message: "Commonly confused word" },
  ]

  for (const error of commonErrors) {
    let match
    while ((match = error.pattern.exec(text)) !== null) {
      issues.push({
        message: error.message,
        offset: match.index,
        length: match[0].length,
        replacements: [],
        context: text.substring(
          Math.max(0, match.index - 20),
          Math.min(text.length, match.index + match[0].length + 20),
        ),
        severity: "medium",
      })
    }
  }

  // Calculate score
  return {
    score: Math.max(70, 100 - issues.length * 5),
    issues,
  }
}
