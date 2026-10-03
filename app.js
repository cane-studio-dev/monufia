import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {getFirestore,doc,getDoc,setDoc,updateDoc,deleteDoc,addDoc,collection,query,where,getDocs,getCountFromServer} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
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
let U=null,ev=null;
const loadU=async()=>{const u=auth.currentUser;U=null;if(u){const s=await getDoc(doc(db,'users',u.uid));if(s.exists()){U={id:u.uid,...s.data()};if(U.banned){await signOut(auth);U=null;toast('الحساب محظور')}}}};
addEventListener('beforeinstallprompt',e=>{e.preventDefault();ev=e;const b=$('#ins');if(b)b.hidden=false});
function nav(){$('#ft').innerHTML=U?'':'<footer class="card">🎁 أول أسبوع مجاني للمدرسين، ثم 75 ج للشهر الأول و150 ج شهرياً — الدفع بالتحويل من لوحة المدرس بعد التسجيل.</footer>';const l=U?(U.role==='admin'?'<a href="#/admin">لوحة الإدارة</a>':'<a href="#/dash">لوحتي</a><a href="#/notes">المذكرات</a><a href="#/posts">الدروس</a><a href="#/schedule">الجدول</a><a href="#/chat">الدعم</a>')+'<a href="#/board">الصدارة</a><a href="#" id="lo">خروج</a>':'<a href="#/login">دخول</a><a href="#/register">تسجيل</a>';
$('#nav').innerHTML=`<a href="#/" class="logo"><img src="icon.svg" width="34" alt=""> مدرسين المنوفية المعتمدين</a><span>${l}<button id="dm">🌓</button> <button id="ins" ${ev?'':'hidden'}>📲 تثبيت</button></span>`;
$('#dm').onclick=()=>{const d=document.documentElement;d.dataset.t=d.dataset.t=='dark'?'':'dark';localStorage.d=d.dataset.t=='dark'?'1':'0'};
$('#ins').onclick=()=>{ev&&ev.prompt();$('#ins').hidden=true};const lo=$('#lo');if(lo)lo.onclick=async e=>{e.preventDefault();await signOut(auth);location.hash='#/'}}
const need=(...r)=>{if(!U){location.hash='#/login';return false}if(r.length&&!r.includes(U.role)){view('<div class="card">الصفحة غير موجودة</div>');return false}return true};
const R={};
async function route(){clearInterval(window.tm);document.onvisibilitychange=document.oncopy=document.oncut=document.onpaste=document.oncontextmenu=document.onselectstart=null;$('#app').onclick=null;
const [p,a]=location.hash.slice(2).split('/');try{await (R[p||'home']||R.home)(a)}catch(e){console.error(e);view(`<div class="card">حدث خطأ: ${esc(e.message)}</div>`)}}
addEventListener('hashchange',route);
onAuthStateChanged(auth,async()=>{await loadU();nav();route()});

R.home=async()=>{const n=(await all('news').catch(()=>[])).sort((a,b)=>b.ts-a.ts).slice(0,5);
view(`<div class="card hero"><img src="icon.svg" width="90" alt=""><h1 style="margin:8px">مدرسين المنوفية المعتمدين</h1><p>امتحانات • مذكرات • دروس فيديو • جدول حصص • شهادات تقدير</p>${!U||U.role=='teacher'?'<p><b>🎁 أول أسبوع مجاني للمدرسين</b></p>':''}${U?'<a class="btn" href="#/dash">لوحتي</a>':'<a class="btn" href="#/register">ابدأ الآن</a> <a class="btn" href="#/login">تسجيل الدخول</a>'}</div>
<div class="demo"><div class="sc s1"><div class="cap">١ • وضع الامتحان: اختيار الإجابة الصحيحة</div><div class="qz">ما ناتج ٣ × ٤ ؟</div><div class="op"><span>٧</span></div><div class="op ok1"><span>١٢</span><em>✓ الإجابة الصحيحة</em></div><div class="op"><span>٩</span></div></div>
<div class="sc s2"><div class="cap">٢ • الطالب يؤدي الامتحان والنظام يراقب الخروج</div><div class="tmr">⏱ ١٢:٤١</div><div class="exl">🚪 خرج من صفحة الامتحان</div><div class="lvw"><b class="l1">1 / 3</b><b class="l2">2 / 3</b><b class="l3">3 / 3</b></div><div class="cheat">⚠ غشاش</div></div>
<div class="sc s3"><div class="cap">٣ • تصحيح المقالي بالكاميرا وظهور الدرجة</div><div class="ph">📷 ورقة الإجابة<i class="flash"></i></div><div class="upl">✓ تم رفع الإجابة</div><div class="gr">٩ / ١٠</div><div class="fbk">💬 أحسنت يا بطل، كمّل! 👏</div></div>
<div class="dots"><i></i><i></i><i></i></div></div>
${n.map(x=>`<div class="card">📢 ${esc(x.body)}<br><small>${new Date(x.ts).toLocaleString('ar-EG')}</small></div>`).join('')}`)};
R.dash=()=>{if(!U)return location.hash='#/login';location.hash='#/'+({admin:'admin',teacher:'teacher',student:'student'}[U.role])};

