(function(){
"use strict";
var $=id=>document.getElementById(id),queue=[],published={};
var h=x=>String(x??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
function link(t){return t.kind==="journey"?"/journey.html#lesson:"+encodeURIComponent(t.id):"/#lesson="+encodeURIComponent(t.id)}
function sync(){published=Object.assign({},window.ML_VIDEO_LINKS||{},published);if(queue.length)draw()}
function draw(){
 var q=$("vp-search").value.toLowerCase().trim(),group=$("vp-group").value,status=$("vp-status").value;
 var n=queue.filter(t=>!!published[t.id]).length;
 $("total-count").textContent=queue.length;$("published-count").textContent=n;$("remaining-count").textContent=queue.length-n;
 $("vp-progress").setAttribute("aria-valuemax",String(queue.length));$("vp-progress").setAttribute("aria-valuenow",String(n));$("vp-progress-fill").style.width=(queue.length?100*n/queue.length:0)+"%";
 $("vp-note").textContent=n+" of "+queue.length+" videos published • "+(queue.length-n)+" awaiting generation. HeyGen's free plan restricts video output; the production queue remains available when capacity resets.";
 var filtered=queue.filter(t=>(group==="all"||(group==="beginner"?t.kind==="journey":t.lecture===Number(group)))&&(status==="all"||(status==="ready"?!!published[t.id]:!published[t.id]))&&(!q||(t.id+" "+t.title+" "+t.group).toLowerCase().includes(q)));
 $("vp-list").innerHTML=filtered.length?filtered.map(t=>{
 var ready=!!published[t.id];
 return '<article class="vp-item"><span class="vp-index">'+String(t.order).padStart(2,"0")+'</span><div><small>'+h(t.group||"Beginners")+' • '+h(t.id.toUpperCase())+'</small><h2>'+h(t.title)+'</h2><p>'+h(t.content.hook)+'</p></div><div class="vp-actions"><span class="vp-state '+(ready?"ready":"")+'">'+(ready?"✓ Published":"Not generated")+'</span><a href="'+link(t)+'">'+(ready?"Watch on site →":"Study this topic →")+'</a></div></article>'
 }).join(""):'<p>No topics match this filter.</p>';
}
Promise.all([fetch("/video-production-queue.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("Queue unavailable");return r.json()}),fetch("/api/videos?dashboard=1").then(r=>r.ok?r.json():{videos:{}}).catch(()=>({videos:{}}))]).then(([result,list])=>{
 if(!Array.isArray(result.videos)||result.videos.length!==92)throw Error("Production queue is incomplete");
 queue=result.videos;published=Object.assign({},window.ML_VIDEO_LINKS||{},list.videos||{});
 draw();["vp-search","vp-group","vp-status"].forEach(id=>$(id).addEventListener("input",draw));
}).catch(e=>{$("vp-note").textContent="Could not load the production queue: "+e.message});
window.addEventListener("ml-videos-ready",sync);
})();