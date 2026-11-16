/* =========================================================================
   KWM — Kattegat Windswell Model
   A local, fetch- and duration-limited wind-sea model for North Zealand.
   - Coastline geometry of the Kattegat → per-spot effective fetch for every
     wind direction (SPM effective-fetch method, ray-cast every 6°).
   - Wave growth: Coastal Engineering Manual (CEM II-2) JONSWAP-based
     fetch-limited / duration-limited formulas, driven hour by hour by
     DMI HARMONIE 2 km wind over the water.
   - Two wave systems (active + decaying old sea) to handle turning winds.
   No ground-swell: the Kattegat is wind-sea only.
   ========================================================================= */
(function(root){
"use strict";
const RAD = Math.PI/180, G = 9.81;

/* ---- Coastline polygons [lat, lon] (simplified, ~2–5 km accuracy) ---- */
const LAND = {
  zealand: [[55.68,12.60],[55.80,12.58],[55.88,12.55],[55.95,12.53],[56.00,12.58],[56.035,12.615],[56.06,12.585],[56.075,12.54],[56.094,12.46],[56.11,12.40],[56.12,12.35],[56.127,12.30],[56.115,12.25],[56.104,12.19],[56.09,12.13],[56.058,12.07],[56.035,12.02],[56.01,11.96],[55.99,11.90],[55.972,11.865],[55.955,11.858],[55.94,11.85],[55.94,11.79],[55.972,11.785],[55.965,11.70],[55.975,11.55],[55.98,11.40],[55.978,11.28],[55.94,11.35],[55.90,11.45],[55.80,11.40],[55.70,11.10],[55.30,11.10],[55.30,12.60]],
  jutland: [[56.10,10.50],[56.20,10.70],[56.30,10.93],[56.41,10.93],[56.45,10.97],[56.55,10.85],[56.62,10.40],[56.65,10.30],[56.80,10.30],[57.00,10.32],[57.20,10.48],[57.33,10.52],[57.44,10.55],[57.60,10.48],[57.74,10.63],[57.60,10.00],[57.00,9.00],[55.60,9.00],[55.60,10.20]],
  samso:   [[55.98,10.62],[55.85,10.68],[55.75,10.58],[55.85,10.53]],
  laeso:   [[57.30,10.85],[57.33,11.05],[57.27,11.20],[57.20,11.05],[57.22,10.88]],
  anholt:  [[56.74,11.50],[56.72,11.67],[56.69,11.66],[56.70,11.50]],
  sweden:  [[55.35,13.00],[55.60,12.98],[55.87,12.82],[56.04,12.69],[56.12,12.62],[56.20,12.55],[56.28,12.48],[56.30,12.45],[56.27,12.58],[56.22,12.75],[56.25,12.85],[56.32,12.80],[56.42,12.65],[56.45,12.75],[56.43,12.85],[56.50,12.95],[56.66,12.85],[56.75,12.70],[56.90,12.48],[57.10,12.24],[57.30,12.08],[57.42,11.92],[57.60,11.90],[57.70,11.75],[58.00,11.55],[58.40,11.25],[59.00,11.10],[59.00,14.00],[55.35,14.00]]
};
const POLYS = Object.values(LAND);
function inPoly(lat, lon, poly){
  let inside = false;
  for(let i=0, j=poly.length-1; i<poly.length; j=i++){
    const [yi,xi] = poly[i], [yj,xj] = poly[j];
    if(((yi>lat)!==(yj>lat)) && (lon < (xj-xi)*(lat-yi)/(yj-yi)+xi)) inside = !inside;
  }
  return inside;
}
function isLand(lat, lon){ for(const p of POLYS) if(inPoly(lat,lon,p)) return true; return false; }
function move(lat, lon, bearing, km){
  return [lat + km*Math.cos(bearing*RAD)/111.2, lon + km*Math.sin(bearing*RAD)/(111.2*Math.cos(lat*RAD))];
}
const MAX_FETCH = 250, STEP = 1.5;
/* distance (km) over open water from a point toward a bearing */
function rayFetch(lat, lon, bearing){
  for(let d=STEP; d<=MAX_FETCH; d+=STEP){
    const [a,b] = move(lat, lon, bearing, d);
    if(isLand(a,b)) return d - STEP/2;
  }
  return MAX_FETCH;
}
/* SPM effective fetch for every wind-from direction (2° table) */
function fetchTable(lat, lon){
  const rays = {};
  for(let b=0; b<360; b+=6) rays[b] = rayFetch(lat, lon, b);
  const ray = b => { b=((Math.round(b/6)*6)%360+360)%360; return rays[b]; };
  const eff = new Float32Array(180);
  for(let k=0; k<180; k++){
    const th = k*2; let num=0, den=0;
    for(let a=-42; a<=42; a+=6){ const c=Math.cos(a*RAD); num += ray(th+a)*c*c; den += c; }
    eff[k] = num/den;
  }
  return {rays, eff};
}
const effFetch = (tab, dir) => tab.eff[Math.round((((dir%360)+360)%360)/2)%180];

/* ---- CEM growth relations (U10 in m/s, X in m, t in s) ---- */
function ustar(U){ const cd = 0.001*(1.1+0.035*U); return U*Math.sqrt(cd); }
const XFULL = Math.pow(211.5/0.0413, 2);          // dimensionless fetch at full development
function H_X(U, X){ const u=ustar(U), xd=Math.min(G*X/(u*u), XFULL); return 0.0413*Math.sqrt(xd)*u*u/G; }
function T_X(U, X){ const u=ustar(U), xd=Math.min(G*X/(u*u), XFULL); return 0.651*Math.cbrt(xd)*u/G; }
function X_H(U, H){ const u=ustar(U); const xd = Math.pow(H*G/(u*u)/0.0413, 2); return xd*u*u/G; }
function X_t(U, t){ const u=ustar(U); const xd = 5.23e-3*Math.pow(G*t/u, 1.5); return xd*u*u/G; }
function t_X(U, X){ const u=ustar(U); const xd=G*X/(u*u); return Math.pow(xd/5.23e-3, 2/3)*u/G; }

function angDiff(a,b){ let d=Math.abs(((a-b)%360+360)%360); return d>180?360-d:d; }
function rotate(from, to, f){ let d=((to-from+540)%360)-180; return (from + d*f + 360)%360; }
function decayFactor(sys){
  const cgKmh = 2.81*Math.max(2, sys.T||3);        // deep-water group speed
  const tau = Math.min(8, Math.max(1.5, 0.6*(sys.F||30)/cgKmh));
  return Math.exp(-1/tau);
}

/* Run the model for one spot.
   wind: array of {t, U, dir} (generation wind over water, hourly, oldest first)
   tab: fetch table for the spot
   cal: {gain} optional multiplier learned from sessions
   returns array of {t, Hs, Tp, dir, Feff, growing}                    */
function run(wind, tab, cal){
  const gain = (cal && cal.gain) || 1;
  let A = null, O = null;
  const out = [];
  for(const w of wind){
    if(w.U==null || w.dir==null){ out.push({t:w.t, Hs:null}); continue; }
    const U = Math.max(0.5, w.U), F = effFetch(tab, w.dir)*1000;
    if(A && angDiff(w.dir, A.dir) > 40){              // wind swung: old sea keeps decaying
      if(!O || A.H > O.H) O = A;
      A = null;
    }
    if(!A) A = {H:0, T:2, dir:w.dir, F:F/1000};
    // equivalent duration of the existing sea under the current wind
    const Xprev = A.H>0 ? X_H(U, A.H) : 0;
    const tEq = Xprev>0 ? t_X(U, Xprev) : 0;
    const Xnew = Math.min(X_t(U, tEq+3600), F);
    const Htarget = F>500 ? H_X(U, Xnew) : 0;
    let growing = false;
    if(Htarget >= A.H){ A.H = Htarget; A.T = T_X(U, Xnew); growing = true; }
    else { A.H = Math.max(Htarget, A.H*decayFactor(A)); A.T = Math.max(A.T*0.99, 2); }
    A.dir = rotate(A.dir, w.dir, 0.5); A.F = F/1000;
    if(O){ O.H *= decayFactor(O); if(O.H < 0.05) O = null; }
    const Ea = A.H*A.H, Eo = O ? O.H*O.H : 0;
    const dom = (!O || Ea>=Eo) ? A : O;
    out.push({t:w.t, Hs: gain*Math.sqrt(Ea+Eo), Tp: dom.T, dir: dom.dir, Feff: F/1000, growing});
  }
  return out;
}

root.KWM = {LAND, isLand, rayFetch, fetchTable, effFetch, run, H_X, T_X, X_t, angDiff, move};
})(typeof window!=="undefined"?window:globalThis);
