import {initializeApp,getApps} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged,updatePassword} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getFirestore,doc,getDoc,setDoc,updateDoc,deleteDoc,addDoc,collection,query,where,getDocs,getCountFromServer,onSnapshot,increment,orderBy,limitToLast} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {firebaseConfig} from "./config.js";
const fb=initializeApp(firebaseConfig),auth=getAuth(fb),db=getFirestore(fb);
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=s=>(s||'').replace(/\s+/g,'').toLowerCase(),ADMIN='marwandev',mail=u=>norm(u)+'@monufia.app';
const GR=['الصف الأول الابتدائي','الصف الثاني الابتدائي','الصف الثالث الابتدائي','الصف الرابع الابتدائي','الصف الخامس الابتدائي','الصف السادس الابتدائي','الصف الأول الإعدادي','الصف الثاني الإعدادي','الصف الثالث الإعدادي','الصف الأول الثانوي','الصف الثاني الثانوي','الصف الثالث الثانوي'];
const DAYS=['السبت','الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة'];
const opt=a=>a.map(x=>`<option>${x}</option>`).join(''),now=()=>Date.now();
const lnow=()=>{const d=new Date();d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,16)};
const toast=m=>{const d=document.createElement('div');d.className='fl';d.textContent=m;document.body.prepend(d);setTimeout(()=>d.remove(),4000)};
addEventListener('unhandledrejection',e=>toast('حدث خطأ: '+((e.reason&&e.reason.message)||e.reason)));
const rows=s=>s.docs.map(d=>({id:d.id,...d.data()}));
const get=async(c,f,v)=>rows(await getDocs(query(collection(db,c),where(f,'==',v))));
const all=async c=>rows(await getDocs(collection(db,c)));
const shrink=(file,w=900,q=.6)=>new Promise(r=>{if(!file)return r('');const i=new Image,fr=new FileReader;fr.onload=()=>{i.onload=()=>{const k=Math.min(1,w/i.width),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);r(c.toDataURL('image/jpeg',q))};i.src=fr.result};fr.readAsDataURL(file)});
const yt=u=>(String(u).match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/)||[])[1]||'';
const view=h=>{$('#app').innerHTML=h};
const getIn=async(c,f,v)=>{v=[...new Set(v||[])];const o=[];for(let i=0;i<v.length;i+=10)o.push(...rows(await getDocs(query(collection(db,c),where(f,'in',v.slice(i,i+10))))));return o};
const first2=n=>String(n||'').split(' ').slice(0,2).join(' '),mm=s=>Math.floor(s/60)+':'+String(Math.round(s%60)).padStart(2,'0'),todayName=()=>DAYS[(new Date().getDay()+1)%7];
const TH=['','dark','warm','contrast','ocean','forest','rose','violet','slate','sunset'],THI=['🌞','🌙','📜','◐','🌊','🌿','🌸','🔮','🪨','🌅'],THN=['فاتح','ليلي فخم','دافئ بيج','تباين عالٍ','محيطي','أخضر طبيعة','وردي هادئ','بنفسجي ليلي','رمادي فحمي','غروب'],theme=()=>document.documentElement.dataset.t||'';
const copyTxt=async t=>{try{await navigator.clipboard.writeText(t);toast('تم نسخ الرابط ✅')}catch(e){prompt('انسخ الرابط:',t)}},tlink=id=>location.origin+location.pathname+'#/t/'+id;
const FB='https://www.facebook.com/share/1BnhpQDnQZ/',F=k=>!S.f||S.f[k]!==false,isStaff=()=>!!U&&(U.role=='admin'||(U.role=='mod'&&U.modOn===true)),can=p=>!!U&&(U.role=='admin'||(U.role=='mod'&&U.modOn===true&&(U.perms||[]).includes(p)));
const LOCK='<div class="card">🔒 هذه اللوحة مقفلة أو ليس لديك صلاحية لهذا القسم.</div>';
const NK=()=>'nt_'+(U?U.id:'x'),nload=()=>{try{return JSON.parse(localStorage.getItem(NK())||'[]')}catch(e){return[]}},nsave=l=>{try{localStorage.setItem(NK(),JSON.stringify(l.slice(0,60)))}catch(e){}};
const NL={news:'#/',exam:'#/student',hw:'#/hw',notes:'#/notes',posts:'#/posts',sched:'#/schedule',group:'#/groups'},NI={news:'📢',exam:'📋',hw:'📝',notes:'📚',posts:'🎬',sched:'🗓',group:'💬'};
async function notify(kind,title,grade){try{await addDoc(collection(db,'notifs'),{kind,title:String(title||'').slice(0,120),grade:grade||'',tid:U?U.id:'',tname:U&&U.role=='teacher'?U.name:'',ts:now()})}catch(e){}}
async function loadS(){try{const s=await getDoc(doc(db,'settings','main'));S=s.exists()?s.data():{}}catch(e){S={}}}
async function mkAccount(un,pw){const a2=getApps().find(x=>x.name=='aux')||initializeApp(firebaseConfig,'aux'),au=getAuth(a2),c=await createUserWithEmailAndPassword(au,mail(un),pw);await signOut(au);return c.user.uid}
function paintBell(){const el=$('#bl');if(!el)return;const n=isStaff()?Object.values(UNR).reduce((a,b)=>a+b,0):nload().filter(x=>!x.read).length,b=el.querySelector('b');b.textContent=n>99?'99+':n;b.hidden=!n;if(n&&el.dataset.n!=String(n)){el.classList.remove('ring');void el.offsetWidth;el.classList.add('ring')}el.dataset.n=n}
const supHtml=()=>Object.entries(UNR).map(([t,n])=>`<p>✉ <b>${esc(UNRN[t]||'')}</b> <span class="dot">${n}</span> <a class="btn" href="#/chat/${t}">فتح</a></p>`).join('')||'لا توجد رسائل جديدة ✅';
function dots(){$$('[data-dot]').forEach(e=>{const n=UNR[e.dataset.dot];e.innerHTML=n?`<span class="dot">${n}</span>`:''});const s=$('#sup');if(s)s.innerHTML=supHtml()}
function stopWatch(){if(window.wunsub){window.wunsub();window.wunsub=null}UNR={};UNRN={}}
function startWatch(){stopWatch();if(!U)return;
if(isStaff()){if(!can('support'))return;let first=true;window.wunsub=onSnapshot(query(collection(db,'msgs'),where('ar','==',false)),s=>{UNR={};UNRN={};s.docs.forEach(d=>{const m=d.data();UNR[m.thread]=(UNR[m.thread]||0)+1;UNRN[m.thread]=m.fromName});
if(!first)s.docChanges().forEach(c=>{if(c.type=='added')toast('✉ رسالة دعم جديدة من '+c.doc.data().fromName)});first=false;paintBell();dots()},()=>{});return}
if(U.role=='mod'||!F('notifs'))return;const k='ls_'+U.id;let since=Number(localStorage.getItem(k))||0;if(!since){since=now();localStorage.setItem(k,since)}
window.wunsub=onSnapshot(query(collection(db,'notifs'),where('ts','>',since)),s=>{const l=nload(),fresh=[];
s.docChanges().forEach(c=>{if(c.type!='added')return;const n={id:c.doc.id,...c.doc.data()};if(l.some(x=>x.id==n.id))return;
const ok=n.kind=='news'||(U.role=='student'&&(U.teachers||[]).includes(n.tid)&&(!n.grade||n.grade==U.grade));if(!ok)return;
l.unshift({id:n.id,kind:n.kind,title:n.title,tname:n.tname,ts:n.ts,read:false});fresh.push(n);since=Math.max(since,n.ts)});
if(fresh.length){l.sort((a,b)=>b.ts-a.ts);nsave(l);localStorage.setItem(k,since);fresh.forEach(n=>{const t=(NI[n.kind]||'🔔')+' '+(n.tname?n.tname+': ':'')+n.title;toast(t);if(window.Notification&&Notification.permission=='granted'){try{new Notification('مدرسين المنوفية المعتمدين',{body:t})}catch(e){}}});paintBell()}},()=>{})}
async function standings(){const w=Math.floor(now()/864e6)*864e6,at=rows(await getDocs(query(collection(db,'attempts'),where('ts','>=',w)))),m={};
at.forEach(a=>{const o=m[a.sid]=m[a.sid]||{sid:a.sid,n:a.sname,p:0,c:0};o.p+=a.total?Math.round(100*a.score/a.total):0;o.c++});
const arr=Object.values(m).map(o=>({...o,pts:o.p+5*o.c})).sort((a,b)=>b.pts-a.pts).slice(0,10);
await Promise.all(arr.map(async o=>{const s=await getDoc(doc(db,'users',o.sid));o.teachers=s.exists()?(s.data().teachers||[]):[]}));return{arr,w}}

