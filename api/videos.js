import {list} from "@vercel/blob";
const PATH=/^topic-videos\/((?:z|p|d|m|r)\d{1,3})\/[a-zA-Z0-9_-]+\.mp4$/;
export default async function handler(req,res){
 if(req.method!=="GET"){res.setHeader("Allow","GET");return res.status(405).json({error:"GET required"})}
 res.setHeader("Cache-Control","public, s-maxage=300, stale-while-revalidate=900");
 if(!process.env.BLOB_READ_WRITE_TOKEN)return res.status(200).json({videos:{},configured:false});
 try{
  const videos={},timestamps={};let cursor=undefined;
  do{
   const r=await list({prefix:"topic-videos/",limit:1000,...(cursor?{cursor}:{})});
   for(const item of r.blobs||[]){
    const id=item.pathname.match(PATH)?.[1];if(!id)continue;
    const date=new Date(item.uploadedAt||0).getTime();
    if(!timestamps[id]||date>timestamps[id]){videos[id]=item.url;timestamps[id]=date}
   }
   cursor=r.hasMore?r.cursor:undefined;
  }while(cursor);
  return res.status(200).json({videos,configured:true,source:"vercel-blob"});
 }catch(e){console.error("Video catalog failed:",e?.message);return res.status(503).json({error:"Video catalog temporarily unavailable",videos:{}})}
}
