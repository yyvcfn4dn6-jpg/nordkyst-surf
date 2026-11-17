/* Nordkyst Surf — app logic */
"use strict";
const K = window.KWM;

/* ============================ SPOTS ============================ */
const SPOTS = [
 {id:"lynaes", rocks:0, piers:true, rips:0, current:1, name:"Lynæs", area:"Hundested", lat:55.948, lon:11.862, sea:[55.958,11.825], sea2:[55.975,11.80],
  facing:295, bestSwell:320, swellHalf:55, exposure:0.85, minWave:0.4, driveKm:65, driveMin:60,
  bottom:"Sand, gently sloping", level:"Beginner → intermediate",
  swellNeed:"NW windswell squeezing in between Rørvig and Hundested; needs NW 9 m/s+ for 8 h+",
  idealWind:"S–SE (offshore) after a NW blow; tolerates light W",
  desc:"Beach at the mouth of Isefjord – the surf-school hub of North Zealand. Its window to the open Kattegat is narrow (NW only), so it is smaller than the north coast but cleaner and sheltered when it's blowing hard from the W.",
  hazards:"Current near the harbour and fjord mouth.", parking:"Lynæs Strand / surf centre"},
 {id:"liseleje", rocks:1, piers:false, rips:1, current:0, name:"Liseleje", area:"Halsnæs", lat:56.012, lon:11.963, sea:[56.035,11.93], sea2:[56.06,11.88],
  facing:315, bestSwell:310, swellHalf:65, exposure:0.95, minWave:0.4, driveKm:60, driveMin:60,
  bottom:"Sand with bars, some stones", level:"All levels",
  swellNeed:"W–NW–N windswell; best after 10–15 m/s W/NW",
  idealWind:"SW–S (side-off/offshore) as a W–NW blow eases",
  desc:"NW-facing sandy beach with shifting bars, open to the long NW fetch across the Kattegat. Often the first spot to clean up when a westerly gale backs SW.",
  hazards:"Rips between bars when it's big.", parking:"Liseleje Strandvej"},
 {id:"tisvilde", rocks:0, piers:false, rips:2, current:0, name:"Tisvildeleje", area:"Gribskov", lat:56.058, lon:12.072, sea:[56.08,12.04], sea2:[56.11,12.00],
  facing:320, bestSwell:315, swellHalf:65, exposure:1.0, minWave:0.4, driveKm:60, driveMin:60,
  bottom:"Sand, outer and inner bars", level:"All levels",
  swellNeed:"NW windswell 0.8 m+ offshore; NW/W 9 m/s+ for half a day",
  idealWind:"S–SW (offshore/side-off); light NW onshore OK when small",
  desc:"Long NW-facing beach backed by Tisvilde Hegn forest. Very exposed to NW so it holds size and has the most consistent sandbar peaks on this stretch.",
  hazards:"Big NW onshore days are a washing machine – pick the clean-up.", parking:"Tisvildeleje Strand"},
 {id:"udsholt", rocks:2, piers:false, rips:1, current:0, name:"Rågeleje / Udsholt", area:"Gribskov", minSkill:2, lat:56.103, lon:12.185, sea:[56.13,12.17], sea2:[56.16,12.15],
  facing:345, bestSwell:325, swellHalf:60, exposure:1.0, minWave:0.5, driveKm:62, driveMin:60,
  bottom:"Pebbles, stones and boulder patches", level:"Intermediate+",
  swellNeed:"NW–N windswell 0.8 m+; better with higher water",
  idealWind:"W–WSW (side-offshore)",
  desc:"Stony stretch between Rågeleje and Udsholt. Boulders give the waves more shape than the sand beaches – arguably the best wave on the coast when it works, but it needs a bit more size.",
  hazards:"Rocks – booties recommended, careful at low water.", parking:"Udsholt Strand / Rågeleje"},
 {id:"gilleleje", rocks:1, piers:true, rips:1, current:0, name:"Gilleleje", area:"Gribskov", lat:56.124, lon:12.292, sea:[56.15,12.29], sea2:[56.18,12.28],
  facing:355, bestSwell:315, swellHalf:60, exposure:0.95, minWave:0.4, driveKm:60, driveMin:55,
  bottom:"Sand and stones, harbour piers", level:"All levels",
  swellNeed:"WNW–N windswell from a NW blow across the Kattegat",
  idealWind:"W (side-offshore) with a WNW sea",
  desc:"Northernmost point of Zealand. West of the harbour faces due north; the classic setup is a WNW windswell with a W wind cleaning it up.",
  hazards:"Pier structures; shallow stones near shore.", parking:"Gilleleje Vesterstrand"},
 {id:"hornbaek", rocks:1, piers:true, rips:1, current:0, name:"Hornbæk", area:"Helsingør", lat:56.094, lon:12.462, sea:[56.12,12.47], sea2:[56.15,12.47],
  facing:15, bestSwell:345, swellHalf:60, exposure:0.9, minWave:0.4, driveKm:50, driveMin:50,
  bottom:"Sand with stones; rocks along the Plantage", level:"All levels",
  swellNeed:"NW–N windswell; N/NW 9 m/s+",
  idealWind:"SW–W (side-off/offshore)",
  desc:"NNE-facing beach from the harbour east to Hornbæk Plantage. Picks up N windswell Gilleleje misses and goes side-offshore in westerlies. Closest north-coast break to Copenhagen.",
  hazards:"Harbour moles; rocky patches.", parking:"Hornbæk Havn / Plantage"},
 {id:"aalsgaarde", rocks:0, piers:false, rips:0, current:0, shallow:true, name:"Ålsgårde / Hellebæk", area:"Helsingør", lat:56.074, lon:12.545, sea:[56.095,12.57], sea2:[56.12,12.60],
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
const SK = window.SKILL;
let SKILL_LVL = load("nk_skill", 2);

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
/* skill the conditions need: size, rocks, strong wind (paddling, current) */
function reqSkill(spot, hb, ws){
  if(hb==null) return null;
  let r = hb<0.5?0:hb<0.9?1:hb<1.4?2:hb<2.0?3:4;
  if(spot.minSkill && hb>=0.4) r=Math.max(r, spot.minSkill);
  if(ws!=null && ws>=12) r++;
  return Math.min(4,r);
}
function quality(spot, Hs, T, dir, ws, wd, cal){
  const hb = breaking(spot, Hs, dir, cal);
  if(hb==null||ws==null) return {q:null,hb};
  const rel = windRel(spot, wd);
  let q = sizeScore(hb, spot.minWave)*(0.3+0.7*windScore(rel,ws))*(0.55+0.45*periodScore(T));
  if(cal && cal.qBias && q>0.05) q = clamp(q+cal.qBias,0,1);
  const req = reqSkill(spot, hb, ws); q *= SK.skillPenalty(req, SKILL_LVL);
  return {q, hb, rel, req, above: req>SKILL_LVL};
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
async function fetchSea(){
  const pts=SPOTS.map(s=>s.sea);
  return arr(await getJSON(`https://marine-api.open-meteo.com/v1/marine?latitude=${pts.map(p=>p[0]).join(",")}&longitude=${pts.map(p=>p[1]).join(",")}&hourly=sea_surface_temperature,sea_level_height_msl&timeformat=unixtime&past_days=${PAST_DAYS}&forecast_days=${FC_DAYS}`));
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
function buildModel(W, Wv, clim, cal, Ws){
  const now=Date.now()/1000, n=SPOTS.length;
  const spots = SPOTS.map((s,si)=>{
    const beach=W[si], times=beach.hourly.time, C=cal.spots[s.id]||cal.global;
    // KWM runs
    const runs={};
    [["kwm_dmi","dmi_seamless"],["kwm_ecmwf","ecmwf_ifs025"]].forEach(([key,m])=>{
      const g=genWind(si,W,m); if(g) runs[key]={sea:K.run(g,FETCH[s.id]), model:m, gen:g};
    });
    // EWAM wind-sea (first non-empty point)
    let ew=null;
    for(const loc of [Wv&&Wv[si], Wv&&Wv[n+si]]){
      const h=series(loc,"wind_wave_height"); if(h&&h.some(v=>v!=null)){ const map={}; loc.hourly.time.forEach((t,k)=>map[t]=k);
        ew={map,h,T:series(loc,"wind_wave_period"),d:series(loc,"wind_wave_direction"),sst:series(loc,"sea_surface_temperature"),sl:series(loc,"sea_level_height_msl")}; break; }
    }
    let seaMap=null; const SL=Ws&&Ws[si];
    if(SL&&SL.hourly){ seaMap={}; SL.hourly.time.forEach((t,k)=>seaMap[t]=k); }
    const gDmi=series(beach,"wind_gusts_10m","dmi_seamless"), tDmi=series(beach,"temperature_2m","dmi_seamless");
    // how long the generating wind has blown from roughly the same direction (h)
    const dur=[]; const G=runs.kwm_dmi&&runs.kwm_dmi.gen;
    if(G) G.forEach((g,i)=>{ let d=0; if(g.U!=null&&g.U>=5){ for(let k=i;k>=0&&k>i-48;k--){ const x=G[k]; if(x.U==null||x.U<5||angDiff(x.dir,g.dir)>35) break; d++; } } dur[i]=d; });
    const hours = times.map((t,i)=>{
      if(t < now - SHOW_PAST_H*3600) return null;
      const scen=[]; let wsD=series(beach,"wind_speed_10m","dmi_seamless"), wdD=series(beach,"wind_direction_10m","dmi_seamless");
      const wsE=series(beach,"wind_speed_10m","ecmwf_ifs025"), wdE=series(beach,"wind_direction_10m","ecmwf_ifs025");
      const add=(key,Hs,T,dir,ws,wd)=>{ if(Hs==null||ws==null) return; const r=quality(s,Hs,T,dir,ws,wd,C); scen.push({key,Hs,T,dir,ws,wd,...r}); };
      if(runs.kwm_dmi){ const o=runs.kwm_dmi.sea[i]; add("kwm_dmi",o.Hs,o.Tp,o.dir,wsD&&wsD[i],wdD&&wdD[i]); }
      if(runs.kwm_ecmwf){ const o=runs.kwm_ecmwf.sea[i]; add("kwm_ecmwf",o.Hs,o.Tp,o.dir,wsE&&wsE[i],wdE&&wdE[i]); }
      let sst=null, sl=null;
      if(ew){ const k=ew.map[t]; if(k!=null){ add("ewam",ew.h[k],ew.T&&ew.T[k],ew.d&&ew.d[k],wsD&&wsD[i],wdD&&wdD[i]); sst=ew.sst&&ew.sst[k]; sl=ew.sl&&ew.sl[k]; } }
      if(seaMap&&seaMap[t]!=null){ const k=seaMap[t]; if(sst==null) sst=SL.hourly.sea_surface_temperature[k]; if(sl==null) sl=SL.hourly.sea_level_height_msl[k]; }
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
              growing: runs.kwm_dmi&&runs.kwm_dmi.sea[i].growing, feff: runs.kwm_dmi?runs.kwm_dmi.sea[i].Feff:null, gen: G?G[i]:null, dur: dur[i]||0};
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
  const c=load("nk_clim_v4_"+SKILL_LVL); if(c&&Date.now()-c.at<7*864e5) return c;
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
  store("nk_clim_v4_"+SKILL_LVL,res); return res;
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

/* ============================ ANALYTICS: slots, plans, explanations ============================ */
const DIRS8 = [["N",0],["NE",45],["E",90],["SE",135],["S",180],["SW",225],["W",270],["NW",315]];
function tier(p){ return p>=0.6?{t:"Go",c:"go"}:p>=0.4?{t:"Worth a look",c:"look"}:p>=0.2?{t:"Long shot",c:"long"}:{t:"Unlikely",c:"no"}; }
const pct = p => p==null?"–":Math.round(p*100)+"%";

/* best slot per day per spot: peak hour, grown while chance stays near the peak */
function spotSlots(S){
  const out=[], byDay={};
  S.hours.forEach((h,i)=>{ if(h.past||!h.day||h.p==null) return; (byDay[dayKey(h.t)]||(byDay[dayKey(h.t)]=[])).push(i); });
  Object.values(byDay).forEach(idx=>{
    let pk=idx.reduce((a,i)=>S.hours[i].p>S.hours[a].p?i:a, idx[0]);
    const peak=S.hours[pk].p, ok=i=>idx.includes(i)&&S.hours[i].p>=Math.max(peak*0.75,peak-0.12);
    let a=pk, b=pk; while(b-a<3){ const L=ok(a-1), R=ok(b+1); if(!L&&!R) break; if(R&&(!L||S.hours[b+1].p>=S.hours[a-1].p)) b++; else a--; }
    const hs=S.hours.slice(a,b+1);
    out.push({S, hours:hs, start:hs[0].t, end:hs[hs.length-1].t+3600, peakH:S.hours[pk], pPeak:peak, pAvg:hs.reduce((x,h)=>x+h.p,0)/hs.length});
  });
  return out.sort((x,y)=>y.pPeak-x.pPeak);
}
function allSlots(M){ return M.spots.flatMap(spotSlots).sort((a,b)=>b.pPeak-a.pPeak); }
/* top 3 distinct options: skip slots overlapping in time with one already picked */
function top3(slots){ const out=[]; for(const s of slots){ if(out.length>=3) break; if(s.pPeak<0.12) break;
  if(out.some(o=>s.start<o.end&&o.start<s.end)) continue; out.push(s); } return out; }
function bindSkill(){ document.querySelectorAll('input[name="sk"]').forEach(r=>r.onchange=async()=>{ SKILL_LVL=+r.value; store("nk_skill",SKILL_LVL); CLIM=load("nk_clim_v4_"+SKILL_LVL); if(RAW) rebuild(); route();
  try{ CLIM=await fetchClimate(); rebuild(); route(); }catch(e){} }); }
function topCard(sl, i){ const s=sl.S.spot, P=sl.peakH.P, T=tier(sl.pPeak), p=plan(s, sl.start, sl.end);
  return `<a class="topc" href="#spot-${s.id}" data-t="${sl.peakH.t}"><span class="rank">#${i+1}</span>
    <div class="topc-m"><b>${esc(s.name)}</b><span>${tDay(sl.start)} · ${tHr(sl.start)}–${tHr(sl.end)}</span>
    <span class="small">🚗 Leave by <b>${tHr(p.leave)}</b> · ${rangeTxt(sl.peakH)} m · ${windLabel(P.rel,P.ws)}</span>
    <span>${chip(sl.peakH.q)} ${SK.skillChip(P.req, SKILL_LVL)} ${hzChip(safety(sl.S,sl.peakH).lvl,"Safety:")}</span></div>
    <div class="topc-p"><b>${pct(sl.pPeak)}</b><span class="tier ${T.c}">${T.t}</span></div></a>`; }
function plan(spot, start, end){
  const leave=start-(spot.driveMin+15)*60, arrive=start-15*60, home=end+spot.driveMin*60, sun=sunFor(start);
  return {leave, arrive, home, firstLight: sun.rise, dark: sun.set};
}
function planHtml(spot, sl){ const p=plan(spot, sl.start, sl.end);
  return `<div class="plan"><span>🚗 Leave CPH <b>${tHr(p.leave)}</b></span><span>Arrive <b>${tHr(p.arrive)}</b></span><span>Surf <b>${tHr(sl.start)}–${tHr(sl.end)}</b></span><span>Home ~<b>${tHr(p.home)}</b></span></div>`; }
function locHtml(s){
  return `<div class="loc"><b>📍 ${esc(s.parking)}</b><span class="muted">${s.lat.toFixed(3)}° N, ${s.lon.toFixed(3)}° E · ${s.driveKm} km, ~${s.driveMin} min from Rådhuspladsen</span>
   <span><a href="${mapsLink(s)}" target="_blank" rel="noopener">Google Maps route ↗</a> · <a href="https://maps.apple.com/?saddr=${ORIGIN.lat},${ORIGIN.lon}&daddr=${s.lat},${s.lon}&dirflg=d" target="_blank" rel="noopener">Apple Maps ↗</a></span></div>`; }

/* executive explanation of one hour at one spot */
function whyHtml(S, h){
  const s=S.spot, P=h.P; if(!P) return "";
  const g=h.gen, lines=[];
  if(g&&g.U!=null){
    const fe=Math.round(K.effFetch(FETCH[s.id], g.dir));
    lines.push(`<b>Setup:</b> ${compass(g.dir)} ${fmt(g.U,0)} m/s over the Kattegat${h.dur>=2?` for ${h.dur} h`:""} · ${fe} km of open water toward ${esc(s.name)} → <b>${fmt(P.Hs)} m windswell at ${fmt(P.T)} s</b> from ${compass(P.dir)}.`);
  }
  const lab=windLabel(P.rel,P.ws);
  lines.push(`<b>At the beach:</b> ${compass(P.wd)} ${fmt(P.ws,0)} m/s = <b>${lab}</b> for a ${compass(s.facing)}-facing beach → ${lab==="offshore"||lab==="side-off"||lab==="glassy"?"clean faces":lab==="cross-shore"?"some texture":"bumpy, wind-chopped"}.`);
  let trend = h.cleanup ? "Wind easing/turning after the blow – the classic Kattegat clean-up window." : (h.growing&&P.rel<70&&P.ws>8) ? "Sea still building under onshore wind – size up, quality down." : "";
  lines.push(`<b>Verdict:</b> ${RATINGS[Math.max(0,ratingIdx(h.q))].t}, ${sizeWords(P.hb).toLowerCase()} (${rangeTxt(h)} m), <b>${pct(h.p)} chance</b> of a good session. ${trend}`);
  if(P.req!=null) lines.push(`<b>Skill:</b> needs <b>${SK.SKILLS[P.req].t}</b> – ${SK.SKILLS[P.req].can.charAt(0).toLowerCase()+SK.SKILLS[P.req].can.slice(1)}${P.above?` <b>That is above your level (${SK.SKILLS[SKILL_LVL].t})</b> – rated down.`:""}`);
  return `<div class="why">${lines.map(l=>`<p>${l}</p>`).join("")}</div>`;
}
/* what the spot needs vs. what the forecast gives */
function checklist(S, h){
  const s=S.spot, P=h.P||{}; const st=v=>v===2?'<i class="ok">✓</i>':v===1?'<i class="mid">~</i>':'<i class="bad">✗</i>';
  const dd=P.dir==null?999:angDiff(P.dir,s.bestSwell), ws=windScore(P.rel??0,P.ws??0);
  const rows=[
    ["Surf size", `≥ ${s.minWave} m at beach`, `${fmt(P.hb)} m`, P.hb>=s.minWave?2:P.hb>=s.minWave*0.75?1:0],
    ["Sea direction", `${compass(s.bestSwell-s.swellHalf)}–${compass(s.bestSwell+s.swellHalf)}`, compass(P.dir), dd<s.swellHalf?2:dd<s.swellHalf+20?1:0],
    ["Wave period", "≥ 5 s", `${fmt(P.T)} s`, P.T>=5?2:P.T>=4?1:0],
    ["Wind at beach", "off/side-off, or < 6 m/s", `${compass(P.wd)} ${fmt(P.ws,0)} · ${P.ws!=null?windLabel(P.rel,P.ws):"–"}`, ws>=0.75?2:ws>=0.45?1:0],
    ["Daylight", "sunrise–sunset", h.day?"yes":"dark", h.day?2:0],
    ["Skill", `your level: ${SK.SKILLS[SKILL_LVL].t}`, P.req!=null?SK.SKILLS[P.req].t:"–", P.req==null?1:P.req<=SKILL_LVL?2:P.req===SKILL_LVL+1?1:0]
  ];
  return `<table class="chk"><tr><th>Condition</th><th>Spot needs</th><th>Forecast</th><th></th></tr>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${st(r[3])}</td></tr>`).join("")}</table>`;
}
/* one-line reason a spot does / doesn't work at an hour */
function reason(S, h){
  const s=S.spot, P=h&&h.P; if(!P) return "no data";
  const fe=Math.round(K.effFetch(FETCH[s.id], h.gen?h.gen.dir:P.wd)), dd=angDiff(P.dir,s.bestSwell);
  const sz=sizeScore(P.hb,s.minWave), wsc=windScore(P.rel,P.ws), lab=windLabel(P.rel,P.ws);
  if(sz<0.35){
    if(dd>=s.swellHalf) return `Sea from ${compass(P.dir)} misses its ${compass(s.bestSwell)} window – too small (${fmt(P.hb)} m).`;
    if(fe<40) return `Only ${fe} km of open water to the ${compass(h.gen?h.gen.dir:P.wd)} – sea can't build (${fmt(P.hb)} m).`;
    return `Not enough wind/duration yet – ${fmt(P.hb)} m at the beach.`;
  }
  if(wsc<0.45) return `${fmt(P.hb)} m but ${lab} ${fmt(P.ws,0)} m/s – messy.`;
  if(lab==="offshore"||lab==="side-off"||lab==="glassy") return `${fmt(P.hb)} m, ${lab} – clean. Faces ${compass(s.facing)}, so this wind grooms it.`;
  return `${fmt(P.hb)} m with ${lab} ${fmt(P.ws,0)} m/s – rideable, some texture.`;
}
/* static wind-direction guide from coastline geometry */
function windGuide(s){
  return DIRS8.map(([n,d])=>{
    const F=K.effFetch(FETCH[s.id], d), rel=windRel(s,d), inW=angDiff(d,s.bestSwell)<s.swellHalf+10;
    let code, txt;
    if(F>=50&&inW){ code="build"; txt= rel<70?"Builds surf – onshore, messy while it blows; best as it eases":"Builds surf with cross/side wind – best case"; }
    else if(rel>=100){ code="clean"; txt="Offshore/side-off – no new surf, cleans up what's left"; }
    else if(F>=20&&inW){ code="small"; txt="Short fetch – small windswell only"; }
    else { code="none"; txt= F<20?"Blocked by land – no surf":"Sea runs past the beach – little surf"; }
    return {n,d,F,rel,code,txt,lab:windLabel(rel,8)};
  });
}
const GUIDE_ICON={build:'<span class="gi build" title="Builds surf">●</span>',small:'<span class="gi small" title="Small surf">◐</span>',clean:'<span class="gi clean" title="Cleans up">○</span>',none:'<span class="gi none" title="Nothing">–</span>'};

/* ============================ MAPS (Leaflet, OSM/CARTO tiles) ============================ */
const MAPS={};
function tileLayer(){ return L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:18,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}); }
function makeMap(id, opts){
  if(typeof L==="undefined"){ const el=document.getElementById(id); if(el) el.innerHTML='<p class="muted small" style="padding:10px">Map unavailable offline.</p>'; return null; }
  if(MAPS[id]){ try{MAPS[id].remove()}catch(e){} }
  const m=L.map(id,Object.assign({zoomControl:true,attributionControl:true,scrollWheelZoom:false,tap:true},opts)); tileLayer().addTo(m); MAPS[id]=m;
  [50,300,1000].forEach(ms=>setTimeout(()=>{ try{ m.invalidateSize(); }catch(e){} },ms)); return m;
}
function pinIcon(color, label, big, below){ return L.divIcon({className:"pin-wrap",html:`<div class="pin ${big?"big":""} ${below?"below":""}" style="--c:${color}"><span>${label}</span></div>`,iconSize:null}); }
function drawOverviewMap(M, slots){
  const m=makeMap("ovMap",{center:[56.0,12.25],zoom:9}); if(!m) return;
  const pts=[[ORIGIN.lat,ORIGIN.lon]];
  M.spots.forEach((S,k)=>{ const s=S.spot, sl=slots.find(x=>x.S===S), i=sl?ratingIdx(sl.peakH.q):-1;
    const mk=L.marker([s.lat,s.lon],{icon:pinIcon(i>=0?RATINGS[i].c:"#9aa3ad", `${esc(s.name.split(" /")[0])} · ${sl?pct(sl.pPeak):"–"}`, false, k%2===1)}).addTo(m);
    mk.on("click",()=>{ location.hash="#spot-"+s.id; }); pts.push([s.lat,s.lon]); });
  L.marker([ORIGIN.lat,ORIGIN.lon],{icon:L.divIcon({className:"pin-wrap",html:'<div class="pin home"><span>Copenhagen</span></div>',iconSize:null})}).addTo(m);
  m.fitBounds(pts,{padding:[30,30]});
}
function drawSpotMap(S){
  const s=S.spot, el=document.getElementById("spMap"); if(!el) return;
  el.innerHTML=`<iframe title="Google Maps – ${esc(s.name)}" src="https://maps.google.com/maps?q=${s.lat},${s.lon}&z=14&t=k&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>`;
}


/* ============================ GEAR: board, wetsuit, time in water ============================ */
function waterTemp(S, h){
  if(h&&h.sst!=null) return h.sst;
  const i=S.hours.indexOf(h); let best=null, bd=1e9;
  S.hours.forEach((x,k)=>{ if(x.sst!=null&&Math.abs(k-i)<bd){ bd=Math.abs(k-i); best=x.sst; } });
  return best;
}
const SUITS=[
  [18,"3/2 mm","",[150,180]],[15,"4/3 mm","booties optional",[120,150]],[12,"4/3 mm","booties",[100,140]],
  [9,"5/4 mm hooded","5 mm booties, gloves optional",[80,110]],[6,"5/4 or 6/5 mm hooded","5–7 mm booties + 3–5 mm gloves",[60,90]],
  [-5,"6/5 mm hooded","7 mm booties + 5 mm mittens",[40,70]]];
function gearFor(S, h){
  const s=S.spot, P=h&&h.P||{}, wt=waterTemp(S,h), air=h?h.temp:null;
  const st=wt==null?null:SUITS.find(x=>wt>=x[0]);
  let mins=st?st[3].slice():null; const chill=[];
  if(mins){ if(air!=null&&air<3){ mins=mins.map(m=>m-15); chill.push(`air ${fmt(air,0)}°C`);} if(P.ws>10){ mins=mins.map(m=>m-15); chill.push(`wind ${fmt(P.ws,0)} m/s`);} mins=mins.map(m=>Math.max(30,m)); }
  // board
  const hb=P.hb||0, T=P.T||0, lab=P.ws!=null?windLabel(P.rel,P.ws):"", clean=["offshore","side-off","glassy"].includes(lab);
  let board, why;
  if(hb<0.45||T<4){ board="Longboard 9'+ or foamie"; why="small, short-period windswell – you need paddle power and glide"; }
  else if(hb<0.8){ board=clean?"Fish / groveller 5'8–6'4 (or mid-length 7'+)":"Mid-length 7'0–8'0"; why=clean?"knee–waist and clean: volume + speed for weak Kattegat walls":"weak, bumpy waves – extra length to get in early"; }
  else if(hb<1.4){ board=clean?"Shortboard with volume / hybrid 6'0–6'6":"Mid-length 7'0 or hybrid with volume"; why=clean?"waist–head and groomed – the best Kattegat days":"onshore chop – volume to paddle through and catch the short-period sets"; }
  else { board="Shortboard / step-up 6'2–6'8"; why="solid, powerful for the Kattegat – control over volume"; }
  if(s.level.startsWith("Beginner")&&hb<1) why+="; beginners: foamie 8'+";
  const extra=s.bottom.match(/stone|rock|pebble|boulder/i)?"Rocks/stones – booties recommended regardless of temperature.":"";
  return {wt, air, suit:st?`${st[1]}${st[2]?" + "+st[2]:""}`:"–", mins, chill, board, why, extra};
}
function gearHtml(S, h, compact){
  const g=gearFor(S,h);
  const time=g.mins?`${g.mins[0]}–${g.mins[1]} min`:"–";
  if(compact) return `<div class="gear"><span>🏄 <b>${g.board}</b></span><span>🌡 Water <b>${fmt(g.wt,0)}°C</b> · ${g.suit}</span><span>⏱ ~${time} in the water</span></div>`;
  return `<div class="gear-g">
    <div><span>Board</span><b>${g.board}</b><em>${g.why}.</em></div>
    <div><span>Water</span><b>${fmt(g.wt,1)}°C</b><em>air ${fmt(g.air,0)}°C · sea-surface forecast</em></div>
    <div><span>Wetsuit</span><b>${g.suit}</b><em>${g.extra||"for a normal session"}</em></div>
    <div><span>Time in the water</span><b>${time}</b><em>comfortable with that suit${g.chill.length?` · shortened for ${g.chill.join(" & ")}`:""}</em></div></div>`;
}


/* ============================ SAFETY: ranked, condition-based hazards ============================ */
const HZ_LV=[
  {t:"Low", c:"#1fa463", bg:"#e3f5ea", d:"Usual precautions."},
  {t:"Be aware", c:"#2a78d6", bg:"#e8f2fd", d:"Worth keeping in mind."},
  {t:"Take care", c:"#c98a00", bg:"#fff3d6", d:"Plan for it before you paddle out."},
  {t:"Serious", c:"#c0392b", bg:"#fde6e6", d:"Only for experienced surfers – consider another spot or time."}];
function hzChip(l, prefix){ const L=HZ_LV[l]; return `<span class="hzc" style="--c:${L.c};--b:${L.bg}">${prefix?prefix+" ":""}${L.t}</span>`; }
function hazards(S, h){
  const s=S.spot, P=(h&&h.P)||{}, out=[], add=(o)=>out.push(o);
  const hb=P.hb||0, ws=P.ws||0, rel=P.rel??0, gust=h.gust||ws, wt=waterTemp(S,h), air=h.temp, sl=h.sl, m=monthOf(h.t);
  // cold water
  if(wt!=null){ let l=wt<6?2:wt<12?1:0; if(l<3&&air!=null&&air<3&&ws>=8) l++;
    add({k:"cold",n:"Cold water",l,dyn:true,src:"sea temperature + air + wind",
      why:`Water ${fmt(wt,0)}°C, air ${fmt(air,0)}°C${ws>=8?`, wind ${fmt(ws,0)} m/s`:""}. Energy and grip fade faster than you notice.`,
      tip:"Wear the suggested wetsuit, booties, hood and gloves; stick to the time-in-water estimate and come in while you still feel strong."}); }
  // offshore drift
  if(rel>=105&&ws>=4){ const l=ws>=10?3:ws>=7?2:1;
    add({k:"off",n:"Offshore wind drift",l,dyn:true,src:"DMI wind vs beach orientation",
      why:`${compass(P.wd)} ${fmt(ws,0)} m/s blows from land to sea here – clean waves, but you and a lost board drift out.`,
      tip:"Stay close to the peak and the shore; never chase a board that's drifting out."}); }
  // rips & along-shore current
  { let l=hb>=1.3?2:hb>=0.7?1:0; if(s.rips&&hb>=0.7) l+=s.rips>=2?1:0; const along=rel>=40&&rel<105&&ws>=8; if(along&&hb>=0.5) l++; l=Math.min(hb>=1.6?3:2,l);
    if(hb>=0.4||along) add({k:"rip",n:"Rip & along-shore currents",l,dyn:true,src:"wave height, sandbars, wind angle",
      why:`${fmt(hb)} m waves${s.rips?" over sandbars":""}${along?` and ${fmt(ws,0)} m/s cross-shore wind pushing water along the beach`:""}.`,
      tip:"Check where the water is calm and darker before going in. If you get pulled, paddle parallel to the beach, not against it."}); }
  // rocks
  if(s.rocks){ let l=s.rocks; if(sl!=null&&sl<-0.1) l++; if(hb>=1) l++; l=Math.min(3,l);
    add({k:"rock",n:"Rocks & stones",l,dyn:true,src:"spot bottom, water level, wave height",
      why:`${esc(s.bottom)}.${sl!=null?` Water level ${sl>0?"+":""}${fmt(sl*100,0)} cm${sl<-0.1?" – lower than normal, more rocks exposed":""}.`:""}`,
      tip:"Booties on; walk in and out where it's sandy; fall flat and shallow."}); }
  // shallow
  if(s.shallow){ const l=(sl!=null&&sl<-0.1)?2:1;
    add({k:"shallow",n:"Shallow water",l,dyn:true,src:"water level",why:"Shallow sandbanks – more so at low water.",tip:"Fall flat, protect your head."}); }
  // piers
  if(s.piers){ const l=hb>=0.9&&rel>=40&&rel<110&&ws>=7?2:1;
    add({k:"pier",n:"Harbour piers & moles",l,dyn:l>1,src:"spot layout, wind angle",
      why:`Stone piers near the lineup${l>1?"; today's cross-shore wind drifts surfers toward them":""}.`,
      tip:"Keep a good gap to the moles and paddle back up-current regularly."}); }
  // fjord current
  if(s.current){ const l=ws>=10?2:1;
    add({k:"fjord",n:"Fjord-mouth current",l,dyn:ws>=10,src:"spot layout, wind",why:"Water flows in and out of Isefjord past the harbour.",tip:"Surf away from the harbour entrance."}); }
  // strong wind
  if(ws>=9||gust>=13){ const l=gust>=18?3:gust>=14||ws>=12?2:1;
    add({k:"wind",n:"Strong wind & gusts",l,dyn:true,src:"DMI wind and gusts",
      why:`${fmt(ws,0)} m/s, gusts ${fmt(gust,0)} m/s – tiring paddle, boards get blown around on the beach.`,
      tip:"Hold your board nose-into-wind on the beach; shorter session."}); }
  // waves vs your level
  if(P.req!=null&&hb>=0.4){ const over=P.req-SKILL_LVL, l=over>=2?3:over===1?2:(over===0&&hb>=1)?1:0;
    add({k:"size",n:"Wave size vs your level",l,dyn:true,src:"wave height + your skill setting",
      why:`${fmt(hb)} m (${sizeWords(hb).toLowerCase()}) needs ${SK.SKILLS[P.req].t}; you're set to ${SK.SKILLS[SKILL_LVL].t}.`,
      tip: over>0?"Watch a few sets from the beach first; it's fine to surf the inside or skip this one.":"Within your level – normal care."}); }
  // daylight
  { const sun=sunFor(h.t), left=(sun.set-(h.t+3600))/60; if(h.day&&left<90){ const l=left<40?2:1;
    add({k:"dark",n:"Fading daylight",l,dyn:true,src:"sunset time",why:`Sunset ${tHr(sun.set)}.`,tip:`Be back on the beach by about ${tHr(sun.set)}.`}); } }
  // remote / no lifeguards
  { const summer=m>=5&&m<=7; add({k:"alone",n:"Quiet beaches, no lifeguards",l:summer?0:1,dyn:false,src:"season",
      why:summer?"Lifeguards on some beaches in summer.":"Outside summer the beaches are quiet and unguarded.",
      tip:"Surf with a buddy, tell someone where you are; emergency number 112."}); }
  out.sort((a,b)=>b.l-a.l||(b.dyn-a.dyn));
  return out;
}
function safety(S,h){ const list=hazards(S,h); const lvl=list.length?list[0].l:0; return {lvl, list, top:list.filter(x=>x.l===lvl&&x.l>0)}; }
function safetyLine(S,h){ const sf=safety(S,h); return `${hzChip(sf.lvl,"Safety:")}${sf.top.length?` <span class="small muted">${sf.top.slice(0,2).map(x=>x.n.toLowerCase()).join(", ")}</span>`:""}`; }
function safetyCard(S,h){
  const sf=safety(S,h), L=HZ_LV[sf.lvl];
  const daysHtml=[...new Set(S.hours.filter(x=>!x.past&&x.day).map(x=>dayKey(x.t)))].slice(0,5).map(dk=>{
    const hs=S.hours.filter(x=>dayKey(x.t)===dk&&x.day&&!x.past&&x.P); if(!hs.length) return "";
    const lv=hs.map(x=>safety(S,x).lvl), mn=Math.min(...lv), mx=Math.max(...lv);
    return `<div class="hzd"><b>${tWd(hs[0].t)}</b>${hzChip(mn)}${mx>mn?`<span class="small muted">up to</span>${hzChip(mx)}`:""}</div>`; }).join("");
  return `<div class="card"><h3>Safety & hazards · ${tDay(h.t)} ${tHr(h.t)}</h3>
   <div class="hz-sum" style="--c:${L.c};--b:${L.bg}"><b>${L.t}</b><span>${L.d}</span></div>
   <ol class="hz">${sf.list.map(x=>`<li><div class="hz-h">${hzChip(x.l)}<b>${x.n}</b><span class="hz-dyn ${x.dyn?"on":""}">${x.dyn?"depends on today's conditions":"always here"}</span></div>
     <p>${x.why}</p><p class="muted">→ ${x.tip}</p></li>`).join("")}</ol>
   <h3 style="margin-top:12px">Next days (daylight, lowest → highest)</h3><div class="hzdays">${daysHtml}</div>
   <p class="small muted">Ranked from forecast wind and gusts (DMI), wave height, water temperature and level, sunset and the spot's layout. A guide to help you plan – always look at the water yourself before going in.</p></div>`;
}

/* ============================ HOME ============================ */
function renderHome(){
  const M=STATE, el=$("#view"), slots=allSlots(M), tops=top3(slots), top=tops[0]||slots[0];
  const spotBest=S=>slots.find(x=>x.S===S);
  let hero="";
  if(top){
    const s=top.S.spot, P=top.peakH.P, T=tier(top.pPeak);
    hero=`<a class="hero" href="#spot-${s.id}" data-t="${top.peakH.t}">
      <div class="hero-k">#1 · best slot for you <span class="tier ${T.c}">${T.t}</span></div>
      <div class="hero-row"><div><div class="hero-spot">${esc(s.name)}</div><div class="hero-when">${tDay(top.start)} · ${tHr(top.start)}–${tHr(top.end)}</div></div>
      <div class="hero-p"><b>${pct(top.pPeak)}</b><span>chance of a<br>good session</span></div></div>
      <div class="hero-surf"><span class="big">${rangeTxt(top.peakH)}<small>m</small></span><span>${sizeWords(P.hb)}<br>${chip(top.peakH.q)} ${SK.skillChip(P.req, SKILL_LVL)}</span></div>
      <div class="hero-meta">${arrow(P.wd,14)} ${compass(P.wd)} ${fmt(P.ws,0)} m/s · ${windLabel(P.rel,P.ws)} · ${fmt(P.Hs)} m @ ${fmt(P.T)} s from ${compass(P.dir)}</div>
      ${planHtml(s, top)}${gearHtml(top.S, top.peakH, true)}</a>`;
  }
  const list = slots.slice(0,6).map((sl,i)=>{ const s=sl.S.spot, P=sl.peakH.P, T=tier(sl.pPeak);
    return `<details class="slot" ${i===0?"open":""}><summary>
      <span class="slot-p"><b>${pct(sl.pPeak)}</b><span class="tier ${T.c}">${T.t}</span></span>
      <span class="slot-main"><b>${esc(s.name)}</b><span>${tDay(sl.start)} · ${tHr(sl.start)}–${tHr(sl.end)}</span></span>
      <span class="slot-r">${chip(sl.peakH.q)}<span>${rangeTxt(sl.peakH)} m waves</span><span class="small muted">${P.req!=null?SK.SKILLS[P.req].t:""} · ${HZ_LV[safety(sl.S,sl.peakH).lvl].t.toLowerCase()}</span></span></summary>
      ${planHtml(s, sl)}<div class="sfl">${safetyLine(sl.S, sl.peakH)}</div>${gearHtml(sl.S, sl.peakH, true)}${whyHtml(sl.S, sl.peakH)}${locHtml(s)}
      <a class="btn small-btn" href="#spot-${s.id}" data-t="${sl.peakH.t}">Open ${esc(s.name)} forecast →</a></details>`; }).join("");
  const days=[...new Set(M.spots[0].hours.filter(h=>!h.past&&h.day).map(h=>dayKey(h.t)))].slice(0,5);
  const rows=M.spots.map(S=>{
    const s=S.spot, nowH=S.hours.find(h=>!h.past)||S.hours[0], P=nowH.P, b=spotBest(S);
    const strip=days.map(dk=>{ const hs=S.hours.filter(h=>dayKey(h.t)===dk&&h.day&&!h.past&&h.p!=null);
      const best=hs.reduce((a,h)=>!a||h.p>a.p?h:a,null); const i=best?ratingIdx(best.q):-1;
      return `<span class="seg"><i style="background:${i>=0?RATINGS[i].c:"#e2e5e9"}"></i><em>${best?tWd(best.t).slice(0,2)+" "+pct(best.p):""}</em><em class="wh">${best?rangeTxt(best)+" m":""}</em></span>`; }).join("");
    const ri=ratingIdx(nowH.q);
    return `<a class="row" href="#spot-${s.id}">
      <span class="stripe" style="background:${ri>=0?RATINGS[ri].c:"#cfd3d8"}"></span>
      <div class="row-main"><div class="row-top"><b>${esc(s.name)}</b><span class="muted">${s.driveMin} min · faces ${compass(s.facing)}</span></div>
        <div class="row-now"><span class="muted small">Waves now</span><span class="surf">${rangeTxt(nowH)} m</span>${chip(nowH.q)}${P&&P.req!=null?SK.skillChip(P.req,SKILL_LVL):""}${P?hzChip(safety(S,nowH).lvl):""}<span class="wind">${P?arrow(P.wd,13)+" "+fmt(P.ws,0)+" "+windLabel(P.rel,P.ws):""}</span></div>
        <div class="strip">${strip}</div></div>
      <div class="row-next">${b?`<b>${pct(b.pPeak)}</b><span>${tWd(b.start)} ${tHr(b.start)}</span>`:`<span class="muted">–</span>`}</div></a>`;
  }).join("");
  // compare all spots at the top slot's peak hour
  let cmp="";
  if(top){
    const t=top.peakH.t, g=top.peakH.gen;
    const r=M.spots.map(S=>({S,h:S.hours.find(h=>h.t===t)})).filter(x=>x.h).sort((a,b)=>(b.h.p||0)-(a.h.p||0));
    cmp=`<div class="card"><h3>Why the pick differs by spot</h3>
      <p class="small muted">All spots at the best slot (${tDay(t)} ${tHr(t)}). Same weather – ${g?`${compass(g.dir)} ${fmt(g.U,0)} m/s over the Kattegat`:"same wind"} – but each beach faces a different way and sees a different amount of open water.</p>
      <table class="cmp">${r.map(({S,h})=>`<tr><td><a href="#spot-${S.spot.id}" data-t="${t}"><b>${esc(S.spot.name)}</b></a><br><span class="muted small">faces ${compass(S.spot.facing)}</span></td><td>${chip(h.q)}<br><b>${pct(h.p)}</b></td><td class="small">${reason(S,h)}</td></tr>`).join("")}</table></div>`;
  }
  const matrix=`<div class="card"><h3>Which wind works where</h3>
    <p class="small muted">Computed from each beach's orientation and the open water (fetch) upwind. Kattegat surf = wind-sea, so the wind direction decides everything.</p>
    <div class="tbl-wrap"><table class="mx"><tr><th></th>${DIRS8.map(d=>`<th>${d[0]}</th>`).join("")}</tr>
    ${SPOTS.map(s=>`<tr><td><a href="#spot-${s.id}">${esc(s.name.split(" /")[0])}</a></td>${windGuide(s).map(x=>`<td title="${x.txt} (${Math.round(x.F)} km)">${GUIDE_ICON[x.code]}</td>`).join("")}</tr>`).join("")}</table></div>
    <div class="legend-r small"><span>${GUIDE_ICON.build} builds surf</span><span>${GUIDE_ICON.small} small</span><span>${GUIDE_ICON.clean} cleans up (offshore)</span><span>${GUIDE_ICON.none} nothing</span></div>
    <p class="small"><b>In short:</b> NW is the money direction – the longest open water (100–140 km) and it hits every spot. W builds surf from Liseleje to Gilleleje but misses Lynæs, Hornbæk and Ålsgårde. N works everywhere; NE is blocked by Sweden/Kullen. S–SE (and SW for the north coast) is offshore: no new surf, but it cleans up what a NW blow left behind.</p></div>`;
  el.innerHTML = `${SK.skillBar(SKILL_LVL,"sk")}
    <div class="sec-h"><h2>Top 3 for you</h2><span class="muted small">next 5 days · ${SK.SKILLS[SKILL_LVL].t}</span></div>
    ${hero || `<div class="hero quiet"><div class="hero-spot">Nothing for your level</div></div>`}
    <div class="tops">${tops.slice(1).map((sl,i)=>topCard(sl,i+1)).join("")}</div>
    <div class="sec-h"><h2>All best slots</h2><span class="muted small">chance of ≥ Fair session</span></div>
    <div class="slots">${list}</div>
    <div class="sec-h"><h2>Map</h2><span class="muted small">tap a spot</span></div>
    <div class="mapbox" id="ovMap"></div>
    <div class="sec-h"><h2>Spots</h2><span class="muted small">now · day by day · best</span></div>
    <div class="list">${rows}</div>
    <div class="legend-r">${RATINGS.map(r=>`<span><i style="background:${r.c}"></i>${r.t}</span>`).join("")} <a href="#model" class="link">How ratings work →</a></div>
    ${cmp}${matrix}`;
  el.querySelectorAll("[data-t]").forEach(a=>a.addEventListener("click",()=>{ VIEW.sel=+a.dataset.t; VIEW.day=dayKey(+a.dataset.t); }));
  bindSkill(); drawOverviewMap(M, slots);
}

/* ============================ SPOT ============================ */
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
     <td>${tHr(h.t)}</td><td><b>${pct(h.p)}</b></td><td>${p.above?`<span class="chip" style="--c:${SK.SKILLS[p.req].c}">${SK.SKILLS[p.req].t}+</span>`:chip(h.q)}</td><td class="num"><b>${rangeTxt(h)}</b></td><td>${p.req!=null?`<span class="chip" style="--c:${SK.SKILLS[p.req].c}">${SK.SKILLS[p.req].short}</span>`:"–"}</td><td>${h.P?hzChip(safety(S,h).lvl):"–"}</td>
     <td class="num">${fmt(p.Hs)}<small> m</small> ${fmt(p.T,0)}<small>s</small> <span class="muted">${compass(p.dir)}</span></td>
     <td class="num">${arrow(p.wd,13)} ${fmt(p.ws,0)}<small>${h.gust!=null?"–"+fmt(h.gust,0):""}</small> <span class="muted">${p.ws!=null?windLabel(p.rel,p.ws):""}</span></td></tr>`; }).join("");
  const sims=similarSessions(s.id, P), mySess=SESSIONS.filter(x=>x.spot===s.id).sort((a,b)=>b.start-a.start);
  const slotRows=slots.slice().sort((a,b)=>a.start-b.start).map(sl=>{ const T=tier(sl.pPeak), p=plan(s,sl.start,sl.end);
    return `<tr data-t="${sl.peakH.t}" class="${dayKey(sl.start)===VIEW.day?"sel":""}"><td><b>${tWd(sl.start)}</b> ${tHr(sl.start)}–${tHr(sl.end)}</td><td><b>${pct(sl.pPeak)}</b><br><span class="tier ${T.c}">${T.t}</span></td><td>${chip(sl.peakH.q)}<br><span class="small">${rangeTxt(sl.peakH)} m waves</span><br>${hzChip(safety(S,sl.peakH).lvl)}</td><td class="small">${arrow(sl.peakH.P.wd,12)} ${compass(sl.peakH.P.wd)} ${fmt(sl.peakH.P.ws,0)} ${windLabel(sl.peakH.P.rel,sl.peakH.P.ws)}</td><td class="small">leave ${tHr(p.leave)}</td></tr>`; }).join("");
  const guide=windGuide(s);
  const selSlot=slots.find(x=>x.hours.includes(sel));
  $("#view").innerHTML=`
   <div class="sp-head"><a class="back" href="#home" aria-label="Back">‹</a>
     <div><h1>${esc(s.name)}</h1><div class="muted">${esc(s.area)} · faces ${compass(s.facing)} · ${s.driveMin} min from Copenhagen</div></div></div>
   <div class="now-card">
     <div class="now-top"><div><div class="muted small">${tDay(sel.t)} · ${tHr(sel.t)}${sel.past?" (past)":""}</div>
       <div class="small" style="opacity:.8">Wave height at the beach</div><div class="big">${rangeTxt(sel)}<small>m</small></div><div>${sizeWords(P.hb)} ${SK.skillChip(P.req, SKILL_LVL)} ${hzChip(safety(S,sel).lvl,"Safety:")}</div></div>
       <div class="now-r">${chip(sel.q)}<div class="pct"><b>${pct(sel.p)}</b><span>chance of a<br>good session</span></div></div></div>
     <div class="stats">
       <div><span>Wind</span><b>${arrow(P.wd,14)} ${compass(P.wd)} ${fmt(P.ws,0)}</b><em>${P.ws!=null?windLabel(P.rel,P.ws):""}${sel.gust!=null?` · g${fmt(sel.gust,0)}`:""}</em></div>
       <div><span>Windswell</span><b>${fmt(P.Hs)} m</b><em>${fmt(P.T)} s from ${compass(P.dir)}</em></div>
       <div><span>Water</span><b>${fmt(waterTemp(S,sel),0)}°C</b><em>air ${fmt(sel.temp,0)}°C</em></div>
       <div><span>Level</span><b>${sel.sl!=null?(sel.sl>0?"+":"")+fmt(sel.sl*100,0):"–"}</b><em>cm vs mean</em></div>
     </div>
     ${selSlot?planHtml(s, selSlot):""}
   </div>
   ${safetyCard(S, sel)}
   <div class="card"><h3>Board & wetsuit · ${tDay(sel.t)} ${tHr(sel.t)}</h3>${gearHtml(S, sel)}</div>
   <div class="card"><h3>Why · ${tDay(sel.t)} ${tHr(sel.t)}</h3>${whyHtml(S, sel)}${checklist(S, sel)}</div>
   <div class="card"><h3>Best time slots · next 5 days</h3><p class="small muted">Best daylight block per day. Tap to open that day.</p>
     <div class="tbl-wrap"><table class="hours slotsT"><thead><tr><th>Slot</th><th>Chance</th><th>Rating</th><th>Wind</th><th>Drive</th></tr></thead><tbody>${slotRows||"<tr><td colspan=5 class='muted'>No daylight data</td></tr>"}</tbody></table></div></div>
   <div class="card"><h3>Chance by hour · 5 days</h3><div id="pChart"></div></div>
   <div class="dtabs">${tabs}</div>
   <div class="card"><div class="ch-h"><h3>Hour by hour</h3><label class="tog"><input type="checkbox" id="night" ${VIEW.night?"checked":""}> night</label></div>
     <div id="dayChart"></div>
     <div class="tbl-wrap"><table class="hours"><thead><tr><th>Time</th><th>Chance</th><th>Rating</th><th>Wave height m</th><th>Skill</th><th>Safety</th><th>Windswell</th><th>Wind m/s</th></tr></thead><tbody>${rows}</tbody></table></div></div>
   <div class="card"><h3>Location</h3>${locHtml(s)}<div class="mapbox small-map" id="spMap"></div><p class="small muted">Google Maps satellite view of the beach. Tap the route links for live traffic.</p></div>
   <div class="card"><h3>What makes ${esc(s.name)} work</h3><p>${esc(s.desc)}</p>
     <dl class="kv"><dt>Needs</dt><dd>${esc(s.swellNeed)}</dd><dt>Best wind</dt><dd>${esc(s.idealWind)}</dd><dt>Bottom</dt><dd>${esc(s.bottom)}</dd><dt>Level</dt><dd>${esc(s.level)}</dd><dt>Hazards</dt><dd>${esc(s.hazards)}</dd></dl>
     <h3 style="margin-top:14px">Wind direction guide</h3>
     <table class="cmp">${guide.map(x=>`<tr><td><b>${x.n}</b></td><td>${GUIDE_ICON[x.code]}</td><td class="small">${x.txt}<br><span class="muted">${Math.round(x.F)} km fetch · ${x.lab}</span></td></tr>`).join("")}</table></div>
   <div class="card"><h3>Model check · ${tHr(sel.t)}</h3>
     <table class="mc"><tr><th></th><th>Windswell</th><th>Surf</th><th>Rating</th></tr>
     ${[["kwm_dmi","Kattegat model · DMI wind"],["kwm_ecmwf","Kattegat model · ECMWF wind"],["ewam","DWD EWAM wind-sea"]].map(([k,l])=>{const x=sel.scen.find(y=>y.key===k);return `<tr><td>${l}</td><td>${x?fmt(x.Hs)+" m · "+fmt(x.T)+" s "+compass(x.dir):"n/a"}</td><td>${x?fmt(x.hb):"–"}</td><td>${x?chip(x.q):"–"}</td></tr>`}).join("")}</table>
     <p class="small muted">Agreement between the three runs raises the chance; disagreement lowers it.</p>
     ${C&&C.n?`<p class="small">Calibrated from your ${C.n} session${C.n>1?"s":""}: size ×${fmt(C.size,2)}, rating ${C.qBias>=0?"+":""}${fmt(C.qBias*100,0)} pts.</p>`:""}
     ${sims.length?`<p class="small"><b>${sims.length} similar logged session${sims.length>1?"s":""}</b> here averaged <b>${RATINGS[Math.round(sims.reduce((a,x)=>a+x.rating,0)/sims.length)].t}</b>.</p>`:""}</div>
   <a class="btn primary block" href="#log-${s.id}">＋ Log a session at ${esc(s.name)}</a>
   <div class="card"><h3>Open water upwind (fetch)</h3><div id="rose"></div></div>
   <div class="card"><h3>Historic base rate</h3><p class="muted small">Share of daylight hours ≥ Fair: 5 years of ERA5 wind through the Kattegat model${CLIM?` (${CLIM.range})`:""}.</p><div id="climChart">${cl?"":"<p class='muted'>Loading…</p>"}</div>
     ${cl?`<p class="small">Typical ${new Intl.DateTimeFormat("en-GB",{month:"long"}).format(new Date(2026,mNow,1))}: <b>${Math.round(cl[mNow].pct*100)}%</b> of daylight hours, ~<b>${fmt(cl[mNow].days,1)}</b> good days.</p>`:""}</div>
   ${mySess.length?`<div class="card"><h3>Your sessions here</h3>${sessList(mySess.slice(0,5))}</div>`:""}`;
  $("#view").querySelectorAll(".dtab").forEach(b=>b.onclick=()=>{ VIEW.day=b.dataset.d; VIEW.sel=null; renderSpot(id); });
  $("#view").querySelectorAll("tr[data-t]").forEach(r=>r.onclick=()=>{ VIEW.sel=+r.dataset.t; VIEW.day=dayKey(+r.dataset.t); renderSpot(id); });
  $("#night").onchange=e=>{ VIEW.night=e.target.checked; renderSpot(id); };
  drawDayChart(S, dh, sel, id); drawPChart(S, sel, id); drawRose(s); if(cl) drawClim(cl, mNow); drawSpotMap(S); bindDeletes();
}

function drawPChart(S, sel, id){
  const host=$("#pChart"), W=Math.max(300,host.clientWidth), H=100, PL=30, PT=8;
  const hs=S.hours.filter(h=>!h.past&&h.day); if(!hs.length){ host.innerHTML=""; return; }
  const n=hs.length, gap=4, days=[...new Set(hs.map(h=>dayKey(h.t)))], slotW=(W-PL-gap*(days.length-1))/n;
  let g=""; [0,0.5,1].forEach(v=>{ const y=PT+(1-v)*H; g+=`<line x1="${PL}" x2="${W}" y1="${y}" y2="${y}" class="grid"/><text x="${PL-4}" y="${y+3}" text-anchor="end" class="ax">${v*100}%</text>`; });
  let x=PL, prev=null;
  hs.forEach(h=>{ const dk=dayKey(h.t); if(prev&&dk!==prev) x+=gap; if(dk!==prev) g+=`<text x="${x}" y="${PT+H+13}" class="ax b">${tWd(h.t)}</text>`; prev=dk;
    const i=ratingIdx(h.q), bh=Math.max(1,(h.p||0)*H);
    g+=`<rect x="${x+0.5}" y="${PT+H-bh}" width="${Math.max(1,slotW-1)}" height="${bh}" rx="1.5" fill="${i>=0?RATINGS[i].c:"#cfd3d8"}"><title>${tDay(h.t)} ${tHr(h.t)} · ${pct(h.p)} · ${i>=0?RATINGS[i].t:""}</title></rect>`;
    if(h.t===sel.t) g+=`<rect x="${x-0.5}" y="${PT-2}" width="${slotW+1}" height="${H+4}" fill="none" stroke="#0b1f33" stroke-width="1.5"/>`;
    g+=`<rect class="hit" data-t="${h.t}" x="${x}" y="0" width="${slotW}" height="${H+PT}" fill="transparent"/>`;
    x+=slotW; });
  g+=`<line x1="${PL}" x2="${W}" y1="${PT+H*0.6}" y2="${PT+H*0.6}" stroke="#0b1f33" stroke-dasharray="3 3" opacity=".5"/><text x="${W-2}" y="${PT+H*0.6-3}" text-anchor="end" class="ax">Go ≥ 60%</text>`;
  host.innerHTML=`<svg viewBox="0 0 ${W} ${H+PT+18}" width="100%" height="${H+PT+18}" role="img" aria-label="Chance of a good session by daylight hour">${g}</svg><p class="small muted">Daylight hours only; bar colour = rating, height = chance of a ≥ Fair session.</p>`;
  host.querySelectorAll(".hit").forEach(r=>r.addEventListener("click",()=>{ VIEW.sel=+r.dataset.t; VIEW.day=dayKey(+r.dataset.t); renderSpot(id); }));
}

