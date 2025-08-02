// Web search functionality using DuckDuckGo Instant Answer API
export interface SearchResult {
  query: string;
  answer?: string;
  abstract?: string;
  abstractText?: string;
  abstractSource?: string;
  abstractURL?: string;
  relatedTopics?: Array<{
    Text: string;
    FirstURL?: string;
  }>;
  definition?: string;
  definitionSource?: string;
  definitionURL?: string;
  type?: string;
}

export async function searchDuckDuckGo(query: string): Promise<SearchResult | null> {
  try {
    // DuckDuckGo Instant Answer API
    const response = await fetch(
      `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`,
      {
        headers: {
          'User-Agent': 'CoLaunchr/1.0 (Business Assistant)',
        },
      }
    );

    if (!response.ok) {
      console.warn('DuckDuckGo search failed:', response.status);
      return null;
    }

    const data = await response.json();
    
    // Extract useful information from DuckDuckGo response
    const result: SearchResult = {
      query,
      answer: data.Answer || undefined,
      abstract: data.Abstract || undefined,
      abstractText: data.AbstractText || undefined,
      abstractSource: data.AbstractSource || undefined,
      abstractURL: data.AbstractURL || undefined,
      definition: data.Definition || undefined,
      definitionSource: data.DefinitionSource || undefined,
      definitionURL: data.DefinitionURL || undefined,
      type: data.Type || undefined,
      relatedTopics: data.RelatedTopics?.filter((topic: { Text?: string }) => topic.Text && topic.Text.length > 0) || undefined,
    };

    return result;
  } catch (error) {
    console.error('DuckDuckGo search error:', error);
    return null;
  }
}

export function shouldPerformWebSearch(message: string): boolean {
  // Patterns that indicate a web search would be helpful
  const searchIndicators = [
    // Current/recent information
    /\b(current|latest|recent|new|2024|2025|today|now|this year)\b/i,
    
    // Market research
    /\b(market|trend|industry|competitor|price|pricing|cost)\b/i,
    
    // Definitions and explanations
    /\b(what is|define|explain|how does|how to)\b/i,
    
    // Statistics and data
    /\b(statistics|stats|data|report|survey|study)\b/i,
    
    // News and events
    /\b(news|announcement|launch|funding|acquisition|IPO)\b/i,
    
    // Comparison queries
    /\b(vs|versus|compare|comparison|alternative|similar)\b/i,
    
    // Specific business questions
    /\b(startup|business|company|revenue|valuation|growth rate)\b/i,
  ];

  return searchIndicators.some(pattern => pattern.test(message));
}

export function formatSearchResults(results: SearchResult): string {
  if (!results) return '';

  let formattedResults = '';

  // Add main answer or definition
  if (results.answer) {
    formattedResults += `**Quick Answer:** ${results.answer}\n\n`;
  }

  if (results.definition) {
    formattedResults += `**Definition:** ${results.definition}`;
    if (results.definitionSource) {
      formattedResults += ` *(Source: ${results.definitionSource})*`;
    }
    formattedResults += '\n\n';
  }

  // Add abstract/summary
  if (results.abstractText) {
    formattedResults += `**Overview:** ${results.abstractText}`;
    if (results.abstractSource) {
      formattedResults += ` *(Source: ${results.abstractSource})*`;
    }
    formattedResults += '\n\n';
  }

  // Add related topics (limit to 3 most relevant)
  if (results.relatedTopics && results.relatedTopics.length > 0) {
    formattedResults += '**Related Information:**\n';
    results.relatedTopics.slice(0, 3).forEach(topic => {
      formattedResults += `• ${topic.Text}\n`;
    });
    formattedResults += '\n';
  }

  return formattedResults.trim();
}