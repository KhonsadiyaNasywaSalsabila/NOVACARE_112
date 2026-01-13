import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../assets/NOVACARE5.png'; 

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // --- STATE UI ---
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // --- LOGIKA SCROLL ---
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setIsVisible(false); 
        } else {
          setIsVisible(true);  
        }
        setScrolled(window.scrollY > 20);
        setLastScrollY(window.scrollY);
      }
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // --- LOGIKA IMAGE (HANYA DOKTER YG CUSTOM) ---
  const getProfileImage = () => {
    const defaultDoctor = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
    if (!user || user.role !== 'DOCTOR') return null;

    if (!user.image) return defaultDoctor;
    if (user.image.startsWith('http')) return user.image;
    
    const BACKEND_URL = "http://localhost:3009"; 
    return `${BACKEND_URL}/uploads/doctors/${user.image}`;
  };

  const profileImageSrc = getProfileImage();

  // --- CONFIG MENU NAVIGASI (DIPERBARUI) ---
  let navLinks = [];
  if (!user) {
    navLinks = [{ title: 'Jadwal Dokter', path: '/schedule', type: 'internal' }];
  } else if (user.role === 'DOCTOR') {
    // DOKTER SEKARANG PUNYA 2 MENU
    navLinks = [
      { title: 'API & Developer', path: '/doctor/api-keys', type: 'internal' },
      { title: 'Mitra Apotek', path: '/aplikasi_apotek.html', type: 'external' }
    ];
  } else {
    navLinks = [{ title: 'Mitra Apotek', path: '/aplikasi_apotek.html', type: 'external' }];
  }

  // --- ACTION HANDLERS ---
  const handleLogout = () => {
    if(window.confirm("Yakin ingin keluar?")) {
        logout();
        navigate('/login');
        setIsMobileOpen(false);
    }
  };

  const handleNavClick = (item) => {
      setIsMobileOpen(false); 
      if (item.type === 'external') {
          window.location.href = item.path; 
      } else {
          navigate(item.path);
      }
  };

  const dashboardPath = user?.role === 'DOCTOR' ? '/dashboard-doctor' : '/dashboard-patient';

  return (
    <>
      <style>{`
        .desktop-only { display: flex; }
        .mobile-trigger { display: none; }
        @media (max-width: 900px) {
          .desktop-only { display: none !important; }
          .mobile-trigger { display: block !important; }
        }
        .nav-pill { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
        .mobile-drawer { transform: translateX(100%); transition: transform 0.3s ease; }
        .mobile-drawer.open { transform: translateX(0); }
        .drawer-backdrop { opacity: 0; pointer-events: none; transition: 0.3s; }
        .drawer-backdrop.open { opacity: 1; pointer-events: auto; }
        .logout-btn-icon:hover {
            background-color: #fee2e2;
            box-shadow: 0 0 15px rgba(239, 68, 68, 0.6);
            transform: scale(1.05);
        }
        .dashboard-btn-glow:hover {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
            transform: translateY(-2px);
        }
      `}</style>

      <nav style={{
        ...styles.nav,
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
        background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.05)' : 'none',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        padding: scrolled ? '12px 0' : '24px 0',
      }}>
        <div style={styles.container}>
          
          <div onClick={() => navigate(user ? dashboardPath : '/')} style={{...styles.logoWrapper, cursor:'pointer'}}>
            <img src={logoImg} alt="Logo" style={styles.logoImage} />
          </div>

          <div className="desktop-only" style={styles.centerNav}>
            {navLinks.map((item, index) => (
              <div 
                key={index}
                onClick={() => handleNavClick(item)} 
                className="nav-pill"
                style={{
                  ...styles.navLinkItem,
                  backgroundColor: hoverIndex === index ? '#e0f2fe' : 'transparent',
                  color: hoverIndex === index ? '#0284c7' : '#475569',
                }}
                onMouseEnter={() => setHoverIndex(index)}
                onMouseLeave={() => setHoverIndex(null)}
              >
                {item.title}
              </div>
            ))}
          </div>

          <div className="desktop-only" style={styles.menu}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'right' }}>
                  <div>
                    <div style={{ fontWeight: '800', fontSize: '0.9rem', color: '#1e293b' }}>
                      {user.role === 'DOCTOR' ? `Dr. ${user.username || user.name}` : `${user.username || user.name}`}
                    </div>
                    {user.role === 'DOCTOR' && (
                      <div style={{ fontSize: '0.7rem', color: '#0ea5e9', fontWeight: '700', marginTop: '2px' }}>
                        {user.specialization || "Dokter Umum"}
                      </div>
                    )}
                  </div>

                  {user.role === 'DOCTOR' && (
                    <div style={styles.profileWrapper}>
                      <img 
                        src={profileImageSrc} 
                        alt="Profile" 
                        style={styles.profileImg} 
                        onError={(e) => {e.target.onerror = null; e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"}}
                      />
                    </div>
                  )}
                </div>
                
                <div style={{width:'1px', height:'30px', background:'#e2e8f0'}}></div>

                <button 
                    onClick={() => navigate(dashboardPath)} 
                    className="dashboard-btn-glow"
                    style={styles.btnDashboard}
                >
                    Dashboard
                </button>

                <button 
                    onClick={handleLogout} 
                    className="logout-btn-icon"
                    style={styles.btnLogoutIcon}
                    title="Logout"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                    </svg>
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => navigate('/login')} style={styles.btnLogin}>Masuk</button>
                <button onClick={() => navigate('/register')} style={styles.btnRegister}>Daftar</button>
              </div>
            )}
          </div>

          <button className="mobile-trigger" onClick={() => setIsMobileOpen(true)} style={styles.hamburgerBtn}>
             <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
        </div>
      </nav>

      <div className={`drawer-backdrop ${isMobileOpen ? 'open' : ''}`} style={styles.backdrop} onClick={() => setIsMobileOpen(false)} />
      <div className={`mobile-drawer ${isMobileOpen ? 'open' : ''}`} style={styles.drawerPanel}>
         <div style={styles.drawerHeader}>
            <h3>Menu</h3>
            <button onClick={() => setIsMobileOpen(false)} style={styles.closeBtn}>&times;</button>
         </div>

         <div style={styles.drawerContent}>
            {user && (
                 <div style={{marginBottom:20, padding:15, background:'#f8fafc', borderRadius:12, display:'flex', alignItems:'center', gap:'12px', border:'1px solid #e2e8f0'}}>
                    {user.role === 'DOCTOR' && (
                        <img 
                        src={profileImageSrc} 
                        alt="Profile" 
                        style={{width:45, height:45, borderRadius:'50%', objectFit:'cover', border:'2px solid #0ea5e9'}} 
                        onError={(e) => {e.target.onerror = null; e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"}}
                        />
                    )}
                    <div>
                      <div style={{fontWeight:'800', fontSize:'0.95rem', color:'#1e293b'}}>
                        {user.role === 'DOCTOR' ? `Dr. ${user.username || user.name}` : user.username || user.name}
                      </div>
                      <div style={{fontSize:'0.75rem', color:'#64748b', textTransform:'capitalize'}}>{user.role.toLowerCase()}</div>
                    </div>
                 </div>
            )}
            
            {navLinks.map((item, index) => (
               <div key={index} onClick={() => handleNavClick(item)} style={styles.drawerItem}>
                  {item.title}
               </div>
            ))}
            
            <hr style={{margin:'15px 0', border:'none', borderTop:'1px solid #e2e8f0'}}/>

            {user ? (
                <div style={{display:'flex', gap:'10px', marginTop:10}}>
                  <button onClick={() => {navigate(dashboardPath); setIsMobileOpen(false)}} style={{...styles.btnDashboard, flex:1, textAlign:'center'}}>
                      Dashboard
                  </button>
                  <button onClick={handleLogout} style={{...styles.btnLogoutIcon, width:'auto', padding:'10px 15px', borderRadius:'50px', background:'#fee2e2'}}>
                      🚪 Keluar
                  </button>
                </div>
            ) : (
                <div style={{display:'flex', flexDirection:'column', gap:10}}>
                   <button onClick={() => {navigate('/login'); setIsMobileOpen(false)}} style={styles.btnLogin}>Masuk Akun</button>
                   <button onClick={() => {navigate('/register'); setIsMobileOpen(false)}} style={styles.btnRegister}>Daftar Baru</button>
                </div>
            )}
         </div>
      </div>
    </>
  );
};