let U=null,ev=null,VC=null,S={},UNR={},UNRN={};
function paintVC(){const el=$('#vc');if(!el||!VC)return;el.hidden=false;el.title='زيارات اليوم: '+VC.today.toLocaleString('ar-EG')+' — الإجمالي: '+VC.total.toLocaleString('ar-EG');
const b=el.querySelector('b'),from=Number(b.dataset.v||0),to=VC.total,t0=performance.now(),dur=from?500:1400;b.dataset.v=to;
const step=t=>{const k=Math.min(1,(t-t0)/dur);b.textContent=Math.round(from+(to-from)*(1-Math.pow(1-k,3))).toLocaleString('ar-EG');if(k<1)requestAnimationFrame(step)};requestAnimationFrame(step);
if(from&&from!==to){el.classList.remove('tick');void el.offsetWidth;el.classList.add('tick')}}
(async()=>{try{const d=new Date(),k=d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0'),tot=doc(db,'stats','total'),day=doc(db,'stats','d'+k);
if(localStorage.vday!==k){let bad=false;for(const r of [tot,day]){try{const x=await getDoc(r);if(x.exists())await updateDoc(r,{n:increment(1)});else await setDoc(r,{n:1})}catch(e){bad=true}}if(!bad)localStorage.vday=k}
const cur={total:0,today:0},up=()=>{VC={...cur};paintVC()};
onSnapshot(tot,s=>{cur.total=s.exists()?s.data().n:0;up()},()=>{});onSnapshot(day,s=>{cur.today=s.exists()?s.data().n:0;up()},()=>{})}catch(e){}})();
const loadU=async()=>{const u=auth.currentUser;U=null;if(u){const s=await getDoc(doc(db,'users',u.uid));if(s.exists()){U={id:u.uid,...s.data()};if(U.banned){await signOut(auth);U=null;toast('الحساب محظور')}}}};
addEventListener('beforeinstallprompt',e=>{e.preventDefault();ev=e;const b=$('#ins');if(b)b.hidden=false});
function nav(){const ad=U&&U.role=='admin',mod=U&&U.role=='mod',st=isStaff();
const A=(h,t,k)=>(!k||F(k))?`<a href="${h}">${t}</a>`:'';
const L=!U?'<a href="#/login">دخول</a><a href="#/register">تسجيل</a>':(ad||mod)?`<a href="#/admin">⚙ لوحة التحكم</a>${can('students')?'<a href="#/students">👥 الطلاب</a>':''}${A('#/honor','🏅 الشرف','honor')}${A('#/board','الصدارة','board')}<a href="#" id="lo">خروج</a>`
:`<a href="#/dash">لوحتي</a>${A('#/groups','الجروبات','groups')}<a href="#/notes">المذكرات</a><a href="#/posts">الدروس</a><a href="#/schedule">الجدول</a><a href="#/chat">الدعم</a>${A('#/honor','🏅 الشرف','honor')}${A('#/board','الصدارة','board')}<a href="#" id="lo">خروج</a>`;
$('#nav').innerHTML=`<div class="nt"><span class="brand"><a href="#/" class="logo"><img src="icon.svg" width="34" alt=""> مدرسين المنوفية المعتمدين</a>${F('counter')?'<span id="vc" class="vc" hidden><i></i><b>0</b><small>زائر</small></span>':''}</span>
<span class="ctl">${U&&(st||F('notifs'))&&!mod?`<a id="bl" class="bell" href="${st?'#/admin':'#/notifs'}" title="الإشعارات">🔔<b hidden>0</b></a>`:''}${mod&&st?`<a id="bl" class="bell" href="#/admin" title="الإشعارات">🔔<b hidden>0</b></a>`:''}
<span class="tw"><button id="dm" title="تغيير المظهر">🎨</button><div id="tp" hidden>${TH.map((t,i)=>`<button data-th="${i}" class="${theme()==t?'on':''}">${THI[i]} ${THN[i]}</button>`).join('')}</div></span><button id="ins" ${ev?'':'hidden'}>📲</button><button id="mn" class="mn">☰</button></span></div><div class="nl" id="nl">${L}</div>`;
$('#dm').onclick=e=>{e.stopPropagation();$('#tp').hidden=!$('#tp').hidden};
$('#tp').onclick=e=>{const b=e.target.closest('[data-th]');if(!b)return;const i=+b.dataset.th;document.documentElement.dataset.t=TH[i];localStorage.th=TH[i];$$('#tp button').forEach((x,j)=>x.classList.toggle('on',j==i));$('#tp').hidden=true};
$('#mn').onclick=()=>$('#nl').classList.toggle('open');$('#nl').onclick=e=>{if(e.target.closest('a'))$('#nl').classList.remove('open')};
$('#ins').onclick=()=>{if(ev)ev.prompt();$('#ins').hidden=true};const lo=$('#lo');if(lo)lo.onclick=async e=>{e.preventDefault();await signOut(auth);location.hash='#/'};
const fb=/^https:\/\//.test(S.fb||'')?S.fb:FB,tr=S.trial??7;
$('#ft').innerHTML=`<footer class="card"><a class="fbl" href="${esc(fb)}" target="_blank" rel="noopener">📘 تابعنا على فيسبوك</a>${U?'':`<p>${tr>0?`🎁 أول ${tr} أيام مجاناً للمدرسين، ثم `:'للمدرسين: '}${S.p1??75} ج للشهر الأول و${S.p2??150} ج شهرياً — الدفع بالتحويل من لوحة المدرس بعد التسجيل.</p>`}</footer>`;
$('#bn').innerHTML=S.banner?`<div class="bnr">📣 ${esc(S.banner)}</div>`:'';paintBell();paintVC()}
addEventListener('click',e=>{const t=$('#tp');if(t&&!t.hidden&&!e.target.closest('.tw'))t.hidden=true});
const need=(...r)=>{if(!U){location.hash='#/login';return false}if(r.length&&!r.includes(U.role)){view('<div class="card">الصفحة غير موجودة</div>');return false}return true};
const R={};
async function route(){clearInterval(window.tm);if(window.unsub){window.unsub();window.unsub=null}$('#app').onsubmit=null;document.onvisibilitychange=document.oncopy=document.oncut=document.onpaste=document.oncontextmenu=document.onselectstart=null;$('#app').onclick=null;
const [p,a]=location.hash.slice(2).split('/'),FR={groups:'groups',g:'groups',hw:'hw',honor:'honor',board:'board',snotes:'snotes',notifs:'notifs'};
try{if(S.maint&&!isStaff()&&p!='login')return view(`<div class="card hero"><h2>🛠 المنصة في صيانة</h2><p>${esc(S.mm||'نعود قريباً بإذن الله')}</p><a class="btn" href="#/login">دخول المشرفين</a></div>`);
if(FR[p]&&!F(FR[p])&&!(U&&U.role=='admin'))return view('<div class="card">هذه الميزة متوقفة مؤقتاً.</div>');await (R[p||'home']||R.home)(a)}catch(e){console.error(e);view(`<div class="card">حدث خطأ: ${esc(e.message)}</div>`)}}
addEventListener('hashchange',route);
onAuthStateChanged(auth,async()=>{stopWatch();await Promise.all([loadU(),loadS()]);startWatch();nav();route()});

R.home=async()=>{const n=(await all('news').catch(()=>[])).sort((a,b)=>b.ts-a.ts).slice(0,5);
view(`<div class="card hero"><img src="icon.svg" width="90" alt=""><h1 style="margin:8px">مدرسين المنوفية المعتمدين</h1><p>امتحانات • واجبات • جروبات • مذكرات • دروس • جدول حصص • شهادات تقدير</p>${!U||U.role=='teacher'?'<p><b>🎁 أول أسبوع مجاني للمدرسين</b></p>':''}${U?'<a class="btn" href="#/dash">لوحتي</a>':'<a class="btn" href="#/register">ابدأ الآن</a> <a class="btn" href="#/login">تسجيل الدخول</a>'}</div>
<div class="demo"><div class="sc s1"><div class="cap">١ • وضع الامتحان: اختيار الإجابة الصحيحة</div><div class="qz">ما ناتج ٣ × ٤ ؟</div><div class="op"><span>٧</span></div><div class="op ok1"><span>١٢</span><em>✓ الإجابة الصحيحة</em></div><div class="op"><span>٩</span></div></div>
<div class="sc s2"><div class="cap">٢ • الطالب يؤدي الامتحان والنظام يراقب الخروج</div><div class="tmr">⏱ ١٢:٤١</div><div class="exl">🚪 خرج من صفحة الامتحان</div><div class="lvw"><b class="l1">1 / 3</b><b class="l2">2 / 3</b><b class="l3">3 / 3</b></div><div class="cheat">⚠ غشاش</div></div>
<div class="sc s3"><div class="cap">٣ • تصحيح المقالي بالكاميرا وظهور الدرجة</div><div class="ph">📷 ورقة الإجابة<i class="flash"></i></div><div class="upl">✓ تم رفع الإجابة</div><div class="gr">٩ / ١٠</div><div class="fbk">💬 أحسنت يا بطل، كمّل! 👏</div></div>
<div class="dots"><i></i><i></i><i></i></div></div>
${n.map(x=>`<div class="card">📢 ${esc(x.body)}<br><small>${new Date(x.ts).toLocaleString('ar-EG')}</small></div>`).join('')}`)};
R.dash=()=>{if(!U)return location.hash='#/login';if(U.role=='student'&&!(U.teachers||[]).length)return location.hash='#/pick';location.hash='#/'+({admin:'admin',mod:'admin',teacher:'teacher',student:'student'}[U.role])};

function authForm(reg){view(`<form id="f" class="card"><h2>${reg?'تسجيل حساب جديد':'تسجيل الدخول'}</h2>${reg?'<p><span class="tag">🎁 المدرسون: فترة تجربة مجانية</span></p>':''}
${reg?`<label>الاسم الثلاثي (عربي أو إنجليزي)</label><input name="name" required><label>نوع الحساب</label><select name="role"><option value="student">طالب</option><option value="teacher">مدرس</option></select>
<div id="g"><label>الصف الدراسي</label><select name="grade"><option value="">اختر صفك...</option>${opt(GR)}</select><label>المجموعة (اختياري)</label><input name="grp" placeholder="مثال: مجموعة أ"></div>
<div id="ts" style="display:none"><label>المادة التي تدرّسها</label><input name="subject" placeholder="مثال: رياضيات"></div>`:''}
<label>اسم المستخدم</label><input name="username" value="${reg?'':esc(localStorage.lu||'')}" required><label>كلمة المرور</label><input name="pw" type="password" required><button>${reg?'تسجيل':'دخول'}</button></form>`);
if(reg)$('[name=role]').onchange=e=>{$('#g').style.display=e.target.value=='student'?'block':'none';$('#ts').style.display=e.target.value=='teacher'?'block':'none'};
$('#f').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),un=norm(f.get('username')),pw=f.get('pw'),isAd=un===ADMIN;
try{if(!reg){await signInWithEmailAndPassword(auth,mail(un),pw);localStorage.lu=un;location.hash='#/dash';return}
const name=String(f.get('name')).trim().split(/\s+/).join(' '),rl=isAd?'admin':f.get('role'),subj=String(f.get('subject')||'').trim();
if(!isAd&&name.split(' ').length<3)return toast('الاسم الثلاثي مطلوب');if(rl=='student'&&!f.get('grade'))return toast('اختر صفك الدراسي');if(rl=='teacher'&&!subj)return toast('اكتب المادة التي تدرّسها');
let c;try{c=await createUserWithEmailAndPassword(auth,mail(un),pw)}catch(x){if(isAd&&x.code=='auth/email-already-in-use'){await signInWithEmailAndPassword(auth,mail(un),pw);location.hash='#/dash';return}throw x}
const pend=localStorage.pend;await setDoc(doc(db,'users',c.user.uid),{name:isAd?'Marwan Dev':name,username:un,role:rl,grade:rl=='student'?f.get('grade'):'',grp:(f.get('grp')||'').trim(),subject:rl=='teacher'?subj:'',teachers:rl=='student'&&pend?[pend]:[],activeUntil:rl=='teacher'?now()+Math.min(7,Math.max(0,S.trial??7))*864e5:0,banned:false,paidOnce:false,createdAt:now()});
localStorage.removeItem('pend');localStorage.lu=un;await loadU();nav();location.hash='#/dash';route()}
catch(x){toast({'auth/email-already-in-use':'اسم المستخدم مستخدم بالفعل','auth/weak-password':'كلمة المرور 6 أحرف على الأقل','auth/invalid-credential':'بيانات غير صحيحة','auth/invalid-api-key':'مفتاح Firebase غير صحيح'}[x.code]||x.message)}}}
R.login=()=>authForm(false);R.register=()=>authForm(true);

