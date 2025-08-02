// Business context updater for CoLaunchr chat
import { prisma } from '@/lib/prisma';

interface BusinessUpdate {
  field: string;
  value: any;
  confidence: number; // 0-1 score of how confident we are in this update
}

interface BusinessContext {
  id: string;
  name: string;
  businessType: string;
  industry: string;
  location?: string;
  stage: string;
  [key: string]: any;
}

export class BusinessUpdater {
  
  static extractBusinessUpdates(message: string, aiResponse: string, currentBusiness?: BusinessContext): BusinessUpdate[] {
    const updates: BusinessUpdate[] = [];
    const combinedText = `${message} ${aiResponse}`.toLowerCase();
    
    // Extract location updates
    const locationPatterns = [
      /(?:located in|based in|in|from)\s+([a-z\s,]+(?:australia|usa|uk|canada|zealand))/i,
      /(?:my location is|i'm in|we're in)\s+([a-z\s,]+)/i
    ];
    
    for (const pattern of locationPatterns) {
      const match = combinedText.match(pattern);
      if (match && match[1]) {
        const location = this.cleanLocation(match[1]);
        if (location && location !== currentBusiness?.location) {
          updates.push({
            field: 'location',
            value: location,
            confidence: 0.8
          });
        }
      }
    }
    
    // Extract business stage updates
    const stagePatterns = [
      /(?:we're|i'm|business is)\s+(?:in|at)\s+(?:the\s+)?(idea|validation|mvp|early.revenue|growth|established)\s+stage/i,
      /(?:just|recently)\s+(launched|started|opened)/i,
      /(?:been\s+)?(?:running|operating)\s+for\s+(\d+)\s+(year|month)/i
    ];
    
    for (const pattern of stagePatterns) {
      const match = combinedText.match(pattern);
      if (match) {
        let stage = '';
        if (match[1] === 'launched' || match[1] === 'started' || match[1] === 'opened') {
          stage = 'early-revenue';
        } else if (match[1] && ['idea', 'validation', 'mvp', 'early-revenue', 'growth', 'established'].includes(match[1])) {
          stage = match[1];
        } else if (match[2] === 'year' && parseInt(match[1]) >= 2) {
          stage = 'established';
        } else if (match[2] === 'year' && parseInt(match[1]) === 1) {
          stage = 'growth';
        }
        
        if (stage && stage !== currentBusiness?.stage) {
          updates.push({
            field: 'stage',
            value: stage,
            confidence: 0.7
          });
        }
      }
    }
    
    // Extract team size updates
    const teamPatterns = [
      /(?:team of|we have|staff of|employ)\s+(\d+)\s+(?:people|employees|staff)/i,
      /(?:it's just|only)\s+me|(?:solo|one.person)\s+(?:business|operation)/i,
      /(?:my|our)\s+team\s+(?:has|is)\s+(\d+)/i
    ];
    
    for (const pattern of teamPatterns) {
      const match = combinedText.match(pattern);
      if (match) {
        let teamSize = 1;
        if (match[1]) {
          teamSize = parseInt(match[1]);
        }
        
        if (teamSize !== currentBusiness?.teamSize) {
          updates.push({
            field: 'teamSize',
            value: teamSize,
            confidence: 0.8
          });
        }
      }
    }
    
    // Extract services/specialties updates
    const servicePatterns = [
      /(?:we offer|we do|we specialize in|we provide)\s+([a-z\s,]+)/i,
      /(?:services include|our services)\s+([a-z\s,]+)/i
    ];
    
    for (const pattern of servicePatterns) {
      const match = combinedText.match(pattern);
      if (match && match[1]) {
        const services = this.extractServices(match[1]);
        if (services.length > 0) {
          updates.push({
            field: 'primaryServices',
            value: services,
            confidence: 0.6
          });
        }
      }
    }
    
    // Extract target audience updates
    const audiencePatterns = [
      /(?:our clients are|we target|we serve)\s+([a-z\s,\-\d]+)/i,
      /(?:target audience|customer base)\s+(?:is|are)\s+([a-z\s,\-\d]+)/i
    ];
    
    for (const pattern of audiencePatterns) {
      const match = combinedText.match(pattern);
      if (match && match[1]) {
        const audience = match[1].trim();
        if (audience.length > 5 && audience !== currentBusiness?.targetAudience) {
          updates.push({
            field: 'targetAudience',
            value: audience,
            confidence: 0.7
          });
        }
      }
    }
    
    return updates.filter(update => update.confidence >= 0.6);
  }
  
  static async applyBusinessUpdates(
    userId: string, 
    businessId: string, 
    updates: BusinessUpdate[]
  ): Promise<boolean> {
    if (updates.length === 0) return false;
    
    try {
      // Build update object
      const updateData: any = {};
      
      for (const update of updates) {
        // Only apply high-confidence updates
        if (update.confidence >= 0.7) {
          updateData[update.field] = update.value;
        }
      }
      
      if (Object.keys(updateData).length === 0) return false;
      
      // Update the business
      await prisma.business.update({
        where: { 
          id: businessId,
          userId: userId // Ensure user owns the business
        },
        data: updateData
      });
      
      console.log('✅ Business context updated:', updateData);
      return true;
    } catch (error) {
      console.error('❌ Error updating business context:', error);
      return false;
    }
  }
  
  private static cleanLocation(location: string): string {
    // Clean and normalize location strings
    return location
      .replace(/\b(in|from|located|based)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim()
      .split(',')
      .map(part => part.trim())
      .filter(part => part.length > 0)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(', ');
  }
  
  private static extractServices(servicesText: string): string[] {
    const services = servicesText
      .split(/[,&\+and]/)
      .map(service => service.trim())
      .filter(service => service.length > 2 && service.length < 30)
      .map(service => service.charAt(0).toUpperCase() + service.slice(1));
    
    return [...new Set(services)]; // Remove duplicates
  }
}

export async function updateBusinessFromConversation(
  userId: string,
  businessId: string,
  userMessage: string,
  aiResponse: string,
  currentBusiness?: BusinessContext
): Promise<{ updated: boolean; updatedFields: string[] }> {
  
  const updates = BusinessUpdater.extractBusinessUpdates(userMessage, aiResponse, currentBusiness);
  
  if (updates.length === 0) {
    return { updated: false, updatedFields: [] };
  }
  
  const success = await BusinessUpdater.applyBusinessUpdates(userId, businessId, updates);
  
  return {
    updated: success,
    updatedFields: updates.map(u => u.field)
  };
}