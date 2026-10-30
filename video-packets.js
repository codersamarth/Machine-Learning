(function(){
"use strict";
var C=window.ML_CURRICULUM,J=window.ML_JOURNEY;
if(!C||!J)throw new Error("The ML Playground curriculum is required for Video Studio");
var topics=J.lessons.map(function(l){
 return {id:l.id,kind:"journey",group:l.stage,title:l.title,source:l.source,lesson:l,
   section:({zero:"Start from zero",python:"Python fundamentals",data:"Data foundations"})[l.stage]||"Beginner path"};
}).concat(C.lessons.map(function(l){
 return {id:l.id,kind:"curriculum",group:l.lecture===3?"regression":"lecture"+l.lecture,
   title:l.title,source:l.source,lesson:l,
   section:({1:"ML & Python · Lecture 1",2:"Preprocessing · Lecture 2",3:"Regression · Lecture 3"})[l.lecture]};
}));
if(new Set(topics.map(function(t){return t.id})).size!==topics.length)throw new Error("Duplicate video topic IDs");
function mdText(v){return String(v==null?"":v).replace(/\r\n/g,"\n").trim()}
function sourceText(t){
 var l=t.lesson;var out=[
  "# "+t.title,"",
  "ML PLAYGROUND | TOPIC-SPECIFIC VIDEO SOURCE",
  "Topic ID: "+t.id,
  "Learning area: "+t.section,
  "Source provenance: "+mdText(t.source),"",
  "> Independent educational explanation assembled from existing ML Playground content, NOT a verbatim handout or official INSEAD transcript. Recheck important claims against your authorised course sources before publication.","",
  "## Opening question",mdText(t.kind==="journey"?l.why:l.hook),"",
  "## Beginner-friendly explanation",mdText(t.kind==="journey"?l.plain:l.simple),"",
  "## Analogy",mdText(l.analogy)
 ];
 if(t.kind==="curriculum"){
  out.push("","## University-level explanation",mdText(l.university));
  if(l.formula)out.push("","## Formula or relationship",mdText(l.formula));
 }
 if(l.code){
  out.push("","## Python example (may be a snippet, not a standalone program)",
    l.code.split("\n").map(function(line){return "    "+line}).join("\n"));
 }
 if(t.kind==="journey"&&l.code){
  var codeLines=String(l.code).split("\n");
  out.push("","## Exact code-line interpretation (in execution order)");
  codeLines.forEach(function(line,i){out.push("Line "+(i+1)+": "+line,mdText(l.steps[i]||"Line explanation unavailable; verify before generating."),"")});
 }
 if(t.kind==="curriculum")out.push("","## Common pitfall",mdText(l.pitfall));
 else out.push("","## Key takeaway",mdText(l.takeaway));
 if(l.question&&Array.isArray(l.choices)&&l.choices.length){
  out.push("","## Understanding check",mdText(l.question));
  l.choices.forEach(function(s,i){out.push(String.fromCharCode(65+i)+". "+mdText(s))});
  out.push("Answer: "+String.fromCharCode(65+l.correct)+". "+mdText(l.choices[l.correct]));
 }
 out.push("","## Video accuracy rules",
  "- Focus on this topic; do not merge unrelated lessons.",
  "- Explain actual code inputs, operations, variable types, and what outputs can be determined.",
  "- If source offers no numerical result, do not invent dataset-specific values.",
  "- Distinguish illustrative examples from computed results.",
  "- Avoid reproducing copyrighted lecture slides or restricted case narratives.",
  "- Preserve supplementary labels and avoid falsely attributing material to official lectures.",
  "- End with one actionable understanding check.");
 return out.join("\n")+"\n";
}
function steeringPrompt(t,format){
 var l=t.lesson;var short=format==="short";
 return [
  "Create a "+(short?"SHORT (~60-second) recap":"detailed EXPLAINER")+" Video Overview ONLY about: "+t.title+".",
  "Audience: INSEAD MiM student with no prior Python, maths or machine-learning background.",
  "Ground the video ONLY in this topic-specific source named '"+t.title+"'. Omit unsupported claims and never invent citations, datasets, code outputs or lecture material.",
  short?"Structure: question, ONE intuitive example, one takeaway and a closing recall question. Do not cram in the whole course.":"Structure: (1) business question; (2) relatable analogy; (3) step-by-step plain-English explanation; (4) any source-supported formula visualized; (5) each supplied Python line explained in order, covering inputs, variables, object types/shapes, fitted state and outputs; (6) a frequent mistake; (7) three takeaways and one comprehension check.",
  "Use a calm, clear voice and legible whiteboard-style visuals. Keep formula and code annotations large enough for a phone. Highlight code one line at a time. Avoid visually distracting decorations.",
  "If code is an incomplete fragment, label it as such. Do not invent any printed result or performance metric when source evidence is missing.",
  "Preserve this provenance: "+t.source+". Supplementary concepts must not be described as official lecture content.",
  "This video is ONE of 71 topics; never summarize the other topics.",
  "End with the source-based question: "+(l.question||"Explain the input, operation and output in your own words.")
 ].join("\n\n");
}
function fileName(t){return t.id+"-"+t.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,68)+".md"}
window.ML_VIDEO_PACKETS={topics:topics,sourceText:sourceText,steeringPrompt:steeringPrompt,fileName:fileName};
})();