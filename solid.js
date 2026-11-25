/* MINI CAM — solid modeling kernel: BSP booleans (union / subtract / intersect) and
   extrude · revolve · sweep · loft with draft, shell and top / bottom edge fillet / chamfer — by Ryan Nguyen */
(function(){'use strict';
const EPS=1e-5;
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],mul=(a,s)=>[a[0]*s,a[1]*s,a[2]*s],
 dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2],cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],
 len=a=>Math.hypot(a[0],a[1],a[2]),unit=a=>{const l=len(a)||1;return[a[0]/l,a[1]/l,a[2]/l];};

/* ---------- polygons ---------- */
function mkPoly(V){if(V.length<3)return null;let n0=0,n1=0,n2=0,cx=0,cy=0,cz=0;for(let i=0;i<V.length;i++){const a=V[i],b=V[(i+1)%V.length];n0+=(a[1]-b[1])*(a[2]+b[2]);n1+=(a[2]-b[2])*(a[0]+b[0]);n2+=(a[0]-b[0])*(a[1]+b[1]);cx+=a[0];cy+=a[1];cz+=a[2];}
 const l=Math.hypot(n0,n1,n2);if(l<1e-12)return null;const n=[n0/l,n1/l,n2/l];return{v:V,n,w:(n[0]*cx+n[1]*cy+n[2]*cz)/V.length};}
const flipP=p=>({v:p.v.slice().reverse(),n:[-p.n[0],-p.n[1],-p.n[2]],w:-p.w});
/* add a face; a 4-gon that is not flat is split into two triangles; repeated corners are dropped */
function face(out,V){const W=[];for(const p of V){const q=W[W.length-1];if(!q||Math.abs(q[0]-p[0])+Math.abs(q[1]-p[1])+Math.abs(q[2]-p[2])>1e-9)W.push(p);}
 while(W.length>1){const a=W[0],b=W[W.length-1];if(Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2])<=1e-9)W.pop();else break;}
 if(W.length<3)return;if(W.length===4){const p=mkPoly(W);if(p){let ok=true;for(const v of W)if(Math.abs(dot(p.n,v)-p.w)>1e-7){ok=false;break;}if(ok){out.push(p);return;}}face(out,[W[0],W[1],W[2]]);face(out,[W[0],W[2],W[3]]);return;}
 const p=mkPoly(W);if(p)out.push(p);}

/* ---------- BSP tree (after Evan Wallace's csg.js, iterative so big parts do not overflow the stack) ---------- */
function split(pn,pw,p,cf,cb,f,b){const V=p.v,n=V.length,ty=new Array(n);let all=0;
 for(let i=0;i<n;i++){const t=pn[0]*V[i][0]+pn[1]*V[i][1]+pn[2]*V[i][2]-pw;const k=t<-EPS?2:t>EPS?1:0;ty[i]=k;all|=k;}
 if(all===0){(pn[0]*p.n[0]+pn[1]*p.n[1]+pn[2]*p.n[2]>0?cf:cb).push(p);return;}
 if(all===1){f.push(p);return;}if(all===2){b.push(p);return;}
 const F=[],B=[];for(let i=0;i<n;i++){const j=(i+1)%n,ti=ty[i],tj=ty[j],vi=V[i],vj=V[j];if(ti!==2)F.push(vi);if(ti!==1)B.push(vi);
  if((ti|tj)===3){const d=sub(vj,vi),t=(pw-dot(pn,vi))/dot(pn,d),v=[vi[0]+d[0]*t,vi[1]+d[1]*t,vi[2]+d[2]*t];F.push(v);B.push(v);}}
 if(F.length>=3)f.push({v:F,n:p.n,w:p.w});if(B.length>=3)b.push({v:B,n:p.n,w:p.w});}
const node=()=>({pn:null,pw:0,f:null,b:null,ps:[]});
function build(root,ps){const st=[[root,ps]];while(st.length){const[nd,P]=st.pop();if(!P.length)continue;if(!nd.pn){nd.pn=P[0].n;nd.pw=P[0].w;}const f=[],b=[];for(const p of P)split(nd.pn,nd.pw,p,nd.ps,nd.ps,f,b);
  if(f.length){if(!nd.f)nd.f=node();st.push([nd.f,f]);}if(b.length){if(!nd.b)nd.b=node();st.push([nd.b,b]);}}}
function nodes(root){const o=[],st=[root];while(st.length){const n=st.pop();o.push(n);if(n.f)st.push(n.f);if(n.b)st.push(n.b);}return o;}
function invert(root){for(const n of nodes(root)){n.ps=n.ps.map(flipP);if(n.pn){n.pn=[-n.pn[0],-n.pn[1],-n.pn[2]];n.pw=-n.pw;}const t=n.f;n.f=n.b;n.b=t;}}
function clipPolys(root,ps){if(!root.pn)return ps.slice();const out=[],st=[[root,ps]];while(st.length){const[nd,P]=st.pop();if(!P.length)continue;const f=[],b=[];for(const p of P)split(nd.pn,nd.pw,p,f,b,f,b);
  if(nd.f)st.push([nd.f,f]);else for(const p of f)out.push(p);if(nd.b)st.push([nd.b,b]);}return out;}
function clipTo(a,bsp){for(const n of nodes(a))n.ps=clipPolys(bsp,n.ps);}
function all(root){const o=[];for(const n of nodes(root))for(const p of n.ps)o.push(p);return o;}
const cl=ps=>ps.map(p=>({v:p.v,n:p.n,w:p.w}));
function box3(ps){const b=[1e18,1e18,1e18,-1e18,-1e18,-1e18];for(const p of ps)for(const v of p.v)for(let k=0;k<3;k++){if(v[k]<b[k])b[k]=v[k];if(v[k]>b[k+3])b[k+3]=v[k];}return b;}
const apart=(A,B)=>{const a=box3(A),b=box3(B);for(let k=0;k<3;k++)if(a[k+3]<b[k]-1e-7||b[k+3]<a[k]-1e-7)return true;return false;};
function union(a,b){if(!a.length)return cl(b);if(!b.length)return cl(a);if(apart(a,b))return cl(a).concat(cl(b));const A=node(),B=node();build(A,cl(a));build(B,cl(b));clipTo(A,B);clipTo(B,A);invert(B);clipTo(B,A);invert(B);build(A,all(B));return all(A);}
function subtract(a,b){if(!a.length)return[];if(!b.length||apart(a,b))return cl(a);const A=node(),B=node();build(A,cl(a));build(B,cl(b));invert(A);clipTo(A,B);clipTo(B,A);invert(B);clipTo(B,A);invert(B);build(A,all(B));invert(A);return all(A);}
function intersect(a,b){if(!a.length||!b.length||apart(a,b))return[];const A=node(),B=node();build(A,cl(a));build(B,cl(b));invert(A);clipTo(B,A);invert(B);clipTo(A,B);clipTo(B,A);build(A,all(B));invert(A);return all(A);}

/* ---------- 2D helpers ---------- */
const area2=P=>{let a=0;for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length];a+=p[0]*q[1]-q[0]*p[1];}return a/2;};
function clean2(P){const o=[];for(const p of P){const q=o[o.length-1];if(!q||Math.hypot(q[0]-p[0],q[1]-p[1])>1e-7)o.push([p[0],p[1]]);}while(o.length>2&&Math.hypot(o[0][0]-o[o.length-1][0],o[0][1]-o[o.length-1][1])<=1e-7)o.pop();
 // drop points that sit on a straight line between their neighbours
 for(let i=0;i<o.length&&o.length>3;){const a=o[(i-1+o.length)%o.length],b=o[i],c=o[(i+1)%o.length];const cr=(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]),l=Math.hypot(c[0]-a[0],c[1]-a[1])||1;if(Math.abs(cr)/l<1e-9&&(b[0]-a[0])*(c[0]-b[0])+(b[1]-a[1])*(c[1]-b[1])>0)o.splice(i,1);else i++;}return o;}