function authForm(reg){view(`<form id="f" class="card"><h2>${reg?'تسجيل حساب جديد':'تسجيل الدخول'}</h2>${reg?'<p><span class="tag">🎁 المدرسون: أول أسبوع مجاني</span></p>':''}
${reg?`<label>الاسم الثلاثي (عربي أو إنجليزي)</label><input name="name" required><label>نوع الحساب</label><select name="role"><option value="student">طالب</option><option value="teacher">مدرس</option></select>
<div id="g"><label>الصف الدراسي</label><select name="grade"><option value="">اختر صفك...</option>${opt(GR)}</select><label>المجموعة (اختياري)</label><input name="grp" placeholder="مثال: مجموعة أ"></div>`:''}
<label>اسم المستخدم</label><input name="username" required><label>كلمة المرور</label><input name="pw" type="password" required><button>${reg?'تسجيل':'دخول'}</button></form>`);
if(reg)$('[name=role]').onchange=e=>$('#g').style.display=e.target.value=='student'?'block':'none';
$('#f').onsubmit=async e=>{e.preventDefault();const f=new FormData(e.target),un=norm(f.get('username')),pw=f.get('pw'),isAd=un===ADMIN;
try{if(!reg){await signInWithEmailAndPassword(auth,mail(un),pw);location.hash='#/dash';return}
const name=String(f.get('name')).trim().split(/\s+/).join(' ');if(!isAd&&name.split(' ').length<3)return toast('الاسم الثلاثي مطلوب');
if(!isAd&&f.get('role')=='student'&&!f.get('grade'))return toast('اختر صفك الدراسي');let c;try{c=await createUserWithEmailAndPassword(auth,mail(un),pw)}catch(x){if(isAd&&x.code=='auth/email-already-in-use'){await signInWithEmailAndPassword(auth,mail(un),pw);location.hash='#/dash';return}throw x}
const role=isAd?'admin':f.get('role');await setDoc(doc(db,'users',c.user.uid),{name:isAd?'Marwan Dev':name,username:un,role,grade:role=='student'?f.get('grade'):'',grp:(f.get('grp')||'').trim(),activeUntil:role=='teacher'?now()+7*864e5:0,banned:false,paidOnce:false,createdAt:now()});
await loadU();nav();location.hash='#/dash';route()}
catch(x){toast({'auth/email-already-in-use':'اسم المستخدم مستخدم بالفعل','auth/weak-password':'كلمة المرور 6 أحرف على الأقل','auth/invalid-credential':'بيانات غير صحيحة','auth/invalid-api-key':'مفتاح Firebase غير صحيح'}[x.code]||x.message)}}}
R.login=()=>authForm(false);R.register=()=>authForm(true);

