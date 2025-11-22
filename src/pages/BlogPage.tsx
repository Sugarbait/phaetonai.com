import React, { useEffect, useState } from 'react';
import { Calendar, Clock, User, ArrowRight, Tag, Sparkles, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
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

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedKeyword, setSelectedKeyword] = useState('');
  const [allKeywords, setAllKeywords] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false });

      if (error) throw error;

      setPosts(data || []);
      
      // Extract all unique keywords
      const keywords = new Set<string>();
      data?.forEach(post => {
        post.keywords?.forEach((keyword: string) => keywords.add(keyword));
      });
      setAllKeywords(Array.from(keywords));
    } catch (error) {
      console.error('Error loading blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesKeyword = !selectedKeyword || post.keywords?.includes(selectedKeyword);
    return matchesKeyword;
  });

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

  const handlePostClick = (slug: string) => {
    navigate(`/blog/${slug}`);
  };

  if (loading && posts.length === 0) {
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
            <div className="animate-pulse">
              <div className="h-8 sm:h-10 md:h-12 bg-white/20 rounded mb-3 sm:mb-4"></div>
              <div className="h-4 sm:h-5 md:h-6 bg-white/10 rounded mb-6 sm:mb-8"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg p-4 sm:p-6 border border-white/20">
                    <div className="h-32 sm:h-40 md:h-48 bg-white/10 rounded-lg mb-3 sm:mb-4"></div>
                    <div className="h-4 sm:h-5 md:h-6 bg-white/20 rounded mb-2"></div>
                    <div className="h-3 sm:h-4 bg-white/10 rounded mb-3 sm:mb-4"></div>
                    <div className="h-3 sm:h-4 bg-white/10 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-16 min-h-screen relative overflow-hidden">
      <SEOHead 
        title="Phaeton AI Blog | AI Insights & Business Intelligence"
        description="Discover the latest insights, trends, and practical advice on artificial intelligence, business automation, and digital transformation. Expert AI content from Phaeton AI's team."
        keywords={[
          "AI blog",
          "artificial intelligence insights",
          "business automation trends",
          "machine learning articles",
          "AI implementation guides",
          "chatbot development tips",
          "voice assistant technology",
          "AI transformation strategies",
          "intelligent automation",
          "AI consulting insights"
        ]}
        canonical="https://phaetonai.com/blog"
        schema={[
          {
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Phaeton AI Blog",
            "description": "Expert insights on artificial intelligence, business automation, and digital transformation.",
            "url": "https://phaetonai.com/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Phaeton AI"
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

      {/* Modern Hero Section */}
      <div className="relative overflow-hidden">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center py-8 sm:py-12 md:py-16">
              <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100/20 backdrop-blur-sm text-blue-200 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 border border-blue-400/30">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                AI Insights & Business Intelligence
              </div>
              
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 sm:mb-6">
                <span className="bg-gradient-to-r from-white via-blue-200 to-blue-100 bg-clip-text text-transparent">
                  Phaeton AI Blog
                </span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl text-blue-100 max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4">
                Discover the latest insights, trends, and practical advice on artificial intelligence, 
                business automation, and digital transformation that drive real results.
              </p>

              {/* Stats */}
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 text-xs sm:text-sm text-blue-200">
                <div className="flex items-center">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-blue-400" />
                  <span>{posts.length} Articles</span>
                </div>
                <div className="flex items-center">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-purple-400" />
                  <span>Expert Insights</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-indigo-400" />
                  <span>Weekly Updates</span>
                </div>
              </div>
            </div>

            {/* Keywords Filter - Enhanced Mobile Layout */}
            {allKeywords.length > 0 && (
              <div className="mb-8 sm:mb-12 px-2">
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                  <button
                    onClick={() => setSelectedKeyword('')}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 min-h-[36px] sm:min-h-[40px] ${
                      !selectedKeyword
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                        : 'bg-white/10 backdrop-blur-sm text-blue-100 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    All Topics
                  </button>
                  {allKeywords.slice(0, window.innerWidth < 640 ? 6 : 8).map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => setSelectedKeyword(keyword)}
                      className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 min-h-[36px] sm:min-h-[40px] ${
                        selectedKeyword === keyword
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                          : 'bg-white/10 backdrop-blur-sm text-blue-100 hover:bg-white/20 border border-white/20'
                      }`}
                    >
                      <span className="block truncate max-w-[120px] sm:max-w-none">
                        {keyword}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Blog Posts Grid - Enhanced Mobile Layout */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-2">
                {filteredPosts.map((post) => (
                  <article 
                    key={post.id} 
                    className="bg-white/10 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 cursor-pointer relative group overflow-hidden"
                    onClick={() => handlePostClick(post.slug)}
                  >
                    {/* Subtle glow effect */}
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-blue-400/10 blur-sm"></div>
                    </div>

                    <div className="relative z-10">
                      <div className="relative overflow-hidden rounded-t-xl">
                        <img
                          src={post.image_url}
                          alt={post.title}
                          className="w-full h-40 sm:h-44 md:h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg';
                          }}
                        />
                        <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                          <span className="bg-white/90 backdrop-blur-sm text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm">
                            AI & Business
                          </span>
                        </div>
                        
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>

                      <div className="p-4 sm:p-5 md:p-6">
                        <h2 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white mb-2 sm:mb-3 line-clamp-3 group-hover:text-blue-300 transition-colors leading-tight mobile-title" style={{
                          wordBreak: 'break-word',
                          hyphens: 'auto',
                          overflowWrap: 'break-word'
                        }}>
                          {post.title}
                        </h2>

                        <p className="text-blue-100 mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed text-xs sm:text-sm md:text-base">
                          {post.excerpt}
                        </p>

                        {/* Keywords - Mobile Optimized */}
                        {post.keywords && post.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                            {post.keywords.slice(0, window.innerWidth < 640 ? 2 : 3).map((keyword, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-0.5 sm:py-1 rounded-md text-xs font-medium bg-white/10 text-blue-200 border border-white/20"
                              >
                                <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                                <span className="truncate max-w-[80px] sm:max-w-none">
                                  {keyword}
                                </span>
                              </span>
                            ))}
                            {post.keywords.length > (window.innerWidth < 640 ? 2 : 3) && (
                              <span className="text-xs text-blue-200 self-center">
                                +{post.keywords.length - (window.innerWidth < 640 ? 2 : 3)}
                              </span>
                            )}
                          </div>
                        )}

                        {/* Meta Info - Enhanced Mobile Layout */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-blue-200 mb-3 sm:mb-4 gap-1 sm:gap-2">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              <span className="truncate text-xs">{formatDate(post.published_at)}</span>
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              <span className="text-xs">{getReadingTime(post.content)} min read</span>
                            </div>
                          </div>
                        </div>

                        <div className="inline-flex items-center text-blue-300 hover:text-blue-100 font-medium transition-colors group-hover:translate-x-1 transform duration-200 text-xs sm:text-sm">
                          Read More
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16 px-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 border border-white/20">
                  <User className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-300" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No articles found</h3>
                <p className="text-blue-100 max-w-md mx-auto text-sm sm:text-base">
                  {selectedKeyword
                    ? 'Try selecting a different topic filter to discover more content'
                    : 'Check back soon for new AI insights and business tips that will help transform your operations!'}
                </p>
              </div>
            )}

            {/* Ready to Get Started CTA - Enhanced Mobile Layout */}
            <div className="mt-12 sm:mt-16 md:mt-20 bg-white/10 backdrop-blur-sm rounded-2xl p-6 sm:p-8 text-center text-white relative overflow-hidden border border-white/20 mx-2">
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
    </div>
  );
};

export default BlogPage;