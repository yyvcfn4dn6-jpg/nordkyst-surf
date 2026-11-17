/* Peniche Surf — app logic (sibling of Nordkyst Surf) */
"use strict";
const K = window.PSM;

/* ============================ SPOTS ============================ */
/* facing = direction the beach looks out to sea (wind from here = onshore)
   bestSwell/swellHalf = swell window centre / half-width at ~8 s (widens with period)
   exposure = share of the open-ocean swell that reaches the spot (shelter)
   maxHold = size above which the spot closes out / gets dangerous             */
const SPOTS = [
 {id:"supertubos", name:"Supertubos", area:"Peniche south · Praia do Medão", lat:39.3445, lon:-9.3640,
  facing:235, bestSwell:260, swellHalf:55, exposure:1.0, minWave:0.6, maxHold:2.6, tide:"mid-high", driveKm:3, driveMin:7,
  bottom:"Sand over a steep, shifting bank", level:"Intermediate when small · advanced above head high",
  swellNeed:"W–SW–NW groundswell 0.8–2.5 m at 10 s+; picks up almost everything",
  idealWind:"NE–E offshore; N is side-off (the summer 'nortada' is OK here)", tideTxt:"Mid to high; low tide gets hollow and dumpy",
  desc:"The 'European Pipeline'. A south-west-facing beach on the south side of the peninsula, open to every W and SW swell. Small days are fun, fast peaks; above head high it turns into a heavy, shallow barrel that closes out – the first beach to become too much for you when a big swell arrives.",
  hazards:"Heavy shore-break, strong rips when big, crowded at the peak.", parking:"Supertubos car park (Av. do Mar)"},
 {id:"molhe", name:"Molhe Leste", area:"Peniche south · harbour wall", lat:39.3520, lon:-9.3725,
  facing:200, bestSwell:250, swellHalf:45, exposure:0.6, minWave:0.6, maxHold:3.0, tide:"low-mid", driveKm:2, driveMin:5,
  bottom:"Sandbank along the east harbour wall", level:"Intermediate – advanced",
  swellNeed:"Needs a solid W–SW swell (1.5 m+ offshore); the breakwater blocks most of the NW energy",
  idealWind:"N–NE (offshore), sheltered from the nortada", tideTxt:"Low to mid",
  desc:"Right-hander peeling along the eastern harbour wall. The wall shadows the swell, so it is half the size of Supertubos next door – which is exactly why it is the place to go when the open beaches are too big.",
  hazards:"The jetty; currents along the wall; fishing boats.", parking:"Molhe Leste / Rua do Molhe"},
 {id:"consolacao", name:"Consolação", area:"South of Peniche", lat:39.3240, lon:-9.3600,
  facing:245, bestSwell:270, swellHalf:50, exposure:0.8, minWave:0.7, maxHold:2.8, tide:"all", driveKm:6, driveMin:10,
  bottom:"Reef and rocks (right point), sand to the north", level:"Advanced",
  swellNeed:"W–NW swell 1.2 m+; the long right needs size",
  idealWind:"NE–E offshore; the right has good shelter from N wind", tideTxt:"All tides",
  desc:"Rocky point south of Supertubos with a long, fat right to the south of the headland and a fickle hollow left to the north. Picks up a bit less swell than Supertubos and stays cleaner in a northerly – but rocks and rips make it a no-go when it's big.",
  hazards:"Rocks, strong rips, heavy when big.", parking:"Consolação village"},
 {id:"meio", name:"Meio da Baía", area:"Peniche de Cima bay", lat:39.3655, lon:-9.3530,
  facing:325, bestSwell:315, swellHalf:50, exposure:0.75, minWave:0.5, maxHold:2.2, tide:"low-mid", driveKm:3, driveMin:6,
  bottom:"Sand, shifting banks", level:"All levels",
  swellNeed:"NW–N swell; half the size of the open beaches with W swell",
  idealWind:"SE–S–E (offshore) – the winter wind", tideTxt:"Low to mid, rising",
  desc:"The middle of the long bay between Peniche and Baleal. Faces north-west, so it's the north-side option on S–E winds. Mellower than the south side and spreads the crowd along a long stretch of sand.",
  hazards:"Rips between the banks when bigger.", parking:"Estrada Marginal Norte"},
 {id:"cantinho", name:"Cantinho da Baía", area:"Baleal south", lat:39.3725, lon:-9.3390,
  facing:285, bestSwell:330, swellHalf:40, exposure:0.55, minWave:0.4, maxHold:2.0, tide:"all", driveKm:5, driveMin:9,
  bottom:"Sand, a few rocks at high tide", level:"Beginner → intermediate",
  swellNeed:"Big N or medium NW swell wrapping into the corner of the bay",
  idealWind:"NE–E–SE (offshore)", tideTxt:"All tides",
  desc:"'Corner of the bay' on the south side of the Baleal isthmus. Tucked behind Baleal island, it's the most sheltered beach in Peniche – small and soft when the rest is too big, the surf-school hub on normal days.",
  hazards:"Crowded with schools; rocks north of the café at high tide.", parking:"Baleal isthmus (Rua Amigos do Baleal)"},
 {id:"baleal", name:"Baleal Norte", area:"Baleal north / Ferrel", lat:39.3790, lon:-9.3285,
  facing:345, bestSwell:320, swellHalf:55, exposure:0.85, minWave:0.5, maxHold:2.3, tide:"low-mid", driveKm:6, driveMin:10,
  bottom:"Sand, long beach towards Ferrel", level:"All levels",
  swellNeed:"NW–N swell 0.6–2 m at 8 s+",
  idealWind:"S–SE (offshore) – winter/autumn wind", tideTxt:"Low to mid, rising",
  desc:"North-facing beach from Baleal to Ferrel. The opposite orientation of Supertubos: when the wind is southerly, this side is offshore. Open to NW swell, so it has size when the bay is small.",
  hazards:"Rips on bigger days.", parking:"Praia do Baleal Norte"},
 {id:"lagide", name:"Lagide", area:"Baleal north", lat:39.3780, lon:-9.3350,
  facing:0, bestSwell:325, swellHalf:45, exposure:0.9, minWave:0.6, maxHold:2.3, tide:"mid", driveKm:5, driveMin:9,
  bottom:"Flat reef + sand", level:"Intermediate+",
  swellNeed:"NW–NNW swell 0.8 m+",
  idealWind:"S (offshore); SE–SW side-off", tideTxt:"Mid tide",
  desc:"Reef in front of Baleal's north beach – a step up from the beach peaks, with a bit more size and shape on any NW swell.",
  hazards:"Reef, rocks, sea urchins – booties help.", parking:"Lagide / Baleal Norte"}
];
const ORIGIN = {lat:39.3558, lon:-9.3811, name:"Peniche centre"};
const OFF = [39.30, -9.55];          // offshore wave point (open Atlantic, west of Peniche)
const SEA_PT = [39.36, -9.42];       // tide + water temperature
const TZ = "Europe/Lisbon";
const PAST_DAYS = 3, SHOW_PAST_H = 24, FC_DAYS = 5;
const GOOD_Q = 0.45;
const SCEN = [ // wave model + wind model
  {key:"mf",  w:0.45, wave:"meteofrance_wave", wind:"meteofrance_seamless", label:"Météo-France MFWAM · AROME wind"},
  {key:"ec",  w:0.30, wave:"ecmwf_wam025",     wind:"ecmwf_ifs025",         label:"ECMWF WAM · ECMWF wind"},
  {key:"gfs", w:0.25, wave:"ncep_gfswave025",  wind:"meteofrance_seamless", label:"NOAA GFS-Wave · AROME wind"}];
const COMFORT = [{t:"Waist",v:0.8},{t:"Chest",v:1.1},{t:"Head",v:1.5},{t:"Overhead",v:2.0},{t:"Well overhead",v:2.6}];

/* ============================ helpers ============================ */
const $ = (s,r=document)=>r.querySelector(s);
const RAD = Math.PI/180;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const lerp=(x,x0,x1,y0,y1)=>y0+(clamp(x,x0,x1)-x0)/(x1-x0)*(y1-y0);
const angDiff=K.angDiff;
const COMP=["N","NNE","NE","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"];
const compass=d=>d==null||isNaN(d)?"–":COMP[Math.round((((d%360)+360)%360)/22.5)%16];
const fmt=(x,n=1)=>x==null||isNaN(x)?"–":(+x).toFixed(n);
const F = o=>new Intl.DateTimeFormat("en-GB",Object.assign({timeZone:TZ},o));
const fDay=F({weekday:"short",day:"numeric",month:"short"}), fWd=F({weekday:"short"}), fHr=F({hour:"2-digit",minute:"2-digit",hour12:false}),
      fKey=new Intl.DateTimeFormat("en-CA",{timeZone:TZ,year:"numeric",month:"2-digit",day:"2-digit"}), fMon=F({month:"numeric"}), fH=F({hour:"numeric",hour12:false});
const tDay=t=>fDay.format(new Date(t*1000)), tWd=t=>fWd.format(new Date(t*1000)), tHr=t=>fHr.format(new Date(t*1000));
const dayKey=t=>fKey.format(new Date(t*1000)), monthOf=t=>+fMon.format(new Date(t*1000))-1, hourOf=t=>+fH.format(new Date(t*1000))%24;
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function store(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){return false}}
function load(k,d=null){try{const v=JSON.parse(localStorage.getItem(k));return v??d}catch(e){return d}}
let COMFORT_M = load("pn_comfort", 1.5);
const comfortName = ()=>{ const c=COMFORT.find(x=>x.v===COMFORT_M)||COMFORT[2]; return `${c.t} (${c.v} m)`; };

/* sunrise/sunset (SunCalc) */
function sunTimes(unixNoon, lat=39.36, lon=-9.38){
  const J1970=2440588,J2000=2451545,e=RAD*23.4397,d=unixNoon/86400-0.5+J1970-J2000,lw=RAD*-lon,phi=RAD*lat;
  const n=Math.round(d-0.0009-lw/(2*Math.PI)),ds=0.0009+lw/(2*Math.PI)+n,M=RAD*(357.5291+0.98560028*ds);
  const C=RAD*(1.9148*Math.sin(M)+0.02*Math.sin(2*M)+0.0003*Math.sin(3*M)),L=M+C+RAD*102.9372+Math.PI;
  const dec=Math.asin(Math.sin(e)*Math.sin(L)),Jn=J2000+ds+0.0053*Math.sin(M)-0.0069*Math.sin(2*L);
  const w=Math.acos((Math.sin(-0.833*RAD)-Math.sin(phi)*Math.sin(dec))/(Math.cos(phi)*Math.cos(dec)));
  const a=0.0009+(w+lw)/(2*Math.PI)+n,Js=J2000+a+0.0053*Math.sin(M)-0.0069*Math.sin(2*L),Jr=Jn-(Js-Jn);
  const u=J=>(J+0.5-J1970)*86400; return {rise:u(Jr),set:u(Js)};
}
const sunC={};
function sunFor(t){ const k=Math.floor((t+3600)/86400); return sunC[k]||(sunC[k]=sunTimes(k*86400+12*3600)); }
function isDay(t){ const s=sunFor(t), m=t+1800; return m>=s.rise-900 && m<=s.set+600; }

/* ============================ ratings ============================ */
const RATINGS = [
  {k:"flat",  t:"Flat",      c:"#b9bec6", q:0.05},
  {k:"poor",  t:"Poor",      c:"#e5484d", q:0.22},
  {k:"pf",    t:"Poor–Fair", c:"#f07a2a", q:0.38},
  {k:"fair",  t:"Fair",      c:"#f2b01e", q:0.53},
  {k:"good",  t:"Good",      c:"#1fa463", q:0.71},
  {k:"fire",  t:"Firing",    c:"#0e5fd8", q:0.9}
];
function ratingIdx(q){ if(q==null) return -1; return q<0.15?0:q<0.3?1:q<GOOD_Q?2:q<0.62?3:q<0.8?4:5; }
const SIZES = [
  {t:"Flat",v:0.1},{t:"Ankle",v:0.2},{t:"Knee",v:0.4},{t:"Thigh",v:0.6},{t:"Waist",v:0.8},{t:"Chest",v:1.1},{t:"Head",v:1.5},{t:"Overhead",v:2.0},{t:"Double overhead",v:3.0}
];
function sizeWords(hb){ if(hb==null) return "–"; let i=0; for(let k=0;k<SIZES.length;k++) if(hb>=SIZES[k].v*0.85) i=k; return SIZES[i].t+(hb>=0.5&&i<SIZES.length-1&&hb>SIZES[i].v*1.12?"–"+SIZES[i+1].t.toLowerCase():"");}
const CLEAN_C = {"Clean":"#1fa463","Semi-clean":"#7cc46a","Bumpy":"#f2b01e","Choppy":"#f07a2a","Blown out":"#e5484d"};

