/* TRAK CAM 2.5D — geometry + toolpath + feeds engine (no dependencies) */
(function(root){
'use strict';
const TAU=Math.PI*2, D2R=Math.PI/180;
const hyp=Math.hypot;
const dist=(a,b)=>hyp(a[0]-b[0],a[1]-b[1]);
function area(p){let a=0;for(let i=0,n=p.length;i<n;i++){const q=p[i],r=p[(i+1)%n];a+=q[0]*r[1]-r[0]*q[1];}return a/2;}
function pip(pt,p){let c=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const a=p[i],b=p[j];if(((a[1]>pt[1])!==(b[1]>pt[1]))&&(pt[0]<(b[0]-a[0])*(pt[1]-a[1])/(b[1]-a[1])+a[0]))c=!c;}return c;}
function bbox(pts,b){b=b||[1e18,1e18,-1e18,-1e18];for(const q of pts){if(q[0]<b[0])b[0]=q[0];if(q[1]<b[1])b[1]=q[1];if(q[0]>b[2])b[2]=q[0];if(q[1]>b[3])b[3]=q[1];}return b;}
function perim(p,closed){let s=0;for(let i=0;i<p.length-(closed?0:1);i++)s+=dist(p[i],p[(i+1)%p.length]);return s;}
function arcPts(cx,cy,r,a0,sw,tol){const st=2*Math.acos(Math.max(-1,1-tol/Math.max(r,tol*1.01)));const n=Math.max(2,Math.ceil(Math.abs(sw)/Math.max(st,1e-3)));const o=[];for(let i=0;i<=n;i++){const a=a0+sw*i/n;o.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}return o;}
function bulgePts(p1,p2,b,tol){if(Math.abs(b)<1e-9)return[p1,p2];const th=4*Math.atan(b),dx=p2[0]-p1[0],dy=p2[1]-p1[1],d=hyp(dx,dy);if(d<1e-12)return[p1,p2];const r=d/(2*Math.sin(th/2)),h=r*Math.cos(th/2),cx=(p1[0]+p2[0])/2-h*dy/d,cy=(p1[1]+p2[1])/2+h*dx/d;const pts=arcPts(cx,cy,Math.abs(r),Math.atan2(p1[1]-cy,p1[0]-cx),th,tol);pts[0]=p1;pts[pts.length-1]=p2;return pts;}
function polyFromVerts(vs,closed,tol){const out=[[vs[0].x,vs[0].y]];const n=vs.length;for(let i=0;i<(closed?n:n-1);i++){const a=vs[i],b=vs[(i+1)%n];const seg=bulgePts([a.x,a.y],[b.x,b.y],a.b||0,tol);for(let k=1;k<seg.length;k++)out.push(seg[k]);}if(closed&&out.length>1&&dist(out[0],out[out.length-1])<1e-9)out.pop();return{pts:out,closed};}
function bspline(ctl,knots,deg,w,N){const n=ctl.length;if(knots.length!==n+deg+1||n<=deg)return ctl.slice();const lo=knots[deg],hi=knots[n],out=[];for(let s=0;s<=N;s++){let t=lo+(hi-lo)*s/N;if(s===N)t=hi-1e-9*(hi-lo||1);let k=deg;while(k<n-1&&!(t>=knots[k]&&t<knots[k+1]))k++;const d=[];for(let j=0;j<=deg;j++){const i=k-deg+j,wi=w&&w[i]?w[i]:1;d.push([ctl[i][0]*wi,ctl[i][1]*wi,wi]);}for(let r=1;r<=deg;r++)for(let j=deg;j>=r;j--){const i=k-deg+j,den=knots[i+deg-r+1]-knots[i],a=den?(t-knots[i])/den:0;for(let c=0;c<3;c++)d[j][c]=(1-a)*d[j-1][c]+a*d[j][c];}out.push([d[deg][0]/d[deg][2],d[deg][1]/d[deg][2]]);}return out;}

/* ---------- DXF ---------- */
function parseDXF(txt,tol){
  tol=tol||0.0005;
  const L=txt.split(/\r\n|\r|\n/),P=[];
  for(let i=0;i+1<L.length;i+=2){const c=parseInt(L[i],10);if(isNaN(c))continue;P.push([c,L[i+1].trim()]);}
  let units=null,sec=null,cur=null;const ents=[];
  for(let k=0;k<P.length;k++){const c=P[k][0],v=P[k][1];
    if(c===0&&v==='SECTION'){sec=(P[k+1]||[])[1];k++;continue;}
    if(c===0&&v==='ENDSEC'){if(cur){ents.push(cur);cur=null;}sec=null;continue;}
    if(sec==='HEADER'&&c===9&&v==='$INSUNITS'){const u=parseInt((P[k+1]||[])[1],10);units=u===1?'in':u===4?'mm':u===5?'cm':u===6?'m':null;continue;}
    if(sec==='ENTITIES'){if(c===0){if(cur)ents.push(cur);cur={type:v,g:[]};}else if(cur)cur.g.push([c,v]);}
  }
  const gv=(e,c,d)=>{const f=e.g.find(x=>x[0]===c);return f?parseFloat(f[1]):d;};
  const pieces=[],circles=[],skipped={},texts=[],dims=[];
  for(let k=0;k<ents.length;k++){const e=ents[k];
    switch(e.type){
      case 'LINE':pieces.push({pts:[[gv(e,10,0),gv(e,20,0)],[gv(e,11,0),gv(e,21,0)]],closed:false});break;
      case 'CIRCLE':circles.push({x:gv(e,10,0),y:gv(e,20,0),r:gv(e,40,0)});break;
      case 'ARC':{const cx=gv(e,10,0),cy=gv(e,20,0),r=gv(e,40,0);const a0=gv(e,50,0);let sw=gv(e,51,360)-a0;while(sw<=1e-9)sw+=360;pieces.push({pts:arcPts(cx,cy,r,a0*D2R,sw*D2R,tol),closed:false});break;}
      case 'LWPOLYLINE':{const vs=[];let fl=0;for(const [c,v] of e.g){if(c===70)fl=parseInt(v,10);else if(c===10)vs.push({x:parseFloat(v),y:0,b:0});else if(c===20&&vs.length)vs[vs.length-1].y=parseFloat(v);else if(c===42&&vs.length)vs[vs.length-1].b=parseFloat(v);}if(vs.length>1)pieces.push(polyFromVerts(vs,(fl&1)===1,tol));break;}
      case 'POLYLINE':{const fl=gv(e,70,0),vs=[];let j=k+1;while(j<ents.length&&ents[j].type==='VERTEX'){const ve=ents[j];vs.push({x:gv(ve,10,0),y:gv(ve,20,0),b:gv(ve,42,0)});j++;}k=(ents[j]&&ents[j].type==='SEQEND')?j:j-1;if(vs.length>1)pieces.push(polyFromVerts(vs,(fl&1)===1,tol));break;}
      case 'SPLINE':{const fit=[],ctl=[],kn=[],w=[];for(const [c,v] of e.g){const f=parseFloat(v);if(c===11)fit.push([f,0]);else if(c===21&&fit.length)fit[fit.length-1][1]=f;else if(c===10)ctl.push([f,0]);else if(c===20&&ctl.length)ctl[ctl.length-1][1]=f;else if(c===40)kn.push(f);else if(c===41)w.push(f);}
        const deg=gv(e,71,3),fl=gv(e,70,0);let pts=ctl.length>deg?bspline(ctl,kn,deg,w.length===ctl.length?w:null,Math.max(24,ctl.length*12)):fit;if(!pts.length)pts=fit;
        const closed=(fl&1)===1||(pts.length>2&&dist(pts[0],pts[pts.length-1])<tol);if(closed&&dist(pts[0],pts[pts.length-1])<tol)pts.pop();if(pts.length>1)pieces.push({pts,closed});break;}
      case 'ELLIPSE':{const cx=gv(e,10,0),cy=gv(e,20,0),mx=gv(e,11,1),my=gv(e,21,0),ra=gv(e,40,1),p0=gv(e,41,0);let sw=gv(e,42,TAU)-p0;while(sw<=1e-9)sw+=TAU;const a=hyp(mx,my),b=a*ra,rot=Math.atan2(my,mx),n=Math.max(24,Math.ceil(sw/TAU*120)),pts=[];const full=Math.abs(sw-TAU)<1e-6;for(let i=0;i<=(full?n-1:n);i++){const t=p0+sw*i/n,c=Math.cos(t),s=Math.sin(t);pts.push([cx+a*c*Math.cos(rot)-b*s*Math.sin(rot),cy+a*c*Math.sin(rot)+b*s*Math.cos(rot)]);}pieces.push({pts,closed:full});break;}
      case 'VERTEX':case 'SEQEND':break;
      case 'TEXT':case 'MTEXT':case 'ATTRIB':{const tx=e.g.filter(x=>x[0]===3).map(x=>x[1]).join('')+((e.g.find(x=>x[0]===1)||[])[1]||'');texts.push({text:tx,x:gv(e,10,0),y:gv(e,20,0),h:gv(e,40,0.1)});skipped[e.type]=(skipped[e.type]||0)+1;break;}
      case 'DIMENSION':{dims.push({text:(e.g.find(x=>x[0]===1)||[])[1]||'',val:gv(e,42,null),x:gv(e,11,gv(e,10,0)),y:gv(e,21,gv(e,20,0)),kind:(gv(e,70,0)|0)&7});skipped[e.type]=(skipped[e.type]||0)+1;break;}
      default:skipped[e.type]=(skipped[e.type]||0)+1;
    }
  }
  return{units,pieces,circles,skipped,texts,dims};
}
function chain(open,tol){
  const used=new Array(open.length).fill(false),out=[];const near=(a,b)=>Math.abs(a[0]-b[0])<tol&&Math.abs(a[1]-b[1])<tol;
  for(let i=0;i<open.length;i++){if(used[i])continue;used[i]=true;let c=open[i].slice(),grown=true;
    while(grown){grown=false;for(let j=0;j<open.length;j++){if(used[j])continue;const p=open[j],e=c[c.length-1],s=c[0];
      if(near(e,p[0])){c=c.concat(p.slice(1));}else if(near(e,p[p.length-1])){c=c.concat(p.slice().reverse().slice(1));}
      else if(near(s,p[p.length-1])){c=p.slice(0,-1).concat(c);}else if(near(s,p[0])){c=p.slice().reverse().slice(0,-1).concat(c);}else continue;
      used[j]=true;grown=true;}}
    const closed=c.length>2&&near(c[0],c[c.length-1]);if(closed)c.pop();out.push({pts:c,closed});}
  return out;
}
function dedupe(p,tol){const o=[];for(const q of p){if(!o.length||dist(o[o.length-1],q)>tol*0.01)o.push(q);}if(o.length>1&&dist(o[0],o[o.length-1])<tol*0.01)o.pop();return o;}
function asCircle(p,tol){if(p.length<12)return null;const b=bbox(p),cx=(b[0]+b[2])/2,cy=(b[1]+b[3])/2;let s=0;for(const q of p)s+=hyp(q[0]-cx,q[1]-cy);const r=s/p.length;for(const q of p)if(Math.abs(hyp(q[0]-cx,q[1]-cy)-r)>Math.max(tol*3,r*0.003))return null;return{x:cx,y:cy,r};}
function circlePts(c,tol){const p=arcPts(c.x,c.y,c.r,0,TAU,tol||0.0005);p.pop();return p;}
/* raw geometry in drawing units -> {loops,circles,opens} */
function buildGeom(parsed,tol){
  const closed=[],open=[];for(const p of parsed.pieces)(p.closed?closed:open).push(p.pts);
  const opens=[];for(const c of chain(open,tol*4)){if(c.closed)closed.push(c.pts);else opens.push(c.pts);}
  const loops=[],circles=parsed.circles.map(c=>({...c}));
  for(let p of closed){p=dedupe(p,tol);if(p.length<3)continue;const c=asCircle(p,tol);if(c)circles.push(c);else loops.push(p);}
  return{loops,circles,opens};
}
function scaleGeom(g,s,dx,dy){const f=q=>[q[0]*s+dx,q[1]*s+dy];const o={loops:g.loops.map(p=>p.map(f)),circles:g.circles.map(c=>{const n={x:c.x*s+dx,y:c.y*s+dy,r:c.r*s};if('depth' in c)n.depth=c.depth==null?null:c.depth*s;return n;}),opens:g.opens.map(p=>p.map(f))};if(g.ld)o.ld=g.ld.map(d=>d===undefined?undefined:d==null?null:d*s);if(g.thick)o.thick=g.thick*s;return o;}
function geomBox(g){const b=[1e18,1e18,-1e18,-1e18];g.loops.forEach(p=>bbox(p,b));g.opens.forEach(p=>bbox(p,b));g.circles.forEach(c=>bbox([[c.x-c.r,c.y-c.r],[c.x+c.r,c.y+c.r]],b));return b[0]>b[2]?[0,0,0,0]:b;}



/* outer boundary of a set of line pieces that touch / T-join (drawing views): planar graph, walk the outside face */
function outerFace(polys,tol){ // -> {outer, faces}
tol=tol||0.004;const V=[],key=new Map(),q=x=>Math.round(x/tol);
  const vid=p=>{const k=q(p[0])+','+q(p[1]);for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){const h=key.get((q(p[0])+dx)+','+(q(p[1])+dy));if(h!=null&&dist(V[h],p)<tol*1.5)return h;}V.push([p[0],p[1]]);key.set(k,V.length-1);return V.length-1;};
  let S=[];polys.forEach(P=>{for(let i=0;i<P.length-1;i++){const a=vid(P[i]),b=vid(P[i+1]);if(a!==b)S.push([a,b]);}});
  // split at T-junctions
  const out=[];for(const[a,b]of S){const A=V[a],B=V[b],L=dist(A,B);const on=[];V.forEach((p,i)=>{if(i===a||i===b)return;const t=((p[0]-A[0])*(B[0]-A[0])+(p[1]-A[1])*(B[1]-A[1]))/(L*L);if(t<=0.0001||t>=0.9999)return;const x=A[0]+t*(B[0]-A[0]),y=A[1]+t*(B[1]-A[1]);if(Math.hypot(p[0]-x,p[1]-y)<tol)on.push([t,i]);});on.sort((u,v)=>u[0]-v[0]);let c=a;for(const[,i]of on){out.push([c,i]);c=i;}out.push([c,b]);}
  const adj=V.map(()=>[]);const seen=new Set();out.forEach(([a,b])=>{if(a===b)return;const k=a<b?a+'_'+b:b+'_'+a;if(seen.has(k))return;seen.add(k);adj[a].push(b);adj[b].push(a);});
  // every face: for directed edge u->v, next = edge at v with the smallest clockwise turn from the way back (keeps the face on the left)
  const used=new Set(),faces=[];const ang=(u,v)=>Math.atan2(V[v][1]-V[u][1],V[v][0]-V[u][0]);
  for(let u=0;u<V.length;u++)for(const v0 of adj[u]){if(used.has(u+'>'+v0))continue;let a=u,b=v0;const F=[];let g=0;
    while(g++<50000){used.add(a+'>'+b);F.push(V[a]);const back=ang(b,a);let nx=null,bt=1e9;for(const n of adj[b]){let t=(back-ang(b,n)+4*Math.PI)%(2*Math.PI);if(t<1e-9)t=2*Math.PI;if(t<bt){bt=t;nx=n;}}a=b;b=nx;if(a===u&&b===v0)break;if(used.has(a+'>'+b))break;}
    if(F.length>=3)faces.push(F);}
  const sa=F=>{let s=0;for(let i=0;i<F.length;i++){const p=F[i],q=F[(i+1)%F.length];s+=p[0]*q[1]-q[0]*p[1];}return s/2;};
  let outer=null,oa=0;faces.forEach(F=>{const A=sa(F);if(A<oa){oa=A;outer=F;}});
  return{outer:outer?outer.slice().reverse():null,faces:faces.filter(F=>sa(F)>0),islands:faces.filter(F=>F!==outer&&sa(F)<0).map(F=>F.slice().reverse())};}
/* ---------- PDF drawing: find the views, drop border / title block / iso view / dimensions, read the scale ---------- */
function pdfDetect(pieces,texts,pw,ph,opt){opt=opt||{};const TB=/^(MATERIAL|DRAWN|CHECKED|APPROVED|TOLERANCES|SCALE|SHEET|SIZE|REV|NOTES|PROPRIETARY|CONFIDENTIAL|FINISH|DIMENSIONS)/i;
  const tw=texts.filter(t=>TB.test(t.s)&&t.y<ph*0.45);let zone=null;if(tw.length>=3){zone=[1e9,1e9,-1e9,-1e9];tw.forEach(t=>{zone[0]=Math.min(zone[0],t.x);zone[1]=Math.min(zone[1],t.y);zone[2]=Math.max(zone[2],t.x);zone[3]=Math.max(zone[3],t.y);});zone=[zone[0]-1.6,0,pw,zone[3]+0.5];}
  const inZone=b=>zone&&(b[0]+b[2])/2>zone[0]&&(b[1]+b[3])/2<zone[3];
  const angOff=P=>{let tot=0,off=0;for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1],L=dist(a,b);tot+=L;let ang=Math.abs(Math.atan2(b[1]-a[1],b[0]-a[0])*180/Math.PI)%90;ang=Math.min(ang,90-ang);if(ang>8&&L>0.05)off+=L;}return[tot,off];};
  // usable pieces: not the frame, not the title block, not tiny arrowheads
  // keep the visible-outline line weight (thickest common black, solid stroke); dims, centre lines and balloons are thinner / dashed / coloured
  {const W={};pieces.forEach(pc=>{if(pc.lw==null||pc.col==='c'||pc.dash)return;const k=Math.round(pc.lw*20)/20;W[k]=(W[k]||0)+1;});const ks=Object.keys(W).map(Number).sort((a,b)=>b-a),mx=Math.max(0,...Object.values(W));const vis=ks.find(k=>W[k]>=mx*0.2);
   if(ks.length>1&&vis!=null)pieces=pieces.filter(pc=>pc.lw==null||(Math.round(pc.lw*20)/20>=vis-0.001&&pc.col!=='c'&&!pc.dash));}
  const PC=[];pieces.forEach(pc=>{const P=pc.closed?pc.pts.concat([pc.pts[0]]):pc.pts;if(P.length<2)return;const b=bbox(P),w=b[2]-b[0],h=b[3]-b[1];if(w>pw*0.6||h>ph*0.6)return;if(b[0]<0.3||b[1]<0.3||b[2]>pw-0.3||b[3]>ph-0.3)return;if(inZone(b))return;if(pc.closed&&P.length<=5&&Math.max(w,h)<0.16&&!(Math.abs(w-h)<0.01&&P.length>4))return;const[len,off]=angOff(P);PC.push({pc,P,b,len,off,closed:!!pc.closed});});
  // cluster pieces that touch (end to end, or end on a point)
  const eps=0.012,par=PC.map((_,i)=>i),f=i=>par[i]===i?i:(par[i]=f(par[i])),U=(i,j)=>{par[f(i)]=f(j);};const ends=PC.map(q=>q.closed?[]:[q.P[0],q.P[q.P.length-1]]);
  const cell=0.05,grid=new Map();PC.forEach((q,i)=>q.P.forEach(pt=>{const k=Math.round(pt[0]/cell)+','+Math.round(pt[1]/cell);if(!grid.has(k))grid.set(k,[]);grid.get(k).push([i,pt]);}));
  const deg=PC.map(()=>[0,0]);
  PC.forEach((q,i)=>ends[i].forEach((e,ei)=>{const gx=Math.round(e[0]/cell),gy=Math.round(e[1]/cell);for(let dx=-1;dx<=1;dx++)for(let dy=-1;dy<=1;dy++){const L=grid.get((gx+dx)+','+(gy+dy));if(!L)continue;for(const[j,pt]of L){if(j===i)continue;if(Math.hypot(pt[0]-e[0],pt[1]-e[1])<eps){U(i,j);deg[i][ei]=1;}}}}));
  const CL=new Map();PC.forEach((q,i)=>{const r=f(i);if(!CL.has(r))CL.set(r,[]);CL.get(r).push(i);});
  const views=[];for(const idx of CL.values()){const b=[1e9,1e9,-1e9,-1e9];let len=0,off=0,ne=0,nd=0;idx.forEach(i=>{const q=PC[i];b[0]=Math.min(b[0],q.b[0]);b[1]=Math.min(b[1],q.b[1]);b[2]=Math.max(b[2],q.b[2]);b[3]=Math.max(b[3],q.b[3]);len+=q.len;off+=q.off;if(!q.closed){ne+=2;nd+=2-deg[i][0]-deg[i][1];}});
    const w=b[2]-b[0],h=b[3]-b[1];if(Math.max(w,h)<0.3||Math.min(w,h)<0.04)continue;const closedFrac=ne?1-nd/ne:1;if(closedFrac<0.75)continue;if(off/len>0.3)continue;views.push({idx,b,w,h,area:w*h,len});}
  views.forEach(v=>{v.kids=views.filter(o=>o!==v&&o.b[0]>=v.b[0]&&o.b[2]<=v.b[2]&&o.b[1]>=v.b[1]&&o.b[3]<=v.b[3]).length+PC.filter(q=>q.closed&&q.b[0]>v.b[0]&&q.b[2]<v.b[2]&&q.b[1]>v.b[1]&&q.b[3]<v.b[3]).length;});
  for(let i=views.length-1;i>=0;i--){const v=views[i];if(views.some(o=>o!==v&&o.area>v.area&&v.b[0]>=o.b[0]-0.01&&v.b[2]<=o.b[2]+0.01&&v.b[1]>=o.b[1]-0.01&&v.b[3]<=o.b[3]+0.01))views.splice(i,1);}
  views.sort((a,b)=>b.area*(1+0.25*Math.min(b.kids,8))-a.area*(1+0.25*Math.min(a.kids,8)));
  if(!views.length)return{views:[],main:-1};const mi=Math.max(0,Math.min(views.length-1,opt.view|0)),M=views[mi];
  // numbers on the sheet (dimension values)
  const nums=[];texts.forEach(t=>{const m=String(t.s).replace(/,/g,'.').match(/^[Ø⌀]?(\d*\.\d+|\d+\.?\d*)(?:CL|"|°)?$/);if(m){const v=parseFloat(m[1]);if(v>0.02&&v<200&&!/°/.test(t.s))nums.push({v,x:t.x,y:t.y});}});
  let k=0,how='';const W=M.w,H=M.h;
  const near=q=>q.x>M.b[0]-2.5&&q.x<M.b[2]+2.5&&q.y>M.b[1]-2.5&&q.y<M.b[3]+2.5;const dn=nums.filter(q=>near(q)&&/\./.test(String(q.v))||near(q)&&q.v>=1&&texts.some(t=>t.x===q.x&&t.y===q.y&&/\./.test(t.s)));
  for(const a of dn)for(const b of dn){if(a===b)continue;const k1=a.v/W,k2=b.v/H;if(Math.abs(k1-k2)/k1<0.02){const sc=a.v+b.v;if(!k||sc>how.sc){k=(k1+k2)/2;how={sc,txt:a.v+' × '+b.v,sure:1};}}}
  let scaleTxt=null;texts.forEach(t=>{const m=String(t.s).match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);if(m)scaleTxt=parseFloat(m[2])/parseFloat(m[1]);});
  const joined=texts.map(t=>t.s).join(' ');const ms=joined.match(/SCALE:?\s*(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)/i);if(ms)scaleTxt=parseFloat(ms[2])/parseFloat(ms[1]);
  if(!k&&scaleTxt){k=scaleTxt;how={txt:'SCALE 1:'+(+scaleTxt.toFixed(3))};}
  if(!k){for(const a of nums){const kk=a.v/W;if(scaleTxt&&Math.abs(kk-scaleTxt)/scaleTxt<0.03){k=kk;how={txt:String(a.v)};}}}
  if(!k){k=opt.scale||1;how={txt:'1:1'};}
  // thickness from a thin neighbour view that shares a side length
  let thick=null;for(const v of views){if(v===M)continue;if(Math.abs(v.w-W)/W<0.02&&v.h<H*0.7)thick=v.h*k;else if(Math.abs(v.h-H)/H<0.02&&v.w<W*0.7)thick=v.w*k;if(thick){const n=nums.find(q=>Math.abs(q.v-thick)/thick<0.04);if(n)thick=n.v;thick=+thick.toFixed(4);break;}}
  // geometry inside the main view, scaled to real size, origin at the view's lower-left
  const inM=b=>b[0]>=M.b[0]-0.005&&b[1]>=M.b[1]-0.005&&b[2]<=M.b[2]+0.005&&b[3]<=M.b[3]+0.005;const T=q=>[(q[0]-M.b[0])*k,(q[1]-M.b[1])*k];
  const mine=new Set(M.idx);const sub=PC.filter((q,i)=>mine.has(i)||inM(q.b)).map(q=>q.pc);const g=buildGeom({pieces:sub,circles:[]},0.004);
  const pf=outerFace(PC.filter((q,i)=>mine.has(i)||inM(q.b)).map(q=>q.P),0.004);const full=b=>Math.abs(b[0]-M.b[0])<0.02&&Math.abs(b[2]-M.b[2])<0.02&&Math.abs(b[1]-M.b[1])<0.02&&Math.abs(b[3]-M.b[3])<0.02;
  const fz=pf?pf.faces.filter(F=>{const b=bbox(F),A=Math.abs(area(F)),pr=perim(F,true);if(full(b))return false;if(A<0.004||A/pr<0.012)return false;if(asCircle(dedupe(F,0.001),0.002))return false;return true;}):[];
  const okF=F=>{const b=bbox(F),A=Math.abs(area(F)),pr=perim(F,true);return !full(b)&&A>=0.004&&A/pr>=0.012&&!asCircle(dedupe(F,0.001),0.002);};
  const isl=pf?pf.islands.filter(okF):[];const cen=F=>{const b=bbox(F);let x=0,y=0;F.forEach(q=>{x+=q[0];y+=q[1];});return[x/F.length,y/F.length];};
  const fz2=fz.filter(F=>!isl.some(I=>pip(cen(F),I)));
  const loops0=(pf&&pf.outer?[pf.outer]:[]).concat(isl,fz2);
  g.loops.forEach(p=>{const b=bbox(p);if(!okF(p)||!inM(b))return;if(!loops0.some(F=>{const c=bbox(F);return Math.abs(c[0]-b[0])<0.005&&Math.abs(c[2]-b[2])<0.005&&Math.abs(c[1]-b[1])<0.005&&Math.abs(c[3]-b[3])<0.005;}))loops0.push(p);});
  const loops=loops0.filter(p=>inM(bbox(p))&&Math.max(bbox(p)[2]-bbox(p)[0],bbox(p)[3]-bbox(p)[1])>0.02).map(p=>p.map(T));
  let cs=g.circles.filter(c=>c.r>0.004&&inM([c.x-c.r,c.y-c.r,c.x+c.r,c.y+c.r])).map(c=>({x:(c.x-M.b[0])*k,y:(c.y-M.b[1])*k,r:c.r*k}));
  // concentric circles (tap drill + thread major): keep the small one, remember the major
  cs.sort((a,b)=>a.r-b.r);const keep=[];for(const c of cs){const o=keep.find(q=>Math.hypot(q.x-c.x,q.y-c.y)<0.01);if(o){o.major=c.r*2;continue;}keep.push(c);}
  const notes=texts.filter(t=>!(zone&&t.x>zone[0]&&t.y<zone[3])).map(t=>t.s);
  return{views:views.map(v=>({b:v.b,w:v.w*k,h:v.h*k,kids:v.kids})),main:mi,k,how:how.txt,sure:!!how.sure,pw:W,ph:H,thick,W:W*k,H:H*k,geom:{loops,circles:keep,opens:[]},notes,zone};}

/* several sheets of one part: a sheet whose scale came only from the title block borrows the size from a sheet that had real W × H numbers */
function pdfRescale(rs){const ref=rs.find(r=>r&&r.sure&&r.pw);if(!ref)return rs;return rs.map(r=>{if(!r||r.sure||!r.pw||!r.geom)return r;const asp=r.pw/r.ph,ra=ref.pw/ref.ph;if(Math.abs(asp-ra)/ra>0.02)return r;const f=(ref.W/r.pw)/r.k;const S=q=>[q[0]*f,q[1]*f];
  return{...r,k:r.k*f,W:r.W*f,H:r.H*f,how:'= '+(+ref.W.toFixed(3))+' × '+(+ref.H.toFixed(3))+' (sheet '+(rs.indexOf(ref)+1)+')',thick:r.thick||ref.thick,geom:{loops:r.geom.loops.map(l=>l.map(S)),circles:r.geom.circles.map(c=>({...c,x:c.x*f,y:c.y*f,r:c.r*f,major:c.major&&c.major*f})),opens:[]},views:r.views.map(v=>({...v,w:v.w*f,h:v.h*f}))};});}
/* classify into machining features (program coordinates) */
function classify(g,tol){
  tol=tol||0.0005;
  g={...g,ld:g.ld?g.ld.slice():undefined};let circles=g.circles.slice();const loops=g.loops.map(p=>p.slice());
  // circle that encloses other geometry is an outline, not a hole
  circles=circles.filter(c=>{const inside=q=>hyp(q[0]-c.x,q[1]-c.y)<c.r-tol;
    const enc=loops.some(p=>inside(p[0]))||g.opens.some(p=>inside(p[0]))||circles.some(o=>o!==c&&o.r<c.r&&inside([o.x,o.y]));
    if(enc){loops.push(circlePts(c,tol));if(g.ld)g.ld=g.ld.concat([c.depth===undefined?null:c.depth]);return false;}return true;});
  const L=loops.map((p,i)=>{const d=g.ld?g.ld[i]:undefined;if(area(p)<0)p=p.slice().reverse();return{pts:p,a:area(p),d};}).sort((a,b)=>b.a-a.a);
  L.forEach((l,i)=>{l.depth=0;l.parent=-1;for(let j=0;j<i;j++)if(pip(l.pts[0],L[j].pts)){l.depth++;l.parent=j;}});
  const feats=[];let n=1;
  L.forEach((l,i)=>{const b=bbox(l.pts);const sz=(b[2]-b[0]).toFixed(3)+'×'+(b[3]-b[1]).toFixed(3);
    if(l.depth%2===0&&l.depth===0)feats.push({id:'F'+(n++),kind:'profile',loop:l.pts,islands:[],size:sz,idx:i});
    else if(l.depth%2===1){const f={id:'F'+(n++),kind:'pocket',loop:l.pts,islands:L.filter(o=>o.parent===i&&o.depth===l.depth+1).map(o=>o.pts),size:sz,idx:i};if(l.d!==undefined){f.depth=l.d;f.through=l.d==null;}feats.push(f);}});
  const groups={};for(const c of circles){const k=(2*c.r).toFixed(4)+'|'+('depth' in c?(c.depth==null?'T':c.depth.toFixed(4)):'');(groups[k]=groups[k]||[]).push([c.x,c.y]);}
  Object.keys(groups).sort((a,b)=>parseFloat(a)-parseFloat(b)).forEach(k=>{const [dd,dp]=k.split('|');const f={id:'F'+(n++),kind:'holes',dia:parseFloat(dd),pts:groups[k]};if(dp){f.through=dp==='T';f.depth=dp==='T'?null:parseFloat(dp);}feats.push(f);});
  g.opens.forEach(p=>feats.push({id:'F'+(n++),kind:'slot',path:p,len:perim(p,false)}));
  return feats;
}

/* ---------- 3D: STL / STEP -> horizontal faces -> 2.5D ---------- */
function parseSTL(buf){
  const dv=new DataView(buf),T=[];
  if(buf.byteLength>=84){const n=dv.getUint32(80,true);if(84+n*50===buf.byteLength){for(let i=0;i<n;i++){const o=84+i*50+12;const t=[];for(let k=0;k<9;k++)t.push(dv.getFloat32(o+k*4,true));T.push(t);}return T;}}
  const txt=new TextDecoder().decode(buf),re=/vertex\s+(\S+)\s+(\S+)\s+(\S+)/g;let m,cur=[];while((m=re.exec(txt))){cur.push(+m[1],+m[2],+m[3]);if(cur.length===9){T.push(cur);cur=[];}}return T;
}
function chainDirected(edges,q){ // edges [[ax,ay,bx,by]] directed; returns loops
  const key=(x,y)=>Math.round(x/q)+','+Math.round(y/q);const st=new Map();edges.forEach((e,i)=>{const k=key(e[0],e[1]);(st.get(k)||st.set(k,[]).get(k)).push(i);});
  const used=new Uint8Array(edges.length),loops=[];
  for(let i=0;i<edges.length;i++){if(used[i])continue;const lp=[];let j=i;while(j>=0&&!used[j]){used[j]=1;const e=edges[j];lp.push([e[0],e[1]]);const c=st.get(key(e[2],e[3]))||[];j=-1;for(const x of c)if(!used[x]){j=x;break;}}if(lp.length>2)loops.push(lp);}
  return loops;}
function meshLevels(T,tol){
  let zmin=1e18,zmax=-1e18;for(const t of T)for(let k=2;k<9;k+=3){if(t[k]<zmin)zmin=t[k];if(t[k]>zmax)zmax=t[k];}
  const q=tol,lv=new Map();
  for(const t of T){const ux=t[3]-t[0],uy=t[4]-t[1],uz=t[5]-t[2],vx=t[6]-t[0],vy=t[7]-t[1],vz=t[8]-t[2];const nx=uy*vz-uz*vy,ny=uz*vx-ux*vz,nz=ux*vy-uy*vx,nl=hyp(nx,ny,nz);if(nl<1e-14||nz/nl<0.999)continue;
    const z=(t[2]+t[5]+t[8])/3,k=Math.round(z/(tol*4));let L=lv.get(k);if(!L){L={z,cnt:new Map(),tris:[]};lv.set(k,L);}L.tris.push(t);}
  const levels=[];
  for(const L of lv.values()){const ek=(a,b)=>{const A=Math.round(a[0]/q)+','+Math.round(a[1]/q),B=Math.round(b[0]/q)+','+Math.round(b[1]/q);return A<B?A+'|'+B:B+'|'+A;};const cnt=new Map();
    for(const t of L.tris){const P=[[t[0],t[1]],[t[3],t[4]],[t[6],t[7]]];for(let i=0;i<3;i++){const k=ek(P[i],P[(i+1)%3]);cnt.set(k,(cnt.get(k)||0)+1);}}
    const edges=[];for(const t of L.tris){const P=[[t[0],t[1]],[t[3],t[4]],[t[6],t[7]]];for(let i=0;i<3;i++){const a=P[i],b=P[(i+1)%3];if(cnt.get(ek(a,b))===1)edges.push([a[0],a[1],b[0],b[1]]);}}
    levels.push({z:L.z,loops:chainDirected(edges,q).map(l=>dedupe(l,tol))});}
  return{levels,zmin,zmax};}
/* STEP (AP203/AP214) planar faces bounded by lines / circles / b-splines */
function stepArgs(s){let i=0;function val(){while(s[i]===' '||s[i]==='\n'||s[i]==='\r'||s[i]==='\t')i++;const c=s[i];
  if(c==='('){i++;const a=[];while(true){while(/\s/.test(s[i]))i++;if(s[i]===')'){i++;break;}a.push(val());while(/\s/.test(s[i]))i++;if(s[i]===',')i++;}return a;}
  if(c==="'"){let j=i+1,o='';while(j<s.length){if(s[j]==="'"){if(s[j+1]==="'"){o+="'";j+=2;continue;}break;}o+=s[j++];}i=j+1;return o;}
  if(c==='#'){let j=i+1;while(/\d/.test(s[j]))j++;const r={ref:+s.slice(i+1,j)};i=j;return r;}
  if(c==='.'){const j=s.indexOf('.',i+1);const v=s.slice(i+1,j);i=j+1;return{en:v};}
  if(c==='$'||c==='*'){i++;return null;}
  if(/[A-Z]/.test(c)){let j=i;while(/[A-Z0-9_]/.test(s[j]))j++;const name=s.slice(i,j);i=j;const a=val();return{typed:name,args:a};}
  let j=i;while(j<s.length&&/[-+0-9.Ee]/.test(s[j]))j++;const v=parseFloat(s.slice(i,j));i=j;return v;}
  return val();}
function parseSTEP(txt,tol){
  const data=txt.slice(txt.indexOf('DATA;')+5),E=new Map();const re=/#(\d+)\s*=\s*([A-Z0-9_]*)\s*(\([\s\S]*?\))\s*;(?=\s*(?:#|ENDSEC))/g;let m;
  while((m=re.exec(data))){const id=+m[1];if(m[2])E.set(id,{t:m[2],raw:m[3]});else E.set(id,{t:'COMPLEX',raw:m[3]});}
  const A=id=>{const e=E.get(id);if(!e)return null;if(!e.a)e.a=stepArgs(e.raw);return e;};
  let unit=/SI_UNIT\s*\(\s*\.MILLI\.\s*,\s*\.METRE\./.test(txt)?'mm':/CONVERSION_BASED_UNIT\s*\(\s*'INCH'/i.test(txt)?'in':/SI_UNIT\s*\(\s*\$\s*,\s*\.METRE\./.test(txt)?'m':'mm';
  const pt=id=>{const e=A(id);return e?e.a[1]:[0,0,0];};
  const dirv=id=>{const e=A(id);return e?e.a[1]:[0,0,1];};
  const vtx=id=>{const e=A(id);return pt(e.a[1].ref);};
  const place=id=>{const e=A(id);const o=pt(e.a[1].ref);const z=e.a[2]?dirv(e.a[2].ref):[0,0,1];const x=e.a[3]?dirv(e.a[3].ref):[1,0,0];return{o,z,x};};
  function edgePts(oe){const e=A(oe.ref);const fwd=!(e.a[4]&&e.a[4].en==='F');const ec=A(e.a[3].ref);if(!ec||ec.t!=='EDGE_CURVE')return[];
    const v1=vtx(ec.a[1].ref),v2=vtx(ec.a[2].ref),cv=A(ec.a[3].ref),same=!(ec.a[4]&&ec.a[4].en==='F');let s=fwd?v1:v2,t=fwd?v2:v1,pts=null;
    if(cv&&cv.t==='CIRCLE'){const P=place(cv.a[1].ref),r=cv.a[2];const along=(same===fwd)?1:-1;const ccw=along*(P.z[2]>=0?1:-1);const a0=Math.atan2(s[1]-P.o[1],s[0]-P.o[0]);let a1=Math.atan2(t[1]-P.o[1],t[0]-P.o[0]);let sw=a1-a0;
      if(ccw>0){while(sw<=1e-9)sw+=TAU;}else{while(sw>=-1e-9)sw-=TAU;}pts=arcPts(P.o[0],P.o[1],r,a0,sw,tol);}
    else if(cv&&cv.t==='B_SPLINE_CURVE_WITH_KNOTS'){const deg=cv.a[1],ctl=cv.a[2].map(r=>pt(r.ref)),mul=cv.a[6],kn=cv.a[7];const K=[];mul.forEach((mm,i)=>{for(let k=0;k<mm;k++)K.push(kn[i]);});let p=bspline(ctl,K,deg,null,Math.max(16,ctl.length*8));if(dist(p[0],s)>dist(p[p.length-1],s))p=p.reverse();pts=p;}
    else if(cv&&cv.t==='COMPLEX'&&/B_SPLINE_CURVE/.test(cv.raw)){const ids=(cv.raw.match(/\(\s*(#\d+\s*(,\s*#\d+\s*)+)\)/)||[])[1];if(ids){let p=ids.split(',').map(x=>pt(+x.trim().slice(1)));if(dist(p[0],s)>dist(p[p.length-1],s))p=p.reverse();pts=p;}}
    if(!pts)pts=[s,t];return pts.map(q=>[q[0],q[1],q[2]===undefined?0:q[2]]);}
  const lv=new Map();let zmin=1e18,zmax=-1e18;
  for(const [id,e] of E){if(e.t==='CARTESIAN_POINT'){const a=A(id).a[1];if(a&&a.length===3){if(a[2]<zmin)zmin=a[2];if(a[2]>zmax)zmax=a[2];}}}
  for(const [id,e] of E){if(e.t!=='ADVANCED_FACE'&&e.t!=='FACE_SURFACE')continue;const f=A(id);const sf=A(f.a[2].ref);if(!sf||sf.t!=='PLANE')continue;const P=place(sf.a[1].ref);const same=!(f.a[3]&&f.a[3].en==='F');const nz=P.z[2]*(same?1:-1);if(nz<0.999)continue;
    const loops=[];for(const b of f.a[1]){const fb=A(b.ref);const el=A(fb.a[1].ref);if(!el||el.t!=='EDGE_LOOP')continue;const bo=!(fb.a[2]&&fb.a[2].en==='F');let lp=[];for(const oe of el.a[1]){const ps=edgePts(oe);if(!ps.length)continue;if(lp.length)ps.shift();lp=lp.concat(ps.map(q=>[q[0],q[1]]));}if(!bo)lp.reverse();lp=dedupe(lp,tol);if(lp.length>2)loops.push(lp);}
    const k=Math.round(P.o[2]/(tol*4));let L=lv.get(k);if(!L){L={z:P.o[2],loops:[]};lv.set(k,L);}
    // outer bound CCW, holes CW (view from +Z)
    loops.sort((a,b)=>Math.abs(area(b))-Math.abs(area(a)));loops.forEach((l,i)=>{const ar=area(l);if((i===0&&ar<0)||(i>0&&ar>0))l.reverse();L.loops.push(l);});}
  return{levels:[...lv.values()],zmin,zmax,unit};}
/* horizontal faces -> 2.5D raw geometry (Z up, machined from the top) */
function levelsTo25D(M,tol){
  const lv=M.levels.slice().sort((a,b)=>b.z-a.z);if(!lv.length)return null;const top=lv[0],zTop=top.z,thick=zTop-M.zmin;
  const loops=[],ld=[],circles=[];let ignored=0;
  const outers=top.loops.filter(l=>area(l)>0),opens=top.loops.filter(l=>area(l)<0).map(l=>l.slice().reverse());
  outers.forEach(l=>{loops.push(l);ld.push(null);});
  const centroid=l=>{const b=bbox(l);return[(b[0]+b[2])/2,(b[1]+b[3])/2];};
  const usedFloors=new Set();
  for(const O of opens){const aO=area(O);let floor=null;
    for(const L of lv.slice(1)){for(const l of L.loops){if(area(l)<=0)continue;const c=centroid(l);if(!pip(c,O))continue;const ar=area(l)/aO;if(ar>0.6&&(!floor||L.z>floor.z))floor={z:L.z,l,L};}}
    const depth=floor?zTop-floor.z:null;if(floor)usedFloors.add(floor.l);
    const c=asCircle(O,tol);if(c){circles.push({...c,depth});continue;}
    loops.push(O);ld.push(depth);
    if(floor)for(const isl of floor.L.loops)if(area(isl)<0&&pip(isl[0],O)){loops.push(isl.slice().reverse());ld.push(depth);}}
  for(const L of lv.slice(1))for(const l of L.loops)if(area(l)>0&&!usedFloors.has(l)&&!opens.some(O=>pip(centroid(l),O)))ignored++;
  return{loops,ld,circles,opens:[],thick,ignored};}

/* ---------- distance field + offsets ---------- */
function makeField(loops,h,maxCells){
  maxCells=maxCells||520000;
  const b=[1e18,1e18,-1e18,-1e18];loops.forEach(p=>bbox(p,b));
  let pad=4*h;let W=b[2]-b[0]+2*pad,H=b[3]-b[1]+2*pad;
  if((W/h)*(H/h)>maxCells){h=Math.sqrt(W*H/maxCells);pad=4*h;W=b[2]-b[0]+2*pad;H=b[3]-b[1]+2*pad;}
  const x0=b[0]-pad,y0=b[1]-pad,nx=Math.ceil(W/h)+1,ny=Math.ceil(H/h)+1,N=nx*ny;
  const S=[];loops.forEach(p=>{for(let i=0,n=p.length;i<n;i++){const a=p[i],c=p[(i+1)%n];S.push(a[0],a[1],c[0],c[1]);}});
  const ns=S.length/4;
  // bins
  const B=Math.max(h*6,Math.max(W,H)/80),bnx=Math.ceil(W/B)+1,bny=Math.ceil(H/B)+1,bins=Array.from({length:bnx*bny},()=>[]);
  for(let s=0;s<ns;s++){const ax=S[4*s],ay=S[4*s+1],cx=S[4*s+2],cy=S[4*s+3];const i0=Math.floor((Math.min(ax,cx)-x0)/B),i1=Math.floor((Math.max(ax,cx)-x0)/B),j0=Math.floor((Math.min(ay,cy)-y0)/B),j1=Math.floor((Math.max(ay,cy)-y0)/B);for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++)bins[j*bnx+i].push(s);}
  function segD(s,px,py){const ax=S[4*s],ay=S[4*s+1],dx=S[4*s+2]-ax,dy=S[4*s+3]-ay,l=dx*dx+dy*dy;let t=l>0?((px-ax)*dx+(py-ay)*dy)/l:0;t=t<0?0:t>1?1:t;const qx=ax+t*dx,qy=ay+t*dy;return[hyp(px-qx,py-qy),qx,qy];}
  function nearest(px,py){let best=1e18,bx=0,by=0;const ci=Math.min(bnx-1,Math.max(0,Math.floor((px-x0)/B))),cj=Math.min(bny-1,Math.max(0,Math.floor((py-y0)/B)));const seen=new Set();
    for(let r=0;r<Math.max(bnx,bny);r++){for(let j=cj-r;j<=cj+r;j++){if(j<0||j>=bny)continue;for(let i=ci-r;i<=ci+r;i++){if(i<0||i>=bnx)continue;if(r&&j!==cj-r&&j!==cj+r&&i!==ci-r&&i!==ci+r)continue;for(const s of bins[j*bnx+i]){if(seen.has(s))continue;seen.add(s);const q=segD(s,px,py);if(q[0]<best){best=q[0];bx=q[1];by=q[2];}}}}if(best<=r*B)break;}
    return[bx,by,best];}
  // inside mask (even-odd scanline)
  const ins=new Uint8Array(N);
  for(let j=0;j<ny;j++){const y=y0+j*h,xs=[];for(let s=0;s<ns;s++){const ay=S[4*s+1],cy=S[4*s+3];if((ay>y)!==(cy>y)){const ax=S[4*s],cx=S[4*s+2];xs.push(ax+(y-ay)*(cx-ax)/(cy-ay));}}xs.sort((a,b)=>a-b);
    for(let k=0;k+1<xs.length;k+=2){const i0=Math.max(0,Math.ceil((xs[k]-x0)/h)),i1=Math.min(nx-1,Math.floor((xs[k+1]-x0)/h));for(let i=i0;i<=i1;i++)ins[j*nx+i]=1;}}
  // exact band + EDT
  const ex=new Float32Array(N).fill(-1),f=new Float64Array(N).fill(1e20);
  for(let s=0;s<ns;s++){const ax=S[4*s],ay=S[4*s+1],cx=S[4*s+2],cy=S[4*s+3];const i0=Math.max(0,Math.floor((Math.min(ax,cx)-x0)/h)-2),i1=Math.min(nx-1,Math.ceil((Math.max(ax,cx)-x0)/h)+2),j0=Math.max(0,Math.floor((Math.min(ay,cy)-y0)/h)-2),j1=Math.min(ny-1,Math.ceil((Math.max(ay,cy)-y0)/h)+2);
    for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const d=segD(s,x0+i*h,y0+j*h)[0];if(d<2.5*h){const k=j*nx+i;if(ex[k]<0||d<ex[k])ex[k]=d;if(d<0.75*h)f[k]=0;}}}
  const mx=Math.max(nx,ny),v=new Int32Array(mx),z=new Float64Array(mx+1),tmp=new Float64Array(mx),out=new Float64Array(mx);
  function edt1(n){let k=0;v[0]=0;z[0]=-1e300;z[1]=1e300;for(let q=1;q<n;q++){let s=((tmp[q]+q*q)-(tmp[v[k]]+v[k]*v[k]))/(2*q-2*v[k]);while(s<=z[k]){k--;s=((tmp[q]+q*q)-(tmp[v[k]]+v[k]*v[k]))/(2*q-2*v[k]);}k++;v[k]=q;z[k]=s;z[k+1]=1e300;}k=0;for(let q=0;q<n;q++){while(z[k+1]<q)k++;out[q]=(q-v[k])*(q-v[k])+tmp[v[k]];}}
  for(let i=0;i<nx;i++){for(let j=0;j<ny;j++)tmp[j]=f[j*nx+i];edt1(ny);for(let j=0;j<ny;j++)f[j*nx+i]=out[j];}
  for(let j=0;j<ny;j++){for(let i=0;i<nx;i++)tmp[i]=f[j*nx+i];edt1(nx);for(let i=0;i<nx;i++)f[j*nx+i]=out[i];}
  const F=new Float32Array(N);let fmax=-1e9;
  for(let k=0;k<N;k++){const d=ex[k]>=0?ex[k]:Math.sqrt(f[k])*h;F[k]=ins[k]?d:-d;if(F[k]>fmax)fmax=F[k];}
  function sample(x,y){const fi=(x-x0)/h,fj=(y-y0)/h;let i=Math.floor(fi),j=Math.floor(fj);if(i<0||j<0||i>=nx-1||j>=ny-1)return -1e9;const tx=fi-i,ty=fj-j,k=j*nx+i;return F[k]*(1-tx)*(1-ty)+F[k+1]*tx*(1-ty)+F[k+nx]*(1-tx)*ty+F[k+nx+1]*tx*ty;}
  function inside(pt){let c=false;for(const p of loops)if(pip(pt,p))c=!c;return c;}
  function signed(x,y){const q=nearest(x,y);return inside([x,y])?q[2]:-q[2];}
  return{F,nx,ny,x0,y0,h,fmax,nearest,sample,signed,loops};
}
function rdp(pts,tol){if(pts.length<3)return pts.slice();const keep=new Uint8Array(pts.length);keep[0]=keep[pts.length-1]=1;const st=[[0,pts.length-1]];
  while(st.length){const [a,b]=st.pop();const A=pts[a],Bp=pts[b],dx=Bp[0]-A[0],dy=Bp[1]-A[1],l=hyp(dx,dy);let md=-1,mi=-1;for(let i=a+1;i<b;i++){const P=pts[i];const d=l>1e-12?Math.abs(dx*(A[1]-P[1])-dy*(A[0]-P[0]))/l:dist(P,A);if(d>md){md=d;mi=i;}}if(md>tol){keep[mi]=1;st.push([a,mi],[mi,b]);}}
  return pts.filter((_,i)=>keep[i]);}
function rdpClosed(p,tol){if(p.length<4)return p;let fi=0,fd=-1;for(let i=1;i<p.length;i++){const d=dist(p[0],p[i]);if(d>fd){fd=d;fi=i;}}const a=rdp(p.slice(0,fi+1),tol),b=rdp(p.slice(fi).concat([p[0]]),tol);return a.slice(0,-1).concat(b.slice(0,-1));}
/* iso-contours of field at level L, refined to exact offset, oriented for climb (material on right) */
function iso(fd,L,simpTol){
  const{F,nx,ny,x0,y0,h}=fd;const adj=new Map(),pt=new Map();
  const H=(i,j)=>j*nx+i,V=(i,j)=>nx*ny+j*nx+i;
  function P(id){if(pt.has(id))return;let i,j,a,b,ax,ay,bx,by;if(id<nx*ny){j=Math.floor(id/nx);i=id-j*nx;a=F[j*nx+i];b=F[j*nx+i+1];ax=x0+i*h;ay=y0+j*h;bx=ax+h;by=ay;}else{const k=id-nx*ny;j=Math.floor(k/nx);i=k-j*nx;a=F[j*nx+i];b=F[(j+1)*nx+i];ax=x0+i*h;ay=y0+j*h;bx=ax;by=ay+h;}const t=(L-a)/(b-a);pt.set(id,[ax+(bx-ax)*t,ay+(by-ay)*t]);}
  function link(e1,e2){P(e1);P(e2);(adj.get(e1)||adj.set(e1,[]).get(e1)).push(e2);(adj.get(e2)||adj.set(e2,[]).get(e2)).push(e1);}
  for(let j=0;j<ny-1;j++)for(let i=0;i<nx-1;i++){const k=j*nx+i,a=F[k],b=F[k+1],c=F[k+nx+1],d=F[k+nx];const idx=(a>L?1:0)|(b>L?2:0)|(c>L?4:0)|(d>L?8:0);if(idx===0||idx===15)continue;
    const bo=H(i,j),ri=V(i+1,j),to=H(i,j+1),le=V(i,j);
    switch(idx){case 1:case 14:link(le,bo);break;case 2:case 13:link(bo,ri);break;case 3:case 12:link(le,ri);break;case 4:case 11:link(ri,to);break;case 6:case 9:link(bo,to);break;case 7:case 8:link(le,to);break;
      case 5:{if((a+b+c+d)/4>L){link(bo,ri);link(le,to);}else{link(le,bo);link(ri,to);}break;}
      case 10:{if((a+b+c+d)/4>L){link(le,bo);link(ri,to);}else{link(bo,ri);link(le,to);}break;}}}
  const seen=new Set(),loops=[];
  for(const s of adj.keys()){if(seen.has(s))continue;const ch=[s];seen.add(s);let prev=-1,cur=s;
    while(true){const nb=adj.get(cur);let nx_=-1;for(const q of nb){if(q!==prev&&!seen.has(q)){nx_=q;break;}}if(nx_<0)break;seen.add(nx_);ch.push(nx_);prev=cur;cur=nx_;}
    if(ch.length<3)continue;
    let p=ch.map(id=>{let[x,y]=pt.get(id);for(let it=0;it<2;it++){const q=fd.nearest(x,y);if(q[2]<1e-12)break;x=q[0]+(x-q[0])/q[2]*L;y=q[1]+(y-q[1])/q[2]*L;}return[x,y];});
    p=rdpClosed(p,simpTol||0.0002);if(p.length<3)continue;
    // orient: material (lower field) on the right
    let li=0,ll=-1;for(let i=0;i<p.length;i++){const d=dist(p[i],p[(i+1)%p.length]);if(d>ll){ll=d;li=i;}}
    const A=p[li],Bq=p[(li+1)%p.length],mx=(A[0]+Bq[0])/2,my=(A[1]+Bq[1])/2,dx=(Bq[0]-A[0])/ll,dy=(Bq[1]-A[1])/ll,e=Math.min(h*0.5,L*0.25);
    const fr=fd.signed(mx+dy*e,my-dx*e),fl=fd.signed(mx-dy*e,my+dx*e);if(fr>fl)p.reverse();
    loops.push(p);}
  return loops;
}
function rotateTo(p,pos){let bi=0,bd=1e18;for(let i=0;i<p.length;i++){const d=dist(p[i],pos);if(d<bd){bd=d;bi=i;}}return p.slice(bi).concat(p.slice(0,bi));}
function layers(zTop,zBot,step){const t=zTop-zBot;if(t<=1e-9)return[zBot];const n=Math.max(1,Math.ceil(t/Math.max(step,1e-4)-1e-6));const o=[];for(let i=1;i<=n;i++)o.push(+(zTop-t*i/n).toFixed(5));return o;}

/* ---------- materials + feeds ---------- */
const MATERIALS=[
 {id:'al6061',en:'Aluminum 6061-T6',vi:'Nhôm 6061-T6',sfmC:1000,sfmH:300,cl:0.010,doc:2.0,woc:0.15,slot:0.5,drC:300,drH:200,ipr:0.020,tap:60,kp:0.3,color:'#c9ced3'},
 {id:'al7075',en:'Aluminum 7075-T6',vi:'Nhôm 7075-T6',sfmC:900,sfmH:280,cl:0.010,doc:2.0,woc:0.15,slot:0.5,drC:280,drH:180,ipr:0.020,tap:55,kp:0.35,color:'#bfc6cc'},
 {id:'brass',en:'Brass 360',vi:'Đồng thau 360',sfmC:700,sfmH:250,cl:0.008,doc:1.5,woc:0.15,slot:0.5,drC:300,drH:150,ipr:0.018,tap:50,kp:0.4,color:'#d8b45a'},
 {id:'cu110',en:'Copper 110',vi:'Đồng đỏ 110',sfmC:500,sfmH:150,cl:0.006,doc:1.0,woc:0.12,slot:0.3,drC:200,drH:100,ipr:0.015,tap:35,kp:0.5,color:'#c8754a'},
 {id:'delrin',en:'Delrin / Acetal',vi:'Nhựa Delrin / POM',sfmC:800,sfmH:400,cl:0.010,doc:2.0,woc:0.2,slot:0.75,drC:300,drH:250,ipr:0.020,tap:80,kp:0.1,color:'#ecebe4'},
 {id:'s1018',en:'Mild steel 1018',vi:'Thép thường 1018',sfmC:450,sfmH:100,cl:0.005,doc:1.5,woc:0.10,slot:0.25,drC:250,drH:80,ipr:0.012,tap:30,kp:1.0,color:'#8d949a'},
 {id:'s4140',en:'4140 prehard (28-32 HRC)',vi:'Thép 4140 đã tôi (28-32 HRC)',sfmC:350,sfmH:70,cl:0.004,doc:1.25,woc:0.08,slot:0.2,drC:200,drH:55,ipr:0.010,tap:20,kp:1.2,color:'#7b8187'},
 {id:'a2',en:'Tool steel A2 (annealed)',vi:'Thép dụng cụ A2 (ủ)',sfmC:300,sfmH:60,cl:0.004,doc:1.25,woc:0.08,slot:0.2,drC:180,drH:50,ipr:0.009,tap:18,kp:1.2,color:'#767c82'},
 {id:'ss304',en:'Stainless 304',vi:'Inox 304',sfmC:300,sfmH:60,cl:0.0035,doc:1.0,woc:0.08,slot:0.15,drC:150,drH:40,ipr:0.008,tap:15,kp:1.4,color:'#a7adb2'},
 {id:'ss316',en:'Stainless 316',vi:'Inox 316',sfmC:275,sfmH:55,cl:0.0035,doc:1.0,woc:0.08,slot:0.15,drC:140,drH:35,ipr:0.007,tap:12,kp:1.5,color:'#a1a8ad'},
 {id:'ci',en:'Gray cast iron',vi:'Gang xám',sfmC:400,sfmH:80,cl:0.005,doc:1.25,woc:0.10,slot:0.25,drC:250,drH:70,ipr:0.012,tap:25,kp:0.8,color:'#6e7276'},
 {id:'al2024',en:'Aluminum 2024-T3',vi:'Nhôm 2024-T3',sfmC:900,sfmH:280,cl:0.009,doc:2.0,woc:0.15,slot:0.5,drC:280,drH:180,ipr:0.018,tap:55,kp:0.35,color:'#c3c9cf'},
 {id:'al5052',en:'Aluminum 5052-H32',vi:'Nhôm 5052-H32',sfmC:900,sfmH:300,cl:0.009,doc:1.75,woc:0.15,slot:0.5,drC:280,drH:180,ipr:0.018,tap:55,kp:0.3,color:'#cdd2d6'},
 {id:'mic6',en:'Cast aluminum plate MIC-6',vi:'Nhôm tấm đúc MIC-6',sfmC:1000,sfmH:300,cl:0.010,doc:2.0,woc:0.15,slot:0.5,drC:300,drH:200,ipr:0.020,tap:60,kp:0.3,color:'#bcc2c7'},
 {id:'s12l14',en:'Free-machining steel 12L14',vi:'Thép dễ cắt 12L14',sfmC:600,sfmH:150,cl:0.006,doc:1.5,woc:0.12,slot:0.3,drC:300,drH:110,ipr:0.014,tap:40,kp:0.8,color:'#939aa0'},
 {id:'s1045',en:'Medium-carbon steel 1045',vi:'Thép C45 / 1045',sfmC:400,sfmH:85,cl:0.0045,doc:1.25,woc:0.10,slot:0.25,drC:230,drH:70,ipr:0.011,tap:25,kp:1.1,color:'#858c92'},
 {id:'s4340',en:'4340 steel (annealed)',vi:'Thép 4340 (ủ)',sfmC:350,sfmH:70,cl:0.004,doc:1.25,woc:0.08,slot:0.2,drC:200,drH:55,ipr:0.010,tap:20,kp:1.2,color:'#7f868c'},
 {id:'ss303',en:'Stainless 303',vi:'Inox 303',sfmC:400,sfmH:80,cl:0.004,doc:1.25,woc:0.10,slot:0.2,drC:180,drH:50,ipr:0.009,tap:20,kp:1.3,color:'#acb2b6'},
 {id:'ss174',en:'Stainless 17-4 PH (H1150)',vi:'Inox 17-4 PH (H1150)',sfmC:275,sfmH:50,cl:0.0032,doc:1.0,woc:0.07,slot:0.15,drC:130,drH:35,ipr:0.007,tap:12,kp:1.5,color:'#9ea5aa'},
 {id:'brz932',en:'Bearing bronze C932',vi:'Đồng thiếc C932',sfmC:600,sfmH:200,cl:0.007,doc:1.5,woc:0.15,slot:0.4,drC:250,drH:120,ipr:0.016,tap:45,kp:0.5,color:'#b98d4a'},
 {id:'in718',en:'Inconel 718',vi:'Inconel 718',sfmC:90,sfmH:20,cl:0.002,doc:0.75,woc:0.05,slot:0.08,drC:60,drH:15,ipr:0.004,tap:6,kp:2.0,color:'#8e9590'},
 {id:'ti64',en:'Titanium 6Al-4V',vi:'Titan 6Al-4V',sfmC:175,sfmH:40,cl:0.003,doc:1.0,woc:0.07,slot:0.1,drC:100,drH:30,ipr:0.006,tap:10,kp:1.3,color:'#9aa0a0'}
];
const MACHINES=[
 {id:'k3kmx',name:'TRAK K3 KMX (knee)',type:'knee',ctrl:'KMX',rpmMin:60,rpmMax:4200,hp:3,taper:'R8',tx:32,ty:16,tz:5,rapid:250,fmax:150},
 {id:'k3rmx',name:'TRAK K3 RMX (knee)',type:'knee',ctrl:'RMX',rpmMin:40,rpmMax:5000,hp:3,taper:'R8',tx:32,ty:16,tz:5,rapid:250,fmax:150},
 {id:'k3smx',name:'TRAK K3 SMX (knee)',type:'knee',ctrl:'SMX',rpmMin:60,rpmMax:4200,hp:3,taper:'R8',tx:32,ty:16,tz:5,rapid:250,fmax:150},
 {id:'dpmsx2p',name:'TRAK DPM SX2P (bed)',type:'bed',ctrl:'SMX',rpmMin:40,rpmMax:5000,hp:3,taper:'R8',tx:32,ty:16,tz:27,rapid:400,fmax:200},
 {id:'dpmrx2',name:'TRAK DPM RX2 (bed)',type:'bed',ctrl:'RMX',rpmMin:40,rpmMax:5000,hp:3,taper:'R8',tx:31,ty:16,tz:23.25,rapid:400,fmax:200},
 {id:'dpmrx3',name:'TRAK DPM RX3 (bed)',type:'bed',ctrl:'RMX',rpmMin:40,rpmMax:5000,hp:5,taper:'40',tx:34,ty:18,tz:24,rapid:400,fmax:200,approx:true},
 {id:'dpmrx5',name:'TRAK DPM RX5 (bed)',type:'bed',ctrl:'RMX',rpmMin:40,rpmMax:5000,hp:5,taper:'40',tx:41,ty:20.5,tz:24,rapid:400,fmax:200},
 {id:'dpmrx7',name:'TRAK DPM RX7 (bed)',type:'bed',ctrl:'RMX',rpmMin:40,rpmMax:5000,hp:7.5,taper:'40',tx:60,ty:23.5,tz:23,rapid:400,fmax:200},
 {id:'vf3ss',name:'Haas VF-3SS',type:'vmc',ctrl:'Haas',post:'haas',axes:3,rot:true,rpmMin:50,rpmMax:7500,hp:30,taper:'40',tx:40,ty:20,tz:25,rapid:1400,fmax:650},
 {id:'umc750',name:'Haas UMC-750',type:'5ax',ctrl:'Haas',post:'haas',axes:5,kin:'BC',bMin:-35,bMax:110,rpmMin:50,rpmMax:8100,hp:30,taper:'40',tx:30,ty:20,tz:20,rapid:1200,fmax:650},
 {id:'dmu50',name:'DMG MORI DMU 50 3rd gen',type:'5ax',ctrl:'Siemens 840D',post:'siemens',axes:5,kin:'BC',bMin:-35,bMax:110,rpmMin:20,rpmMax:15000,hp:28,taper:'SK40/HSK63',tx:25.6,ty:20.5,tz:18.7,rapid:1650,fmax:800},
 {id:'st10',name:'Haas ST-10 (lathe)',type:'lathe',ctrl:'Haas',post:'haas',axes:2,rpmMin:30,rpmMax:6000,hp:15,chuck:6.5,maxDia:14,maxLen:16,tx:7.88,tz:16,rapid:1200,fmax:400},
 {id:'nlx2500',name:'DMG MORI NLX 2500|700 (lathe)',type:'lathe',ctrl:'Fanuc/Siemens',post:'fanuc',axes:2,rpmMin:20,rpmMax:5000,hp:24.8,chuck:10,maxDia:14.4,maxLen:27.8,tx:10.2,tz:31.3,rapid:1200,fmax:400},
 {id:'dmv185',name:'DMG MORI DMV 185',type:'vmc',ctrl:'Fanuc/Siemens',post:'fanuc',axes:3,rot:true,rpmMin:50,rpmMax:20000,hp:35,taper:'SK40',tx:72.8,ty:27.6,tz:21.7,rapid:1400,fmax:800,approx:true}
];
const ROTARIES=[
 {id:'none',name:'—'},
 {id:'hrt160',name:'Haas HRT160',axis:'A',dia:6.3,dps:100},{id:'hrt160ss',name:'Haas HRT160SS',axis:'A',dia:6.3,dps:500},
 {id:'hrt210',name:'Haas HRT210',axis:'A',dia:8.3,dps:100},{id:'ha5c',name:'Haas HA5C (5C)',axis:'A',dia:0,dps:100,approx:true},
 {id:'trt160',name:'Haas TRT160 (tilt + rotary)',axis:'AB',dia:6.3,dps:80,five:true,approx:true},{id:'trt210',name:'Haas TRT210 (tilt + rotary)',axis:'AB',dia:8.3,dps:60,five:true,approx:true}];
const TAPS=[ // name, major(in), pitch(in), tap drill(in), drill label
 ['#4-40',0.112,1/40,0.089,'#43'],['#6-32',0.138,1/32,0.1065,'#36'],['#8-32',0.164,1/32,0.136,'#29'],['#10-24',0.19,1/24,0.1495,'#25'],['#10-32',0.19,1/32,0.159,'#21'],
 ['1/4-20',0.25,1/20,0.201,'#7'],['1/4-28',0.25,1/28,0.213,'#3'],['5/16-18',0.3125,1/18,0.257,'F'],['5/16-24',0.3125,1/24,0.272,'I'],['3/8-16',0.375,1/16,0.3125,'5/16'],['3/8-24',0.375,1/24,0.332,'Q'],
 ['7/16-14',0.4375,1/14,0.368,'U'],['1/2-13',0.5,1/13,0.4219,'27/64'],['1/2-20',0.5,1/20,0.4531,'29/64'],['5/8-11',0.625,1/11,0.5312,'17/32'],['3/4-10',0.75,1/10,0.6562,'21/32'],
 ['M3x0.5',3/25.4,0.5/25.4,2.5/25.4,'2.5mm'],['M4x0.7',4/25.4,0.7/25.4,3.3/25.4,'3.3mm'],['M5x0.8',5/25.4,0.8/25.4,4.2/25.4,'4.2mm'],['M6x1',6/25.4,1/25.4,5/25.4,'5.0mm'],
 ['M8x1.25',8/25.4,1.25/25.4,6.8/25.4,'6.8mm'],['M10x1.5',10/25.4,1.5/25.4,8.5/25.4,'8.5mm'],['M12x1.75',12/25.4,1.75/25.4,10.2/25.4,'10.2mm']
];
/* feeds: all inch internally. kind: rough|adaptive|slot|finish|face|drill|spot|tap|ream|bore|chamfer|circ */
/* material strength (psi): yield, elongation %, shear, drilling Kc; group — AutoCAM tabcalc tables */
const MPROPS={al6061:[40000,12,30000,120000,'aluminum'],al7075:[73000,11,48000,125000,'aluminum'],al2024:[47000,18,41000,125000,'aluminum'],al5052:[28000,12,20000,110000,'aluminum'],
 mic6:[15000,3,12000,110000,'aluminum'],brass:[25000,25,35000,120000,'copper'],cu110:[20000,30,22000,150000,'copper'],brz932:[18000,20,25000,130000,'copper'],delrin:[10000,30,9000,20000,'plastic'],
 s1018:[54000,15,38000,260000,'steel'],s12l14:[60000,10,40000,230000,'steel'],s1045:[77000,12,50000,290000,'steel'],s4140:[120000,15,75000,340000,'steel'],s4340:[68000,22,50000,320000,'steel'],
 a2:[55000,15,50000,330000,'steel'],ss303:[35000,40,42000,320000,'stainless'],ss304:[31000,40,44000,330000,'stainless'],ss316:[30000,40,45000,340000,'stainless'],ss174:[105000,16,75000,360000,'stainless'],
 ci:[25000,0.5,30000,180000,'castiron'],ti64:[128000,10,80000,300000,'superalloy'],in718:[150000,12,100000,450000,'superalloy']};
const BREAK_T={aluminum:0.06,steel:0.04,stainless:0.03,superalloy:0.03,castiron:0.08,copper:0.05,plastic:0.08};
function mprops(m){const p=MPROPS[m.id]||[35000,10,26000,(m.kp||1)*396000*0.92,'steel'];return{id:m.id,name:m.en,vi:m.vi,yield:p[0],elong:p[1],tau:p[2],kcd:p[3],kc:(m.kp||1)*396000,group:p[4]};}
/* drilling cycle by depth / D (AutoCAM feeds.drill) */
function drillCycle(depth,D,m){const r=depth/Math.max(D,1e-3),g=mprops(m).group,tough=g==='stainless'||g==='superalloy';
 if(r<=3)return{cycle:'G81',peck:0,ratio:r};if(r<=6)return{cycle:'G73',peck:+D.toFixed(4),ratio:r};return{cycle:'G83',peck:+((tough?0.5:0.75)*D).toFixed(4),ratio:r};}
/* tool tip deflection: stepped cantilever, flutes as 0.8·D, shank D.  δ = F/(3E)·[Lf³/If + (L³−Lf³)/Is] */
function deflection(F,tool,stick){const D=Math.max(tool.dia,0.01),L=Math.max(stick||(tool.loc||3*D)+0.25,0.05),Lf=Math.min(tool.loc||L,L),Ds=tool.shank||D,E=tool.mat==='hss'?30e6:90e6;
 const If=Math.PI*Math.pow(0.8*D,4)/64,Is=Math.PI*Math.pow(Ds,4)/64;return F/(3*E)*(Lf*Lf*Lf/If+(L*L*L-Lf*Lf*Lf)/Is);}
function feeds(tool,mat,kind,opt){
  opt=opt||{};const m=mat,carb=tool.mat!=='hss',D=Math.max(tool.dia,0.001),Z=Math.max(1,tool.flutes||2),mc=opt.machine||{rpmMax:5000,hp:3,fmax:200};
  let sfm,fz=0,ipr=0,doc=0,woc=0,note='';
  const effD=(tool.type==='chamfer'||tool.type==='cornerround')?Math.max(D*0.6,(tool.tipDia||0)+0.1):D;
  if(['drill','spot','center'].includes(kind)){sfm=carb?m.drC:m.drH;if(kind!=='drill')sfm*=1.2;ipr=Math.min(0.02,Math.max(0.0008,m.ipr*D));if(kind!=='drill')ipr*=0.6;}
  else if(kind==='tap'){sfm=m.tap*(carb?1.5:1);}
  else if(kind==='ream'){sfm=(carb?m.drC:m.drH)*0.6;ipr=Math.min(0.03,m.ipr*D*2);}
  else if(kind==='bore'){sfm=(carb?m.sfmC:m.sfmH)*0.5;ipr=0.003*Math.min(1,m.cl/0.006);}
  else{sfm=carb?m.sfmC:m.sfmH;fz=Math.min(0.008,Math.max(0.0004,m.cl*effD));
    if(kind==='adaptive'||kind==='circ'){woc=D*m.woc;doc=D*m.doc;}
    else if(kind==='slot'){woc=D;doc=D*m.slot;fz*=0.75;}
    else if(kind==='finish'){woc=Math.min(0.015,D*0.05);doc=D*Math.min(2,m.doc);sfm*=1.1;}
    else if(kind==='face'){woc=D*0.65;doc=Math.min(0.05,D*0.1);}
    else if(kind==='chamfer'||kind==='radius'){woc=0;doc=0;fz*=0.7;}
    else{woc=D*0.4;doc=D*m.slot;}
    if(tool.loc)doc=Math.min(doc,tool.loc*0.9);
    if(opt.woc>0)woc=Math.min(opt.woc,D);if(opt.doc>0)doc=opt.doc;
    // radial chip thinning
    if(woc>0&&woc<D/2&&kind!=='finish'){const k=D/(2*Math.sqrt(D*woc-woc*woc));fz=Math.min(fz*k,fz*3);note='chip thinning ×'+k.toFixed(2);}
  }
  if(tool.type==='face')sfm*=1.25;
  const steps=[];const f4=v=>(+v).toFixed(4);
  let rpm=sfm*3.82/effD;steps.push(`RPM = SFM × 3.82 ÷ D = ${Math.round(sfm)} × 3.82 ÷ ${f4(effD)} = ${Math.round(rpm)}`);
  if(kind==='tap'){const cap=opt.rigid===false?600:2000;if(rpm>cap){rpm=cap;steps.push(`Tap RPM held to ${cap} (${opt.rigid===false?'floating holder':'rigid tapping'})`);}}
  let capped=false;if(rpm>mc.rpmMax){rpm=mc.rpmMax;capped=true;steps.push(`RPM capped at machine max ${mc.rpmMax}`);}rpm=Math.max(mc.rpmMin||40,Math.round(rpm/10)*10);
  const sfmA=rpm*effD/3.82;let feed=kind==='tap'?rpm*(tool.pitch||0.05):fz?rpm*fz*Z:rpm*ipr;
  if(kind==='tap')steps.push(`Feed = RPM × pitch = ${rpm} × ${f4(tool.pitch||0.05)} = ${feed.toFixed(2)} ipm (synchronized)`);
  else if(fz)steps.push(`Feed = RPM × flutes × chip load = ${rpm} × ${Z} × ${(fz).toFixed(5)} = ${feed.toFixed(1)} ipm`);
  else steps.push(`Feed = RPM × IPR = ${rpm} × ${f4(ipr)} = ${feed.toFixed(1)} ipm`);
  // power + deflection limits: reduce DOC → WOC → feed (AutoCAM feeds.mill)
  const finishing=kind==='finish',dlim=finishing?0.0005:0.001,hplim=0.8*mc.hp,adj=[];let fcut=1,mrr=0,hp=0,force=0,defl=0;
  const docMin=Math.max(0.01,Math.min(doc,finishing?0.05:0.1*D)),wocMin=woc<D?Math.max(0.003,0.03*D):woc;const docUser=opt.doc>0;
  for(let k=0;k<80;k++){const fe=feed*fcut;mrr=woc&&doc?woc*doc*fe:0;const hpc=mrr*m.kp;hp=hpc/0.85;force=sfmA>0?hpc*33000/sfmA:0;
   defl=(woc&&doc&&tool.type!=='face')?deflection(force,tool,opt.stick):0;if((hp<=hplim&&defl<=dlim)||!mrr)break;
   const why=hp>hplim?`HP ${hp.toFixed(2)} > ${hplim.toFixed(2)}`:`deflection ${defl.toFixed(5)} > ${dlim}`;
   if(!docUser&&doc>docMin+1e-6){doc=Math.max(docMin,doc*0.9);adj.push('DOC→'+f4(doc)+' ('+why+')');}
   else if(woc>wocMin+1e-6&&kind!=='slot'){woc=Math.max(wocMin,woc*0.9);adj.push('WOC→'+f4(woc)+' ('+why+')');}
   else if(fcut>0.3){fcut*=0.9;adj.push('feed ×'+fcut.toFixed(2)+' ('+why+')');}else{note+=(note?' · ':'')+'limits not met: '+why;break;}}
  feed*=fcut;
  if(mrr){steps.push(`MRR = WOC × DOC × feed = ${f4(woc)} × ${f4(doc)} × ${feed.toFixed(1)} = ${mrr.toFixed(3)} in³/min`);
   steps.push(`HP = MRR × kp ÷ 0.85 = ${hp.toFixed(2)} (limit ${hplim.toFixed(2)})`);steps.push(`Force ≈ HP × 33000 ÷ SFM = ${Math.round(force)} lbf`);
   if(tool.type!=='face')steps.push(`Deflection (stick-out ${(opt.stick||((tool.loc||3*D)+0.25)).toFixed(3)}) = ${defl.toFixed(5)} in (limit ${dlim})`);}
  if(adj.length){note+=(note?' · ':'')+'auto: '+adj[adj.length-1];steps.push('Auto-adjust: '+adj.slice(0,3).join('; ')+(adj.length>3?` … (${adj.length})`:''));}
  if(feed>mc.fmax&&kind!=='tap'){feed=mc.fmax;steps.push('Feed held to machine max '+mc.fmax);}
  let cyc=null;if(kind==='drill'&&opt.depth>0){cyc=drillCycle(opt.depth,D,m);steps.push(`Depth ÷ D = ${opt.depth.toFixed(3)} ÷ ${f4(D)} = ${cyc.ratio.toFixed(1)} → ${cyc.cycle}${cyc.peck?' Q'+cyc.peck:''}`);}
  if(kind==='drill'||kind==='spot'){const th=0.5*mprops(m).kcd*ipr*D;force=th;steps.push(`Thrust ≈ ½ · Kc · IPR · D = ${Math.round(th)} lbf`);}
  feed=Math.round(feed*10)/10;
  return{rpm,feed,plunge:Math.round(feed*(kind==='finish'?0.5:0.35)*10)/10,fz:fz?feed/rpm/Z:0,ipr:feed/rpm,doc,woc,sfm:Math.round(sfmA),mrr,hp,force:Math.round(force),defl,capped,note,steps,cycle:cyc};
}

/* ---------- holding-tab strength (AutoCAM tabcalc) ---------- */
function tabCap(dir,y,w,t,L,e,tau){tau=tau??0.75*y;const sp=Math.max(L,0.02);if(dir==='inplane')return Math.min(tau*w*t,y*t*w*w/(6*sp));if(dir==='through')return Math.min(tau*w*t,y*w*t*t/(6*sp));return y/(1/(w*t)+6*(e||0)/(w*t*t));}
function tabMinT(dir,y,w,L,n,F,tau,target){const need=F*(target||2),sh=Math.max(1,n/2);let lo=0.005,hi=2;if(tabCap(dir,y,w,hi,L,0,tau)*sh<need)return null;for(let k=0;k<50;k++){const mm=(lo+hi)/2;if(tabCap(dir,y,w,mm,L,0,tau)*sh>=need)hi=mm;else lo=mm;}return Math.ceil(hi*200)/200;}
function sideForce(kc,D,ap,ae,feed,rpm){return kc*ap*ae*feed/(Math.PI*Math.max(D,0.01)*Math.max(rpm,1));}
function tabCheck(m,w,t,L,n,loads){const p=mprops(m),sh=Math.max(1,n/2);const rows=loads.map(ld=>{const holds=tabCap(ld.dir,p.yield,w,t,L,0,p.tau)*sh,sf=ld.force>1e-9?holds/ld.force:999;
  return{...ld,holds,sf:Math.min(sf,999),minT:tabMinT(ld.dir,p.yield,w,L,n,ld.force,p.tau)};});
 const worst=rows.reduce((a,r)=>!a||r.sf<a.sf?r:a,null),need=Math.max(0,...rows.map(r=>r.minT||9.99)),brk=BREAK_T[p.group]||0.05;
 return{p,rows,worst,sf:worst?worst.sf:null,minT:need<9?need:null,breakable:t<=brk,breakMax:brk};}
function opLoads(m,o){const p=mprops(m),D=o.dia||0.25,rpm=o.rpm||1000,f=o.feed||10;
 if(['drill','spot','tap','ream','bore'].includes(o.kind))return[{dir:'through',force:0.5*p.kcd*(f/rpm)*D,why:'thrust',label:o.label}];
 const ap=o.doc||D,ae=o.woc||D,ft=sideForce(p.kc,D,ap,Math.min(ae,D),f,rpm);return[{dir:'inplane',force:ft,why:'side',label:o.label},{dir:'through',force:0.3*ft,why:'helix',label:o.label}];}
/* ---------- fixture holding force (AutoCAM fixtures): holding = μ × clamping, SF ≥ 3 ---------- */
const FIXHOLD={vise:(fx)=>2*0.20*(fx.force||4000),softjaw:(fx)=>2*0.25*(fx.force||4000),clamps:(fx)=>0.25*(fx.clamps||4)*2000,plate:(fx)=>0.25*(fx.clamps||4)*2000,angle:()=>0.25*2*3000,collet:()=>0.3*4000,vise5:(fx)=>2*0.35*(fx.force||5000),tomb:(fx)=>0.25*(fx.clamps||4)*2000,trunnion:(fx)=>2*0.35*(fx.force||5000),chuck4:()=>3*0.3*1500,zeropoint:()=>0.3*4*2500,magnet:()=>0.2*60*12,vacuum:()=>0.25*12*14};
function fixtureHold(fx){return(FIXHOLD[fx.type]||FIXHOLD.vise)(fx);}
/* ---------- arc fitting: runs of short G1 moves on a circle → one G2/G3 (AutoCAM arcfit) ---------- */
function circ3(a,b,c){const d=2*(a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]));if(Math.abs(d)<1e-12)return null;const a2=a[0]*a[0]+a[1]*a[1],b2=b[0]*b[0]+b[1]*b[1],c2=c[0]*c[0]+c[1]*c[1];
 const x=(a2*(b[1]-c[1])+b2*(c[1]-a[1])+c2*(a[1]-b[1]))/d,y=(a2*(c[0]-b[0])+b2*(a[0]-c[0])+c2*(b[0]-a[0]))/d;return[x,y,Math.hypot(a[0]-x,a[1]-y)];}
function arcOK(P,i,j,tol){const c=circ3(P[i],P[(i+j)>>1],P[j]);if(!c||c[2]>100||c[2]<0.01)return null;let sw=0,sg=0;
 for(let k=i;k<=j;k++){if(Math.abs(Math.hypot(P[k][0]-c[0],P[k][1]-c[1])-c[2])>tol)return null;if(k<j){const mx=(P[k][0]+P[k+1][0])/2,my=(P[k][1]+P[k+1][1])/2;if(Math.abs(Math.hypot(mx-c[0],my-c[1])-c[2])>tol)return null;
   const a0=Math.atan2(P[k][1]-c[1],P[k][0]-c[0]),a1=Math.atan2(P[k+1][1]-c[1],P[k+1][0]-c[0]);let da=a1-a0;while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;if(Math.abs(da)>Math.PI/4)return null;
   const s_=Math.sign(da);if(!s_)return null;if(sg&&s_!==sg)return null;sg=s_;sw+=da;}}
 if(Math.abs(sw)>Math.PI+1e-6)return null;return{c,ccw:sg>0};}
function arcFit(prog,tol){tol=tol||0.0005;const out=[];let pos=null,run=[];
 const flush=()=>{if(!run.length)return;const P=[pos0].concat(run.map(b=>[b.x,b.y]));let i=0;const n=P.length-1;
  while(i<n){let best=null,bj=-1;for(let j=i+4;j<=Math.min(n,i+400);j++){const r=arcOK(P,i,j,tol);if(r){best=r;bj=j;}else if(bj>0&&j>bj+2)break;}
   if(best){const b=run[bj-1],st=P[i];out.push({g:best.ccw?3:2,x:b.x,y:b.y,z:b.z,i:best.c[0]-st[0],j:best.c[1]-st[1],cx:best.c[0],cy:best.c[1],f:b.f});i=bj;}else{out.push(run[i]);i++;}}
  run=[];};
 let pos0=null;
 for(const b of prog){const lin=b.g===1&&b.a==null&&b.b==null&&b.c==null&&!b.inv&&b.x!=null&&b.y!=null;
  if(lin&&pos&&Math.abs((b.z??pos[2])-pos[2])<1e-7&&(!run.length||run[run.length-1].f===b.f)){if(!run.length)pos0=[pos[0],pos[1]];run.push(b);pos=[b.x,b.y,b.z??pos[2]];continue;}
  flush();out.push(b);
  if(b.g!==undefined&&b.x!=null)pos=[b.x,b.y??(pos?pos[1]:0),b.z??(pos?pos[2]:0)];else if(b.g!==undefined&&pos){pos=[pos[0],pos[1],b.z??pos[2]];}
  else if(b.t==='cycle'){pos=[b.pts[b.pts.length-1][0],b.pts[b.pts.length-1][1],b.clear];}else if(b.t==='g43'){pos=[b.x,b.y,null];}else if(b.t==='tool'||b.t==='index')pos=null;}
 flush();return out;}
/* ---------- single-stroke engraving font (AutoCAM strokefont, 4×6 grid) ---------- */
const FONT_SRC={A:"0,0 0,4 2,6 4,4 4,0|0,3 4,3",B:"0,0 0,6 3,6 4,5 4,4 3,3 0,3|3,3 4,2 4,1 3,0 0,0",C:"4,1 3,0 1,0 0,1 0,5 1,6 3,6 4,5",D:"0,0 0,6 3,6 4,5 4,1 3,0 0,0",E:"4,0 0,0 0,6 4,6|0,3 3,3",F:"0,0 0,6 4,6|0,3 3,3",G:"4,5 3,6 1,6 0,5 0,1 1,0 3,0 4,1 4,3 2,3",H:"0,0 0,6|4,0 4,6|0,3 4,3",I:"1,0 3,0|2,0 2,6|1,6 3,6",J:"0,1 1,0 3,0 4,1 4,6",K:"0,0 0,6|4,6 0,2|1,3 4,0",L:"0,6 0,0 4,0",M:"0,0 0,6 2,3 4,6 4,0",N:"0,0 0,6 4,0 4,6",O:"1,0 0,1 0,5 1,6 3,6 4,5 4,1 3,0 1,0",P:"0,0 0,6 3,6 4,5 4,4 3,3 0,3",Q:"1,0 0,1 0,5 1,6 3,6 4,5 4,1 3,0 1,0|2,2 4,0",R:"0,0 0,6 3,6 4,5 4,4 3,3 0,3|2,3 4,0",S:"4,5 3,6 1,6 0,5 0,4 1,3 3,3 4,2 4,1 3,0 1,0 0,1",T:"0,6 4,6|2,6 2,0",U:"0,6 0,1 1,0 3,0 4,1 4,6",V:"0,6 2,0 4,6",W:"0,6 1,0 2,3 3,0 4,6",X:"0,0 4,6|0,6 4,0",Y:"0,6 2,3 4,6|2,3 2,0",Z:"0,6 4,6 0,0 4,0",
 "0":"1,0 0,1 0,5 1,6 3,6 4,5 4,1 3,0 1,0|0,1 4,5","1":"1,5 2,6 2,0|1,0 3,0","2":"0,5 1,6 3,6 4,5 4,4 0,0 4,0","3":"0,5 1,6 3,6 4,5 4,4 3,3 1,3|3,3 4,2 4,1 3,0 1,0 0,1","4":"3,0 3,6 0,2 4,2","5":"4,6 0,6 0,3 3,3 4,2 4,1 3,0 0,0","6":"4,5 3,6 1,6 0,5 0,1 1,0 3,0 4,1 4,2 3,3 0,3","7":"0,6 4,6 1,0","8":"1,3 0,4 0,5 1,6 3,6 4,5 4,4 3,3 1,3 0,2 0,1 1,0 3,0 4,1 4,2 3,3","9":"4,3 1,3 0,4 0,5 1,6 3,6 4,5 4,1 3,0 1,0 0,1",
 "-":"1,3 3,3",".":"2,0 2,0.4","/":"0,0 4,6","#":"1,0 1,6|3,0 3,6|0,2 4,2|0,4 4,4","+":"2,1 2,5|0,3 4,3",":":"2,1 2,1.4|2,4 2,4.4","(":"3,6 2,5 2,1 3,0",")":"1,6 2,5 2,1 1,0","_":"0,0 4,0"};
const GLYPHS={};for(const k in FONT_SRC)GLYPHS[k]=FONT_SRC[k].split('|').map(st=>st.split(' ').map(p=>p.split(',').map(Number)));
const DEACC=t=>String(t).normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/đ/g,'d').replace(/Đ/g,'D');
function textStrokes(text,x,y,h,ang){const k=h/6,ca=Math.cos((ang||0)*Math.PI/180),sa=Math.sin((ang||0)*Math.PI/180),out=[];[...DEACC(text).toUpperCase()].forEach((ch,i)=>{for(const st of GLYPHS[ch]||[])out.push(st.map(([gx,gy])=>{const u=(i*6+gx)*k,v=gy*k;return[x+u*ca-v*sa,y+u*sa+v*ca];}));});return out;}
function textWidth(text,h){const n=String(text).length;return n?(n*6-2)*h/6:0;}
function genEngrave(op,ctx,mb){const h=op.th||0.25,txt=op.text||'MINI CAM',w=textWidth(txt,h);let x=op.x0??0,y=op.y0??0;if(op.align==='center'){x-=w/2;y-=h/2;}
 const z=op.zBot??-0.01,R=(op.zTop||0)+(ctx.retract||0.1);mb.retract(ctx.clear);let first=true;
 for(const st of textStrokes(txt,x,y,h,op.ang||0)){if(first){mb.rapid(st[0][0],st[0][1]);first=false;}else{mb.retract(R);mb.rapid(st[0][0],st[0][1]);}mb.rapid(null,null,R);mb.feed(null,null,z,op.plunge);
  for(let k=1;k<st.length;k++)mb.feed(st[k][0],st[k][1],z,op.feed);mb.retract(R);}
 mb.retract(ctx.clear);}
/* ---------- feed by tool load (AutoCAM feedopt): engagement on two rings → chip-thinning feed ---------- */
function feedOpt(prog,sr,top,opt){opt=opt||{};const CELL=0.03,PIECE=0.25,x0=sr[0]-0.6,y0=sr[1]-0.6,nx=Math.ceil((sr[2]-sr[0]+1.2)/CELL)+1,ny=Math.ceil((sr[3]-sr[1]+1.2)/CELL)+1;
 const H=new Float32Array(nx*ny).fill(-1e9);for(let j=0;j<ny;j++){const y=y0+(j+.5)*CELL;if(y<sr[1]||y>sr[3])continue;for(let i=0;i<nx;i++){const x=x0+(i+.5)*CELL;if(x>=sr[0]&&x<=sr[2])H[j*nx+i]=top;}}
 const at=(x,y)=>{const i=Math.floor((x-x0)/CELL),j=Math.floor((y-y0)/CELL);return i>=0&&j>=0&&i<nx&&j<ny?H[j*nx+i]:-1e9;};const discs={};
 const stamp=(x,y,z,R)=>{const key=R.toFixed(4);if(!discs[key]){const n=Math.floor(R/CELL)+1,d=[];for(let a=-n;a<=n;a++)for(let b=-n;b<=n;b++)if((a*CELL)**2+(b*CELL)**2<=R*R)d.push([a,b]);discs[key]=d;}
  const i0=Math.floor((x-x0)/CELL),j0=Math.floor((y-y0)/CELL);for(const[a,b]of discs[key]){const i=i0+a,j=j0+b;if(i>=0&&j>=0&&i<nx&&j<ny){const q=j*nx+i;if(H[q]>z)H[q]=z;}}};
 const stampLine=(a,b,R)=>{const L=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]),n=Math.max(1,Math.floor(L/(CELL*1.5)));for(let k=0;k<=n;k++){const t=k/n;stamp(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t,a[2]+(b[2]-a[2])*t,R);}};
 const engage=(x,y,z,R)=>{let hit=0;for(let k=0;k<24;k++){const a=2*Math.PI*k/24,c=Math.cos(a),s_=Math.sin(a);if(at(x+0.78*R*c,y+0.78*R*s_)>z+0.003||at(x+0.95*R*c,y+0.95*R*s_)>z+0.003)hit++;}const ph=2*Math.PI*hit/24;return ph>Math.PI?1:(1-Math.cos(ph))/2;};
 const kf=r=>r>=0.5?1:2*Math.sqrt(Math.max(r,0)*(1-r));
 const out=[],rep={};let cur=null,pos=null;
 for(const b of prog){if(b.t==='op'){cur=b.meta||null;out.push(b);continue;}if(b.t==='tool'||b.t==='index'){pos=null;out.push(b);continue;}if(b.t==='g43'){pos=[b.x,b.y,null];out.push(b);continue;}
  if(b.t==='cycle'){pos=[b.pts[b.pts.length-1][0],b.pts[b.pts.length-1][1],b.clear];out.push(b);continue;}
  if(b.g===undefined||b.a!=null||b.b!=null||b.inv){if(b.x!=null)pos=[b.x,b.y,b.z];out.push(b);continue;}
  const p1=[b.x??(pos?pos[0]:0),b.y??(pos?pos[1]:0),b.z??(pos?pos[2]:0)];
  if(!pos||pos[2]==null||b.g===0||!cur||cur.noStamp){out.push(b);pos=p1;continue;}
  const R=(cur.dia||0.25)/2;
  if(b.g>1){/* arcs: stamp along, keep feed */const n=24;let a0=Math.atan2(pos[1]-b.cy,pos[0]-b.cx),a1=Math.atan2(p1[1]-b.cy,p1[0]-b.cx),r=Math.hypot(pos[0]-b.cx,pos[1]-b.cy);let da=a1-a0;if(b.g===3){while(da<=0)da+=2*Math.PI;}else{while(da>=0)da-=2*Math.PI;}
   let q=pos;for(let k=1;k<=n;k++){const a=a0+da*k/n,np=[b.cx+r*Math.cos(a),b.cy+r*Math.sin(a),pos[2]+(p1[2]-pos[2])*k/n];stampLine(q,np,R);q=np;}out.push(b);pos=p1;continue;}
  if(!cur.tune||Math.abs(p1[2]-pos[2])>1e-6){stampLine(pos,p1,R);out.push(b);pos=p1;continue;}
  const L=Math.hypot(p1[0]-pos[0],p1[1]-pos[1]),n=Math.max(1,Math.ceil(L/PIECE)),lo=cur.finish?0.6:0.6,hi=cur.finish?1.0:1.3,k0=kf(Math.max(0.02,cur.r0||0.5)),base=b.f;
  const R_=rep[cur.i]||(rep[cur.i]={label:cur.label,min:9,max:0,before:0,after:0});
  for(let q=1;q<=n;q++){const a=[pos[0]+(p1[0]-pos[0])*(q-1)/n,pos[1]+(p1[1]-pos[1])*(q-1)/n,pos[2]],c=[pos[0]+(p1[0]-pos[0])*q/n,pos[1]+(p1[1]-pos[1])*q/n,pos[2]];
   let f=hi;const st=Math.max(1,Math.floor(Math.hypot(c[0]-a[0],c[1]-a[1])/(CELL*2)));for(let k=0;k<=st;k++){const t=k/st,x=a[0]+(c[0]-a[0])*t,y=a[1]+(c[1]-a[1])*t;const r=engage(x,y,a[2],R);const fac=r<0.003?hi:r>=0.5?k0*0.9:k0/kf(r);f=Math.min(f,Math.max(lo,Math.min(hi,fac)));}
   f=Math.round(f*20)/20;const seg=Math.hypot(c[0]-a[0],c[1]-a[1]);R_.before+=seg/Math.max(base,0.1);R_.after+=seg/Math.max(base*f,0.1);R_.min=Math.min(R_.min,f);R_.max=Math.max(R_.max,f);
   stampLine(a,c,R);out.push({...b,x:c[0],y:c[1],z:c[2],f:+(base*f).toFixed(1)});}
  pos=p1;}
 const list=Object.values(rep);return{prog:out,rep:list,saved:list.reduce((s,r)=>s+r.before-r.after,0)};}
/* ---------- holes in a mesh in any axis + approach directions (AutoCAM holes3d / axes) ---------- */
function meshHoles(T,sc){sc=sc||1;const tris=T.map(t=>[[t[0]*sc,t[1]*sc,t[2]*sc],[t[3]*sc,t[4]*sc,t[5]*sc],[t[6]*sc,t[7]*sc,t[8]*sc]]);
 const bb=[1e9,1e9,1e9,-1e9,-1e9,-1e9];for(const t of tris)for(const p of t)for(let k=0;k<3;k++){bb[k]=Math.min(bb[k],p[k]);bb[k+3]=Math.max(bb[k+3],p[k]);}
 const key=p=>p.map(v=>Math.round(v*2000)).join(',');const out=[];let downArea=0,area0=0;
 const nrm=t=>{const u=[t[1][0]-t[0][0],t[1][1]-t[0][1],t[1][2]-t[0][2]],v=[t[2][0]-t[0][0],t[2][1]-t[0][1],t[2][2]-t[0][2]],n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]],l=Math.hypot(...n)||1;return[n.map(c=>c/l),l/2];};
 const N=tris.map(nrm);N.forEach(([n,a],i)=>{area0+=a;const zc=(tris[i][0][2]+tris[i][1][2]+tris[i][2][2])/3;if(n[2]<-0.2&&zc>bb[2]+0.01)downArea+=a;});
 const INH=new Set();
 for(const ax of[0,1,2]){const u=(ax+1)%3,v=(ax+2)%3;const W=[];N.forEach(([n,a],i)=>{if(Math.abs(n[ax])<0.05&&a>1e-8)W.push(i);});
  const vmap={};W.forEach(i=>tris[i].forEach(p=>{const k=key(p);(vmap[k]=vmap[k]||[]).push(i);}));const seen=new Set();
  for(const i0 of W){if(seen.has(i0))continue;const comp=[],st=[i0];seen.add(i0);while(st.length){const i=st.pop();comp.push(i);for(const p of tris[i])for(const j of vmap[key(p)]||[])if(!seen.has(j)){seen.add(j);st.push(j);}}
   if(comp.length<6)continue;const P=[];comp.forEach(i=>tris[i].forEach(p=>P.push([p[u],p[v],p[ax]])));
   // Kåsa circle fit
   let sx=0,sy=0,sxx=0,syy=0,sxy=0,sxz=0,syz=0,sz=0;const n_=P.length;for(const[x,y]of P){const z=x*x+y*y;sx+=x;sy+=y;sxx+=x*x;syy+=y*y;sxy+=x*y;sxz+=x*z;syz+=y*z;sz+=z;}
   const A=[[sxx,sxy,sx],[sxy,syy,sy],[sx,sy,n_]],Bv=[sxz,syz,sz];const det=m=>m[0][0]*(m[1][1]*m[2][2]-m[1][2]*m[2][1])-m[0][1]*(m[1][0]*m[2][2]-m[1][2]*m[2][0])+m[0][2]*(m[1][0]*m[2][1]-m[1][1]*m[2][0]);
   const D0=det(A);if(Math.abs(D0)<1e-12)continue;const col=(k)=>A.map((r,i)=>r.map((c,j)=>j===k?Bv[i]:c));const a1=det(col(0))/D0,b1=det(col(1))/D0,c1=det(col(2))/D0;const cx=a1/2,cy=b1/2,r=Math.sqrt(Math.max(0,c1+cx*cx+cy*cy));
   if(!(r>0.01&&r<3))continue;let bad=0;for(const[x,y]of P)if(Math.abs(Math.hypot(x-cx,y-cy)-r)>Math.max(0.003,r*0.02))bad++;if(bad>P.length*0.05)continue;
   const angs=new Set();let inward=0;for(const i of comp){const c=tris[i].reduce((s,p)=>[s[0]+p[u]/3,s[1]+p[v]/3],[0,0]);angs.add(Math.floor((Math.atan2(c[1]-cy,c[0]-cx)+Math.PI)/(2*Math.PI)*36));const n=N[i][0];if(n[u]*(cx-c[0])+n[v]*(cy-c[1])>0)inward++;}
   if(angs.size<27||inward<comp.length*0.6)continue;
   const zs=P.map(q=>q[2]),z0=Math.min(...zs),z1=Math.max(...zs),thru=z0<=bb[ax]+0.005&&z1>=bb[ax+3]-0.005;const c3=[0,0,0];c3[u]=cx;c3[v]=cy;c3[ax]=(z0+z1)/2;
   const open=thru?[1,-1]:z1>=bb[ax+3]-0.005?[1]:z0<=bb[ax]+0.005?[-1]:[];comp.forEach(i=>INH.add(i));out.push({axis:'XYZ'[ax],dia:2*r,at:c3,len:z1-z0,through:thru,open});}}
 downArea=0;N.forEach(([n,a],i)=>{if(INH.has(i))return;const zc=(tris[i][0][2]+tris[i][1][2]+tris[i][2][2])/3;if(n[2]<-0.2&&zc>bb[2]+0.01)downArea+=a;});
 return{holes:out,bbox:bb,undercut:area0?downArea/area0:0};}
function decideAxes(dirs,undercut){const T=1e-3;const U=[];for(const d of dirs){const l=Math.hypot(...d)||1,n=d.map(c=>c/l);if(!U.some(q=>q[0]*n[0]+q[1]*n[1]+q[2]*n[2]>1-T))U.push(n);}
 const ang=(d,ab)=>{const[x,y,z]=d;return(((ab==='A'?Math.atan2(y,z):Math.atan2(-x,z))*180/Math.PI)%360+360)%360;};
 if(U.every(d=>Math.abs(Math.abs(d[2])-1)<T))return{mode:'3',flip:U.some(d=>d[2]<0),dirs:U};
 if(U.every(d=>Math.abs(d[0])<T))return{mode:'4',rotary:'A',index:[...new Set(U.map(d=>Math.round(ang(d,'A'))))].sort((a,b)=>a-b),dirs:U};
 if(U.every(d=>Math.abs(d[1])<T))return{mode:'4',rotary:'B',index:[...new Set(U.map(d=>Math.round(ang(d,'B'))))].sort((a,b)=>a-b),dirs:U};
 return{mode:'5_32',dirs:U};}
/* ---------- toolpath generation (IR) ---------- */
function MB(clear){this.o=[];this.p=[0,0,clear];this.clear=clear;}
MB.prototype.rapid=function(x,y,z){x=x??this.p[0];y=y??this.p[1];z=z??this.p[2];if(Math.abs(x-this.p[0])+Math.abs(y-this.p[1])+Math.abs(z-this.p[2])<1e-7)return;this.o.push({g:0,x,y,z});this.p=[x,y,z];};
MB.prototype.feed=function(x,y,z,f){x=x??this.p[0];y=y??this.p[1];z=z??this.p[2];if(Math.abs(x-this.p[0])+Math.abs(y-this.p[1])+Math.abs(z-this.p[2])<1e-7)return;this.o.push({g:1,x,y,z,f});this.p=[x,y,z];};
MB.prototype.arc=function(g,x,y,z,cx,cy,f){this.o.push({g,x,y,z,i:cx-this.p[0],j:cy-this.p[1],cx,cy,f});this.p=[x,y,z];};
MB.prototype.circle=function(g,cx,cy,z0,z1,f){/* full circle from current point, two halves, helical z0->z1 */const sx=this.p[0],sy=this.p[1],ox=2*cx-sx,oy=2*cy-sy;this.arc(g,ox,oy,(z0+z1)/2,cx,cy,f);this.arc(g,sx,sy,z1,cx,cy,f);};
MB.prototype.cycle=function(c){this.o.push(Object.assign({t:'cycle'},c));};
MB.prototype.retract=function(z){this.rapid(null,null,z);};

function rampLoop(mb,loop,z0,z1,ang,f,fp){
  const n=loop.length,P=perim(loop,true);
  if(P<1e-3||z0-z1<1e-6){mb.feed(null,null,z1,fp);return 0;}
  const need=(z0-z1)/Math.tan(ang);const segs=[];let acc=0,i=0;
  while(acc<need-1e-9&&i<n*50){const l=dist(loop[i%n],loop[(i+1)%n]);segs.push(l);acc+=l;i++;}
  let run=0;for(let k=0;k<segs.length;k++){run+=segs[k];const q=loop[(k+1)%n];mb.feed(q[0],q[1],z0-(z0-z1)*run/acc,f);}
  return segs.length%n;
}
function cornerPts(lp,r,f,k){/* closed loop starting/ending at lp[0]; slow segments near sharp corners where tool turns away from material (left turn) */
  const n=lp.length,slow=new Uint8Array(n);if(k<0.999)for(let i=0;i<n;i++){const a=lp[(i-1+n)%n],b=lp[i],c=lp[(i+1)%n];const ux=b[0]-a[0],uy=b[1]-a[1],vx=c[0]-b[0],vy=c[1]-b[1];const lu=hyp(ux,uy),lv=hyp(vx,vy);if(lu<1e-9||lv<1e-9)continue;const cr=(ux*vy-uy*vx)/(lu*lv),dt=(ux*vx+uy*vy)/(lu*lv);const ang=Math.atan2(cr,dt);if(ang>0.5)slow[i]=1;}
  const out=[];const zone=Math.max(r,0.01);
  for(let i=0;i<n;i++){const a=lp[i],b=lp[(i+1)%n],L=dist(a,b);const sa=slow[i],sb=slow[(i+1)%n];
    if(!sa&&!sb){out.push([b[0],b[1],f]);continue;}
    if(L<=zone*2.2){out.push([b[0],b[1],f*k]);continue;}
    const ux=(b[0]-a[0])/L,uy=(b[1]-a[1])/L;
    if(sa)out.push([a[0]+ux*zone,a[1]+uy*zone,f*k]);
    if(sb){out.push([b[0]-ux*zone,b[1]-uy*zone,f]);out.push([b[0],b[1],f*k]);}else out.push([b[0],b[1],f]);}
  return out;}
function cutLoopFrom(mb,loop,si,z,f,r,k,tabs){const lp=si?loop.slice(si).concat(loop.slice(0,si)):loop;const pts=cornerPts(lp,r||0.1,f,k==null?1:k);
  if(!tabs||!tabs.pts.length||z>=tabs.z-1e-6){for(const q of pts)mb.feed(q[0],q[1],z,Math.round(q[2]*10)/10);return;}
  const rr=Math.hypot(tabs.w/2+(r||0.1),r||0.1),inTab=(x,y)=>tabs.pts.some(c=>(x-c[0])**2+(y-c[1])**2<rr*rr);let prev=[mb.p[0],mb.p[1]];
  for(const q of pts){const L=dist(prev,q),n=Math.max(1,Math.ceil(L/0.01));for(let i=1;i<=n;i++){const x=prev[0]+(q[0]-prev[0])*i/n,y=prev[1]+(q[1]-prev[1])*i/n;const zz=inTab(x,y)?tabs.z:z;if(i===n||zz!==mb.p[2]||(i<n&&inTab(prev[0]+(q[0]-prev[0])*(i+1)/n,prev[1]+(q[1]-prev[1])*(i+1)/n)!==inTab(x,y)))mb.feed(x,y,zz,Math.round(q[2]*10)/10);}prev=[q[0],q[1]];}}
function helixAt(mb,c,rh,z0,z1,ang,f){mb.feed(c[0]+rh,c[1],z0,f);const pitch=TAU*rh*Math.tan(ang),turns=Math.max(1,Math.ceil((z0-z1)/Math.max(pitch,1e-4)));let zc=z0;const dz=(z0-z1)/turns;for(let t=0;t<turns;t++){mb.circle(3,c[0],c[1],zc,zc-dz,f);zc-=dz;}mb.circle(3,c[0],c[1],z1,z1,f);}
function localMax(fd,lp){const b=bbox(lp);let best=-1e9,bx=0,by=0;const st=Math.max(fd.h,(b[2]-b[0]+b[3]-b[1])/120);for(let y=b[1];y<=b[3];y+=st)for(let x=b[0];x<=b[2];x+=st){const v=fd.sample(x,y);if(v>best&&pip([x,y],lp)){best=v;bx=x;by=y;}}return{c:[bx,by],v:best};}
function lineSafe(fd,a,b,L){const d=dist(a,b),n=Math.max(2,Math.ceil(d/(fd.h*0.5)));for(let i=0;i<=n;i++){const t=i/n;if(fd.sample(a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t)<L-fd.h*0.75)return false;}return true;}

function regionLoops(feat,ctx,expand){
  if(feat.kind==='pocket')return[feat.loop].concat(feat.islands||[]);
  if(feat.kind==='profile'){const s=ctx.stockRect,e=expand;return[[[s[0]-e,s[1]-e],[s[2]+e,s[1]-e],[s[2]+e,s[3]+e],[s[0]-e,s[3]+e]],feat.loop];}
  return null;
}
function fieldH(loops,r){const b=[1e18,1e18,-1e18,-1e18];loops.forEach(p=>bbox(p,b));const ext=Math.max(b[2]-b[0],b[3]-b[1]);return Math.max(ext/900,Math.min(ext/320,r/3));}

function genClear(op,ctx,mb,W){
  const tl=ctx.tool,r=tl.dia/2,leave=op.leave||0,step=Math.min(Math.max(op.woc,r*0.05),r*0.95);
  const loops=regionLoops(ctx.feat,ctx,tl.dia+0.1);if(!loops){W.push('feature');return;}
  const fd=makeField(loops,fieldH(loops,r));
  const levels=[];for(let L=r+leave;L<fd.fmax-1e-6;L+=step)levels.push(L);
  if(!levels.length){W.push('tooBig');return;}
  const sr=ctx.stockRect;const inStock=p=>p.some(q=>q[0]>sr[0]-r&&q[0]<sr[2]+r&&q[1]>sr[1]-r&&q[1]<sr[3]+r);
  const rings=[];for(let k=levels.length-1;k>=0;k--){for(const lp of iso(fd,levels[k],ctx.tol)){if(ctx.feat.kind==='profile'&&!inStock(lp))continue;rings.push({L:levels[k],lp});}}
  if(!rings.length){W.push('nothing');return;}
  const R=op.zTop+ctx.retract,ang=(op.ramp||2)*D2R;let zPrev=op.zTop;
  for(const z of layers(op.zTop,op.zBot,op.doc)){
    const cut=[];let pos=null;
    // order: deepest level first, nearest neighbour within level groups
    const todo=rings.slice();
    while(todo.length){
      let bi=0;if(pos){const Lmax=Math.max(...todo.map(t=>t.L));let bd=1e18;todo.forEach((t,i)=>{if(t.L<Lmax-1e-9)return;const d=Math.min(...t.lp.map(q=>dist(q,pos)));if(d<bd){bd=d;bi=i;}});}
      const it=todo.splice(bi,1)[0];let lp=pos?rotateTo(it.lp,pos):it.lp;
      const enclosesCut=cut.some(c=>pip(c[0],lp));
      const ck=op.corner==null?0.6:op.corner;
      if(pos&&enclosesCut&&dist(pos,lp[0])<r*4&&lineSafe(fd,pos,lp[0],it.L)){mb.feed(lp[0][0],lp[0][1],z,op.feed);cutLoopFrom(mb,lp,0,z,op.feed,r,ck);}
      else{const zs=Math.min(R,zPrev+0.02);let done=false;
        if(op.entry==='helix'){if(!it.hx)it.hx=localMax(fd,it.lp);const rh=Math.min(r*0.8,it.hx.v-(r+leave)-0.003);
          if(rh>=Math.max(0.12*r,0.008)){const c=it.hx.c;lp=rotateTo(it.lp,c);mb.retract(pos?R:ctx.clear);mb.rapid(c[0]+rh,c[1]);mb.rapid(null,null,zs);helixAt(mb,c,rh,zs,z,ang,op.plunge>op.feed*0.5?op.plunge:op.feed*0.6);mb.feed(lp[0][0],lp[0][1],z,op.feed);cutLoopFrom(mb,lp,0,z,op.feed,r,ck);done=true;}}
        if(!done&&op.entry==='plunge'){mb.retract(pos?R:ctx.clear);mb.rapid(lp[0][0],lp[0][1]);mb.rapid(null,null,zs);mb.feed(null,null,z,op.plunge);cutLoopFrom(mb,lp,0,z,op.feed,r,ck);done=true;}
        if(!done){mb.retract(pos?R:ctx.clear);mb.rapid(lp[0][0],lp[0][1]);mb.rapid(null,null,zs);const si=rampLoop(mb,lp,zs,z,ang,op.feed,op.plunge);cutLoopFrom(mb,lp,si,z,op.feed,r,ck);lp=lp.slice(si).concat(lp.slice(0,si));}}
      cut.push(lp);pos=lp[0];
    }
    mb.retract(R);zPrev=z;
  }
  mb.retract(ctx.clear);
}
function contourRings(ctx,L){const loops=regionLoops(ctx.feat,ctx,ctx.tool.dia+L+0.2);const fd=makeField(loops,Math.min(fieldH(loops,ctx.tool.dia/2),Math.max(L/2.5,0.002)));return{fd,rings:iso(fd,L,ctx.tol)};}
function ringsFor(ctx,L){let{fd,rings}=contourRings(ctx,L);
  if(ctx.feat.kind==='profile'){const lp=ctx.feat.loop;const dl=q=>{let b=1e18;for(let i=0;i<lp.length;i++){const a=lp[i],c=lp[(i+1)%lp.length],dx=c[0]-a[0],dy=c[1]-a[1],l=dx*dx+dy*dy;let t=l?((q[0]-a[0])*dx+(q[1]-a[1])*dy)/l:0;t=t<0?0:t>1?1:t;b=Math.min(b,hyp(q[0]-a[0]-t*dx,q[1]-a[1]-t*dy));}return b;};rings=rings.filter(r=>Math.abs(dl(r[0])-L)<fd.h*2+1e-3);}
  return{fd,rings};}
function genContour(op,ctx,mb,W,L,zList){
  let{fd,rings}=ringsFor(ctx,L);
  if(!rings.length){W.push('tooBig');return;}
  const R=op.zTop+ctx.retract;
  for(const lp0 of rings){
    // start mid of longest segment
    let li=0,ll=-1;for(let i=0;i<lp0.length;i++){const d=dist(lp0[i],lp0[(i+1)%lp0.length]);if(d>ll){ll=d;li=i;}}
    const A=lp0[li],B=lp0[(li+1)%lp0.length],m=[(A[0]+B[0])/2,(A[1]+B[1])/2],dx=(B[0]-A[0])/ll,dy=(B[1]-A[1])/ll;
    const lp=[m].concat(lp0.slice(li+1),lp0.slice(0,li+1));
    const r=ctx.tool.dia/2,ck=op.corner==null?0.6:op.corner,ok=p=>fd.signed(p[0],p[1])>=L-1e-4;
    const segOk=(a,b)=>{for(let i=0;i<=8;i++){const t=i/8;if(!ok([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]))return false;}return true;};
    const LR0=op.leadR>0?op.leadR:Math.max(0.03,ctx.tool.dia*0.3),LL0=op.leadL>0?op.leadL:LR0;
    const mIn=op.lead||'arc',mOut=!op.leadOut||op.leadOut==='same'?mIn:op.leadOut;
    // overlap: walk past the start point along the loop
    const ov=Math.max(0,op.overlap||0);let ovPts=[],e=m,te=[dx,dy];
    if(ov>1e-6){let left=ov,cur=m;for(let k=1;k<=lp.length&&left>1e-9;k++){const nx_=lp[k%lp.length],d=dist(cur,nx_);if(d<1e-9){cur=nx_;continue;}const u=[(nx_[0]-cur[0])/d,(nx_[1]-cur[1])/d];if(d>=left){cur=[cur[0]+u[0]*left,cur[1]+u[1]*left];te=u;ovPts.push(cur);left=0;break;}ovPts.push(nx_);te=u;left-=d;cur=nx_;}e=cur;}
    // build a lead at point q with tangent t; dir=-1 lead-in (path ends at q), +1 lead-out (path starts at q)
    const mkLead=(mode,q,t,dir)=>{const nl=[-t[1],t[0]];
      for(const sc of[1,0.6,0.35,0.2]){const R_=LR0*sc,L_=LL0*sc;
        if(mode==='arc'||mode==='linearc'){const cc=[q[0]+nl[0]*R_,q[1]+nl[1]*R_],far=[cc[0]+dir*t[0]*R_,cc[1]+dir*t[1]*R_],mid=[cc[0]+(dir*t[0]-nl[0])*R_*0.7071,cc[1]+(dir*t[1]-nl[1])*R_*0.7071];
          if(ok(far)&&ok(mid)&&ok(cc)){if(mode==='arc')return{k:'arc',far,cc,R:R_};const lf=[far[0]+nl[0]*L_,far[1]+nl[1]*L_];if(segOk(far,lf))return{k:'linearc',far,cc,lf,R:R_};}}
        if(mode==='tline'){const lf=[q[0]+dir*t[0]*L_,q[1]+dir*t[1]*L_];if(segOk(q,lf)&&ok(lf))return{k:'line',lf};}
        if(mode==='line'||((mode==='arc'||mode==='linearc')&&sc===0.2)){const lf=[q[0]+nl[0]*L_,q[1]+nl[1]*L_];if(segOk(q,lf))return{k:'line',lf};}}
      return{k:'none'};};
    const LI=mIn==='none'?{k:'none'}:mkLead(mIn,m,[dx,dy],-1),LO=mOut==='none'?{k:'none'}:mkLead(mOut,e,te,1);
    const sp=LI.k==='linearc'?LI.lf:LI.k==='arc'?LI.far:LI.k==='line'?LI.lf:m,ep=LO.k==='linearc'?LO.lf:LO.k==='arc'?LO.far:LO.k==='line'?LO.lf:e;
    const ramp=op.leadEntry==='ramp'&&LI.k!=='none';
    if((mIn!=='none'&&LI.k==='none')||(mOut!=='none'&&LO.k==='none'))W.push('leadNone');
    mb.retract(ctx.clear);mb.rapid(sp[0],sp[1]);mb.rapid(null,null,R);
    const tb=op.tabs&&op.tabs.pts&&op.tabs.pts.length?op.tabs:null;let zPrev=op.zTop,here=sp;
    for(const z of zList){
      if(dist(here,sp)>1e-6){if(segOk(here,sp))mb.feed(sp[0],sp[1],mb.p[2],op.feed);else{mb.retract(R);mb.rapid(sp[0],sp[1]);}}
      const zs=ramp?Math.max(z,zPrev):z;mb.feed(sp[0],sp[1],zs,op.plunge);
      if(LI.k==='linearc'){mb.feed(LI.far[0],LI.far[1],z,ramp?op.plunge:op.feed);mb.arc(3,m[0],m[1],z,LI.cc[0],LI.cc[1],op.feed);}
      else if(LI.k==='arc'){mb.arc(3,m[0],m[1],z,LI.cc[0],LI.cc[1],ramp?op.plunge:op.feed);}
      else if(LI.k==='line'){mb.feed(m[0],m[1],z,ramp?op.plunge:op.feed);}
      cutLoopFrom(mb,lp,0,z,op.feed,r,ck,tb);for(const q of ovPts)mb.feed(q[0],q[1],z,op.feed);
      if(LO.k==='arc'||LO.k==='linearc'){mb.arc(3,LO.far[0],LO.far[1],z,LO.cc[0],LO.cc[1],op.feed);if(LO.k==='linearc')mb.feed(LO.lf[0],LO.lf[1],z,op.feed);}
      else if(LO.k==='line')mb.feed(LO.lf[0],LO.lf[1],z,op.feed);
      here=ep;zPrev=z;
      if(LO.k==='none'||LI.k==='none'){mb.retract(R);here=null;mb.rapid(sp[0],sp[1]);here=sp;}}
    mb.retract(R);
  }
  mb.retract(ctx.clear);
}
function nnOrder(pts,start){const o=[],left=pts.slice();let p=start||[0,0];while(left.length){let bi=0,bd=1e18;left.forEach((q,i)=>{const d=dist(q,p);if(d<bd){bd=d;bi=i;}});p=left.splice(bi,1)[0];o.push(p);}return o;}
function genHoles(op,ctx,mb,W){
  const tl=ctx.tool,f=ctx.feat;if(f.kind!=='holes'){W.push('feature');return;}
  const pts=nnOrder(f.pts,mb.p);const R=op.zTop+ctx.retract;
  if(op.type==='circ'||op.type==='chamferHole'){
    const rh=f.dia/2;
    for(const p of pts){
      mb.retract(ctx.clear);
      if(op.type==='chamferHole'){
        const a=(tl.tipAngle||90)/2*D2R,c=op.chamfer||0.02,e=Math.min(0.02,c),rho=(tl.tipDia||0)/2+e*Math.tan(a),zc=-(c/Math.tan(a)+e)+op.zTop,rr=rh-rho;
        if(rr<0.005){const zp=op.zTop-((rh+c)/Math.tan(a)-(tl.tipDia||0)/2/Math.tan(a));mb.rapid(p[0],p[1]);mb.rapid(null,null,R);mb.feed(null,null,zp,op.plunge);mb.rapid(null,null,R);}
        else{mb.rapid(p[0],p[1]);mb.rapid(null,null,R);mb.feed(null,null,zc,op.plunge);mb.feed(p[0]+rr,p[1],zc,op.feed);mb.circle(3,p[0],p[1],zc,zc,op.feed);mb.feed(p[0],p[1],zc,op.feed);mb.rapid(null,null,R);}
        continue;}
      const r=tl.dia/2,rf=rh-r-(op.leave||0);if(rf<0.002){W.push('tooBig');return;}
      const ri=rf<=r*0.9?rf:Math.min(rf,r*0.5);const rad=[ri];const st=Math.max(op.woc||r*0.5,0.005);while(rad[rad.length-1]<rf-1e-6)rad.push(Math.min(rf,rad[rad.length-1]+st));
      const ang=(op.ramp||2)*D2R;let zp=op.zTop;
      mb.rapid(p[0]+ri,p[1]);mb.rapid(null,null,R);mb.feed(null,null,op.zTop+0.02,op.plunge);
      for(const z of layers(op.zTop,op.zBot,op.doc)){
        mb.feed(p[0]+ri,p[1],null,op.feed);
        const pitch=TAU*ri*Math.tan(ang),turns=Math.max(1,Math.ceil((zp+0.02-z)/Math.max(pitch,1e-4)));let zc=mb.p[2];const dz=(zc-z)/turns;
        for(let t=0;t<turns;t++){mb.circle(3,p[0],p[1],zc,zc-dz,op.feed);zc-=dz;}
        mb.circle(3,p[0],p[1],z,z,op.feed);
        for(let k=1;k<rad.length;k++){mb.feed(p[0]+rad[k],p[1],z,op.feed);mb.circle(3,p[0],p[1],z,z,op.feed);}
        mb.feed(p[0]+ri,p[1],z,op.feed);zp=z;}
      mb.feed(p[0],p[1],null,op.feed);mb.rapid(null,null,R);}
    mb.retract(ctx.clear);return;}
  // canned cycles
  const map={spot:op.cycle==='G82'?'G82':'G81',drill:op.cycle||(op.peck>0?'G83':'G81'),tap:'G84',ream:'G85',bore:op.cycle==='G86'?'G86':'G85'};
  mb.retract(ctx.clear);mb.rapid(pts[0][0],pts[0][1]);
  const k=map[op.type];mb.cycle({kind:k,pts,z:op.zBot,r:R,q:(k==='G83'||k==='G73')?(op.peck||ctx.tool.dia):0,p:(k==='G82'||k==='G86')?(op.dwell||0.2):0,f:op.feed,clear:ctx.clear,pitch:ctx.tool.pitch,s:op.rpm});
  mb.p=[pts[pts.length-1][0],pts[pts.length-1][1],ctx.clear];
}
function genSlot(op,ctx,mb,W){
  const f=ctx.feat;if(f.kind!=='slot'){W.push('feature');return;}
  const tl=ctx.tool,r=tl.dia/2,path=f.path,R=op.zTop+ctx.retract,width=op.width||tl.dia;
  if(width>tl.dia+0.001){ // trochoidal
    const rt=(width-tl.dia)/2,adv=Math.max(op.woc||r*0.2,0.003);
    const tot=perim(path,false),pts=[];const at=s=>{let acc=0;for(let i=0;i<path.length-1;i++){const l=dist(path[i],path[i+1]);if(acc+l>=s||i===path.length-2){const t=l?Math.min(1,(s-acc)/l):0;return{p:[path[i][0]+(path[i+1][0]-path[i][0])*t,path[i][1]+(path[i+1][1]-path[i][1])*t],d:[(path[i+1][0]-path[i][0])/l,(path[i+1][1]-path[i][1])/l]};}acc+=l;}};
    const loops=Math.ceil(tot/adv),N=24;for(let k=0;k<=loops*N;k++){const s=Math.min(tot,adv*k/N),a=at(s),ph=TAU*k/N;const T=a.d,Nn=[-T[1],T[0]];pts.push([a.p[0]+rt*(Math.sin(ph)*T[0]+Math.cos(ph)*Nn[0]),a.p[1]+rt*(Math.sin(ph)*T[1]+Math.cos(ph)*Nn[1])]);}
    mb.retract(ctx.clear);mb.rapid(pts[0][0],pts[0][1]);mb.rapid(null,null,R);
    let zp=op.zTop;for(const z of layers(op.zTop,op.zBot,op.doc)){const c=path[0],a=at(0);mb.feed(pts[0][0],pts[0][1],zp+0.02,op.plunge);
      const turns=Math.max(1,Math.ceil((zp+0.02-z)/Math.max(TAU*rt*Math.tan((op.ramp||2)*D2R),1e-4)));let zc=zp+0.02;for(let t=0;t<turns;t++){mb.circle(2,c[0],c[1],zc,zc-(zp+0.02-z)/turns,op.feed);zc-=(zp+0.02-z)/turns;}
      for(const q of pts)mb.feed(q[0],q[1],z,op.feed);mb.rapid(null,null,R);mb.rapid(pts[0][0],pts[0][1]);zp=z;}
    mb.retract(ctx.clear);return;}
  mb.retract(ctx.clear);mb.rapid(path[0][0],path[0][1]);mb.rapid(null,null,R);let fwd=true,zp=op.zTop;
  for(const z of layers(op.zTop,op.zBot,op.doc)){const P=fwd?path:path.slice().reverse();const tot=perim(P,false),need=(zp-z)/Math.tan((op.ramp||3)*D2R);
    if(tot>=need&&need>0){let acc=0;for(let i=1;i<P.length;i++){acc+=dist(P[i-1],P[i]);if(acc>=need){mb.feed(P[i][0],P[i][1],z,op.feed);break;}mb.feed(P[i][0],P[i][1],zp-(zp-z)*acc/need,op.feed);}
      const Q=P.slice().reverse();for(const q of Q)mb.feed(q[0],q[1],z,op.feed);for(const q of P)mb.feed(q[0],q[1],z,op.feed);}
    else{mb.feed(null,null,z,op.plunge);for(const q of P)mb.feed(q[0],q[1],z,op.feed);fwd=!fwd;}
    zp=z;}
  mb.retract(ctx.clear);
}
function genFace(op,ctx,mb){
  const s=ctx.stockRect,r=ctx.tool.dia/2,step=Math.max(op.woc||r,0.01),x0=s[0]-r-0.1,x1=s[2]+r+0.1,ya=s[3]-r*0.5,yb=s[1]+r*0.5;
  const n=Math.max(1,Math.ceil((ya-yb)/step)),rows=[];for(let i=0;i<=n;i++)rows.push(n?ya-(ya-yb)*i/n:(ya+yb)/2);
  let zp=op.zTop;for(const z of layers(op.zTop,op.zBot,op.doc)){let fwd=true;mb.retract(ctx.clear);mb.rapid(x0,rows[0]);mb.rapid(null,null,z+0.1);mb.feed(null,null,z,op.plunge);
    for(const y of rows){mb.feed(fwd?x0:x1,y,z,op.feed);mb.feed(fwd?x1:x0,y,z,op.feed);fwd=!fwd;}mb.retract(z+0.1);}
  mb.retract(ctx.clear);
}
/* ---------- 4th axis (A around X, Z0 on rotary centerline) ---------- */
function mvA(mb,x,z,a,f,R){const p=mb.p,da=(a-(mb.a??a))*Math.PI/180*R,d=Math.max(1e-5,hyp(x-p[0],da,z-p[2]));mb.o.push({g:1,x,y:0,z,a,f:+(f/d).toFixed(4),inv:true});mb.p=[x,0,z];mb.a=a;}
function rapidA(mb,x,z,a){mb.o.push({g:0,x:x??mb.p[0],y:0,z:z??mb.p[2],a:a??mb.a??0});mb.p=[x??mb.p[0],0,z??mb.p[2]];if(a!=null)mb.a=a;}
function genWrap(op,ctx,mb,W){
  const D=Math.max(op.wrapD||1,0.05),R=D/2,f=ctx.feat,toA=y=>y/(Math.PI*D)*360,zc=R+0.25;const paths=[];
  if(f.kind==='slot')paths.push({p:f.path,c:false});else if(f.loop){paths.push({p:f.loop,c:true});(f.islands||[]).forEach(l=>paths.push({p:l,c:true}));}
  else if(f.kind==='holes'){for(const q of f.pts){rapidA(mb,null,zc,null);rapidA(mb,q[0],zc,toA(q[1]));mb.cycle({kind:'G81',pts:[[q[0],0]],z:R+op.zBot,r:R+0.1,q:0,p:0,f:op.feed,clear:zc});mb.p=[q[0],0,zc];}return;}
  for(const P of paths){const pts=P.c?P.p.concat([P.p[0]]):P.p;
    for(const zl of layers(0,op.zBot,op.doc)){const z=R+zl;rapidA(mb,null,zc,null);rapidA(mb,pts[0][0],zc,toA(pts[0][1]));rapidA(mb,null,R+0.1,null);mvA(mb,pts[0][0],z,toA(pts[0][1]),op.plunge,R);
      for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],n=Math.max(1,Math.ceil(Math.abs(toA(b[1])-toA(a[1]))/2));for(let k=1;k<=n;k++){const t_=k/n;mvA(mb,a[0]+(b[0]-a[0])*t_,z,toA(a[1]+(b[1]-a[1])*t_),op.feed,R);}}
      rapidA(mb,null,zc,null);}}
}
function genRotRough(op,ctx,mb,W){
  const R0=(op.d0||1)/2,R1=(op.d1||0.75)/2,r=ctx.tool.dia/2,x0=Math.min(op.x0??0,op.x1??1)-r-0.05,x1=Math.max(op.x0??0,op.x1??1)+r+0.05,step=Math.max(op.woc||r*0.5,0.005),zc=R0+0.25;
  if(R1>=R0){W.push('nothing');return;}let a=0,fwd=true;rapidA(mb,null,zc,0);
  for(const dz of layers(R0,R1+(op.leave||0),op.doc)){const z=dz;const xs=fwd?x0:x1,xe=fwd?x1:x0;rapidA(mb,xs,zc,null);rapidA(mb,null,R0+0.1,null);mvA(mb,xs,z,a,op.plunge,R0);
    const turns=Math.abs(xe-xs)/step,nseg=Math.max(8,Math.ceil(turns*36));for(let k=1;k<=nseg;k++){const t_=k/nseg;mvA(mb,xs+(xe-xs)*t_,z,+(a+turns*360*t_).toFixed(3),op.feed,z);}a=+(a+turns*360).toFixed(3);fwd=!fwd;rapidA(mb,null,zc,null);}
}
/* ---------- 5 axis: draft-wall swarf with TCPC (table-table B/C) ---------- */
function genSwarf(op,ctx,mb,W){
  const th=(op.tilt||5)*D2R,L=ctx.tool.dia/2+(op.leave||0);const{rings}=ringsFor(ctx,L);if(!rings.length){W.push('tooBig');return;}
  const lp=rings;
  for(const ring of lp){const n=ring.length;let cPrev=null;const R=op.zTop+ctx.retract;const pts=[];
    for(let i=0;i<=n;i++){const a=ring[(i-1+n)%n],b=ring[i%n],c=ring[(i+1)%n];let dx=c[0]-a[0],dy=c[1]-a[1];const l=hyp(dx,dy)||1;dx/=l;dy/=l;const nx=-dy,ny=dx;// toward tool side (left)
      let C=-Math.atan2(ny,nx)/D2R;if(cPrev!=null){while(C-cPrev>180)C-=360;while(C-cPrev<-180)C+=360;}cPrev=C;pts.push([b[0],b[1],C]);}
    mb.retract(ctx.clear);mb.o.push({t:'tcpc',on:true,h:ctx.tool.num||1});mb.o.push({g:0,x:pts[0][0],y:pts[0][1],z:ctx.clear,b:+(th/D2R).toFixed(3),c:+pts[0][2].toFixed(3)});mb.p=[pts[0][0],pts[0][1],ctx.clear];
    mb.rapid(null,null,R);mb.feed(null,null,op.zBot,op.plunge);
    for(const q of pts){mb.o.push({g:1,x:q[0],y:q[1],z:op.zBot,b:+(th/D2R).toFixed(3),c:+q[2].toFixed(3),f:op.feed});mb.p=[q[0],q[1],op.zBot];}
    mb.rapid(null,null,ctx.clear);mb.o.push({t:'tcpc',on:false});}
}
/* ---------- 3D from mesh: heightmap, drop-cutter ---------- */
function meshHeightmap(T,sc,dx,dy,zTop,floor,res){
  let b=[1e18,1e18,-1e18,-1e18];for(const t of T)for(let k=0;k<9;k+=3)bbox([[t[k]*sc+dx,t[k+1]*sc+dy]],b);
  const pad=res*2,x0=b[0]-pad,y0=b[1]-pad,nx=Math.ceil((b[2]-b[0]+2*pad)/res)+1,ny=Math.ceil((b[3]-b[1]+2*pad)/res)+1,h=new Float32Array(nx*ny).fill(floor);
  for(const t of T){const P=[[t[0]*sc+dx,t[1]*sc+dy,t[2]*sc-zTop],[t[3]*sc+dx,t[4]*sc+dy,t[5]*sc-zTop],[t[6]*sc+dx,t[7]*sc+dy,t[8]*sc-zTop]];
    const i0=Math.max(0,Math.floor((Math.min(P[0][0],P[1][0],P[2][0])-x0)/res)),i1=Math.min(nx-1,Math.ceil((Math.max(P[0][0],P[1][0],P[2][0])-x0)/res)),j0=Math.max(0,Math.floor((Math.min(P[0][1],P[1][1],P[2][1])-y0)/res)),j1=Math.min(ny-1,Math.ceil((Math.max(P[0][1],P[1][1],P[2][1])-y0)/res));
    const d=(P[1][1]-P[2][1])*(P[0][0]-P[2][0])+(P[2][0]-P[1][0])*(P[0][1]-P[2][1]);if(Math.abs(d)<1e-14){for(const q of P){const i=Math.round((q[0]-x0)/res),j=Math.round((q[1]-y0)/res);if(i>=0&&j>=0&&i<nx&&j<ny&&q[2]>h[j*nx+i])h[j*nx+i]=q[2];}continue;}
    for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const x=x0+i*res,y=y0+j*res;const l1=((P[1][1]-P[2][1])*(x-P[2][0])+(P[2][0]-P[1][0])*(y-P[2][1]))/d,l2=((P[2][1]-P[0][1])*(x-P[2][0])+(P[0][0]-P[2][0])*(y-P[2][1]))/d,l3=1-l1-l2;
      if(l1<-1e-6||l2<-1e-6||l3<-1e-6)continue;const z=l1*P[0][2]+l2*P[1][2]+l3*P[2][2];const k=j*nx+i;if(z>h[k])h[k]=z;}}
  return{h,nx,ny,x0,y0,res};}
function clMap(hm,tool,leave){const{h,nx,ny,res}=hm,r=tool.dia/2,n=Math.ceil(r/res),K=[];for(let j=-n;j<=n;j++)for(let i=-n;i<=n;i++){const d=hyp(i,j)*res;if(d>r)continue;let z=0;if(tool.type==='ball')z=r-Math.sqrt(Math.max(0,r*r-d*d));else if(tool.type==='bull'){const c=tool.cornerR||0.03;z=d>r-c?c-Math.sqrt(Math.max(0,c*c-(d-(r-c))**2)):0;}K.push(j,i,z);}
  const cl=new Float32Array(nx*ny);for(let j=0;j<ny;j++)for(let i=0;i<nx;i++){let m=-1e9;for(let q=0;q<K.length;q+=3){const jj=j+K[q],ii=i+K[q+1];if(jj<0||ii<0||jj>=ny||ii>=nx)continue;const v=h[jj*nx+ii]-K[q+2];if(v>m)m=v;}cl[j*nx+i]=m+(leave||0);}return cl;}
function gen3D(op,ctx,mb,W){
  const hm=ctx.hm;if(!hm){W.push('mesh');return;}const tl=ctx.tool,cl=clMap(hm,tl,op.leave||0),{nx,ny,x0,y0,res}=hm,step=Math.max(op.woc||tl.dia*0.15,res);
  const sr=ctx.stockRect,r=tl.dia/2,xa=Math.max(x0,sr[0]-r),xb=Math.min(x0+(nx-1)*res,sr[2]+r),ya=Math.max(y0,sr[1]-r*0.5),yb=Math.min(y0+(ny-1)*res,sr[3]+r*0.5);
  const CL=(x,y)=>{const i=Math.min(nx-1,Math.max(0,Math.round((x-x0)/res))),j=Math.min(ny-1,Math.max(0,Math.round((y-y0)/res)));return Math.max(cl[j*nx+i],op.zBot);};
  const rows=[];for(let y=ya;y<=yb+1e-9;y+=step)rows.push(y);const R=op.zTop+ctx.retract;
  if(op.type==='surfFinish'){let fwd=true;mb.retract(ctx.clear);
    for(const y of rows){const xs=[];for(let x=xa;x<=xb+1e-9;x+=res)xs.push(x);if(!fwd)xs.reverse();let pts=xs.map(x=>[x,CL(x,y)]);pts=rdp(pts,0.0004);
      if(mb.p[2]>=ctx.clear-1e-6){mb.rapid(pts[0][0],y);mb.rapid(null,null,pts[0][1]+0.1);mb.feed(null,null,pts[0][1],op.plunge);}else{mb.feed(pts[0][0],y,Math.max(pts[0][1],mb.p[2]),op.feed);mb.feed(null,null,pts[0][1],op.feed);}
      for(const q of pts)mb.feed(q[0],y,q[1],op.feed);fwd=!fwd;}
    mb.retract(ctx.clear);return;}
  // z-level raster roughing
  for(const z of layers(op.zTop,op.zBot,op.doc)){let fwd=true;
    for(const y of rows){const runs=[];let s=null;for(let x=xa;x<=xb+1e-9;x+=res){const ok=CL(x,y)<=z+1e-6;if(ok&&s==null)s=x;if(!ok&&s!=null){runs.push([s,x-res]);s=null;}}if(s!=null)runs.push([s,xb]);
      const rr=fwd?runs:runs.slice().reverse().map(q=>[q[1],q[0]]);
      for(const q of rr){if(Math.abs(q[1]-q[0])<res)continue;mb.retract(R);mb.rapid(q[0],y);mb.rapid(null,null,Math.max(z,zp)+0.05);mb.feed(null,null,z,op.plunge);mb.feed(q[1],y,z,op.feed);}fwd=!fwd;}
    mb.retract(R);zp=z;}
  mb.retract(ctx.clear);}

/* ---------- extra 2.5D strategies ---------- */
function edt2d(mask,nx,ny){// distance (cells) to nearest mask=1
  const f=new Float64Array(nx*ny);for(let k=0;k<f.length;k++)f[k]=mask[k]?0:1e20;const mx=Math.max(nx,ny),v=new Int32Array(mx),z=new Float64Array(mx+1),tmp=new Float64Array(mx),out=new Float64Array(mx);
  function e1(n){let k=0;v[0]=0;z[0]=-1e300;z[1]=1e300;for(let q=1;q<n;q++){let s=((tmp[q]+q*q)-(tmp[v[k]]+v[k]*v[k]))/(2*q-2*v[k]);while(s<=z[k]){k--;s=((tmp[q]+q*q)-(tmp[v[k]]+v[k]*v[k]))/(2*q-2*v[k]);}k++;v[k]=q;z[k]=s;z[k+1]=1e300;}k=0;for(let q=0;q<n;q++){while(z[k+1]<q)k++;out[q]=(q-v[k])*(q-v[k])+tmp[v[k]];}}
  for(let i=0;i<nx;i++){for(let j=0;j<ny;j++)tmp[j]=f[j*nx+i];e1(ny);for(let j=0;j<ny;j++)f[j*nx+i]=out[j];}
  for(let j=0;j<ny;j++){for(let i=0;i<nx;i++)tmp[i]=f[j*nx+i];e1(nx);for(let i=0;i<nx;i++)f[j*nx+i]=Math.sqrt(out[i]);}return f;}