function drawDayChart(S, hs, sel, id){
  const host=$("#dayChart"), W=Math.max(300,host.clientWidth), H=140, PL=30, PR=6, PT=18;
  if(!hs.length){ host.innerHTML=""; return; }
  const max=Math.max(1, Math.ceil(Math.max(...hs.map(h=>h.hi||0))*2)/2);
  const bw=(W-PL-PR)/hs.length, y=v=>PT+(H-PT)-clamp(v/max,0,1)*(H-PT);
  let g=""; for(let v=0;v<=max+1e-9;v+=0.5){ g+=`<line x1="${PL}" x2="${W-PR}" y1="${y(v)}" y2="${y(v)}" class="grid"/><text x="${PL-5}" y="${y(v)+3}" text-anchor="end" class="ax">${v}</text>`; }
  hs.forEach((h,i)=>{ const x=PL+i*bw+1, w=Math.max(2,bw-2), ri=ratingIdx(h.q), c=ri>=0?RATINGS[ri].c:"#cfd3d8";
    if(h.lo!=null){ const top=y(h.hi), mid=y(Math.max(0,(h.P?h.P.hb:h.lo)));
      g+=`<rect x="${x}" y="${top}" width="${w}" height="${Math.max(1,y(0)-top)}" rx="${Math.min(4,w/2)}" fill="${c}" opacity="0.3"/>`;
      g+=`<rect x="${x}" y="${mid}" width="${w}" height="${Math.max(1,y(0)-mid)}" rx="${Math.min(4,w/2)}" fill="${c}" opacity="${h.past?0.5:1}"/>`; }
    if(h.t===sel.t) g+=`<rect x="${x-1}" y="${PT-4}" width="${w+2}" height="${H-PT+4}" fill="none" stroke="#0b1f33" stroke-width="1.5" rx="3"/>`;
    if(i%2===0||hs.length<10) g+=`<text x="${x+w/2}" y="${H+13}" text-anchor="middle" class="ax">${hourOf(h.t)}</text>`;
    g+=`<rect class="hit" data-i="${i}" x="${PL+i*bw}" y="0" width="${bw}" height="${H+16}" fill="transparent"/>`; });
  host.innerHTML=`<svg viewBox="0 0 ${W} ${H+18}" width="100%" height="${H+18}" role="img" aria-label="Hourly surf height">${g}<text x="${PL}" y="10" class="ax">surf height m (solid = Kattegat model · faint = model spread)</text></svg>
    <div class="legend-r small">${RATINGS.map(r=>`<span><i style="background:${r.c}"></i>${r.t}</span>`).join("")}</div>`;
  host.querySelectorAll(".hit").forEach(r=>{ const h=hs[+r.dataset.i];
    r.addEventListener("click",()=>{ hideTip(); VIEW.sel=h.t; renderSpot(id); }); });
}
function drawRose(s){
  const tab=FETCH[s.id], R=100, cx=120, cy=120; let g="";
  [50,100,150,200,250].forEach(km=>{ g+=`<circle cx="${cx}" cy="${cy}" r="${km/250*R}" class="grid" fill="none"/>`; });
  g+=`<text x="${cx+3}" y="${cy-R*100/250-2}" class="ax">100 km</text>`;
  const a0=(s.bestSwell-s.swellHalf), a1=(s.bestSwell+s.swellHalf), P=(a,r)=>[cx+Math.sin(a*RAD)*r, cy-Math.cos(a*RAD)*r];
  const [x0,y0]=P(a0,R), [x1,y1]=P(a1,R);
  g+=`<path d="M${cx},${cy} L${x0},${y0} A${R},${R} 0 ${a1-a0>180?1:0} 1 ${x1},${y1} Z" fill="#e8f2fd" stroke="#0e5fd8" stroke-dasharray="4 3"/>`;
  for(let d=0; d<360; d+=10){ const f=K.effFetch(tab,d), r=f/250*R, [xa,ya]=P(d-4.5,r), [xb,yb]=P(d+4.5,r);
    g+=`<path d="M${cx},${cy} L${xa},${ya} A${r},${r} 0 0 1 ${xb},${yb} Z" fill="#2a78d6" stroke="#fff" stroke-width="1"><title>${compass(d)}: ${Math.round(f)} km</title></path>`; }
  ["N","E","S","W"].forEach((l,i)=>{ const [x,y]=P(i*90,R+12); g+=`<text x="${x}" y="${y+4}" text-anchor="middle" class="ax b">${l}</text>`; });
  const [bx,by]=P(s.facing,R*0.35); g+=`<line x1="${cx}" y1="${cy}" x2="${bx}" y2="${by}" stroke="#0b1f33" stroke-width="2"/><circle cx="${cx}" cy="${cy}" r="3" fill="#0b1f33"/>`;
  const top=[...Array(36)].map((_,i)=>[i*10,K.effFetch(tab,i*10)]).sort((a,b)=>b[1]-a[1])[0];
  $("#rose").innerHTML=`<div class="rose"><svg viewBox="0 0 240 240" width="240" height="240" role="img" aria-label="Fetch rose">${g}</svg>
    <div class="small"><p>How far wind can blow over open water before reaching the beach. Longest: <b>${compass(top[0])} · ${Math.round(top[1])} km</b>.</p><p>Dark line = beach faces <b>${compass(s.facing)}</b>. Dashed wedge = swell window.</p></div></div>`;
}
function drawClim(cl, mNow){
  const W=Math.max(280,$("#climChart").clientWidth), H=90, PL=34, bw=(W-PL)/12, max=Math.max(0.05,Math.ceil(Math.max(...cl.map(c=>c.pct))*20)/20);
  let g=""; [0,max/2,max].forEach(v=>{const y=H-v/max*H+8; g+=`<line x1="${PL}" x2="${W}" y1="${y}" y2="${y}" class="grid"/><text x="${PL-4}" y="${y+3}" text-anchor="end" class="ax">${Math.round(v*100)}%</text>`;});
  "JFMAMJJASOND".split("").forEach((m,i)=>{ const h=cl[i].pct/max*H, x=PL+i*bw+3;
    g+=`<rect x="${x}" y="${H-h+8}" width="${bw-6}" height="${Math.max(0,h)}" rx="3" fill="${i===mNow?"#184f95":"#86b6ef"}"><title>${Math.round(cl[i].pct*100)}% · ~${fmt(cl[i].days,1)} good days</title></rect><text x="${x+(bw-6)/2}" y="${H+21}" text-anchor="middle" class="ax">${m}</text>`; });
  $("#climChart").innerHTML=`<svg viewBox="0 0 ${W} ${H+24}" width="100%" height="${H+24}">${g}</svg>`;
}