const ccw=P=>{const Q=clean2(P);return area2(Q)<0?Q.reverse():Q;};
/* move every corner of a CCW loop inward by d (negative d grows it); same point count, so rings stay matched */
function offset(P,d){if(!d)return P.map(p=>p.slice());const n=P.length,o=[];for(let i=0;i<n;i++){const a=P[(i-1+n)%n],b=P[i],c=P[(i+1)%n];let e1=[b[0]-a[0],b[1]-a[1]],e2=[c[0]-b[0],c[1]-b[1]];const l1=Math.hypot(...e1)||1,l2=Math.hypot(...e2)||1;e1=[e1[0]/l1,e1[1]/l1];e2=[e2[0]/l2,e2[1]/l2];
  const n1=[-e1[1],e1[0]],n2=[-e2[1],e2[0]];let k=1+n1[0]*n2[0]+n1[1]*n2[1];if(k<0.1)k=0.1;o.push([b[0]+(n1[0]+n2[0])*d/k,b[1]+(n1[1]+n2[1])*d/k]);}
 const A0=area2(P),A1=area2(o);if(A1<=1e-10||(d>0&&A1>A0+1e-9))throw new Error('offset');return o;}
/* offset with a distance per edge (edge i runs from P[i] to P[i+1]) — corners from the crossing of the moved lines */
function offsetEdges(P,D){const n=P.length,o=[];for(let i=0;i<n;i++){const a=P[(i-1+n)%n],b=P[i],c=P[(i+1)%n],d1=D[(i-1+n)%n],d2=D[i];
  let e1=[b[0]-a[0],b[1]-a[1]],e2=[c[0]-b[0],c[1]-b[1]];const l1=Math.hypot(...e1)||1,l2=Math.hypot(...e2)||1;const n1=[-e1[1]/l1,e1[0]/l1],n2=[-e2[1]/l2,e2[0]/l2];
  const det=n1[0]*n2[1]-n1[1]*n2[0],r1=n1[0]*b[0]+n1[1]*b[1]+d1,r2=n2[0]*b[0]+n2[1]*b[1]+d2;
  if(Math.abs(det)<1e-9){const d=(d1+d2)/2;o.push([b[0]+n1[0]*d,b[1]+n1[1]*d]);}else o.push([(r1*n2[1]-r2*n1[1])/det,(n1[0]*r2-n2[0]*r1)/det]);}
 if(area2(o)<=1e-10)throw new Error('offset');return o;}
function convex(P){let s=0;for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length],c=P[(i+2)%P.length];const cr=(b[0]-a[0])*(c[1]-b[1])-(b[1]-a[1])*(c[0]-b[0]);if(cr<-1e-12)return false;}return true;}
/* ear clipping on a CCW loop → index triples */
function triangulate(P){const n=P.length;if(n<3)return[];if(convex(P)){const t=[];for(let i=1;i<n-1;i++)t.push([0,i,i+1]);return t;}
 const idx=[...Array(n).keys()],T=[];const cr=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 const inT=(p,a,b,c)=>cr(a,b,p)>=-1e-12&&cr(b,c,p)>=-1e-12&&cr(c,a,p)>=-1e-12;let guard=0;
 while(idx.length>3&&guard++<n*n){let cut=false;for(let i=0;i<idx.length;i++){const ia=idx[(i-1+idx.length)%idx.length],ib=idx[i],ic=idx[(i+1)%idx.length],a=P[ia],b=P[ib],c=P[ic];if(cr(a,b,c)<=1e-14)continue;
   let ok=true;for(const j of idx){if(j===ia||j===ib||j===ic)continue;const q=P[j];if((q[0]===a[0]&&q[1]===a[1])||(q[0]===b[0]&&q[1]===b[1])||(q[0]===c[0]&&q[1]===c[1]))continue;if(inT(q,a,b,c)){ok=false;break;}}
   if(ok){T.push([ia,ib,ic]);idx.splice(i,1);cut=true;break;}}if(!cut)break;}
 if(idx.length===3)T.push([idx[0],idx[1],idx[2]]);else if(idx.length>3)for(let i=1;i<idx.length-1;i++)T.push([idx[0],idx[i],idx[i+1]]);return T;}