const rowHtml=t=>`<div class="card qrow" data-t="${t}"><b>${t=='mcq'?'اختيار من متعدد':'مقالي (الطالب يصوّر إجابته)'}</b> <button type="button" class="r" onclick="this.parentNode.remove()">🗑 حذف السؤال</button>
<textarea class="q" placeholder="نص السؤال"></textarea><label>صورة السؤال (اختياري)</label><input type="file" class="im" accept="image/*">
${t=='mcq'?`<input class="o" placeholder="الخيار 1"><input class="o" placeholder="الخيار 2"><input class="o" placeholder="الخيار 3"><input class="o" placeholder="الخيار 4"><select class="a"><option value="0">الإجابة الصحيحة: 1</option><option value="1">الإجابة الصحيحة: 2</option><option value="2">الإجابة الصحيحة: 3</option><option value="3">الإجابة الصحيحة: 4</option></select>`:''}</div>`;
R.teacher=async()=>{if(!need('teacher'))return;const act=U.activeUntil>now(),rc=await get('receipts','uid',U.id),pend=rc.some(r=>r.status=='pending'),ex=(await get('exams','tid',U.id)).sort((a,b)=>b.createdAt-a.createdAt),base=U.paidOnce?(S.p2??150):(S.p1??75);
view(`<div class="card"><h3>الاشتراك</h3>${act?`<span class="ok">✅ ${U.paidOnce?'فعّال':'🎁 تجربة مجانية'} حتى ${new Date(U.activeUntil).toLocaleDateString('ar-EG')}</span>`:pend?'⏳ إيصالك قيد المراجعة':(U.paidOnce?'⛔ انتهى اشتراكك':'⛔ انتهت التجربة المجانية — اشترك للاستمرار')}
<form id="pay"><p>المطلوب الآن: <b id="amt">${base}</b> ج على 01147757094</p><div class="row"><input id="cd" placeholder="كود خصم (اختياري)"><button type="button" id="ap">تطبيق</button></div>
<button type="button" id="hn">🏅 احسب خصم التفوق (حتى 70%)</button><br><small id="cm"></small><input type="file" name="r" accept="image/*" required><button>لقد قمت بتحويل الأموال</button></form></div>
<div class="card row"><a class="btn" id="cl">🔗 نسخ رابط صفحتي</a><a class="btn" href="#/groups">💬 جروباتي</a><a class="btn" href="#/posts">🎬 دروسي</a><a class="btn" href="#/schedule">🗓 جدول الحصص</a><a class="btn" href="#/notes">📚 مذكراتي</a><a class="btn" href="#/snotes">📝 ملاحظات الطلاب</a></div>
<form id="ex" class="card"><h3>إنشاء امتحان / واجب</h3><select name="kind"><option value="exam">📋 امتحان</option><option value="hw">📝 واجب</option></select><input name="title" placeholder="العنوان" required><input name="subject" placeholder="المادة" required><select name="grade" required><option value="">اختر الصف...</option>${opt(GR)}</select><input name="grp" placeholder="(اختياري) مجموعة محددة داخل الصف">
<input name="minutes" type="number" min="0" placeholder="المدة بالدقائق (للواجب: 0 = بدون وقت)">البدء <input name="start" type="datetime-local" required>الانتهاء / موعد التسليم <input name="end" type="datetime-local" required>
<textarea name="descr" placeholder="شرح وتعليمات"></textarea><input name="only" placeholder="(اختياري) طلاب محددون: أسماء مستخدمين بفاصلة"><div id="rows">${rowHtml('mcq')}</div>
<button type="button" id="am">➕ اختيار من متعدد</button> <button type="button" id="ae">➕ سؤال مقالي</button> <button>✅ نشر</button></form>
<div class="card"><h3>امتحاناتي وواجباتي</h3>${ex.map(e=>`<p>${e.kind=='hw'?'📝':'📋'} <a href="#/results/${e.id}">${esc(e.title)}</a> — ${esc(e.subject)} <span class="tag">${esc(e.grade)}</span>${e.grp?` <span class="tag">مجموعة ${esc(e.grp)}</span>`:''}<br><small>${esc(e.start.replace('T',' '))} ← ${esc(e.end.replace('T',' '))}</small> <button class="r" data-del="${e.id}">حذف</button></p>`).join('')||'لا يوجد'}</div>`);
$('#cl').onclick=()=>copyTxt(tlink(U.id));$('#am').onclick=()=>$('#rows').insertAdjacentHTML('beforeend',rowHtml('mcq'));$('#ae').onclick=()=>$('#rows').insertAdjacentHTML('beforeend',rowHtml('essay'));
let cpct=0,cid='',hpct=0;const calc=()=>{$('#amt').textContent=Math.round(base*(100-Math.max(cpct,hpct))/100)};
$('#ap').onclick=async()=>{const c=$('#cd').value.trim().toUpperCase().replace(/\s+/g,'');cpct=0;cid='';$('#cm').textContent='';if(!c)return calc();
try{const d=await getDoc(doc(db,'codes',c)),v=d.exists()?d.data():null;if(!v||!v.active||(v.max>0&&v.used>=v.max)){$('#cm').textContent='❌ الكود غير صالح أو منتهي';return calc()}cpct=v.pct;cid=c;$('#cm').textContent='✅ تم تطبيق خصم '+v.pct+'%'}catch(x){$('#cm').textContent='❌ تعذر التحقق من الكود'}calc()};
$('#hn').onclick=async()=>{$('#cm').textContent='جارٍ الحساب...';const {arr}=await standings();let best=0,who='';arr.forEach((o,i)=>{if(o.teachers.includes(U.id)&&70-5*i>best){best=70-5*i;who=first2(o.n)+' (المركز '+(i+1)+')'}});hpct=best;
$('#cm').textContent=best?`🏅 خصم ${best}% بفضل الطالب ${who}`:'لا يوجد طالب من طلابك ضمن أعلى 10 حالياً';calc()};
$('#pay').onsubmit=async e=>{e.preventDefault();const img=await shrink(e.target.r.files[0],1000);await addDoc(collection(db,'receipts'),{uid:U.id,name:U.name,img,ts:now(),status:'pending',code:cpct>0&&cpct>=hpct?cid:'',honor:hpct>cpct?hpct:0,amount:+$('#amt').textContent});toast('تم استلام الإيصال، وسيتم التفعيل بعد مراجعته');route()};
$('#app').onclick=async e=>{const d=e.target.dataset.del;if(d&&confirm('حذف؟')){await deleteDoc(doc(db,'exams',d));route()}};
$('#ex').onsubmit=async e=>{e.preventDefault();if(!act)return toast('فعّل اشتراكك أولاً');const f=e.target,qs=[],a=[],mins=+f.minutes.value||0;
if(f.kind.value=='exam'&&mins<1)return toast('حدد مدة الامتحان بالدقائق');
for(const r of $$('.qrow')){const t=r.dataset.t,q=r.querySelector('.q').value.trim();if(!q)continue;const img=await shrink(r.querySelector('.im').files[0]);let o=[],k=0;
if(t=='mcq'){o=[...r.querySelectorAll('.o')].map(x=>x.value.trim());if(o.some(x=>!x))return toast('أكمل الخيارات الأربعة لكل سؤال');k=+r.querySelector('.a').value}qs.push({t,q,img,o});a.push(k)}
if(!qs.length)return toast('أضف سؤالاً واحداً على الأقل');if(JSON.stringify(qs).length>900000)return toast('الصور كبيرة، قلل عددها');
try{await addDoc(collection(db,'exams'),{kind:f.kind.value,tid:U.id,tname:U.name,title:f.title.value,subject:f.subject.value,grade:f.grade.value,grp:f.grp.value.trim(),minutes:mins,start:f.start.value,end:f.end.value,descr:f.descr.value,only:f.only.value.split(',').map(norm).filter(Boolean),qs,a,createdAt:now()});
notify(f.kind.value,f.title.value,f.grade.value);toast('تم النشر ✅ ويظهر لطلاب: '+f.grade.value);route()}catch(x){toast('تعذر النشر: '+x.message)}}};

