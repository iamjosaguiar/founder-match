# CoLaunchr Knowledge Base

This directory contains specialized knowledge files that CoLaunchr uses to provide expert-level guidance on specific business topics.

## How It Works

1. **Query Analysis**: When a user asks a question, the system analyzes their message for topic keywords
2. **Knowledge Retrieval**: Relevant knowledge files are automatically loaded based on detected topics
3. **Context Integration**: The specialized knowledge is combined with the user's personal context and memories
4. **Expert Response**: CoLaunchr responds with personalized advice using the specialized knowledge

## Adding New Knowledge Files

1. Create a new `.md` file in this directory (e.g., `sales-methodology.md`)
2. Add the topic and filename to `KNOWLEDGE_FILES` in `/src/lib/knowledge-base.ts`
3. Add relevant keywords to `TOPIC_KEYWORDS` to trigger the knowledge loading
4. Write comprehensive, actionable content in markdown format

## Knowledge File Format

Each knowledge file should follow this structure:

```markdown
# Topic Name - Brief Description

## Core Principles
- Key concepts and fundamentals

## Frameworks & Methods
- Step-by-step processes
- Templates and formulas

## Best Practices  
- Proven techniques
- Common mistakes to avoid

## Industry-Specific Applications
- How to apply in different contexts

## Examples & Case Studies
- Real-world applications
- Success stories

## Measurement & Optimization
- Key metrics to track
- How to improve results
```

## Current Knowledge Files

- **persuasionstack.md** - Copywriting and persuasion frameworks
- *Add more as you create them*

## Topic Detection Keywords

The system automatically detects these topics based on user queries:

- **Copywriting**: copy, landing page, email, headline, persuasion, conversion, etc.
- **Fundraising**: funding, investor, pitch deck, valuation, venture capital, etc.
- **Product Strategy**: product, feature, mvp, product market fit, user research, etc.
- **Growth Hacking**: growth, user acquisition, retention, viral, experiments, etc.
- **Sales**: sales, prospects, leads, closing, pipeline, crm, outreach, etc.
- **Marketing**: marketing, brand, content, seo, advertising, campaigns, etc.
- **Legal**: legal, contract, incorporation, intellectual property, compliance, etc.
- **Operations**: operations, process, workflow, automation, team, hiring, etc.

## Best Practices for Knowledge Files

1. **Be Specific**: Include actionable frameworks, not generic advice
2. **Include Examples**: Real-world applications and case studies
3. **Stay Current**: Update with latest best practices and trends
4. **Be Comprehensive**: Cover fundamentals through advanced techniques
5. **Cross-Reference**: Mention how topics connect to other business areas

## File Naming

Use descriptive, lowercase filenames with hyphens:
- ✅ `fundraising-playbook.md`  
- ✅ `product-development.md`
- ✅ `growth-tactics.md`
- ❌ `Fundraising.md`
- ❌ `product_dev.md`