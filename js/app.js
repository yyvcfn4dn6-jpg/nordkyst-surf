/* Nordkyst Surf — app logic */
"use strict";
const K = window.KWM;

/* ============================ SPOTS ============================ */
const SPOTS = [
 {id:"lynaes", name:"Lynæs", area:"Hundested", lat:55.948, lon:11.862, sea:[55.958,11.825], sea2:[55.975,11.80],
  facing:295, bestSwell:320, swellHalf:55, exposure:0.85, minWave:0.4, driveKm:65, driveMin:60,
  bottom:"Sand, gently sloping", level:"Beginner → intermediate",
  swellNeed:"NW windswell squeezing in between Rørvig and Hundested; needs NW 9 m/s+ for 8 h+",
  idealWind:"S–SE (offshore) after a NW blow; tolerates light W",
  desc:"Beach at the mouth of Isefjord – the surf-school hub of North Zealand. Its window to the open Kattegat is narrow (NW only), so it is smaller than the north coast but cleaner and sheltered when it's blowing hard from the W.",
  hazards:"Current near the harbour and fjord mouth.", parking:"Lynæs Strand / surf centre"},
 {id:"liseleje", name:"Liseleje", area:"Halsnæs", lat:56.012, lon:11.963, sea:[56.035,11.93], sea2:[56.06,11.88],
  facing:315, bestSwell:310, swellHalf:65, exposure:0.95, minWave:0.4, driveKm:60, driveMin:60,
  bottom:"Sand with bars, some stones", level:"All levels",
  swellNeed:"W–NW–N windswell; best after 10–15 m/s W/NW",
  idealWind:"SW–S (side-off/offshore) as a W–NW blow eases",
  desc:"NW-facing sandy beach with shifting bars, open to the long NW fetch across the Kattegat. Often the first spot to clean up when a westerly gale backs SW.",
  hazards:"Rips between bars when it's big.", parking:"Liseleje Strandvej"},
 {id:"tisvilde", name:"Tisvildeleje", area:"Gribskov", lat:56.058, lon:12.072, sea:[56.08,12.04], sea2:[56.11,12.00],
  facing:320, bestSwell:315, swellHalf:65, exposure:1.0, minWave:0.4, driveKm:60, driveMin:60,
  bottom:"Sand, outer and inner bars", level:"All levels",
  swellNeed:"NW windswell 0.8 m+ offshore; NW/W 9 m/s+ for half a day",
  idealWind:"S–SW (offshore/side-off); light NW onshore OK when small",
  desc:"Long NW-facing beach backed by Tisvilde Hegn forest. Very exposed to NW so it holds size and has the most consistent sandbar peaks on this stretch.",
  hazards:"Big NW onshore days are a washing machine – pick the clean-up.", parking:"Tisvildeleje Strand"},
 {id:"udsholt", name:"Rågeleje / Udsholt", area:"Gribskov", lat:56.103, lon:12.185, sea:[56.13,12.17], sea2:[56.16,12.15],
  facing:345, bestSwell:325, swellHalf:60, exposure:1.0, minWave:0.5, driveKm:62, driveMin:60,
  bottom:"Pebbles, stones and boulder patches", level:"Intermediate+",
  swellNeed:"NW–N windswell 0.8 m+; better with higher water",
  idealWind:"W–WSW (side-offshore)",
  desc:"Stony stretch between Rågeleje and Udsholt. Boulders give the waves more shape than the sand beaches – arguably the best wave on the coast when it works, but it needs a bit more size.",
  hazards:"Rocks – booties recommended, careful at low water.", parking:"Udsholt Strand / Rågeleje"},
 {id:"gilleleje", name:"Gilleleje", area:"Gribskov", lat:56.124, lon:12.292, sea:[56.15,12.29], sea2:[56.18,12.28],
  facing:355, bestSwell:315, swellHalf:60, exposure:0.95, minWave:0.4, driveKm:60, driveMin:55,
  bottom:"Sand and stones, harbour piers", level:"All levels",
  swellNeed:"WNW–N windswell from a NW blow across the Kattegat",
  idealWind:"W (side-offshore) with a WNW sea",
  desc:"Northernmost point of Zealand. West of the harbour faces due north; the classic setup is a WNW windswell with a W wind cleaning it up.",
  hazards:"Pier structures; shallow stones near shore.", parking:"Gilleleje Vesterstrand"},
 {id:"hornbaek", name:"Hornbæk", area:"Helsingør", lat:56.094, lon:12.462, sea:[56.12,12.47], sea2:[56.15,12.47],
  facing:15, bestSwell:345, swellHalf:60, exposure:0.9, minWave:0.4, driveKm:50, driveMin:50,
  bottom:"Sand with stones; rocks along the Plantage", level:"All levels",
  swellNeed:"NW–N windswell; N/NW 9 m/s+",
  idealWind:"SW–W (side-off/offshore)",
  desc:"NNE-facing beach from the harbour east to Hornbæk Plantage. Picks up N windswell Gilleleje misses and goes side-offshore in westerlies. Closest north-coast break to Copenhagen.",
  hazards:"Harbour moles; rocky patches.", parking:"Hornbæk Havn / Plantage"},
 {id:"aalsgaarde", name:"Ålsgårde / Hellebæk", area:"Helsingør", lat:56.074, lon:12.545, sea:[56.095,12.57], sea2:[56.12,12.60],
  facing:25, bestSwell:0, swellHalf:55, exposure:0.8, minWave:0.4, driveKm:45, driveMin:45,
  bottom:"Sand, mostly lefts", level:"Beginner → intermediate",
  swellNeed:"N windswell; Kullen blocks the NNE, NW sea runs along the coast",
  idealWind:"W–SW (offshore)",
  desc:"Where the Kattegat meets Øresund. Sheltered from westerlies so it can be the clean option, but it needs a real N sea to get waves at all.",
  hazards:"Shallow at low water; small most of the time.", parking:"Ålsgårde Strand / Hellebæk"}
];
const INTERIOR = [[56.30,11.80],[56.35,12.20],[56.70,11.90],[56.60,12.40],[57.00,11.60],[56.15,11.50]];
const ORIGIN = {lat:55.6761, lon:12.5683};
const TZ = "Europe/Copenhagen";
const PAST_DAYS = 3, SHOW_PAST_H = 24, FC_DAYS = 5;
const GOOD_Q = 0.45;
const SCEN_W = {kwm_dmi:0.5, kwm_ecmwf:0.2, ewam:0.3};

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

