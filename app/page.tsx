import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function Home() {
  const allPosts = getSortedPostsData();
  const featuredPost = allPosts[0];
  const recentPosts = allPosts.slice(1);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      {featuredPost && (
        <Link href={`/posts/${featuredPost.id}`} className="block">
          <section className="relative group cursor-pointer">
            <div className="relative h-[500px] w-full overflow-hidden rounded-2xl border border-white/10 neon-border transition-all duration-300 hover:scale-[1.01]">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8 md:p-12">
                <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-wider text-black uppercase bg-primary rounded-full">
                  Featured
                </span>
                <h1 className="max-w-3xl mb-4 text-4xl font-bold text-white md:text-6xl leading-tight">
                  {featuredPost.title}
                </h1>
                <p className="max-w-2xl mb-6 text-lg text-gray-300">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center text-sm text-gray-400">
                  <span>{new Date(featuredPost.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </section>
        </Link>
      )}

      {/* Recent Posts Grid */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center gap-2">
            <span className="w-2 h-8 bg-secondary rounded-sm"></span>
            Latest News
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recentPosts.map((post) => (
            <Link href={`/posts/${post.id}`} key={post.id} className="block h-full">
              <article className="group relative flex flex-col h-full bg-surface rounded-xl overflow-hidden border border-white/5 hover:border-secondary/50 transition-colors duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex flex-col flex-grow p-6">
                  <div className="mb-4 text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString()}
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-white group-hover:text-secondary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-400 line-clamp-3 flex-grow">
                    {post.excerpt}
                  </p>
                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-sm text-gray-500">Read more</span>
                    <span className="text-secondary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0">
                      &rarr;
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