R.results=async id=>{if(!need('teacher'))return;const ds=await getDoc(doc(db,'exams',id));if(!ds.exists()||ds.data().tid!=U.id)return view('<div class="card">غير موجود</div>');
const e=ds.data(),at=(await get('attempts','eid',id)).filter(x=>x.tid==U.id).sort((a,b)=>b.score-a.score),es=rows(await getDocs(query(collection(db,'essays'),where('tid','==',U.id),where('eid','==',id))));
const mm=s=>Math.floor(s/60)+':'+String(Math.round(s%60)).padStart(2,'0'),pc=x=>x.total?Math.round(100*x.score/x.total):0;
const st=e.qs.map((q,k)=>{const tt=at.filter(x=>x.times&&x.times[k]!=null),avg=tt.length?tt.reduce((s,x)=>s+x.times[k],0)/tt.length:0;let ok=null,dist=[],n=0;
if(q.t=='mcq'){const aa=at.filter(x=>x.ans&&x.ans[k]!=null&&x.ans[k]!=-2);ok=aa.length?Math.round(100*aa.filter(x=>x.ans[k]==e.a[k]).length/aa.length):null;dist=[0,1,2,3].map(j=>aa.filter(x=>x.ans[k]==j).length);n=aa.length}return{q,avg,ok,dist,n}}),
mx=Math.max(1,...st.map(x=>x.avg)),hard=st.reduce((b,x,i)=>x.avg>st[b].avg?i:b,0);
view(`<div class="card"><h3>${e.kind=='hw'?'📝 واجب: ':''}${esc(e.title)}</h3><p class="po">${esc(e.subject)} — ${esc(e.grade)} — المدرس: ${esc(U.name)} — ${new Date().toLocaleDateString('ar-EG')}</p>
<div class="noprint"><button id="xl">📥 تصدير Excel</button> <button onclick="print()">🖨 طباعة / PDF</button></div>
<table><tr><th>#</th><th>الطالب</th><th>الدرجة</th><th>النسبة</th><th>الخروج</th><th>الوقت</th><th>ملاحظة المدرس</th><th class="noprint">التصحيح</th></tr>
${at.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.sname)} ${x.leaves>3?'<span class="bad">⚠ غشاش</span>':''}</td><td>${x.score}/${x.total}</td><td>${pc(x)}%</td><td>${x.leaves}</td><td>${x.dur?mm(x.dur):'—'}</td><td>${esc(x.feedback||'')}</td><td class="noprint">
${es.filter(s=>s.aid==x.id).sort((a,b)=>a.qi-b.qi).map(s=>`<details><summary>📷 سؤال ${s.qi+1}</summary><img src="${esc(s.img)}"></details>`).join('')}
<form data-g="${x.id}" style="display:flex;flex-direction:column;gap:4px">${x.total>x.mt?`<input name="g" type="number" min="0" max="${x.total-x.mt}" placeholder="درجة المقالي من ${x.total-x.mt}" value="${x.graded?x.score-x.mcq:''}">`:''}<input name="fb" maxlength="500" placeholder="💬 نصيحة أو ملاحظة للطالب" value="${esc(x.feedback||'')}"><button>حفظ</button></form></td></tr>`).join('')||'<tr><td colspan="8">لا توجد تسليمات بعد</td></tr>'}</table></div>
<div class="card"><h3>⏱ متوسط الوقت لكل سؤال</h3><small>السؤال الأبطأ غالباً هو الأصعب</small>${st.map((x,i)=>`<div style="margin:8px 0"><div>سؤال ${i+1}: ${esc(x.q.q.slice(0,60))}${x.ok!=null?` — <span class="tag">صحيح ${x.ok}%</span>`:''}${i==hard&&x.avg>0?' 🔥 <b class="bad">الأكثر استغراقاً</b>':''}</div>${x.ok!=null&&x.n>=3&&x.ok<30?`<div class="bad">⚠ يحتاج مراجعة: ${x.ok}% فقط أجابوا صح وأكثر خيار اختاره الطلاب هو (${x.dist.indexOf(Math.max(...x.dist))+1})${x.dist.indexOf(Math.max(...x.dist))!=e.a[i]?' — تأكد أن مفتاح الإجابة صحيح':''}</div>`:''}
<div style="background:var(--b);border-radius:8px;overflow:hidden"><div style="width:${Math.max(6,100*x.avg/mx)}%;background:${i==hard&&x.avg>0?'#dc2626':'var(--p)'};color:#fff;padding:2px 8px">${x.avg?mm(x.avg):'—'}</div></div></div>`).join('')}</div>`);
const cs=v=>{v=String(v??'');if(/^[=+\-@]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'};
$('#xl').onclick=()=>{const H=['الطالب','درجة الاختيار من متعدد','الدرجة النهائية','من','النسبة %','مرات الخروج','الوقت المستغرق','غشاش','ملاحظة المدرس'],
L=[H,...at.map(x=>[x.sname,x.mcq,x.score,x.total,pc(x),x.leaves,x.dur?mm(x.dur):'',x.leaves>3?'نعم':'لا',x.feedback||''])].map(r=>r.map(cs).join(',')).join('\r\n');
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+L],{type:'text/csv;charset=utf-8'}));a.download=(e.title||'grades').replace(/[\\/:*?"<>|]/g,'_')+'.csv';a.click()};
$('#app').onsubmit=async ev2=>{ev2.preventDefault();const f=ev2.target,g=f.dataset.g;if(!g)return;const a1=at.find(x=>x.id==g),u={feedback:f.fb.value.trim().slice(0,500)};
if(f.g&&f.g.value!==''){u.score=a1.mcq+Math.max(0,Math.min(+f.g.value,a1.total-a1.mt));u.graded=true}
await updateDoc(doc(db,'attempts',g),u);toast('تم الحفظ');route()}};

const feed=(kind,title,form,item,make,extra)=>async()=>{if(!need('teacher','student'))return;const T=U.role=='teacher',tt=U.teachers||[];if(!T&&!tt.length)return location.hash='#/pick';
const rs=(T?await get(kind,'tid',U.id):(await getIn(kind,'tid',tt)).filter(r=>r.grade==U.grade&&(!r.grp||norm(r.grp)==norm(U.grp)))).sort((a,b)=>kind=='sched'?(DAYS.indexOf(a.day)-DAYS.indexOf(b.day)||a.tm.localeCompare(b.tm)):b.ts-a.ts);
view(`<h2>${title}</h2>${extra?extra(rs):''}${T?`<form id="f" class="card">${form}<button>نشر</button></form>`:''}${rs.map(r=>`<div class="card">${item(r)}${T?`<button class="r" data-del="${r.id}">حذف</button>`:''}</div>`).join('')||`<div class="card">لا يوجد${T?'':'<br><small>المعروض هو ما نشره مدرسوك لصفك: '+esc(U.grade)+'</small>'}</div>`}`);
if(T){$('#f').onsubmit=async e=>{e.preventDefault();if(U.activeUntil<=now())return toast('فعّل اشتراكك أولاً');const mk=make(e.target);await addDoc(collection(db,kind),{tid:U.id,tname:U.name,ts:now(),...mk});notify(kind,mk.title,mk.grade);toast('تم');route()};
$('#app').onclick=async e=>{const d=e.target.dataset.del;if(d&&confirm('حذف؟')){await deleteDoc(doc(db,kind,d));route()}}}};
const gsel=`<select name="grade" required><option value="">اختر الصف...</option>${opt(GR)}</select>`;
R.notes=feed('notes','📚 المذكرات والملفات',`<input name="title" placeholder="عنوان المذكرة" required>${gsel}<textarea name="descr" placeholder="وصف المذكرة"></textarea><input name="link" type="url" placeholder="رابط الملف (https://...)" pattern="https://.*" required>`,
 r=>`<b>${esc(r.title)}</b> <span class="tag">${esc(r.grade)}</span><br>👨‍🏫 ${esc(r.tname)} · ${new Date(r.ts).toLocaleDateString('ar-EG')}<p>${esc(r.descr)}</p>${/^https:\/\//.test(r.link)?`<a class="btn" target="_blank" rel="noopener" href="${esc(r.link)}">⬇ فتح / تحميل</a>`:''}`,
 f=>({title:f.title.value,grade:f.grade.value,descr:f.descr.value,link:f.link.value}));
R.posts=feed('posts','🎬 الدروس والبوستات',`<input name="title" placeholder="العنوان" required>${gsel}<textarea name="body" placeholder="النص"></textarea><input name="video" placeholder="رابط فيديو يوتيوب (اختياري)">`,
 r=>`<b>${esc(r.title)}</b> <span class="tag">${esc(r.grade)}</span><br>👨‍🏫 ${esc(r.tname)}<p>${esc(r.body)}</p>${r.video?`<iframe src="https://www.youtube.com/embed/${esc(r.video)}" allowfullscreen></iframe>`:''}`,
 f=>({title:f.title.value,grade:f.grade.value,body:f.body.value,video:yt(f.video.value)}));
R.schedule=feed('sched','🗓 جدول الحصص',`<select name="day">${opt(DAYS)}</select><input type="time" name="tm" required><input name="title" placeholder="المادة / الدرس" required>${gsel}<input name="grp" placeholder="(اختياري) المجموعة">`,
 r=>`<b>${esc(r.day)}</b> ${esc(r.tm)} — ${esc(r.title)} <span class="tag">${esc(r.grade)}</span>${r.grp?` <span class="tag">مجموعة ${esc(r.grp)}</span>`:''} 👨‍🏫 ${esc(r.tname)}`,
 f=>({day:f.day.value,tm:f.tm.value,title:f.title.value,grade:f.grade.value,grp:f.grp.value.trim()}),
 rs=>{const d=todayName(),t=rs.filter(r=>r.day==d);return `<div class="card"><h3>📅 حصص اليوم (${d})</h3>${t.map(r=>`<p><b>${esc(r.tm)}</b> — ${esc(r.title)}${r.grp?` <span class="tag">${esc(r.grp)}</span>`:''} 👨‍🏫 ${esc(r.tname)}</p>`).join('')||'لا توجد حصص اليوم'}</div>`});