/* ============================ data ============================ */
async function getJSON(url){
  let r;
  try{ r = await fetch(url); } catch(e){ throw new Error("network: "+e.message); }
  if(!r.ok){ let m="HTTP "+r.status; try{m+=" "+(await r.json()).reason}catch(e){} throw new Error(m); }
  return r.json();
}
const arr=j=>Array.isArray(j)?j:[j];
const WAVE_VARS="wave_height,wave_period,wave_peak_period,wave_direction,swell_wave_height,swell_wave_period,swell_wave_peak_period,swell_wave_direction,secondary_swell_wave_height,secondary_swell_wave_period,secondary_swell_wave_direction,wind_wave_height,wind_wave_period,wind_wave_direction";
async function fetchWind(){
  const pts=SPOTS.map(s=>[s.lat,s.lon]);
  return arr(await getJSON(`https://api.open-meteo.com/v1/forecast?latitude=${pts.map(p=>p[0]).join(",")}&longitude=${pts.map(p=>p[1]).join(",")}`+
    `&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m,temperature_2m&models=${[...new Set(SCEN.map(s=>s.wind))].join(",")}`+
    `&wind_speed_unit=ms&timeformat=unixtime&past_days=${PAST_DAYS}&forecast_days=${FC_DAYS}`));
}
async function fetchWaves(){
  return arr(await getJSON(`https://marine-api.open-meteo.com/v1/marine?latitude=${OFF[0]}&longitude=${OFF[1]}&hourly=${WAVE_VARS}`+
    `&models=${SCEN.map(s=>s.wave).join(",")}&timeformat=unixtime&past_days=${PAST_DAYS}&forecast_days=${FC_DAYS+1}`))[0];
}
async function fetchSea(){
  return arr(await getJSON(`https://marine-api.open-meteo.com/v1/marine?latitude=${SEA_PT[0]}&longitude=${SEA_PT[1]}&hourly=sea_level_height_msl,sea_surface_temperature&timeformat=unixtime&past_days=${PAST_DAYS}&forecast_days=${FC_DAYS+1}`))[0];
}
function series(loc, v, m){ const h=loc&&loc.hourly; if(!h) return null; return (m&&h[v+"_"+m])||h[v]||null; }

/* offshore wave components for one model at index k */
function compsAt(Wv, m, k){
  const g=v=>{ const s=series(Wv,v,m); return s?s[k]:null; };
  const out=[], pk=m==="meteofrance_wave"?1.12:1;   // MFWAM gives mean period → approx. peak period
  const H1=g("swell_wave_height");
  if(H1!=null){
    out.push({kind:"swell", H:H1, T:g("swell_wave_peak_period")??(g("swell_wave_period")*pk), dir:g("swell_wave_direction")});
    const H2=g("secondary_swell_wave_height"); if(H2!=null&&H2>0.05) out.push({kind:"swell2", H:H2, T:g("secondary_swell_wave_period")*pk, dir:g("secondary_swell_wave_direction")});
    const Hw=g("wind_wave_height"), Tw=g("wind_wave_period");
    if(Hw!=null&&Hw>0.02) out.push({kind:(Tw!=null&&Tw>=8)?"swell2":"wind", H:Hw, T:Tw, dir:g("wind_wave_direction")});
  } else {
    const H=g("wave_height"); if(H==null) return null;
    const T=g("wave_peak_period")??g("wave_period");
    out.push({kind:T!=null&&T<7?"wind":"swell", H, T, dir:g("wave_direction")});
  }
  return out.filter(c=>c.H!=null&&c.dir!=null);
}

/* ============================ the model run ============================ */
function buildModel(W, Wv, Ws, clim, cal){
  const now=Date.now()/1000;
  const wvMap={}; if(Wv) Wv.hourly.time.forEach((t,k)=>wvMap[t]=k);
  let sl=null, slT=null, slMap={}; if(Ws&&Ws.hourly){ sl=Ws.hourly.sea_level_height_msl; slT=Ws.hourly.time; slT.forEach((t,k)=>slMap[t]=k); }
  const sst=Ws&&Ws.hourly?Ws.hourly.sea_surface_temperature:null;
  const turns = sl?K.tideTurns(slT, sl):[];
  const spots = SPOTS.map((s,si)=>{
    const beach=W[si], times=beach.hourly.time, C=cal.spots[s.id]||cal.global;
    const wsM={}, wdM={}; SCEN.forEach(x=>{ wsM[x.wind]=series(beach,"wind_speed_10m",x.wind); wdM[x.wind]=series(beach,"wind_direction_10m",x.wind); });
    const gst=series(beach,"wind_gusts_10m","meteofrance_seamless"), gstE=series(beach,"wind_gusts_10m","ecmwf_ifs025");
    const tmp=series(beach,"temperature_2m","meteofrance_seamless"), tmpE=series(beach,"temperature_2m","ecmwf_ifs025");
    const hours = times.map((t,i)=>{
      if(t < now - SHOW_PAST_H*3600) return null;
      const k=wvMap[t], j=slMap[t];
      const tideX = j!=null?K.tideNorm(sl,j):null, tideV=j!=null?sl[j]:null, tideTr=j!=null?K.tideTrend(sl,j):0;
      const scen=[];
      SCEN.forEach(x=>{
        if(k==null) return; const comps=compsAt(Wv,x.wave,k); if(!comps||!comps.length) return;
        let ws=wsM[x.wind]&&wsM[x.wind][i], wd=wdM[x.wind]&&wdM[x.wind][i];
        if(ws==null){ ws=wsM.ecmwf_ifs025&&wsM.ecmwf_ifs025[i]; wd=wdM.ecmwf_ifs025&&wdM.ecmwf_ifs025[i]; }
        if(ws==null) return;
        const r=K.evaluate(s, comps, {ws,wd}, tideX, COMFORT_M, C); if(r.q==null) return;
        scen.push({key:x.key, comps, ...r});
      });
      const P = scen.find(x=>x.key==="mf")||scen.find(x=>x.key==="ec")||scen[0]||null;
      let p=null,q=null,lo=null,hi=null;
      if(scen.length){
        let sw=0,acc=0,qa=0; scen.forEach(x=>{const w=SCEN.find(y=>y.key===x.key).w; sw+=w; acc+=w/(1+Math.exp(-(x.q-GOOD_Q)/0.06)); qa+=w*x.q;});
        const pm=acc/sw, lead=Math.max(0,(t-now)/3600), base=clim&&clim[s.id]?clim[s.id][monthOf(t)].pct:0.15;
        const w=clamp(1-lead/260,0.5,0.97)*(scen.length>1?1:0.9);
        p=w*pm+(1-w)*base; q=qa/sw;
        lo=Math.min(...scen.map(x=>x.hb)); hi=Math.max(...scen.map(x=>x.hb));
      }
      return {t, past:t<now-1800, day:isDay(t), scen, P, p, q, lo, hi, tideX, tideV, tideTr,
        gust:gst&&gst[i]!=null?gst[i]:gstE&&gstE[i], temp:tmp&&tmp[i]!=null?tmp[i]:tmpE&&tmpE[i], sst: j!=null&&sst?sst[j]:null,
        cls: P?K.seaClass(P.ss, P.ws):null};
    }).filter(Boolean);
    return {spot:s, hours, cal:C};
  });
  return {spots, now, turns};
}

/* ============================ climatology (3 y hindcast) ============================ */
async function fetchClimate(){
  const key="pn_clim_v1_"+COMFORT_M, c=load(key); if(c&&Date.now()-c.at<14*864e5) return c;
  const end=new Date(Date.now()-10*864e5), start=new Date(end); start.setFullYear(end.getFullYear()-3);
  const d=x=>x.toISOString().slice(0,10);
  const [wv, wn] = await Promise.all([
    getJSON(`https://marine-api.open-meteo.com/v1/marine?latitude=${OFF[0]}&longitude=${OFF[1]}&hourly=swell_wave_height,swell_wave_period,swell_wave_direction,secondary_swell_wave_height,secondary_swell_wave_period,secondary_swell_wave_direction,wind_wave_height,wind_wave_period,wind_wave_direction&start_date=${d(start)}&end_date=${d(end)}&timeformat=unixtime`),
    getJSON(`https://archive-api.open-meteo.com/v1/archive?latitude=39.36&longitude=-9.37&start_date=${d(start)}&end_date=${d(end)}&hourly=wind_speed_10m,wind_direction_10m&wind_speed_unit=ms&timeformat=unixtime`)]);
  const T=wv.hourly.time, wm={}; wn.hourly.time.forEach((t,i)=>wm[t]=i);
  const U=wn.hourly.wind_speed_10m, D=wn.hourly.wind_direction_10m;
  const res={at:Date.now(), range:`${d(start)} → ${d(end)}`, M:COMFORT_M};
  const A=Array.from({length:12},()=>({n:0,cls:{}}));
  const per={}; SPOTS.forEach(s=>per[s.id]=Array.from({length:12},()=>({n:0,g:0,big:0,days:{},gd:{}})));
  T.forEach((t,i)=>{
    if(!isDay(t)) return; const w=wm[t]; if(w==null||U[w]==null) return;
    const comps=compsAt(wv,null,i); if(!comps||!comps.length) return;
    const m=monthOf(t), dk=dayKey(t), ss=K.seaState(comps), cl=K.seaClass(ss,U[w]);
    if(cl){ A[m].n++; A[m].cls[cl.k]=(A[m].cls[cl.k]||0)+1; }
    SPOTS.forEach(s=>{ const r=K.evaluate(s,comps,{ws:U[w]*0.9,wd:D[w]},null,COMFORT_M); if(r.q==null) return; const M=per[s.id][m];
      M.n++; M.days[dk]=1; if(r.q>=GOOD_Q){ M.g++; M.gd[dk]=(M.gd[dk]||0)+1; } if(r.tooBig) M.big++; });
  });
  SPOTS.forEach(s=>{ res[s.id]=per[s.id].map(x=>({pct:x.n?x.g/x.n:0, big:x.n?x.big/x.n:0, days:Object.values(x.gd).filter(v=>v>=2).length/Math.max(1,Object.keys(x.days).length)*30.4})); });
  res.coast=A.map(x=>{ const o={}; Object.keys(x.cls).forEach(k=>o[k]=x.cls[k]/Math.max(1,x.n)); return o; });
  store(key,res); return res;
}

/* ============================ sessions + learning ============================ */
const SESS_KEY="pn_sessions_v1";
let SESSIONS = load(SESS_KEY, []);
function saveSessions(){ store(SESS_KEY, SESSIONS); }
function calibrate(){
  const shrink=3, by={}; let gl=0, gn=0, gq=0, gqn=0;
  SESSIONS.forEach(s=>{ const p=s.pred; if(!p) return; const b=by[s.spot]||(by[s.spot]={l:0,n:0,q:0,qn:0});
    if(s.size!=null && p.hb>0.15){ const r=Math.log(SIZES[s.size].v/p.hb); b.l+=r; b.n++; gl+=r; gn++; }
    if(s.rating!=null && p.q!=null){ const d=RATINGS[s.rating].q-p.q; b.q+=d; b.qn++; gq+=d; gqn++; } });
  const gLog=gl/(gn+shrink), gBias=gq/(gqn+shrink);
  const global={size:Math.exp(gLog), qBias:gBias, n:SESSIONS.length};
  const spots={};
  SPOTS.forEach(sp=>{ const b=by[sp.id]; if(!b){ spots[sp.id]={...global, n:0, inherited:true}; return; }
    spots[sp.id]={size:Math.exp((b.l+shrink*gLog)/(b.n+shrink)), qBias:(b.q+shrink*gBias)/(b.qn+shrink), n:Math.max(b.n,b.qn)}; });
  return {global, spots};
}
let CAL = calibrate();