/* sunrise/sunset (SunCalc) */
function sunTimes(unixNoon, lat=56.08, lon=12.3){
  const J1970=2440588,J2000=2451545,e=RAD*23.4397,d=unixNoon/86400-0.5+J1970-J2000,lw=RAD*-lon,phi=RAD*lat;
  const n=Math.round(d-0.0009-lw/(2*Math.PI)),ds=0.0009+lw/(2*Math.PI)+n,M=RAD*(357.5291+0.98560028*ds);
  const C=RAD*(1.9148*Math.sin(M)+0.02*Math.sin(2*M)+0.0003*Math.sin(3*M)),L=M+C+RAD*102.9372+Math.PI;
  const dec=Math.asin(Math.sin(e)*Math.sin(L)),Jn=J2000+ds+0.0053*Math.sin(M)-0.0069*Math.sin(2*L);
  const w=Math.acos((Math.sin(-0.833*RAD)-Math.sin(phi)*Math.sin(dec))/(Math.cos(phi)*Math.cos(dec)));
  const a=0.0009+(w+lw)/(2*Math.PI)+n,Js=J2000+a+0.0053*Math.sin(M)-0.0069*Math.sin(2*L),Jr=Jn-(Js-Jn);
  const u=J=>(J+0.5-J1970)*86400; return {rise:u(Jr),set:u(Js)};
}
const sunC={};
function sunFor(t){ const k=Math.floor((t+3600)/86400); return sunC[k]||(sunC[k]=sunTimes(k*86400+11*3600)); }
function isDay(t){ const s=sunFor(t), m=t+1800; return m>=s.rise-900 && m<=s.set+600; }

/* ============================ surf quality ============================ */
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
  {t:"Flat",v:0.1},{t:"Ankle",v:0.2},{t:"Knee",v:0.4},{t:"Thigh",v:0.6},{t:"Waist",v:0.8},{t:"Chest",v:1.1},{t:"Head",v:1.5},{t:"Overhead",v:2.0}
];
function sizeWords(hb){ if(hb==null) return "–"; let i=0; for(let k=0;k<SIZES.length;k++) if(hb>=SIZES[k].v*0.85) i=k; return SIZES[i].t+(hb>=0.5&&i<SIZES.length-1&&hb>SIZES[i].v*1.12?"–"+SIZES[i+1].t.toLowerCase():"");}
function breaking(spot, Hs, dir, cal){
  if(Hs==null) return null;
  const dd = dir==null?spot.swellHalf:angDiff(dir, spot.bestSwell);
  const f = dd>=spot.swellHalf+20?0.15: dd>=spot.swellHalf? lerp(dd,spot.swellHalf,spot.swellHalf+20,0.3,0.15) : 0.3+0.7*Math.cos(dd/spot.swellHalf*Math.PI/2);
  return Hs*f*spot.exposure*1.1*((cal&&cal.size)||1);
}
function windRel(spot, wd){ return angDiff(wd, spot.facing); }   // 0 onshore, 180 offshore
function windLabel(rel, ws){ if(ws<2.5) return "glassy"; return rel>=135?"offshore":rel>=100?"side-off":rel>=70?"cross-shore":rel>=40?"cross-on":"onshore"; }
function windScore(rel, ws){
  if(ws<2.5) return 1;
  if(rel>=135) return ws<11?1:ws<15?0.75:0.45;
  if(rel>=100) return ws<8?0.95:ws<12?0.8:0.55;
  if(rel>=70)  return ws<6?0.85:ws<9?0.65:ws<12?0.45:0.25;
  if(rel>=40)  return ws<5?0.75:ws<8?0.55:ws<11?0.4:0.2;
  return ws<4?0.7:ws<7?0.45:ws<10?0.32:0.15;
}
function sizeScore(hb, min){
  if(hb==null||hb<min*0.75) return 0;
  if(hb<min) return lerp(hb,min*0.75,min,0,0.35);
  if(hb<0.9) return lerp(hb,min,0.9,0.35,1);
  if(hb<1.8) return 1; if(hb<2.6) return lerp(hb,1.8,2.6,1,0.55); return 0.45;
}
function periodScore(T){ if(T==null) return 0.6; return T<3.5?0.25:T<5?lerp(T,3.5,5,0.25,0.7):T<7?lerp(T,5,7,0.7,1):1; }
function quality(spot, Hs, T, dir, ws, wd, cal){
  const hb = breaking(spot, Hs, dir, cal);
  if(hb==null||ws==null) return {q:null,hb};
  const rel = windRel(spot, wd);
  let q = sizeScore(hb, spot.minWave)*(0.3+0.7*windScore(rel,ws))*(0.55+0.45*periodScore(T));
  if(cal && cal.qBias && q>0.05) q = clamp(q+cal.qBias,0,1);
  return {q, hb, rel};
}

/* ============================ fetch geometry (precomputed once) ============================ */
const FETCH = {};
function initFetch(){
  const cached = load("nk_fetch_v3");
  if(cached){ for(const k in cached) FETCH[k]={rays:cached[k].rays, eff:Float32Array.from(cached[k].eff)}; return; }
  const out={};
  SPOTS.forEach(s=>{ const t=K.fetchTable(s.sea[0],s.sea[1]); FETCH[s.id]=t; out[s.id]={rays:t.rays,eff:Array.from(t.eff)}; });
  store("nk_fetch_v3", out);
}
/* generation wind for a spot: sea-point wind + wind further up the fetch */
function nearestInterior(lat, lon){ let b=0,bd=1e9; INTERIOR.forEach((p,i)=>{const d=(p[0]-lat)**2+((p[1]-lon)*0.56)**2; if(d<bd){bd=d;b=i}}); return b; }

/* ============================ data fetching ============================ */
async function getJSON(url){
  let r;
  try{ r = await fetch(url); } catch(e){ throw new Error("network: "+e.message); }
  if(!r.ok){ let m="HTTP "+r.status; try{m+=" "+(await r.json()).reason}catch(e){} throw new Error(m); }
  return r.json();
}
const arr=j=>Array.isArray(j)?j:[j];
const WIND_PTS = ()=>[...SPOTS.map(s=>[s.lat,s.lon]), ...SPOTS.map(s=>s.sea), ...INTERIOR];
function windURL(host, pts, extra){
  return `https://${host}/v1/forecast?latitude=${pts.map(p=>p[0]).join(",")}&longitude=${pts.map(p=>p[1]).join(",")}`+
   `&hourly=wind_speed_10m,wind_direction_10m,wind_gusts_10m,temperature_2m&models=dmi_seamless,ecmwf_ifs025`+
   `&wind_speed_unit=ms&timeformat=unixtime${extra}`;
}
async function fetchWind(){ return arr(await getJSON(windURL("api.open-meteo.com", WIND_PTS(), `&past_days=${PAST_DAYS}&forecast_days=${FC_DAYS}`))); }
async function fetchWaves(){
  const pts=[...SPOTS.map(s=>s.sea), ...SPOTS.map(s=>s.sea2)];
  const url=`https://marine-api.open-meteo.com/v1/marine?latitude=${pts.map(p=>p[0]).join(",")}&longitude=${pts.map(p=>p[1]).join(",")}`+
    `&hourly=wind_wave_height,wind_wave_period,wind_wave_direction,sea_surface_temperature,sea_level_height_msl&models=ewam`+
    `&timeformat=unixtime&past_days=${PAST_DAYS}&forecast_days=${FC_DAYS}`;
  return arr(await getJSON(url));
}
function series(loc, v, m){ const h=loc&&loc.hourly; if(!h) return null; return h[v+"_"+m]||h[v]||null; }