/* resample a closed loop to N points evenly by length */
function resample(P,N){const L=[0];for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];L.push(L[i]+Math.hypot(b[0]-a[0],b[1]-a[1]));}const tot=L[P.length],o=[];let j=0;
 for(let k=0;k<N;k++){const s=tot*k/N;while(j<P.length-1&&L[j+1]<s)j++;const a=P[j],b=P[(j+1)%P.length],t=(s-L[j])/((L[j+1]-L[j])||1);o.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}return o;}
const cen2=P=>{let x=0,y=0;for(const p of P){x+=p[0];y+=p[1];}return[x/P.length,y/P.length];};
/* the loop's corners must not be resampled away: keep the original points and add more on long edges */
function densify(P,N){if(P.length>=N)return P.slice();const L=[];let tot=0;for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];L.push(Math.hypot(b[0]-a[0],b[1]-a[1]));tot+=L[i];}const o=[];let extra=N-P.length;const share=L.map(l=>l/tot*extra),cnt=share.map(Math.floor);let left=extra-cnt.reduce((s,v)=>s+v,0);share.map((s,i)=>[s-cnt[i],i]).sort((a,b)=>b[0]-a[0]).forEach(([,i])=>{if(left>0){cnt[i]++;left--;}});
 for(let i=0;i<P.length;i++){const a=P[i],b=P[(i+1)%P.length];o.push(a);for(let k=1;k<=cnt[i];k++){const t=k/(cnt[i]+1);o.push([a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t]);}}return o;}

/* ---------- skinning: matched rings → closed solid (caps from each end loop's own 2D shape) ---------- */
function skin(R,closed,cap0,cap1){const out=[],m=R.length,N=R[0].length;const pairs=closed?m:m-1;
 for(let i=0;i<pairs;i++){const A=R[i],B=R[(i+1)%m];for(let j=0;j<N;j++){const k=(j+1)%N;face(out,[A[j],A[k],B[k],B[j]]);}}
 const cap=(R3,P2,rev)=>{if(convex(P2)){const V=R3.slice();face(out,rev?V.reverse():V);return;}for(const t of triangulate(P2)){const V=[R3[t[0]],R3[t[1]],R3[t[2]]];face(out,rev?V.reverse():V);}};
 if(!closed){cap(R[0],cap0,true);cap(R[m-1],cap1,false);}return out;}

/* ---------- edge rounds on a stack: inward offset at height z for fillet / chamfer size r ---------- */
function edgeZs(k,r,n){if(!(r>0)||!k)return[];if(k==='chamfer')return[[0,r],[r,0]];const o=[];for(let i=0;i<=n;i++){const t=i/n*Math.PI/2;o.push([r-r*Math.cos(t),r-r*Math.sin(t)]);}return o;}// [dz from edge, inward d]
/* stack of 2D loops between zLo and zHi; prof(z) gives the loop (same count every z), dOf(z) the extra inward offset */
function stack(prof,zLo,zHi,dOf,o){o=o||{};const n=o.seg||8,zs=new Map();const put=(z,d)=>{const k=+z.toFixed(9);zs.set(k,Math.max(zs.get(k)||0,d));};
 put(zLo,0);put(zHi,0);if(o.zMid!=null&&o.zMid>zLo&&o.zMid<zHi)put(o.zMid,0);const H=zHi-zLo;
 const bot=edgeZs(o.botK,Math.min(o.botR||0,H*0.999),n),top=edgeZs(o.topK,Math.min(o.topR||0,H*0.999),n);
 if((o.botR||0)+(o.topR||0)>H+1e-9)throw new Error('edge');
 for(const[dz,d]of bot)put(zLo+dz,d);for(const[dz,d]of top)put(zHi-dz,d);
 const Z=[...zs.keys()].sort((a,b)=>a-b);const eAt=z=>{// edge offset at any z
  const f=(E,u)=>{if(!E.length||u>E[E.length-1][0]+1e-12)return 0;for(let i=0;i<E.length-1;i++){const a=E[i],b=E[i+1];if(u>=a[0]-1e-12&&u<=b[0]+1e-12){const t=(u-a[0])/((b[0]-a[0])||1);return a[1]+(b[1]-a[1])*t;}}return E.length?E[0][1]:0;};
  return f(bot,z-zLo)+f(top,zHi-z);};
 const L2=Z.map(z=>offset(prof(z),eAt(z)+(dOf?dOf(z):0)));const R=L2.map((P,i)=>P.map(p=>[p[0],p[1],Z[i]]));return skin(R,false,L2[0],L2[L2.length-1]);}