async function predictFor(spotId, start, end){
  const si=SPOTS.findIndex(s=>s.id===spotId), s=SPOTS[si];
  const avg=hs=>{ const v=hs.filter(h=>h&&h.P); if(!v.length) return null;
    const m=k=>v.reduce((a,h)=>a+(h.P[k]??0),0)/v.length;
    return {hb:m("hb"),Hs:v[0].P.ss.Hs,T:m("T"),ws:m("ws"),wd:v[0].P.wd,dir:v[0].P.dir,rel:m("rel"),clean:m("clean"),q:v.reduce((a,h)=>a+h.q,0)/v.length,src:"forecast run"}; };
  if(STATE){ const S=STATE.spots[si]; const hs=S.hours.filter(h=>h.t>=start-1800&&h.t<=end); if(hs.length) return avg(hs); }
  const d=x=>new Date(x*1000).toISOString().slice(0,10);
  const [wv, wn, se] = await Promise.all([
    getJSON(`https://marine-api.open-meteo.com/v1/marine?latitude=${OFF[0]}&longitude=${OFF[1]}&hourly=${WAVE_VARS}&models=meteofrance_wave&start_date=${d(start-86400)}&end_date=${d(end)}&timeformat=unixtime`),
    getJSON(`https://historical-forecast-api.open-meteo.com/v1/forecast?latitude=${s.lat}&longitude=${s.lon}&hourly=wind_speed_10m,wind_direction_10m&models=meteofrance_seamless&wind_speed_unit=ms&start_date=${d(start-86400)}&end_date=${d(end)}&timeformat=unixtime`),
    getJSON(`https://marine-api.open-meteo.com/v1/marine?latitude=${SEA_PT[0]}&longitude=${SEA_PT[1]}&hourly=sea_level_height_msl&start_date=${d(start-86400)}&end_date=${d(end+86400)}&timeformat=unixtime`).catch(()=>null)]);
  const wm={}; wn.hourly.time.forEach((t,i)=>wm[t]=i); const sm={}; if(se) se.hourly.time.forEach((t,i)=>sm[t]=i);
  const U=series(wn,"wind_speed_10m","meteofrance_seamless"), D=series(wn,"wind_direction_10m","meteofrance_seamless");
  const hs=wv.hourly.time.map((t,i)=>{ if(t<start-1800||t>end) return null; const w=wm[t]; if(w==null||U[w]==null) return null;
    const comps=compsAt(wv,"meteofrance_wave",i); if(!comps||!comps.length) return null;
    const tx=se&&sm[t]!=null?K.tideNorm(se.hourly.sea_level_height_msl,sm[t]):null;
    const r=K.evaluate(s,comps,{ws:U[w],wd:D[w]},tx,COMFORT_M); return {P:r,q:r.q}; });
  const a=avg(hs); if(a) a.src="archived run"; return a;
}
function similarSessions(spotId, P){
  if(!P) return [];
  const grp=r=>r>=100?"off":r>=60?"cross":"on";
  return SESSIONS.filter(s=>s.pred&&s.rating!=null&&(!spotId||s.spot===spotId)&&Math.abs(s.pred.hb-P.hb)<0.4&&grp(s.pred.rel)===grp(P.rel));
}

/* ============================ UI: shared bits ============================ */
let STATE=null, RAW=null, CLIM=null, VIEW={day:null, sel:null, night:false};
function chip(q){ const i=ratingIdx(q); if(i<0) return `<span class="chip" style="--c:#cfd3d8">–</span>`; const r=RATINGS[i]; return `<span class="chip" style="--c:${r.c}">${r.t}</span>`; }
function cleanChip(P){ if(!P||P.clean==null) return ""; return `<span class="chip" style="--c:${CLEAN_C[P.cleanW]}">${P.cleanW}</span>`; }
function bigChip(P){ return P&&P.tooBig?`<span class="chip big-c" style="--c:#7a3fbf">Too big for you</span>`:""; }
function clsChip(c){ return c?`<span class="chip" style="--c:${c.c}">${c.t}</span>`:""; }
function arrow(wd, size=16, cls=""){ if(wd==null) return ""; const a=(wd+180)%360; return `<svg class="arr ${cls}" width="${size}" height="${size}" viewBox="-8 -8 16 16" style="transform:rotate(${a}deg)" aria-hidden="true"><path d="M0,-7 L4.5,4 L0,1.5 L-4.5,4 Z"/></svg>`; }
function surfRange(h){ if(!h||!h.P||h.P.hb==null) return null; const hb=h.P.hb; const a=Math.max(0,Math.floor(hb*0.75*10)/10), b=Math.max(a+0.1,Math.ceil(hb*1.15*10)/10); return [a,b]; }
function rangeTxt(h){ const r=surfRange(h); return r?`${fmt(r[0])}–${fmt(r[1])}`:"–"; }
function tideTxt(h){ if(!h||h.tideX==null) return "–"; return `${K.tideWord(h.tideX)} ${h.tideTr>0.03?"↑":h.tideTr<-0.03?"↓":"·"}`; }
function mapsLink(s){ return `https://www.google.com/maps/dir/?api=1&origin=${ORIGIN.lat},${ORIGIN.lon}&destination=${s.lat},${s.lon}&travelmode=driving`; }
function swellTxt(P){ if(!P||!P.ss) return "–"; const p=P.ss.primary; return p?`${fmt(p.H)} m @ ${fmt(p.T,0)} s ${compass(p.dir)}`:"–"; }
const tip=()=>$("#tip");
function hideTip(){ tip().style.display="none"; }
document.addEventListener("scroll", hideTip, true);

/* ============================ ANALYTICS ============================ */
const DIRS8 = [["N",0],["NE",45],["E",90],["SE",135],["S",180],["SW",225],["W",270],["NW",315]];
const SWELL_DIRS = [["SW",225],["WSW",247],["W",270],["WNW",292],["NW",315],["NNW",337],["N",0]];
function tier(p){ return p>=0.6?{t:"Go",c:"go"}:p>=0.4?{t:"Worth a look",c:"look"}:p>=0.2?{t:"Long shot",c:"long"}:{t:"Unlikely",c:"no"}; }
const pct = p => p==null?"–":Math.round(p*100)+"%";

function spotSlots(S){
  const out=[], byDay={};
  S.hours.forEach((h,i)=>{ if(h.past||!h.day||h.p==null) return; (byDay[dayKey(h.t)]||(byDay[dayKey(h.t)]=[])).push(i); });
  Object.values(byDay).forEach(idx=>{
    let pk=idx.reduce((a,i)=>S.hours[i].p>S.hours[a].p?i:a, idx[0]);
    const peak=S.hours[pk].p, ok=i=>idx.includes(i)&&S.hours[i].p>=Math.max(peak*0.75,peak-0.12);
    let a=pk, b=pk; while(b-a<3){ const L=ok(a-1), R=ok(b+1); if(!L&&!R) break; if(R&&(!L||S.hours[b+1].p>=S.hours[a-1].p)) b++; else a--; }
    const hs=S.hours.slice(a,b+1);
    out.push({S, hours:hs, start:hs[0].t, end:hs[hs.length-1].t+3600, peakH:S.hours[pk], pPeak:peak});
  });
  return out.sort((x,y)=>y.pPeak-x.pPeak);
}
function allSlots(M){ return M.spots.flatMap(spotSlots).sort((a,b)=>b.pPeak-a.pPeak); }
function plan(spot, start, end){ return {leave:start-(spot.driveMin+15)*60, arrive:start-15*60, home:end+spot.driveMin*60}; }
function planHtml(spot, sl){ const p=plan(spot, sl.start, sl.end);
  return `<div class="plan"><span>🚗 Leave ${ORIGIN.name} <b>${tHr(p.leave)}</b></span><span>Surf <b>${tHr(sl.start)}–${tHr(sl.end)}</b></span><span>Tide <b>${tideTxt(sl.peakH)}</b></span></div>`; }
function locHtml(s){
  return `<div class="loc"><b>📍 ${esc(s.parking)}</b><span class="muted">${s.lat.toFixed(3)}° N, ${Math.abs(s.lon).toFixed(3)}° W · ${s.driveKm} km, ~${s.driveMin} min from ${ORIGIN.name}</span>
   <span><a href="${mapsLink(s)}" target="_blank" rel="noopener">Google Maps route ↗</a> · <a href="https://maps.apple.com/?saddr=${ORIGIN.lat},${ORIGIN.lon}&daddr=${s.lat},${s.lon}&dirflg=d" target="_blank" rel="noopener">Apple Maps ↗</a></span></div>`; }

/* executive explanation */
function whyHtml(S, h){
  const s=S.spot, P=h.P; if(!P) return "";
  const lines=[], ss=P.ss, p=ss.primary;
  const parts=P.parts.filter(x=>x.H>0.1).sort((a,b)=>b.hb-a.hb);
  lines.push(`<b>Offshore:</b> ${parts.map(x=>`${fmt(x.H)} m @ ${fmt(x.T,0)} s from ${compass(x.dir)} <span class="muted">(${x.kind==="wind"?"local wind-sea":"swell"})</span>`).join(" + ")}.`);
  if(p){ const wf=K.windowFactor(s,p.dir,p.T);
    lines.push(`<b>Into the beach:</b> ${s.name} faces ${compass(s.facing)} and takes swell best from ${compass(s.bestSwell)}; the ${compass(p.dir)} swell gets in at ~${Math.round(wf*s.exposure*100)}%${s.exposure<0.8?" (sheltered spot)":""}. ${p.T>=11?"Long period – it grows a lot on the sandbanks, sets are noticeably bigger than the average.":p.T<8?"Short period – weak, closely spaced waves.":""} → <b>${rangeTxt(h)} m</b> faces (${sizeWords(P.hb).toLowerCase()}).`); }
  const lab=K.windLabel(P.rel,P.ws);
  lines.push(`<b>Surface:</b> ${compass(P.wd)} ${fmt(P.ws,0)} m/s = ${lab} here${ss.windFrac>0.35?`, plus ${fmt(ss.windH)} m of wind-sea in the water`:""}${ss.cross>0.5?", crossing swells":""} → <b>${P.cleanW.toLowerCase()}</b>.`);
  let v=`${RATINGS[Math.max(0,ratingIdx(h.q))].t} · <b>${pct(h.p)} chance</b> of a good session for you.`;
  if(P.tooBig) v+=` <b>Bigger than your ${fmt(COMFORT_M)} m comfort limit</b>${P.hold?" and past what the spot holds – closing out":""}. Look at the sheltered spots.`;
  else if(P.hb<s.minWave) v+=` Too small to work properly here.`;
  lines.push(`<b>Verdict:</b> ${v}`);
  return `<div class="why">${lines.map(l=>`<p>${l}</p>`).join("")}</div>`;
}
function checklist(S, h){
  const s=S.spot, P=h.P||{}; const st=v=>v===2?'<i class="ok">✓</i>':v===1?'<i class="mid">~</i>':'<i class="bad">✗</i>';
  const p=P.ss&&P.ss.primary, wf=p?K.windowFactor(s,p.dir,p.T):0, ws=K.windScore(P.rel??0,P.ws??0);
  const rows=[
    ["Surf size", `${s.minWave}–${fmt(COMFORT_M)} m (your max)`, `${fmt(P.hb)} m`, P.hb>=s.minWave&&P.hb<=COMFORT_M?2:(P.hb>=s.minWave*0.8&&P.hb<=COMFORT_M*1.2)?1:0],
    ["Swell direction", `${compass(s.bestSwell-s.swellHalf)}–${compass(s.bestSwell+s.swellHalf)}`, p?compass(p.dir):"–", wf>=0.6?2:wf>=0.3?1:0],
    ["Swell period", "≥ 10 s groundswell", p?`${fmt(p.T,0)} s`:"–", p&&p.T>=10?2:p&&p.T>=8?1:0],
    ["Wind at beach", "off/side-off, or < 4 m/s", `${compass(P.wd)} ${fmt(P.ws,0)} · ${P.ws!=null?K.windLabel(P.rel,P.ws):"–"}`, ws>=0.75?2:ws>=0.45?1:0],
    ["Sea state", "one clean swell", P.ss?`${fmt(P.ss.windFrac*100,0)}% wind-sea${P.ss.cross>0.5?", crossing":""}`:"–", P.sc>=0.8?2:P.sc>=0.6?1:0],
    ["Tide", s.tideTxt, tideTxt(h), P.ts>=0.95?2:P.ts>=0.8?1:0],
    ["Daylight", "sunrise–sunset", h.day?"yes":"dark", h.day?2:0]
  ];
  return `<table class="chk"><tr><th>Condition</th><th>Spot needs</th><th>Forecast</th><th></th></tr>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${st(r[3])}</td></tr>`).join("")}</table>`;
}
function reason(S, h){
  const s=S.spot, P=h&&h.P; if(!P) return "no data";
  const p=P.ss.primary, lab=K.windLabel(P.rel,P.ws), wsc=K.windScore(P.rel,P.ws);
  if(P.tooBig) return `${fmt(P.hb)} m – above your ${fmt(COMFORT_M)} m limit${P.hold?", closing out":""}.`;
  if(P.hb<s.minWave){ const wf=p?K.windowFactor(s,p.dir,p.T)*s.exposure:0; return wf<0.4?`${compass(p&&p.dir)} swell is blocked/shadowed here – ${fmt(P.hb)} m.`:`Too small – ${fmt(P.hb)} m.`; }
  if(wsc<0.45) return `${fmt(P.hb)} m but ${lab} ${fmt(P.ws,0)} m/s – ${P.cleanW.toLowerCase()}.`;
  if(lab==="offshore"||lab==="side-off"||lab==="glassy") return `${fmt(P.hb)} m, ${lab} – ${P.cleanW.toLowerCase()}. Faces ${compass(s.facing)}, so this wind grooms it.`;
  return `${fmt(P.hb)} m with ${lab} ${fmt(P.ws,0)} m/s – ${P.cleanW.toLowerCase()}.`;
}
function windGuide(s){
  return DIRS8.map(([n,d])=>{ const rel=K.windRel(s,d), lab=K.windLabel(rel,8);
    const code=rel>=135?"off":rel>=100?"side":rel>=70?"cross":"on";
    const txt=code==="off"?"Offshore – clean faces":code==="side"?"Side-offshore – clean to slightly textured":code==="cross"?"Cross-shore – OK when light":"Onshore – messy unless very light";
    return {n,d,rel,code,txt,lab}; });
}
const WIND_ICON={off:'<span class="gi clean" title="Offshore">●</span>',side:'<span class="gi build" title="Side-off">◐</span>',cross:'<span class="gi small" title="Cross">○</span>',on:'<span class="gi none" title="Onshore">✕</span>'};
function swellCell(s, d){ const f=K.windowFactor(s,d,12)*s.exposure; return f>=0.6?'<span class="gi build" title="full">●</span>':f>=0.35?'<span class="gi small" title="partial">◐</span>':f>=0.15?'<span class="gi small" title="little">○</span>':'<span class="gi none" title="blocked">–</span>'; }

/* ============================ MAPS ============================ */
const MAPS={};
function tileLayer(){ return L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}); }
function makeMap(id, opts){
  if(typeof L==="undefined"){ const el=document.getElementById(id); if(el) el.innerHTML='<p class="muted small" style="padding:10px">Map unavailable offline.</p>'; return null; }
  if(MAPS[id]){ try{MAPS[id].remove()}catch(e){} }
  const m=L.map(id,Object.assign({zoomControl:true,attributionControl:true,scrollWheelZoom:false,tap:true},opts)); tileLayer().addTo(m); MAPS[id]=m;
  [50,300,1000].forEach(ms=>setTimeout(()=>{ try{ m.invalidateSize(); }catch(e){} },ms)); return m;
}
function pinIcon(color, label, below){ return L.divIcon({className:"pin-wrap",html:`<div class="pin ${below?"below":""}" style="--c:${color}"><span>${label}</span></div>`,iconSize:null}); }
function drawOverviewMap(M, slots){
  const m=makeMap("ovMap",{center:[39.357,-9.355],zoom:13}); if(!m) return;
  const pts=[];
  const below={supertubos:true, cantinho:true, lagide:false, baleal:false, meio:false, molhe:false, consolacao:true};
  M.spots.forEach(S=>{ const s=S.spot, sl=slots.find(x=>x.S===S), i=sl?ratingIdx(sl.peakH.q):-1;
    const mk=L.marker([s.lat,s.lon],{icon:pinIcon(i>=0?RATINGS[i].c:"#9aa3ad", `${esc(s.name)} · ${sl?pct(sl.pPeak):"–"}`, below[s.id])}).addTo(m);
    mk.on("click",()=>{ location.hash="#spot-"+s.id; }); pts.push([s.lat,s.lon]); });
  m.fitBounds(pts,{padding:[40,40]});
}
function drawSpotMap(S){
  const s=S.spot, el=document.getElementById("spMap"); if(!el) return;
  el.innerHTML=`<iframe title="Google Maps – ${esc(s.name)}" src="https://maps.google.com/maps?q=${s.lat},${s.lon}&z=15&t=k&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
}

