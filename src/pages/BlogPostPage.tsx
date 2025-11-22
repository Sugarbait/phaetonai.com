import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Tag, Share2, Users, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import SEOHead from '../components/seo/SEOHead';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  keywords: string[];
  published_at: string;
  created_at: string;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (slug) {
      loadBlogPost(slug);
    }
  }, [slug]);

  const loadBlogPost = async (postSlug: string) => {
    try {
      // Load the main post
      const { data: postData, error: postError } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', postSlug)
        .single();

      if (postError) throw postError;
      setPost(postData);

      // Load related posts (posts with similar keywords)
      if (postData?.keywords && postData.keywords.length > 0) {
        const { data: relatedData } = await supabase
          .from('blog_posts')
          .select('*')
          .neq('id', postData.id)
          .order('published_at', { ascending: false })
          .limit(3);

        setRelatedPosts(relatedData || []);
      }
    } catch (error) {
      console.error('Error loading blog post:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const sharePost = async () => {
    if (!post) return;

    const url = `${window.location.origin}/blog/${post.slug}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-16 min-h-screen relative overflow-hidden">
        {/* Digital technological background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          {/* Circuit board pattern */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  {/* Horizontal lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                  <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1"/>
                  <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                  
                  {/* Vertical lines */}
                  <line x1="20" y1="0" x2="20" y2="100" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                  <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1"/>
                  <line x1="80" y1="0" x2="80" y2="100" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                  
                  {/* Circuit nodes */}
                  <circle cx="20" cy="20" r="2" fill="rgba(147, 197, 253, 0.6)"/>
                  <circle cx="50" cy="50" r="1.5" fill="rgba(59, 130, 246, 0.8)"/>
                  <circle cx="80" cy="80" r="2" fill="rgba(147, 197, 253, 0.6)"/>
                  <circle cx="80" cy="20" r="1" fill="rgba(59, 130, 246, 0.5)"/>
                  <circle cx="20" cy="80" r="1" fill="rgba(59, 130, 246, 0.5)"/>
                  
                  {/* Small rectangles (chips) */}
                  <rect x="18" y="48" width="4" height="4" fill="rgba(59, 130, 246, 0.4)" rx="0.5"/>
                  <rect x="78" y="18" width="4" height="4" fill="rgba(59, 130, 246, 0.4)" rx="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit)"/>
            </svg>
          </div>

          {/* Digital grid overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}>
          </div>

          {/* Glowing orbs */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-3/4 w-20 h-20 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
          </div>

          {/* Binary code pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-blue-300 text-xs font-mono transform rotate-12">
              01001000 01100101 01101100 01101100 01101111
            </div>
            <div className="absolute top-32 right-20 text-blue-300 text-xs font-mono transform -rotate-6">
              01000001 01001001 00100000 01010000 01101111
            </div>
            <div className="absolute bottom-20 left-1/3 text-blue-300 text-xs font-mono transform rotate-3">
              01110111 01100101 01110010 01100101 01100100
            </div>
          </div>

          {/* Hexagonal tech pattern */}
          <div className="absolute inset-0 opacity-15">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hexagon" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                  <polygon points="30,2 45,15 45,37 30,50 15,37 15,15" 
                           fill="none" 
                           stroke="rgba(59, 130, 246, 0.3)" 
                           strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexagon)"/>
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-6 sm:h-8 bg-white/20 rounded mb-3 sm:mb-4"></div>
              <div className="h-48 sm:h-56 md:h-64 bg-white/10 rounded mb-6 sm:mb-8"></div>
              <div className="h-8 sm:h-10 md:h-12 bg-white/20 rounded mb-3 sm:mb-4"></div>
              <div className="space-y-3 sm:space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-3 sm:h-4 bg-white/10 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-16 min-h-screen relative overflow-hidden">
        {/* Digital technological background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          {/* Circuit board pattern */}
          <div className="absolute inset-0 opacity-30">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                  {/* Horizontal lines */}
                  <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                  <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1"/>
                  <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                  
                  {/* Vertical lines */}
                  <line x1="20" y1="0" x2="20" y2="100" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                  <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1"/>
                  <line x1="80" y1="0" x2="80" y2="100" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                  
                  {/* Circuit nodes */}
                  <circle cx="20" cy="20" r="2" fill="rgba(147, 197, 253, 0.6)"/>
                  <circle cx="50" cy="50" r="1.5" fill="rgba(59, 130, 246, 0.8)"/>
                  <circle cx="80" cy="80" r="2" fill="rgba(147, 197, 253, 0.6)"/>
                  <circle cx="80" cy="20" r="1" fill="rgba(59, 130, 246, 0.5)"/>
                  <circle cx="20" cy="80" r="1" fill="rgba(59, 130, 246, 0.5)"/>
                  
                  {/* Small rectangles (chips) */}
                  <rect x="18" y="48" width="4" height="4" fill="rgba(59, 130, 246, 0.4)" rx="0.5"/>
                  <rect x="78" y="18" width="4" height="4" fill="rgba(59, 130, 246, 0.4)" rx="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#circuit)"/>
            </svg>
          </div>

          {/* Digital grid overlay */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}>
          </div>

          {/* Glowing orbs */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-3/4 w-20 h-20 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
          </div>

          {/* Binary code pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 text-blue-300 text-xs font-mono transform rotate-12">
              01001000 01100101 01101100 01101100 01101111
            </div>
            <div className="absolute top-32 right-20 text-blue-300 text-xs font-mono transform -rotate-6">
              01000001 01001001 00100000 01010000 01101111
            </div>
            <div className="absolute bottom-20 left-1/3 text-blue-300 text-xs font-mono transform rotate-3">
              01110111 01100101 01110010 01100101 01100100
            </div>
          </div>

          {/* Hexagonal tech pattern */}
          <div className="absolute inset-0 opacity-15">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="hexagon" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                  <polygon points="30,2 45,15 45,37 30,50 15,37 15,15" 
                           fill="none" 
                           stroke="rgba(59, 130, 246, 0.3)" 
                           strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexagon)"/>
            </svg>
          </div>
        </div>

        <div className="container mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">Post Not Found</h1>
            <p className="text-blue-100 mb-6 sm:mb-8 text-sm sm:text-base">The blog post you're looking for doesn't exist.</p>
            <Link
              to="/blog"
              className="inline-flex items-center text-blue-300 hover:text-blue-100 font-medium transition-colors text-sm sm:text-base"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-16 min-h-screen relative overflow-hidden">
      <SEOHead 
        title={`${post.title} | Phaeton AI Blog`}
        description={post.excerpt}
        keywords={post.keywords || []}
        canonical={`https://phaetonai.com/blog/${post.slug}`}
        ogImage={post.image_url}
        ogType="article"
        articlePublished={post.published_at}
        author="Phaeton AI Team"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.image_url,
            "datePublished": post.published_at,
            "dateModified": post.published_at,
            "author": {
              "@type": "Organization",
              "name": "Phaeton AI Team"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Phaeton AI",
              "logo": {
                "@type": "ImageObject",
                "url": "https://phaetonai.ca/clients/phaetonai/images/Phaeton-Logo.png"
              }
            },
            "keywords": post.keywords?.join(", "),
            "url": `https://phaetonai.com/blog/${post.slug}`,
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://phaetonai.com/blog/${post.slug}`
            }
          }
        ]}
      />
      {/* Digital technological background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Circuit board pattern */}
        <div className="absolute inset-0 opacity-30">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                {/* Horizontal lines */}
                <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1"/>
                <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                
                {/* Vertical lines */}
                <line x1="20" y1="0" x2="20" y2="100" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1"/>
                <line x1="80" y1="0" x2="80" y2="100" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="1"/>
                
                {/* Circuit nodes */}
                <circle cx="20" cy="20" r="2" fill="rgba(147, 197, 253, 0.6)"/>
                <circle cx="50" cy="50" r="1.5" fill="rgba(59, 130, 246, 0.8)"/>
                <circle cx="80" cy="80" r="2" fill="rgba(147, 197, 253, 0.6)"/>
                <circle cx="80" cy="20" r="1" fill="rgba(59, 130, 246, 0.5)"/>
                <circle cx="20" cy="80" r="1" fill="rgba(59, 130, 246, 0.5)"/>
                
                {/* Small rectangles (chips) */}
                <rect x="18" y="48" width="4" height="4" fill="rgba(59, 130, 246, 0.4)" rx="0.5"/>
                <rect x="78" y="18" width="4" height="4" fill="rgba(59, 130, 246, 0.4)" rx="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)"/>
          </svg>
        </div>

        {/* Digital grid overlay */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}>
        </div>

        {/* Glowing orbs */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-cyan-400/20 rounded-full blur-xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-3/4 w-20 h-20 bg-indigo-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>

        {/* Binary code pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-blue-300 text-xs font-mono transform rotate-12">
            01001000 01100101 01101100 01101100 01101111
          </div>
          <div className="absolute top-32 right-20 text-blue-300 text-xs font-mono transform -rotate-6">
            01000001 01001001 00100000 01010000 01101111
          </div>
          <div className="absolute bottom-20 left-1/3 text-blue-300 text-xs font-mono transform rotate-3">
            01110111 01100101 01110010 01100101 01100100
          </div>
        </div>

        {/* Hexagonal tech pattern */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hexagon" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
                <polygon points="30,2 45,15 45,37 30,50 15,37 15,15" 
                         fill="none" 
                         stroke="rgba(59, 130, 246, 0.3)" 
                         strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hexagon)"/>
          </svg>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Back to Blog - Enhanced Mobile */}
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-300 hover:text-blue-100 font-medium mb-6 sm:mb-8 transition-colors text-sm sm:text-base min-h-[44px] px-2 py-2 rounded-lg hover:bg-white/10"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <article className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-white/20">
            <div className="relative">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full h-48 sm:h-56 md:h-64 lg:h-96 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg';
                }}
              />
              {/* Enhanced mobile overlay with better text contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/40 flex items-end">
                <div className="p-4 sm:p-4 md:p-6 lg:p-8 text-white w-full pb-6 sm:pb-4 md:pb-6 lg:pb-8">
                  {/* Mobile-optimized title with better spacing and visibility */}
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-3 sm:mb-3 md:mb-4 leading-tight">
                    <span className="block text-white" style={{
                      textShadow: '2px 2px 6px rgba(0,0,0,0.95), 0px 0px 12px rgba(0,0,0,0.9)',
                      wordBreak: 'break-word',
                      hyphens: 'auto',
                      overflowWrap: 'break-word',
                      lineHeight: '1.3'
                    }}>
                      {post.title}
                    </span>
                  </h1>
                  
                  {/* Mobile-optimized excerpt */}
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-100 mb-3 sm:mb-4 leading-relaxed">
                    <span className="drop-shadow-xl shadow-black/80" style={{
                      textShadow: '1px 1px 3px rgba(0,0,0,0.9), 0px 0px 6px rgba(0,0,0,0.7)'
                    }}>
                      {post.excerpt}
                    </span>
                  </p>
                  
                  {/* Mobile-optimized meta info - single line layout */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-xs text-gray-200">
                    <div className="flex items-center">
                      <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-white rounded-full flex items-center justify-center mr-1 sm:mr-2 overflow-hidden">
                        <img
                          src="https://phaetonai.ca/clients/phaetonai/images/PhaetonAI-logo.jpg"
                          alt="Phaeton AI"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="drop-shadow-lg whitespace-nowrap" style={{
                        textShadow: '1px 1px 2px rgba(0,0,0,0.9)'
                      }}>Phaeton AI Team</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span className="drop-shadow-lg whitespace-nowrap">{formatDate(post.published_at)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span className="drop-shadow-lg whitespace-nowrap" style={{
                        textShadow: '1px 1px 2px rgba(0,0,0,0.9)'
                      }}>{getReadingTime(post.content)} min read</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="p-4 sm:p-6 md:p-8">
              {/* Keywords - Enhanced Mobile Layout */}
              {post.keywords && post.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                  {post.keywords.map((keyword, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-white/20 text-blue-200 border border-white/30"
                    >
                      <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                      <span className="truncate max-w-[120px] sm:max-w-none">
                        {keyword}
                      </span>
                    </span>
                  ))}
                </div>
              )}

              {/* Share Button - Enhanced Mobile */}
              <div className="flex justify-end mb-4 sm:mb-6">
                <button
                  onClick={sharePost}
                  className="inline-flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-sm sm:text-base min-h-[44px]"
                >
                  <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  Share Article
                </button>
              </div>

              {/* Article Content with Enhanced Mobile Styling */}
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                <style jsx>{`
                  .prose {
                    color: #e2e8f0;
                    line-height: 1.7;
                  }
                  .prose h2 {
                    color: #ffffff;
                    border-bottom: 2px solid rgba(59, 130, 246, 0.3);
                    padding-bottom: 0.5rem;
                    margin-bottom: 1.5rem;
                    font-size: 1.25rem;
                    line-height: 1.4;
                  }
                  .prose h3 {
                    color: #cbd5e1;
                    font-size: 1.125rem;
                    line-height: 1.4;
                  }
                  .prose p {
                    color: #cbd5e1;
                    line-height: 1.8;
                    margin-bottom: 1.25rem;
                  }
                  .prose strong {
                    color: #ffffff;
                  }
                  .prose ul {
                    color: #cbd5e1;
                    margin-bottom: 1.25rem;
                  }
                  .prose li {
                    margin: 0.5rem 0;
                    line-height: 1.6;
                  }
                  .prose a {
                    color: #60a5fa;
                    text-decoration: underline;
                  }
                  .prose a:hover {
                    color: #93c5fd;
                  }
                  .prose blockquote {
                    border-left: 4px solid rgba(59, 130, 246, 0.5);
                    background: rgba(59, 130, 246, 0.1);
                    padding: 1rem;
                    margin: 1.5rem 0;
                    border-radius: 0.5rem;
                  }
                  @media (max-width: 640px) {
                    .prose {
                      font-size: 0.875rem;
                      line-height: 1.6;
                    }
                    .prose h2 {
                      font-size: 1.125rem;
                      margin-top: 1.5rem;
                      margin-bottom: 0.75rem;
                    }
                    .prose h3 {
                      font-size: 1rem;
                      margin-top: 1rem;
                      margin-bottom: 0.5rem;
                    }
                    .prose p {
                      font-size: 0.875rem;
                      line-height: 1.6;
                      margin-bottom: 1rem;
                    }
                    .prose ul, .prose ol {
                      padding-left: 1.25rem;
                    }
                    .prose li {
                      font-size: 0.875rem;
                      line-height: 1.6;
                    }
                  }
                `}</style>
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* Modern Author Bio - Enhanced Mobile */}
              <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/20">
                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
                  {/* Modern Phaeton AI Team Avatar */}
                  <div className="relative flex-shrink-0 self-center sm:self-start">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                      <img
                        src="https://phaetonai.ca/clients/phaetonai/images/PhaetonAI-logo.jpg"
                        alt="Phaeton AI Team"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                        <Sparkles className="w-1.5 h-1.5 sm:w-2 sm:h-2 text-white" />
                      </div>
                    </div>
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-2xl blur-lg opacity-20 -z-10"></div>
                  </div>
                  
                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-white">Phaeton AI Team</h3>
                      <div className="flex items-center justify-center sm:justify-start px-2 py-1 bg-white/20 text-blue-200 rounded-full text-xs font-medium border border-white/30">
                        <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                        AI Experts
                      </div>
                    </div>
                    <p className="text-blue-100 leading-relaxed text-sm sm:text-base mb-3 sm:mb-4">
                      Our team of AI specialists and business consultants collaborate to bring you 
                      cutting-edge insights on artificial intelligence, automation, and digital transformation. 
                      We're passionate about helping businesses harness the power of AI to drive innovation and growth.
                    </p>
                    
                    {/* Team Expertise Tags - Enhanced Mobile */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                      <span className="px-2 sm:px-3 py-1 bg-white/10 text-blue-200 rounded-full text-xs sm:text-sm font-medium border border-white/20">
                        Machine Learning
                      </span>
                      <span className="px-2 sm:px-3 py-1 bg-white/10 text-blue-200 rounded-full text-xs sm:text-sm font-medium border border-white/20">
                        Business Strategy
                      </span>
                      <span className="px-2 sm:px-3 py-1 bg-white/10 text-blue-200 rounded-full text-xs sm:text-sm font-medium border border-white/20">
                        AI Implementation
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Related Posts - Enhanced Mobile Layout */}
          {relatedPosts.length > 0 && (
            <div className="mt-12 sm:mt-16">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8 text-center sm:text-left">Related Articles</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost.id} className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-white/20 group">
                    <img
                      src={relatedPost.image_url}
                      alt={relatedPost.title}
                      className="w-full h-32 sm:h-36 md:h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg';
                      }}
                    />
                    <div className="p-3 sm:p-4">
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-white mb-2 line-clamp-2 leading-tight">
                        <Link 
                          to={`/blog/${relatedPost.slug}`}
                          className="hover:text-blue-300 transition-colors"
                        >
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="text-blue-100 text-xs sm:text-sm mb-2 sm:mb-3 line-clamp-2 leading-relaxed">
                        {relatedPost.excerpt}
                      </p>
                      <div className="text-xs text-blue-200">
                        {formatDate(relatedPost.published_at)}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section - Enhanced Mobile */}
          <div className="mt-12 sm:mt-16 bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center text-white border border-white/20 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-4 border border-white/30">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Ready to Get Started?
              </div>
              
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
                Transform Your Business with AI
              </h3>
              <p className="text-blue-100 mb-4 sm:mb-6 max-w-2xl mx-auto leading-relaxed text-sm sm:text-base px-2">
                Get personalized AI solutions that drive real results. Contact our team for a free consultation and discover how we can help your business thrive.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-white text-blue-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200 text-sm sm:text-base min-h-[44px]"
              >
                Schedule a Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostPage;