import { useState, useEffect, useCallback, useRef } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────
interface LogEntry {
  id: number;
  ip: string;
  city: string;
  state: string;
  country: string;
  device: string;
  model: string;
  browser: string;
  os: string;
  ist_date: string;
  ist_time: string;
}

// ─── Shared styles ────────────────────────────────────────────────────────
const mono: React.CSSProperties = {
  fontFamily: "'Share Tech Mono', 'Space Mono', monospace",
  letterSpacing: '0.04em',
};
const glassCard: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8,
};

const PER_PAGE = 30;

// ─── Dot Cursor (PC/Laptop only) ──────────────────────────────────────────
function AdminCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    setShow(true);
    const move = (e: MouseEvent) => {
      if (dotRef.current)  dotRef.current.style.transform  = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`;
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, []);

  if (!show) return null;
  return (
    <>
      <style>{`* { cursor: none !important; }`}</style>
      <div ref={dotRef} style={{ position:'fixed', top:-3, left:-3, width:6, height:6, background:'#fff', borderRadius:'50%', pointerEvents:'none', zIndex:999999, willChange:'transform' }}/>
      <div ref={ringRef} style={{ position:'fixed', top:-12, left:-12, width:24, height:24, border:'1px solid rgba(255,255,255,0.4)', borderRadius:'50%', pointerEvents:'none', zIndex:999998, transition:'transform 0.08s ease-out', willChange:'transform' }}/>
    </>
  );
}

// ─── CSV Download ─────────────────────────────────────────────────────────
function downloadCSV(logs: LogEntry[]) {
  const headers = ['#','Date (IST)','Time (IST)','IP Address','City','State','Country','Device','Model','Browser','OS'];
  const rows = logs.map(l => [
    l.id, l.ist_date, l.ist_time, l.ip, l.city, l.state, l.country,
    l.device, l.model || '—', l.browser, l.os,
  ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `electropool_visitors_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Pagination Bar ───────────────────────────────────────────────────────
function Pagination({ page, total, onChange }: { page: number; total: number; onChange: (p: number) => void }) {
  if (total <= 1) return null;
  const btnStyle = (active: boolean, disabled = false): React.CSSProperties => ({
    ...mono, fontSize: '0.65rem', padding: '5px 10px', cursor: disabled ? 'not-allowed' : 'pointer',
    background: active ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.04)',
    border: `1px solid ${active ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
    borderRadius: 4, color: disabled ? 'rgba(255,255,255,0.2)' : '#fff',
    opacity: disabled ? 0.5 : 1,
  });

  // Build page list with ellipsis
  const pages: (number | '...')[] = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= page - 1 && i <= page + 1)) pages.push(i);
    else if (pages[pages.length - 1] !== '...') pages.push('...');
  }

  return (
    <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', marginTop: 16 }}>
      <button style={btnStyle(false, page === 1)} onClick={() => page > 1 && onChange(page - 1)} disabled={page === 1}>← PREV</button>
      {pages.map((p, i) =>
        p === '...'
          ? <span key={`e${i}`} style={{ ...mono, fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', padding: '0 4px' }}>...</span>
          : <button key={p} style={btnStyle(p === page)} onClick={() => onChange(p as number)}>{p}</button>
      )}
      <button style={btnStyle(false, page === total)} onClick={() => page < total && onChange(page + 1)} disabled={page === total}>NEXT →</button>
    </div>
  );
}

// ─── Login Screen ─────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res  = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ username, password }) });
      const data = await res.json();
      if (data.ok) { sessionStorage.setItem('ep_token', data.token); onLogin(data.token); }
      else setError('ACCESS DENIED — INVALID CREDENTIALS');
    } catch { setError('SERVER UNREACHABLE'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'#080808', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <AdminCursor />
      <div style={{ position:'fixed', top:16, left:16, ...mono, fontSize:'0.6rem', color:'rgba(255,255,255,0.25)', letterSpacing:'0.15em' }}>
        CAM_01 [REC] &nbsp;|&nbsp; ELECTROPOOL v3.0
      </div>
      <div style={{ position:'fixed', top:16, right:16, ...mono, fontSize:'0.6rem', color:'rgba(255,255,255,0.25)' }}>
        SYS_SECURE // ACCESS_REQUIRED
      </div>

      <div style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ ...mono, fontSize:'2.5rem', fontWeight:700, color:'#fff', letterSpacing:'0.3em', marginBottom:8 }}>AK</div>
          <div style={{ ...mono, fontSize:'0.65rem', color:'rgba(255,255,255,0.35)', letterSpacing:'0.25em' }}>ELECTROPOOL ADMIN TERMINAL</div>
          <div style={{ marginTop:16, width:40, height:1, background:'rgba(255,255,255,0.2)', margin:'16px auto 0' }}/>
        </div>

        <div style={{ ...glassCard, padding:'36px 32px' }}>
          <div style={{ ...mono, fontSize:'0.6rem', color:'rgba(255,255,255,0.3)', letterSpacing:'0.2em', marginBottom:24 }}>ENTER CREDENTIALS TO CONTINUE</div>
          <form onSubmit={handleSubmit}>
            {[['text','USERNAME',username,setUsername],['password','PASSWORD',password,setPassword]].map(([type,label,val,set]) => (
              <div key={label as string} style={{ marginBottom:16 }}>
                <label style={{ ...mono, display:'block', fontSize:'0.58rem', color:'rgba(255,255,255,0.4)', letterSpacing:'0.15em', marginBottom:6 }}>{label as string}</label>
                <input type={type as string} value={val as string} onChange={e => (set as (v:string)=>void)(e.target.value)} autoComplete="off"
                  style={{ width:'100%', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:4, padding:'10px 14px', color:'#fff', ...mono, fontSize:'0.82rem', outline:'none' }}/>
              </div>
            ))}
            {error && (
              <div style={{ ...mono, fontSize:'0.62rem', color:'#ff4444', letterSpacing:'0.12em', marginBottom:16, padding:'8px 12px', background:'rgba(255,68,68,0.08)', border:'1px solid rgba(255,68,68,0.2)', borderRadius:4 }}>
                ⚠ {error}
              </div>
            )}
            <button type="submit" disabled={loading} style={{ width:'100%', padding:'12px', background:loading?'rgba(255,255,255,0.05)':'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.25)', borderRadius:4, color:'#fff', ...mono, fontSize:'0.72rem', letterSpacing:'0.2em', cursor:loading?'not-allowed':'pointer' }}>
              {loading ? 'AUTHENTICATING...' : 'AUTHENTICATE →'}
            </button>
          </form>
        </div>
        <div style={{ textAlign:'center', marginTop:20, ...mono, fontSize:'0.55rem', color:'rgba(255,255,255,0.15)' }}>NO ACCOUNT RECOVERY AVAILABLE</div>
      </div>
    </div>
  );
}

// ─── Dashboard Screen ─────────────────────────────────────────────────────
function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [logs, setLogs]       = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const [deleting, setDeleting] = useState<number | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/logs', { headers:{ Authorization: token } });
      const data = await res.json();
      if (data.ok) setLogs(data.logs);
      else setError('Failed to fetch logs');
    } catch { setError('Server unreachable'); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  // Reset to page 1 when search changes
  useEffect(() => { setPage(1); }, [search]);

  const deleteLog = async (id: number) => {
    setDeleting(id);
    await fetch(`/api/logs/${id}`, { method:'DELETE', headers:{ Authorization: token } });
    setLogs(l => l.filter(x => x.id !== id));
    setDeleting(null);
  };

  const filtered = logs.filter(l =>
    [l.ip, l.city, l.state, l.country, l.browser, l.os, l.device, l.model, l.ist_date].some(
      v => v?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const pageSlice  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const thStyle: React.CSSProperties = { ...mono, fontSize:'0.55rem', color:'rgba(255,255,255,0.4)', letterSpacing:'0.15em', padding:'10px 12px', textAlign:'left', borderBottom:'1px solid rgba(255,255,255,0.08)', whiteSpace:'nowrap' };
  const tdStyle: React.CSSProperties = { ...mono, fontSize:'0.65rem', color:'rgba(255,255,255,0.75)', padding:'10px 12px', borderBottom:'1px solid rgba(255,255,255,0.05)', whiteSpace:'nowrap' };

  return (
    <div style={{ minHeight:'100vh', background:'#080808', paddingBottom:60 }}>
      <AdminCursor />

      {/* Top bar */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 28px', borderBottom:'1px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.02)', flexWrap:'wrap', gap:10 }}>
        <div style={{ ...mono, fontSize:'0.72rem', color:'#fff', letterSpacing:'0.2em' }}>
          ELECTROPOOL &nbsp;<span style={{ color:'rgba(255,255,255,0.3)' }}>//</span>&nbsp; VISITOR LOGS
        </div>
        <div style={{ display:'flex', gap:10, alignItems:'center', flexWrap:'wrap' }}>
          <span style={{ ...mono, fontSize:'0.58rem', color:'rgba(255,255,255,0.3)' }}>{logs.length} TOTAL RECORDS</span>
          <button onClick={fetchLogs} style={{ ...mono, fontSize:'0.58rem', color:'rgba(255,255,255,0.5)', background:'none', border:'1px solid rgba(255,255,255,0.12)', borderRadius:4, padding:'4px 10px', cursor:'pointer' }}>↻ REFRESH</button>
          <button onClick={() => downloadCSV(logs)} style={{ ...mono, fontSize:'0.58rem', color:'rgba(100,220,150,0.8)', background:'none', border:'1px solid rgba(100,220,150,0.2)', borderRadius:4, padding:'4px 10px', cursor:'pointer' }}>⬇ DOWNLOAD CSV</button>
          <button onClick={onLogout} style={{ ...mono, fontSize:'0.58rem', color:'rgba(255,80,80,0.7)', background:'none', border:'1px solid rgba(255,80,80,0.2)', borderRadius:4, padding:'4px 10px', cursor:'pointer' }}>LOGOUT</button>
        </div>
      </div>

      <div style={{ padding:'24px 28px' }}>
        {/* Stats */}
        <div style={{ display:'flex', gap:14, marginBottom:24, flexWrap:'wrap' }}>
          {[
            { label:'TOTAL VISITS',  val: logs.length },
            { label:'UNIQUE IPs',    val: new Set(logs.map(l=>l.ip)).size },
            { label:'COUNTRIES',     val: new Set(logs.map(l=>l.country).filter(c=>c!=='Local')).size },
            { label:'PAGES',         val: totalPages },
          ].map(s => (
            <div key={s.label} style={{ ...glassCard, padding:'14px 20px', minWidth:110 }}>
              <div style={{ ...mono, fontSize:'1.4rem', fontWeight:700, color:'#fff' }}>{s.val}</div>
              <div style={{ ...mono, fontSize:'0.52rem', color:'rgba(255,255,255,0.35)', letterSpacing:'0.15em', marginTop:4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Search + page info */}
        <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:14, flexWrap:'wrap' }}>
          <input placeholder="SEARCH BY IP, CITY, COUNTRY, BROWSER, MODEL..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{ ...mono, fontSize:'0.7rem', width:'100%', maxWidth:420, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:4, padding:'8px 14px', color:'#fff', outline:'none' }}/>
          <span style={{ ...mono, fontSize:'0.58rem', color:'rgba(255,255,255,0.3)' }}>
            SHOWING {Math.min((page-1)*PER_PAGE+1, filtered.length)}–{Math.min(page*PER_PAGE, filtered.length)} OF {filtered.length}
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ ...mono, color:'rgba(255,255,255,0.3)', fontSize:'0.7rem', padding:40 }}>LOADING LOGS...</div>
        ) : error ? (
          <div style={{ ...mono, color:'#ff4444', fontSize:'0.7rem', padding:20 }}>⚠ {error}</div>
        ) : (
          <>
            <div style={{ ...glassCard, overflowX:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr>
                    {['#','DATE','TIME (IST)','IP ADDRESS','CITY','STATE','COUNTRY','DEVICE','MODEL','BROWSER','OS',''].map(h=>(
                      <th key={h} style={thStyle}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pageSlice.length === 0 ? (
                    <tr><td colSpan={12} style={{ ...tdStyle, color:'rgba(255,255,255,0.25)', padding:'40px 12px', textAlign:'center' }}>NO RECORDS FOUND</td></tr>
                  ) : pageSlice.map((log, i) => (
                    <tr key={log.id} style={{ background: i%2===0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                      <td style={{ ...tdStyle, color:'rgba(255,255,255,0.25)' }}>{log.id}</td>
                      <td style={tdStyle}>{log.ist_date}</td>
                      <td style={tdStyle}>{log.ist_time}</td>
                      <td style={{ ...tdStyle, color:'rgba(180,220,255,0.85)' }}>{log.ip}</td>
                      <td style={tdStyle}>{log.city}</td>
                      <td style={tdStyle}>{log.state}</td>
                      <td style={tdStyle}>{log.country}</td>
                      <td style={{ ...tdStyle, color:'rgba(255,255,255,0.5)' }}>{log.device}</td>
                      <td style={{ ...tdStyle, color:'rgba(200,180,255,0.7)' }}>{log.model || '—'}</td>
                      <td style={tdStyle}>{log.browser}</td>
                      <td style={{ ...tdStyle, color:'rgba(255,255,255,0.5)' }}>{log.os}</td>
                      <td style={tdStyle}>
                        <button onClick={()=>deleteLog(log.id)} disabled={deleting===log.id}
                          style={{ ...mono, fontSize:'0.55rem', color:'rgba(255,80,80,0.6)', background:'none', border:'1px solid rgba(255,80,80,0.15)', borderRadius:3, padding:'3px 8px', cursor:'pointer' }}>
                          {deleting===log.id ? '...' : 'DEL'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <Pagination page={page} total={totalPages} onChange={setPage} />

            <div style={{ ...mono, fontSize:'0.55rem', color:'rgba(255,255,255,0.2)', marginTop:10 }}>
              PAGE {page} OF {totalPages} &nbsp;·&nbsp; {PER_PAGE} RECORDS PER PAGE
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('ep_token'));
  const handleLogout = () => { sessionStorage.removeItem('ep_token'); setToken(null); };
  if (!token) return <LoginScreen onLogin={setToken} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}