/* ============================ GEAR ============================ */
function waterTemp(S, h){
  if(h&&h.sst!=null) return h.sst;
  const i=S.hours.indexOf(h); let best=null, bd=1e9;
  S.hours.forEach((x,k)=>{ if(x.sst!=null&&Math.abs(k-i)<bd){ bd=Math.abs(k-i); best=x.sst; } });
  return best;
}
const SUITS=[
  [20,"3/2 mm or spring suit","",[150,200]],[17,"3/2 mm","",[120,180]],[15,"4/3 mm","booties optional",[100,150]],[12,"4/3 mm","booties",[90,130]],
  [-5,"5/4 mm hooded","booties + gloves",[60,100]]];
function gearFor(S, h){
  const s=S.spot, P=h&&h.P||{}, wt=waterTemp(S,h), air=h?h.temp:null;
  const st=wt==null?null:SUITS.find(x=>wt>=x[0]);
  let mins=st?st[3].slice():null; const chill=[];
  if(mins){ if(air!=null&&air<10){ mins=mins.map(m=>m-15); chill.push(`air ${fmt(air,0)}°C`);} if(P.ws>10){ mins=mins.map(m=>m-15); chill.push(`wind ${fmt(P.ws,0)} m/s`);} mins=mins.map(m=>Math.max(30,m)); }
  const hb=P.hb||0, T=P.T||0, clean=P.clean>=0.68;
  let board, why;
  if(P.tooBig){ board="Sit it out – or step-up at a sheltered spot"; why=`above your ${fmt(COMFORT_M)} m comfort limit; powerful Atlantic sets and strong rips`; }
  else if(hb<0.6){ board="Longboard 9'+ / foamie"; why="small – you need paddle power and glide"; }
  else if(hb<1.0){ board=clean?"Fish / groveller 5'8–6'4 or mid-length":"Mid-length 7'0–8'0"; why=clean?"waist-high and clean: speed and volume":"bumpy – length gets you in early"; }
  else if(hb<1.6){ board=T>=11&&clean?"Shortboard / hybrid 6'0–6'6":"Hybrid with volume 6'4–7'0"; why=T>=11?"long-period groundswell has real push – a board you can control":"short-period and textured – a bit more volume"; }
  else { board="Shortboard / step-up 6'4–7'0"; why="solid and powerful – control, and a leash you trust"; }
  if(s.level.startsWith("Beginner")&&hb<1&&!P.tooBig) why+="; beginners: soft-top 8'+";
  const extra=s.bottom.match(/reef|rock/i)?"Reef/rocks – booties help.":"";
  return {wt, air, suit:st?`${st[1]}${st[2]?" + "+st[2]:""}`:"–", mins, chill, board, why, extra};
}
function gearHtml(S, h, compact){
  const g=gearFor(S,h), time=g.mins?`${g.mins[0]}–${g.mins[1]} min`:"–";
  if(compact) return `<div class="gear"><span>🏄 <b>${g.board}</b></span><span>🌡 Water <b>${fmt(g.wt,0)}°C</b> · ${g.suit}</span></div>`;
  return `<div class="gear-g">
    <div><span>Board</span><b>${g.board}</b><em>${g.why}.</em></div>
    <div><span>Water</span><b>${fmt(g.wt,1)}°C</b><em>air ${fmt(g.air,0)}°C · sea-surface forecast</em></div>
    <div><span>Wetsuit</span><b>${g.suit}</b><em>${g.extra||"for a normal session"}</em></div>
    <div><span>Time in the water</span><b>${time}</b><em>comfortable with that suit${g.chill.length?` · shortened for ${g.chill.join(" & ")}`:""}</em></div></div>`;
}

/* ============================ HOME ============================ */
function comfortBar(){
  return `<div class="comfort"><span>My max wave</span><div class="opts">${COMFORT.map(c=>`<label class="opt"><input type="radio" name="cm" value="${c.v}" ${c.v===COMFORT_M?"checked":""}><span>${c.t}</span></label>`).join("")}</div></div>`;
}
function bindComfort(){ document.querySelectorAll('input[name="cm"]').forEach(r=>r.onchange=async()=>{ COMFORT_M=+r.value; store("pn_comfort",COMFORT_M); CLIM=load("pn_clim_v1_"+COMFORT_M); if(RAW) rebuild(); route();
  try{ CLIM=await fetchClimate(); rebuild(); route(); }catch(e){} }); }

/* coast-wide ocean state per day (from the exposed-beach scenario) */
function oceanDays(M){
  const S=M.spots[0], days={};
  S.hours.forEach((h,i)=>{ if(h.past||!h.day||!h.P) return; (days[dayKey(h.t)]||(days[dayKey(h.t)]=[])).push(i); });
  const order=["small","clean","mod","mixed","xl","storm"];
  return Object.entries(days).slice(0,5).map(([dk,idx])=>{
    const hs=idx.map(i=>S.hours[i]), mid=hs[Math.floor(hs.length/2)];
    const worst=hs.reduce((a,h)=>order.indexOf(h.cls.k)>order.indexOf(a.cls.k)?h:a, hs[0]);
    const cnt={}; hs.forEach(h=>cnt[h.cls.k]=(cnt[h.cls.k]||0)+1);
    const main=Object.entries(cnt).sort((a,b)=>b[1]-a[1])[0][0], cls=hs.find(h=>h.cls.k===main).cls;
    const ok=M.spots.map(X=>{ const b=X.hours.filter(h=>dayKey(h.t)===dk&&h.day&&!h.past&&h.P).reduce((a,h)=>!a||h.p>a.p?h:a,null); return {X,b}; }).filter(x=>x.b);
    const big=ok.filter(x=>x.b.P.tooBig).map(x=>x.X.spot.name), fits=ok.filter(x=>!x.b.P.tooBig&&x.b.q>=0.3).sort((a,b)=>b.b.p-a.b.p).map(x=>x.X.spot.name);
    return {dk, t:mid.t, cls, worst:worst.cls, P:mid.P, hs, big, fits};
  });
}
function oceanCard(M){
  const D=oceanDays(M); if(!D.length) return "";
  return `<div class="card"><h3>Ocean state · is it too rough?</h3>
   <p class="small muted">The whole coast at midday – before choosing a beach. Peniche surf is groundswell from distant Atlantic storms; what makes it clean or rough is the period, the local wind-sea and crossing swells.</p>
   <div class="ocean">${D.map(d=>{ const ss=d.P.ss;
     return `<div class="oday"><div class="oday-h"><b>${tWd(d.t)}</b>${clsChip(d.cls)}${d.worst.k!==d.cls.k&&["storm","xl","mixed"].includes(d.worst.k)?`<span class="small muted">→ ${d.worst.t.toLowerCase()} at times</span>`:""}</div>
       <div class="small">${fmt(ss.Hs)} m total · swell ${swellTxt(d.P)} · wind-sea ${fmt(ss.windH)} m · ${arrow(d.P.wd,12)} ${compass(d.P.wd)} ${fmt(d.P.ws,0)} m/s</div>
       <div class="strip-h">${d.hs.map(h=>`<i style="background:${h.cls.c}" title="${tHr(h.t)} ${h.cls.t}"></i>`).join("")}</div>
       <div class="small">${d.big.length?`<span class="warn-t">Too big for you:</span> ${d.big.join(", ")}. `:""}${d.fits.length?`<b>Your size:</b> ${d.fits.slice(0,3).join(", ")}.`:d.big.length?"<b>Nothing in your range.</b>":"Mostly too small or messy."}</div></div>`; }).join("")}</div>
   <div class="legend-r small">${[["Clean groundswell","#1fa463"],["Moderate","#f2b01e"],["Small","#6da7ec"],["Mixed / lumpy","#f07a2a"],["Big & powerful","#7a3fbf"],["Stormy","#b42324"]].map(([t,c])=>`<span><i style="background:${c}"></i>${t}</span>`).join("")}</div>
   <p class="small"><b>Today's read:</b> ${D[0].cls.d}</p></div>`;
}

