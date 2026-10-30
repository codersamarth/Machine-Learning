(function(){
"use strict";
var state={caseName:"titanic",columns:[],rows:[],filename:"",history:[],quiz:{},filters:{},weight:1.1,tolerance:.2};
var expected={titanic:["PassengerId","Pclass","Name","Sex","Age","SibSp","Parch","Ticket","Fare","Cabin","Embarked"],diamond:["ID","Carat Weight","Cut","Color","Clarity","Polish","Symmetry","Report","Price"]};
var $=id=>document.getElementById(id);
var esc=s=>String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
function parseCSV(src){
 if(src.charCodeAt(0)===65279)src=src.slice(1);
 var out=[],row=[],part="",quoted=false,closed=false;
 function field(){row.push(part);part="";closed=false}
 function line(){if(row.some(x=>x!==""))out.push(row);row=[]}
 for(var i=0;i<src.length;i++){
  var c=src[i];
  if(quoted){if(c==='"'){if(src[i+1]==='"'){part+='"';i++}else{quoted=false;closed=true}}else part+=c}
  else if(c==='"'){if(part!==""||closed)throw Error("Unexpected quote at position "+i);quoted=true}
  else if(c===","||c==="\n"||c==="\r"){if(c==="\r"&&src[i+1]==="\n")i++;field();if(c!==",")line()}
  else {if(closed)throw Error("Unexpected text after quote");part+=c}
 }
 if(quoted)throw Error("Unclosed CSV quote");
 field();line();if(!out.length)throw Error("The CSV is empty");
 var cols=out.shift();if(cols.some(c=>!c.trim()))throw Error("Empty header name");
 if(new Set(cols).size!==cols.length)throw Error("Duplicate header names");
 var invalid=out.findIndex(r=>r.length!==cols.length);
 if(invalid>=0)throw Error("CSV row "+(invalid+2)+" has wrong column count");
 return {cols:cols,rows:out.map(r=>Object.fromEntries(cols.map((c,i)=>[c,r[i]])))};
}
function toCSV(){var row=[state.columns].concat(state.rows.map(r=>state.columns.map(c=>r[c])));return row.map(a=>a.map(value=>{var s=String(value??"");if(/^\s*[=+@-]/.test(s)&&!/^-?\d+(\.\d+)?$/.test(s.trim()))s="'"+s;return /[,"\r\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s}).join(",")).join("\n")+"\n"}
function num(x){return String(x||"").trim()===""?NaN:Number(x)}
function median(arr){var a=arr.filter(Number.isFinite).sort((x,y)=>x-y),n=a.length;return n?n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2:NaN}
function countMissing(field){return state.rows.filter(r=>!String(r[field]??"").trim()||/^nan$/i.test(r[field])).length}
function invalidFares(rows){return rows.filter(r=>Number.isFinite(num(r.Fare))&&num(r.Fare)<0).length}
function duplicates(rows){var seen=new Set(),n=0;rows.forEach(r=>{var k=JSON.stringify(state.columns.map(c=>r[c]));if(seen.has(k))n++;seen.add(k)});return n}
function stats(){return {rows:state.rows.length,missingAge:countMissing("Age"),missingCabin:countMissing("Cabin"),missingEmbarked:countMissing("Embarked"),invalidFare:invalidFares(state.rows),duplicates:duplicates(state.rows)}}
function preserve(){state.history.push(state.rows.map(r=>({...r})));if(state.history.length>10)state.history.shift()}
function mutate(operation){preserve();var before=state.rows.length;operation();render();status("Change applied. "+(before-state.rows.length)+" rows removed; press Undo to restore.")}
function status(s){$("upload-status").textContent=s}
function download(name,body){var url=URL.createObjectURL(new Blob([body],{type:"text/csv;charset=utf-8"})),a=document.createElement("a");a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),500)}
function choiceOptions(key,prompt,choices,correct,why){var v=state.quiz[key];return '<div class="mission"><h3>'+esc(prompt)+'</h3>'+choices.map((t,i)=>'<button class="answer '+(v!==undefined?(i===correct?"correct":i===v?"wrong":""):"")+'" data-quiz="'+key+'" data-value="'+i+'">'+String.fromCharCode(65+i)+'. '+esc(t)+'</button>').join("")+(v===undefined?"":'<div class="callout '+(v===correct?"":"warn")+'">'+(v===correct?"✓ Correct. ":"The best answer is "+esc(choices[correct])+". ")+esc(why)+'</div>')+'</div>'}
function summaryTable(cols,rows,max){return '<div class="scroll"><table class="studytable"><thead><tr>'+cols.map(c=>'<th>'+esc(c)+'</th>').join("")+'</tr></thead><tbody>'+rows.slice(0,max).map(row=>'<tr>'+cols.map(c=>'<td'+(row[c]===""?' style="background:#fff4d7;color:#765629"':"")+'>'+esc(row[c]||"(missing)")+'</td>').join("")+'</tr>').join("")+'</tbody></table></div>'}
function titanicPage(){
 var a=stats(),base='<div class="statgrid">'+[["Observations",a.rows],["Missing ages",a.missingAge],["Missing cabins",a.missingCabin],["Negative fares",a.invalidFare]].map(p=>'<div class="metric"><small>'+p[0]+'</small><strong>'+p[1]+'</strong></div>').join("")+'</div>';
 base+='<div class="grid g2"><div class="card"><div class="eyebrow">MISSION 1 · INVESTIGATE</div><h2>Find the corrupted fare</h2><p>The actual Lecture 2 Titanic file contains a negative fare in its final row. Inspect the dataset, then remove this invalid observation without dropping ordinary outliers.</p><div class="callout warn">Current negative fares: <b>'+a.invalidFare+'</b></div><div class="row"><button class="btn" data-action="remove-fare" '+(!a.invalidFare?"disabled":"")+'>Remove negative-fare rows</button><button class="btn alt" data-action="undo" '+(!state.history.length?"disabled":"")+'>↶ Undo</button></div></div>'+
 '<div class="card"><div class="eyebrow">MISSION 2 · MISSING VALUES</div><h2>Clean unknown information</h2><p><b>Age:</b> '+a.missingAge+' missing. You can fill with the median of currently observed ages; in real modeling, fit the imputer on the training split only.</p><p><b>Embarked:</b> '+a.missingEmbarked+' missing. Replace with the most common observed port.</p><p><b>Cabin:</b> '+a.missingCabin+' missing. Too sparse for a naive fill; consider dropping it for this practice.</p><div class="row"><button class="btn alt small" data-action="fill-age" '+(!a.missingAge?"disabled":"")+'>Fill Age median</button><button class="btn alt small" data-action="fill-embarked" '+(!a.missingEmbarked?"disabled":"")+'>Fill Embarked mode</button><button class="btn alt small" data-action="drop-cabin" '+(!state.columns.includes("Cabin")?"disabled":"")+'>Drop Cabin column</button></div></div></div>';
 base+='<div class="card"><div class="eyebrow">MISSION 3 · FEATURE ENGINEERING</div><h2>Create meaningful new features</h2><p>FamilySize = SibSp + Parch + 1. A derived column helps describe how many family members travelled together (including the passenger). You can also remove exact duplicate rows after investigating them.</p><div class="row"><button class="btn" data-action="family" '+(state.columns.includes("FamilySize")?"disabled":"")+'>Create FamilySize feature</button><button class="btn alt" data-action="dedupe" '+(!a.duplicates?"disabled":"")+'>Remove '+a.duplicates+' exact duplicate rows</button><button class="btn alt" data-action="export">Download cleaned CSV</button></div><div class="scroll" style="margin-top:16px">'+summaryTable(state.columns.slice(0,11),state.rows,7)+'</div></div>';
 base+='<div class="card"><div class="eyebrow">CONCEPT CHECKS · EXPLAIN WHY</div><h2>Can you make trustworthy decisions?</h2>'+
 choiceOptions("t1","Pclass contains 1, 2 and 3. How should it usually be interpreted?",["As arbitrary continuous measurements","As categories representing passenger classes","As a target you want to predict"],1,"Numeric codes can still represent categories; a class label is not a measurement.")+
 choiceOptions("t2","Can you train a supervised Titanic survival model from this exact CSV alone?",["Yes, Survived is the last column","No, the Survived target is absent","Yes, passenger name is always the label"],1,"This source file has 11 columns, none named Survived. It is used here to teach cleaning and feature engineering.")+
 choiceOptions("t3","Why must imputation be learned on the training subset in a predictive pipeline?",["To reduce information leakage into evaluation","Because test data have fewer rows","Because mean/median are meaningless"],0,"Using test data to choose imputation values reveals information that should remain unseen.")+
 '</div>';
 return base;
}
function selectOptions(field){var vals=[...new Set(state.rows.map(r=>r[field]).filter(Boolean))].sort();return '<label class="label" for="f-'+field+'">'+esc(field)+'</label><select id="f-'+field+'" data-filter="'+esc(field)+'"><option value="">All '+esc(field)+' values</option>'+vals.map(v=>'<option value="'+esc(v)+'" '+(state.filters[field]===v?"selected":"")+'>'+esc(v)+'</option>').join("")+'</select>'}
function diamondComparables(){
 var target=state.weight,tol=state.tolerance;
 return state.rows.filter(r=>Number.isFinite(num(r["Carat Weight"]))&&Number.isFinite(num(r.Price))&&Math.abs(num(r["Carat Weight"])-target)<=tol)
 .filter(r=>Object.entries(state.filters).every(([k,v])=>!v||r[k]===v));
}
function scatterDiamond(rows){var selected=rows.filter(r=>Number.isFinite(num(r["Carat Weight"]))&&Number.isFinite(num(r.Price))),maxY=Math.max(1,...selected.map(r=>num(r.Price))),minX=.5,maxX=3.2;var pts=selected.slice(0,500);var W=760,H=320,x=x=>53+(W-75)*(x-minX)/(maxX-minX),y=y=>H-45-(H-85)*y/maxY;
return '<svg class="chart" viewBox="0 0 760 320" role="img" aria-label="Actual diamond prices against carat weight for selected filters"><rect x="50" y="35" width="690" height="240" rx="4" fill="#f9f8ff"/>'+
[0,.25,.5,.75,1].map(t=>'<line x1="53" y1="'+y(maxY*t)+'" x2="740" y2="'+y(maxY*t)+'" stroke="#e5e8f2"/><text x="5" y="'+(y(maxY*t)+4)+'">'+Math.round(maxY*t/1000)+'k</text>').join("")+
pts.map(r=>'<circle cx="'+x(num(r["Carat Weight"]))+'" cy="'+y(num(r.Price))+'" r="3.4" fill="#7954d5" opacity=".55"><title>'+num(r["Carat Weight"])+' ct · $'+num(r.Price)+'</title></circle>').join("")+
'<text x="350" y="311">Carat weight</text><text x="6" y="15">Price ($)</text></svg>'}
function diamondPage(){
 var rows=diamondComparables(),n=rows.length,prices=rows.map(r=>num(r.Price)).filter(Number.isFinite),med=median(prices),min=Math.min(...prices),max=Math.max(...prices),ppc=median(rows.map(r=>num(r.Price)/num(r["Carat Weight"])).filter(Number.isFinite));
 var total=state.rows.length;
 return '<div class="statgrid">'+[["All listings",total],["Comparable listings",n],["Median comparable price",Number.isFinite(med)?"$"+Math.round(med).toLocaleString():"—"],["Median $/carat",Number.isFinite(ppc)?"$"+Math.round(ppc).toLocaleString():"—"]].map(p=>'<div class="metric"><small>'+p[0]+'</small><strong>'+p[1]+'</strong></div>').join("")+'</div>'+
 '<div class="contentcols"><div><div class="card"><div class="eyebrow">REAL MARKET DATA · INTERACTIVE SCATTER</div><h2>Price vs carat weight</h2>'+scatterDiamond(state.rows.filter(r=>Object.entries(state.filters).every(([k,v])=>!v||r[k]===v)))+'<p class="point-note">Displays up to 500 rows after filters; calculations use all eligible listings. Prices and characteristics come only from your uploaded CSV.</p></div>'+
 '<div class="card"><div class="eyebrow">COMPARABLE SALES</div><h2>Find diamonds with similar characteristics</h2><p>A descriptive comparison—not a validated price prediction model. Use this to see how carat, cut, colour, clarity and certification affect the observed range. Avoid interpreting this as intrinsic value.</p>'+
 '<label class="label" for="weight">Target carat: <span id="wt">'+state.weight.toFixed(2)+'</span></label><input id="weight" type="range" min=".75" max="2.9" step=".05" value="'+state.weight+'">'+
 '<label class="label" for="tol">± carat tolerance: <span id="tl">'+state.tolerance.toFixed(2)+'</span></label><input id="tol" type="range" min=".05" max=".50" step=".05" value="'+state.tolerance+'">'+
 '<div class="callout blue">'+(n?'<b>Matching listing price range:</b> $'+Math.round(min).toLocaleString()+'–$'+Math.round(max).toLocaleString()+'. Median: $'+Math.round(med).toLocaleString()+'.':'No records match your selected criteria. Widen tolerance or remove filters.')+'</div>'+summaryTable(["ID","Carat Weight","Cut","Color","Clarity","Report","Price"],rows,7)+'</div></div>'+
 '<aside><div class="card"><div class="eyebrow">FILTERS · MODIFY THE COMPARISON</div><h2>Choose characteristics</h2>'+["Cut","Color","Clarity","Report"].map(selectOptions).join("")+'<div class="row" style="margin-top:17px"><button class="btn alt" data-action="clear-filters">Clear filters</button><button class="btn alt" data-action="export">Export current CSV</button></div><p class="tiny">The chart shows actual observations, not invented predictions. A price association is not proof of causation.</p></div></aside></div>'+
 '<div class="card"><div class="eyebrow">DIAMOND DETECTIVE · CHECK YOUR REASONING</div>'+
 choiceOptions("d1","A very high price for a larger diamond proves its price is fair. True or false?",["True, weight alone determines value","False, quality and other factors can affect price","True, any fitted model proves market value"],1,"Inspect similar carat weights and comparable grades. Price estimates have limitations.")+
 choiceOptions("d2","What does the median of comparable listings tell us?",["Guaranteed price of every diamond","The middle observed listing price of this selected set","A causal effect of color"],1,"A descriptive statistic summarizes this sample; it is not a guarantee.")+
 choiceOptions("d3","Why avoid using ID as a numeric predictor?",["ID identifies rows but generally has no meaningful price relationship","Because IDs must always be predicted","Because a categorical label cannot ever be encoded"],0,"Identifiers can encourage spurious relationships and leakage; choose meaningful available features.")+'</div>';
}
function emptyWorkspace(){return '<div class="card"><div class="eyebrow">STEP 1 · LOAD YOUR SOURCE FILE</div><h2>Start with real data, not pretend results</h2><p>Upload <b>'+(state.caseName==="titanic"?"Titanic.csv":"Sarah_dataset.csv")+'</b> from your course files. The data stay on your device; no raw copyrighted dataset will be published in the GitHub repository.</p><div class="callout blue"><b>What you will learn:</b> '+(state.caseName==="titanic"?"Find a corrupt negative fare, distinguish categories and numbers, reason about missing values, add a family-size feature and check for target leakage.":"Explore how price relates to carat and quality, filter genuine listings, compare actual prices and evaluate the limits of estimates.")+'</div></div>'}
function render(){
 $("tab-titanic").classList.toggle("selected",state.caseName==="titanic");
 $("tab-diamond").classList.toggle("selected",state.caseName==="diamond");
 ["titanic","diamond"].forEach(k=>$("tab-"+k).setAttribute("aria-selected",String(k===state.caseName)));
 $("case-title").textContent=state.caseName==="titanic"?"Titanic: clean the evidence":"Diamond: understand price variation";
 $("case-desc").textContent=state.caseName==="titanic"?"Lect. 2: invalid fares, missing values, useful features.":"Supplementary case lab: explore real diamond characteristics and price.";
 $("source-note").textContent=state.caseName==="titanic"?"Lecture 2 introduces data cleansing, corrupt fares, missing age/cabin values and categorical variables using the 893-row Titanic file. This CSV has no Survived label.":"The uploaded diamond dataset contains columns ID, Carat Weight, Cut, Color, Clarity, Polish, Symmetry, Report and Price. Analysis here is exploratory and does not reproduce the copyrighted Darden case narrative.";
 $("case-workspace").innerHTML=state.rows.length?(state.caseName==="titanic"?titanicPage():diamondPage()):emptyWorkspace();
}
function upload(file){
 if(!file)return;if(file.size>6e6){status("File exceeds 6 MB upload limit.");return}
 file.text().then(txt=>{
 try{
  var parsed=parseCSV(txt),missing=expected[state.caseName].filter(c=>!parsed.cols.includes(c));
  if(missing.length)throw Error("Missing expected columns: "+missing.join(", "));
  if(!parsed.rows.length)throw Error("No data rows");
  state.columns=parsed.cols;state.rows=parsed.rows;state.filename=file.name;state.history=[];state.quiz={};state.filters={};
  status("Loaded "+parsed.rows.length.toLocaleString()+" rows from "+file.name+" locally. Data are not sent anywhere.");render();
 }catch(e){status("Could not use this file: "+e.message)}
 });
}
$("case-upload").addEventListener("change",e=>upload(e.target.files[0]));
document.addEventListener("click",e=>{
 var tab=e.target.closest("[data-case]");if(tab){state.caseName=tab.dataset.case;state.columns=[];state.rows=[];state.filters={};state.history=[];state.quiz={};status("Choose the matching source CSV for this case.");render();return}
 var q=e.target.closest("[data-quiz]");if(q){state.quiz[q.dataset.quiz]=Number(q.dataset.value);render();return}
 var action=e.target.closest("[data-action]");if(!action)return;var a=action.dataset.action;
 if(a==="undo"){if(state.history.length){state.rows=state.history.pop();render();status("Undid previous cleaning action.")}}
 else if(a==="remove-fare")mutate(()=>{state.rows=state.rows.filter(r=>!(Number.isFinite(num(r.Fare))&&num(r.Fare)<0))});
 else if(a==="fill-age")mutate(()=>{var m=median(state.rows.map(r=>num(r.Age)));if(!Number.isFinite(m))return;state.rows.forEach(r=>{if(!String(r.Age).trim())r.Age=String(m)})});
 else if(a==="fill-embarked")mutate(()=>{var counts={};state.rows.forEach(r=>{if(r.Embarked)counts[r.Embarked]=(counts[r.Embarked]||0)+1});var mode=Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0];if(mode)state.rows.forEach(r=>{if(!r.Embarked)r.Embarked=mode})});
 else if(a==="drop-cabin")mutate(()=>{state.columns=state.columns.filter(c=>c!=="Cabin");state.rows.forEach(r=>delete r.Cabin)});
 else if(a==="family")mutate(()=>{state.columns.push("FamilySize");state.rows.forEach(r=>r.FamilySize=String(num(r.SibSp)+num(r.Parch)+1))});
 else if(a==="dedupe")mutate(()=>{var keys=new Set();state.rows=state.rows.filter(r=>{var key=JSON.stringify(state.columns.map(c=>r[c]));if(keys.has(key))return false;keys.add(key);return true})});
 else if(a==="clear-filters"){state.filters={};render()}
 else if(a==="export")download(state.caseName+"-processed.csv",toCSV());
});
document.addEventListener("input",e=>{
 if(e.target.id==="weight"){state.weight=Number(e.target.value);$("wt").textContent=state.weight.toFixed(2);render()}
 else if(e.target.id==="tol"){state.tolerance=Number(e.target.value);$("tl").textContent=state.tolerance.toFixed(2);render()}
});
document.addEventListener("change",e=>{
 if(e.target.dataset.filter){state.filters[e.target.dataset.filter]=e.target.value;render()}
});
window.ML_CASE_TESTS={parseCSV,median,invalidFares,duplicates,stats,diamondComparables};
render();
})();