/* ============================ the model run ============================ */
function genWind(spotIdx, W, model){
  const s=SPOTS[spotIdx], n=SPOTS.length;
  const sea=W[n+spotIdx], times=sea.hourly.time;
  const U=series(sea,"wind_speed_10m",model), D=series(sea,"wind_direction_10m",model);
  if(!U) return null;
  return times.map((t,i)=>{
    if(U[i]==null) return {t,U:null,dir:null};
    const Feff=K.effFetch(FETCH[s.id], D[i]);
    let u=U[i];
    if(Feff>15){
      const [a,b]=K.move(s.sea[0],s.sea[1],D[i],Math.min(Feff/2,80));
      const I=W[2*n+nearestInterior(a,b)], Ui=series(I,"wind_speed_10m",model);
      if(Ui&&Ui[i]!=null) u=0.5*(U[i]+Ui[i]);
    }
    return {t,U:u,dir:D[i]};
  });
}
function buildModel(W, Wv, clim, cal){
  const now=Date.now()/1000, n=SPOTS.length;
  const spots = SPOTS.map((s,si)=>{
    const beach=W[si], times=beach.hourly.time, C=cal.spots[s.id]||cal.global;
    // KWM runs
    const runs={};
    [["kwm_dmi","dmi_seamless"],["kwm_ecmwf","ecmwf_ifs025"]].forEach(([key,m])=>{
      const g=genWind(si,W,m); if(g) runs[key]={sea:K.run(g,FETCH[s.id]), model:m};
    });
    // EWAM wind-sea (first non-empty point)
    let ew=null;
    for(const loc of [Wv&&Wv[si], Wv&&Wv[n+si]]){
      const h=series(loc,"wind_wave_height"); if(h&&h.some(v=>v!=null)){ const map={}; loc.hourly.time.forEach((t,k)=>map[t]=k);
        ew={map,h,T:series(loc,"wind_wave_period"),d:series(loc,"wind_wave_direction"),sst:series(loc,"sea_surface_temperature"),sl:series(loc,"sea_level_height_msl")}; break; }
    }
    const gDmi=series(beach,"wind_gusts_10m","dmi_seamless"), tDmi=series(beach,"temperature_2m","dmi_seamless");
    const hours = times.map((t,i)=>{
      if(t < now - SHOW_PAST_H*3600) return null;
      const scen=[]; let wsD=series(beach,"wind_speed_10m","dmi_seamless"), wdD=series(beach,"wind_direction_10m","dmi_seamless");
      const wsE=series(beach,"wind_speed_10m","ecmwf_ifs025"), wdE=series(beach,"wind_direction_10m","ecmwf_ifs025");
      const add=(key,Hs,T,dir,ws,wd)=>{ if(Hs==null||ws==null) return; const r=quality(s,Hs,T,dir,ws,wd,C); scen.push({key,Hs,T,dir,ws,wd,...r}); };
      if(runs.kwm_dmi){ const o=runs.kwm_dmi.sea[i]; add("kwm_dmi",o.Hs,o.Tp,o.dir,wsD&&wsD[i],wdD&&wdD[i]); }
      if(runs.kwm_ecmwf){ const o=runs.kwm_ecmwf.sea[i]; add("kwm_ecmwf",o.Hs,o.Tp,o.dir,wsE&&wsE[i],wdE&&wdE[i]); }
      let sst=null, sl=null;
      if(ew){ const k=ew.map[t]; if(k!=null){ add("ewam",ew.h[k],ew.T&&ew.T[k],ew.d&&ew.d[k],wsD&&wsD[i],wdD&&wdD[i]); sst=ew.sst&&ew.sst[k]; sl=ew.sl&&ew.sl[k]; } }
      const P = scen.find(x=>x.key==="kwm_dmi")||scen[0]||null;
      let p=null,q=null,lo=null,hi=null;
      if(scen.length){
        let sw=0,acc=0,qa=0; scen.forEach(x=>{const w=SCEN_W[x.key]; sw+=w; acc+=w/(1+Math.exp(-(x.q-GOOD_Q)/0.06)); qa+=w*x.q;});
        const pm=acc/sw, lead=Math.max(0,(t-now)/3600), base=clim?clim[s.id][monthOf(t)].pct:0.08;
        const w=clamp(1-lead/220,0.45,0.97)*(scen.length>1?1:0.9);
        p=w*pm+(1-w)*base; q=qa/sw;
        lo=Math.min(...scen.map(x=>x.hb)); hi=Math.max(...scen.map(x=>x.hb));
      }
      return {t, past:t<now-1800, day:isDay(t), scen, P, p, q, lo, hi, gust:gDmi&&gDmi[i], temp:tDmi&&tDmi[i], sst, sl,
              growing: runs.kwm_dmi&&runs.kwm_dmi.sea[i].growing};
    }).filter(Boolean);
    hours.forEach((h,i)=>{ // clean-up flag: onshore blow easing / turning
      if(!h.P) return; const on=x=>x.P?x.P.ws*Math.cos(Math.min(x.P.rel,180)*RAD):0;
      const prev=hours.slice(Math.max(0,i-6),i).filter(x=>x.P);
      if(prev.length>=4){ const po=prev.reduce((a,x)=>a+on(x),0)/prev.length; h.cleanup=po>6&&on(h)<po-3; }
    });
    return {spot:s, hours, cal:C, hasEwam:!!ew};
  });
  return {spots, now};
}
function windows(M){
  const out=[];
  M.spots.forEach(S=>{ let cur=null; const flush=()=>{ if(cur&&cur.h.length>=2) out.push(cur); cur=null; };
    S.hours.forEach(h=>{ const ok=!h.past&&h.day&&h.p!=null&&h.p>=0.4&&h.q>=GOOD_Q*0.85;
      if(ok){ if(!cur) cur={S,h:[]}; cur.h.push(h);} else flush(); }); flush(); });
  out.forEach(w=>{ w.score=w.h.reduce((a,h)=>a+h.p*h.q,0); w.pMax=Math.max(...w.h.map(h=>h.p)); w.peak=w.h.reduce((a,h)=>h.p*h.q>a.p*a.q?h:a); });
  return out.sort((a,b)=>b.score-a.score);
}

/* ============================ climatology (5 y ERA5 through KWM) ============================ */
async function fetchClimate(){
  const c=load("nk_clim_v3"); if(c&&Date.now()-c.at<7*864e5) return c;
  const end=new Date(Date.now()-7*864e5), start=new Date(end); start.setFullYear(end.getFullYear()-5);
  const d=x=>x.toISOString().slice(0,10);
  const j=await getJSON(`https://archive-api.open-meteo.com/v1/archive?latitude=56.35&longitude=12.05&start_date=${d(start)}&end_date=${d(end)}&hourly=wind_speed_10m,wind_direction_10m&wind_speed_unit=ms&timeformat=unixtime`);
  const T=j.hourly.time, U=j.hourly.wind_speed_10m, D=j.hourly.wind_direction_10m;
  const res={at:Date.now(), range:`${d(start)} → ${d(end)}`};
  SPOTS.forEach(s=>{
    const sea=K.run(T.map((t,i)=>({t,U:U[i],dir:D[i]})), FETCH[s.id]);
    const M=Array.from({length:12},()=>({dl:0,g:0,days:{},gd:{}}));
    T.forEach((t,i)=>{ if(!isDay(t)||U[i]==null||sea[i].Hs==null) return;
      const {q}=quality(s,sea[i].Hs,sea[i].Tp,sea[i].dir,U[i]*0.8,D[i]); const m=monthOf(t), dk=dayKey(t);
      M[m].dl++; M[m].days[dk]=1; if(q>=GOOD_Q){ M[m].g++; M[m].gd[dk]=(M[m].gd[dk]||0)+1; } });
    res[s.id]=M.map(x=>({pct:x.dl?x.g/x.dl:0, days:Object.values(x.gd).filter(v=>v>=2).length/Math.max(1,Object.keys(x.days).length)*30.4}));
  });
  store("nk_clim_v3",res); return res;
}