function renderHome(){
  const M=STATE, el=$("#view"), slots=allSlots(M), top=slots[0];
  const spotBest=S=>slots.find(x=>x.S===S);
  let hero="";
  if(top){
    const s=top.S.spot, P=top.peakH.P, T=tier(top.pPeak);
    hero=`<a class="hero" href="#spot-${s.id}" data-t="${top.peakH.t}">
      <div class="hero-k">Best slot for you · next 5 days <span class="tier ${T.c}">${T.t}</span></div>
      <div class="hero-row"><div><div class="hero-spot">${esc(s.name)}</div><div class="hero-when">${tDay(top.start)} · ${tHr(top.start)}–${tHr(top.end)}</div></div>
      <div class="hero-p"><b>${pct(top.pPeak)}</b><span>chance of a<br>good session</span></div></div>
      <div class="hero-surf"><span class="big">${rangeTxt(top.peakH)}<small>m</small></span><span>${sizeWords(P.hb)}<br>${chip(top.peakH.q)} ${cleanChip(P)}</span></div>
      <div class="hero-meta">${arrow(P.wd,14)} ${compass(P.wd)} ${fmt(P.ws,0)} m/s · ${K.windLabel(P.rel,P.ws)} · swell ${swellTxt(P)} · tide ${tideTxt(top.peakH)}</div>
      ${planHtml(s, top)}${gearHtml(top.S, top.peakH, true)}</a>`;
  }
  const list = slots.slice(0,6).map((sl,i)=>{ const s=sl.S.spot, T=tier(sl.pPeak);
    return `<details class="slot" ${i===0?"open":""}><summary>
      <span class="slot-p"><b>${pct(sl.pPeak)}</b><span class="tier ${T.c}">${T.t}</span></span>
      <span class="slot-main"><b>${esc(s.name)}</b><span>${tDay(sl.start)} · ${tHr(sl.start)}–${tHr(sl.end)}</span></span>
      <span class="slot-r">${chip(sl.peakH.q)}<span>${rangeTxt(sl.peakH)} m · ${sl.peakH.P.cleanW.toLowerCase()}</span></span></summary>
      ${planHtml(s, sl)}${gearHtml(sl.S, sl.peakH, true)}${whyHtml(sl.S, sl.peakH)}${locHtml(s)}
      <a class="btn small-btn" href="#spot-${s.id}" data-t="${sl.peakH.t}">Open ${esc(s.name)} forecast →</a></details>`; }).join("");
  const days=[...new Set(M.spots[0].hours.filter(h=>!h.past&&h.day).map(h=>dayKey(h.t)))].slice(0,5);
  const rows=M.spots.map(S=>{
    const s=S.spot, nowH=S.hours.find(h=>!h.past)||S.hours[0], P=nowH.P, b=spotBest(S);
    const strip=days.map(dk=>{ const hs=S.hours.filter(h=>dayKey(h.t)===dk&&h.day&&!h.past&&h.p!=null);
      const best=hs.reduce((a,h)=>!a||h.p>a.p?h:a,null); const i=best?ratingIdx(best.q):-1; const big=hs.length&&hs.every(h=>h.P&&h.P.tooBig);
      return `<span class="seg"><i style="background:${big?"#7a3fbf":i>=0?RATINGS[i].c:"#e2e5e9"}"></i><em>${best?tWd(best.t).slice(0,2)+" "+(big?"big":pct(best.p)):""}</em></span>`; }).join("");
    const ri=ratingIdx(nowH.q);
    return `<a class="row" href="#spot-${s.id}">
      <span class="stripe" style="background:${P&&P.tooBig?"#7a3fbf":ri>=0?RATINGS[ri].c:"#cfd3d8"}"></span>
      <div class="row-main"><div class="row-top"><b>${esc(s.name)}</b><span class="muted">faces ${compass(s.facing)} · ${esc(s.level.split(" ")[0])}</span></div>
        <div class="row-now"><span class="muted small">Now</span><span class="surf">${rangeTxt(nowH)} m</span>${chip(nowH.q)}${P&&P.tooBig?bigChip(P):cleanChip(P)}<span class="wind">${P?arrow(P.wd,13)+" "+fmt(P.ws,0)+" "+K.windLabel(P.rel,P.ws):""}</span></div>
        <div class="strip">${strip}</div></div>
      <div class="row-next">${b?`<b>${pct(b.pPeak)}</b><span>${tWd(b.start)} ${tHr(b.start)}</span>`:`<span class="muted">–</span>`}</div></a>`;
  }).join("");
  let cmp="";
  if(top){
    const t=top.peakH.t, P0=top.peakH.P;
    const r=M.spots.map(S=>({S,h:S.hours.find(h=>h.t===t)})).filter(x=>x.h).sort((a,b)=>(b.h.p||0)-(a.h.p||0));
    cmp=`<div class="card"><h3>Why the pick differs by spot</h3>
      <p class="small muted">All spots at the best slot (${tDay(t)} ${tHr(t)}): same ocean – swell ${swellTxt(P0)}, wind ${compass(P0.wd)} ${fmt(P0.ws,0)} m/s – but each beach faces a different way and is sheltered differently by the peninsula, Baleal and the harbour walls.</p>
      <table class="cmp">${r.map(({S,h})=>`<tr><td><a href="#spot-${S.spot.id}" data-t="${t}"><b>${esc(S.spot.name)}</b></a><br><span class="muted small">faces ${compass(S.spot.facing)}</span></td><td>${chip(h.q)}<br><b>${pct(h.p)}</b></td><td class="small">${reason(S,h)}</td></tr>`).join("")}</table></div>`;
  }
  const matrix=`<div class="card"><h3>Which wind is offshore where</h3>
    <p class="small muted">The peninsula means there is almost always a beach facing away from the wind. That beach is your clean option – if the swell reaches it.</p>
    <div class="tbl-wrap"><table class="mx"><tr><th></th>${DIRS8.map(d=>`<th>${d[0]}</th>`).join("")}</tr>
    ${SPOTS.map(s=>`<tr><td><a href="#spot-${s.id}">${esc(s.name)}</a></td>${windGuide(s).map(x=>`<td title="${x.txt}">${WIND_ICON[x.code]}</td>`).join("")}</tr>`).join("")}</table></div>
    <div class="legend-r small"><span>${WIND_ICON.off} offshore</span><span>${WIND_ICON.side} side-off</span><span>${WIND_ICON.cross} cross</span><span>${WIND_ICON.on} onshore</span></div>
    <h3 style="margin-top:14px">Which swell reaches where</h3>
    <p class="small muted">Share of a 12 s offshore swell that gets into each beach (swell window × shelter).</p>
    <div class="tbl-wrap"><table class="mx"><tr><th></th>${SWELL_DIRS.map(d=>`<th>${d[0]}</th>`).join("")}</tr>
    ${SPOTS.map(s=>`<tr><td><a href="#spot-${s.id}">${esc(s.name)}</a></td>${SWELL_DIRS.map(([,d])=>`<td>${swellCell(s,d)}</td>`).join("")}</tr>`).join("")}</table></div>
    <div class="legend-r small"><span><span class="gi build">●</span> most of it</span><span><span class="gi small">◐</span> part</span><span><span class="gi small">○</span> little</span><span><span class="gi none">–</span> blocked</span></div>
    <p class="small"><b>In short:</b> N wind (the summer nortada) → south side: Supertubos, Molhe Leste, Consolação. S–SE wind (autumn/winter) → north side: Baleal Norte, Lagide, Meio da Baía. E wind → almost everywhere is clean. Too big? → Molhe Leste and Cantinho da Baía see only about half the swell. W–SW wind is onshore nearly everywhere – then only Cantinho da Baía is semi-protected.</p></div>`;
  el.innerHTML = `${comfortBar()}${hero || `<div class="hero quiet"><div class="hero-spot">Nothing in your range</div><div class="hero-when">Check the ocean state below</div></div>`}
    ${oceanCard(M)}
    <div class="sec-h"><h2>Best slots</h2><span class="muted small">≥ Fair and ≤ ${fmt(COMFORT_M)} m</span></div>
    <div class="slots">${list||'<p class="muted">No slot in your range in the next days.</p>'}</div>
    <div class="sec-h"><h2>Map</h2><span class="muted small">tap a spot</span></div>
    <div class="mapbox" id="ovMap"></div>
    <div class="sec-h"><h2>Spots</h2><span class="muted small">now · day by day · best</span></div>
    <div class="list">${rows}</div>
    <div class="legend-r">${RATINGS.map(r=>`<span><i style="background:${r.c}"></i>${r.t}</span>`).join("")}<span><i style="background:#7a3fbf"></i>Too big for you</span> <a href="#model" class="link">How ratings work →</a></div>
    ${cmp}${matrix}`;
  el.querySelectorAll("[data-t]").forEach(a=>a.addEventListener("click",()=>{ VIEW.sel=+a.dataset.t; VIEW.day=dayKey(+a.dataset.t); }));
  bindComfort(); drawOverviewMap(M, slots);
}

