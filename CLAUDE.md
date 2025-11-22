# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev`
- **Build for production**: `npm run build`
- **Lint code**: `npm run lint`
- **Preview production build**: `npm run preview`

## Supabase Function Development

### Deployment Commands
- **Deploy with access token**: `SUPABASE_ACCESS_TOKEN=sbp_81d511771f11fd8cec480e508d5e28f97cd8ad7e npx supabase functions deploy [function-name] --project-ref ltrscloqubyqzbowxoya`
- **Deploy key functions**:
  - Blog generation: `SUPABASE_ACCESS_TOKEN=sbp_81d511771f11fd8cec480e508d5e28f97cd8ad7e npx supabase functions deploy generate-blog-post --project-ref ltrscloqubyqzbowxoya`
  - Comprehensive blog: `SUPABASE_ACCESS_TOKEN=sbp_81d511771f11fd8cec480e508d5e28f97cd8ad7e npx supabase functions deploy generate-comprehensive-blog --project-ref ltrscloqubyqzbowxoya`
  - Enhanced chatbot: `SUPABASE_ACCESS_TOKEN=sbp_81d511771f11fd8cec480e508d5e28f97cd8ad7e npx supabase functions deploy enhanced-chatbot --project-ref ltrscloqubyqzbowxoya`
- **View function logs**: Check Supabase Dashboard → Functions → [function-name] → Logs
- **Test functions locally**: Functions run in Deno runtime, not Node.js

## Architecture Overview

This is a React-based company website for Phaeton AI with an integrated blog system and automated content generation.

### Frontend Architecture
- **Framework**: React 18 with TypeScript, built using Vite
- **Routing**: React Router v6 with client-side routing and future flags enabled
- **Styling**: Tailwind CSS with custom theming, animations, and color palette
- **Key Libraries**: Lucide React (icons), React Hot Toast (notifications), Canvas Confetti (celebrations), React Particles, React Helmet Async (SEO)

### Component Structure
- `src/components/layout/`: Navbar and Footer shared across pages
- `src/components/home/`: Homepage sections (Hero, Features, Pricing, etc.)
- `src/components/ui/`: Reusable UI components (Button, ChatWidget, ThemeToggle, NewsletterPopup, SearchBar)
- `src/components/contact/`: Contact form and related components
- `src/components/analytics/`: Analytics tracking components
- `src/components/seo/`: SEO components (SEOHead for dynamic meta tags and structured data)

### Backend & Data Layer
- **Backend**: Supabase with Edge Functions (Deno-based)
- **Database**: PostgreSQL via Supabase with automated migrations
- **Key Features**: 
  - Automated blog post generation using OpenAI GPT-4
  - AI Video Production & Editing services integration
  - Newsletter subscription system with Brevo API integration
  - Contact form handling
  - Admin blog management interface
  - Chatbot functionality

### Supabase Functions Architecture
Located in `supabase/functions/` (Deno runtime):
- `generate-blog-post/`: Core AI blog generation with OpenAI integration and image generation
- `generate-comprehensive-blog/`: Enhanced blog generation with comprehensive content
- `newsletter-subscribe/`: Email subscription handling with Brevo API integration
- `chatbot/`: Customer service chatbot functionality
- `enhanced-chatbot/`: Advanced chatbot with knowledge base integration
- `update-blog-post-status/`: Blog post status management
- `scan-website-knowledge/`: Automated website content scanning for chatbot knowledge base
- `query-knowledge-base/`: Search and retrieval from automated knowledge base
- `setup-knowledge-base/`: Initialize knowledge base tables and structure
- `test-chatbot/`: Simple testing function for chatbot debugging

### Automated Blog System
The project includes a comprehensive automated blog generation system with intelligent content expansion:
- Two-stage content generation: Initial 600-800 word base content, then automatic expansion to 1000+ words if needed
- GPT-4 integration with 8000 max_tokens, optimized for quality and performance
- Content quality validation to prevent repetitive or low-quality AI-generated text
- Predefined content categories (AI Fundamentals, Business Applications, Technical Implementation)
- SEO optimization with meta descriptions and keyword targeting  
- Image integration from Black Forest Labs API with Pexels fallback
- Content management through admin interface at `/admin/blog`
- Automated slug generation and content categorization
- Word count validation with 500-word minimum, targeting 1000+ words

### Key Pages & Routing
- `/`: Homepage with company information and features
- `/blog`: Blog listing and individual posts
- `/blog/:slug`: Individual blog post pages
- `/admin/blog`: Blog management interface
- `/admin/blog/edit/:id`: Blog post editing
- `/admin/blog/view/:id`: Blog post viewing
- `/contact`: Contact form with map integration
- `/hero`: Hero page
- `/sitedata`: Site data management
- Static pages: `/terms`, `/privacy`, `/support`, `/faq`
- 404 handling with catch-all route