const passed=a=>a.total>0&&a.score*100>=a.total*85&&a.leaves<=3;
const sList=kind=>async()=>{if(!need('student'))return;const T=U.teachers||[];if(!T.length)return location.hash='#/pick';const hw=kind=='hw';
const [ex,my]=await Promise.all([getIn('exams','tid',T),get('attempts','sid',U.id)]),done={};my.forEach(a=>done[a.eid]=a);
const l=[],hid=[];ex.filter(e=>(e.kind||'exam')==kind&&e.grade==U.grade&&e.end>=lnow()).forEach(e=>{if(e.grp&&norm(e.grp)!=norm(U.grp))hid.push([e,`مخصص لمجموعة «${e.grp}» ومجموعتك «${U.grp||'غير محددة'}»`]);else if((e.only||[]).length&&!e.only.includes(U.username))hid.push([e,'مخصص لطلاب محددين']);else l.push(e)});
l.sort((a,b)=>a.start.localeCompare(b.start));
view(`<div class="row">${F('hw')?`<a class="btn" href="#/${hw?'student':'hw'}">${hw?'📋 الامتحانات':'📝 الواجبات'}</a>`:''}${F('groups')?'<a class="btn" href="#/groups">💬 الجروبات</a>':''}<a class="btn" href="#/notes">📚 المذكرات</a><a class="btn" href="#/posts">🎬 الدروس</a><a class="btn" href="#/schedule">🗓 الجدول</a><a class="btn" href="#/pick">👨‍🏫 مدرسيّ (${T.length})</a></div>
<h2>${hw?'📝 الواجبات':'📋 الامتحانات المتاحة'}</h2><p><span class="tag">صفك: ${esc(U.grade)}</span>${U.grp?` <span class="tag">مجموعتك: ${esc(U.grp)}</span>`:''}</p>
<details class="card"><summary>✏ تعديل صفي / مجموعتي</summary><form id="gf"><select name="grade">${GR.map(x=>`<option ${x==U.grade?'selected':''}>${x}</option>`).join('')}</select><input name="grp" placeholder="المجموعة (اختياري)" value="${esc(U.grp)}"><button>حفظ</button></form></details>
${l.map(e=>{const a=done[e.id];return `<div class="card"><b>${esc(e.title)}</b> — ${esc(e.subject)}<br>👨‍🏫 ${esc(e.tname)} · ${e.minutes?'⏱ '+e.minutes+' د':'بدون وقت محدد'} · ${esc(e.start.replace('T',' '))} ← ${esc(e.end.replace('T',' '))}<br>
${a?`✅ درجتك ${a.score}/${a.total}${a.dur?` · ⏱ ${mm(a.dur)}`:''} ${passed(a)?`<a class="btn" href="#/cert/${a.id}">🎓 شهادتي</a>`:''}${a.total>a.mt&&!a.graded?'<br><small>⏳ المقالي قيد التصحيح</small>':''}${a.feedback?`<div class="card" style="margin:8px 0 0">💬 <b>ملاحظة الأستاذ ${esc(a.tname)}:</b> ${esc(a.feedback)}</div>`:''}`:`<span class="tag">${e.start>lnow()?'⏳ لم يبدأ بعد':'🟢 متاح الآن'}</span> <a class="btn" href="#/exam/${e.id}">التفاصيل</a>`}</div>`}).join('')||`<div class="card">${hw?'لا توجد واجبات':'لا توجد امتحانات'} حالياً من مدرسيك لصفك.<br><small>تأكد أن صفك ومدرسيك مضبوطين: '+esc(U.grade)+'</small></div>`}
${hid.map(([e,w])=>`<div class="card" style="opacity:.75">🔒 ${esc(e.title)} — ${esc(w)}</div>`).join('')}`);
$('#gf').onsubmit=async e=>{e.preventDefault();await updateDoc(doc(db,'users',U.id),{grade:e.target.grade.value,grp:e.target.grp.value.trim()});await loadU();toast('تم الحفظ');route()}};
R.student=sList('exam');R.hw=sList('hw');
R.exam=async id=>{if(!need('student'))return;const s=await getDoc(doc(db,'exams',id));if(!s.exists())return view('<div class="card">غير موجود</div>');const e=s.data(),d=await getDoc(doc(db,'attempts',id+'_'+U.id)),n=lnow(),ok=e.start<=n&&n<=e.end&&!d.exists();
view(`<div class="card"><h2>${esc(e.title)}</h2><p>👨‍🏫 ${esc(e.tname)} · 📚 ${esc(e.subject)} · ${e.minutes?'⏱ '+e.minutes+' دقيقة':'بدون وقت محدد'}</p><p>${esc(e.descr)}</p><p class="bad">تنبيه: الخروج من صفحة الامتحان أكثر من 3 مرات يُسجَّل كغش.</p>
${ok?`<a class="btn" href="#/take/${id}">▶ ${e.kind=='hw'?'ابدأ الواجب':'ابدأ الامتحان'}</a>`:'غير متاح الآن'} <a class="btn" href="#/student">رجوع</a></div>`)};
R.take=async id=>{if(!need('student'))return;const s=await getDoc(doc(db,'exams',id)),d=await getDoc(doc(db,'attempts',id+'_'+U.id));if(!s.exists())return;const e=s.data(),n=lnow();if(d.exists()||n<e.start||n>e.end)return location.hash='#/student';
const dk='dr_'+U.id+'_'+id;let dr={};try{dr=JSON.parse(localStorage.getItem(dk)||'{}')}catch(x){dr={}}
view(`<div id="tm"></div><form id="f" class="noc">${e.qs.map((q,k)=>`<div class="card qq" style="display:none"><b>سؤال ${k+1} من ${e.qs.length}: ${esc(q.q)}</b>${q.img?`<p><img src="${esc(q.img)}"></p>`:''}
${q.t=='mcq'?q.o.map((o,j)=>`<label style="display:block;padding:6px"><input type="radio" name="a${k}" value="${j}"> ${esc(o)}</label>`).join(''):`<p>📷 صوّر ورقة إجابتك وارفعها:</p><input type="file" id="p${k}" accept="image/*" capture="environment">`}</div>`).join('')}
<button type="button" id="pv">⬅ السابق</button> <button type="button" id="nx">التالي ➡</button> <button id="sb" style="display:none">✅ تسليم</button></form>`);
const qq=$$('.qq'),limit=(e.minutes||0)*60,times=(dr.times&&dr.times.length==e.qs.length)?dr.times:e.qs.map(()=>0);let c=Math.min(dr.c||0,qq.length-1),el=dr.el||0,l=dr.l||0,sent=false,last=Date.now();
const tick=()=>{times[c]+=Math.round((Date.now()-last)/1000);last=Date.now()},getA=()=>{const o={};$$('#f input[type=radio]:checked').forEach(r=>{o[r.name.slice(1)]=r.value});return o},save=()=>{try{localStorage.setItem(dk,JSON.stringify({c,el,l,times,a:getA()}))}catch(x){}};
Object.entries(dr.a||{}).forEach(([k,v])=>{const r=document.querySelector(`input[name=a${k}][value="${v}"]`);if(r)r.checked=true});$$('#f input[type=radio]').forEach(r=>{r.onchange=save});
const show=()=>{qq.forEach((x,i)=>{x.style.display=i==c?'block':'none'});$('#pv').style.display=c?'inline-block':'none';$('#nx').style.display=c<qq.length-1?'inline-block':'none';$('#sb').style.display=c==qq.length-1?'inline-block':'none'};
$('#pv').onclick=()=>{tick();c--;show();save()};$('#nx').onclick=()=>{tick();c++;show();save()};show();
const paint=()=>{$('#tm').textContent=(limit?'⏱ المتبقي ':'⏱ مرّ ')+mm(limit?Math.max(0,limit-el):el)+(dr.el?' (تم استرجاع تقدمك المحفوظ)':'')};
const send=async()=>{if(sent)return;sent=true;clearInterval(window.tm);tick();let m=0,mt=0,ne=0;const ansA=[];
e.qs.forEach((q,k)=>{if(q.t=='mcq'){mt++;const r=document.querySelector(`input[name=a${k}]:checked`);ansA.push(r?+r.value:-1);if(r&&+r.value==e.a[k])m++}else{ne++;ansA.push(-2)}});
try{await setDoc(doc(db,'attempts',id+'_'+U.id),{eid:id,sid:U.id,sname:U.name,tid:e.tid,tname:e.tname,etitle:e.title,esub:e.subject,kind:e.kind||'exam',mcq:m,mt,score:m,total:mt+10*ne,leaves:l,ts:now(),times,ans:ansA,dur:el});
for(let k=0;k<e.qs.length;k++)if(e.qs[k].t=='essay'){const img=await shrink($('#p'+k).files[0]);if(img)await setDoc(doc(db,'essays',id+'_'+U.id+'_'+k),{eid:id,aid:id+'_'+U.id,sid:U.id,tid:e.tid,qi:k,img})}
localStorage.removeItem(dk);toast(`تم التسليم. اختيار من متعدد: ${m}/${mt}${ne?' — المقالي يصححه المدرس':''}`);location.hash=e.kind=='hw'?'#/hw':'#/student'}catch(x){sent=false;toast('تعذر التسليم: '+x.message)}};
$('#f').onsubmit=ev2=>{ev2.preventDefault();send()};paint();
window.tm=setInterval(()=>{el++;paint();if(el%5==0)save();if(limit&&el>=limit)send()},1000);
document.onvisibilitychange=()=>{if(document.hidden){l++;save()}};document.oncopy=document.oncut=document.onpaste=document.oncontextmenu=document.onselectstart=x=>x.preventDefault()};

