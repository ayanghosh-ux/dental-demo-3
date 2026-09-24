(function(){
var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};
var mob=matchMedia('(max-width:900px)').matches,fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
var nav=$('.nav');
$('.burger').onclick=function(){nav.classList.toggle('open')};
$$('.links a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open')})});
addEventListener('scroll',function(){nav.classList.toggle('sc',scrollY>30)},{passive:true});
$('form').onsubmit=function(e){e.preventDefault();e.target.innerHTML='<h3>Thank you.</h3><p>We have your request and will call you shortly to confirm your appointment.</p>'};
var ba=$('.ba');$('.ba input').oninput=function(e){ba.style.setProperty('--p',e.target.value+'%')};

if(!window.gsap||!window.ScrollTrigger||!window.THREE)return;
gsap.registerPlugin(ScrollTrigger);

/* Text reveals */
gsap.set('.rv',{opacity:0,y:40});
ScrollTrigger.batch('.rv',{start:'top 90%',once:true,onEnter:function(els){gsap.to(els,{opacity:1,y:0,duration:1.1,stagger:.12,ease:'power3.out',overwrite:true})}});
$$('[data-n]').forEach(function(el){
 var n=+el.dataset.n,d=+(el.dataset.d||0),s=el.dataset.s||'',o={v:0};
 ScrollTrigger.create({trigger:el,start:'top 92%',once:true,onEnter:function(){gsap.to(o,{v:n,duration:2,ease:'power2.out',onUpdate:function(){el.textContent=(d?o.v.toFixed(d):Math.round(o.v).toLocaleString())+s}})}});
});

/* Three.js scene */
var cv=$('#c'),R;
try{R=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:!mob,powerPreference:'high-performance'})}catch(e){cv.remove();return}
R.setPixelRatio(Math.min(devicePixelRatio||1,mob?1.4:2));R.outputEncoding=THREE.sRGBEncoding;
var sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(35,1,.1,100);cam.position.z=8;
function size(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}size();
addEventListener('resize',size);

sc.add(new THREE.HemisphereLight(0xffffff,0xa8dcd8,.9));
var dl=new THREE.DirectionalLight(0xffffff,2.1);dl.position.set(3,5,5);sc.add(dl);
var pl=new THREE.PointLight(0x38c9c0,1.6,24);pl.position.set(-4,-2,3);sc.add(pl);
var pb=new THREE.PointLight(0x3b82c4,.9,24);pb.position.set(4,-3,-2);sc.add(pb);

var rig=new THREE.Group(),tooth=new THREE.Group();rig.add(tooth);sc.add(rig);tooth.position.y=.55;
var crownMat=new THREE.MeshPhysicalMaterial({color:0xf7f5ef,roughness:.22,clearcoat:1,clearcoatRoughness:.12});
var rootMat=new THREE.MeshPhysicalMaterial({color:0xeee8da,roughness:.4,clearcoat:.5,emissive:0x1fd0c8,emissiveIntensity:0});
var g=new THREE.SphereGeometry(1,mob?24:48,mob?18:36),p=g.attributes.position;
for(var i=0;i<p.count;i++){var x=p.getX(i),y=p.getY(i),z=p.getZ(i),a=Math.atan2(z,x);
 if(y>0)y+=.14*Math.cos(2*a)*y*y-.22*Math.exp(-(x*x+z*z)*3)*y;
 p.setXYZ(i,x*1.05,y*.85,z*.9)}
g.computeVertexNormals();
tooth.add(new THREE.Mesh(g,crownMat));
var rg=new THREE.CylinderGeometry(.36,.07,1.5,20),roots=[];
[-1,1].forEach(function(s){var m=new THREE.Mesh(rg,rootMat);m.position.set(s*.45,-1.25,0);m.rotation.z=s*.1;tooth.add(m);roots.push(m)});

