/* Optional first-party publishing catalog. Fails closed if server storage is unavailable. */
(function(){
"use strict";
if(typeof fetch!=="function"||!window.ML_VIDEO_LINKS)return;
fetch("/api/videos",{credentials:"same-origin"}).then(function(r){if(!r.ok)throw Error("Video catalog unavailable");return r.json()}).then(function(data){
 if(!data||!data.videos||typeof data.videos!=="object"||Array.isArray(data.videos))return;
 var added=0;
 Object.keys(data.videos).forEach(function(id){
  var u=data.videos[id];
  if(!/^(?:z|p|d|m|r)\d{1,3}$/.test(id)||typeof u!=="string"||!/^https:\/\/[^\s]+\.mp4(?:\?[^\s]*)?$/.test(u))return;
  if(window.ML_VIDEO_LINKS[id]!==u){window.ML_VIDEO_LINKS[id]=u;added++}
 });
 if(added)window.dispatchEvent(new CustomEvent("ml-videos-ready",{detail:{count:added}}));
}).catch(function(){/* Keep static video catalog available offline */});
})();
