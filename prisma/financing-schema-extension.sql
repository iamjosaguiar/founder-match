-- Information-Only Financing Section Schema
-- Safe for legal compliance - no transactions or advice

-- Company Showcases (Public Information Only)
model CompanyShowcase {
  id              String   @id @default(uuid())
  founderId       String   // User who posted
  companyName     String
  tagline         String?  // One-line description
  description     String   // Detailed company description
  industry        String   // Tech, Healthcare, Fintech, etc.
  stage           String   // Idea, MVP, Revenue, Growth
  location        String?  // City, Remote, etc.
  teamSize        Int?     // Number of employees
  founded         DateTime? // When company was started
  website         String?  // Company website
  socialLinks     Json?    // LinkedIn, Twitter, etc.
  logoUrl         String?  // Company logo
  
  -- Public metrics (no sensitive financial data)
  publicMetrics   Json?    // Users, downloads, etc. (not revenue)
  
  -- Seeking information (informational only)
  seekingTypes    String[] // Funding, Mentorship, Partnerships, etc.
  fundingStage    String?  // Pre-seed, Seed, Series A (informational)
  useOfFunds      String?  // What funding would be used for
  
  -- Contact preferences
  contactMethods  String[] // Email, LinkedIn, Website form
  preferredContact String? // Preferred way to be contacted
  
  status          String   @default("active") // active, paused, closed
  featured        Boolean  @default(false)    // Platform can feature companies
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  founder         User     @relation(fields: [founderId], references: [id])
  interests       ShowcaseInterest[]
  bookmarks       ShowcaseBookmark[]
  views           ShowcaseView[]
}

-- Interest Tracking (Safe - No Investment Commitments)
model ShowcaseInterest {
  id            String   @id @default(uuid())
  showcaseId    String
  userId        String   // Interested party
  interestType  String   // investor, mentor, partner, customer, etc.
  message       String?  // Optional message
  contactShared Boolean  @default(false) // Whether contact info was shared
  createdAt     DateTime @default(now())
  
  showcase      CompanyShowcase @relation(fields: [showcaseId], references: [id])
  user          User     @relation(fields: [userId], references: [id])
  
  @@unique([showcaseId, userId]) // One interest per user per showcase
}

-- Bookmarking System
model ShowcaseBookmark {
  id         String   @id @default(uuid())
  showcaseId String
  userId     String
  createdAt  DateTime @default(now())
  
  showcase   CompanyShowcase @relation(fields: [showcaseId], references: [id])
  user       User     @relation(fields: [userId], references: [id])
  
  @@unique([showcaseId, userId])
}

-- View Tracking for Analytics
model ShowcaseView {
  id         String   @id @default(uuid())
  showcaseId String
  userId     String?  // Null if anonymous
  ipAddress  String?  // For anonymous tracking
  userAgent  String?
  createdAt  DateTime @default(now())
  
  showcase   CompanyShowcase @relation(fields: [showcaseId], references: [id])
  user       User?    @relation(fields: [userId], references: [id])
  
  @@index([showcaseId, createdAt])
}

-- Investor/Mentor Profiles (Information Only)
model InvestorProfile {
  id              String   @id @default(uuid())
  userId          String   @unique
  profileType     String   // investor, mentor, advisor, partner
  
  -- Professional Information
  organization    String?  // Company/Fund name
  title           String?  // Job title
  bio             String?  // Professional background
  expertise       String[] // Areas of expertise
  
  -- Interest Areas (Not Investment Criteria)
  interestedIn    String[] // Industries interested in
  stageInterest   String[] // Stages they're interested in helping
  geographic      String[] // Geographic preferences
  
  -- Contact & Social
  website         String?
  linkedin        String?
  twitter         String?
  calendlyUrl     String?  // For scheduling meetings
  
  -- Public Profile Settings
  publicProfile   Boolean  @default(false) // Show in investor directory
  openToContact   Boolean  @default(true)  // Accept unsolicited contact
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user            User     @relation(fields: [userId], references: [id])
}

-- Educational Content Management
model FinancingGuide {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  content     String   // Markdown content
  excerpt     String?  // Brief description
  category    String   // fundraising, legal, valuation, etc.
  difficulty  String   // beginner, intermediate, advanced
  readTime    Int?     // Estimated reading time in minutes
  featured    Boolean  @default(false)
  published   Boolean  @default(false)
  
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@index([category, published])
  @@index([featured, published])
}

-- Add to existing User model
model User {
  // ... existing fields ...
  
  companyShowcases    CompanyShowcase[]
  showcaseInterests   ShowcaseInterest[]
  showcaseBookmarks   ShowcaseBookmark[]
  showcaseViews       ShowcaseView[]
  investorProfile     InvestorProfile?
  guidesAuthored      FinancingGuide[]
}