function genZigzag(op,ctx,mb,W){
  const tl=ctx.tool,r=tl.dia/2,L=r+(op.leave||0),step=Math.min(Math.max(op.woc,r*0.1),r*1.6);const loops=regionLoops(ctx.feat,ctx,tl.dia+0.1);if(!loops){W.push('feature');return;}
  const fd=makeField(loops,fieldH(loops,r));if(fd.fmax<=L){W.push('tooBig');return;}const R=op.zTop+ctx.retract;const b=bbox(loops[0]);
  const rows=[];for(let y=b[1]+L;y<=b[3]-L+1e-9;y+=step)rows.push(y);
  for(const z of layers(op.zTop,op.zBot,op.doc)){let fwd=true,pos=null;
    for(const y of rows){const runs=[];let s=null;for(let x=b[0];x<=b[2]+1e-9;x+=fd.h*0.5){const ok=fd.sample(x,y)>=L;if(ok&&s==null)s=x;if(!ok&&s!=null){runs.push([s,x-fd.h*0.5]);s=null;}}if(s!=null)runs.push([s,b[2]]);
      const rr=fwd?runs:runs.slice().reverse().map(q=>[q[1],q[0]]);
      for(const q of rr){const a=[q[0],y],c=[q[1],y];if(pos&&dist(pos,a)<step*2.5&&lineSafe(fd,pos,a,L))mb.feed(a[0],a[1],z,op.feed);else{mb.retract(R);mb.rapid(a[0],a[1]);mb.rapid(null,null,z+0.05);mb.feed(null,null,z,op.plunge);}mb.feed(c[0],c[1],z,op.feed);pos=c;}fwd=!fwd;}
    // cleanup ring
    for(const lp of iso(fd,L,ctx.tol)){mb.retract(R);mb.rapid(lp[0][0],lp[0][1]);mb.rapid(null,null,z+0.05);mb.feed(null,null,z,op.plunge);cutLoopFrom(mb,lp,0,z,op.feed,r,op.corner==null?0.6:op.corner);}
    mb.retract(R);}
  mb.retract(ctx.clear);}
