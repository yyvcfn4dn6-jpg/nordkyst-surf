/* Shared skill-level definitions for Nordkyst + Peniche Surf.
   Each app computes the skill an hour REQUIRES (0–4) from its own physics;
   this file holds the levels, the penalty and the UI pieces.            */
(function(root){
"use strict";
const SKILLS = [
  {t:"Beginner", short:"Beg.", c:"#1fa463",
   can:"Stand up in whitewater on a soft-top; stay in your depth.",
   needs:"Knee–waist, gentle sandy beach, light wind, no strong current. Ideally with a school or lifeguards."},
  {t:"Novice", short:"Nov.", c:"#7cc46a",
   can:"Paddle out through small whitewater, catch unbroken waves, ride along the face.",
   needs:"Up to about waist–chest, mellow sandbank peaks, mild currents, clear channel to paddle out."},
  {t:"Intermediate", short:"Int.", c:"#f2b01e",
   can:"Duck-dive or turtle-roll, read sets and rips, turn on the face, hold your spot in a lineup.",
   needs:"Chest–head high, steeper or faster waves, rips between banks, small reefs or rocks, stronger wind."},
  {t:"Advanced", short:"Adv.", c:"#f07a2a",
   can:"Make late, steep take-offs, paddle out in solid sets, handle 10–15 s hold-downs.",
   needs:"Head to overhead, powerful or hollow beach breaks, reefs and rocks, strong rips."},
  {t:"Expert", short:"Exp.", c:"#b42324",
   can:"Surf big, heavy or barrelling waves; long hold-downs and big rips are routine.",
   needs:"Well overhead, closing-out or heavy waves (e.g. Supertubos pumping), storm leftovers."}
];
/* quality multiplier when conditions need more skill than you have */
function skillPenalty(req, user){ const over=req-user; return over<=0?1:over===1?0.35:0.08; }
function skillChip(req, user){
  if(req==null) return "";
  const s=SKILLS[req], above=user!=null&&req>user;
  return `<span class="chip sk${above?" sk-above":""}" style="--c:${s.c}" title="${s.needs}">${above?"Above your level · ":"Needs "}${s.t}</span>`;
}
function skillBar(cur, name){
  return `<div class="comfort skillbar"><span>My level</span><div class="opts">${SKILLS.map((s,i)=>`<label class="opt"><input type="radio" name="${name||"sk"}" value="${i}" ${i===cur?"checked":""}><span>${s.t}</span></label>`).join("")}</div>
   <details class="sk-help"><summary>What each level needs to handle</summary>
   <table class="cmp small">${SKILLS.map((s,i)=>`<tr class="${i===cur?"sel":""}"><td><span class="chip" style="--c:${s.c}">${s.t}</span></td><td><b>You can:</b> ${s.can}<br><span class="muted"><b>Conditions:</b> ${s.needs}</span></td></tr>`).join("")}</table>
   <p class="small muted">Every hour shows the level its conditions need (size, wave power, bottom, wind, currents). Hours above your level are marked and rated down hard.</p></details></div>`;
}
root.SKILL = {SKILLS, skillPenalty, skillChip, skillBar};
})(typeof window!=="undefined"?window:globalThis);
