export default function Footer() {
    return (
        <footer className="bg-surface border-t border-white/5 mt-20">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} GamePulse. Automated Gaming News.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-primary">
                            GitHub
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