function genRest(op,ctx,mb,W){
  const tl=ctx.tool,r=tl.dia/2,rb=Math.max((op.refDia||tl.dia*2)/2,r*1.01),leave=op.leave||0;const loops=regionLoops(ctx.feat,ctx,rb*2+0.1);if(!loops){W.push('feature');return;}
  const fd=makeField(loops,Math.min(fieldH(loops,r),r/2.5));const{F,nx,ny,h}=fd;const mask=new Uint8Array(nx*ny);for(let k=0;k<mask.length;k++)mask[k]=F[k]>=rb+leave?1:0;
  const DB=edt2d(mask,nx,ny);const remain=(x,y)=>{const i=Math.round((x-fd.x0)/h),j=Math.round((y-fd.y0)/h);if(i<0||j<0||i>=nx||j>=ny)return false;return DB[j*nx+i]*h>rb-r+h;};
  const R=op.zTop+ctx.retract,step=Math.max(op.woc||r*0.4,0.003),segs=[];
  for(let L=r+leave;L<rb+leave+1e-9;L+=step){for(const lp of iso(fd,L,ctx.tol)){let cur=[];const n=lp.length;for(let i=0;i<=n;i++){const q=lp[i%n];if(remain(q[0],q[1]))cur.push(q);else{if(cur.length>1)segs.push(cur);cur=[];}}if(cur.length>1)segs.push(cur);}}
  if(!segs.length){W.push('nothing');return;}
  for(const z of layers(op.zTop,op.zBot,op.doc)){for(const sg of segs){mb.retract(R);mb.rapid(sg[0][0],sg[0][1]);mb.rapid(null,null,z+0.05);mb.feed(null,null,z,op.plunge);for(const q of sg)mb.feed(q[0],q[1],z,op.feed);}mb.retract(R);}
  mb.retract(ctx.clear);}
function genVcarve(op,ctx,mb,W){
  const tl=ctx.tool,a=(tl.tipAngle||90)/2*D2R,tr=(tl.tipDia||0)/2,maxD=Math.abs(op.zBot-op.zTop)||0.25,loops=regionLoops(ctx.feat,ctx,0.2);if(!loops){W.push('feature');return;}
  const step=Math.max(op.woc||0.01,0.002),Lmax=tr+maxD*Math.tan(a);const fd=makeField(loops,Math.min(fieldH(loops,0.05),step));const R=op.zTop+ctx.retract;
  for(let L=Math.max(0.002,step*0.5);L<Math.min(fd.fmax,Lmax+step*20)-1e-6;L+=step){const z=op.zTop-Math.min(maxD,Math.max(0,(L-tr))/Math.tan(a));
    for(const lp of iso(fd,L,ctx.tol)){mb.retract(R);mb.rapid(lp[0][0],lp[0][1]);mb.rapid(null,null,z+0.02);mb.feed(null,null,z,op.plunge);cutLoopFrom(mb,lp,0,z,op.feed,0.01,1);}
    if(L>Lmax&&maxD>0&&L>Lmax+step*20)break;}
  mb.retract(ctx.clear);}
function genFlute(op,ctx,mb,W){
  const f=ctx.feat;if(f.kind!=='slot'){W.push('feature');return;}const P=f.path,tot=perim(P,false),rl=Math.min(op.rampLen||tot*0.25,tot/2),R=op.zTop+ctx.retract,D=Math.abs(op.zBot-op.zTop);
  const depthAt=s=>{const u=Math.min(1,s/rl,(tot-s)/rl);return op.zTop-D*(0.5-0.5*Math.cos(Math.PI*Math.max(0,u)));};
  for(const frac of layers(1,0,Math.max(0.05,(op.doc||D)/Math.max(D,1e-4)))){const k=1-frac;mb.retract(R);mb.rapid(P[0][0],P[0][1]);mb.rapid(null,null,op.zTop+0.02);let acc=0;
    for(let i=0;i<P.length;i++){if(i){const L=dist(P[i-1],P[i]),n=Math.max(1,Math.ceil(L/0.02));for(let j=1;j<=n;j++){const x=P[i-1][0]+(P[i][0]-P[i-1][0])*j/n,y=P[i-1][1]+(P[i][1]-P[i-1][1])*j/n;const s=acc+L*j/n;mb.feed(x,y,op.zTop+(depthAt(s)-op.zTop)*k,op.feed);}acc+=L;}else mb.feed(P[0][0],P[0][1],op.zTop,op.plunge);}mb.retract(R);}
  mb.retract(ctx.clear);}
function gen3Dextra(op,ctx,mb,W){
  const hm=ctx.hm;if(!hm){W.push('mesh');return;}const tl=ctx.tool,cl=clMap(hm,tl,op.leave||0),{nx,ny,x0,y0,res}=hm;const R=op.zTop+ctx.retract;
  const CLs=(x,y)=>{const fi=(x-x0)/res,fj=(y-y0)/res;let i=Math.floor(fi),j=Math.floor(fj);if(i<0||j<0||i>=nx-1||j>=ny-1)return op.zBot;const tx=fi-i,ty=fj-j,k=j*nx+i;return Math.max(op.zBot,cl[k]*(1-tx)*(1-ty)+cl[k+1]*tx*(1-ty)+cl[k+nx]*(1-tx)*ty+cl[k+nx+1]*tx*ty);};
  if(op.type==='surfWater'){const st=Math.max(op.doc||0.02,0.002);
    for(let z=op.zTop-st;z>=op.zBot-1e-9;z-=st){const F=new Float32Array(nx*ny);for(let k=0;k<F.length;k++)F[k]=z-Math.max(cl[k],op.zBot-1);
      const fd={F,nx,ny,x0,y0,h:res,nearest:(x,y)=>[x,y,0],sample:(x,y)=>z-CLs(x,y),signed:(x,y)=>z-CLs(x,y)};
      for(const lp of iso(fd,1e-4,0.0005)){if(perim(lp,true)<tl.dia*0.5)continue;mb.retract(R);mb.rapid(lp[0][0],lp[0][1]);mb.rapid(null,null,z+0.05);mb.feed(null,null,z,op.plunge);for(const q of lp.concat([lp[0]]))mb.feed(q[0],q[1],z,op.feed);}}
    mb.retract(ctx.clear);return;}
  const sr0=ctx.stockRect;
  if(op.type==='surfSpiral'){const cx=(sr0[0]+sr0[2])/2,cy=(sr0[1]+sr0[3])/2,Rm=Math.hypot(sr0[2]-sr0[0],sr0[3]-sr0[1])/2,st=Math.max(op.woc||tl.dia*0.12,0.004);let run=[];const flush=()=>{if(run.length>1){const red=rdp(run,0.0004);mb.retract(R);mb.rapid(red[0][0],red[0][1]);mb.rapid(null,null,red[0][2]+0.05);mb.feed(null,null,red[0][2],op.plunge);for(const q of red)mb.feed(q[0],q[1],q[2],op.feed);}run=[];};
    mb.retract(ctx.clear);for(let th=0;;){const rr=Rm-st*th/(2*Math.PI);if(rr<=0)break;const x=cx+rr*Math.cos(th),y=cy+rr*Math.sin(th);if(x<sr0[0]||x>sr0[2]||y<sr0[1]||y>sr0[3])flush();else run.push([x,y,CLs(x,y)]);th+=Math.max(0.002,res/Math.max(rr,res));}flush();mb.retract(ctx.clear);return;}
  if(op.type==='surfSteep'){const thr=Math.tan((op.steepAng||40)*D2R),slope=(x,y)=>{const e=res;return Math.hypot(CLs(x+e,y)-CLs(x-e,y),CLs(x,y+e)-CLs(x,y-e))/(2*e);};
    // shallow ground: parallel raster
    const st=Math.max(op.woc||tl.dia*0.12,0.004);let fwd=true;mb.retract(ctx.clear);
    for(let y=sr0[1];y<=sr0[3]+1e-9;y+=st){let run=[];const pts=[];for(let x=sr0[0];x<=sr0[2]+1e-9;x+=res)pts.push(x);if(!fwd)pts.reverse();
      const flush=()=>{if(run.length>1){const red=rdp(run,0.0004);mb.retract(R);mb.rapid(red[0][0],red[0][1]);mb.rapid(null,null,red[0][2]+0.05);mb.feed(null,null,red[0][2],op.plunge);for(const q of red)mb.feed(q[0],q[1],q[2],op.feed);}run=[];};
      for(const x of pts){if(slope(x,y)<thr)run.push([x,y,CLs(x,y)]);else flush();}flush();fwd=!fwd;}
    // steep walls: waterline pieces
    const sd=Math.max(op.doc||0.02,0.002);for(let z=op.zTop-sd;z>=op.zBot-1e-9;z-=sd){const F=new Float32Array(nx*ny);for(let k=0;k<F.length;k++)F[k]=z-Math.max(cl[k],op.zBot-1);const fd={F,nx,ny,x0,y0,h:res,nearest:(x,y)=>[x,y,0],sample:(x,y)=>z-CLs(x,y),signed:(x,y)=>z-CLs(x,y)};
      for(const lp of iso(fd,1e-4,0.0005)){if(perim(lp,true)<tl.dia*0.5)continue;let run=[];const flush=()=>{if(run.length>1){mb.retract(R);mb.rapid(run[0][0],run[0][1]);mb.rapid(null,null,z+0.05);mb.feed(null,null,z,op.plunge);for(const q of run)mb.feed(q[0],q[1],z,op.feed);}run=[];};
        for(const q of lp.concat([lp[0]])){if(slope(q[0],q[1])>=thr*0.9)run.push(q);else flush();}flush();}}
    mb.retract(ctx.clear);return;}
  // radial
  const sr=ctx.stockRect,cx=(sr[0]+sr[2])/2,cy=(sr[1]+sr[3])/2,Rm=Math.hypot(sr[2]-sr[0],sr[3]-sr[1])/2,n=Math.max(8,Math.ceil(2*Math.PI*Rm/Math.max(op.woc||tl.dia*0.15,0.005)));mb.retract(ctx.clear);
  for(let k=0;k<n;k++){const an=2*Math.PI*k/n,pts=[];for(let d=Rm;d>=0;d-=res){const x=cx+Math.cos(an)*d,y=cy+Math.sin(an)*d;if(x<sr[0]||x>sr[2]||y<sr[1]||y>sr[3])continue;pts.push([d,CLs(x,y),x,y]);}
    if(pts.length<2)continue;const red=rdp(pts.map(p=>[p[0],p[1]]),0.0004);mb.retract(R);const f0=red[0];mb.rapid(cx+Math.cos(an)*f0[0],cy+Math.sin(an)*f0[0]);mb.rapid(null,null,f0[1]+0.05);mb.feed(null,null,f0[1],op.plunge);
    for(const q of red)mb.feed(cx+Math.cos(an)*q[0],cy+Math.sin(an)*q[0],q[1],op.feed);}
  mb.retract(ctx.clear);}