/* Accessories shown in the interactive section */
var metal=new THREE.MeshStandardMaterial({color:0xb9c6ca,metalness:.85,roughness:.25}),teal=0x38c9c0;
var screw=new THREE.Group();screw.add(new THREE.Mesh(new THREE.CylinderGeometry(.2,.13,1.6,16),metal));
for(i=0;i<6;i++){var th=new THREE.Mesh(new THREE.TorusGeometry(.2-i*.01,.03,8,20),metal);th.rotation.x=Math.PI/2;th.position.y=.6-i*.24;screw.add(th)}
screw.position.y=-1.65;
var brace=new THREE.Group(),bw=new THREE.Mesh(new THREE.TorusGeometry(1.03,.025,8,64),metal);bw.rotation.x=Math.PI/2;bw.scale.y=.88;bw.position.y=.05;
var bk=new THREE.Mesh(new THREE.BoxGeometry(.3,.24,.1),new THREE.MeshStandardMaterial({color:teal,metalness:.4,roughness:.3}));bk.position.set(0,.05,.95);brace.add(bw,bk);
var shell=new THREE.Mesh(g,new THREE.MeshPhysicalMaterial({color:teal,transparent:true,opacity:.3,roughness:.1,clearcoat:1,depthWrite:false}));shell.scale.setScalar(1.09);
var halo=new THREE.Mesh(new THREE.TorusGeometry(1.75,.022,8,90),new THREE.MeshBasicMaterial({color:teal,transparent:true,opacity:.8}));halo.rotation.x=Math.PI/2.2;halo.position.y=.3;
function dot(){var c=document.createElement('canvas');c.width=c.height=64;var x=c.getContext('2d'),gr=x.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'#fff');gr.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=gr;x.fillRect(0,0,64,64);return new THREE.CanvasTexture(c)}
var dt=dot();
function pts(n,r,sz,col,op){var f=new Float32Array(n*3);for(var i=0;i<n;i++){var a=Math.random()*6.28,b=Math.acos(2*Math.random()-1),d=r*(.7+Math.random()*.6);f[i*3]=d*Math.sin(b)*Math.cos(a);f[i*3+1]=d*Math.cos(b);f[i*3+2]=d*Math.sin(b)*Math.sin(a)}
 var gm=new THREE.BufferGeometry();gm.setAttribute('position',new THREE.BufferAttribute(f,3));
 return new THREE.Points(gm,new THREE.PointsMaterial({size:sz,map:dt,color:col,transparent:true,opacity:op,depthWrite:false}))}
var spark=pts(16,1.6,.24,0xffffff,1),dust=pts(mob?18:46,2.6,.09,teal,.7);
var ring=new THREE.Mesh(new THREE.TorusGeometry(2.1,.008,6,120),new THREE.MeshBasicMaterial({color:teal,transparent:true,opacity:.55}));ring.rotation.x=Math.PI/2.4;
var acc={screw:screw,brace:brace,shell:shell,halo:halo,spark:spark};
Object.keys(acc).forEach(function(k){acc[k].scale.setScalar(.001);tooth.add(acc[k])});
rig.add(dust,ring);

/* Scroll-driven camera / position / rotation */
var S={o:1};
function set(sec){var t=sec.dataset.t.split(',').map(Number);
 if(mob){var m=sec.dataset.m;t=m?m.split(',').map(Number):[t[0]*.15,t[1],t[2]*.6,Math.min(t[3],.25)]}
 return {x:t[0],y:t[1],s:t[2],o:t[3]}}
var secs=$$('section[data-t]'),first=set(secs[0]);
rig.position.set(first.x,first.y,0);rig.scale.setScalar(first.s);
secs.forEach(function(sec,i){if(!i)return;var v=set(sec),st={trigger:sec,start:'top 70%',end:'top 20%',scrub:1.2};
 gsap.to(rig.position,{x:v.x,y:v.y,ease:'none',immediateRender:false,scrollTrigger:st});
 gsap.to(rig.scale,{x:v.s,y:v.s,z:v.s,ease:'none',immediateRender:false,scrollTrigger:st});
 gsap.to(S,{o:v.o,ease:'none',immediateRender:false,scrollTrigger:st,onUpdate:function(){cv.style.opacity=S.o}});
 gsap.to(cam.position,{z:i===3?7.2:8,ease:'none',immediateRender:false,scrollTrigger:st})});
