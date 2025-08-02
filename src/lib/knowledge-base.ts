import path from 'path';
import fs from 'fs';

export type KnowledgeTopic = 
  | 'copywriting' 
  | 'fundraising' 
  | 'product-strategy'
  | 'growth-hacking'
  | 'sales'
  | 'marketing'
  | 'legal'
  | 'operations';

// Knowledge file mappings
const KNOWLEDGE_FILES: Record<KnowledgeTopic, string> = {
  copywriting: 'persuasionstack.md',
  fundraising: 'fundraising-playbook.md',
  'product-strategy': 'product-development.md',
  'growth-hacking': 'growth-tactics.md',
  sales: 'sales-methodology.md',
  marketing: 'marketing-frameworks.md',
  legal: 'startup-legal-guide.md',
  operations: 'business-operations.md'
};

// Topic keywords for query analysis
const TOPIC_KEYWORDS: Record<KnowledgeTopic, string[]> = {
  copywriting: [
    'copy', 'copywriting', 'sales page', 'landing page', 'email', 'subject line',
    'headline', 'persuasion', 'conversion', 'messaging', 'value prop', 'cta',
    'call to action', 'ad copy', 'marketing copy', 'product description'
  ],
  fundraising: [
    'fundraising', 'funding', 'investor', 'pitch deck', 'valuation', 'term sheet',
    'seed round', 'series a', 'venture capital', 'angel investor', 'raise money',
    'cap table', 'dilution', 'equity', 'investment'
  ],
  'product-strategy': [
    'product', 'feature', 'roadmap', 'user story', 'mvp', 'product market fit',
    'user research', 'product development', 'product management', 'prioritization',
    'backlog', 'user experience', 'product design'
  ],
  'growth-hacking': [
    'growth', 'user acquisition', 'retention', 'viral', 'referral', 'conversion',
    'funnel', 'growth hacking', 'experiments', 'a/b test', 'metrics', 'kpi',
    'customer acquisition cost', 'lifetime value', 'churn'
  ],
  sales: [
    'sales', 'selling', 'prospects', 'leads', 'closing', 'objections',
    'sales process', 'pipeline', 'crm', 'outreach', 'cold email', 'discovery call',
    'demo', 'proposal', 'negotiation'
  ],
  marketing: [
    'marketing', 'brand', 'content', 'social media', 'seo', 'advertising',
    'campaign', 'channel', 'customer acquisition', 'content marketing',
    'influencer', 'pr', 'public relations'
  ],
  legal: [
    'legal', 'contract', 'terms', 'privacy policy', 'incorporation', 'llc',
    'intellectual property', 'trademark', 'patent', 'compliance', 'gdpr',
    'employment law', 'equity agreements'
  ],
  operations: [
    'operations', 'process', 'workflow', 'automation', 'efficiency', 'team',
    'hiring', 'onboarding', 'culture', 'remote work', 'productivity',
    'project management', 'tools', 'systems'
  ]
};

export async function analyzeQueryTopics(query: string): Promise<KnowledgeTopic[]> {
  const queryLower = query.toLowerCase();
  const detectedTopics: KnowledgeTopic[] = [];

  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    const hasKeyword = keywords.some(keyword => 
      queryLower.includes(keyword.toLowerCase())
    );
    
    if (hasKeyword) {
      detectedTopics.push(topic as KnowledgeTopic);
    }
  }

  // If no specific topics detected, return empty array
  return detectedTopics;
}

export async function loadKnowledgeFiles(topics: KnowledgeTopic[]): Promise<string> {
  if (topics.length === 0) return '';

  // Only try to load files in server environment
  if (typeof window !== 'undefined') return ''; // Skip on client side
  
  let combinedKnowledge = '';

  try {
    const knowledgeDir = path.join(process.cwd(), 'knowledge-base');
    
    for (const topic of topics) {
      const filename = KNOWLEDGE_FILES[topic];
      if (!filename) continue;
      
      const filePath = path.join(knowledgeDir, filename);
      
      try {
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          combinedKnowledge += `\n## ${topic.toUpperCase()} KNOWLEDGE:\n${content}\n`;
        } else {
          console.warn(`Knowledge file not found: ${filePath}`);
        }
      } catch (fileError) {
        console.warn(`Could not load knowledge file: ${filename}`, fileError);
        // Continue processing other files
      }
    }
  } catch (dirError) {
    console.warn('Knowledge base directory access error:', dirError);
    // Return empty string if knowledge base is not available
    return '';
  }

  return combinedKnowledge;
}

export async function getRelevantKnowledge(
  query: string, 
  userContext?: any
): Promise<string> {
  // Analyze user's query for relevant topics
  const detectedTopics = await analyzeQueryTopics(query);
  
  // Add context-based topic detection
  if (userContext) {
    // If user has copywriting in their skills or recent activity
    if (userContext.profile?.skills?.toLowerCase().includes('copy') ||
        userContext.profile?.skills?.toLowerCase().includes('marketing')) {
      detectedTopics.push('copywriting');
    }
    
    // If user is at fundraising stage
    if (userContext.assessment?.currentStage?.toLowerCase().includes('funding') ||
        userContext.assessment?.currentStage?.toLowerCase().includes('raise')) {
      detectedTopics.push('fundraising');
    }
  }

  // Remove duplicates
  const uniqueTopics = [...new Set(detectedTopics)];
  
  // Load and return relevant knowledge
  return await loadKnowledgeFiles(uniqueTopics);
}