/* ---------- feature builders (local sketch frame: sketch plane z = 0) ---------- */
const tanD=a=>Math.tan((+a||0)*Math.PI/180);
function zRange(o){const h=Math.abs(+o.h||0),z0=+o.z0||0;if(h<1e-6)throw new Error('height');return o.dir==='down'?[z0-h,z0]:o.dir==='sym'?[z0-h/2,z0+h/2]:[z0,z0+h];}
/* extrude: outer loop + holes, draft (° per side, measured from the start plane), edge rounds, shell */
function extrude(o){const outer=ccw(o.outer),holes=(o.holes||[]).map(ccw);const[zLo,zHi]=zRange(o),z0=+o.z0||0,ta=tanD(o.draft),seg=o.seg||8;
 const dr=z=>Math.abs(z-z0)*ta;const opt={seg,botK:o.botK,botR:+o.botR||0,topK:o.topK,topR:+o.topR||0,zMid:o.dir==='sym'?z0:null};
 let body=stack(()=>outer,zLo,zHi,dr,opt);
 const ex=1e-3*Math.max(1,zHi-zLo);
 if(holes.length){let cut=[];for(const H of holes){const g=z=>{let d=dr(Math.min(Math.max(z,zLo),zHi));const e=(E,u)=>{for(let i=0;i<E.length-1;i++){const p=E[i],q=E[i+1];if(u>=p[0]-1e-12&&u<=q[0]+1e-12){const t=(u-p[0])/((q[0]-p[0])||1);return p[1]+(q[1]-p[1])*t;}}return 0;};
    return d+e(edgeZs(o.botK,opt.botR,seg),Math.max(0,z-zLo))+e(edgeZs(o.topK,opt.topR,seg),Math.max(0,zHi-z));};
   // sample the hole walls at the same heights as the part so the rounds line up
   const Zs=[zLo-ex,zLo,zHi,zHi+ex];for(const[dz]of edgeZs(o.botK,opt.botR,seg))Zs.push(zLo+dz);for(const[dz]of edgeZs(o.topK,opt.topR,seg))Zs.push(zHi-dz);if(o.dir==='sym')Zs.push(z0);
   const Z=[...new Set(Zs.map(z=>+z.toFixed(9)))].sort((a,b)=>a-b);const L2=Z.map(z=>offset(H,-g(Math.min(Math.max(z,zLo),zHi))));cut=union(cut,skin(L2.map((P,i)=>P.map(p=>[p[0],p[1],Z[i]])),false,L2[0],L2[L2.length-1]));}
  body=subtract(body,cut);}
 if(+o.shell>0)body=subtract(body,shellCavity(z=>outer,holes,zLo,zHi,dr,o));
 return body;}
/* the hollow inside a shelled stack: walls of thickness t, open at top / bottom / none */
function shellCavity(prof,holes,zLo,zHi,dr,o){const t=+o.shell,ex=1e-3*Math.max(1,zHi-zLo),op=o.shellOpen||'top';const a=op==='bottom'?zLo-ex:zLo+t,b=op==='top'?zHi+ex:zHi-t;if(b-a<1e-6)throw new Error('shell');
 let cav=stack(z=>prof(Math.min(Math.max(z,zLo),zHi)),a,b,z=>t+dr(Math.min(Math.max(z,zLo),zHi)),{seg:2});
 for(const H of holes){const g=z=>-t-(dr(Math.min(Math.max(z,zLo),zHi)));cav=subtract(cav,stack(()=>H,a-ex,b+ex,g,{seg:2}));}return cav;}