/* ============================ sessions + learning ============================ */
const SESS_KEY="nk_sessions_v1";
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

/* conditions for a logged session: from the loaded run, else re-run the model on archived DMI data */
async function predictFor(spotId, start, end){
  const si=SPOTS.findIndex(s=>s.id===spotId), s=SPOTS[si];
  const avg=hs=>{ const v=hs.filter(h=>h&&h.P); if(!v.length) return null;
    const m=k=>v.reduce((a,h)=>a+(h.P[k]??0),0)/v.length;
    return {hb:m("hb"),Hs:m("Hs"),T:m("T"),ws:m("ws"),wd:v[0].P.wd,dir:v[0].P.dir,rel:m("rel"),q:v.reduce((a,h)=>a+h.q,0)/v.length,src:"forecast run"}; };
  if(STATE){ const S=STATE.spots[si]; const hs=S.hours.filter(h=>h.t>=start-1800&&h.t<=end); if(hs.length) return avg(hs); }
  // archived DMI forecast (historical-forecast API), 3 days spin-up
  const d=x=>new Date(x*1000).toISOString().slice(0,10);
  const pts=[[s.lat,s.lon], s.sea, ...INTERIOR];
  const raw=arr(await getJSON(windURL("historical-forecast-api.open-meteo.com", pts, `&start_date=${d(start-3*86400)}&end_date=${d(end)}`)));
  const loc=raw[1], T=loc.hourly.time, m="dmi_seamless";
  const U=series(loc,"wind_speed_10m",m), D=series(loc,"wind_direction_10m",m);
  const g=T.map((t,i)=>{ if(U[i]==null) return {t,U:null,dir:null}; const Fe=K.effFetch(FETCH[s.id],D[i]); let u=U[i];
    if(Fe>15){ const [a,b]=K.move(s.sea[0],s.sea[1],D[i],Math.min(Fe/2,80)); const Ui=series(raw[2+nearestInterior(a,b)],"wind_speed_10m",m); if(Ui&&Ui[i]!=null) u=0.5*(u+Ui[i]); }
    return {t,U:u,dir:D[i]}; });
  const sea=K.run(g,FETCH[s.id]); const BU=series(raw[0],"wind_speed_10m",m), BD=series(raw[0],"wind_direction_10m",m);
  const hs=T.map((t,i)=>{ if(t<start-1800||t>end||sea[i].Hs==null||BU[i]==null) return null; const r=quality(s,sea[i].Hs,sea[i].Tp,sea[i].dir,BU[i],BD[i]);
    return {P:{...r,Hs:sea[i].Hs,T:sea[i].Tp,dir:sea[i].dir,ws:BU[i],wd:BD[i]}, q:r.q}; });
  const a=avg(hs); if(a) a.src="archived DMI run"; return a;
}
function similarSessions(spotId, P){
  if(!P) return [];
  const grp=r=>r>=100?"off":r>=60?"cross":"on";
  return SESSIONS.filter(s=>s.pred&&s.rating!=null&&(!spotId||s.spot===spotId)&&Math.abs(s.pred.Hs-P.Hs)<0.35&&grp(s.pred.rel)===grp(P.rel));
}

/* ============================ UI: shared bits ============================ */
let STATE=null, RAW=null, CLIM=null, VIEW={day:null, sel:null, night:false};
function chip(q){ const i=ratingIdx(q); if(i<0) return `<span class="chip" style="--c:#cfd3d8">–</span>`; const r=RATINGS[i]; return `<span class="chip" style="--c:${r.c}">${r.t}</span>`; }
function arrow(wd, size=16, cls=""){ if(wd==null) return ""; const a=(wd+180)%360; return `<svg class="arr ${cls}" width="${size}" height="${size}" viewBox="-8 -8 16 16" style="transform:rotate(${a}deg)" aria-hidden="true"><path d="M0,-7 L4.5,4 L0,1.5 L-4.5,4 Z"/></svg>`; }
function surfRange(h){ if(!h||!h.P||h.P.hb==null) return null; const hb=h.P.hb; const a=Math.max(0,Math.floor(hb*0.8*10)/10), b=Math.max(a+0.1,Math.ceil(hb*1.2*10)/10); return [a,b]; }
function rangeTxt(h){ const r=surfRange(h); return r?`${fmt(r[0])}–${fmt(r[1])}`:"–"; }
function leaveBy(spot, t){ return tHr(t-(spot.driveMin+15)*60); }
function mapsLink(s){ return `https://www.google.com/maps/dir/?api=1&origin=${ORIGIN.lat},${ORIGIN.lon}&destination=${s.lat},${s.lon}&travelmode=driving`; }
const tip=()=>$("#tip");
function showTip(x,y,html){ const t=tip(); t.innerHTML=html; t.style.display="block"; const w=t.offsetWidth,h=t.offsetHeight;
  t.style.left=clamp(x-w/2,8,innerWidth-w-8)+"px"; t.style.top=(y-h-14<8?y+18:y-h-14)+"px"; }
function hideTip(){ tip().style.display="none"; }
document.addEventListener("scroll", hideTip, true);

