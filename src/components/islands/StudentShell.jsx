import { BRAND } from '@/lib/firebase';
import { Link, useLocation } from 'react-router-dom';
import { Compass, BookOpen } from 'lucide-react';
import './islands.css';

// Stable wrapper: it never keys/remounts pages on data refresh and has no persistence.
export default function StudentShell({ children }) {
  const { pathname } = useLocation();
  if (BRAND !== 'tiffany') return children;
  const home = pathname === '/' || pathname.toLowerCase() === '/home';
  return <div className="xt-student-shell">
    {!home && <header className="xt-shell-bar"><Link to="/"><Compass size={17}/> 回到群島</Link><span>小 T 財商群島 · 每一步，都是成長</span><nav aria-label="群島導航"><Link to="/arena">冒險學院</Link><Link to="/Passport"><BookOpen size={14}/> 護照</Link></nav></header>}
    <div className="xt-student-content">{children}</div>
  </div>;
}