/* loft between two closed loops: A on the start plane, B at height h */
function loft(o){const A=ccw(o.A),B=ccw(o.B);const N=Math.max(48,A.length,B.length);let a=densify(A,N),b=resample(B,N);if(a.length!==N)a=resample(A,N);
 // line the two loops up: start B at the point closest in angle to A's start
 const ca=cen2(a),cb=cen2(b),ang=p=>Math.atan2(p[1],p[0]);const a0=ang([a[0][0]-ca[0],a[0][1]-ca[1]]);let best=0,bd=1e9;for(let i=0;i<N;i++){let d=Math.abs(ang([b[i][0]-cb[0],b[i][1]-cb[1]])-a0);d=Math.min(d,2*Math.PI-d);if(d<bd){bd=d;best=i;}}b=b.slice(best).concat(b.slice(0,best));
 const[zLo,zHi]=zRange(o),flip=o.dir==='down';const lo=flip?b:a,hi=flip?a:b,z0=+o.z0||0,ta=tanD(o.draft);
 const prof=z=>{const t=(z-zLo)/(zHi-zLo);return lo.map((p,i)=>[p[0]+(hi[i][0]-p[0])*t,p[1]+(hi[i][1]-p[1])*t]);};
 const nz=Math.max(2,o.nz||12),opt={seg:o.seg||8,botK:o.botK,botR:+o.botR||0,topK:o.topK,topR:+o.topR||0};
 // a straight loft between different shapes is ruled; extra rings keep it smooth and give the rounds somewhere to live
 const extra=[];for(let i=1;i<nz;i++)extra.push(zLo+(zHi-zLo)*i/nz);
 let body=stackZ(prof,zLo,zHi,z=>Math.abs(z-z0)*ta,opt,extra);
 if(+o.shell>0)body=subtract(body,shellCavity(prof,[],zLo,zHi,z=>Math.abs(z-z0)*ta,o));return body;}
function stackZ(prof,zLo,zHi,dOf,opt,extra){// stack() plus extra heights
 const n=opt.seg||8,bot=edgeZs(opt.botK,Math.min(opt.botR||0,(zHi-zLo)*0.999),n),top=edgeZs(opt.topK,Math.min(opt.topR||0,(zHi-zLo)*0.999),n);if((opt.botR||0)+(opt.topR||0)>zHi-zLo+1e-9)throw new Error('edge');
 const f=(E,u)=>{if(!E.length||u>E[E.length-1][0]+1e-12)return 0;for(let i=0;i<E.length-1;i++){const a=E[i],b=E[i+1];if(u>=a[0]-1e-12&&u<=b[0]+1e-12){const t=(u-a[0])/((b[0]-a[0])||1);return a[1]+(b[1]-a[1])*t;}}return 0;};
 const S=new Set([zLo,zHi,...extra,...bot.map(x=>zLo+x[0]),...top.map(x=>zHi-x[0])].map(z=>+z.toFixed(9)));const Z=[...S].filter(z=>z>=zLo-1e-12&&z<=zHi+1e-12).sort((a,b)=>a-b);
 const L2=Z.map(z=>offset(prof(z),f(bot,z-zLo)+f(top,zHi-z)+(dOf?dOf(z):0)));return skin(L2.map((P,i)=>P.map(p=>[p[0],p[1],Z[i]])),false,L2[0],L2[L2.length-1]);}
