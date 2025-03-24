import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary text-white mt-auto">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="col-span-1 md:col-span-5">
            <Link href="/" className="text-xl font-bold text-white">
              Candidates.RHG
            </Link>
            <p className="text-sm text-white/80 mt-4 max-w-md leading-relaxed">
              We specialize in connecting top talent with leading organizations. Our platform helps streamline your recruitment process from start to finish.
            </p>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-semibold mb-5 text-base">Quick Links</h3>
            <nav className="flex flex-col gap-3">
              <Link 
                href="/" 
                className="text-sm text-white/70 hover:text-white hover:underline transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/candidates" 
                className="text-sm text-white/70 hover:text-white hover:underline transition-colors"
              >
                Candidates
              </Link>
            </nav>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white font-semibold mb-5 text-base">Company</h3>
            <nav className="flex flex-col gap-3">
              <Link 
                href="/about" 
                className="text-sm text-white/70 hover:text-white hover:underline transition-colors"
              >
                About
              </Link>
              <Link 
                href="/careers" 
                className="text-sm text-white/70 hover:text-white hover:underline transition-colors"
              >
                Careers
              </Link>
              <Link 
                href="/contact" 
                className="text-sm text-white/70 hover:text-white hover:underline transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>
          
          <div className="col-span-1 md:col-span-3">
            <h3 className="text-white font-semibold mb-5 text-base">Subscribe to Our Newsletter</h3>
            <div className="flex max-w-xs">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 rounded-l-md border-0 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-white"
              />
              <button 
                className="rounded-r-md bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-dark transition-colors"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Footer bottom */}
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-white/70 mb-4 md:mb-0">
            &copy; {currentYear} CandidateTracker. All Rights Reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-white/70 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-white/70 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <div className="flex gap-4 ml-4">
              <a href="#" aria-label="LinkedIn" className="text-white/70 hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 