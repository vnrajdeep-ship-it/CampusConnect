import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Search, PlusCircle, UserCircle, LogOut, PackageSearch, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
export default function Layout() {
  const { user, logout } = useAuth(); const navigate = useNavigate();
  const signOut = () => { logout(); navigate('/'); };
  return <><header className="topbar"><Link to="/" className="brand"><span className="brand-mark"><PackageSearch size={21}/></span>Campus<span>Connect</span></Link><nav><NavLink to="/#browse">Explore</NavLink>{user && <NavLink to="/my-listings">My listings</NavLink>}{user?.role === 'admin' && <NavLink to="/admin"><ShieldCheck size={15}/> Admin</NavLink>}</nav><div className="nav-actions">{user ? <><span className="welcome">Hi, {user.name.split(' ')[0]}</span><button className="icon-button" title="Log out" onClick={signOut}><LogOut size={18}/></button><Link className="button button-primary small" to="/report"><PlusCircle size={16}/> Report item</Link></> : <><Link className="login-link" to="/login">Log in</Link><Link className="button button-primary small" to="/register">Get started</Link></>}</div></header><main><Outlet/></main><footer><div className="footer-inner"><Link to="/" className="brand"><span className="brand-mark"><PackageSearch size={18}/></span>Campus<span>Connect</span></Link><p>Helping campus belongings find their way home.</p><small>Built as a MERN stack academic project.</small></div></footer></>;
}