/* ============================ SPOT ============================ */
function tideDayHtml(dk){
  const T=STATE.turns.filter(x=>dayKey(x.t)===dk); if(!T.length) return "";
  return `<div class="tides">${T.map(x=>`<span>${x.hi?"High":"Low"} <b>${tHr(x.t)}</b> <em>${x.h>0?"+":""}${fmt(x.h,1)} m</em></span>`).join("")}</div>`;
}
function renderSpot(id){
  const S=STATE.spots.find(x=>x.spot.id===id); if(!S){ location.hash="#home"; return; }
  const s=S.spot, future=S.hours.filter(h=>!h.past), slots=spotSlots(S);
  const days=[...new Set(S.hours.map(h=>dayKey(h.t)))].filter(dk=>S.hours.some(h=>dayKey(h.t)===dk&&!h.past));
  const nextDay=future.find(h=>h.day)||future[0]||S.hours[0];
  if(!VIEW.day||!days.includes(VIEW.day)) VIEW.day=slots[0]?dayKey(slots[0].start):dayKey(nextDay.t);
  let sel=S.hours.find(h=>h.t===VIEW.sel);
  if(!sel||dayKey(sel.t)!==VIEW.day){ const sl=slots.find(x=>dayKey(x.start)===VIEW.day); sel=sl?sl.peakH:(S.hours.find(h=>dayKey(h.t)===VIEW.day&&!h.past&&h.day)||nextDay); }
  VIEW.sel=sel.t;
  const P=sel.P||{}, mNow=monthOf(STATE.now), C=S.cal, cl=CLIM&&CLIM[s.id];
  const tabs=days.map(dk=>{ const sl=slots.find(x=>dayKey(x.start)===dk); const i=sl?ratingIdx(sl.peakH.q):-1;
    return `<button class="dtab ${dk===VIEW.day?"on":""}" data-d="${dk}"><span>${tWd(S.hours.find(h=>dayKey(h.t)===dk).t)}</span><b>${sl?pct(sl.pPeak):"–"}</b><em>${sl?rangeTxt(sl.peakH)+" m":""}</em><i style="background:${i>=0?RATINGS[i].c:"#e2e5e9"}"></i></button>`; }).join("");
  const dh=S.hours.filter(h=>dayKey(h.t)===VIEW.day&&(VIEW.night||h.day||h.t===sel.t));
  const rows=dh.map(h=>{ const p=h.P||{}; return `<tr class="${h.t===sel.t?"sel":""} ${h.past?"past":""}" data-t="${h.t}">
     <td>${tHr(h.t)}</td><td><b>${pct(h.p)}</b></td><td>${p.tooBig?`<span class="chip" style="--c:#7a3fbf">Too big</span>`:chip(h.q)}</td><td class="num"><b>${rangeTxt(h)}</b></td>
     <td class="num">${p.ss?`${fmt(p.ss.primary&&p.ss.primary.H)}<small> m</small> ${fmt(p.ss.primary&&p.ss.primary.T,0)}<small>s</small> <span class="muted">${compass(p.ss.dir)}</span>`:"–"}</td>
     <td class="num">${arrow(p.wd,13)} ${fmt(p.ws,0)}<small>${h.gust!=null?"–"+fmt(h.gust,0):""}</small> <span class="muted">${p.ws!=null?K.windLabel(p.rel,p.ws):""}</span></td>
     <td>${p.cleanW?`<span class="cdot" style="--c:${CLEAN_C[p.cleanW]}"></span>${p.cleanW}`:"–"}</td><td>${tideTxt(h)}</td></tr>`; }).join("");
  const sims=similarSessions(s.id, P), mySess=SESSIONS.filter(x=>x.spot===s.id).sort((a,b)=>b.start-a.start);
  const slotRows=slots.slice().sort((a,b)=>a.start-b.start).map(sl=>{ const T=tier(sl.pPeak), q=sl.peakH.P;
    return `<tr data-t="${sl.peakH.t}" class="${dayKey(sl.start)===VIEW.day?"sel":""}"><td><b>${tWd(sl.start)}</b> ${tHr(sl.start)}–${tHr(sl.end)}</td><td><b>${pct(sl.pPeak)}</b><br><span class="tier ${T.c}">${T.t}</span></td><td>${chip(sl.peakH.q)}<br><span class="small">${rangeTxt(sl.peakH)} m${q.tooBig?" · too big":""}</span></td><td class="small">${arrow(q.wd,12)} ${compass(q.wd)} ${fmt(q.ws,0)} ${K.windLabel(q.rel,q.ws)}<br>${q.cleanW}</td><td class="small">tide ${tideTxt(sl.peakH)}</td></tr>`; }).join("");
  const guide=windGuide(s), selSlot=slots.find(x=>x.hours.includes(sel));
  const comps=(P.parts||[]).filter(c=>c.H>0.05).sort((a,b)=>b.H-a.H);
  $("#view").innerHTML=`
   <div class="sp-head"><a class="back" href="#home" aria-label="Back">‹</a>
     <div><h1>${esc(s.name)}</h1><div class="muted">${esc(s.area)} · faces ${compass(s.facing)} · ${s.driveMin} min from ${ORIGIN.name}</div></div></div>
   <div class="now-card">
     <div class="now-top"><div><div class="muted small">${tDay(sel.t)} · ${tHr(sel.t)}${sel.past?" (past)":""}</div>
       <div class="big">${rangeTxt(sel)}<small>m</small></div><div>${sizeWords(P.hb)} ${P.tooBig?bigChip(P):""}</div></div>
       <div class="now-r">${chip(sel.q)}<div class="pct"><b>${pct(sel.p)}</b><span>chance of a<br>good session</span></div></div></div>
     <div class="stats">
       <div><span>Wind</span><b>${arrow(P.wd,14)} ${compass(P.wd)} ${fmt(P.ws,0)}</b><em>${P.ws!=null?K.windLabel(P.rel,P.ws):""}${sel.gust!=null?` · g${fmt(sel.gust,0)}`:""}</em></div>
       <div><span>Swell</span><b>${P.ss&&P.ss.primary?fmt(P.ss.primary.H)+" m":"–"}</b><em>${P.ss&&P.ss.primary?fmt(P.ss.primary.T,0)+" s "+compass(P.ss.primary.dir):""}</em></div>
       <div><span>Surface</span><b>${P.cleanW||"–"}</b><em>${sel.cls?sel.cls.t:""}</em></div>
       <div><span>Tide</span><b>${tideTxt(sel)}</b><em>${sel.tideV!=null?(sel.tideV>0?"+":"")+fmt(sel.tideV,1)+" m":""}</em></div>
     </div>
     ${P.tooBig?`<div class="note">Bigger than your ${fmt(COMFORT_M)} m limit at this hour. ${shelterTip(sel.t, s.id)}</div>`:""}
     ${selSlot?planHtml(s, selSlot):""}
   </div>
   <div class="card"><h3>Why · ${tDay(sel.t)} ${tHr(sel.t)}</h3>${whyHtml(S, sel)}${checklist(S, sel)}</div>
   <div class="card"><h3>What's in the water</h3><p class="small muted">Offshore swell trains (model partitions) and how much of each this beach turns into surf.</p>
     <table class="mc"><tr><th>Train</th><th>Offshore</th><th>From</th><th>At ${esc(s.name)}</th></tr>
     ${comps.map(c=>`<tr><td>${c.kind==="wind"?"Local wind-sea":c.kind==="swell"?"Primary swell":"Secondary swell"}</td><td>${fmt(c.H)} m @ ${fmt(c.T,0)} s</td><td>${arrow((c.dir+180)%360,12)} ${compass(c.dir)}</td><td><b>${fmt(c.hb)} m</b></td></tr>`).join("")}</table>
     ${sel.cls?`<p class="small"><b>${sel.cls.t}:</b> ${sel.cls.d}</p>`:""}</div>
   <div class="card"><h3>Board & wetsuit · ${tDay(sel.t)} ${tHr(sel.t)}</h3>${gearHtml(S, sel)}</div>
   <div class="card"><h3>Best time slots · next 5 days</h3><p class="small muted">Best daylight block per day for your size range. Tap to open that day.</p>
     <div class="tbl-wrap"><table class="hours slotsT"><thead><tr><th>Slot</th><th>Chance</th><th>Rating</th><th>Wind · surface</th><th>Tide</th></tr></thead><tbody>${slotRows||"<tr><td colspan=5 class='muted'>No daylight data</td></tr>"}</tbody></table></div></div>
   <div class="card"><h3>Chance by hour · 5 days</h3><div id="pChart"></div></div>
   <div class="dtabs">${tabs}</div>
   <div class="card"><div class="ch-h"><h3>Hour by hour</h3><label class="tog"><input type="checkbox" id="night" ${VIEW.night?"checked":""}> night</label></div>
     ${tideDayHtml(VIEW.day)}
     <div id="dayChart"></div>
     <div class="tbl-wrap"><table class="hours"><thead><tr><th>Time</th><th>Chance</th><th>Rating</th><th>Surf m</th><th>Swell</th><th>Wind m/s</th><th>Surface</th><th>Tide</th></tr></thead><tbody>${rows}</tbody></table></div></div>
   <div class="card"><h3>Location</h3>${locHtml(s)}<div class="mapbox small-map" id="spMap"></div><p class="small muted">Google Maps satellite view. Positions are approximate.</p></div>
   <div class="card"><h3>What makes ${esc(s.name)} work</h3><p>${esc(s.desc)}</p>
     <dl class="kv"><dt>Needs</dt><dd>${esc(s.swellNeed)}</dd><dt>Best wind</dt><dd>${esc(s.idealWind)}</dd><dt>Tide</dt><dd>${esc(s.tideTxt)}</dd><dt>Bottom</dt><dd>${esc(s.bottom)}</dd><dt>Level</dt><dd>${esc(s.level)}</dd><dt>Too big at</dt><dd>~${fmt(s.maxHold)} m faces (closes out / dangerous)</dd><dt>Hazards</dt><dd>${esc(s.hazards)}</dd></dl>
     <h3 style="margin-top:14px">Wind direction guide</h3>
     <table class="cmp">${guide.map(x=>`<tr><td><b>${x.n}</b></td><td>${WIND_ICON[x.code]}</td><td class="small">${x.txt}</td></tr>`).join("")}</table></div>
   <div class="card"><h3>Swell window</h3><div id="rose"></div></div>
   <div class="card"><h3>Model check · ${tHr(sel.t)}</h3>
     <table class="mc"><tr><th></th><th>Swell</th><th>Surf</th><th>Rating</th></tr>
     ${SCEN.map(x=>{const y=sel.scen.find(z=>z.key===x.key);return `<tr><td>${x.label}</td><td>${y?swellTxt(y):"n/a"}</td><td>${y?fmt(y.hb):"–"}</td><td>${y?chip(y.q):"–"}</td></tr>`}).join("")}</table>
     <p class="small muted">Agreement between the three wave models raises the chance; disagreement lowers it.</p>
     ${C&&C.n?`<p class="small">Calibrated from your ${C.n} session${C.n>1?"s":""}: size ×${fmt(C.size,2)}, rating ${C.qBias>=0?"+":""}${fmt(C.qBias*100,0)} pts.</p>`:""}
     ${sims.length?`<p class="small"><b>${sims.length} similar logged session${sims.length>1?"s":""}</b> here averaged <b>${RATINGS[Math.round(sims.reduce((a,x)=>a+x.rating,0)/sims.length)].t}</b>.</p>`:""}</div>
   <a class="btn primary block" href="#log-${s.id}">＋ Log a session at ${esc(s.name)}</a>
   <div class="card"><h3>Historic base rate</h3><p class="muted small">Share of daylight hours that are ≥ Fair for you (dark) and too big for you (purple): 3 years of wave hindcast + ERA5 wind through the same model${CLIM?` (${CLIM.range})`:""}.</p><div id="climChart">${cl?"":"<p class='muted'>Loading…</p>"}</div>
     ${cl?`<p class="small">Typical ${new Intl.DateTimeFormat("en-GB",{month:"long"}).format(new Date(2026,mNow,1))}: <b>${Math.round(cl[mNow].pct*100)}%</b> good for you, <b>${Math.round(cl[mNow].big*100)}%</b> too big, ~<b>${fmt(cl[mNow].days,1)}</b> good days.</p>`:""}</div>
   ${mySess.length?`<div class="card"><h3>Your sessions here</h3>${sessList(mySess.slice(0,5))}</div>`:""}`;
  $("#view").querySelectorAll(".dtab").forEach(b=>b.onclick=()=>{ VIEW.day=b.dataset.d; VIEW.sel=null; renderSpot(id); });
  $("#view").querySelectorAll("tr[data-t]").forEach(r=>r.onclick=()=>{ VIEW.sel=+r.dataset.t; VIEW.day=dayKey(+r.dataset.t); renderSpot(id); });
  $("#night").onchange=e=>{ VIEW.night=e.target.checked; renderSpot(id); };
  drawDayChart(S, dh, sel, id); drawPChart(S, sel, id); drawRose(s); if(cl) drawClim(cl, mNow); drawSpotMap(S); bindDeletes();
}
function shelterTip(t, exceptId){
  const alt=STATE.spots.filter(X=>X.spot.id!==exceptId).map(X=>({X,h:X.hours.find(h=>h.t===t)})).filter(x=>x.h&&x.h.P&&!x.h.P.tooBig&&x.h.P.hb>=x.X.spot.minWave*0.8).sort((a,b)=>b.h.q-a.h.q);
  return alt.length?`In your range then: <b>${alt.slice(0,2).map(x=>`${esc(x.X.spot.name)} ${rangeTxt(x.h)} m`).join(", ")}</b>.`:"Nothing nearby is in your range – a day to watch, not surf.";
}

