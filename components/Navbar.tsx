import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold neon-text text-primary tracking-tighter">
                            GAME<span className="text-white">PULSE</span>
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link href="/" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Latest News
                            </Link>
                            <Link href="/about" className="text-gray-300 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                About
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
