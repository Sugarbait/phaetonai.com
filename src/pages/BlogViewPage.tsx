import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Eye, EyeOff, Calendar, User, Tag, RefreshCw, Share2 } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import { supabase } from '../lib/supabase';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  image_url: string;
  keywords: string[];
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

const BlogViewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is authenticated for admin access
  useEffect(() => {
    // Check admin authentication
    const authStatus = sessionStorage.getItem('admin_auth');
    if (authStatus !== 'true') {
      // If not logged in, redirect to admin login page
      navigate('/admin/blog');
      return;
    }

    if (id) {
      loadPost(id);
    }
  }, [id, navigate]);

  const loadPost = async (postId: string) => {
    try {
      // Use admin function to get post (bypasses RLS)
      const response = await fetch('https://cpkslvmydfdevdftieck.supabase.co/functions/v1/admin-get-posts', {
        headers: {
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwa3Nsdm15ZGZkZXZkZnRpZWNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY5MDAyOTUsImV4cCI6MjA2MjQ3NjI5NX0.IfkIVsp3AtLOyXDW9hq9bEvnozd9IaaUay244iDhWGE`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }

      // Find the specific post by ID
      const foundPost = result.posts.find((p: BlogPost) => p.id === postId);
      if (!foundPost) {
        throw new Error('Post not found');
      }
      
      setPost(foundPost);
    } catch (error) {
      console.error('Error loading post:', error);
      toast.error('Failed to load blog post');
      navigate('/admin/blog');
    } finally {
      setLoading(false);
    }
  };

  const togglePublishStatus = async () => {
    if (!post) return;

    try {
      const newStatus = !post.published_at;
      const response = await fetch(`${supabaseUrl}/functions/v1/update-blog-post-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseKey}`,
        },
        body: JSON.stringify({
          postId: post.id,
          published: newStatus
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update post status');
      }

      const result = await response.json();
      toast.success(result.message);
      
      // Update local state
      setPost(prev => prev ? { ...prev, published_at: newStatus ? new Date().toISOString() : null } : null);
    } catch (error) {
      console.error('Error updating post status:', error);
      toast.error('Failed to update post status');
    }
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
      toast.success('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-blue-600 mx-auto mb-3 sm:mb-4" />
              <p className="text-gray-600 text-sm sm:text-base">Loading blog post...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-16 min-h-screen bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <button
              onClick={() => navigate('/admin/blog')}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Blog Admin
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 sm:pt-20 md:pt-24 pb-8 sm:pb-12 md:pb-16 min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <div className="flex-1">
              <button
                onClick={() => navigate('/admin/blog')}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium mb-3 sm:mb-4 text-sm sm:text-base"
              >
                <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Back to Blog Admin
              </button>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">View Blog Post</h1>
              
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                <span className="flex items-center">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Created: {formatDate(post.created_at)}
                </span>
                {post.updated_at !== post.created_at && (
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Updated: {formatDate(post.updated_at)}
                  </span>
                )}
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  post.published_at
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {post.published_at ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {post.published_at && (
                <Link
                  to={`/blog/${post.slug}`}
                  target="_blank"
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center text-sm sm:text-base"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Live
                </Link>
              )}
              
              <button
                onClick={sharePost}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
              
              <button
                onClick={togglePublishStatus}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center text-sm sm:text-base ${
                  post.published_at
                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {post.published_at ? (
                  <>
                    <EyeOff className="w-4 h-4 mr-2" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Publish
                  </>
                )}
              </button>
              
              <button
                onClick={() => navigate(`/admin/blog/edit/${post.id}`)}
                className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center text-sm sm:text-base"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Post
              </button>
            </div>
          </div>

          {/* Post Preview */}
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Featured Image */}
            {post.image_url && (
              <div className="relative">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-48 sm:h-56 md:h-64 lg:h-96 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg';
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
                  <div className="p-4 sm:p-6 md:p-8 text-white w-full">
                    <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight">{post.title}</h1>
                    {post.excerpt && (
                      <p className="text-sm sm:text-base md:text-lg text-blue-100 mb-3 sm:mb-4 leading-relaxed">{post.excerpt}</p>
                    )}
                    
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-white rounded-full flex items-center justify-center mr-2 p-1">
                          <User className="w-full h-full text-blue-600" />
                        </div>
                        Phaeton AI Team
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                      </div>
                      <div className="flex items-center">
                        <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                        {getReadingTime(post.content)} min read
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 sm:p-6 md:p-8">
              {/* Title (if no image) */}
              {!post.image_url && (
                <div className="mb-6">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
                  {post.excerpt && (
                    <p className="text-lg text-gray-600 mb-4">{post.excerpt}</p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-gray-500 pb-4 border-b border-gray-200">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Phaeton AI Team
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      {post.published_at ? formatDate(post.published_at) : formatDate(post.created_at)}
                    </div>
                    <div className="flex items-center">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      {getReadingTime(post.content)} min read
                    </div>
                  </div>
                </div>
              )}

              {/* Keywords */}
              {post.keywords && post.keywords.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Keywords:</h4>
                  <div className="flex flex-wrap gap-2">
                    {post.keywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium bg-blue-100 text-blue-800 rounded-full"
                      >
                        <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" />
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* Post Meta */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
                  <div className="text-sm text-gray-500">
                    <p>Post ID: {post.id}</p>
                    <p>Slug: {post.slug}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>Word count: ~{post.content.split(' ').length} words</p>
                    <p>Reading time: ~{getReadingTime(post.content)} minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BlogViewPage;