function drawPChart(S, sel, id){
  const host=$("#pChart"), W=Math.max(300,host.clientWidth), H=100, PL=30, PT=8;
  const hs=S.hours.filter(h=>!h.past&&h.day); if(!hs.length){ host.innerHTML=""; return; }
  const n=hs.length, gap=4, days=[...new Set(hs.map(h=>dayKey(h.t)))], slotW=(W-PL-gap*(days.length-1))/n;
  let g=""; [0,0.5,1].forEach(v=>{ const y=PT+(1-v)*H; g+=`<line x1="${PL}" x2="${W}" y1="${y}" y2="${y}" class="grid"/><text x="${PL-4}" y="${y+3}" text-anchor="end" class="ax">${v*100}%</text>`; });
  let x=PL, prev=null;
  hs.forEach(h=>{ const dk=dayKey(h.t); if(prev&&dk!==prev) x+=gap; if(dk!==prev) g+=`<text x="${x}" y="${PT+H+13}" class="ax b">${tWd(h.t)}</text>`; prev=dk;
    const i=ratingIdx(h.q), bh=Math.max(1,(h.p||0)*H), big=h.P&&h.P.tooBig;
    g+=`<rect x="${x+0.5}" y="${PT+H-(big?H*0.12:bh)}" width="${Math.max(1,slotW-1)}" height="${big?H*0.12:bh}" rx="1.5" fill="${big?"#7a3fbf":i>=0?RATINGS[i].c:"#cfd3d8"}"><title>${tDay(h.t)} ${tHr(h.t)} · ${pct(h.p)}${big?" · too big":""}</title></rect>`;
    if(h.t===sel.t) g+=`<rect x="${x-0.5}" y="${PT-2}" width="${slotW+1}" height="${H+4}" fill="none" stroke="#0b1f33" stroke-width="1.5"/>`;
    g+=`<rect class="hit" data-t="${h.t}" x="${x}" y="0" width="${slotW}" height="${H+PT}" fill="transparent"/>`;
    x+=slotW; });
  g+=`<line x1="${PL}" x2="${W}" y1="${PT+H*0.4}" y2="${PT+H*0.4}" stroke="#0b1f33" stroke-dasharray="3 3" opacity=".5"/><text x="${W-2}" y="${PT+H*0.4-3}" text-anchor="end" class="ax">Go ≥ 60%</text>`;
  host.innerHTML=`<svg viewBox="0 0 ${W} ${H+PT+18}" width="100%" height="${H+PT+18}" role="img" aria-label="Chance of a good session by daylight hour">${g}</svg><p class="small muted">Daylight hours only; colour = rating (purple stub = too big for you), height = chance of a ≥ Fair session.</p>`;
  host.querySelectorAll(".hit").forEach(r=>r.addEventListener("click",()=>{ VIEW.sel=+r.dataset.t; VIEW.day=dayKey(+r.dataset.t); renderSpot(id); }));
}
function drawDayChart(S, hs, sel, id){
  const host=$("#dayChart"), W=Math.max(300,host.clientWidth), H=150, PL=30, PR=6, PT=18;
  if(!hs.length){ host.innerHTML=""; return; }
  const max=Math.max(1, Math.ceil(Math.max(COMFORT_M*1.1, ...hs.map(h=>h.hi||0))*2)/2);
  const bw=(W-PL-PR)/hs.length, y=v=>PT+(H-PT)-clamp(v/max,0,1)*(H-PT);
  let g=""; for(let v=0;v<=max+1e-9;v+=0.5){ g+=`<line x1="${PL}" x2="${W-PR}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${PL-5}" y="${y(v)+3}" text-anchor="end" class="ax">${v}</text>`; }
  g+=`<line x1="${PL}" x2="${W-PR}" y1="${y(COMFORT_M)}" y2="${y(COMFORT_M)}" stroke="#7a3fbf" stroke-width="1.5" stroke-dasharray="5 3"/><text x="${W-PR}" y="${y(COMFORT_M)-3}" text-anchor="end" class="ax" style="fill:#7a3fbf">your max</text>`;
  hs.forEach((h,i)=>{ const x=PL+i*bw+1, w=Math.max(2,bw-2), ri=ratingIdx(h.q), c=h.P&&h.P.tooBig?"#7a3fbf":ri>=0?RATINGS[ri].c:"#cfd3d8";
    if(h.lo!=null){ const top=y(h.hi), mid=y(Math.max(0,(h.P?h.P.hb:h.lo)));
      g+=`<rect x="${x}" y="${top}" width="${w}" height="${Math.max(1,y(0)-top)}" rx="${Math.min(4,w/2)}" fill="${c}" opacity="0.3"/>`;
      g+=`<rect x="${x}" y="${mid}" width="${w}" height="${Math.max(1,y(0)-mid)}" rx="${Math.min(4,w/2)}" fill="${c}" opacity="${h.past?0.5:1}"/>`; }
    if(h.t===sel.t) g+=`<rect x="${x-1}" y="${PT-4}" width="${w+2}" height="${H-PT+4}" fill="none" stroke="#0b1f33" stroke-width="1.5" rx="3"/>`;
    if(i%2===0||hs.length<10) g+=`<text x="${x+w/2}" y="${H+13}" text-anchor="middle" class="ax">${hourOf(h.t)}</text>`;
    g+=`<rect class="hit" data-i="${i}" x="${PL+i*bw}" y="0" width="${bw}" height="${H+16}" fill="transparent"/>`; });
  host.innerHTML=`<svg viewBox="0 0 ${W} ${H+18}" width="100%" height="${H+18}" role="img" aria-label="Hourly surf height">${g}<text x="${PL}" y="10" class="ax">surf height m (solid = Météo-France run · faint = model spread)</text></svg>`;
  host.querySelectorAll(".hit").forEach(r=>{ const h=hs[+r.dataset.i]; r.addEventListener("click",()=>{ VIEW.sel=h.t; renderSpot(id); }); });
}
function drawRose(s){
  const R=100, cx=120, cy=120; let g="";
  const P=(a,r)=>[cx+Math.sin(a*RAD)*r, cy-Math.cos(a*RAD)*r];
  [0.25,0.5,0.75,1].forEach(f=>{ g+=`<circle cx="${cx}" cy="${cy}" r="${f*R}" class="grid" fill="none"/>`; });
  for(let d=0; d<360; d+=10){ const f=K.windowFactor(s,d,12)*s.exposure, r=Math.max(2,f*R), [xa,ya]=P(d-4.5,r), [xb,yb]=P(d+4.5,r);
    g+=`<path d="M${cx},${cy} L${xa},${ya} A${r},${r} 0 0 1 ${xb},${yb} Z" fill="#2a78d6" stroke="#fff" stroke-width="1"><title>${compass(d)} swell: ${Math.round(f*100)}% gets in</title></path>`; }
  ["N","E","S","W"].forEach((l,i)=>{ const [x,y]=P(i*90,R+12); g+=`<text x="${x}" y="${y+4}" text-anchor="middle" class="ax b">${l}</text>`; });
  const [bx,by]=P(s.facing,R*0.45); g+=`<line x1="${cx}" y1="${cy}" x2="${bx}" y2="${by}" stroke="#0b1f33" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="3" fill="#0b1f33"/>`;
  const [ox,oy]=P((s.facing+180)%360,R*0.7); g+=`<text x="${ox}" y="${oy}" text-anchor="middle" class="ax" style="fill:#1fa463;font-weight:700">offshore</text>`;
  $("#rose").innerHTML=`<div class="rose"><svg viewBox="0 0 240 240" width="240" height="240" role="img" aria-label="Swell window">${g}</svg>
    <div class="small"><p>How much of a 12 s swell from each direction reaches ${esc(s.name)} – long swells wrap a little further around the peninsula, short ones less.</p><p>Best: <b>${compass(s.bestSwell)}</b>. Dark line = beach faces <b>${compass(s.facing)}</b>; wind from the opposite side (${compass((s.facing+180)%360)}) is offshore.</p>${s.exposure<0.8?`<p>Sheltered: only ~${Math.round(s.exposure*100)}% of the open-ocean size even from the best direction.</p>`:""}</div></div>`;
}
function drawClim(cl, mNow){
  const W=Math.max(280,$("#climChart").clientWidth), H=90, PL=34, bw=(W-PL)/12, max=Math.max(0.1,Math.ceil(Math.max(...cl.map(c=>Math.max(c.pct,c.big)))*10)/10);
  let g=""; [0,max/2,max].forEach(v=>{const y=H-v/max*H+8; g+=`<line x1="${PL}" x2="${W}" y1="${y}" y2="${y}" class="grid"/><text x="${PL-4}" y="${y+3}" text-anchor="end" class="ax">${Math.round(v*100)}%</text>`;});
  "JFMAMJJASOND".split("").forEach((m,i)=>{ const h=cl[i].pct/max*H, hb=cl[i].big/max*H, x=PL+i*bw+2, w=(bw-6)/2;
    g+=`<rect x="${x}" y="${H-h+8}" width="${w}" height="${Math.max(0,h)}" rx="2" fill="${i===mNow?"#184f95":"#86b6ef"}"><title>${Math.round(cl[i].pct*100)}% good for you</title></rect>`;
    g+=`<rect x="${x+w+1}" y="${H-hb+8}" width="${w}" height="${Math.max(0,hb)}" rx="2" fill="#7a3fbf" opacity="${i===mNow?1:0.55}"><title>${Math.round(cl[i].big*100)}% too big</title></rect>`;
    g+=`<text x="${x+w}" y="${H+21}" text-anchor="middle" class="ax">${m}</text>`; });
  $("#climChart").innerHTML=`<svg viewBox="0 0 ${W} ${H+24}" width="100%" height="${H+24}">${g}</svg>`;
}

/* ============================ RATINGS EXPLAINED ============================ */
const RATING_DEF = [
  ["Flat","< 0.15","Nothing rideable for you – flat, or so far beyond your limit it doesn't count."],
  ["Poor","0.15–0.30","Tiny, blown out, or too big. Not worth it."],
  ["Poor–Fair","0.30–0.45","Rideable but messy or on the edge of your size range."],
  ["Fair","0.45–0.62","Surfable and fun for you. This is the line for a “good session”."],
  ["Good","0.62–0.80","Your size, clean faces, decent groundswell. Go."],
  ["Firing","≥ 0.80","Long-period swell in your range, offshore or glassy, right tide."]
];
function ratingsCard(){
  return `<div class="card" id="ratings"><h3>How ratings work</h3>
   <p class="small">Every hour gets a quality score <b>q</b> from 0 to 1 – for <b>you</b>, with your max wave set to <b>${comfortName()}</b>:</p>
   <p class="formula">q = Size × Wind × Period × Sea × Tide</p>
   <ul class="small">
    <li><b>Size</b> – breaking height at the beach vs. the spot's minimum and <b>your maximum</b>. Full marks from ~70% of your max up to your max; above it the score drops fast (−70% at 1.3× your max). Waves over 1.15× your max are flagged <b>Too big for you</b>.</li>
    <li><b>Wind</b> – local wind vs. the beach orientation. Offshore/side-off or &lt; 2.5 m/s = 100%; onshore drops to 8–65% – Atlantic onshore wind ruins a groundswell quickly.</li>
    <li><b>Period</b> – 11 s+ groundswell full marks, 8 s fair, &lt; 6 s poor.</li>
    <li><b>Sea</b> – how organised the ocean is: share of local wind-sea, crossing swell trains, period. This is what separates a clean day from a lumpy one at the same size.</li>
    <li><b>Tide</b> – each spot's preferred tide (from the sea-level forecast), up to −32%.</li>
   </ul>
   <table class="cmp">${RATING_DEF.map(([n,r,d])=>{const R=RATINGS.find(x=>x.t===n);return `<tr><td><span class="chip" style="--c:${R.c}">${n}</span></td><td class="small">q ${r}</td><td class="small">${d}</td></tr>`}).join("")}</table>
   <h3 style="margin-top:14px">Surface (how clean)</h3>
   <p class="small">${Object.entries(CLEAN_C).map(([k,c])=>`<span class="chip" style="--c:${c}">${k}</span>`).join(" ")}<br>65% the wind on the faces at that beach, 35% the sea itself (wind-sea share, crossing swells).</p>
   <h3 style="margin-top:14px">Ocean state (whole coast)</h3>
   <table class="cmp small">
    <tr><td><span class="chip" style="--c:#1fa463">Clean groundswell</span></td><td>Primary swell ≥ 10 s, wind-sea &lt; 25% of the energy.</td></tr>
    <tr><td><span class="chip" style="--c:#f2b01e">Moderate</span></td><td>Mid-period swell with some wind-sea.</td></tr>
    <tr><td><span class="chip" style="--c:#6da7ec">Small</span></td><td>Total sea &lt; 0.7 m offshore.</td></tr>
    <tr><td><span class="chip" style="--c:#f07a2a">Mixed / lumpy</span></td><td>Wind-sea &gt; 45% of the energy, strong crossing swells, or &lt; 7.5 s and &gt; 1 m.</td></tr>
    <tr><td><span class="chip" style="--c:#7a3fbf">Big & powerful</span></td><td>≥ 3 m offshore, or ≥ 2.3 m at 14 s+. Exposed beaches close out; rips.</td></tr>
    <tr><td><span class="chip" style="--c:#b42324">Stormy</span></td><td>Wind-sea ≥ 1.6 m, ≥ 4.5 m total, or wind ≥ 14 m/s. Not a surf day.</td></tr></table>
   <h3 style="margin-top:14px">What the % means</h3>
   <p class="small"><b>Chance of a good session</b> = probability the hour rates <b>Fair or better for you</b>. It combines three wave models – Météo-France MFWAM (45%), ECMWF WAM (30%), NOAA GFS-Wave (25%) – and leans on the spot's 3-year history the further ahead you look. <b>Go</b> ≥ 60% · <b>Worth a look</b> 40–60% · <b>Long shot</b> 20–40%.</p>
   <h3 style="margin-top:14px">Wetsuit guide (Peniche water 14–20 °C)</h3>
   <table class="cmp small">${SUITS.map((x,i)=>`<tr><td><b>${i===SUITS.length-1?"&lt; 12":x[0]+(i?"–"+SUITS[i-1][0]:"+")}°C</b></td><td>${x[1]}${x[2]?" + "+x[2]:""}</td><td>${x[3][0]}–${x[3][1]} min</td></tr>`).join("")}</table></div>`;
}

