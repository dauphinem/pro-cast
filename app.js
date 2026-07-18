const defaults = [
  {id:1,title:"Finaliser la proposition créative",role:"headliner",duration:"45 min",done:false},
  {id:2,title:"Répondre aux messages importants",role:"supporting",duration:"15 min",done:false},
  {id:3,title:"Réserver le train pour Lyon",role:"supporting",duration:"10 min",done:false},
  {id:4,title:"Classer les notes de la semaine",role:"extra",duration:"5 min",done:false}
];
let tasks=JSON.parse(localStorage.getItem("procast-tasks")||"null")||defaults;
const $=id=>document.getElementById(id);
const roleNames={headliner:"Tête d’affiche",supporting:"Second rôle",extra:"Figuration"};
const save=()=>localStorage.setItem("procast-tasks",JSON.stringify(tasks));
const escapeHtml=s=>s.replace(/[&<>'"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]));
function render(){
  const headline=tasks.find(t=>t.role==="headliner"&&!t.done);
  $("headlinerContent").innerHTML=headline?`<div class="headline-task"><button class="check" onclick="completeTask(${headline.id})">✓</button><div><h2>${escapeHtml(headline.title)}</h2><span class="meta">${escapeHtml(headline.duration||"À votre rythme")} · Priorité du jour</span></div><button class="cast-button" onclick="completeTask(${headline.id})">Terminé ✓</button></div>`:`<div class="empty-headliner">La scène est libre. Choisissez votre priorité du jour.</div>`;
  const active=tasks.filter(t=>!t.done&&t.id!==headline?.id);
  $("taskList").innerHTML=active.map(t=>`<div class="task-row"><button class="check" onclick="completeTask(${t.id})">✓</button><span class="task-title">${escapeHtml(t.title)}</span><span class="role-pill">${roleNames[t.role]}</span><span class="task-time">${escapeHtml(t.duration||"—")}</span></div>`).join("");
  $("taskCounter").textContent=`${active.length} rôle${active.length>1?"s":""} restant${active.length>1?"s":""}`;
  const done=tasks.filter(t=>t.done);
  $("doneCount").textContent=done.length;
  $("doneList").innerHTML=done.map(t=>`<div class="done-item">${escapeHtml(t.title)}</div>`).join("");
  save();
}
function completeTask(id){const task=tasks.find(t=>t.id===id);task.done=true;render();showToast("Belle sortie de scène.")}
function showToast(message){const el=$("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2200)}
const date=new Intl.DateTimeFormat("fr-FR",{weekday:"long",day:"numeric",month:"long"}).format(new Date());
$("dateLabel").textContent=date;
$("addTrigger").onclick=()=>$("taskDialog").showModal();
$("doneToggle").onclick=()=>$("doneList").classList.toggle("open");
$("taskForm").addEventListener("submit",e=>{e.preventDefault();const title=$("taskTitle").value.trim();if(!title)return;const role=$("taskRole").value;if(role==="headliner")tasks.forEach(t=>{if(t.role==="headliner"&&!t.done)t.role="supporting"});tasks.push({id:Date.now(),title,role,duration:$("taskDuration").value.trim(),done:false});e.target.reset();$("taskDialog").close();render();showToast("Le rôle est distribué.")});
$("resetDay").onclick=()=>{tasks=structuredClone(defaults);render();showToast("La scène est prête.")};
render();
