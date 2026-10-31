import React, { useState, useEffect } from 'react';
import { ChevronLeft, Clock, Share2, Tag, ArrowRight } from 'lucide-react';
import { BlogPost } from '../types';
import { api } from '../services/api';

interface BlogPostPageProps {
  slug: string;
  onNavigate: (path: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onNavigate }) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [related, setRelated] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      setLoading(true);
      try {
        const [single, all] = await Promise.all([
          api.getBlogPostBySlug(slug),
          api.getBlogPosts()
        ]);
        setPost(single);
        setRelated(all.filter(p => p.slug !== slug).slice(0, 2));
      } catch (err) {
        console.error('Failed to load blog post', err);
      } finally {
        setLoading(false);
      }
    }
    loadPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] pt-32 pb-20 max-w-4xl mx-auto px-4">
        <div className="h-64 bg-slate-200 rounded-xl animate-pulse mb-6" />
        <div className="h-8 bg-slate-200 rounded max-w-md animate-pulse" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] pt-36 pb-20 text-center px-4">
        <h2 className="text-xl font-bold font-['Manrope']">Article Not Found</h2>
        <button
          onClick={() => onNavigate('/blog')}
          className="mt-4 px-4 py-2 bg-[#0B132B] text-white text-xs font-semibold rounded-lg"
        >
          Return to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-24">
      
      {/* Top Breadcrumb */}
      <div className="bg-white border-b border-slate-200 py-3">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center justify-between text-xs text-slate-500">
          <button
            onClick={() => onNavigate('/blog')}
            className="flex items-center gap-1 hover:text-slate-900 font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Insights</span>
          </button>
          <span>{post.category}</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 mt-10">
        
        {/* Article Header */}
        <div className="space-y-4 mb-8 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-slate-500">
            <span className="font-bold text-[#B8934A] uppercase tracking-wider">{post.category}</span>
            <span>·</span>
            <span>{post.read_time}</span>
            <span>·</span>
            <span className="font-mono">{new Date(post.published_at).toLocaleDateString()}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-['Manrope'] text-slate-900 leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900">{post.author.name}</div>
              <div className="text-[11px] text-slate-500">{post.author.role}</div>
            </div>
          </div>
        </div>

        {/* Feature Cover Image */}
        <div className="aspect-16/9 rounded-2xl overflow-hidden shadow-lg mb-10 bg-slate-900">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-200 shadow-xs space-y-6 text-sm text-slate-700 leading-relaxed">
          <p className="text-base font-medium text-slate-900 leading-relaxed border-l-2 border-[#C6A76A] pl-4 italic">
            {post.excerpt}
          </p>

          <div className="space-y-4 whitespace-pre-line text-xs sm:text-sm text-slate-700 leading-loose">
            {post.content}
          </div>

          {/* Tags */}
          <div className="pt-8 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <Tag className="w-4 h-4 text-[#C6A76A]" />
            {post.tags.map(t => (
              <span key={t} className="text-xs text-slate-500">
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Related Articles */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-slate-200 pt-10">
            <h3 className="text-lg font-bold font-['Manrope'] text-slate-900 mb-6">
              Related Perspectives
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {related.map(r => (
                <div
                  key={r.id}
                  onClick={() => onNavigate(`/blog/${r.slug}`)}
                  className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="text-[11px] font-bold text-[#B8934A] uppercase">{r.category}</div>
                  <h4 className="text-sm font-bold font-['Manrope'] text-slate-900 mt-1 line-clamp-2">{r.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">{r.excerpt}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </article>
    </div>
  );
};