/* revolve a closed loop about an axis line in the sketch (point A, direction u), angle in degrees */
function revolve(o){let u=[o.u[0],o.u[1]];const ul=Math.hypot(...u)||1;u=[u[0]/ul,u[1]/ul];const A=o.A;let P=clean2(o.loop);
 let v=[-u[1],u[0]];let rs=P.map(p=>(p[0]-A[0])*v[0]+(p[1]-A[1])*v[1]);if(rs.reduce((s,r)=>s+r,0)<0){u=[-u[0],-u[1]];v=[-v[0],-v[1]];rs=rs.map(r=>-r);}
 if(Math.min(...rs)<-1e-6)throw new Error('axis');
 let L=P.map((p,i)=>[(p[0]-A[0])*u[0]+(p[1]-A[1])*u[1],Math.max(0,rs[i])]);if(area2(L)<0)L.reverse();
 const ang=Math.max(1,Math.min(360,+o.angle||360)),full=ang>=359.999,n=Math.max(8,Math.ceil((o.seg||72)*ang/360));
 const u3=[u[0],u[1],0],v3=[v[0],v[1],0],e3=[0,0,1],A3=[A[0],A[1],0];const a0=(+o.start||0)*Math.PI/180;
 const R=[];for(let k=0;k<(full?n:n+1);k++){const f=a0+ang*Math.PI/180*k/n,c=Math.cos(f),s=Math.sin(f);R.push(L.map(([S_,r])=>[A3[0]+S_*u3[0]+r*(c*v3[0]+s*e3[0]),A3[1]+S_*u3[1]+r*(c*v3[1]+s*e3[1]),A3[2]+r*s]));}
 let body=skin(R,full,L,L);
 if(+o.shell>0){let Li;try{Li=offsetEdges(L,L.map((p,i)=>{const q=L[(i+1)%L.length];return p[1]<1e-6&&q[1]<1e-6?0:+o.shell;}));}catch(e){throw new Error('shell');}const Ri=[];const ex=full?0:0.002;for(let k=0;k<(full?n:n+1);k++){const f=a0-(full?0:ex)+(ang*Math.PI/180+(full?0:2*ex))*k/n,c=Math.cos(f),s=Math.sin(f);Ri.push(Li.map(([S_,r])=>[A3[0]+S_*u3[0]+r*(c*v3[0]+s*e3[0]),A3[1]+S_*u3[1]+r*(c*v3[1]+s*e3[1]),A3[2]+r*s]));}
  body=subtract(body,skin(Ri,full,Li,Li));}
 return body;}
/* sweep a closed profile along a path drawn in the sketch; the profile stands square to the path at every point */
function sweep(o){let prof=ccw(o.prof);const c=o.center||cen2(prof);prof=prof.map(p=>[p[0]-c[0],p[1]-c[1]]);let path=o.path.map(p=>[p[0],p[1]]);const closed=!!o.closed;
 const cp=[];for(const p of path){const q=cp[cp.length-1];if(!q||Math.hypot(q[0]-p[0],q[1]-p[1])>1e-7)cp.push(p);}path=cp;if(closed&&path.length>2&&Math.hypot(path[0][0]-path[path.length-1][0],path[0][1]-path[path.length-1][1])<1e-6)path.pop();
 if(path.length<2)throw new Error('path');const zb=+o.z0||0;
 const ring=(pth,pf,cls)=>{const m=pth.length,R=[];for(let i=0;i<m;i++){const pv=pth[cls?(i-1+m)%m:Math.max(0,i-1)],nx=pth[cls?(i+1)%m:Math.min(m-1,i+1)],p=pth[i];
   let t1=[p[0]-pv[0],p[1]-pv[1]],t2=[nx[0]-p[0],nx[1]-p[1]];const l1=Math.hypot(...t1),l2=Math.hypot(...t2);t1=l1>1e-12?[t1[0]/l1,t1[1]/l1]:null;t2=l2>1e-12?[t2[0]/l2,t2[1]/l2]:null;const a=t1||t2,b=t2||t1;let t=[a[0]+b[0],a[1]+b[1]];const tl=Math.hypot(...t)||1;t=[t[0]/tl,t[1]/tl];
   const m_=1/Math.max(0.25,a[0]*t[0]+a[1]*t[1]),n=[-t[1],t[0]];R.push(pf.map(([U,V])=>[p[0]+n[0]*U*m_,p[1]+n[1]*U*m_,zb+V]));}return R;};
 let body=skin(ring(path,prof,closed),closed,prof,prof);
 if(+o.shell>0){let pi;try{pi=offset(prof,+o.shell);}catch(e){throw new Error('shell');}let ph=path.map(p=>p.slice());
  if(!closed){const ext=(a,b,d)=>{const t=[a[0]-b[0],a[1]-b[1]],l=Math.hypot(...t)||1;return[a[0]+t[0]/l*d,a[1]+t[1]/l*d];};const d=o.shellOpen==='none'?-(+o.shell):0.002;ph[0]=ext(ph[0],ph[1],d);ph[ph.length-1]=ext(ph[ph.length-1],ph[ph.length-2],d);}
  body=subtract(body,skin(ring(ph,pi,closed),closed,pi,pi));}
 return body;}