/* ============================ HOME ============================ */
function renderHome(){
  const M=STATE, wins=windows(M), el=$("#view");
  let hero;
  if(wins.length){
    const w=wins[0], s=w.S.spot, a=w.h[0], z=w.h[w.h.length-1], P=w.peak.P;
    hero=`<a class="hero" href="#spot-${s.id}" data-t="${w.peak.t}">
      <div class="hero-k">Best bet · next 5 days</div>
      <div class="hero-row"><div><div class="hero-spot">${esc(s.name)}</div><div class="hero-when">${tDay(a.t)} · ${tHr(a.t)}–${tHr(z.t+3600)}</div></div>
      <div class="hero-p"><b>${Math.round(w.pMax*100)}%</b><span>chance</span></div></div>
      <div class="hero-surf"><span class="big">${rangeTxt(w.peak)}<small>m</small></span><span>${sizeWords(P.hb)}<br>${chip(w.peak.q)}</span></div>
      <div class="hero-meta">${arrow(P.wd,14)} ${compass(P.wd)} ${fmt(P.ws,0)} m/s · ${windLabel(P.rel,P.ws)} · ${fmt(P.Hs)} m @ ${fmt(P.T)} s from ${compass(P.dir)}${w.h.some(h=>h.cleanup)?" · clean-up":""}</div>
      <div class="hero-drive">🚗 Leave Copenhagen ${leaveBy(s,a.t)} · ${s.driveMin} min</div></a>`;
  } else {
    let b=null; M.spots.forEach(S=>S.hours.forEach(h=>{ if(!h.past&&h.day&&h.p!=null&&(!b||h.p>b.h.p)) b={S,h}; }));
    hero=`<div class="hero quiet"><div class="hero-k">Next 5 days</div><div class="hero-spot">No real window</div>
      <div class="hero-when">The Kattegat needs a sustained W–N blow to build windswell.${b?` Best outside chance: <b>${esc(b.S.spot.name)}</b> ${tDay(b.h.t)} ${tHr(b.h.t)} (${Math.round(b.h.p*100)}%).`:""}</div></div>`;
  }
  const days=[...new Set(M.spots[0].hours.filter(h=>!h.past).map(h=>dayKey(h.t)))].slice(0,5);
  const rows=M.spots.map(S=>{
    const s=S.spot, nowH=S.hours.find(h=>!h.past)||S.hours[0], P=nowH.P;
    const w=wins.find(x=>x.S===S);
    const strip=days.map(dk=>{ const hs=S.hours.filter(h=>dayKey(h.t)===dk&&h.day&&!h.past&&h.p!=null);
      const best=hs.reduce((a,h)=>!a||h.q>a.q?h:a,null); const i=best?ratingIdx(best.q):-1;
      return `<span class="seg" title="${best?RATINGS[i].t:"–"}"><i style="background:${i>=0?RATINGS[i].c:"#e2e5e9"}"></i><em>${best?tWd(best.t).slice(0,2):""}</em></span>`; }).join("");
    const ri=ratingIdx(nowH.q);
    return `<a class="row" href="#spot-${s.id}">
      <span class="stripe" style="background:${ri>=0?RATINGS[ri].c:"#cfd3d8"}"></span>
      <div class="row-main"><div class="row-top"><b>${esc(s.name)}</b><span class="muted">${s.driveMin} min</span></div>
        <div class="row-now"><span class="surf">${rangeTxt(nowH)} m</span>${chip(nowH.q)}<span class="wind">${P?arrow(P.wd,13)+" "+fmt(P.ws,0)+" "+windLabel(P.rel,P.ws):""}</span></div>
        <div class="strip">${strip}</div></div>
      <div class="row-next">${w?`<b>${Math.round(w.pMax*100)}%</b><span>${tWd(w.h[0].t)} ${tHr(w.h[0].t)}</span>`:`<span class="muted">no window</span>`}</div></a>`;
  }).join("");
  el.innerHTML = `${hero}
    <div class="sec-h"><h2>Spots</h2><span class="muted">now · 5-day best</span></div>
    <div class="list">${rows}</div>
    <div class="legend-r">${RATINGS.map(r=>`<span><i style="background:${r.c}"></i>${r.t}</span>`).join("")}</div>
    ${wins.length>1?`<div class="sec-h"><h2>More windows</h2></div><div class="wins">${wins.slice(1,6).map(w=>`<a class="win" href="#spot-${w.S.spot.id}" data-t="${w.peak.t}"><b>${esc(w.S.spot.name)}</b><span>${tDay(w.h[0].t)} ${tHr(w.h[0].t)}–${tHr(w.h[w.h.length-1].t+3600)}</span>${chip(w.peak.q)}<em>${Math.round(w.pMax*100)}%</em></a>`).join("")}</div>`:""}`;
  el.querySelectorAll("[data-t]").forEach(a=>a.addEventListener("click",()=>{ VIEW.sel=+a.dataset.t; VIEW.day=dayKey(+a.dataset.t); }));
}

