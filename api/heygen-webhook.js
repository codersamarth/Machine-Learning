import {put} from "@vercel/blob";
import {timingSafeEqual} from "node:crypto";
const VALID_TOPIC=/^(?:z|p|d|m|r)\d{1,3}$/;
const VALID_VIDEO=/^[a-zA-Z0-9_-]{8,100}$/;
function equal(a,b){const left=Buffer.from(String(a||"")),right=Buffer.from(String(b||""));return left.length===right.length&&timingSafeEqual(left,right)}
function allowedVideoUrl(raw){
 try{const u=new URL(raw);
 if(u.protocol!=="https:"||u.username||u.password)return false;
 const hostname=u.hostname.toLowerCase();
 return hostname==="heygen.ai"||hostname.endsWith(".heygen.ai");
 }catch{return false}
}
export default async function handler(req,res){
 res.setHeader("Cache-Control","no-store");
 if(req.method!=="POST"){res.setHeader("Allow","POST");return res.status(405).json({error:"POST required"})}
 const secret=process.env.ML_VIDEO_WEBHOOK_TOKEN;
 if(!secret)return res.status(503).json({error:"Video publishing is not configured"});
 const token=req.query?.token||req.headers["x-ml-video-token"];
 if(!equal(token,secret))return res.status(401).json({error:"Unauthorized"});
 if(!process.env.BLOB_READ_WRITE_TOKEN)return res.status(503).json({error:"Video storage unavailable"});
 let payload=req.body;
 try{if(typeof payload==="string")payload=JSON.parse(payload)}catch{return res.status(400).json({error:"Invalid JSON"})}
 const event=payload?.data||payload||{};
 const topic=String(req.query?.topic||event.callback_id||payload.callback_id||"");
 const videoId=String(event.video_id||event.videoId||payload.video_id||"");
 const status=String(event.status||payload.status||"").toLowerCase();
 const source=String(event.video_url||event.videoUrl||payload.video_url||"");
 if(!VALID_TOPIC.test(topic)||!VALID_VIDEO.test(videoId))return res.status(400).json({error:"Invalid topic/video ID"});
 if(status.includes("fail")||status.includes("cancel"))return res.status(200).json({topic,status:"not_published"});
 if(!allowedVideoUrl(source))return res.status(400).json({error:"Expected an HTTPS HeyGen video URL"});
 try{
  const video=await fetch(source,{redirect:"follow",signal:AbortSignal.timeout(90000)});
  if(!video.ok||!video.body)throw Error("HeyGen video unavailable (HTTP "+video.status+")");
  const size=Number(video.headers.get("content-length")||0);
  if(size>350*1024*1024)throw Error("Video exceeds configured 350MB limit");
  const contentType=video.headers.get("content-type")||"";
  if(!contentType.includes("video/")&&!new URL(source).pathname.endsWith(".mp4"))throw Error("Unexpected content type");
  const pathname="topic-videos/"+topic+"/"+videoId+".mp4";
  const saved=await put(pathname,video.body,{access:"public",addRandomSuffix:false,contentType:"video/mp4",multipart:true});
  return res.status(201).json({topic,videoId,videoUrl:saved.url,status:"published"});
 }catch(e){console.error("HeyGen publishing failed:",e?.message);return res.status(502).json({error:"Could not archive the rendered video"})}
}