const styles = {
    nav: { position: 'sticky', top: 0, zIndex: 1000, height: 'auto', transition: 'all 0.4s ease', borderBottom: '1px solid rgba(0,0,0,0.03)' },
    container: { width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    logoWrapper: { display: 'flex', alignItems: 'center', zIndex: 1001 },
    logoImage: { height: '48px', width: 'auto', objectFit: 'contain' },
    centerNav: { gap: '5px', alignItems: 'center' },
    navLinkItem: { fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer', padding: '8px 16px', borderRadius: '50px' },
    menu: { display: 'flex', alignItems: 'center' },
    profileWrapper: { display: 'flex', alignItems: 'center' },
    profileImg: { width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #e2e8f0', background: '#fff' },
    btnLogin: { backgroundColor: 'transparent', color: '#475569', border: '1px solid #cbd5e1', padding: '9px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem' },
    btnRegister: { background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)', color: 'white', border: 'none', padding: '10px 24px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' },
    btnDashboard: { background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '50px', cursor: 'pointer', fontWeight: '700', fontSize: '0.9rem', boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)', transition: 'all 0.3s ease' },
    btnLogoutIcon: { backgroundColor: '#fff1f2', color: '#ef4444', border: '1px solid #fecdd3', width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' },
    hamburgerBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#1e293b' },
    backdrop: { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 1100 },
    drawerPanel: { position: 'fixed', top: 0, right: 0, bottom: 0, width: '300px', background: 'white', zIndex: 1101, boxShadow: '-10px 0 30px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column' },
    drawerHeader: { padding: '20px 25px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    closeBtn: { background: 'none', border: 'none', fontSize: '2rem', color: '#94a3b8', cursor: 'pointer', lineHeight: 1 },
    drawerContent: { padding: '25px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' },
    drawerItem: { fontSize: '1rem', fontWeight: '600', color: '#334155', padding: '12px 15px', borderRadius: '10px', cursor: 'pointer' }
};

export default Navbar;