/* ============================ SPOT ============================ */
function renderSpot(id){
  const S=STATE.spots.find(x=>x.spot.id===id); if(!S){ location.hash="#home"; return; }
  const s=S.spot, future=S.hours.filter(h=>!h.past);
  const days=[...new Set(S.hours.filter(h=>!h.past||h.day).map(h=>dayKey(h.t)))].filter(dk=>S.hours.some(h=>dayKey(h.t)===dk&&!h.past));
  const nextDay=future.find(h=>h.day)||future[0]||S.hours[0];
  if(!VIEW.day||!days.includes(VIEW.day)) VIEW.day=dayKey(nextDay.t);
  let sel=S.hours.find(h=>h.t===VIEW.sel);
  if(!sel||dayKey(sel.t)!==VIEW.day){ const dh=S.hours.filter(h=>dayKey(h.t)===VIEW.day&&h.day&&!h.past); sel=dh.reduce((a,h)=>!a||h.q>a.q?h:a,null)||S.hours.find(h=>dayKey(h.t)===VIEW.day&&!h.past)||future[0]||S.hours[0]; }
  VIEW.sel=sel.t;
  const P=sel.P||{}, mNow=monthOf(STATE.now), C=S.cal;
  const tabs=days.map(dk=>{ const hs=S.hours.filter(h=>dayKey(h.t)===dk&&h.day); const b=hs.reduce((a,h)=>!a||(h.q??-1)>(a.q??-1)?h:a,null);
    const i=b?ratingIdx(b.q):-1; const allPast=hs.every(h=>h.past);
    return `<button class="dtab ${dk===VIEW.day?"on":""} ${allPast?"past":""}" data-d="${dk}"><span>${tWd(S.hours.find(h=>dayKey(h.t)===dk).t)}</span><b>${b?rangeTxt(b):"–"}</b><i style="background:${i>=0?RATINGS[i].c:"#e2e5e9"}"></i></button>`; }).join("");
  const dh=S.hours.filter(h=>dayKey(h.t)===VIEW.day&&(VIEW.night||h.day||h.t===sel.t));
  const rows=dh.map(h=>{ const p=h.P||{}; return `<tr class="${h.t===sel.t?"sel":""} ${h.past?"past":""}" data-t="${h.t}">
     <td>${tHr(h.t)}</td><td>${chip(h.q)}</td><td class="num"><b>${rangeTxt(h)}</b></td>
     <td class="num">${fmt(p.Hs)}<small> m</small> ${fmt(p.T,0)}<small>s</small> <span class="muted">${compass(p.dir)}</span></td>
     <td class="num">${arrow(p.wd,13)} ${fmt(p.ws,0)}<small>${h.gust!=null?"–"+fmt(h.gust,0):""}</small> <span class="muted">${p.ws!=null?windLabel(p.rel,p.ws):""}</span></td>
     <td class="num">${h.p!=null?Math.round(h.p*100)+"%":"–"}</td></tr>`; }).join("");
  const sims=similarSessions(s.id, P), mySess=SESSIONS.filter(x=>x.spot===s.id).sort((a,b)=>b.start-a.start);
  const cl=CLIM&&CLIM[s.id];
  $("#view").innerHTML=`
   <div class="sp-head">
     <a class="back" href="#home" aria-label="Back">‹</a>
     <div><h1>${esc(s.name)}</h1><div class="muted">${esc(s.area)} · faces ${compass(s.facing)} · ${s.driveMin} min drive</div></div>
   </div>
   <div class="now-card">
     <div class="now-top"><div><div class="muted small">${tDay(sel.t)} · ${tHr(sel.t)}${sel.past?" (past)":""}</div>
       <div class="big">${rangeTxt(sel)}<small>m</small></div><div>${sizeWords(P.hb)}</div></div>
       <div class="now-r">${chip(sel.q)}<div class="pct"><b>${sel.p!=null?Math.round(sel.p*100)+"%":"–"}</b><span>chance good</span></div></div></div>
     <div class="stats">
       <div><span>Wind</span><b>${arrow(P.wd,14)} ${compass(P.wd)} ${fmt(P.ws,0)}</b><em>${P.ws!=null?windLabel(P.rel,P.ws):""}${sel.gust!=null?` · g${fmt(sel.gust,0)}`:""}</em></div>
       <div><span>Windswell</span><b>${fmt(P.Hs)} m</b><em>${fmt(P.T)} s from ${compass(P.dir)}</em></div>
       <div><span>Water</span><b>${fmt(sel.sst,0)}°C</b><em>air ${fmt(sel.temp,0)}°C</em></div>
       <div><span>Level</span><b>${sel.sl!=null?(sel.sl>0?"+":"")+fmt(sel.sl*100,0):"–"}</b><em>cm vs mean</em></div>
     </div>
     ${sel.cleanup?`<div class="note">Clean-up window: onshore blow easing/turning – often the best session of a Kattegat event.</div>`:""}
     ${sel.growing&&P.rel<70&&P.ws>8?`<div class="note">Windswell still building under onshore wind – size up, quality down.</div>`:""}
   </div>
   <div class="dtabs">${tabs}</div>
   <div class="card"><div class="ch-h"><h3>Surf height & rating</h3><label class="tog"><input type="checkbox" id="night" ${VIEW.night?"checked":""}> night</label></div>
     <div id="dayChart"></div>
     <div class="legend-r small">${RATINGS.map(r=>`<span><i style="background:${r.c}"></i>${r.t}</span>`).join("")}</div>
     <div class="tbl-wrap"><table class="hours"><thead><tr><th>Time</th><th>Rating</th><th>Surf m</th><th>Windswell</th><th>Wind m/s</th><th>Chance</th></tr></thead><tbody>${rows}</tbody></table></div>
   </div>
   <div class="card"><h3>Model check · ${tHr(sel.t)}</h3>
     <p class="muted small">Same hour from each source. Agreement → higher chance; disagreement → lower confidence.</p>
     <table class="mc"><tr><th></th><th>Windswell</th><th>Surf</th><th>q</th></tr>
     ${[["kwm_dmi","Kattegat model · DMI wind"],["kwm_ecmwf","Kattegat model · ECMWF wind"],["ewam","DWD EWAM wind-sea"]].map(([k,l])=>{const x=sel.scen.find(y=>y.key===k);return `<tr><td>${l}</td><td>${x?fmt(x.Hs)+" m · "+fmt(x.T)+" s "+compass(x.dir):"n/a"}</td><td>${x?fmt(x.hb):"–"}</td><td>${x?chip(x.q):"–"}</td></tr>`}).join("")}</table>
     ${C&&C.n?`<p class="small">Calibrated from your ${C.n} session${C.n>1?"s":""}: size ×${fmt(C.size,2)}, rating ${C.qBias>=0?"+":""}${fmt(C.qBias*100,0)} pts.</p>`:""}
     ${sims.length?`<p class="small"><b>${sims.length} similar logged session${sims.length>1?"s":""}</b> here averaged <b>${RATINGS[Math.round(sims.reduce((a,x)=>a+x.rating,0)/sims.length)].t}</b>.</p>`:""}
   </div>
   <a class="btn primary block" href="#log-${s.id}">＋ Log a session at ${esc(s.name)}</a>
   <div class="card"><h3>Spot guide</h3><p>${esc(s.desc)}</p>
     <dl class="kv"><dt>Needs</dt><dd>${esc(s.swellNeed)}</dd><dt>Best wind</dt><dd>${esc(s.idealWind)}</dd><dt>Bottom</dt><dd>${esc(s.bottom)}</dd><dt>Level</dt><dd>${esc(s.level)}</dd><dt>Hazards</dt><dd>${esc(s.hazards)}</dd><dt>Parking</dt><dd>${esc(s.parking)}</dd>
     <dt>Drive</dt><dd>${s.driveMin} min / ${s.driveKm} km from central Copenhagen · <a href="${mapsLink(s)}" target="_blank" rel="noopener">route ↗</a></dd></dl></div>
   <div class="card"><h3>Open water upwind (effective fetch)</h3><p class="muted small">How far the wind can blow over the Kattegat before reaching this spot, by direction – computed from the coastline. Long bars = big windswell potential. Outlined wedge = this spot's swell window.</p><div id="rose"></div></div>
   <div class="card"><h3>Historic base rate</h3><p class="muted small">Share of daylight hours with surfable conditions: 5 years of ERA5 wind run through the Kattegat model and this spot's rules${CLIM?` (${CLIM.range})`:""}.</p><div id="climChart">${cl?"":"<p class='muted'>Loading…</p>"}</div>
     ${cl?`<p class="small">Typical ${new Intl.DateTimeFormat("en-GB",{month:"long"}).format(new Date(2026,mNow,1))}: <b>${Math.round(cl[mNow].pct*100)}%</b> of daylight hours, ~<b>${fmt(cl[mNow].days,1)}</b> good days.</p>`:""}</div>
   ${mySess.length?`<div class="card"><h3>Your sessions here</h3>${sessList(mySess.slice(0,5))}</div>`:""}`;
  $("#view").querySelectorAll(".dtab").forEach(b=>b.onclick=()=>{ VIEW.day=b.dataset.d; VIEW.sel=null; renderSpot(id); });
  $("#view").querySelectorAll("tr[data-t]").forEach(r=>r.onclick=()=>{ VIEW.sel=+r.dataset.t; renderSpot(id); });
  $("#night").onchange=e=>{ VIEW.night=e.target.checked; renderSpot(id); };
  drawDayChart(S, dh, sel, id); drawRose(s); if(cl) drawClim(cl, mNow);
}