/* ---------- thread milling (helical, internal or external) ---------- */
function genThread(op,ctx,mb,W){const tl=ctx.tool,f=ctx.feat;if(f.kind!=='holes'){W.push('feature');return;}
  const P=op.pitch||tl.pitch||0.05,maj=op.major||(f.dia+0.65*P*1.08),internal=op.ext!==true,depth=Math.abs(op.zBot-op.zTop),r=tl.dia/2,thr=0.6134*P;
  if(internal&&r>=maj/2-thr-0.003){W.push('tooBig');return;}const n=Math.max(1,Math.round(op.passes||(thr>0.03?3:2)));const R=op.zTop+ctx.retract;
  for(const p of nnOrder(f.pts,mb.p)){mb.retract(ctx.clear);mb.rapid(p[0],p[1]);mb.rapid(null,null,R);const zb=op.zBot;mb.feed(null,null,zb,op.plunge);
    for(let k=1;k<=n;k++){const rr=internal?(maj/2-thr+thr*k/n)-r:(maj/2-thr*k/n)+r;const turns=Math.ceil(depth/P)+1,dir=internal?3:2;
      // arc in, helix up (climb for right-hand internal = G03 bottom-up), arc out
      const ex=p[0]+rr,ey=p[1];mb.arc(dir,p[0]+rr/2,p[1]+(internal?-rr/2:rr/2),zb,p[0]+rr/4,p[1]+(internal?-rr/4:rr/4),op.feed*0.5);mb.feed(ex,ey,zb,op.feed*0.5);
      let z=zb;for(let t=0;t<turns;t++){for(let q=1;q<=4;q++){const a=q*Math.PI/2*(dir===3?1:-1);z=Math.min(op.zTop+P,z+P/4);mb.arc(dir,p[0]+Math.cos(a)*rr,p[1]+Math.sin(a)*rr,z,p[0],p[1],op.feed);}if(z>=op.zTop)break;}
      mb.feed(p[0],p[1],z,op.feed);mb.feed(null,null,zb,op.feed);}
    mb.feed(p[0],p[1],zb,op.feed);mb.rapid(null,null,R);}
  mb.retract(ctx.clear);}
/* ---------- probing (Renishaw Inspection Plus macros; Haas/Fanuc G65) ---------- */
function genProbe(op,ctx,mb,W){const f=ctx.feat,sr=ctx.stockRect,mode=op.find||'face',wo=Math.max(1,Math.min(6,op.wcs||1)),ap=op.approach||0.2,L=[];
  const S_=' S'+wo,tol=op.ptol?' T'+(+op.ptol).toFixed(4):'',stop=op.result==='report'?'':S_;let x=(sr[0]+sr[2])/2,y=(sr[1]+sr[3])/2,z=op.zTop||0;
  if(mode==='bore'||mode==='boss'){if(f.kind!=='holes'&&mode==='bore'){W.push('feature');return;}const p=f.kind==='holes'?f.pts[0]:[x,y];x=p[0];y=p[1];}
  else if(mode==='corner'){x=sr[0];y=sr[1];}
  const D=mode==='bore'?(f.dia||0.5):mode==='boss'?(op.bossD||1):0;
  mb.retract(ctx.clear);mb.rapid(mode==='corner'?x-ap:mode==='edgeX'?sr[0]-ap:x,mode==='corner'?y-ap:mode==='edgeY'?sr[1]-ap:y);
  L.push('G65 P9832 (PROBE ON)');const zp=mode==='face'?z+ap:mode==='bore'?z-Math.min(0.25,(op.depth||0.25)):z-(op.depth||0.2);
  L.push('G65 P9810 Z'+(mode==='face'||mode==='bore'?zp:z+ap).toFixed(4)+' F50. (PROTECTED MOVE)');
  if(mode==='face')L.push('G65 P9811 Z'+z.toFixed(4)+stop+tol+' (MEASURE TOP Z)');
  else if(mode==='edgeX'){L.push('G65 P9810 Z'+zp.toFixed(4)+' F50.');L.push('G65 P9811 X'+sr[0].toFixed(4)+stop+tol+' (MEASURE X EDGE)');}
  else if(mode==='edgeY'){L.push('G65 P9810 Z'+zp.toFixed(4)+' F50.');L.push('G65 P9811 Y'+sr[1].toFixed(4)+stop+tol+' (MEASURE Y EDGE)');}
  else if(mode==='corner'){L.push('G65 P9810 Z'+zp.toFixed(4)+' F50.');L.push('G65 P9815 X'+x.toFixed(4)+' Y'+y.toFixed(4)+' I'+(ap*2).toFixed(4)+' J'+(ap*2).toFixed(4)+stop+' (OUTSIDE CORNER)');}
  else if(mode==='bore')L.push('G65 P9814 D'+D.toFixed(4)+stop+tol+' (BORE CENTER)');
  else if(mode==='boss'){L.push('G65 P9814 D'+D.toFixed(4)+' Z'+zp.toFixed(4)+stop+tol+' (BOSS CENTER)');}
  L.push('G65 P9810 Z'+(z+1).toFixed(4)+' F50.');L.push('G65 P9833 (PROBE OFF)');if(op.result==='report')L.push('M00 (CHECK PROBE RESULT #100-#199)');
  mb.o.push({t:'raw',lines:L,probe:true});mb.retract(ctx.clear);}
/* ---------- T-slot / keyseat / dovetail: single-level side cut ---------- */
function genUndercut(op,ctx,mb,W){const f=ctx.feat,tl=ctx.tool;if(!['profile','pocket','island','open'].includes(f.kind)&&f.kind!=='holes'){W.push('feature');return;}
  if(f.kind==='holes'){const rh=f.dia/2,r=tl.dia/2,dep=op.width||0.1;if(rh<(tl.shank||tl.dia*0.5)/2+0.01){W.push('tooBig');return;}for(const p of nnOrder(f.pts,mb.p)){mb.retract(ctx.clear);mb.rapid(p[0],p[1]);mb.rapid(null,null,op.zTop+ctx.retract);mb.feed(null,null,op.zBot,op.plunge);const rr=rh-r+dep;mb.feed(p[0]+rr,p[1],op.zBot,op.feed*0.4);mb.circle(3,p[0],p[1],op.zBot,op.zBot,op.feed);mb.feed(p[0],p[1],op.zBot,op.feed);mb.rapid(null,null,op.zTop+ctx.retract);}mb.retract(ctx.clear);return;}
  genContour(op,ctx,mb,W,tl.dia/2-(op.width||0.1)+(op.leave||0),[op.zBot]);}
/* ---------- moulding: profile swept along an open rail ---------- */
function offsetPoly(P,d){const n=P.length,o=[];for(let i=0;i<n;i++){const a=P[Math.max(0,i-1)],b=P[i],c=P[Math.min(n-1,i+1)];let t1=[b[0]-a[0],b[1]-a[1]],t2=[c[0]-b[0],c[1]-b[1]];const l1=hyp(...t1)||1,l2=hyp(...t2)||1;t1=[t1[0]/l1,t1[1]/l1];t2=[t2[0]/l2,t2[1]/l2];if(i===0)t1=t2;if(i===n-1)t2=t1;
  let nx=-(t1[1]+t2[1]),ny=t1[0]+t2[0];const nl=hyp(nx,ny)||1;nx/=nl;ny/=nl;const cs=Math.max(0.3,nx*-t1[1]+ny*t1[0]);o.push([b[0]+nx*d/cs,b[1]+ny*d/cs]);}return o;}
function profZ(kind,d,W,D){const u=2*d/W;if(Math.abs(u)>1)return 0;switch(kind){case'round':return-D*(1-Math.sqrt(1-u*u));case'ogee':return-D*(0.5-0.5*Math.sin(Math.PI*u/2));case'v':return-D*(1-Math.abs(u));default:return-D*Math.sqrt(1-u*u);}}
function genMoulding(op,ctx,mb,W){
  const f=ctx.feat;if(f.kind!=='slot'){W.push('feature');return;}const r=ctx.tool.dia/2,Wd=op.pw||0.75,Dp=op.pd||0.25,kind=op.prof||'cove',st=Math.max(op.woc||0.02,0.003),R=op.zTop+ctx.retract,ball=ctx.tool.type==='ball';
  const tip=d=>{let m=-1e9;const n=12;for(let k=-n;k<=n;k++){const u=r*k/n;const drop=ball?r-Math.sqrt(Math.max(0,r*r-u*u)):0;m=Math.max(m,profZ(kind,d+u,Wd,Dp)-drop);}return op.zTop+Math.min(0,m);};
  const ds=[];for(let d=-Wd/2;d<=Wd/2+1e-9;d+=st)ds.push(d);
  const levels=layers(op.zTop,op.zTop-Dp,op.doc||Dp);
  for(const zl of levels){let fwd=true;for(const d of ds){const z=Math.max(tip(d),zl);if(z>=op.zTop-1e-5)continue;let P=offsetPoly(f.path,d);if(!fwd)P=P.slice().reverse();
    mb.retract(R);mb.rapid(P[0][0],P[0][1]);mb.rapid(null,null,z+0.05);mb.feed(null,null,z,op.plunge);for(const q of P)mb.feed(q[0],q[1],z,op.feed);fwd=!fwd;}}
  mb.retract(ctx.clear);}
/* ---------- 3D scallop (offset) and morph spiral on the mesh heightmap ---------- */
function silField(hm,floor){const{h,nx,ny,res}=hm;const ins=new Uint8Array(nx*ny),out=new Uint8Array(nx*ny);for(let k=0;k<h.length;k++){if(h[k]>floor+1e-5)ins[k]=1;else out[k]=1;}
  const di=edt2d(out,nx,ny),dout=edt2d(ins,nx,ny);const F=new Float32Array(nx*ny);for(let k=0;k<F.length;k++)F[k]=(ins[k]?di[k]:-dout[k])*res;return F;}
