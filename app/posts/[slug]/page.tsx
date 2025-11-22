import { getPostData, getSortedPostsData } from '@/lib/posts';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export async function generateStaticParams() {
    const posts = getSortedPostsData();
    return posts.map((post) => ({
        slug: post.id,
    }));
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const postData = getPostData(slug);

    return (
        <article className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/" className="text-gray-400 hover:text-primary transition-colors mb-4 inline-block">
                    &larr; Back to Home
                </Link>
                <div className="relative h-[400px] w-full rounded-2xl overflow-hidden mb-8 border border-white/10">
                    <img
                        src={postData.image}
                        alt={postData.title}
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                            {postData.title}
                        </h1>
                        <div className="flex items-center text-gray-400 space-x-4">
                            <span>{new Date(postData.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span>{postData.source}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none prose-a:text-primary prose-headings:text-white prose-strong:text-white">
                <ReactMarkdown>{postData.content || ''}</ReactMarkdown>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-gray-400 text-sm">
                    Original Article: <a href={postData.originalLink} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{postData.originalLink}</a>
                </p>
            </div>
        </article>
    );
}