function drawDayChart(S, hs, sel, id){
  const host=$("#dayChart"), W=Math.max(300,host.clientWidth), H=150, PL=30, PR=6, PT=18;
  if(!hs.length){ host.innerHTML=""; return; }
  const max=Math.max(1, Math.ceil(Math.max(...hs.map(h=>h.hi||0))*2)/2);
  const bw=(W-PL-PR)/hs.length, y=v=>PT+(H-PT)-clamp(v/max,0,1)*(H-PT);
  let g=""; for(let v=0;v<=max+1e-9;v+=0.5){ g+=`<line x1="${PL}" x2="${W-PR}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${PL-5}" y="${y(v)+3}" text-anchor="end" class="ax">${v}</text>`; }
  hs.forEach((h,i)=>{ const x=PL+i*bw+1, w=Math.max(2,bw-2), ri=ratingIdx(h.q), c=ri>=0?RATINGS[ri].c:"#cfd3d8";
    if(h.lo!=null){ const top=y(h.hi), mid=y(Math.max(0,(h.P?h.P.hb:h.lo)));
      g+=`<rect x="${x}" y="${top}" width="${w}" height="${Math.max(1,y(0)-top)}" rx="${Math.min(4,w/2)}" fill="${c}" opacity="${h.past?0.35:0.35}"/>`;
      g+=`<rect x="${x}" y="${mid}" width="${w}" height="${Math.max(1,y(0)-mid)}" rx="${Math.min(4,w/2)}" fill="${c}" opacity="${h.past?0.5:1}"/>`; }
    if(h.t===sel.t) g+=`<rect x="${x-1}" y="${PT-4}" width="${w+2}" height="${H-PT+4}" fill="none" stroke="#0b1f33" stroke-width="1.5" rx="3"/>`;
    if(i%2===0||hs.length<10) g+=`<text x="${x+w/2}" y="${H+13}" text-anchor="middle" class="ax">${hourOf(h.t)}</text>`;
    g+=`<rect class="hit" data-i="${i}" x="${PL+i*bw}" y="0" width="${bw}" height="${H+16}" fill="transparent"/>`; });
  host.innerHTML=`<svg viewBox="0 0 ${W} ${H+18}" width="100%" height="${H+18}" role="img" aria-label="Hourly surf height">${g}<text x="${PL}" y="10" class="ax">m (solid = Kattegat model, faint = model spread)</text></svg>`;
  host.querySelectorAll(".hit").forEach(r=>{ const h=hs[+r.dataset.i];
    r.addEventListener("mouseenter",e=>{ const b=r.getBoundingClientRect(); showTip(b.left+b.width/2,b.top+20,`<b>${tHr(h.t)}</b> ${chip(h.q)}<br>${rangeTxt(h)} m · ${sizeWords(h.P&&h.P.hb)}<br>${h.P?compass(h.P.wd)+" "+fmt(h.P.ws,0)+" m/s "+windLabel(h.P.rel,h.P.ws):""}<br>${h.p!=null?Math.round(h.p*100)+"% chance":""}`); });
    r.addEventListener("mouseleave",hideTip);
    r.addEventListener("click",()=>{ hideTip(); VIEW.sel=h.t; renderSpot(id); }); });
}
function drawRose(s){
  const tab=FETCH[s.id], R=110, cx=130, cy=130; let g="";
  [50,100,150,200,250].forEach(km=>{ g+=`<circle cx="${cx}" cy="${cy}" r="${km/250*R}" class="grid" fill="none"/>`; });
  g+=`<text x="${cx+3}" y="${cy-R*100/250-2}" class="ax">100 km</text><text x="${cx+3}" y="${cy-R+8}" class="ax">250</text>`;
  const a0=(s.bestSwell-s.swellHalf), a1=(s.bestSwell+s.swellHalf), P=(a,r)=>[cx+Math.sin(a*RAD)*r, cy-Math.cos(a*RAD)*r];
  const [x0,y0]=P(a0,R), [x1,y1]=P(a1,R);
  g+=`<path d="M${cx},${cy} L${x0},${y0} A${R},${R} 0 ${a1-a0>180?1:0} 1 ${x1},${y1} Z" fill="#e8f2fd" stroke="#0e5fd8" stroke-dasharray="4 3"/>`;
  for(let d=0; d<360; d+=10){ const f=K.effFetch(tab,d), r=f/250*R, [xa,ya]=P(d-4.5,r), [xb,yb]=P(d+4.5,r);
    g+=`<path d="M${cx},${cy} L${xa},${ya} A${r},${r} 0 0 1 ${xb},${yb} Z" fill="#2a78d6" stroke="#fff" stroke-width="1"><title>${compass(d)}: ${Math.round(f)} km</title></path>`; }
  ["N","E","S","W"].forEach((l,i)=>{ const [x,y]=P(i*90,R+12); g+=`<text x="${x}" y="${y+4}" text-anchor="middle" class="ax b">${l}</text>`; });
  const [bx,by]=P(s.facing,R*0.35); g+=`<line x1="${cx}" y1="${cy}" x2="${bx}" y2="${by}" stroke="#0b1f33" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="3" fill="#0b1f33"/>`;
  const top=[...Array(36)].map((_,i)=>[i*10,K.effFetch(tab,i*10)]).sort((a,b)=>b[1]-a[1])[0];
  $("#rose").innerHTML=`<div class="rose"><svg viewBox="0 0 260 260" width="260" height="260" role="img" aria-label="Fetch rose">${g}</svg>
    <div class="small"><p>Longest fetch: <b>${compass(top[0])} · ${Math.round(top[1])} km</b></p><p>Beach faces <b>${compass(s.facing)}</b> (dark line).</p><p>Wind from directions with &lt;20 km fetch makes no surf here – those are your offshore directions.</p></div></div>`;
}
function drawClim(cl, mNow){
  const W=Math.max(280,$("#climChart").clientWidth), H=90, PL=34, bw=(W-PL)/12, max=Math.max(0.05,Math.ceil(Math.max(...cl.map(c=>c.pct))*20)/20);
  let g=""; [0,max/2,max].forEach(v=>{const y=H-v/max*H+8; g+=`<line x1="${PL}" x2="${W}" y1="${y}" y2="${y}" class="grid"/><text x="${PL-4}" y="${y+3}" text-anchor="end" class="ax">${Math.round(v*100)}%</text>`;});
  "JFMAMJJASOND".split("").forEach((m,i)=>{ const h=cl[i].pct/max*H, x=PL+i*bw+3;
    g+=`<rect x="${x}" y="${H-h+8}" width="${bw-6}" height="${Math.max(0,h)}" rx="3" fill="${i===mNow?"#184f95":"#86b6ef"}"><title>${Math.round(cl[i].pct*100)}% · ~${fmt(cl[i].days,1)} good days</title></rect><text x="${x+(bw-6)/2}" y="${H+21}" text-anchor="middle" class="ax">${m}</text>`; });
  $("#climChart").innerHTML=`<svg viewBox="0 0 ${W} ${H+24}" width="100%" height="${H+24}">${g}</svg>`;
}