function resample(lp,M){const L=perim(lp,true),out=[];let seg=0,acc=0;const n=lp.length;for(let i=0;i<M;i++){const s=L*i/M;while(acc+dist(lp[seg%n],lp[(seg+1)%n])<s&&seg<n*2){acc+=dist(lp[seg%n],lp[(seg+1)%n]);seg++;}const a=lp[seg%n],b=lp[(seg+1)%n],l=dist(a,b)||1,t_=(s-acc)/l;out.push([a[0]+(b[0]-a[0])*t_,a[1]+(b[1]-a[1])*t_]);}return out;}
function genScallop(op,ctx,mb,W){
  const hm=ctx.hm;if(!hm){W.push('mesh');return;}const tl=ctx.tool,r=tl.dia/2,cl=clMap(hm,tl,op.leave||0),{nx,ny,x0,y0,res}=hm,R=op.zTop+ctx.retract,st=Math.max(op.woc||tl.dia*0.1,res);
  const floor=Math.min(...hm.h);const F=silField(hm,floor+1e-4);
  const CLs=(x,y)=>{const fi=(x-x0)/res,fj=(y-y0)/res;let i=Math.max(0,Math.min(nx-2,Math.floor(fi))),j=Math.max(0,Math.min(ny-2,Math.floor(fj)));const tx=Math.min(1,Math.max(0,fi-i)),ty=Math.min(1,Math.max(0,fj-j)),k=j*nx+i;return Math.max(op.zBot,cl[k]*(1-tx)*(1-ty)+cl[k+1]*tx*(1-ty)+cl[k+nx]*(1-tx)*ty+cl[k+nx+1]*tx*ty);};
  const samp=(x,y)=>{const fi=(x-x0)/res,fj=(y-y0)/res;let i=Math.floor(fi),j=Math.floor(fj);if(i<0||j<0||i>=nx-1||j>=ny-1)return-1e9;const tx=fi-i,ty=fj-j,k=j*nx+i;return F[k]*(1-tx)*(1-ty)+F[k+1]*tx*(1-ty)+F[k+nx]*(1-tx)*ty+F[k+nx+1]*tx*ty;};
  const fd={F,nx,ny,x0,y0,h:res,nearest:(x,y)=>[x,y,0],sample:samp,signed:samp};let fmax=-1e9;for(const v of F)if(v>fmax)fmax=v;
  const rings=[];for(let L=-r*0.9;L<fmax-1e-6;L+=st){const lp=iso(fd,L,0.0005);if(!lp.length)continue;lp.sort((a,b)=>Math.abs(area(b))-Math.abs(area(a)));rings.push(op.type==='surfMorph'?[lp[0]]:lp);}
  if(!rings.length){W.push('nothing');return;}
  const dens=lp=>{const o=[];for(let i=0;i<lp.length;i++){const a=lp[i],b=lp[(i+1)%lp.length],n=Math.max(1,Math.ceil(dist(a,b)/(res*1.5)));for(let k=0;k<n;k++)o.push([a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);}return o;};
  mb.retract(ctx.clear);
  if(op.type==='surfMorph'){let start=null;const RS=rings.map(g=>{let lp=g[0];if(area(lp)<0)lp=lp.slice().reverse();if(start)lp=rotateTo(lp,start);start=lp[0];return resample(lp,240);});
    const p0=RS[0][0];mb.rapid(p0[0],p0[1]);mb.rapid(null,null,CLs(p0[0],p0[1])+0.1);mb.feed(null,null,CLs(p0[0],p0[1]),op.plunge);
    for(let k=0;k<RS.length;k++){const A=RS[k],B=RS[k+1]||RS[k];for(let i=0;i<240;i++){const t_=i/240,x=A[i][0]*(1-t_)+B[i][0]*t_,y=A[i][1]*(1-t_)+B[i][1]*t_;mb.feed(x,y,CLs(x,y),op.feed);}}
    mb.retract(ctx.clear);return;}
  let pos=null;for(const g of rings)for(const lp0 of g){const lp=dens(pos?rotateTo(lp0,pos):lp0);const s=lp[0];
    if(pos&&dist(pos,s)<st*2.5){const n=Math.max(1,Math.ceil(dist(pos,s)/res));for(let k=1;k<=n;k++){const x=pos[0]+(s[0]-pos[0])*k/n,y=pos[1]+(s[1]-pos[1])*k/n;mb.feed(x,y,CLs(x,y),op.feed);}}
    else{mb.retract(R);mb.rapid(s[0],s[1]);mb.rapid(null,null,CLs(s[0],s[1])+0.05);mb.feed(null,null,CLs(s[0],s[1]),op.plunge);}
    for(const q of lp.concat([lp[0]]))mb.feed(q[0],q[1],CLs(q[0],q[1]),op.feed);pos=lp[0];}
  mb.retract(ctx.clear);}
/* ---------- 4th axis rotary finishing on a mesh (cylindrical map) ---------- */
function meshCylMap(T,sc,yc,zc,resx,nth){let x0=1e18,x1=-1e18;for(const t of T)for(let k=0;k<9;k+=3){x0=Math.min(x0,t[k]*sc);x1=Math.max(x1,t[k]*sc);}
  const nx=Math.ceil((x1-x0)/resx)+1,R=new Float32Array(nx*nth).fill(0);const put=(x,y,z)=>{const i=Math.round((x-x0)/resx);let th=Math.atan2(y,z);if(th<0)th+=TAU;const j=Math.round(th/TAU*nth)%nth;const r=hyp(y,z);const k=j*nx+i;if(i>=0&&i<nx&&r>R[k])R[k]=r;};
  const step=Math.min(resx,TAU/nth*0.5);
  for(const t of T){const P=[0,3,6].map(k=>[t[k]*sc,t[k+1]*sc-yc,t[k+2]*sc-zc]);const e=Math.max(dist3(P[0],P[1]),dist3(P[1],P[2]),dist3(P[0],P[2]));const rmax=Math.max(...P.map(p=>hyp(p[1],p[2])),0.05);const n=Math.max(1,Math.ceil(e/Math.min(resx,rmax*TAU/nth)));
    for(let a=0;a<=n;a++)for(let b=0;b<=n-a;b++){const u=a/n,v=b/n,w=1-u-v;put(P[0][0]*w+P[1][0]*u+P[2][0]*v,P[0][1]*w+P[1][1]*u+P[2][1]*v,P[0][2]*w+P[1][2]*u+P[2][2]*v);}}
  return{R,nx,nth,x0,resx};}
function dist3(a,b){return hyp(a[0]-b[0],a[1]-b[1],a[2]-b[2]);}
function genRotFinish(op,ctx,mb,W){
  const cm=ctx.cyl;if(!cm){W.push('mesh');return;}const r=ctx.tool.dia/2,{R,nx,nth,x0,resx}=cm,ball=ctx.tool.type!=='flat';const dth=TAU/nth;
  const ni=Math.ceil(r/resx),nj=Math.max(1,Math.ceil(r/(Math.max(0.05,Math.max(...R))*dth))+2);
  const rho=(i,j)=>{let m=0;for(let di=-ni;di<=ni;di++){const ii=i+di;if(ii<0||ii>=nx)continue;const dx=di*resx;for(let dj=-nj;dj<=nj;dj++){const jj=((j+dj)%nth+nth)%nth;const Rq=R[jj*nx+ii];if(Rq<=0)continue;const s=Math.sin(dj*dth),c=Math.cos(dj*dth);const q=r*r-dx*dx-Rq*Rq*s*s;if(q<0)continue;const v=Rq*c+Math.sqrt(q);if(v>m)m=v;}}return m;};
  const leave=op.leave||0,st=Math.max(op.woc||r*0.3,resx),Rmax=Math.max(...R),zc=Rmax+0.3;let A=0;
  rapidA(mb,null,zc,0);const xs=x0,xe=x0+(nx-1)*resx;rapidA(mb,xs,zc,0);
  const revs=Math.max(1,Math.ceil((xe-xs)/st)),N=revs*nth;let first=true;
  for(let k=0;k<=N;k++){const x=xs+(xe-xs)*k/N,j=k%nth,i=Math.round((x-x0)/resx);const z=Math.max(0.01,rho(i,j)-(ball?r:0)+leave);const a=+(k*360/nth).toFixed(3);
    if(first){rapidA(mb,x,Rmax+0.15,a);mvA(mb,x,z,a,op.plunge,z);first=false;}else mvA(mb,x,z,a,op.feed,Math.max(z,0.05));}
  rapidA(mb,null,zc,null);}
/* ---------- 5-axis on the mesh: flow (lead/lag/lean) and deburr ---------- */
function vec2bc(v,prevC,bMax){let vz=Math.max(-1,Math.min(1,v[2]));let B=Math.acos(vz)/D2R;if(bMax!=null&&B>bMax){const s=Math.sin(bMax*D2R)/Math.max(1e-9,hyp(v[0],v[1]));v=[v[0]*s,v[1]*s,Math.cos(bMax*D2R)];B=bMax;}
  let C=B<0.05&&prevC!=null?prevC:-Math.atan2(v[1],v[0])/D2R;if(prevC!=null){while(C-prevC>180)C-=360;while(C-prevC<-180)C+=360;}return{B:+B.toFixed(3),C:+C.toFixed(3),v};}
function genFlow5(op,ctx,mb,W){
  const hm=ctx.hm;if(!hm){W.push('mesh');return;}const tl=ctx.tool,r=tl.dia/2,cl=clMap(hm,{...tl,type:'ball'},op.leave||0),{nx,ny,x0,y0,res}=hm,st=Math.max(op.woc||tl.dia*0.1,res),lead=(op.lead5||0)*D2R,lean=(op.lean5||0)*D2R;
  const CL=(i,j)=>cl[Math.max(0,Math.min(ny-1,j))*nx+Math.max(0,Math.min(nx-1,i))];const sr=ctx.stockRect;mb.retract(ctx.clear);mb.o.push({t:'tcpc',on:true,h:tl.num||1});
  let fwd=true,prevC=null;const jStep=Math.max(1,Math.round(st/res));
  for(let j=Math.max(0,Math.round((sr[1]-y0)/res));j<ny&&y0+j*res<=sr[3]+1e-9;j+=jStep){const row=[];for(let i=0;i<nx;i++){const x=x0+i*res;if(x<sr[0]-r||x>sr[2]+r)continue;row.push(i);}if(!fwd)row.reverse();
    let first=true;for(let q=0;q<row.length;q+=2){const i=row[q];const x=x0+i*res,y=y0+j*res,zc=Math.max(CL(i,j),op.zBot)+r;
      let gx=(CL(i+1,j)-CL(i-1,j))/(2*res),gy=(CL(i,j+1)-CL(i,j-1))/(2*res);let n=[-gx,-gy,1];const nl=hyp(...n);n=n.map(v=>v/nl);
      const fdir=[fwd?1:-1,0,(fwd?1:-1)*gx];const fl_=hyp(...fdir);const fd=fdir.map(v=>v/fl_);const s=[n[1]*fd[2]-n[2]*fd[1],n[2]*fd[0]-n[0]*fd[2],n[0]*fd[1]-n[1]*fd[0]];
      let v=[n[0]+Math.tan(lead)*fd[0]+Math.tan(lean)*s[0],n[1]+Math.tan(lead)*fd[1]+Math.tan(lean)*s[1],n[2]+Math.tan(lead)*fd[2]+Math.tan(lean)*s[2]];const vl=hyp(...v);v=v.map(a=>a/vl);
      const bc=vec2bc(v,prevC,op.maxTilt||60);prevC=bc.C;v=bc.v;const tip=[x-r*v[0],y-r*v[1],zc-r*v[2]];
      if(first){mb.o.push({g:0,x:tip[0],y:tip[1],z:ctx.clear,b:bc.B,c:bc.C});mb.p=[tip[0],tip[1],ctx.clear];mb.o.push({g:0,x:tip[0],y:tip[1],z:tip[2]+0.1,b:bc.B,c:bc.C});mb.o.push({g:1,x:tip[0],y:tip[1],z:tip[2],b:bc.B,c:bc.C,f:op.plunge});first=false;}
      else mb.o.push({g:1,x:tip[0],y:tip[1],z:tip[2],b:bc.B,c:bc.C,f:op.feed});mb.p=tip;}
    mb.o.push({g:0,x:mb.p[0],y:mb.p[1],z:ctx.clear});mb.p=[mb.p[0],mb.p[1],ctx.clear];fwd=!fwd;}
  mb.o.push({t:'tcpc',on:false});}
function genDeburr5(op,ctx,mb,W){
  const f=ctx.feat,tl=ctx.tool,r=tl.dia/2,c=op.chamfer||0.015,z0=op.zTop;const edges=[];
  if(f.loop){edges.push({p:f.loop,out:f.kind==='profile'?1:-1});(f.islands||[]).forEach(l=>edges.push({p:l,out:1}));}
  if(f.kind==='holes')for(const p of f.pts)edges.push({p:circlePts({x:p[0],y:p[1],r:f.dia/2},0.002),out:-1});
  if(!edges.length){W.push('feature');return;}mb.retract(ctx.clear);mb.o.push({t:'tcpc',on:true,h:tl.num||1});let prevC=null;
  for(const E of edges){let lp=E.p;if(area(lp)<0)lp=lp.slice().reverse();const n=lp.length,pts=[];
    for(let i=0;i<=n;i++){const a=lp[(i-1+n)%n],b=lp[i%n],cc=lp[(i+1)%n];let dx=cc[0]-a[0],dy=cc[1]-a[1];const l=hyp(dx,dy)||1;dx/=l;dy/=l;const no=[dy*E.out,-dx*E.out];
      let v=[no[0]*Math.sin(Math.PI/4),no[1]*Math.sin(Math.PI/4),Math.cos(Math.PI/4)];const bc=vec2bc(v,prevC,null);prevC=bc.C;const tip=[b[0]-c*v[0],b[1]-c*v[1],z0-c*v[2]];pts.push([tip,bc]);}
    const [t0,b0]=pts[0];mb.o.push({g:0,x:t0[0],y:t0[1],z:ctx.clear,b:b0.B,c:b0.C});mb.o.push({g:0,x:t0[0],y:t0[1],z:t0[2]+0.1});mb.o.push({g:1,x:t0[0],y:t0[1],z:t0[2],f:op.plunge});
    for(const [tp,bc] of pts)mb.o.push({g:1,x:tp[0],y:tp[1],z:tp[2],b:bc.B,c:bc.C,f:op.feed});mb.o.push({g:0,x:pts[n][0][0],y:pts[n][0][1],z:ctx.clear});mb.p=[pts[n][0][0],pts[n][0][1],ctx.clear];}
  mb.o.push({t:'tcpc',on:false});}

function genOp(op,ctx){
  const mb=new MB(ctx.clear);mb.p=ctx.pos?ctx.pos.slice():[0,0,ctx.clear];const W=[];
  try{
    switch(op.type){
      case 'face':genFace(op,ctx,mb);break;
      case 'adaptive':genClear(op,ctx,mb,W);break;
      case 'pocket':if(op.pattern==='zigzag')genZigzag(op,ctx,mb,W);else genClear(op,ctx,mb,W);break;
      case 'rest':genRest(op,ctx,mb,W);break;
      case 'vcarve':genVcarve(op,ctx,mb,W);break;
      case 'flute':genFlute(op,ctx,mb,W);break;
      case 'surfWater':case 'surfRadial':case 'surfSpiral':case 'surfSteep':gen3Dextra(op,ctx,mb,W);break;
      case 'surfScallop':case 'surfMorph':genScallop(op,ctx,mb,W);break;
      case 'moulding':genMoulding(op,ctx,mb,W);break;
      case 'rotFinish':genRotFinish(op,ctx,mb,W);break;
      case 'flow5':genFlow5(op,ctx,mb,W);break;
      case 'deburr5':genDeburr5(op,ctx,mb,W);break;
      case 'contour':{const n=Math.max(1,Math.round(op.rings||1)),st=Math.max(op.woc||ctx.tool.dia*0.75,0.005);for(let k=n-1;k>=0;k--)genContour(op,ctx,mb,W,ctx.tool.dia/2+(op.leave||0)+k*st,layers(op.zTop,op.zBot,op.doc));break;}
      case 'chamfer':{const tl=ctx.tool,a=(tl.tipAngle||90)/2*D2R,c=op.chamfer||0.02,e=0.02,rho=(tl.tipDia||0)/2+e*Math.tan(a);
        if(ctx.feat.kind==='holes'){genHoles(Object.assign({},op,{type:'chamferHole'}),ctx,mb,W);break;}
        genContour(op,ctx,mb,W,rho,[op.zTop-(c/Math.tan(a)+e)]);break;}
      case 'radius':{const tl=ctx.tool;genContour(op,ctx,mb,W,(tl.tipDia||0.06)/2,[op.zTop-(tl.cornerR||0.0625)]);break;}
      case 'slot':genSlot(op,ctx,mb,W);break;
      case 'wrap':genWrap(op,ctx,mb,W);break;
      case 'rotRough':genRotRough(op,ctx,mb,W);break;
      case 'swarf':genSwarf(op,ctx,mb,W);break;
      case 'surfRough':case 'surfFinish':gen3D(op,ctx,mb,W);break;
      case 'engrave':genEngrave(op,ctx,mb);break;
      case 'thread':genThread(op,ctx,mb,W);break;
      case 'probe':genProbe(op,ctx,mb,W);break;
      case 'tslot':genUndercut(op,ctx,mb,W);break;
      default:genHoles(op,ctx,mb,W);
    }
  }catch(e){W.push('err:'+e.message);}
  return{moves:mb.o,warn:W,end:mb.p};
}

/* ---------- post: G-code ---------- */
function post(prog,cfg){
  if(cfg.arcfit)prog=arcFit(prog,cfg.units==='mm'?0.0127:0.0005);
  const mm=cfg.units==='mm',dp=mm?3:4,fmt=v=>{let s=(+v).toFixed(dp);s=s.replace(/0+$/,'').replace(/\.$/,'');if(s==='-0')s='0';return s;},ff=v=>(+v).toFixed(1).replace(/\.0$/,'');
  const out=[];let n=0;const line=s=>{if(cfg.lineNums&&s[0]!=='%'&&s[0]!=='('){n+=10;out.push('N'+n+' '+s);}else out.push(s);};
  const cm=s=>'('+String(s).toUpperCase().replace(/[()]/g,'').slice(0,60)+')';
  line('%');line('O'+String(cfg.progNo||1001).padStart(4,'0')+' '+cm(cfg.name||'PART'));
  (cfg.header||[]).forEach(h=>line(cm(h)));
  line((mm?'G21':'G20')+' G17 G40 G49 G80 G90');
  let mg=-1,mf=-1,first=true,cx=null,cy=null,cz=null,ca=null,cb=null,cc=null,inv=false,tcpc=false;const fa=v=>(+v).toFixed(3).replace(/\.?0+$/,'')||'0';
  for(const blk of prog){
    if(blk.t==='op'){line(cm(blk.name));continue;}
    if(blk.t==='raw'){if(cfg.post==='prototrak'&&blk.probe){line(cm('PROBING NOT SUPPORTED ON PROTOTRAK'));continue;}blk.lines.forEach(l=>line(l));mg=-1;cx=cy=cz=null;continue;}
    if(blk.t==='index'){if(tcpc){line('G49');tcpc=false;}if(blk.wcs)line(blk.wcs);let s='G00';if(blk.a!=null)s+=' A'+fa(blk.a);if(blk.b!=null)s+=' B'+fa(blk.b);if(blk.c!=null)s+=' C'+fa(blk.c);if(s!=='G00')line(s);if(blk.dwo&&cfg.post==='haas')line('G254');ca=blk.a;cb=blk.b;cc=blk.c;mg=0;continue;}
    if(blk.t==='tcpc'){if(blk.on){line('G234 H'+blk.h);tcpc=true;}else{line('G49');tcpc=false;}continue;}
    if(blk.t==='dwoOff'){if(cfg.post==='haas')line('G255');continue;}
    if(blk.t==='tool'){const t=blk.tool;
      if(!first){if(inv){line('G94');inv=false;}if(tcpc){line('G49');tcpc=false;}line('G00 Z'+fmt(cfg.clear));line('M09');line('M05');if(cfg.post!=='prototrak'){line('G91 G28 Z0.');line('G90');}}
      if(cfg.toolStop&&!first)line((cfg.stopCode||'M00')+' '+cm('LOAD T'+t.num+' '+t.desc));
      line(cm('T'+t.num+' '+t.desc));line('T'+t.num+' M06');first=false;mg=-1;mf=-1;cx=cy=cz=null;continue;}
    if(blk.t==='spin'){line('S'+Math.round(blk.s)+' M03');if(blk.first&&cfg.post!=='prototrak')line('G54');continue;}
    if(blk.t==='g43'){line('G00 G90 X'+fmt(blk.x)+' Y'+fmt(blk.y));line('G43 H'+blk.h+' Z'+fmt(cfg.clear));if(cfg.coolant)line('M08');cx=blk.x;cy=blk.y;cz=cfg.clear;mg=0;continue;}
    if(blk.t==='cycle'){const c=blk;if(inv){line('G94');inv=false;}let s=(c.kind)+' G98 X'+fmt(c.pts[0][0])+' Y'+fmt(c.pts[0][1])+' Z'+fmt(c.z)+' R'+fmt(c.r);if(c.kind==='G83'||c.kind==='G73')s+=' Q'+fmt(c.q);if(c.kind==='G82'||c.kind==='G86')s+=' P'+(cfg.post==='haas'?(+c.p).toFixed(2).replace(/\.?0+$/,''):Math.round(c.p*1000));s+=' F'+ff(c.f);line(s);
      for(let i=1;i<c.pts.length;i++)line('X'+fmt(c.pts[i][0])+' Y'+fmt(c.pts[i][1]));line('G80');mg=-1;cx=c.pts[c.pts.length-1][0];cy=c.pts[c.pts.length-1][1];cz=c.clear;continue;}
    if(blk.g!==undefined){let s='';if(blk.g!==mg||blk.g>1){s+=(blk.g===0?'G00':blk.g===1?'G01':blk.g===2?'G02':'G03')+' ';mg=blk.g;}
      if(blk.x!==cx||blk.g>1)s+='X'+fmt(blk.x)+' ';if(blk.y!==cy||blk.g>1)s+='Y'+fmt(blk.y)+' ';if(blk.z!==cz)s+='Z'+fmt(blk.z)+' ';
      if(blk.g>1)s+='I'+fmt(blk.i)+' J'+fmt(blk.j)+' ';
      if(blk.a!=null&&blk.a!==ca){s+='A'+fa(blk.a)+' ';ca=blk.a;}if(blk.b!=null&&blk.b!==cb){s+='B'+fa(blk.b)+' ';cb=blk.b;}if(blk.c!=null&&blk.c!==cc){s+='C'+fa(blk.c)+' ';cc=blk.c;}
      if(blk.inv&&!inv){s='G93 '+s;inv=true;mf=-1;}else if(!blk.inv&&inv&&blk.g>0){s='G94 '+s;inv=false;mf=-1;}
      if(blk.g>0&&(blk.f!==mf||inv)){s+='F'+(inv?(+blk.f).toFixed(3):ff(blk.f));mf=blk.f;}
      s=s.trim();if(s&&s!=='G00'&&s!=='G01')line(s);cx=blk.x;cy=blk.y;cz=blk.z;}
  }
  if(inv)line('G94');if(tcpc)line('G49');line('G00 Z'+fmt(cfg.clear));line('M09');line('M05');if(cfg.post!=='prototrak'){line('G91 G28 Z0.');line('G90');}line('M30');line('%');
  return out.join('\n').toUpperCase();
}
/* expand program into straight segments for simulation: [x0,y0,z0,x1,y1,z1,kind(0 rapid/1 feed),toolIdx,feed] */
function simSegs(prog,clear){
  const S=[];let p=[0,0,clear],ti=-1,oi=-1,skip=false,tc5=false,vb=0,vc=0;const add=(q,k,f)=>{S.push([p[0],p[1],p[2],q[0],q[1],q[2],k,ti,f||0,oi]);p=q;};
  for(const b of prog){
    if(b.t==='op'){oi=b.i;skip=!!b.multi;continue;}
    if(b.t==='tcpc'){tc5=!!b.on;continue;}
    if(skip&&b.t!=='tool')continue;
    if(b.t==='tool'){ti=b.idx;add([p[0],p[1],clear],0);continue;}
    if(b.t==='g43'){add([p[0],p[1],clear],0);add([b.x,b.y,clear],0);continue;}
    if(b.t==='cycle'){for(const q of b.pts){add([q[0],q[1],p[2]],0);add([q[0],q[1],b.r],0);add([q[0],q[1],b.z],1,b.f);add([q[0],q[1],b.clear],0);}continue;}
    if(b.g===undefined)continue;
    if(b.g<2){if(b.b!=null||b.c!=null){vb=b.b??vb;vc=b.c??vc;}const st=S.length;add([b.x,b.y,b.z],b.g,b.f);if(tc5){const B=vb*D2R,Cc=-vc*D2R;S[st].push(Math.sin(B)*Math.cos(Cc),Math.sin(B)*Math.sin(Cc),Math.cos(B));}continue;}
    const cx=b.cx,cy=b.cy,r=hyp(p[0]-cx,p[1]-cy),a0=Math.atan2(p[1]-cy,p[0]-cx);let a1=Math.atan2(b.y-cy,b.x-cx),sw=a1-a0;
    if(b.g===3){while(sw<=1e-9)sw+=TAU;}else{while(sw>=-1e-9)sw-=TAU;}
    const n=Math.max(4,Math.ceil(Math.abs(sw)/(TAU/48))),z0=p[2];for(let k=1;k<=n;k++){const a=a0+sw*k/n;add([cx+r*Math.cos(a),cy+r*Math.sin(a),z0+(b.z-z0)*k/n],1,b.f);}
  }
  return S;
}
function simSegs4(prog){const S4=[];let on=false,ti=-1,oi=-1,p=null;
  for(const b of prog){if(b.t==='tool'){ti=b.idx;continue;}if(b.t==='op'){on=b.multi==='rot';oi=b.i;p=null;continue;}if(!on)continue;
    if(b.t==='cycle'){for(const q of b.pts){const a=p?p[2]:0;S4.push([q[0],b.clear,a,q[0],b.r,a,0,ti,0,oi],[q[0],b.r,a,q[0],b.z,a,1,ti,b.f,oi],[q[0],b.z,a,q[0],b.clear,a,0,ti,0,oi]);p=[q[0],b.clear,a];}continue;}
    if(b.g===undefined)continue;const q=[b.x,b.z,b.a??(p?p[2]:0)];if(p)S4.push([p[0],p[1],p[2],q[0],q[1],q[2],b.g===0?0:1,ti,b.f||0,oi]);p=q;}
  return S4;}
function cycleTime(segs,rapid,toolChanges,tcSec){let t=0;for(const s of segs){const d=hyp(s[3]-s[0],s[4]-s[1],s[5]-s[2]);t+=s[6]===0?d/rapid:d/Math.max(s[8],0.1);}return t*60+toolChanges*(tcSec||45);}

/* ---------- Siemens 840D post (milling) ---------- */
function postSiemens(prog,cfg){
  if(cfg.arcfit)prog=arcFit(prog,cfg.units==='mm'?0.0127:0.0005);
  const mm=cfg.units==='mm',dp=mm?3:4,fmt=v=>{let s=(+v).toFixed(dp).replace(/0+$/,'').replace(/\.$/,'');return s==='-0'?'0':s;},ff=v=>(+v).toFixed(1).replace(/\.0$/,''),fa=v=>(+v).toFixed(3).replace(/\.?0+$/,'')||'0';
  const out=[];let n=0;const line=s=>{if(cfg.lineNums&&s[0]!==';'){n+=10;out.push('N'+n+' '+s);}else out.push(s);};const cm=s=>'; '+String(s).replace(/[\r\n]/g,' ').slice(0,70);
  line(cm((cfg.name||'PART')+' - MINI CAM'));(cfg.header||[]).forEach(h=>line(cm(h)));line((mm?'G710':'G700')+' G17 G90 G40 G94');line('G54');
  let mg=-1,mf=-1,first=true,cx=null,cy=null,cz=null,ca=null,cb=null,cc=null,inv=false,tra=false;
  for(const b of prog){
    if(b.t==='raw'){line(cm(b.probe?'PROBING: USE CYCLE977/978 - G65 MACROS NOT SUPPORTED':'RAW BLOCK'));continue;}
    if(b.t==='op'){line(cm(b.name));continue;}
    if(b.t==='tool'){if(!first){if(tra){line('TRAFOOF');tra=false;}line('G0 Z'+fmt(cfg.clear)+' M9');line('M5');line('G0 SUPA Z0 D0');}if(cfg.toolStop&&!first)line((cfg.stopCode==='M01'?'M1':'M0')+' '+cm('LOAD T'+b.tool.num));line(cm('T'+b.tool.num+' '+b.tool.desc));line('T'+b.tool.num);line('M6');line('D1');first=false;mg=-1;mf=-1;cx=cy=cz=null;continue;}
    if(b.t==='spin'){line('S'+Math.round(b.s)+' M3');continue;}
    if(b.t==='g43'){line('G0 X'+fmt(b.x)+' Y'+fmt(b.y));line('G0 Z'+fmt(cfg.clear)+(cfg.coolant?' M8':''));cx=b.x;cy=b.y;cz=cfg.clear;mg=0;continue;}
    if(b.t==='index'){if(b.b!=null||b.c!=null){line('CYCLE800(1,"TC1",200000,57,0,0,0,'+fa(b.a??0)+','+fa(b.b??0)+','+fa(b.c??0)+',0,0,0,1,100,1)');}else if(b.a!=null)line('G0 A'+fa(b.a));if(b.wcs)line(b.wcs);mg=-1;continue;}
    if(b.t==='dwoOff'){line('CYCLE800()');continue;}
    if(b.t==='tcpc'){if(b.on){line('TRAORI');tra=true;}else{line('TRAFOOF');tra=false;}continue;}
    if(b.t==='cycle'){const c=b,RTP=fmt(c.clear),RFP=fmt(c.r-0.1),SD=fmt(0.1),DP=fmt(c.z);let call;
      if(c.kind==='G81')call=`CYCLE81(${RTP},${RFP},${SD},${DP},)`;else if(c.kind==='G82')call=`CYCLE82(${RTP},${RFP},${SD},${DP},,${(+c.p).toFixed(2)})`;
      else if(c.kind==='G83'||c.kind==='G73')call=`CYCLE83(${RTP},${RFP},${SD},${DP},,${fmt(c.r-0.1-c.q)},,${fmt(c.q)},0,0,1,${c.kind==='G73'?0:1})`;
      else if(c.kind==='G84')call=`CYCLE84(${RTP},${RFP},${SD},${DP},,0,3,,${fmt(c.pitch||0.05)},0,${Math.round(c.s||300)},${Math.round(c.s||300)})`;
      else if(c.kind==='G86')call=`CYCLE86(${RTP},${RFP},${SD},${DP},,${(+c.p).toFixed(2)},3,0,0,0,0)`;else call=`CYCLE85(${RTP},${RFP},${SD},${DP},,0,${ff(c.f)},${ff(c.f)})`;
      if(inv){line('G94');inv=false;}line('F'+ff(c.f));line('MCALL '+call);for(const q of c.pts)line('X'+fmt(q[0])+' Y'+fmt(q[1]));line('MCALL');mg=-1;mf=-1;continue;}
    if(b.g!==undefined){let s='';if(b.g!==mg||b.g>1){s+=(b.g===0?'G0':b.g===1?'G1':b.g===2?'G2':'G3')+' ';mg=b.g;}
      if(b.x!==cx||b.g>1)s+='X'+fmt(b.x)+' ';if(b.y!==cy||b.g>1)s+='Y'+fmt(b.y)+' ';if(b.z!==cz)s+='Z'+fmt(b.z)+' ';if(b.g>1)s+='I'+fmt(b.i)+' J'+fmt(b.j)+' ';
      if(b.a!=null&&b.a!==ca){s+='A'+fa(b.a)+' ';ca=b.a;}if(b.b!=null&&b.b!==cb){s+='B'+fa(b.b)+' ';cb=b.b;}if(b.c!=null&&b.c!==cc){s+='C'+fa(b.c)+' ';cc=b.c;}
      if(b.inv&&!inv){s='G93 '+s;inv=true;mf=-1;}else if(!b.inv&&inv&&b.g>0){s='G94 '+s;inv=false;mf=-1;}
      if(b.g>0&&(b.f!==mf||inv)){s+='F'+(inv?(+b.f).toFixed(3):ff(b.f));mf=b.f;}s=s.trim();if(s&&s!=='G0'&&s!=='G1')line(s);cx=b.x;cy=b.y;cz=b.z;}}
  if(inv)line('G94');if(tra)line('TRAFOOF');line('G0 Z'+fmt(cfg.clear)+' M9');line('M5');line('M30');return out.join('\n').toUpperCase();}
/* ---------- LATHE: profile (z,r) -> turning ops; X in diameter ---------- */
function latheProfileFromGeom(g){
  let src=null;if(g.opens.length)src=g.opens.reduce((a,b)=>perim(b)>perim(a)?b:a);if(g.loops.length){const L=g.loops.reduce((a,b)=>Math.abs(area(b))>Math.abs(area(a))?b:a);if(!src||Math.abs(area(L))>0)src=L.concat([L[0]]);}
  if(!src)return null;const b=bbox(src);const half=Math.abs(b[1])<1e-3||(src.filter(p=>Math.abs(p[1]-b[1])<1e-4).length>=2&&Math.abs(b[1])<0.02);const ax=half?b[1]:(Math.abs(b[1])<1e-3?b[1]:(b[1]+b[3])/2);
  const segs=[];for(let i=0;i<src.length-1;i++)segs.push([src[i],src[i+1]]);const zs=[];const n=Math.max(40,Math.ceil((b[2]-b[0])/0.005));for(let i=0;i<=n;i++)zs.push(b[0]+(b[2]-b[0])*i/n);
  const rAt=x=>{let m=0;for(const[a,c]of segs){if((a[0]-x)*(c[0]-x)<=0&&a[0]!==c[0]){const t=(x-a[0])/(c[0]-a[0]);m=Math.max(m,a[1]+(c[1]-a[1])*t-ax);}else if(Math.abs(a[0]-x)<1e-9)m=Math.max(m,a[1]-ax,c[1]-ax);}return m;};
  let P=zs.map(x=>[x-b[2],Math.max(0,rAt(x))]);P=rdp(P,0.0005);return P;// z from 0 (right face) to -L
}
function rProf(P,z){let m=0;for(let i=0;i<P.length-1;i++){const a=P[i],b=P[i+1];if((a[0]-z)*(b[0]-z)<=0){if(Math.abs(b[0]-a[0])<1e-9)m=Math.max(m,a[1],b[1]);else m=Math.max(m,a[1]+(b[1]-a[1])*(z-a[0])/(b[0]-a[0]));}}return m;}
function genLathe(op,L){const o=[];const D0=L.stockD,R0=D0/2,P=L.prof,zEnd=P[P.length-1][0],safeX=D0+0.2,zs=0.1;let x=safeX,z=zs;
  const G0=(X,Z)=>{o.push({g:0,x:X??x,z:Z??z});x=X??x;z=Z??z;},G1=(X,Z,f)=>{o.push({g:1,x:X??x,z:Z??z,f});x=X??x;z=Z??z;};
  const f=op.feed,doc=Math.max(op.doc||0.06,0.005),lv=op.leaveX||0.01,lz=op.leaveZ||0.005;
  if(op.type==='lface'){const zt=L.faceStock||0.03;G0(safeX,zt+0.1);for(const zz of layers(zt,0,doc)){G0(safeX-0.1,zz);G1(-0.03,zz,f);G0(-0.03,zz+0.05);G0(safeX,zz+0.05);}G0(safeX,zs);}
  else if(op.type==='lrough'){for(let r=R0-doc;r>-1e-9;r-=doc){const rr=Math.max(r,0);let zA=zs,zB=null;const st=0.005;for(let zz=0;zz>=Math.max(zEnd,-(L.len||5))-1e-9;zz-=st){if(rProf(P,zz)+lv>=rr-1e-9){zB=zz+st;break;}zB=zz;}
      if(zB==null||zB>=0)continue;const zb=Math.min(-1e-4,zB+lz);G0(rr*2+0.04,zs);G0(rr*2,zs);G1(rr*2,zb,f);G1(Math.min(R0*2,rr*2+doc*2),zb+doc,f);G0(null,zs);if(rr<=0)break;}
    G0(safeX,zs);}
  else if(op.type==='lfinish'){G0(safeX,zs);const Q=P.filter(p=>p[1]>0||p[0]===P[0][0]);G0(Math.max(0,Q[0][1]*2-0.1),zs);o.push({t:'comp',on:42});G1(Q[0][1]*2,0.0,f);for(const p of Q)G1(p[1]*2,p[0],f);G1(R0*2+0.05,null,f);o.push({t:'comp',on:0});G0(safeX,null);G0(safeX,zs);}
  else if(op.type==='lgroove'){const zc=op.zPos??-0.5,w=op.width||0.125,tw=L.toolW||0.125,dFin=op.dia??Math.max(0,R0*2-0.2);const n=Math.max(1,Math.ceil((w-tw)/(tw*0.8))+1);
    for(let k=0;k<n;k++){const zz=zc-(n>1?(w-tw)*k/(n-1):0);G0(R0*2+0.1,zz);for(let xd=R0*2-op.peckX;xd>dFin-1e-9;xd-=op.peckX){G1(Math.max(dFin,xd),zz,f);G0(Math.max(dFin,xd)+0.02,zz);}G1(dFin,zz,f);G0(R0*2+0.1,zz);}G0(safeX,zs);}
  else if(op.type==='lthread'){const pitch=op.pitch||1/20,Dmaj=op.dia||R0*2,depth=0.6134*pitch*2,zA=0.2,zB=op.zEnd??-0.75,np=Math.max(4,op.passes||8);
    for(let k=1;k<=np;k++){const d=depth*Math.sqrt(k/np);G0(Dmaj+0.1,zA);G0(Dmaj-d,zA);o.push({g:33,x:Dmaj-d,z:zB,f:pitch});x=Dmaj-d;z=zB;G0(Dmaj+0.1,zB);G0(null,zA);}G0(safeX,zs);}
  else if(op.type==='ldrill'){const zb=-(op.depth||0.75),q=op.peck||0.2;G0(0,zs);for(let zz=-q;;zz-=q){const zt=Math.max(zb,zz);G1(0,zt,f);G0(0,zs);if(zt<=zb+1e-9)break;G0(0,zt+0.02);}G0(safeX,zs);}
  else if(op.type==='lpart'){const zz=(zEnd||-(L.len||2))-(L.toolW||0.125);G0(R0*2+0.1,zz);for(let xd=R0*2-0.1;xd>-0.03;xd-=0.1){G1(Math.max(-0.03,xd),zz,f);G0(Math.max(-0.03,xd)+0.02,zz);}G1(-0.03,zz,f);G0(safeX,zz);G0(null,zs);}
  return o;}
function postLathe(prog,cfg){const sie=cfg.post==='siemens',mm=cfg.units==='mm',dp=mm?3:4,k=mm?25.4:1,fmt=v=>{let s=(+v*k).toFixed(dp).replace(/0+$/,'').replace(/\.$/,'');return s==='-0'?'0':s;},fr=v=>(+v*k).toFixed(mm?3:4).replace(/0+$/,'').replace(/\.$/,'');
  const out=[];const cmt=s=>sie?'; '+s:'('+String(s).toUpperCase().replace(/[()]/g,'')+')';
  if(!sie){out.push('%');out.push('O'+String(cfg.progNo||3001).padStart(4,'0')+' '+cmt(cfg.name||'LATHE'));}else out.push(cmt((cfg.name||'LATHE')+' - MINI CAM'));
  (cfg.header||[]).forEach(h=>out.push(cmt(h)));out.push(sie?(mm?'G710':'G700')+' G18 G90 G95 DIAMON':(mm?'G21':'G20')+' G18 G40 G80 G99');
  let first=true,mg=-1;
  for(const b of prog){if(b.t==='op'){out.push(cmt(b.name));continue;}
    if(b.t==='tool'){if(!first){out.push(sie?'G0 X'+fmt(cfg.safeX)+' Z'+fmt(cfg.safeZ):'G00 X'+fmt(cfg.safeX)+' Z'+fmt(cfg.safeZ));out.push(sie?'M9':'M09');}const tn=String(b.num).padStart(2,'0');out.push(cmt('T'+b.num+' '+b.desc));out.push(sie?'T'+b.num+' D1':'T'+tn+tn);
      if(b.css){out.push(sie?'G96 S'+Math.round(mm?b.sfm*0.3048:b.sfm)+' LIMS='+b.max+' M3':'G50 S'+b.max);if(!sie)out.push('G96 S'+Math.round(mm?b.sfm*0.3048:b.sfm)+' M03');}else out.push((sie?'G97 S':'G97 S')+b.rpm+(sie?' M3':' M03'));
      out.push((sie?'G0 X':'G00 X')+fmt(cfg.safeX)+' Z'+fmt(cfg.safeZ)+(sie?' M8':' M08'));first=false;mg=0;continue;}
    if(b.t==='comp'){out.push(b.on?(b.on===42?'G42':'G41'):'G40');continue;}
    if(b.g===33){out.push((sie?'G33':'G32')+' X'+fmt(b.x)+' Z'+fmt(b.z)+' '+(sie?'K':'F')+fr(b.f));mg=33;continue;}
    let s='';if(b.g!==mg){s+=(sie?['G0','G1'][b.g]:['G00','G01'][b.g])+' ';mg=b.g;}s+='X'+fmt(b.x)+' Z'+fmt(b.z);if(b.g===1)s+=' F'+fr(b.f);out.push(s);}
  out.push(sie?'G0 X'+fmt(cfg.safeX)+' Z'+fmt(cfg.safeZ):'G00 X'+fmt(cfg.safeX)+' Z'+fmt(cfg.safeZ));out.push(sie?'M9':'M09');out.push(sie?'M5':'M05');out.push('M30');if(!sie)out.push('%');return out.join('\n').toUpperCase();}

const API={pdfDetect,pdfRescale,outerFace,feedOpt,meshHoles,decideAxes,textStrokes,textWidth,mprops,drillCycle,deflection,tabCheck,opLoads,sideForce,fixtureHold,arcFit,MPROPS,latheProfileFromGeom,rProf,genLathe,postLathe,postSiemens,simSegs4,meshCylMap,meshHeightmap,ROTARIES,parseSTL,meshLevels,parseSTEP,levelsTo25D,area,pip,bbox,perim,dist,parseDXF,buildGeom,scaleGeom,geomBox,classify,makeField,iso,layers,feeds,genOp,post,simSegs,cycleTime,circlePts,MATERIALS,MACHINES,TAPS,arcPts};
if(typeof module!=='undefined'&&module.exports)module.exports=API;else root.CAM=API;
})(this);