/* ---------- placement on a plane + transforms ---------- */
// XY: as drawn. XZ: sketch X→X, sketch Y→Z, extrude toward −Y. YZ: sketch X→Y, sketch Y→Z, extrude toward +X. off moves along that plane's normal.
const PLANES={XY:[[1,0,0],[0,1,0],[0,0,1]],XZ:[[1,0,0],[0,0,1],[0,-1,0]],YZ:[[0,1,0],[0,0,1],[1,0,0]]};
function place(ps,plane,off,mv){const M=PLANES[plane]||PLANES.XY,o=off||0,t=mv||[0,0,0];if(plane==='XY'&&!o&&!t[0]&&!t[1]&&!t[2]||(!plane&&!o))return ps;
 const T=v=>{const z=v[2]+o;return[M[0][0]*v[0]+M[1][0]*v[1]+M[2][0]*z+t[0],M[0][1]*v[0]+M[1][1]*v[1]+M[2][1]*z+t[1],M[0][2]*v[0]+M[1][2]*v[1]+M[2][2]*z+t[2]];};
 const out=[];for(const p of ps){const q=mkPoly(p.v.map(T));if(q)out.push(q);}return out;}
function xform(ps,fn,mirror){const out=[];for(const p of ps){let V=p.v.map(fn);if(mirror)V=V.reverse();const q=mkPoly(V);if(q)out.push(q);}return out;}

/* ---------- output ---------- */
function tris(ps){const T=[];for(const p of ps){const V=p.v;for(let i=1;i<V.length-1;i++)T.push([V[0][0],V[0][1],V[0][2],V[i][0],V[i][1],V[i][2],V[i+1][0],V[i+1][1],V[i+1][2]]);}return T;}
function volume(ps){let v=0;for(const p of ps){const V=p.v;for(let i=1;i<V.length-1;i++)v+=dot(V[0],cross(V[i],V[i+1]));}return v/6;}
function area(ps){let a=0;for(const p of ps){const V=p.v;for(let i=1;i<V.length-1;i++)a+=len(cross(sub(V[i],V[0]),sub(V[i+1],V[0])))/2;}return a;}
function stlBin(T,name){const b=new ArrayBuffer(84+T.length*50),dv=new DataView(b);const nm=(name||'MINI CAM solid').slice(0,79);for(let i=0;i<nm.length;i++)dv.setUint8(i,nm.charCodeAt(i)&127);dv.setUint32(80,T.length,true);
 T.forEach((t,i)=>{const o=84+i*50,n=unit(cross(sub([t[3],t[4],t[5]],[t[0],t[1],t[2]]),sub([t[6],t[7],t[8]],[t[0],t[1],t[2]])));for(let k=0;k<3;k++)dv.setFloat32(o+k*4,n[k],true);for(let k=0;k<9;k++)dv.setFloat32(o+12+k*4,t[k],true);dv.setUint16(o+48,0,true);});return new Uint8Array(b);}

window.SOLID={union,subtract,intersect,extrude,revolve,sweep,loft,place,xform,tris,volume,area,box:box3,stlBin,offset,ccw,area2,triangulate,resample,PLANES};
})();
