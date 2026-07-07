import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-[#103334]/85 backdrop-blur-md pt-20 pb-8 text-[#A79E9C] text-xs">


      <div className="mx-auto max-w-[98%] px-4 sm:px-6 lg:px-8 relative">
        {/* Viewfinder crosshairs at the bounds */}
        <div className="absolute top-0 left-4 w-2.5 h-2.5 border-t border-l border-[#3D4D55]/30 pointer-events-none" />
        <div className="absolute top-0 right-4 w-2.5 h-2.5 border-t border-r border-[#3D4D55]/30 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-2.5 h-2.5 border-b border-l border-[#3D4D55]/30 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-2.5 h-2.5 border-b border-r border-[#3D4D55]/30 pointer-events-none" />

        {/* Cinema Thought (Skeuomorphic Clapperboard quote box) */}
        <div className="max-w-xl mx-auto mb-16 relative">
          {/* Clapper Board Wrapper */}
          <div className="bg-[#0f1415] border border-[#3D4D55]/40 rounded-xl overflow-hidden shadow-2xl">
            {/* Clapper Top Board (Striped pattern) */}
            <div className="h-5 bg-[repeating-linear-gradient(45deg,#0a0e0f,#0a0e0f_12px,#d4a87c_12px,#d4a87c_24px)] border-b border-[#3D4D55]/40" />
            
            {/* Clapper Info Grid */}
            <div className="grid grid-cols-3 border-b border-[#3D4D55]/30 text-[8px] font-mono tracking-widest text-[#B58863]/80 uppercase divide-x divide-[#3D4D55]/30 select-none text-center">
              <div className="py-2.5 px-3">
                <span className="text-[6px] text-slate-500 block mb-0.5">PROD.</span>
                <span>CINETRACK // REEL_01</span>
              </div>
              <div className="py-2.5 px-3">
                <span className="text-[6px] text-slate-500 block mb-0.5">SCENE</span>
                <span>SCENE 01</span>
              </div>
              <div className="py-2.5 px-3">
                <span className="text-[6px] text-slate-500 block mb-0.5">TAKE</span>
                <span>TK-24FPS</span>
              </div>
            </div>

            {/* Clapper Center Quote */}
            <div className="p-8 text-center bg-[#0a0e0f]/50">
              <p className="italic text-[#D3C3B9] leading-relaxed font-serif text-sm md:text-base">
                &quot;Cinema is a matter of what&apos;s in the frame and what&apos;s out.&quot;
              </p>
              <cite className="block text-[9px] font-mono font-bold tracking-[0.2em] text-[#B58863] mt-4 uppercase not-italic">
                DIR // Martin Scorsese
              </cite>
            </div>
          </div>
          
          {/* Subtle clapper joint hinge pin details */}
          <div className="w-1.5 h-3.5 bg-slate-600 rounded-sm absolute -top-1 left-4 border border-slate-500 shadow-sm pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Logo & Info */}
          <div className="space-y-4">
            <Link
              href="/"
              className="text-lg font-black tracking-widest bg-gradient-to-r from-[#B58863] via-[#d4a87c] to-[#D3C3B9] bg-clip-text text-transparent hover:opacity-90 transition-opacity"
            >
              CINETRACK
            </Link>
            <p className="text-[#A79E9C] leading-relaxed max-w-xs">
              Log your watches, write reviews, and build custom lists. Your ultimate movie and TV series tracker.
            </p>
            {/* Social Links */}
            <div className="flex gap-4">
              <a href="#" className="text-[#3D4D55] hover:text-[#B58863] transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a href="#" className="text-[#3D4D55] hover:text-[#B58863] transition-colors" aria-label="GitHub">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.164 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a href="#" className="text-[#3D4D55] hover:text-[#B58863] transition-colors" aria-label="Letterboxd">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D3C3B9]">Explore</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/movies" className="hover:text-[#D3C3B9] hover:pl-1 transition-all duration-200">
                  Trending Movies
                </Link>
              </li>
              <li>
                <Link href="/tv" className="hover:text-[#D3C3B9] hover:pl-1 transition-all duration-200">
                  Trending TV Shows
                </Link>
              </li>
              <li>
                <Link href="/search" className="hover:text-[#D3C3B9] hover:pl-1 transition-all duration-200">
                  Search Catalog
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-[#D3C3B9] hover:pl-1 transition-all duration-200">
                  Personal Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* TMDb Attribution */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D3C3B9]">Data Source</h4>
            <div className="flex flex-col gap-3">
              <p className="text-[#A79E9C] leading-relaxed">
                Metadata and images are powered by the TMDb API. This application is not officially endorsed or certified by TMDb.
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black tracking-widest text-[#B58863] border border-[#B58863]/20 px-2 py-0.5 rounded bg-[#B58863]/5">
                  TMDb API
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="border-t border-[#3D4D55]/30 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[#3D4D55]">
          <p>&copy; {new Date().getFullYear()} Cinetrack. Created as your ultimate movie portfolio.</p>
          <div className="flex gap-6 text-[11px]">
            <a href="#" className="hover:text-[#A79E9C] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#A79E9C] transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