/* ============================ LOG ============================ */
function sessList(list){
  if(!list.length) return `<p class="muted">No sessions yet.</p>`;
  return `<div class="sess">${list.map(x=>{ const sp=SPOTS.find(s=>s.id===x.spot); const p=x.pred;
    return `<div class="sitem"><div><b>${esc(sp?sp.name:x.spot)}</b> <span class="muted">${tDay(x.start)} ${tHr(x.start)}–${tHr(x.end)}</span></div>
     <div>You: ${x.rating!=null?`<span class="chip" style="--c:${RATINGS[x.rating].c}">${RATINGS[x.rating].t}</span>`:""} ${x.size!=null?SIZES[x.size].t:""} ${x.surface?"· "+esc(x.surface):""}</div>
     <div class="muted small">Model: ${p?`${chip(p.q)} ${fmt(p.hb)} m surf · swell ${fmt(p.Hs)} m · wind ${compass(p.wd)} ${fmt(p.ws,0)} (${p.src})`:"no model data stored"}</div>
     ${x.notes?`<div class="small">“${esc(x.notes)}”</div>`:""}
     <button class="link danger" data-del="${x.id}">delete</button></div>`; }).join("")}</div>`;
}
function renderLog(preSpot){
  const now=new Date(), pad=n=>String(n).padStart(2,"0");
  const local=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const st=new Date(now.getTime()-2*3600e3);
  $("#view").innerHTML=`<div class="page-h"><h1>Log a session</h1><p class="muted">Your ratings teach the model how each spot really behaves – and where your comfort limit really is.</p></div>
   <form class="card form" id="lf">
    <label>Spot<select name="spot">${SPOTS.map(s=>`<option value="${s.id}" ${s.id===preSpot?"selected":""}>${esc(s.name)}</option>`).join("")}</select></label>
    <div class="two"><label>Date<input type="date" name="date" value="${local(now)}" max="${local(now)}"></label>
    <label>From<input type="time" name="from" value="${pad(st.getHours())}:00"></label><label>To<input type="time" name="to" value="${pad(now.getHours())}:00"></label></div>
    <p class="small muted">Times are your phone's local time.</p>
    <fieldset><legend>How good was it for you?</legend><div class="opts">${RATINGS.map((r,i)=>`<label class="opt"><input type="radio" name="rating" value="${i}"><span style="--c:${r.c}">${r.t}</span></label>`).join("")}</div></fieldset>
    <fieldset><legend>Wave size (sets)</legend><div class="opts">${SIZES.map((z,i)=>`<label class="opt"><input type="radio" name="size" value="${i}"><span>${z.t}</span></label>`).join("")}</div></fieldset>
    <fieldset><legend>Surface</legend><div class="opts">${["Glassy","Clean","Bumpy","Choppy","Blown out"].map(z=>`<label class="opt"><input type="radio" name="surface" value="${z}"><span>${z}</span></label>`).join("")}</div></fieldset>
    <label>Notes<textarea name="notes" rows="2" placeholder="Banks, crowd, tide, too heavy?…"></textarea></label>
    <button class="btn primary block" type="submit">Save session</button><p class="small muted" id="lmsg"></p>
   </form>
   <div class="sec-h"><h2>Your sessions</h2><span class="muted">${SESSIONS.length}</span></div>
   ${sessList(SESSIONS.slice().sort((a,b)=>b.start-a.start))}`;
  $("#lf").onsubmit=async e=>{
    e.preventDefault(); const f=new FormData(e.target), msg=$("#lmsg");
    const toUnix=(d,t)=>Math.floor(new Date(`${d}T${t}:00`).getTime()/1000);
    const start=toUnix(f.get("date"),f.get("from")), end=toUnix(f.get("date"),f.get("to"));
    if(!(end>start)){ msg.textContent="End time must be after start."; return; }
    if(f.get("rating")==null){ msg.textContent="Pick a rating."; return; }
    const sess={id:Date.now().toString(36), spot:f.get("spot"), start, end, rating:+f.get("rating"),
      size:f.get("size")!=null?+f.get("size"):null, surface:f.get("surface")||"", notes:f.get("notes")||"", pred:null, logged:Date.now()};
    msg.textContent="Looking up what the model said for that time…";
    try{ sess.pred=await predictFor(sess.spot,start,end); }catch(err){ console.warn(err); }
    SESSIONS.push(sess); saveSessions(); CAL=calibrate(); if(RAW) rebuild();
    msg.textContent=sess.pred?"Saved – model snapshot stored and calibration updated.":"Saved – couldn't fetch model data for that time (offline?). It still counts for your log.";
    setTimeout(()=>renderLog(sess.spot),900);
  };
  bindDeletes();
}
function bindDeletes(){ document.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{ const i=SESSIONS.findIndex(x=>x.id===b.dataset.del);
  if(i>=0&&b.dataset.armed){ SESSIONS.splice(i,1); saveSessions(); CAL=calibrate(); if(RAW) rebuild(); route(); } else { b.dataset.armed=1; b.textContent="tap again to delete"; } }); }

/* ============================ MODEL / LEARN ============================ */
function renderModel(){
  const c=CAL, cc=CLIM&&CLIM.coast, m=monthOf(Date.now()/1000);
  $("#view").innerHTML=`<div class="page-h"><h1>Model & learning</h1><p class="muted">How Peniche Surf reads the Atlantic, and what it has learned from you.</p></div>
  ${comfortBar()}
  ${ratingsCard()}
  <div class="card"><h3>Peniche vs. the Kattegat</h3>
   <p class="small">In North Zealand every wave is wind-sea made inside the Kattegat, so the app has to model the wind. Peniche sits on the open Atlantic: most surf is <b>groundswell</b> – energy from storms 1,000–3,000 km away that arrives days later, organised into long, evenly spaced lines. That changes what matters:</p>
   <ol class="small">
    <li><b>Period is power.</b> A 1.5 m swell at 14 s breaks far bigger and heavier than 1.5 m at 8 s – shoaling grows long waves much more (Komar–Gaughan breaker height). The forecast surf already includes this.</li>
    <li><b>Wind is a filter, not the engine.</b> The local wind only decides whether the faces are clean. The peninsula gives you every orientation: N wind → the south side, S/SE wind → the north side.</li>
    <li><b>Shelter is your size dial.</b> Molhe Leste and Cantinho da Baía see roughly half of what Supertubos gets. On big days they are where your size is.</li>
    <li><b>Too rough</b> = big long-period swell (closes out, rips), storm sea (big + short period + strong wind) or a mix of wind-sea and crossing swells. The Ocean-state card shows this coast-wide.</li>
    <li><b>Tide</b> matters at the sandbanks (range 1–3.5 m); the app reads the sea-level forecast for each hour.</li>
   </ol></div>
  ${cc?`<div class="card"><h3>How often is it rough? · ${new Intl.DateTimeFormat("en-GB",{month:"long"}).format(new Date(2026,m,1))}</h3><p class="small muted">Daylight hours over the last 3 years (${CLIM.range}).</p>
   <table class="mc">${[["clean","Clean groundswell","#1fa463"],["mod","Moderate","#f2b01e"],["small","Small","#6da7ec"],["mixed","Mixed / lumpy","#f07a2a"],["xl","Big & powerful","#7a3fbf"],["storm","Stormy","#b42324"]].map(([k,t,col])=>`<tr><td><span class="chip" style="--c:${col}">${t}</span></td><td><b>${Math.round((cc[m][k]||0)*100)}%</b></td></tr>`).join("")}</table></div>`:""}
  <div class="card"><h3>What the model has learned</h3>
   <p class="small muted">Each logged session compares your rating and wave size with what the model predicted for that hour. Corrections are shrunk toward "no change" until there are enough sessions.</p>
   <table class="mc"><tr><th>Spot</th><th>Sessions</th><th>Size factor</th><th>Rating shift</th></tr>
   ${SPOTS.map(s=>{const x=c.spots[s.id];return `<tr><td>${esc(s.name)}</td><td>${x.n||0}${x.inherited?" <span class='muted'>(global)</span>":""}</td><td>×${fmt(x.size,2)}</td><td>${x.qBias>=0?"+":""}${fmt(x.qBias*100,0)} pts</td></tr>`}).join("")}</table>
   <div class="btns"><button class="btn" id="exp">Copy backup</button><button class="btn" id="dl">Download backup</button><label class="btn">Import<input type="file" id="imp" accept=".json,application/json" hidden></label></div>
   <p class="small muted" id="bmsg">Sessions are stored on this device only. Back them up now and then.</p></div>
  <div class="card"><h3>The Peniche swell model</h3>
   <ol class="small">
    <li><b>Swell trains offshore</b> (39.30° N 9.55° W): primary swell, secondary swell and local wind-sea from three wave models.</li>
    <li><b>Swell window per beach</b> – a direction factor that widens for longer periods (refraction around the peninsula), times a shelter factor for harbour walls and Baleal island.</li>
    <li><b>Breaking height</b> – Komar–Gaughan breaker formula per train, combined by energy. Short wind-sea is down-weighted: it adds chop, not push.</li>
    <li><b>Quality</b> = size (vs. spot minimum and your max) × wind on the faces × period × sea organisation × tide.</li>
    <li><b>Chance</b> – weighted agreement of the three runs, blended with the 3-year history at longer lead times.</li>
    <li><b>Your sessions</b> scale size and shift ratings per spot.</li>
   </ol></div>
  <div class="card"><h3>Data sources</h3><table class="mc small">
   <tr><td>Swell & wind-sea</td><td>Météo-France MFWAM, ECMWF WAM 0.25°, NOAA GFS-Wave 0.25° via Open-Meteo Marine</td></tr>
   <tr><td>Wind at each beach</td><td>Météo-France AROME/ARPEGE (<code>meteofrance_seamless</code>) + ECMWF IFS</td></tr>
   <tr><td>Tide & water temperature</td><td>Sea-level and SST forecast via Open-Meteo Marine</td></tr>
   <tr><td>Historic base rates</td><td>3-year wave hindcast + ERA5 wind through the same model</td></tr></table>
   <p class="small muted">Spot parameters (orientation, window, shelter, tide) are first estimates from surf guides – your sessions correct them. Not a safety service: check the beach and the flags.</p>
   <p class="small"><a href="../" style="color:var(--accent)">← Nordkyst (North Zealand) version</a></p></div>`;
  bindComfort();
  const json=()=>JSON.stringify({app:"peniche",v:1,sessions:SESSIONS},null,1);
  $("#exp").onclick=async()=>{ try{ await navigator.clipboard.writeText(json()); $("#bmsg").textContent="Copied – paste it into a note or mail to yourself."; }catch(e){ $("#bmsg").textContent="Copy blocked – use Download."; } };
  $("#dl").onclick=()=>{ const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([json()],{type:"application/json"})); a.download="peniche-sessions.json"; a.click(); };
  $("#imp").onchange=async e=>{ try{ const d=JSON.parse(await e.target.files[0].text()); const add=(d.sessions||[]).filter(x=>!SESSIONS.some(y=>y.id===x.id)); SESSIONS.push(...add); saveSessions(); CAL=calibrate(); if(RAW) rebuild(); $("#bmsg").textContent=`Imported ${add.length} sessions.`; }catch(err){ $("#bmsg").textContent="Couldn't read that file."; } };
}

/* ============================ routing / boot ============================ */
function route(){
  hideTip();
  const h=location.hash.slice(1)||"home";
  document.querySelectorAll(".tabbar a").forEach(a=>a.classList.toggle("on", h.startsWith(a.dataset.r)));
  if(h.startsWith("log")) return renderLog(h.split("-")[1]);
  if(h==="model") return renderModel();
  if(!STATE) return;
  if(h.startsWith("spot-")) renderSpot(h.slice(5)); else renderHome();
  if(!h.startsWith("spot-")) window.scrollTo(0,0);
}
let lastSpot=null;
window.addEventListener("hashchange",()=>{ const h=location.hash; if(h.startsWith("#spot-")&&h!==lastSpot) window.scrollTo(0,0); lastSpot=h; route(); });
function rebuild(){ STATE=buildModel(RAW.W, RAW.Wv, RAW.Ws, CLIM, CAL); }
function setStatus(html, cls=""){ $("#status").innerHTML=html; $("#status").className="status "+cls; }

async function boot(){
  setStatus("Loading Atlantic swell & wind…");
  CLIM = load("pn_clim_v1_"+COMFORT_M);
  const cached=load("pn_last_v1");
  let W=null, Wv=null, Ws=null, err=null;
  try{ [W,Wv,Ws]=await Promise.all([fetchWind(), fetchWaves(), fetchSea().catch(e=>{console.warn("sea",e);return null})]); }catch(e){ err=e; }
  if((!W||!Wv) && cached){ W=cached.W; Wv=cached.Wv; Ws=cached.Ws; }
  if(!W||!Wv){
    $("#view").innerHTML=`<div class="card"><h3>Couldn't load forecast data</h3><p>${esc(err&&err.message)}</p>
      <p class="small muted">Peniche Surf fetches data straight from open-meteo.com. If you opened it inside a chat/file preview, those block outside data – open it from its web address or the home-screen app instead.</p>
      <button class="btn primary" onclick="boot()">Try again</button></div>`;
    setStatus("Offline","err"); return;
  }
  if(!err) store("pn_last_v1",{W,Wv,Ws,at:Date.now()});
  RAW={W,Wv,Ws}; rebuild(); route();
  const at=err&&cached?new Date(cached.at):new Date();
  setStatus(`${err?"Offline · data from ":"Updated "}${at.toLocaleString("en-GB",{weekday:"short",hour:"2-digit",minute:"2-digit"})}${Ws?"":" · no tide data"}`, err?"warn":"");
  try{ CLIM=await fetchClimate(); rebuild(); if(location.hash.startsWith("#spot-")||location.hash==="#model") route(); }catch(e){ console.warn("climate",e); }
}
document.addEventListener("DOMContentLoaded",()=>{
  $("#refresh").onclick=()=>boot();
  if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(()=>{});
  route(); boot();
});
