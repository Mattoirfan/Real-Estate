import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, Tag, Bookmark } from 'lucide-react';
import { BlogPost } from '../types';
import { api } from '../services/api';

interface BlogPageProps {
  onNavigate: (path: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onNavigate }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlog() {
      try {
        const data = await api.getBlogPosts();
        setPosts(data);
      } catch (e) {
        console.warn('Failed to load blog posts', e);
      } finally {
        setLoading(false);
      }
    }
    loadBlog();
  }, []);

  const categories = ['all', 'Architecture & Design', 'Market Intelligence', 'Private Advisory'];

  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  const featured = posts[0];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24 pb-24">
      
      {/* Header */}
      <div className="bg-[#0B132B] text-white py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <span className="text-[#C6A76A] text-xs font-semibold uppercase tracking-[0.24em] block mb-2">
            Editorial Perspectives
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-['Manrope'] tracking-tight">
            Architectural Insights & Market Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-4 leading-relaxed">
            Curated analysis on global trophy property allocations, historic restorations, and biophilic design trends.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        
        {/* Categories Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`py-2 px-4 rounded-lg font-medium transition-colors capitalize ${
                activeCategory === cat
                  ? 'bg-[#0B132B] text-white'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Perspectives' : cat}
            </button>
          ))}
        </div>

        {/* Featured Article Card */}
        {featured && activeCategory === 'all' && (
          <div 
            onClick={() => onNavigate(`/blog/${featured.slug}`)}
            className="group bg-white rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-xl transition-all grid grid-cols-1 lg:grid-cols-12"
          >
            <div className="lg:col-span-7 aspect-16/9 lg:aspect-auto overflow-hidden bg-slate-900">
              <img
                src={featured.cover_image}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="lg:col-span-5 p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                  <span className="font-bold text-[#B8934A] uppercase tracking-wider">{featured.category}</span>
                  <span>·</span>
                  <span>{featured.read_time}</span>
                </div>
                <h2 className="text-2xl font-bold font-['Manrope'] text-slate-900 group-hover:text-[#B8934A] transition-colors leading-tight mb-3">
                  {featured.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3 mb-6">
                  {featured.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <img
                    src={featured.author.avatar}
                    alt={featured.author.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{featured.author.name}</div>
                    <div className="text-[10px] text-slate-500">{featured.author.role}</div>
                  </div>
                </div>

                <span className="text-xs font-semibold text-[#0B132B] group-hover:text-[#B8934A] flex items-center gap-1">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPosts.map(post => (
            <div
              key={post.id}
              onClick={() => onNavigate(`/blog/${post.slug}`)}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="aspect-16/9 overflow-hidden bg-slate-100">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-bold text-[#B8934A]">{post.category}</span>
                    <span>·</span>
                    <span>{post.read_time}</span>
                  </div>
                  <h3 className="text-base font-bold font-['Manrope'] text-slate-900 group-hover:text-[#B8934A] transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-50 flex items-center justify-between text-xs text-slate-500">
                <span className="font-mono text-[11px]">{new Date(post.published_at).toLocaleDateString()}</span>
                <span className="font-semibold text-[#0B132B] group-hover:text-[#B8934A] flex items-center gap-1">
                  <span>Explore</span>
                  <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