const rowHtml=t=>`<div class="card qrow" data-t="${t}"><b>${t=='mcq'?'اختيار من متعدد':'مقالي (الطالب يصوّر إجابته)'}</b> <button type="button" class="r" onclick="this.parentNode.remove()">🗑 حذف السؤال</button>
<textarea class="q" placeholder="نص السؤال"></textarea><label>صورة السؤال (اختياري)</label><input type="file" class="im" accept="image/*">
${t=='mcq'?`<input class="o" placeholder="الخيار 1"><input class="o" placeholder="الخيار 2"><input class="o" placeholder="الخيار 3"><input class="o" placeholder="الخيار 4"><select class="a"><option value="0">الإجابة الصحيحة: 1</option><option value="1">الإجابة الصحيحة: 2</option><option value="2">الإجابة الصحيحة: 3</option><option value="3">الإجابة الصحيحة: 4</option></select>`:''}</div>`;
R.teacher=async()=>{if(!need('teacher'))return;const act=U.activeUntil>now(),rc=await get('receipts','uid',U.id),pend=rc.some(r=>r.status=='pending'),ex=(await get('exams','tid',U.id)).sort((a,b)=>b.createdAt-a.createdAt);
view(`<div class="card"><h3>الاشتراك</h3>${act?`<span class="ok">✅ ${U.paidOnce?'فعّال':'🎁 تجربة مجانية'} حتى ${new Date(U.activeUntil).toLocaleDateString('ar-EG')}</span>`:pend?'⏳ إيصالك قيد المراجعة':(U.paidOnce?'⛔ انتهى اشتراكك':'⛔ انتهت التجربة المجانية — اشترك للاستمرار')}
<form id="pay"><p>المطلوب الآن: <b id="amt">${U.paidOnce?150:75}</b> ج على 01101687882</p><div style="display:flex;gap:6px"><input id="cd" placeholder="كود خصم (اختياري)" style="margin:0"><button type="button" id="ap">تطبيق</button></div><small id="cm"></small><input type="file" name="r" accept="image/*" required><button>لقد قمت بتحويل الأموال</button></form></div>
<form id="ex" class="card"><h3>إنشاء امتحان</h3><input name="title" placeholder="عنوان الامتحان" required><input name="subject" placeholder="المادة" required><select name="grade" required><option value="">اختر الصف...</option>${opt(GR)}</select><input name="grp" placeholder="(اختياري) مجموعة محددة داخل الصف">
<input name="minutes" type="number" min="1" placeholder="المدة بالدقائق" required>البدء <input name="start" type="datetime-local" required>الانتهاء <input name="end" type="datetime-local" required>
<textarea name="descr" placeholder="شرح وتعليمات الامتحان"></textarea><input name="only" placeholder="(اختياري) طلاب محددون: أسماء مستخدمين بفاصلة"><div id="rows">${rowHtml('mcq')}</div>
<button type="button" id="am">➕ اختيار من متعدد</button> <button type="button" id="ae">➕ سؤال مقالي</button> <button>✅ نشر الامتحان</button></form>
<div class="card"><a class="btn" href="#/posts">🎬 دروسي وبوستاتي</a> <a class="btn" href="#/schedule">🗓 جدول الحصص</a> <a class="btn" href="#/notes">📚 مذكراتي</a></div>
<div class="card"><h3>امتحاناتي</h3>${ex.map(e=>`<p><a href="#/results/${e.id}">${esc(e.title)}</a> — ${esc(e.subject)} <span class="tag">${esc(e.grade)}</span>${e.grp?` <span class="tag">مجموعة ${esc(e.grp)}</span>`:''}<br><small>${esc(e.start.replace('T',' '))} ← ${esc(e.end.replace('T',' '))}</small> <button class="r" data-del="${e.id}">حذف</button></p>`).join('')||'لا توجد امتحانات'}</div>`);
$('#am').onclick=()=>$('#rows').insertAdjacentHTML('beforeend',rowHtml('mcq'));$('#ae').onclick=()=>$('#rows').insertAdjacentHTML('beforeend',rowHtml('essay'));
let appl=null;const base=U.paidOnce?150:75;
$('#ap').onclick=async()=>{const c=$('#cd').value.trim().toUpperCase().replace(/\s+/g,'');appl=null;$('#amt').textContent=base;$('#cm').textContent='';if(!c)return;
try{const d=await getDoc(doc(db,'codes',c)),v=d.exists()?d.data():null;if(!v||!v.active||(v.max>0&&v.used>=v.max)){$('#cm').textContent='❌ الكود غير صالح أو منتهي';return}
appl={id:c,pct:v.pct};$('#amt').textContent=Math.round(base*(100-v.pct)/100);$('#cm').textContent='✅ تم تطبيق خصم '+v.pct+'%'}catch(x){$('#cm').textContent='❌ تعذر التحقق من الكود'}};
$('#pay').onsubmit=async e=>{e.preventDefault();const img=await shrink(e.target.r.files[0],1000);await addDoc(collection(db,'receipts'),{uid:U.id,name:U.name,img,ts:now(),status:'pending',code:appl?appl.id:'',amount:+$('#amt').textContent});toast('تم استلام الإيصال، وسيتم التفعيل بعد مراجعته');route()};
$('#app').onclick=async e=>{const d=e.target.dataset.del;if(d&&confirm('حذف الامتحان؟')){await deleteDoc(doc(db,'exams',d));route()}};
$('#ex').onsubmit=async e=>{e.preventDefault();if(!act)return toast('فعّل اشتراكك أولاً');const f=e.target,qs=[],a=[];
for(const r of $$('.qrow')){const t=r.dataset.t,q=r.querySelector('.q').value.trim();if(!q)continue;const img=await shrink(r.querySelector('.im').files[0]);let o=[],k=0;
if(t=='mcq'){o=[...r.querySelectorAll('.o')].map(x=>x.value.trim());if(o.some(x=>!x))return toast('أكمل الخيارات الأربعة لكل سؤال');k=+r.querySelector('.a').value}qs.push({t,q,img,o});a.push(k)}
if(!qs.length)return toast('أضف سؤالاً واحداً على الأقل');if(JSON.stringify(qs).length>900000)return toast('الصور كبيرة، قلل عددها');
try{await addDoc(collection(db,'exams'),{tid:U.id,tname:U.name,title:f.title.value,subject:f.subject.value,grade:f.grade.value,grp:f.grp.value.trim(),minutes:+f.minutes.value,start:f.start.value,end:f.end.value,descr:f.descr.value,only:f.only.value.split(',').map(norm).filter(Boolean),qs,a,createdAt:now()});toast('تم نشر الامتحان ✅ ويظهر لطلاب: '+f.grade.value);route()}catch(x){toast('تعذر نشر الامتحان: '+x.message)}}};