R.board=async()=>{if(!need())return;const w=Math.floor(now()/864e6)*864e6,at=rows(await getDocs(query(collection(db,'attempts'),where('ts','>=',w)))),m={};
at.forEach(a=>{m[a.sid]=m[a.sid]||{n:a.sname,s:0,c:0};m[a.sid].s+=a.score;m[a.sid].c++});const r=Object.values(m).sort((a,b)=>b.s-a.s).slice(0,20);
view(`<div class="card"><h2>🏆 لوحة الصدارة</h2><small>تتصفّر بعد ${Math.ceil((w+864e6-now())/864e5)} يوم</small><table>${r.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.n)}</td><td>${x.s} نقطة</td><td>${x.c} امتحان</td></tr>`).join('')}</table></div>`)};
R.cert=async id=>{if(!need('student'))return;const s=await getDoc(doc(db,'attempts',id));if(!s.exists()||s.data().sid!=U.id||!passed(s.data()))return view('<div class="card">غير متاح</div>');const a=s.data();
view(`<div style="border:14px double #b8860b;background:#fffdf5;color:#1e3a8a;text-align:center;padding:36px;border-radius:8px"><img src="icon.svg" width="80" alt=""><h1 style="color:#b8860b;font-size:42px;margin:8px">شهادة تقدير</h1><p>تمنح منصة مدرسين المنوفية المعتمدين الطالب/ة</p>
<div style="font-size:34px;border-bottom:2px solid #b8860b;display:inline-block;padding:0 30px;margin:12px">${esc(U.name)}</div><p>لتفوقه/ا في امتحان «${esc(a.etitle)}» — ${esc(a.esub)}<br>بدرجة ${a.score} من ${a.total}</p><p>المدرس: ${esc(a.tname)} · ${new Date().toLocaleDateString('ar-EG')}</p><b>Marwan Dev</b></div>
<center><button class="noprint" onclick="print()">🖨 طباعة / حفظ PDF</button></center>`)};

R.chat=async uid=>{if(!need())return;const staff=isStaff();if(U.role=='mod'&&!staff)return view(LOCK);const th=staff?uid:U.id;if(staff&&!can('support'))return view(LOCK);if(!th)return location.hash='#/admin';
const load=async()=>{const m=(await get('msgs','thread',th)).sort((a,b)=>a.ts-b.ts);const bx=$('#ms');if(!bx)return;bx.innerHTML=m.map(x=>`<div class="msg ${x.from==U.id?'me':''}">${esc(x.body)}<br><small>${new Date(x.ts).toLocaleString('ar-EG')}</small></div>`).join('')||'لا توجد رسائل';
if(staff)m.filter(x=>x.ar===false).forEach(x=>{updateDoc(doc(db,'msgs',x.id),{ar:true}).catch(()=>{})})};
view(`<div class="card"><h3>💬 ${staff?'محادثة دعم':'الدعم الفني / Marwan Dev'}</h3><div id="ms"></div><form id="f" class="row"><input name="b" placeholder="اكتب رسالتك" required autocomplete="off"><button>إرسال</button></form></div>`);await load();window.tm=setInterval(load,6000);
$('#f').onsubmit=async e=>{e.preventDefault();const b=e.target.b.value.trim().slice(0,1000);if(!b)return;await addDoc(collection(db,'msgs'),{thread:th,from:U.id,fromName:U.name,body:b,ts:now(),ar:staff});e.target.reset();load()}};
R.notifs=async()=>{if(!need())return;if(isStaff()||U.role=='mod')return location.hash='#/admin';const l=nload();
view(`<h2>🔔 الإشعارات</h2><div class="row"><button id="ok">✔ تعليم الكل كمقروء</button><button id="bn2">🔔 تفعيل إشعارات المتصفح</button><button class="r" id="cl2">مسح الكل</button></div>
${l.map(n=>`<a class="card nt${n.read?'':' un'}" href="${NL[n.kind]||'#/'}"><b>${NI[n.kind]||'🔔'} ${esc(n.title)}</b><br><small>${n.tname?esc(n.tname)+' · ':''}${new Date(n.ts).toLocaleString('ar-EG')}</small></a>`).join('')||'<div class="card">لا توجد إشعارات حالياً</div>'}`);
l.forEach(n=>{n.read=true});nsave(l);paintBell();
$('#ok').onclick=()=>toast('تم');$('#cl2').onclick=()=>{nsave([]);paintBell();route()};
$('#bn2').onclick=async()=>{if(!window.Notification)return toast('المتصفح لا يدعم الإشعارات');const p=await Notification.requestPermission();toast(p=='granted'?'تم التفعيل ✅ (تعمل والموقع مفتوح)':'لم يتم السماح')}};
R.students=async()=>{if(!need('admin','mod'))return;if(!can('students'))return view(LOCK);
const [ss,ts]=await Promise.all([get('users','role','student'),get('users','role','teacher')]),tn={};ts.forEach(t=>{tn[t.id]=t.name+' ('+(t.subject||'—')+')'});ss.sort((a,b)=>(b.createdAt||0)-(a.createdAt||0));
view(`<h2>👥 الطلاب (${ss.length})</h2><div class="card"><small>🔐 كلمات المرور لا تُخزَّن ولا تظهر لأي شخص (حتى Firebase). لو طالب نسي كلمته استخدم زر 🔑 لإنشاء حساب بديل بكلمة مؤقتة.</small></div><input id="q" placeholder="🔍 ابحث بالاسم أو اسم المستخدم أو الصف"><div class="card"><table id="tb"></table></div>`);
const draw=()=>{const q=norm($('#q').value);$('#tb').innerHTML=ss.filter(s=>!q||norm(s.name+s.username+s.grade).includes(q)).map(s=>`<tr><td><b>${esc(s.name)}</b><span data-dot="${s.id}"></span>${s.banned?' <span class="bad">محظور</span>':''}<br><small>${esc(s.username)} · ${esc(s.grade)}${s.grp?' · '+esc(s.grp):''}</small></td>
<td><button data-a="inf" data-id="${s.id}" title="تفاصيل">ℹ</button> <button data-a="edt" data-id="${s.id}" title="تعديل">✏</button> <a class="btn" href="#/chat/${s.id}" title="مراسلة">💬</a> <button data-a="rep" data-id="${s.id}" title="حساب بديل">🔑</button> <button class="r" data-a="ban" data-id="${s.id}" title="حظر">⛔</button> <button class="r" data-a="del" data-id="${s.id}" title="حذف">🗑</button></td></tr><tr id="x${s.id}" hidden><td colspan="2"></td></tr>`).join('')||'<tr><td>لا يوجد</td></tr>';dots()};
draw();$('#q').oninput=draw;
$('#app').onsubmit=async e=>{e.preventDefault();const f=e.target,id=f.dataset.e;if(!id)return;const t=[...f.querySelectorAll('input[name=t]:checked')].map(x=>x.value);await updateDoc(doc(db,'users',id),{grade:f.grade.value,grp:f.grp.value.trim(),teachers:t});toast('تم الحفظ ✅');route()};
$('#app').onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,id=b.dataset.id,s=ss.find(x=>x.id==id),row=$('#x'+id);
if(a=='inf'){row.hidden=!row.hidden;if(row.hidden)return;const at=await get('attempts','sid',id),avg=at.length?Math.round(at.reduce((z,x)=>z+(x.total?100*x.score/x.total:0),0)/at.length):0;
row.firstChild.innerHTML=`<small>الصف: ${esc(s.grade)} · المجموعة: ${esc(s.grp||'—')}<br>المدرسون: ${(s.teachers||[]).map(t=>esc(tn[t]||'—')).join('، ')||'—'}<br>تاريخ التسجيل: ${s.createdAt?new Date(s.createdAt).toLocaleDateString('ar-EG'):'—'}<br>عدد التسليمات: ${at.length} · متوسط النسبة: ${avg}%${s.replacedBy?'<br>⚠ تم استبدال حسابه بـ '+esc(s.replacedBy):''}${s.replacedFrom?'<br>🔁 حساب بديل':''}</small>`}
else if(a=='edt'){row.hidden=!row.hidden;if(row.hidden)return;row.firstChild.innerHTML=`<form data-e="${id}"><select name="grade">${GR.map(x=>`<option ${x==s.grade?'selected':''}>${x}</option>`).join('')}</select><input name="grp" value="${esc(s.grp||'')}" placeholder="المجموعة"><div class="chks">${ts.map(t=>`<label class="chk"><input type="checkbox" name="t" value="${t.id}" ${(s.teachers||[]).includes(t.id)?'checked':''}> ${esc(t.name)} (${esc(t.subject||'—')})</label>`).join('')}</div><button>حفظ</button></form>`}
else if(a=='ban'){await updateDoc(doc(db,'users',id),{banned:!s.banned});route()}
else if(a=='del'){if(!confirm('حذف ملف الطالب نهائياً؟'))return;await deleteDoc(doc(db,'users',id));route()}
else if(a=='rep'){const nu=norm(prompt('اسم المستخدم الجديد للطالب (إنجليزي وأرقام):',norm(s.username)+'2')||''),np=prompt('كلمة مرور مؤقتة (6 أحرف على الأقل):')||'';if(!nu||np.length<6)return toast('بيانات غير كاملة');
const uid=await mkAccount(nu,np);await setDoc(doc(db,'users',uid),{name:s.name,username:nu,role:'student',grade:s.grade,grp:s.grp||'',subject:'',teachers:s.teachers||[],activeUntil:0,banned:false,paidOnce:false,createdAt:now(),replacedFrom:s.id});await updateDoc(doc(db,'users',s.id),{banned:true,replacedBy:nu});
alert('تم ✅\nاسم المستخدم: '+nu+'\nكلمة المرور المؤقتة: '+np+'\nسلّمها للطالب. درجاته القديمة تظل مرتبطة بحسابه القديم.');route()}}};
R.admin=async()=>{if(!need('admin','mod'))return;if(!isStaff())return view(LOCK);const ad=U.role=='admin';
const [rc,us,nw,cd,cn]=await Promise.all([can('receipts')?all('receipts'):[],ad?all('users'):[],can('news')?all('news'):[],ad?all('codes'):[],ad?Promise.all([getCountFromServer(collection(db,'exams')),getCountFromServer(collection(db,'attempts'))]):[]]);
rc.sort((a,b)=>(b.status=='pending')-(a.status=='pending')||b.ts-a.ts);cd.sort((a,b)=>a.id.localeCompare(b.id));
const n=now(),d=t=>new Date(t).toLocaleDateString('ar-EG'),T=us.filter(u=>u.role=='teacher'),S2=us.filter(u=>u.role=='student'),MD=us.filter(u=>u.role=='mod'),act=T.filter(u=>u.activeUntil>n),trial=act.filter(u=>!u.paidOnce),paid=act.filter(u=>u.paidOnce),
soon=act.filter(u=>u.activeUntil<n+7*864e5).sort((a,b)=>a.activeUntil-b.activeUntil),wk=us.filter(u=>u.createdAt>n-7*864e5).length,seen={};
const mo=new Date();mo.setDate(1);mo.setHours(0,0,0,0);let rev=0,mrev=0;
rc.filter(r=>r.status=='ok').sort((a,b)=>a.ts-b.ts).forEach(r=>{const v=r.amount!=null?r.amount:(seen[r.uid]?150:75);seen[r.uid]=1;rev+=v;if(r.ts>=mo.getTime())mrev+=v});
const box=ad?[['👨‍🏫 المدرسين',T.length],['✅ اشتراك فعّال',act.length],['🎁 في التجربة',trial.length],['💳 مدفوع',paid.length],['🎓 الطلاب',S2.length],['🆕 تسجيلات 7 أيام',wk],['📝 الامتحانات',cn[0].data().count],['✍ التسليمات',cn[1].data().count],['🧾 إيصالات معلقة',rc.filter(r=>r.status=='pending').length],['💰 إيرادات تقديرية',rev+' ج'],['📅 هذا الشهر',mrev+' ج']]:[];
const PM=[['support','✉ الدعم'],['students','👥 الطلاب'],['receipts','🧾 الإيصالات'],['news','📢 الإعلانات']],FL=[['groups','💬 الجروبات'],['hw','📝 الواجبات'],['honor','🏅 لوحة الشرف'],['board','🏆 الصدارة'],['notifs','🔔 الإشعارات'],['counter','👁 عداد الزوار'],['snotes','📝 ملاحظات الطلاب']];
view(`<h2>⚙ لوحة التحكم ${ad?'':'(مشرف)'}</h2>${U.role=='mod'?`<div class="card">صلاحياتك: ${(U.perms||[]).map(p=>(PM.find(x=>x[0]==p)||[0,p])[1]).join(' · ')}</div>`:''}
${can('support')?`<div class="card"><h3>✉ رسائل الدعم غير المقروءة</h3><div id="sup">${supHtml()}</div></div>`:''}${can('students')?'<a class="btn" href="#/students">👥 إدارة الطلاب</a>':''}
${ad?`<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;margin:14px 0">${box.map(([a,b])=>`<div class="card" style="text-align:center;margin:0"><div style="font-size:24px;font-weight:800;color:var(--p)">${b}</div>${a}</div>`).join('')}</div><small>الإيرادات تقديرية من الإيصالات المقبولة.</small>
<div class="card"><h3>⏰ اشتراكات تنتهي خلال 7 أيام</h3>${soon.map(u=>`<p>${esc(u.name)} — ${u.paidOnce?'مدفوع':'تجربة'} — ينتهي ${d(u.activeUntil)} <a class="btn" href="#/chat/${u.id}">💬</a></p>`).join('')||'لا يوجد'}</div>`:''}
${ad?`<form id="sf" class="card"><h3>🎛 إعدادات المنصة (تشغيل وإيقاف الميزات)</h3>${FL.map(([k,l])=>`<label class="chk"><input type="checkbox" name="f_${k}" ${F(k)?'checked':''}> ${l}</label>`).join('')}
<div class="row"><label>سعر الشهر الأول<input name="p1" type="number" min="0" value="${S.p1??75}"></label><label>السعر الشهري<input name="p2" type="number" min="0" value="${S.p2??150}"></label><label>أيام التجربة (0-7)<input name="trial" type="number" min="0" max="7" value="${S.trial??7}"></label></div>
<label class="chk"><input type="checkbox" name="maint" ${S.maint?'checked':''}> 🛠 وضع الصيانة (يقفل المنصة عن الجميع ما عداك)</label><input name="mm" placeholder="رسالة الصيانة" value="${esc(S.mm||'')}"><input name="bn" placeholder="شريط إعلان أعلى الموقع (فاضي = مخفي)" value="${esc(S.banner||'')}"><input name="fb" placeholder="رابط فيسبوك" value="${esc(S.fb||FB)}"><button>💾 حفظ الإعدادات</button></form>
<div class="card"><h3>🛡 لوحات المشرفين (لوحة تحكم ثانية بصلاحيات محددة)</h3>${MD.map(m=>`<div class="card"><b>${esc(m.name)}</b> <small>${esc(m.username)}</small> ${m.modOn?'<span class="ok">✅ مفعّلة</span>':'<span class="bad">🔒 مقفولة</span>'}<div class="row">${PM.map(([p,l])=>`<label class="chk"><input type="checkbox" data-pm="${m.id}" data-p="${p}" ${(m.perms||[]).includes(p)?'checked':''}> ${l}</label>`).join('')}</div><button data-a="mt" data-id="${m.id}">${m.modOn?'🔒 قفل اللوحة':'✅ تفعيل اللوحة'}</button> <button class="r" data-a="md" data-id="${m.id}">حذف</button></div>`).join('')||'<small>لا توجد لوحات بعد</small>'}
<form id="mf"><input name="n" placeholder="اسم المشرف" required><input name="u" placeholder="اسم المستخدم (إنجليزي)" required><input name="pw" type="password" placeholder="كلمة المرور (6 أحرف على الأقل)" required minlength="6">${PM.map(([p,l])=>`<label class="chk"><input type="checkbox" name="p_${p}"> ${l}</label>`).join('')}<button>➕ إنشاء لوحة مشرف</button></form></div>
<form id="cf" class="card"><h3>🏷 أكواد الخصم</h3><div class="row"><input name="c" placeholder="الكود مثل MENOUFIA50" required><input name="p" type="number" min="1" max="100" placeholder="الخصم %" required><input name="m" type="number" min="0" placeholder="أقصى استخدام (0 = بلا حد)" required></div><button>إضافة كود</button>
<table>${cd.map(c=>`<tr><td><b>${esc(c.id)}</b></td><td>${c.pct}%</td><td>${c.used||0}/${c.max||'∞'}</td><td>${c.active?'🟢':'⚫'}</td><td><button type="button" data-a="ct" data-id="${c.id}">تفعيل/إيقاف</button> <button type="button" class="r" data-a="cx" data-id="${c.id}">حذف</button></td></tr>`).join('')}</table></form>`:''}
${can('news')?`<form id="nf" class="card"><h3>📢 إعلان عام (يصل للطلاب كإشعار)</h3><textarea name="b" required></textarea><button>نشر</button></form>${nw.map(x=>`<div class="card">${esc(x.body)} <button class="r" data-a="dn" data-id="${x.id}">حذف</button></div>`).join('')}`:''}
${can('receipts')?`<div class="card"><h3>🧾 الإيصالات</h3>${rc.map(r=>`<div><b>${esc(r.name)}</b> — ${new Date(r.ts).toLocaleString('ar-EG')} — ${r.status=='pending'?'<span class="bad">بانتظار المراجعة</span>':r.status=='ok'?'<span class="ok">مقبول</span>':'مرفوض'}${r.amount!=null?` — المبلغ المفروض <b>${r.amount} ج</b>`:''}${r.code?` — كود <b>${esc(r.code)}</b>`:''}${r.honor?` — 🏅 خصم تفوق <b>${r.honor}%</b>`:''}<br><img src="${esc(r.img)}" style="max-width:260px;border-radius:10px">
${r.status=='pending'?`<div><button class="g" data-a="ok" data-id="${r.id}" data-u="${r.uid}">✅ قبول وتفعيل شهر</button> <button class="r" data-a="no" data-id="${r.id}">❌ رفض</button></div>`:''}</div><hr>`).join('')||'لا توجد إيصالات'}</div>`:''}
${ad?`<div class="card"><h3>👨‍🏫 المدرسون</h3><table>${T.map(u=>`<tr><td>${esc(u.name)}<span data-dot="${u.id}"></span><br><small>${esc(u.username)} · ${esc(u.subject||'—')} · ${u.activeUntil>n?'✅ فعّال':'⛔ غير فعّال'}</small></td><td>${u.banned?'⛔ محظور':''}</td>
<td><a class="btn" href="#/chat/${u.id}">💬</a> <button class="r" data-a="ban" data-id="${u.id}" data-b="${u.banned?1:''}">حظر/فك</button> <button class="r" data-a="del" data-id="${u.id}">حذف</button></td></tr>`).join('')}</table></div>
<form id="pf" class="card"><h3>🔐 تغيير كلمة مرور الأدمن</h3><input name="p" type="password" placeholder="كلمة جديدة (8 أحرف على الأقل)" minlength="8" required><button>تغيير</button></form>`:''}`);dots();
const sf=$('#sf');if(sf)sf.onsubmit=async e=>{e.preventDefault();const f=e.target,o={f:{}};FL.forEach(([k])=>{o.f[k]=f['f_'+k].checked});
await setDoc(doc(db,'settings','main'),{...o,p1:Math.max(0,+f.p1.value||0),p2:Math.max(0,+f.p2.value||0),trial:Math.min(7,Math.max(0,+f.trial.value||0)),maint:f.maint.checked,mm:f.mm.value.trim(),banner:f.bn.value.trim(),fb:/^https:\/\//.test(f.fb.value.trim())?f.fb.value.trim():FB});await loadS();nav();toast('تم حفظ الإعدادات ✅')};
const mf=$('#mf');if(mf)mf.onsubmit=async e=>{e.preventDefault();const f=e.target,un=norm(f.u.value),perms=PM.map(x=>x[0]).filter(p=>f['p_'+p].checked);if(!perms.length)return toast('اختر صلاحية واحدة على الأقل');if(un==ADMIN)return toast('اسم غير مسموح');
const uid=await mkAccount(un,f.pw.value);await setDoc(doc(db,'users',uid),{name:f.n.value.trim(),username:un,role:'mod',perms,modOn:true,grade:'',grp:'',subject:'',teachers:[],activeUntil:0,banned:false,paidOnce:false,createdAt:now()});toast('تم إنشاء لوحة المشرف ✅');route()};
const pf=$('#pf');if(pf)pf.onsubmit=async e=>{e.preventDefault();try{await updatePassword(auth.currentUser,e.target.p.value);e.target.reset();toast('تم تغيير كلمة المرور ✅')}catch(x){toast(x.code=='auth/requires-recent-login'?'سجّل خروج ثم دخول وحاول تاني':x.message)}};
const nf=$('#nf');if(nf)nf.onsubmit=async e=>{e.preventDefault();const b=e.target.b.value.trim();await addDoc(collection(db,'news'),{body:b,ts:now()});await notify('news',b,'');route()};
const cf=$('#cf');if(cf)cf.onsubmit=async e=>{e.preventDefault();const f=e.target,id=f.c.value.trim().toUpperCase().replace(/\s+/g,'');if(!id||id.includes('/'))return toast('كود غير صالح');await setDoc(doc(db,'codes',id),{pct:Math.min(100,Math.max(1,+f.p.value)),max:Math.max(0,+f.m.value),used:0,active:true});toast('تم إضافة الكود');route()};
$('#app').onchange=async e=>{const c=e.target;if(!c.dataset.pm)return;const m=MD.find(x=>x.id==c.dataset.pm),p=new Set(m.perms||[]);c.checked?p.add(c.dataset.p):p.delete(c.dataset.p);m.perms=[...p];await updateDoc(doc(db,'users',m.id),{perms:m.perms});toast('تم تحديث الصلاحيات')};
$('#app').onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,id=b.dataset.id;
if(a=='ok'){const us1=await getDoc(doc(db,'users',b.dataset.u)),u=us1.data(),r=rc.find(x=>x.id==id);await updateDoc(doc(db,'receipts',id),{status:'ok'});await updateDoc(doc(db,'users',b.dataset.u),{activeUntil:Math.max(now(),u.activeUntil||0)+30*864e5,paidOnce:true});
const c=r&&r.code?cd.find(x=>x.id==r.code):null;if(c)await updateDoc(doc(db,'codes',c.id),{used:(c.used||0)+1})}
else if(a=='no')await updateDoc(doc(db,'receipts',id),{status:'no'});else if(a=='ban')await updateDoc(doc(db,'users',id),{banned:!b.dataset.b});
else if(a=='del'){if(!confirm('حذف نهائي؟'))return;await deleteDoc(doc(db,'users',id))}else if(a=='dn')await deleteDoc(doc(db,'news',id));
else if(a=='ct'){const c=cd.find(x=>x.id==id);await updateDoc(doc(db,'codes',id),{active:!c.active})}else if(a=='cx'){if(!confirm('حذف الكود؟'))return;await deleteDoc(doc(db,'codes',id))}
else if(a=='mt'){const m=MD.find(x=>x.id==id);await updateDoc(doc(db,'users',id),{modOn:!m.modOn})}else if(a=='md'){if(!confirm('حذف لوحة المشرف؟'))return;await deleteDoc(doc(db,'users',id))}route()}};
R.pick=async()=>{if(!need('student'))return;const ts=(await get('users','role','teacher')).sort((a,b)=>a.name.localeCompare(b.name,'ar'));let sel=[...(U.teachers||[])];const p=localStorage.pend;if(p&&!sel.includes(p)&&ts.some(t=>t.id==p))sel.push(p);localStorage.removeItem('pend');
const draw=()=>{const q=norm($('#sq').value);$('#tl').innerHTML=ts.filter(t=>!q||norm(t.name+' '+(t.subject||'')).includes(q)).map(t=>`<div class="card"><b>${esc(t.name)}</b> <span class="tag">${esc(t.subject||'—')}</span>${t.activeUntil>now()?' <span class="tag">✅ فعّال</span>':''}<br><button data-t="${t.id}" class="${sel.includes(t.id)?'r':''}">${sel.includes(t.id)?'✕ إزالة':'➕ إضافة'}</button></div>`).join('')||'<div class="card">لا يوجد مدرسون بهذا الاسم</div>'};
view(`<h2>👨‍🏫 اختر مدرسيك</h2><p>هتظهر لك حصص ومحتوى المدرسين اللي تختارهم بس.</p><input id="sq" placeholder="🔍 ابحث باسم المدرس أو المادة"><div id="tl"></div><button id="sv">💾 حفظ ومتابعة (<span id="cn">${sel.length}</span>)</button>`);
draw();$('#sq').oninput=draw;$('#app').onclick=e=>{const b=e.target.closest('[data-t]');if(!b)return;const i=b.dataset.t;sel=sel.includes(i)?sel.filter(x=>x!=i):[...sel,i];$('#cn').textContent=sel.length;draw()};
$('#sv').onclick=async()=>{if(!sel.length)return toast('اختر مدرساً واحداً على الأقل');if(sel.length>30)return toast('الحد الأقصى 30 مدرساً');await updateDoc(doc(db,'users',U.id),{teachers:sel});await loadU();toast('تم الحفظ ✅');location.hash='#/student'}};
R.t=async id=>{localStorage.pend=id;if(!U)return view('<div class="card hero"><h2>دعوة من مدرسك 👋</h2><p>سجّل حسابك كطالب وهيتضاف مدرسك تلقائياً.</p><a class="btn" href="#/register">تسجيل طالب جديد</a> <a class="btn" href="#/login">عندي حساب</a></div>');
const s=await getDoc(doc(db,'users',id));if(!s.exists()||s.data().role!='teacher')return view('<div class="card">المدرس غير موجود</div>');const t=s.data();
if(U.role=='student'){const tt=U.teachers||[];if(!tt.includes(id)&&tt.length<30){await updateDoc(doc(db,'users',U.id),{teachers:[...tt,id]});await loadU()}localStorage.removeItem('pend');toast('تمت إضافة '+t.name+' لمدرسيك ✅');return location.hash='#/student'}
view(`<div class="card"><h2>${esc(t.name)}</h2><p>${esc(t.subject||'')}</p><button id="cp">🔗 نسخ رابط الصفحة</button></div>`);$('#cp').onclick=()=>copyTxt(tlink(id))};
R.groups=async()=>{if(!need('teacher','student'))return;const T=U.role=='teacher';let gs;
if(T)gs=await get('groups','tid',U.id);else{const tt=U.teachers||[];if(!tt.length)return location.hash='#/pick';gs=(await getIn('groups','tid',tt)).filter(g=>g.grade==U.grade)}
gs.sort((a,b)=>b.ts-a.ts);const mem={};if(!T)await Promise.all(gs.map(async g=>{mem[g.id]=(await getDoc(doc(db,'groups',g.id,'members',U.id))).exists()}));
view(`<h2>💬 الجروبات</h2>${T?`<form id="gf" class="card"><h3>إنشاء جروب</h3><input name="n" placeholder="اسم الجروب" required><select name="grade" required><option value="">اختر الصف...</option>${opt(GR)}</select><textarea name="d" placeholder="وصف الجروب"></textarea><select name="m"><option value="open">🔓 دردشة مفتوحة للطلاب</option><option value="readonly">📢 إعلانات فقط</option></select><button>إنشاء</button></form>`:''}
${gs.map(g=>`<div class="card"><b>${esc(g.name)}</b> <span class="tag">${esc(g.grade)}</span> <span class="tag">${g.mode=='open'?'🔓 مفتوح':'📢 إعلانات فقط'}</span><br>👨‍🏫 ${esc(g.tname)}<p>${esc(g.desc)}</p>
${T?`<a class="btn" href="#/g/${g.id}">فتح</a> <button data-m="${g.id}" data-v="${g.mode}">${g.mode=='open'?'📢 تحويل لإعلانات فقط':'🔓 فتح الدردشة'}</button> <button class="r" data-d="${g.id}">حذف</button>`:mem[g.id]?`<a class="btn" href="#/g/${g.id}">فتح</a>`:`<button data-j="${g.id}">➕ انضم</button>`}</div>`).join('')||'<div class="card">لا توجد جروبات</div>'}`);
if(T)$('#gf').onsubmit=async e=>{e.preventDefault();if(U.activeUntil<=now())return toast('فعّل اشتراكك أولاً');const f=e.target;await addDoc(collection(db,'groups'),{tid:U.id,tname:U.name,name:f.n.value.trim(),desc:f.d.value.trim(),grade:f.grade.value,mode:f.m.value,ts:now()});notify('group',f.n.value.trim(),f.grade.value);toast('تم إنشاء الجروب');route()};
$('#app').onclick=async e=>{const b=e.target.closest('button');if(!b)return;const D=b.dataset;if(D.j){await setDoc(doc(db,'groups',D.j,'members',U.id),{name:U.name,ts:now()});location.hash='#/g/'+D.j;return}
if(D.m){await updateDoc(doc(db,'groups',D.m),{mode:D.v=='open'?'readonly':'open'});route()}else if(D.d&&confirm('حذف الجروب؟')){await deleteDoc(doc(db,'groups',D.d));route()}}};
R.g=async id=>{if(!need('teacher','student'))return;const gs=await getDoc(doc(db,'groups',id));if(!gs.exists())return view('<div class="card">الجروب غير موجود</div>');const g=gs.data(),own=g.tid==U.id;
if(!own&&!(await getDoc(doc(db,'groups',id,'members',U.id))).exists())return view('<div class="card">انضم للجروب أولاً من صفحة الجروبات</div>');const ro=g.mode!='open'&&!own;
view(`<div class="card"><div class="gh"><div><h3>${esc(g.name)}</h3><small>${esc(g.desc)}</small></div><span class="tag">${g.mode=='open'?'🔓 مفتوح':'📢 إعلانات فقط'}</span></div></div>
<div class="card"><div id="gm"></div>${ro?'<p class="tag">📢 الكتابة للمدرس فقط في هذا الجروب</p>':'<form id="mf" class="row"><input name="b" placeholder="اكتب رسالة..." autocomplete="off" required><button>إرسال</button></form>'}</div>`);
window.unsub=onSnapshot(query(collection(db,'groups',id,'msgs'),orderBy('ts'),limitToLast(150)),s=>{const bx=$('#gm');if(!bx)return;bx.innerHTML=s.docs.map(d=>{const m=d.data();return `<div class="msg ${m.from==U.id?'me':''}"><small>${m.t?'👨‍🏫 ':''}${esc(m.fromName)}</small><br>${esc(m.body)}${own?` <a href="#" data-x="${d.id}">🗑</a>`:''}<br><small>${new Date(m.ts).toLocaleTimeString('ar-EG',{hour:'2-digit',minute:'2-digit'})}</small></div>`}).join('')||'لا توجد رسائل بعد';bx.scrollTop=bx.scrollHeight},()=>toast('تعذر تحميل الرسائل'));
const mf=$('#mf');if(mf)mf.onsubmit=async e=>{e.preventDefault();const b=e.target.b.value.trim().slice(0,1000);if(!b)return;e.target.reset();await addDoc(collection(db,'groups',id,'msgs'),{from:U.id,fromName:U.name,body:b,ts:now(),t:own})};
$('#app').onclick=async e=>{const a=e.target.closest('[data-x]');if(a){e.preventDefault();await deleteDoc(doc(db,'groups',id,'msgs',a.dataset.x))}}};
R.snotes=async()=>{if(!need('teacher'))return;const [st,ns]=await Promise.all([getDocs(query(collection(db,'users'),where('teachers','array-contains',U.id))).then(rows),get('snotes','tid',U.id)]);ns.sort((a,b)=>b.ts-a.ts);st.sort((a,b)=>a.name.localeCompare(b.name,'ar'));
view(`<h2>📝 ملاحظات سريعة عن الطلاب</h2><small>خاصة بك أنت فقط، الطالب لا يراها.</small><form id="f" class="card"><select name="s" required><option value="">اختر الطالب...</option>${st.map(x=>`<option value="${x.id}">${esc(x.name)} — ${esc(x.grade)}</option>`).join('')}</select><textarea name="t" placeholder="ملاحظتك (مثال: محتاج متابعة في الكسور)" required></textarea><button>حفظ</button></form>
${ns.map(n=>`<div class="card"><b>${esc(n.sname)}</b> <small>${new Date(n.ts).toLocaleDateString('ar-EG')}</small><p>${esc(n.text)}</p><button class="r" data-del="${n.id}">حذف</button></div>`).join('')||'<div class="card">لا توجد ملاحظات</div>'}`);
$('#f').onsubmit=async e=>{e.preventDefault();const f=e.target,s=st.find(x=>x.id==f.s.value);if(!s)return;await addDoc(collection(db,'snotes'),{tid:U.id,sid:s.id,sname:s.name,text:f.t.value.trim().slice(0,600),ts:now()});toast('تم الحفظ');route()};
$('#app').onclick=async e=>{const d=e.target.dataset.del;if(d&&confirm('حذف؟')){await deleteDoc(doc(db,'snotes',d));route()}}};
R.honor=async()=>{if(!need())return;const [{arr,w},ts]=await Promise.all([standings(),get('users','role','teacher')]),tn={};ts.forEach(t=>{tn[t.id]=t.name});
view(`<div class="card"><h2>🏅 لوحة الشرف</h2><small>أعلى 10 طلاب في هذه الفترة (تتجدد كل 10 أيام — بعد ${Math.ceil((w+864e6-now())/864e5)} يوم). النقاط = نسب الدرجات + 5 نقاط لكل مشاركة.</small></div>
<div class="card"><table>${arr.map((o,i)=>`<tr><td>${['🥇','🥈','🥉'][i]||i+1}</td><td>${esc(first2(o.n))}</td><td><b>${o.pts}</b> نقطة</td><td><small>مدرسوه: ${o.teachers.map(t=>esc(tn[t]||'—')).join('، ')||'—'}</small></td><td><span class="tag">خصم لمدرسيه ${70-5*i}%</span></td></tr>`).join('')||'<tr><td>لا توجد نتائج بعد</td></tr>'}</table></div>
<div class="card">🎁 مدرسو أعلى 10 طلاب يحصلون على خصم على اشتراكهم الشهري يصل إلى 70% (المركز الأول 70% ثم ينقص 5% لكل مركز). المدرس يطبّق الخصم من لوحته بزر "احسب خصم التفوق".</div>`)};
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