/* ============================ RATINGS EXPLAINED ============================ */
const RATING_DEF = [
  ["Flat","< 0.15","No rideable waves. Stay home."],
  ["Poor","0.15–0.30","Tiny or blown out. Not worth the drive."],
  ["Poor–Fair","0.30–0.45","Rideable on a longboard/foamie, usually messy. Only if you're nearby."],
  ["Fair","0.45–0.62","Surfable, worth the drive if keen. This is the line for a “good session”."],
  ["Good","0.62–0.80","Waist–chest+ with decent wind. Go."],
  ["Firing","≥ 0.80","As good as the Kattegat gets: chest–head high, 5–6 s+, offshore/side-off or glassy. A handful of days a year."]
];
function ratingsCard(){
  return `<div class="card" id="ratings"><h3>How ratings work</h3>
   <p class="small">Every hour gets a quality score <b>q</b> from 0 to 1:</p>
   <p class="formula">q = Size × Wind × Period × Skill</p>
   <ul class="small">
    <li><b>Size</b> – estimated breaking height at the beach vs. the spot's minimum (0.4–0.5 m). Full marks 0.9–1.8 m; drops when tiny or storm-sized (&gt; 2.6 m).</li>
    <li><b>Wind</b> – local DMI wind vs. the beach's orientation. Offshore/side-off or &lt; 2.5 m/s = 100%; cross-shore 45–85%; onshore 15–70% depending on strength. Never zero, because Kattegat waves only exist while it blows.</li>
    <li><b>Period</b> – 5–7 s organised windswell scores well, &lt; 4 s chop poorly.</li>
    <li><b>Skill</b> – each hour needs a level: by surf size (&lt; 0.5 m Beginner, &lt; 0.9 m Novice, &lt; 1.4 m Intermediate, &lt; 2 m Advanced, above Expert), at least Intermediate on the rocks at Udsholt, one level up in 12 m/s+ wind. One level above yours ×0.35, two or more ×0.08.</li>
   </ul>
   <table class="cmp">${RATING_DEF.map(([n,r,d])=>{const R=RATINGS.find(x=>x.t===n);return `<tr><td><span class="chip" style="--c:${R.c}">${n}</span></td><td class="small">q ${r}</td><td class="small">${d}</td></tr>`}).join("")}</table>
   <h3 style="margin-top:14px">What the % means</h3>
   <p class="small"><b>Chance of a good session</b> = probability the hour rates <b>Fair or better</b>. It combines three runs – Kattegat model with DMI wind (50%), with ECMWF wind (20%) and DWD's EWAM wind-sea (30%) – and leans on the spot's 5-year history the further ahead you look. <b>Go</b> ≥ 60% · <b>Worth a look</b> 40–60% · <b>Long shot</b> 20–40%.</p>
   <h3 style="margin-top:14px">Safety levels</h3>
   <table class="cmp small">${HZ_LV.map(L=>`<tr><td>${hzChip(HZ_LV.indexOf(L))}</td><td>${L.d}</td></tr>`).join("")}</table>
   <p class="small muted">Each hour lists the hazards that apply at that spot – cold water, offshore drift, rips and along-shore currents, rocks, piers, strong wind, wave size vs your level, fading daylight, quiet unguarded beaches – ranked from highest to lowest. The overall level is the highest single hazard. "Depends on today's conditions" means the forecast moves it; "always here" means it comes with the spot or season.</p>
   <h3 style="margin-top:14px">Board & wetsuit guide</h3>
   <table class="cmp small"><tr><td><b>Surf &lt; 0.45 m or &lt; 4 s</b></td><td>Longboard 9'+ / foamie</td></tr><tr><td><b>0.45–0.8 m</b></td><td>Fish/groveller when clean, mid-length 7–8' when bumpy</td></tr><tr><td><b>0.8–1.4 m</b></td><td>Shortboard with volume / hybrid when clean, mid-length in onshore chop</td></tr><tr><td><b>&gt; 1.4 m</b></td><td>Shortboard / step-up 6'2–6'8</td></tr></table>
   <table class="cmp small" style="margin-top:8px">${SUITS.map((x,i)=>`<tr><td><b>${i===SUITS.length-1?"&lt; 6":x[0]+(i?"–"+SUITS[i-1][0]:"+")}°C</b></td><td>${x[1]}${x[2]?" + "+x[2]:""}</td><td>${x[3][0]}–${x[3][1]} min</td></tr>`).join("")}</table>
   <p class="small muted">Time in the water assumes a well-fitting suit; it is cut by 15 min each for air below 3°C or wind above 10 m/s. Kattegat windswell is short-period and weak, so it pays to ride more volume than you would on the North Sea.</p>
   <p class="small"><b>Slots</b> = the best daylight block per day per spot (up to 4 h). Drive plan = leave Copenhagen drive time + 15 min before the slot (parking, wetsuit).</p></div>`;
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
  ${SK.skillBar(SKILL_LVL,"sk")}
  ${ratingsCard()}
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
  bindSkill();
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
function rebuild(){ STATE=buildModel(RAW.W, RAW.Wv, CLIM, CAL, RAW.Ws); }
function setStatus(html, cls=""){ $("#status").innerHTML=html; $("#status").className="status "+cls; }

async function boot(){
  setStatus("Loading DMI wind & wave data…");
  initFetch();
  const cached=load("nk_last_v3");
  let W, Wv=null, err=null;
  try{ W=await fetchWind(); }catch(e){ err=e; }
  let Ws=null;
  if(W){ try{ [Wv,Ws]=await Promise.all([fetchWaves().catch(e=>{console.warn("waves",e);return null}), fetchSea().catch(e=>{console.warn("sea",e);return null})]); }catch(e){ console.warn(e); } }
  if(!W && cached){ W=cached.W; Wv=cached.Wv; Ws=cached.Ws; }
  if(!W){
    $("#view").innerHTML=`<div class="card"><h3>Couldn't load forecast data</h3><p>${esc(err&&err.message)}</p>
      <p class="small muted">Nordkyst fetches DMI data straight from open-meteo.com. If you opened it inside a chat/file preview, those block outside data – open it from its web address or the home-screen app instead.</p>
      <button class="btn primary" onclick="boot()">Try again</button></div>`;
    setStatus("Offline","err"); return;
  }
  if(!err) store("nk_last_v3",{W,Wv,Ws,at:Date.now()});
  RAW={W,Wv,Ws}; rebuild(); route();
  const at=err&&cached?new Date(cached.at):new Date();
  setStatus(`${err?"Offline · data from ":"Updated "}${at.toLocaleString("en-GB",{weekday:"short",hour:"2-digit",minute:"2-digit"})}${Wv?"":" · EWAM unavailable"}`, err?"warn":"");
  try{ CLIM=await fetchClimate(); rebuild(); if(location.hash.startsWith("#spot-")) route(); }catch(e){ console.warn("climate",e); }
}
document.addEventListener("DOMContentLoaded",()=>{
  $("#refresh").onclick=()=>boot();
  if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("sw.js").catch(()=>{});
  route(); boot();
});
