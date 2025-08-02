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

// Improve search queries for better results using business context
function optimizeSearchQuery(query: string, businessContext?: any): string {
  const lowerQuery = query.toLowerCase();
  
  // Use business context to make searches more specific
  let businessInfo = '';
  if (businessContext) {
    businessInfo = `${businessContext.businessType || 'business'} ${businessContext.industry || ''} ${businessContext.location || ''}`.trim();
  }
  
  // For competitor queries, make them more specific and searchable
  if (lowerQuery.includes('competitor') || lowerQuery.includes('competition')) {
    if (businessContext) {
      // Use specific business context
      const searchTerms = [
        businessContext.businessType || 'business',
        businessContext.industry,
        businessContext.location,
        'competitors market analysis'
      ].filter(Boolean).join(' ');
      
      return searchTerms;
    } else {
      // Fallback to generic business types
      const businessTypes = ['salon', 'restaurant', 'shop', 'store', 'cafe', 'gym', 'clinic', 'spa'];
      const mentionedType = businessTypes.find(type => lowerQuery.includes(type));
      
      if (mentionedType) {
        return `${mentionedType} business market competition analysis`;
      } else {
        return 'business competition market analysis';
      }
    }
  }
  
  // For local queries, add business context
  if (lowerQuery.includes('local') || lowerQuery.includes('my area')) {
    if (businessContext && businessContext.location) {
      return `${businessContext.businessType || 'business'} ${businessContext.location} market analysis`;
    } else {
      return query.replace(/local|my area|around me|in my city/gi, 'business').trim();
    }
  }
  
  // For market/industry queries, add business context
  if (lowerQuery.includes('market') || lowerQuery.includes('industry') || lowerQuery.includes('trends')) {
    if (businessContext) {
      return `${businessContext.industry || businessContext.businessType || 'business'} market trends analysis ${new Date().getFullYear()}`;
    }
  }
  
  return query;
}

export async function searchDuckDuckGo(query: string, businessContext?: any): Promise<SearchResult | null> {
  try {
    // Optimize the query for better results
    const optimizedQuery = optimizeSearchQuery(query, businessContext);
    console.log('🌐 Making DuckDuckGo API request for:', optimizedQuery);
    console.log('📊 Using business context:', businessContext?.businessType, businessContext?.location);
    
    // DuckDuckGo Instant Answer API
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(optimizedQuery)}&format=json&no_html=1&skip_disambig=1`;
    console.log('📡 API URL:', url);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'CoFoundr/1.0 (Business Assistant)',
      },
    });

    if (!response.ok) {
      console.warn('💥 DuckDuckGo search failed:', response.status, response.statusText);
      return null;
    }

    console.log('📥 DuckDuckGo response received, parsing JSON...');
    const data = await response.json();
    console.log('📊 DuckDuckGo raw data:', data);
    
    // Extract useful information from DuckDuckGo response
    const result: SearchResult = {
      query: optimizedQuery,
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

    // Check if we got any useful data
    const hasUsefulData = result.answer || result.abstractText || result.definition || 
                         (result.relatedTopics && result.relatedTopics.length > 0);
    
    if (!hasUsefulData) {
      console.log('❌ DuckDuckGo returned no useful data for this query');
      return null;
    }

    return result;
  } catch (error) {
    console.error('DuckDuckGo search error:', error);
    return null;
  }
}

export function shouldPerformWebSearch(message: string): boolean {
  console.log('🔍 Checking if web search needed for:', message);
  
  // Quick check for obvious competitor queries
  const competitorKeywords = ['competitor', 'competitors', 'competition', 'rival', 'rivals'];
  const hasCompetitorKeyword = competitorKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
  
  if (hasCompetitorKeyword) {
    console.log('✅ Found competitor keyword, triggering search');
    return true;
  }
  
  // Patterns that indicate a web search would be helpful
  const searchIndicators = [
    // Current/recent information
    /\b(current|latest|recent|new|2024|2025|today|now|this year)\b/i,
    
    // Market research and competitors
    /\b(market|trend|industry|competitor|competitors|competition|competitive|price|pricing|cost)\b/i,
    
    // Local business research
    /\b(local|my area|nearby|in my city|around me|my location)\b/i,
    
    // Competitor-specific queries
    /\b(who are my|find competitors|competitor analysis|competitive landscape|rival|rivals)\b/i,
    
    // Definitions and explanations
    /\b(what is|define|explain|how does|how to|who are)\b/i,
    
    // Statistics and data
    /\b(statistics|stats|data|report|survey|study|research)\b/i,
    
    // News and events
    /\b(news|announcement|launch|funding|acquisition|IPO)\b/i,
    
    // Comparison queries
    /\b(vs|versus|compare|comparison|alternative|similar|better than|worse than)\b/i,
    
    // Business discovery queries
    /\b(find|search for|list of|who makes|companies that|businesses that)\b/i,
    
    // Specific business questions
    /\b(startup|business|company|revenue|valuation|growth rate|market share)\b/i,
    
    // Service/product research
    /\b(best|top|leading|popular|recommended|reviews)\b/i,
  ];

  // Test each pattern and log which ones match
  const matchingPatterns = [];
  searchIndicators.forEach((pattern, index) => {
    if (pattern.test(message)) {
      matchingPatterns.push(index);
    }
  });

  const shouldSearch = matchingPatterns.length > 0;
  console.log('📊 Matching patterns:', matchingPatterns);
  console.log('🎯 Web search needed:', shouldSearch);
  
  return shouldSearch;
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