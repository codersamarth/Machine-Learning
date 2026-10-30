(function(){
"use strict";
var KEY="ml-playground-v3",parts=[],chosen=0,lastFile="",sizeLimit=20*1024*1024,editingId=null;
var $=id=>document.getElementById(id),esc=s=>String(s??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
function course(){try{var x=JSON.parse(localStorage.getItem(KEY)||"{}");if(!x||typeof x!=="object")return{};return x}catch(e){return{}}}
function save(x){localStorage.setItem(KEY,JSON.stringify(x))}
var names=["Introduction to ML & Python","Data preprocessing & feature engineering","Linear and polynomial regression","Logistic regression","Tree-based methods","Extensions of tree methods","STC case","Dimensionality reduction","Clustering & segmentation","Boats case","Linear programming","Integer programming","SFB integration case A","SFB integration case B","SFB integration case C"];
$("lecture-num").innerHTML=names.map((n,i)=>'<option value="'+(i+1)+'">Lecture '+(i+1)+': '+esc(n)+'</option>').join("");
function normalise(text){return String(text||"").replace(/\u0000/g,"").replace(/[ \t]{3,}/g,"  ").replace(/\n{4,}/g,"\n\n").trim()}
async function extractPDF(file){
 var pdf;
 try{pdf=await import("https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.mjs")}
 catch(e){throw Error("Could not load PDF.js. Check your internet connection, or paste text manually.")}
 pdf.GlobalWorkerOptions.workerSrc="https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/build/pdf.worker.mjs";
 var buffer=await file.arrayBuffer(),doc=await pdf.getDocument({data:buffer}).promise;
 var out=[];
 for(var page=1;page<=doc.numPages;page++){
  var content=await (await doc.getPage(page)).getTextContent();
  var text=content.items.map(x=>x.str+(x.hasEOL?"\n":" ")).join("");
  if(text.trim())out.push({label:"PDF page "+page,text:normalise(text)});
 }
 return out;
}
function loadScript(url){
 return new Promise((resolve,reject)=>{var script=document.createElement("script");script.src=url;script.onload=resolve;script.onerror=()=>reject(Error("Could not load ZIP parser; check internet."));document.head.appendChild(script)});
}
async function extractPPTX(file){
 if(!window.JSZip)await loadScript("https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js");
 var zip=await window.JSZip.loadAsync(file),names=Object.keys(zip.files).filter(n=>/^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a,b)=>Number(a.match(/(\d+)\.xml/)[1])-Number(b.match(/(\d+)\.xml/)[1]));
 var out=[];
 for(var i=0;i<names.length;i++){
  var xml=await zip.files[names[i]].async("string"),doc=new DOMParser().parseFromString(xml,"application/xml");
  var nodes=[...doc.getElementsByTagNameNS("*","t")];
  var content=nodes.map(n=>n.textContent).join("\n");
  if(content.trim())out.push({label:"Slide "+(i+1),text:normalise(content)});
 }
 if(!out.length)throw Error("No readable slide text was found. Images and charts cannot be extracted this way.");
 return out;
}
async function extractNotebook(file){
 var obj=JSON.parse(await file.text());
 if(!Array.isArray(obj.cells))throw Error("Not a valid Jupyter notebook");
 var cells=obj.cells.map((c,i)=>({label:"Cell "+(i+1)+" · "+(c.cell_type||"unknown"),text:normalise(Array.isArray(c.source)?c.source.join(""):(c.source||""))})).filter(c=>c.text);
 if(!cells.length)throw Error("The notebook has no readable code/Markdown cells");
 return cells;
}
async function extractText(file){
 var text=await file.text();
 if(file.name.toLowerCase().endsWith(".json")){
  var data=JSON.parse(text);if(data&&Array.isArray(data.cells))return extractNotebook(file);
 }
 var chunks=text.split(/\n\s*\n/).filter(s=>s.trim());
 return chunks.slice(0,150).map((text,i)=>({label:"Paragraph "+(i+1),text:normalise(text)}));
}
function current(){return parts[chosen]||{label:"No section",text:""}}
function refreshParts(){
 var sel=$("chunk");sel.disabled=!parts.length;
 sel.innerHTML=parts.length?parts.map((p,i)=>'<option value="'+i+'">'+esc(p.label)+'</option>').join(""):'<option>No readable text</option>';
 chosen=0;updatePreview();
}
function updatePreview(){
 var c=current();$("source-preview").value=c.text;$("lesson-source").value=lastFile?(lastFile+" · "+c.label):"";
 if(!$("lesson-title").value)$("lesson-title").value=c.text.split(/\n/).find(x=>x.length>10&&x.length<100)?.slice(0,85)||"New concept";
}
async function extract(){
 var file=$("file-input").files[0];if(!file){$("extract-status").textContent="Select a source file first.";return}
 if(file.size>sizeLimit){$("extract-status").textContent="File exceeds 20 MB limit.";return}
 $("extract-status").textContent="Reading "+file.name+" locally…";parts=[];lastFile=file.name;editingId=null;
 try{
  var name=file.name.toLowerCase();
  parts=name.endsWith(".pdf")?await extractPDF(file):name.endsWith(".pptx")?await extractPPTX(file):name.endsWith(".ipynb")?await extractNotebook(file):await extractText(file);
  if(!parts.length)throw Error("No selectable text found. It may be scanned or image-only.");
  refreshParts();
  $("extract-status").textContent="Extracted "+parts.length+" nonempty pages/slides/cells. Review headings, numbers and code before saving any lesson.";
 }catch(e){parts=[];refreshParts();$("extract-status").textContent="Extraction failed: "+e.message}
}
function insert(){
 var s=current().text;if(!s){$("save-status").textContent="Extract a file or write your own explanation first.";return}
 var prev=$("lesson-explanation").value;
 $("lesson-explanation").value=prev+(prev?"\n\n":"")+"SOURCE EXCERPT (REWRITE IN YOUR OWN WORDS BEFORE SAVING):\n"+s.slice(0,2500);
 $("save-status").textContent="Extracted text copied. Rewrite it, clarify diagrams and check against the original file before saving.";
}
function getForm(){return {lecture:Number($("lecture-num").value),title:$("lesson-title").value.trim(),hook:$("lesson-question").value.trim(),source:$("lesson-source").value.trim(),simple:$("lesson-explanation").value.trim()}}
function saveDraft(){
 var f=getForm();if(!f.title||f.title.length<5||f.simple.length<35){$("save-status").textContent="Write a title and at least 35 characters of your own verified explanation.";return}
 if(f.simple.includes("SOURCE EXCERPT (REWRITE IN YOUR OWN WORDS BEFORE SAVING)")){$("save-status").textContent="Please rewrite the extracted passage in your own words rather than saving a raw copyrighted excerpt.";return}
 if(!f.source){$("save-status").textContent="Provide a source reference (file and page/slide/cell).";return}
 var data=course();if(!Array.isArray(data.custom))data.custom=[];
 var id=editingId||"custom-"+Date.now();
 var lesson={id:id,lecture:f.lecture,title:f.title,hook:f.hook||"What does this concept mean?",simple:f.simple,university:f.simple,analogy:"Add your own analogy in lesson notes.",formula:"",code:"",pitfall:"Verify interpretation against the original source and ask what assumptions apply.",question:"",choices:[],correct:-1,source:f.source+" · personally reviewed source-derived draft"};
 var old=data.custom.findIndex(x=>x.id===id);
 if(old>=0)data.custom[old]=lesson;else data.custom.push(lesson);
 try{save(data);editingId=null;$("save-status").textContent="Saved as a local custom lesson. Open the main Learning Path to study it.";showSaved()}catch(e){$("save-status").textContent="Could not save. Export an existing backup to free browser storage."}
}
function showSaved(){
 var data=course(),items=Array.isArray(data.custom)?data.custom:[];
 $("saved-lessons").innerHTML=items.length?items.map(x=>'<div class="step"><b>'+esc(x.title)+'</b><p>Lecture '+x.lecture+' · '+esc(x.source||"user notes")+'</p><div class="row"><button class="btn alt small" data-edit="'+esc(x.id)+'">Edit lesson</button><button class="btn alt small" data-delete="'+esc(x.id)+'">Delete</button></div></div>').join(""):'<p class="muted">No custom lessons have been saved yet.</p>';
}
function editLesson(id){
 var x=(course().custom||[]).find(x=>x.id===id);if(!x)return;
 editingId=id;$("lecture-num").value=x.lecture;$("lesson-title").value=x.title;$("lesson-question").value=x.hook;$("lesson-source").value=x.source;$("lesson-explanation").value=x.simple;
 $("save-status").textContent="Editing "+x.title+". Saving will update this existing lesson, not create a duplicate.";
 $("lesson-title").focus();
}
$("extract").addEventListener("click",extract);
$("chunk").addEventListener("change",e=>{chosen=Number(e.target.value);updatePreview()});
$("insert-source").addEventListener("click",insert);
$("save-draft").addEventListener("click",saveDraft);
$("saved-lessons").addEventListener("click",e=>{
 var edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");
 if(edit){editLesson(edit.dataset.edit);return}
 if(del&&confirm("Delete this locally saved lesson?")){var d=course();d.custom=(d.custom||[]).filter(x=>x.id!==del.dataset.delete);save(d);showSaved();$("save-status").textContent="Lesson deleted."}
});
showSaved();
})();