/* ============================ LOG ============================ */
function sessList(list){
  if(!list.length) return `<p class="muted">No sessions yet.</p>`;
  return `<div class="sess">${list.map(x=>{ const sp=SPOTS.find(s=>s.id===x.spot); const p=x.pred;
    return `<div class="sitem"><div><b>${esc(sp?sp.name:x.spot)}</b> <span class="muted">${tDay(x.start)} ${tHr(x.start)}–${tHr(x.end)}</span></div>
     <div>You: ${x.rating!=null?`<span class="chip" style="--c:${RATINGS[x.rating].c}">${RATINGS[x.rating].t}</span>`:""} ${x.size!=null?SIZES[x.size].t:""} ${x.surface?"· "+esc(x.surface):""}</div>
     <div class="muted small">Model: ${p?`${chip(p.q)} ${fmt(p.hb)} m surf · ${fmt(p.Hs)} m ${compass(p.dir)} · wind ${compass(p.wd)} ${fmt(p.ws,0)} (${p.src})`:"no model data stored"}</div>
     ${x.notes?`<div class="small">“${esc(x.notes)}”</div>`:""}
     <button class="link danger" data-del="${x.id}">delete</button></div>`; }).join("")}</div>`;
}
function renderLog(preSpot){
  const now=new Date(), pad=n=>String(n).padStart(2,"0");
  const local=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
  const st=new Date(now.getTime()-2*3600e3);
  $("#view").innerHTML=`<div class="page-h"><h1>Log a session</h1><p class="muted">Your ratings teach the model how each spot really behaves.</p></div>
   <form class="card form" id="lf">
    <label>Spot<select name="spot">${SPOTS.map(s=>`<option value="${s.id}" ${s.id===preSpot?"selected":""}>${esc(s.name)}</option>`).join("")}</select></label>
    <div class="two"><label>Date<input type="date" name="date" value="${local(now)}" max="${local(now)}"></label>
    <label>From<input type="time" name="from" value="${pad(st.getHours())}:00"></label><label>To<input type="time" name="to" value="${pad(now.getHours())}:00"></label></div>
    <fieldset><legend>How good was it?</legend><div class="opts">${RATINGS.map((r,i)=>`<label class="opt"><input type="radio" name="rating" value="${i}"><span style="--c:${r.c}">${r.t}</span></label>`).join("")}</div></fieldset>
    <fieldset><legend>Wave size (sets)</legend><div class="opts">${SIZES.map((z,i)=>`<label class="opt"><input type="radio" name="size" value="${i}"><span>${z.t}</span></label>`).join("")}</div></fieldset>
    <fieldset><legend>Surface</legend><div class="opts">${["Glassy","Clean","Bumpy","Choppy","Blown out"].map(z=>`<label class="opt"><input type="radio" name="surface" value="${z}"><span>${z}</span></label>`).join("")}</div></fieldset>
    <label>Notes<textarea name="notes" rows="2" placeholder="Bars, crowd, best peak, tide/water level…"></textarea></label>
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
  const c=CAL;
  $("#view").innerHTML=`<div class="page-h"><h1>Model & learning</h1><p class="muted">How Nordkyst forecasts Kattegat windswell, and what it has learned from you.</p></div>
  <div class="card"><h3>What the model has learned</h3>
   <p class="small muted">Each logged session compares your rating and wave size with what the model predicted for that hour. Corrections are shrunk toward "no change" until there are enough sessions.</p>
   <table class="mc"><tr><th>Spot</th><th>Sessions</th><th>Size factor</th><th>Rating shift</th></tr>
   ${SPOTS.map(s=>{const x=c.spots[s.id];return `<tr><td>${esc(s.name)}</td><td>${x.n||0}${x.inherited?" <span class='muted'>(global)</span>":""}</td><td>×${fmt(x.size,2)}</td><td>${x.qBias>=0?"+":""}${fmt(x.qBias*100,0)} pts</td></tr>`}).join("")}</table>
   <div class="btns"><button class="btn" id="exp">Copy backup</button><button class="btn" id="dl">Download backup</button><label class="btn">Import<input type="file" id="imp" accept=".json,application/json" hidden></label></div>
   <p class="small muted" id="bmsg">Sessions are stored on this device only. Back them up now and then.</p></div>
  <div class="card"><h3>The Kattegat windswell model</h3>
   <p>The Kattegat has no ground swell: every rideable wave is wind-sea built inside the basin. So instead of a global swell model, Nordkyst runs its own local model:</p>
   <ol class="small">
    <li><b>Coastline geometry.</b> From a point just off each spot, rays every 6° measure open water to the next coast (Jutland, Anholt, Læsø, Sweden, Kullen, Zealand). The SPM effective-fetch method turns that into a fetch for every wind direction – see the rose on each spot page.</li>
    <li><b>Wind over the water.</b> DMI HARMONIE 2 km hourly wind at the spot's sea point, averaged with a sample further up the fetch (6 points across the Kattegat).</li>
    <li><b>Wave growth hour by hour.</b> Fetch- and duration-limited growth (Coastal Engineering Manual, JONSWAP-based). A sea that has blown for 6 h is limited by duration; after ~12 h of NW the long fetch becomes the limit. When the wind swings &gt;40° a new sea starts and the old one decays at a rate set by fetch and period.</li>
    <li><b>At the beach.</b> Windswell × direction factor (spot window) × exposure × shoaling → surf height. Quality = size × wind (local DMI wind vs. beach orientation) × period.</li>
    <li><b>Chance.</b> Weighted agreement of three runs – Kattegat model with DMI wind (50%), with ECMWF wind (20%), DWD's EWAM wind-sea (30%) – blended with the spot's historic rate as lead time grows.</li>
    <li><b>Your sessions</b> scale size and shift ratings per spot.</li>
   </ol>
   <p class="small">Check against EWAM, NW gale 13–15 Nov 2026 off Gilleleje: Kattegat model 2.0 m / 5.4 s vs EWAM 1.9–2.0 m / 5.1 s; RMSE 0.33 m over 60 h.</p></div>
  <div class="card"><h3>Data sources</h3><table class="mc small">
   <tr><td>Wind (beach, sea, Kattegat)</td><td>DMI HARMONIE-AROME DINI 2 km via Open-Meteo (<code>dmi_seamless</code>; ECMWF after ~2.5 days) + ECMWF IFS as second run</td></tr>
   <tr><td>Wind-sea cross-check, water temp, water level</td><td>DWD EWAM ~5 km (wind-sea partition only) via Open-Meteo Marine</td></tr>
   <tr><td>Past sessions</td><td>Archived DMI runs via Open-Meteo Historical Forecast API</td></tr>
   <tr><td>Historic base rates</td><td>ERA5 hourly wind (5 years) through the Kattegat model</td></tr></table>
   <p class="small muted">Spot parameters (orientation, window, exposure) are first estimates – your sessions correct them.</p></div>`;
  const json=()=>JSON.stringify({app:"nordkyst",v:1,sessions:SESSIONS},null,1);
  $("#exp").onclick=async()=>{ try{ await navigator.clipboard.writeText(json()); $("#bmsg").textContent="Copied – paste it into a note or mail to yourself."; }catch(e){ $("#bmsg").textContent="Copy blocked – use Download."; } };
  $("#dl").onclick=()=>{ const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([json()],{type:"application/json"})); a.download="nordkyst-sessions.json"; a.click(); };
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
function rebuild(){ STATE=buildModel(RAW.W, RAW.Wv, CLIM, CAL); }
function setStatus(html, cls=""){ $("#status").innerHTML=html; $("#status").className="status "+cls; }

async function boot(){
  setStatus("Loading DMI wind & wave data…");
  initFetch();
  const cached=load("nk_last_v3");
  let W, Wv=null, err=null;
  try{ W=await fetchWind(); }catch(e){ err=e; }
  if(W){ try{ Wv=await fetchWaves(); }catch(e){ console.warn("waves",e); } }
  if(!W && cached){ W=cached.W; Wv=cached.Wv; }
  if(!W){
    $("#view").innerHTML=`<div class="card"><h3>Couldn't load forecast data</h3><p>${esc(err&&err.message)}</p>
      <p class="small muted">Nordkyst fetches DMI data straight from open-meteo.com. If you opened it inside a chat/file preview, those block outside data – open it from its web address or the home-screen app instead.</p>
      <button class="btn primary" onclick="boot()">Try again</button></div>`;
    setStatus("Offline","err"); return;
  }
  if(!err) store("nk_last_v3",{W,Wv,at:Date.now()});
  RAW={W,Wv}; rebuild(); route();
  const at=err&&cached?new Date(cached.at):new Date();
  setStatus(`${err?"Offline · data from ":"Updated "}${at.toLocaleString("en-GB",{weekday:"short",hour:"2-digit",minute:"2-digit"})}${Wv?"":" · EWAM unavailable"}`, err?"warn":"");
  try{ CLIM=await fetchClimate(); rebuild(); if(location.hash.startsWith("#spot-")) route(); }catch(e){ console.warn("climate",e); }
}
document.addEventListener("DOMContentLoaded",()=>{
  $("#refresh").onclick=()=>boot();
  if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(()=>{});
  route(); boot();
});