R.results=async id=>{if(!need('teacher'))return;const ds=await getDoc(doc(db,'exams',id));if(!ds.exists()||ds.data().tid!=U.id)return view('<div class="card">غير موجود</div>');
const e=ds.data(),at=(await get('attempts','eid',id)).filter(x=>x.tid==U.id).sort((a,b)=>b.score-a.score),es=rows(await getDocs(query(collection(db,'essays'),where('tid','==',U.id),where('eid','==',id))));
const mm=s=>Math.floor(s/60)+':'+String(Math.round(s%60)).padStart(2,'0'),pc=x=>x.total?Math.round(100*x.score/x.total):0;
const st=e.qs.map((q,k)=>{const tt=at.filter(x=>x.times&&x.times[k]!=null),avg=tt.length?tt.reduce((s,x)=>s+x.times[k],0)/tt.length:0;let ok=null,dist=[],n=0;
if(q.t=='mcq'){const aa=at.filter(x=>x.ans&&x.ans[k]!=null&&x.ans[k]!=-2);ok=aa.length?Math.round(100*aa.filter(x=>x.ans[k]==e.a[k]).length/aa.length):null;dist=[0,1,2,3].map(j=>aa.filter(x=>x.ans[k]==j).length);n=aa.length}return{q,avg,ok,dist,n}}),
mx=Math.max(1,...st.map(x=>x.avg)),hard=st.reduce((b,x,i)=>x.avg>st[b].avg?i:b,0);
view(`<div class="card"><h3>${esc(e.title)}</h3><p class="po">${esc(e.subject)} — ${esc(e.grade)} — المدرس: ${esc(U.name)} — ${new Date().toLocaleDateString('ar-EG')}</p>
<div class="noprint"><button id="xl">📥 تصدير Excel</button> <button onclick="print()">🖨 طباعة / PDF</button></div>
<table><tr><th>#</th><th>الطالب</th><th>الدرجة</th><th>النسبة</th><th>الخروج</th><th>ملاحظة المدرس</th><th class="noprint">التصحيح</th></tr>
${at.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.sname)} ${x.leaves>3?'<span class="bad">⚠ غشاش</span>':''}</td><td>${x.score}/${x.total}</td><td>${pc(x)}%</td><td>${x.leaves}</td><td>${esc(x.feedback||'')}</td><td class="noprint">
${es.filter(s=>s.aid==x.id).sort((a,b)=>a.qi-b.qi).map(s=>`<details><summary>📷 سؤال ${s.qi+1}</summary><img src="${esc(s.img)}"></details>`).join('')}
<form data-g="${x.id}" style="display:flex;flex-direction:column;gap:4px">${x.total>x.mt?`<input name="g" type="number" min="0" max="${x.total-x.mt}" placeholder="درجة المقالي من ${x.total-x.mt}" value="${x.graded?x.score-x.mcq:''}">`:''}<input name="fb" maxlength="500" placeholder="💬 نصيحة أو ملاحظة للطالب" value="${esc(x.feedback||'')}"><button>حفظ</button></form></td></tr>`).join('')||'<tr><td colspan="7">لا توجد تسليمات بعد</td></tr>'}</table></div>
<div class="card"><h3>⏱ متوسط الوقت لكل سؤال</h3><small>السؤال الأبطأ غالباً هو الأصعب</small>${st.map((x,i)=>`<div style="margin:8px 0"><div>سؤال ${i+1}: ${esc(x.q.q.slice(0,60))}${x.ok!=null?` — <span class="tag">صحيح ${x.ok}%</span>`:''}${i==hard&&x.avg>0?' 🔥 <b class="bad">الأكثر استغراقاً</b>':''}</div>${x.ok!=null&&x.n>=3&&x.ok<30?`<div class="bad">⚠ يحتاج مراجعة: ${x.ok}% فقط أجابوا صح وأكثر خيار اختاره الطلاب هو (${x.dist.indexOf(Math.max(...x.dist))+1})${x.dist.indexOf(Math.max(...x.dist))!=e.a[i]?' — تأكد أن مفتاح الإجابة صحيح':''}</div>`:''}
<div style="background:var(--b);border-radius:8px;overflow:hidden"><div style="width:${Math.max(6,100*x.avg/mx)}%;background:${i==hard&&x.avg>0?'#dc2626':'var(--p)'};color:#fff;padding:2px 8px">${x.avg?mm(x.avg):'—'}</div></div></div>`).join('')}</div>`);
const cs=v=>{v=String(v??'');if(/^[=+\-@]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'};
$('#xl').onclick=()=>{const H=['الطالب','درجة الاختيار من متعدد','الدرجة النهائية','من','النسبة %','مرات الخروج','غشاش','ملاحظة المدرس'],
L=[H,...at.map(x=>[x.sname,x.mcq,x.score,x.total,pc(x),x.leaves,x.leaves>3?'نعم':'لا',x.feedback||''])].map(r=>r.map(cs).join(',')).join('\r\n');
const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+L],{type:'text/csv;charset=utf-8'}));a.download=(e.title||'grades').replace(/[\\/:*?"<>|]/g,'_')+'.csv';a.click()};
$('#app').onsubmit=async ev2=>{ev2.preventDefault();const f=ev2.target,g=f.dataset.g;if(!g)return;const a1=at.find(x=>x.id==g),u={feedback:f.fb.value.trim().slice(0,500)};
if(f.g&&f.g.value!==''){u.score=a1.mcq+Math.max(0,Math.min(+f.g.value,a1.total-a1.mt));u.graded=true}
await updateDoc(doc(db,'attempts',g),u);toast('تم الحفظ');route()}};

const feed=(kind,title,form,item,make)=>async()=>{if(!need('teacher','student'))return;const T=U.role=='teacher',rs=(T?await get(kind,'tid',U.id):await get(kind,'grade',U.grade)).sort((a,b)=>kind=='sched'?(DAYS.indexOf(a.day)-DAYS.indexOf(b.day)||a.tm.localeCompare(b.tm)):b.ts-a.ts);
view(`<h2>${title}</h2>${T?`<form id="f" class="card">${form}<button>نشر</button></form>`:''}${rs.map(r=>`<div class="card">${item(r)}${T?`<button class="r" data-del="${r.id}">حذف</button>`:''}</div>`).join('')||'<div class="card">لا يوجد'+(T?'':'<br><small>المعروض هو ما نشره المدرسون لصفك: '+esc(U.grade)+'</small>')+'</div>'}`);
if(T){$('#f').onsubmit=async e=>{e.preventDefault();if(U.activeUntil<=now())return toast('فعّل اشتراكك أولاً');await addDoc(collection(db,kind),{tid:U.id,tname:U.name,ts:now(),...make(e.target)});toast('تم');route()};
$('#app').onclick=async e=>{const d=e.target.dataset.del;if(d&&confirm('حذف؟')){await deleteDoc(doc(db,kind,d));route()}}}};
const gsel=`<select name="grade" required><option value="">اختر الصف...</option>${opt(GR)}</select>`;
R.notes=feed('notes','📚 المذكرات والملفات',`<input name="title" placeholder="عنوان المذكرة" required>${gsel}<textarea name="descr" placeholder="وصف المذكرة"></textarea><input name="link" type="url" placeholder="رابط الملف (Google Drive أو غيره)" required>`,
 r=>`<b>${esc(r.title)}</b> <span class="tag">${esc(r.grade)}</span><br>👨‍🏫 ${esc(r.tname)} · ${new Date(r.ts).toLocaleDateString('ar-EG')}<p>${esc(r.descr)}</p><a class="btn" target="_blank" rel="noopener" href="${esc(r.link)}">⬇ فتح / تحميل</a>`,
 f=>({title:f.title.value,grade:f.grade.value,descr:f.descr.value,link:f.link.value}));
R.posts=feed('posts','🎬 الدروس والبوستات',`<input name="title" placeholder="العنوان" required>${gsel}<textarea name="body" placeholder="النص"></textarea><input name="video" placeholder="رابط فيديو يوتيوب (اختياري)">`,
 r=>`<b>${esc(r.title)}</b> <span class="tag">${esc(r.grade)}</span><br>👨‍🏫 ${esc(r.tname)}<p>${esc(r.body)}</p>${r.video?`<iframe src="https://www.youtube.com/embed/${esc(r.video)}" allowfullscreen></iframe>`:''}`,
 f=>({title:f.title.value,grade:f.grade.value,body:f.body.value,video:yt(f.video.value)}));
R.schedule=feed('sched','🗓 جدول الحصص',`<select name="day">${opt(DAYS)}</select><input type="time" name="tm" required><input name="title" placeholder="المادة / الدرس" required>${gsel}`,
 r=>`<b>${esc(r.day)}</b> ${esc(r.tm)} — ${esc(r.title)} <span class="tag">${esc(r.grade)}</span> 👨‍🏫 ${esc(r.tname)}`,
 f=>({day:f.day.value,tm:f.tm.value,title:f.title.value,grade:f.grade.value}));

const passed=a=>a.total>0&&a.score*100>=a.total*85&&a.leaves<=3;
R.student=async()=>{if(!need('student'))return;const [ex,my]=await Promise.all([get('exams','grade',U.grade),get('attempts','sid',U.id)]),done={};my.forEach(a=>done[a.eid]=a);
const l=[],hid=[];ex.filter(e=>e.end>=lnow()).forEach(e=>{if(e.grp&&norm(e.grp)!=norm(U.grp))hid.push([e,`مخصص لمجموعة «${e.grp}» ومجموعتك «${U.grp||'غير محددة'}»`]);else if((e.only||[]).length&&!e.only.includes(U.username))hid.push([e,'مخصص لطلاب محددين']);else l.push(e)});l.sort((a,b)=>a.start.localeCompare(b.start));
view(`<a class="btn" href="#/notes">📚 المذكرات</a> <a class="btn" href="#/posts">🎬 الدروس</a> <a class="btn" href="#/schedule">🗓 الجدول</a><h2>الامتحانات المتاحة</h2><p><span class="tag">صفك: ${esc(U.grade)}</span>${U.grp?` <span class="tag">مجموعتك: ${esc(U.grp)}</span>`:''}</p><details class="card"><summary>✏ تعديل صفي / مجموعتي</summary><form id="gf"><select name="grade">${GR.map(x=>`<option ${x==U.grade?'selected':''}>${x}</option>`).join('')}</select><input name="grp" placeholder="المجموعة (اختياري)" value="${esc(U.grp)}"><button>حفظ</button></form></details>
${l.map(e=>{const a=done[e.id];return `<div class="card"><b>${esc(e.title)}</b> — ${esc(e.subject)}<br>👨‍🏫 ${esc(e.tname)} · ⏱ ${e.minutes} د · ${esc(e.start.replace('T',' '))} ← ${esc(e.end.replace('T',' '))}<br>
${a?`✅ درجتك ${a.score}/${a.total} ${passed(a)?`<a class="btn" href="#/cert/${a.id}">🎓 شهادتي</a>`:''}${a.total>a.mt&&!a.graded?'<br><small>⏳ المقالي قيد التصحيح</small>':''}${a.feedback?`<div class="card" style="background:var(--bg);margin:8px 0 0">💬 <b>ملاحظة الأستاذ ${esc(a.tname)}:</b> ${esc(a.feedback)}</div>`:''}`:`<span class="tag">${e.start>lnow()?'⏳ لم يبدأ بعد':'🟢 متاح الآن'}</span> <a class="btn" href="#/exam/${e.id}">التفاصيل</a>`}</div>`}).join('')||'<div class="card">لا توجد امتحانات لصفك حالياً.<br><small>لو مدرسك نشر امتحان ومش ظاهر، اطلب منه يتأكد إنه اختار صفك: '+esc(U.grade)+'</small></div>'}${hid.map(([e,w])=>`<div class="card" style="opacity:.75">🔒 ${esc(e.title)} — ${esc(w)}</div>`).join('')}`);
$('#gf').onsubmit=async e=>{e.preventDefault();await updateDoc(doc(db,'users',U.id),{grade:e.target.grade.value,grp:e.target.grp.value.trim()});await loadU();toast('تم الحفظ');route()}};
R.exam=async id=>{if(!need('student'))return;const s=await getDoc(doc(db,'exams',id));if(!s.exists())return view('<div class="card">غير موجود</div>');const e=s.data(),d=await getDoc(doc(db,'attempts',id+'_'+U.id)),n=lnow(),ok=e.start<=n&&n<=e.end&&!d.exists();
view(`<div class="card"><h2>${esc(e.title)}</h2><p>👨‍🏫 ${esc(e.tname)} · 📚 ${esc(e.subject)} · ⏱ ${e.minutes} دقيقة</p><p>${esc(e.descr)}</p><p class="bad">تنبيه: الخروج من صفحة الامتحان أكثر من 3 مرات يُسجَّل كغش.</p>
${ok?`<a class="btn" href="#/take/${id}">▶ ابدأ الامتحان</a>`:'غير متاح الآن'} <a class="btn" href="#/student">رجوع</a></div>`)};
R.take=async id=>{if(!need('student'))return;const s=await getDoc(doc(db,'exams',id)),d=await getDoc(doc(db,'attempts',id+'_'+U.id));if(!s.exists())return;const e=s.data(),n=lnow();if(d.exists()||n<e.start||n>e.end)return location.hash='#/student';
view(`<div id="tm"></div><form id="f" class="noc">${e.qs.map((q,k)=>`<div class="card qq" style="display:none"><b>سؤال ${k+1} من ${e.qs.length}: ${esc(q.q)}</b>${q.img?`<p><img src="${esc(q.img)}"></p>`:''}
${q.t=='mcq'?q.o.map((o,j)=>`<label style="display:block;padding:6px"><input type="radio" name="a${k}" value="${j}"> ${esc(o)}</label>`).join(''):`<p>📷 صوّر ورقة إجابتك وارفعها:</p><input type="file" id="p${k}" accept="image/*" capture="environment">`}</div>`).join('')}
<button type="button" id="pv">⬅ السابق</button> <button type="button" id="nx">التالي ➡</button> <button id="sb" style="display:none">✅ تسليم الامتحان</button></form>`);
const qq=$$('.qq');let c=0,t=e.minutes*60,l=0,sent=false;const times=e.qs.map(()=>0);let last=Date.now();const tick=()=>{times[c]+=Math.round((Date.now()-last)/1000);last=Date.now()};const show=()=>{qq.forEach((x,i)=>x.style.display=i==c?'block':'none');$('#pv').style.display=c?'inline-block':'none';$('#nx').style.display=c<qq.length-1?'inline-block':'none';$('#sb').style.display=c==qq.length-1?'inline-block':'none'};
$('#pv').onclick=()=>{tick();c--;show()};$('#nx').onclick=()=>{tick();c++;show()};show();
const send=async()=>{if(sent)return;sent=true;clearInterval(window.tm);tick();let m=0,mt=0,ne=0;const ans=[];
e.qs.forEach((q,k)=>{if(q.t=='mcq'){mt++;const r=document.querySelector(`input[name=a${k}]:checked`);ans.push(r?+r.value:-1);if(r&&+r.value==e.a[k])m++}else{ne++;ans.push(-2)}});
try{await setDoc(doc(db,'attempts',id+'_'+U.id),{eid:id,sid:U.id,sname:U.name,tid:e.tid,tname:e.tname,etitle:e.title,esub:e.subject,mcq:m,mt,score:m,total:mt+10*ne,leaves:l,ts:now(),times,ans});
for(let k=0;k<e.qs.length;k++)if(e.qs[k].t=='essay'){const img=await shrink($('#p'+k).files[0]);if(img)await setDoc(doc(db,'essays',id+'_'+U.id+'_'+k),{eid:id,aid:id+'_'+U.id,sid:U.id,tid:e.tid,qi:k,img})}
toast(`تم التسليم. اختيار من متعدد: ${m}/${mt}${ne?' — المقالي يصححه المدرس':''}`);location.hash='#/student'}catch(x){sent=false;toast('تعذر التسليم: '+x.message)}};
$('#f').onsubmit=ev2=>{ev2.preventDefault();send()};
window.tm=setInterval(()=>{$('#tm').textContent='⏱ '+Math.floor(t/60)+':'+String(t%60).padStart(2,'0');if(t--<=0)send()},1000);
document.onvisibilitychange=()=>{if(document.hidden)l++};document.oncopy=document.oncut=document.onpaste=document.oncontextmenu=document.onselectstart=x=>x.preventDefault()};

R.board=async()=>{if(!need())return;const w=Math.floor(now()/864e6)*864e6,at=rows(await getDocs(query(collection(db,'attempts'),where('ts','>=',w)))),m={};
at.forEach(a=>{m[a.sid]=m[a.sid]||{n:a.sname,s:0,c:0};m[a.sid].s+=a.score;m[a.sid].c++});const r=Object.values(m).sort((a,b)=>b.s-a.s).slice(0,20);
view(`<div class="card"><h2>🏆 لوحة الصدارة</h2><small>تتصفّر بعد ${Math.ceil((w+864e6-now())/864e5)} يوم</small><table>${r.map((x,i)=>`<tr><td>${i+1}</td><td>${esc(x.n)}</td><td>${x.s} نقطة</td><td>${x.c} امتحان</td></tr>`).join('')}</table></div>`)};
R.cert=async id=>{if(!need('student'))return;const s=await getDoc(doc(db,'attempts',id));if(!s.exists()||s.data().sid!=U.id||!passed(s.data()))return view('<div class="card">غير متاح</div>');const a=s.data();
view(`<div style="border:14px double #b8860b;background:#fffdf5;color:#1e3a8a;text-align:center;padding:36px;border-radius:8px"><img src="icon.svg" width="80" alt=""><h1 style="color:#b8860b;font-size:42px;margin:8px">شهادة تقدير</h1><p>تمنح منصة مدرسين المنوفية المعتمدين الطالب/ة</p>
<div style="font-size:34px;border-bottom:2px solid #b8860b;display:inline-block;padding:0 30px;margin:12px">${esc(U.name)}</div><p>لتفوقه/ا في امتحان «${esc(a.etitle)}» — ${esc(a.esub)}<br>بدرجة ${a.score} من ${a.total}</p><p>المدرس: ${esc(a.tname)} · ${new Date().toLocaleDateString('ar-EG')}</p><b>Marwan Dev</b></div>
<center><button class="noprint" onclick="print()">🖨 طباعة / حفظ PDF</button></center>`)};

R.chat=async uid=>{if(!need())return;const th=U.role=='admin'?uid:U.id;if(!th)return location.hash='#/admin';
const load=async()=>{const m=(await get('msgs','thread',th)).sort((a,b)=>a.ts-b.ts);$('#ms').innerHTML=m.map(x=>`<div class="msg ${x.from==U.id?'me':''}">${esc(x.body)}<br><small>${new Date(x.ts).toLocaleString('ar-EG')}</small></div>`).join('')||'لا توجد رسائل'};
view(`<div class="card"><h3>💬 الدعم الفني / Marwan Dev</h3><div id="ms"></div><form id="f"><input name="b" placeholder="اكتب رسالتك" required autocomplete="off"><button>إرسال</button></form></div>`);await load();window.tm=setInterval(load,6000);
$('#f').onsubmit=async e=>{e.preventDefault();const b=e.target.b.value.trim().slice(0,1000);if(!b)return;await addDoc(collection(db,'msgs'),{thread:th,from:U.id,fromName:U.name,body:b,ts:now()});e.target.reset();load()}};

R.admin=async()=>{if(!need('admin'))return;const [rc,us,nw,cd,ce,ca]=await Promise.all([all('receipts'),all('users'),all('news'),all('codes'),getCountFromServer(collection(db,'exams')),getCountFromServer(collection(db,'attempts'))]);
rc.sort((a,b)=>(b.status=='pending')-(a.status=='pending')||b.ts-a.ts);cd.sort((a,b)=>a.id.localeCompare(b.id));
const n=now(),d=t=>new Date(t).toLocaleDateString('ar-EG'),T=us.filter(u=>u.role=='teacher'),S=us.filter(u=>u.role=='student'),act=T.filter(u=>u.activeUntil>n),trial=act.filter(u=>!u.paidOnce),paid=act.filter(u=>u.paidOnce),
soon=act.filter(u=>u.activeUntil<n+7*864e5).sort((a,b)=>a.activeUntil-b.activeUntil),wk=us.filter(u=>u.createdAt>n-7*864e5).length,seen={};
const mo=new Date();mo.setDate(1);mo.setHours(0,0,0,0);let rev=0,mrev=0;
rc.filter(r=>r.status=='ok').sort((a,b)=>a.ts-b.ts).forEach(r=>{const v=r.amount!=null?r.amount:(seen[r.uid]?150:75);seen[r.uid]=1;rev+=v;if(r.ts>=mo.getTime())mrev+=v});
const box=[['👨‍🏫 المدرسين',T.length],['✅ اشتراك فعّال',act.length],['🎁 في التجربة',trial.length],['💳 مدفوع',paid.length],['🎓 الطلاب',S.length],['🆕 تسجيلات 7 أيام',wk],['📝 الامتحانات',ce.data().count],['✍ التسليمات',ca.data().count],['🧾 إيصالات معلقة',rc.filter(r=>r.status=='pending').length],['💰 إيرادات تقديرية',rev+' ج'],['📅 هذا الشهر',mrev+' ج']];
view(`<h2>📊 لوحة الإحصائيات</h2><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin-bottom:16px">${box.map(([a,b])=>`<div class="card" style="text-align:center;margin:0"><div style="font-size:26px;font-weight:800;color:var(--p)">${b}</div>${a}</div>`).join('')}</div>
<small>الإيرادات تقديرية من الإيصالات المقبولة (حسب المبلغ المفروض على المدرس بعد الخصم).</small>
<div class="card"><h3>⏰ اشتراكات تنتهي خلال 7 أيام</h3>${soon.map(u=>`<p>${esc(u.name)} — ${u.paidOnce?'مدفوع':'تجربة'} — ينتهي ${d(u.activeUntil)} <a class="btn" href="#/chat/${u.id}">💬 تواصل</a></p>`).join('')||'لا يوجد'}</div>
<form id="cf" class="card"><h3>🏷 أكواد الخصم</h3><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px"><input name="c" placeholder="الكود مثل MENOUFIA50" required><input name="p" type="number" min="1" max="100" placeholder="نسبة الخصم %" required><input name="m" type="number" min="0" placeholder="أقصى عدد استخدام (0 = بلا حد)" required></div><button>إضافة كود</button>
<table>${cd.map(c=>`<tr><td><b>${esc(c.id)}</b></td><td>${c.pct}%</td><td>${c.used||0}/${c.max||'∞'}</td><td>${c.active?'🟢 فعّال':'⚫ موقوف'}</td><td><button type="button" data-a="ct" data-id="${c.id}">تفعيل/إيقاف</button> <button type="button" class="r" data-a="cx" data-id="${c.id}">حذف</button></td></tr>`).join('')}</table></form>
<form id="nf" class="card"><h3>📢 إعلان عام</h3><textarea name="b" required></textarea><button>نشر</button></form>${nw.map(x=>`<div class="card">${esc(x.body)} <button class="r" data-a="dn" data-id="${x.id}">حذف</button></div>`).join('')}
<div class="card"><h3>🧾 الإيصالات</h3>${rc.map(r=>`<div><b>${esc(r.name)}</b> — ${new Date(r.ts).toLocaleString('ar-EG')} — ${r.status=='pending'?'<span class="bad">بانتظار المراجعة</span>':r.status=='ok'?'<span class="ok">مقبول</span>':'مرفوض'}${r.amount!=null?` — المبلغ المفروض <b>${r.amount} ج</b>`:''}${r.code?` — كود <b>${esc(r.code)}</b>`:''}<br><img src="${esc(r.img)}" style="max-width:260px;border-radius:10px">
${r.status=='pending'?`<div><button class="g" data-a="ok" data-id="${r.id}" data-u="${r.uid}">✅ قبول وتفعيل شهر</button> <button class="r" data-a="no" data-id="${r.id}">❌ رفض</button></div>`:''}</div><hr>`).join('')||'لا توجد إيصالات'}</div>
<div class="card"><h3>👥 المستخدمون</h3><table>${us.filter(u=>u.role!='admin').map(u=>`<tr><td>${esc(u.name)}<br><small>${esc(u.username)} · ${u.role=='teacher'?'مدرس · '+(u.activeUntil>n?'✅ فعّال':'⛔ غير فعّال'):'طالب · '+esc(u.grade)}</small></td><td>${u.banned?'⛔ محظور':''}</td>
<td><a class="btn" href="#/chat/${u.id}">💬 رد</a> <button class="r" data-a="ban" data-id="${u.id}" data-b="${u.banned?1:''}">حظر/فك</button> <button class="r" data-a="del" data-id="${u.id}">حذف</button></td></tr>`).join('')}</table></div>`);
$('#nf').onsubmit=async e=>{e.preventDefault();await addDoc(collection(db,'news'),{body:e.target.b.value.trim(),ts:now()});route()};
$('#cf').onsubmit=async e=>{e.preventDefault();const f=e.target,id=f.c.value.trim().toUpperCase().replace(/\s+/g,'');if(!id||id.includes('/'))return toast('كود غير صالح');
await setDoc(doc(db,'codes',id),{pct:Math.min(100,Math.max(1,+f.p.value)),max:Math.max(0,+f.m.value),used:0,active:true});toast('تم إضافة الكود');route()};
$('#app').onclick=async e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,id=b.dataset.id;
if(a=='ok'){const u=us.find(x=>x.id==b.dataset.u),r=rc.find(x=>x.id==id);await updateDoc(doc(db,'receipts',id),{status:'ok'});await updateDoc(doc(db,'users',u.id),{activeUntil:Math.max(now(),u.activeUntil||0)+30*864e5,paidOnce:true});
const c=r&&r.code?cd.find(x=>x.id==r.code):null;if(c)await updateDoc(doc(db,'codes',c.id),{used:(c.used||0)+1})}
else if(a=='no')await updateDoc(doc(db,'receipts',id),{status:'no'});else if(a=='ban')await updateDoc(doc(db,'users',id),{banned:!b.dataset.b});
else if(a=='del'){if(!confirm('حذف نهائي؟'))return;await deleteDoc(doc(db,'users',id))}else if(a=='dn')await deleteDoc(doc(db,'news',id));
else if(a=='ct'){const c=cd.find(x=>x.id==id);await updateDoc(doc(db,'codes',id),{active:!c.active})}else if(a=='cx'){if(!confirm('حذف الكود؟'))return;await deleteDoc(doc(db,'codes',id))}route()}};
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');