gsap.from(rig.scale,{x:.01,y:.01,z:.01,duration:1.6,ease:'expo.out',delay:.15});

var mx=0,my=0,cx=0,cy=0,pulse=0;
if(fine)addEventListener('pointermove',function(e){mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5},{passive:true});
gsap.ticker.add(function(t){
 if(S.o<.03||document.hidden)return;
 var pr=scrollY/Math.max(1,document.body.scrollHeight-innerHeight);
 cx+=(mx-cx)*.06;cy+=(my-cy)*.06;
 rig.rotation.y=t*.35+pr*16+cx*.9;rig.rotation.x=cy*.4+Math.sin(t*.6)*.05;
 tooth.position.y=.55+Math.sin(t*1.1)*.06;
 dust.rotation.y=t*.06;ring.rotation.z=t*.12;halo.rotation.z=t*.5;
 spark.material.size=.2+Math.sin(t*4)*.07;
 R.render(sc,cam)});

/* Interactive treatment lab */
var MODES=[
 {n:'Dental Implants',d:'A titanium post replaces the missing root and fuses with the jawbone, topped with a custom crown. It looks, feels and works like a natural tooth.',acc:'screw',roots:0},
 {n:'Teeth Whitening',d:'A professional gel and cool light lift deep stains safely. Most patients leave several shades brighter after a single visit.',acc:'spark',white:1},
 {n:'Root Canal',d:'We clean the infected inside of the tooth, seal it and protect it, ending the pain while keeping your natural tooth.',glow:1},
 {n:'Braces & Aligners',d:'Nearly invisible aligners or modern braces guide teeth into place step by step. We plan the full result digitally before starting.',acc:'brace'},
 {n:'Dental Crowns',d:'A custom ceramic cap covers a weak or damaged tooth, restoring strength and shape, colour-matched to your smile.',acc:'shell'},
 {n:'Preventive Dentistry',d:'Regular check-ups, scaling and fluoride care form a protective shield around your teeth and gums.',acc:'halo'}];
var chips=$('.chips'),cur=0,active=false;
function C(hex){return new THREE.Color(hex)}
function apply(i){var m=i<0?{}:MODES[i],c=C(m.white?0xffffff:0xf7f5ef),r=C(m.glow?0x86ddd7:0xeee8da);
 gsap.to(crownMat.color,{r:c.r,g:c.g,b:c.b,duration:.7});gsap.to(rootMat.color,{r:r.r,g:r.g,b:r.b,duration:.7});
 gsap.to(rootMat,{emissiveIntensity:m.glow?.9:0,duration:.7});
 roots.forEach(function(x){gsap.to(x.scale,{x:m.roots===0?.001:1,y:m.roots===0?.001:1,z:m.roots===0?.001:1,duration:.7,ease:'back.out(1.4)'})});
 Object.keys(acc).forEach(function(k){var s=k===m.acc?1:.001;gsap.to(acc[k].scale,{x:s,y:s,z:s,duration:.8,ease:'back.out(1.6)'})})}
MODES.forEach(function(m,i){var b=document.createElement('button');b.className='chip'+(i?'':' on');b.textContent=m.n;b.setAttribute('role','tab');
 b.onclick=function(){cur=i;$$('.chip').forEach(function(c,j){c.classList.toggle('on',i===j)});show(i);if(active)apply(i)};chips.appendChild(b)});
function show(i){$('#lt').textContent=MODES[i].n;$('#ld').textContent=MODES[i].d}show(0);
ScrollTrigger.create({trigger:'#lab',start:'top 55%',end:'bottom 35%',
 onToggle:function(s){active=s.isActive;apply(active?cur:-1)}});
addEventListener('load',function(){ScrollTrigger.refresh()});
})();