### Configuration Files
- `vite.config.ts`: Vite configuration with React plugin, history API fallback, and build optimizations
- `tailwind.config.js`: Custom styling with Inter font, custom animations (fade-in, slide-up, slide-down, pulse-slow), and custom color palette
- `deno.json`: Supabase Edge Functions configuration with TypeScript imports
- `src/lib/supabase.ts`: Supabase client configuration with hardcoded credentials
- Database migrations in `supabase/migrations/` with timestamped SQL files

### Development Workflow
- **Frontend changes**: Hot reload via Vite dev server (`npm run dev`)
- **Function changes**: Must be deployed to Supabase to test integration
- **Database changes**: Use Supabase migrations, not direct SQL modifications
- **Environment variables**: Set in Supabase Dashboard → Project Settings → Edge Functions

### Local Development Setup
1. **Prerequisites**: Node.js 18+, npm
2. **Installation**: `npm install`
3. **Development Server**: `npm run dev` (starts on http://localhost:5173)
4. **Function Testing**: Deploy to Supabase to test integration (no local Deno setup)
5. **Configuration**: Verify project IDs in `src/lib/supabase.ts` match intended target

### Build Process & Tooling
- **Vite**: Fast development server and optimized production builds with terser minification
- **TypeScript**: Strict mode enabled with project references (tsconfig.json, tsconfig.app.json, tsconfig.node.json)
- **ESLint**: Code quality and linting (run with `npm run lint`) - build succeeds despite lint warnings
- **Tailwind CSS**: PostCSS processing with custom animations (fade-in, slide-up, slide-down, pulse-slow) and color palette
- **Build Output**: `dist/` directory with automatic `.htaccess` inclusion from `public/` folder
- **Performance**: Lucide React excluded from optimization for better performance
- **Dependencies**: Requires `terser` for production builds - install with `npm install terser --save-dev`
- **Browserslist**: Keep updated with `npx update-browserslist-db@latest` before builds
- **Bundle Optimization**: Manual chunks configured for vendor, router, ui, and supabase dependencies
- **Production Settings**: Console and debugger statements removed in production, source maps disabled

### Production Deployment Requirements
- **`.htaccess` file**: Must include URL rewrite rules for SPA routing (automatically copied from `public/`)
- **X-Frame-Options**: Set to `SAMEORIGIN` for chatbot iframe functionality
- **Environment Variables**: Verify all API keys set in Supabase Dashboard
- **Project ID Verification**: Ensure frontend and function deployments target same project
- **Favicon**: Uses PNG format only (`/Phaetoai-Icon-Large.png`) - never use SVG favicon
- **Build Dependencies**: Requires `terser` for production builds and regular browserslist updates

### Environment Setup & Dependencies
The project requires:
- **Frontend**: Node.js with npm, React 18, TypeScript 5.5+
- **Backend**: Deno runtime for Supabase functions
- **APIs**: OpenAI API key for blog generation, Black Forest Labs API for image generation, Brevo API key for email marketing
- **Database**: Supabase project with PostgreSQL
- **External Services**: Cron service for daily blog automation, Brevo API for email marketing and newsletter subscriptions

### Newsletter Integration Architecture
The newsletter popup system integrates with Brevo API and advanced celebration effects:
- **Frontend**: `NewsletterPopup.tsx` handles UI, form submission, and canvas-confetti celebrations
- **Backend**: `newsletter-subscribe` Supabase function processes subscriptions
- **Flow**: Email submitted → Added to Brevo contacts → Stored in local database → Advanced fireworks celebration → Success response
- **Celebration**: Multi-stage canvas-confetti fireworks with stars, hearts, and grand finale effects
- **Timing Control**: One-month delay system for both email submission and manual close actions
- **Environment**: Requires `BREVO_API_KEY` in Supabase environment variables
- **Brevo API**: Uses `POST /v3/contacts` with 204 status code (success with no content)

### Data Flow Pattern
1. **Frontend** makes requests to Supabase Edge Functions
2. **Edge Functions** (Deno) handle business logic and external API calls
3. **External APIs**: OpenAI (blog generation), Black Forest Labs (images), Brevo (email)
4. **Database**: PostgreSQL via Supabase for persistent storage
5. **Admin Interface**: React-based CMS for blog management

### Key Environment Variables
- `BREVO_API_KEY`: Email marketing integration
- `OPENAI_API_KEY`: Blog content generation (required for AI blog system)
- `BLACK_FOREST_API_KEY`: Image generation (optional, falls back to Pexels)
- `SUPABASE_URL` & `SUPABASE_ANON_KEY`: Database access (hardcoded in `src/lib/supabase.ts`)
- `SUPABASE_SERVICE_ROLE_KEY`: Required for Edge Functions database operations

### Project Configuration
- **CRITICAL**: Current Supabase configuration in `src/lib/supabase.ts` uses project ID `cpkslvmydfdevdftieck`
- **Frontend Database**: `https://cpkslvmydfdevdftieck.supabase.co` (hardcoded in source)
- **Function Deployment Target**: `ltrscloqubyqzbowxoya` (specified in deployment commands)
- **Legacy Status**: Both projects may be active - verify which should be primary
- **Access Token**: Available in `.claude/settings.local` for deployment commands

### Configuration Audit Required
When working with this codebase, always verify:
1. Check `src/lib/supabase.ts` for actual project ID in use
2. Ensure deployment commands target the correct project
3. Verify environment variables match the intended project
4. Update documentation when project configurations change

### SEO & Search Optimization
The site is comprehensively optimized for both traditional search engines and AI search platforms with enterprise-level implementation:
- **Dynamic SEO System**: `src/components/seo/SEOHead.tsx` component provides per-page optimization with React Helmet Async
- **Meta Descriptions**: All pages have optimized 150-160 character meta descriptions (FAQ, Support, Terms, Privacy, Blog pages)
- **Structured Data**: Full Schema.org markup (Organization, WebSite, Service, FAQ, ContactPage, BreadcrumbList) implemented across all pages
- **Image Optimization**: Enhanced alt text with keyword-rich descriptions across Hero, About, HowItWorks, Navbar, and Footer components
- **Heading Structure**: Proper H1 hierarchy maintained across all pages with systematic H2-H6 structure
- **AI Crawlers Allowed**: robots.txt permits CCBot, GPTBot, PerplexityBot, Claude-Web, and anthropic-ai
- **Performance Optimization**: PWA configuration with manifest.json and service worker for Core Web Vitals
- **Meta Tags**: Dynamic meta tags with AI-specific optimization for better search visibility
- **Social Media**: Complete Open Graph and Twitter Card integration with dynamic content
- **Technical SEO**: Comprehensive `.htaccess` with security headers, compression, and caching rules
- **Mobile Optimization**: Responsive design patterns with mobile-first approach using Tailwind CSS breakpoints

### Search Functionality
The website includes a comprehensive search system located in `src/components/ui/SearchBar.tsx`:
- **Static Content Search**: Covers all features, pricing, pages, and company information
- **Dynamic Blog Search**: Real-time search through Supabase blog posts with keyword matching
- **Search Categories**: Organized by type (page, feature, pricing, blog) with visual badges
- **Pricing Accuracy**: Search results reflect current "Contact Us" pricing model (no specific prices displayed)
- **Navigation Integration**: Supports both hash-based routing and full page navigation
- **Content Matching**: Searches titles, descriptions, and keywords for comprehensive results

### Terms of Service & Newsletter Popup Behavior
- **Terms Updates**: Notification system tracks dismissed updates by date, shows once per update
- **Newsletter Popup**: One-month delay system applies to both email submission and manual close
- **Development Mode**: Newsletter popup shows every time for testing; terms notification respects tracking
- **Production Mode**: Both systems respect user dismissal preferences and timing controls

### Critical File Naming Issues
Files with "Name clash" suffixes that need immediate attention:
- `README-BLOG-AUTOMATION (# Name clash 2025-08-07 k2v2c9C #).md`
- Multiple Supabase function files may have similar naming conflicts
- These files need renaming to their proper names for imports to work correctly
- Always check for and resolve naming conflicts when encountering import errors
- Use proper absolute paths in imports to avoid resolution issues

### Blog Generation System Details
The AI blog generation system uses a sophisticated two-stage approach:

1. **Initial Generation**: Creates 600-800 word base content using GPT-4 with structured prompts
2. **Automatic Expansion**: If content is under 1000 words, triggers a second AI call to expand content while maintaining quality
3. **Quality Controls**: Validates content to prevent repetitive text, excessive word repetition, and run-on sentences
4. **Content Structure**: Targets 5-6 sections with specific word counts (Introduction: 150-200 words, Main sections: 200-250 words each, Conclusion: 150-200 words)
5. **Performance Optimization**: Uses 8000 max_tokens with temperature 0.7 for balanced creativity and reliability

### Chatbot System Architecture
The chatbot system uses a direct n8n webhook integration with knowledge base fallback:
- **Frontend**: `ChatWidget.tsx` component provides iframe-based chat interface
- **Primary Integration**: Direct connection to n8n webhook at `https://n8n.phaetonai.ca/webhook/57de9426-b592-48ff-8c8d-a54583409650/chat`
- **Enhanced System**: `enhanced-chatbot` function with automated knowledge base (optional, reverted to simple n8n integration)
- **Knowledge Base**: Automated website content scanning and retrieval system for chatbot context
- **Security**: Requires `.htaccess` file with `X-Frame-Options: SAMEORIGIN` for iframe functionality
- **Chat Widget**: Located at `/chat-widget.html` and embedded via iframe in React component
- **Session Management**: Maintains user context and conversation history through n8n workflow

### Server Configuration Requirements
- **X-Frame-Options**: Must be set to `SAMEORIGIN` via `.htaccess` file (not meta tags)
- **Production Deployment**: Always include `.htaccess` file in web root for proper iframe functionality
- **CORS Headers**: Handled automatically by Supabase functions with proper origin headers

### File Naming and Import Issues
- Files with "Name clash" suffixes (e.g., `# Name clash 2025-08-12 xyz #`) need renaming
- Always check for and resolve these conflicts when encountering import errors
- Use proper absolute paths in imports to avoid resolution issues

### Pricing System Configuration
The pricing section uses dynamic "Contact us" messaging instead of fixed rates:
- **Rate Display**: "Cost per Call (Contact Us)" instead of specific per-minute pricing
- **Setup Fees**: "Contact us for pricing details" instead of fixed amounts
- **Philosophy**: Pricing information changes frequently, so generic contact messaging is used
- **Location**: `src/components/home/Pricing.tsx` contains all pricing tier configurations
- **Search Integration**: SearchBar reflects contact-us pricing model - no specific prices in search results

### Social Media Integration
Footer social media links are configured in `src/components/layout/Footer.tsx`:
- **Twitter/X**: https://x.com/PhaetonAIinc
- **LinkedIn**: Pierre Robert Phaeton personal profile with UTM tracking
- **YouTube**: @phaetonai channel
- **Instagram**: @phaetonai account
- **TikTok**: @phaetonai with tracking parameters
- **Styling**: Consistent hover effects and opens in new tabs with security attributes

### Critical Deployment Notes
- Functions must be deployed to Supabase to test AI blog generation functionality
- Daily generation limits have been removed - multiple posts can be generated per day
- Content quality validation prevents publication of low-quality AI-generated content
- All blog functions require `OPENAI_API_KEY` to be set in Supabase environment variables
- **Production Checklist**: Ensure `.htaccess` file is deployed with `X-Frame-Options: SAMEORIGIN`
- **Chatbot Integration**: Current production setup uses direct n8n webhook integration for simplicity
- **Supabase Project**: Always use `ltrscloqubyqzbowxoya` project ID for new deployments
- **SEO Implementation**: All pages now use dynamic SEO with structured data - verify meta tags render correctly
- **PWA Files**: Ensure `manifest.json` and service worker files are included in deployment
- **Favicon Configuration**: Only PNG favicon (`/Phaetoai-Icon-Large.png`) should be used - all SVG references removed
- **Build Verification**: Always run `npm run build` to update `dist/` folder before deployment - build time typically 6-10 seconds
- **File Naming**: Resolve any "Name clash" suffix files before deployment to prevent import errors
- **Search Content Updates**: When pricing or features change, update `staticSearchableContent` array in `src/components/ui/SearchBar.tsx`
- **Social Media Links**: Footer social media URLs can be updated in the `getHref` function in `src/components/layout/Footer.tsx`

## AI Video Production & Editing Integration

### Recent Implementation (2024)
The site now includes comprehensive AI video production and editing services as a core offering:
- **Homepage Integration**: New feature card with Video icon from Lucide React, positioned as 7th service with centered layout
- **FAQ Coverage**: Added 4 detailed questions covering video production services, cost savings (70-80% time reduction), personalization capabilities, and platform support
- **Search Integration**: Enhanced SearchBar with 8+ video-related entries including "AI Video Content Creation", "Automated Video Editing", and "Video Production Automation"
- **SEO Optimization**: Updated core keywords, meta tags, and structured data to include video production terms for better search visibility

### Feature Card Layout Architecture
The homepage features use a responsive grid with custom balance handling:
- **Grid Structure**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` with `items-stretch` for consistent heights
- **Card Components**: Individual FeatureCard components with 3D hover effects using CSS transforms and perspective
- **Flexbox Layout**: Each card uses `h-full flex flex-col` to ensure consistent sizing regardless of content length
- **Last Card Centering**: 7th card positioned in center column using `lg:col-start-2` CSS class
- **Interactive Effects**: Mouse-move 3D tilt effects with transform calculations and dynamic box shadows
- Blog Updates