let me = null;
let editId = null;
let detId = null;
let filt = "all";
let nid = 8;

let tasks = [
{
id:1,
title:"User Authentication",
desc:"JWT login and registration support",
priority:"high",
cat:"feature",
status:"done",
asn:"Alex"
},
{
id:2,
title:"Task CRUD API",
desc:"Create, Read, Update and Delete APIs",
priority:"high",
cat:"feature",
status:"inprogress",
asn:"Sam"
},
{
id:3,
title:"Kanban Board UI",
desc:"Responsive board with drag support",
priority:"medium",
cat:"design",
status:"inprogress",
asn:"Jordan"
},
{
id:4,
title:"WebSocket Integration",
desc:"Real-time updates across clients",
priority:"medium",
cat:"infra",
status:"todo",
asn:"Alex"
},
{
id:5,
title:"Mobile Layout",
desc:"Responsive mobile screens",
priority:"medium",
cat:"design",
status:"todo",
asn:"Taylor"
},
{
id:6,
title:"Dashboard Charts",
desc:"Statistics and reports",
priority:"low",
cat:"feature",
status:"todo",
asn:"Sam"
},
{
id:7,
title:"Fix Login Redirect",
desc:"Signup redirect bug",
priority:"high",
cat:"bug",
status:"done",
asn:"Jordan"
}
];

let activity = [
{
ic:"ti-check",
txt:"Alex marked User Authentication as done",
t:"2 min ago"
},
{
ic:"ti-plus",
txt:"Sam created Task CRUD API",
t:"18 min ago"
},
{
ic:"ti-edit",
txt:"Jordan updated Kanban Board UI",
t:"1 hr ago"
}
];

const catPill = {
feature:"pill-purple",
bug:"pill-red",
design:"pill-teal",
infra:"pill-amber"
};

const priDot = {
high:"ph",
medium:"pm",
low:"pl"
};

const priLabel = {
high:"High",
medium:"Medium",
low:"Low"
};

const catLabel = {
feature:"Feature",
bug:"Bug",
design:"Design",
infra:"Infrastructure"
};

const statusLabel = {
todo:"To Do",
inprogress:"In Progress",
done:"Done"
};

function swAuth(type){

document
.querySelectorAll(".at")
.forEach((btn,index)=>{
btn.classList.toggle(
"on",
index === (type==="in" ? 0 : 1)
);
});

document
.getElementById("ap-in")
.classList.toggle("on",type==="in");

document
.getElementById("ap-up")
.classList.toggle("on",type==="up");
}

function doLogin(){

const email =
document.getElementById("li-em").value;

login(
email.split("@")[0],
email
);
}

function doSignup(){

const name =
document.getElementById("su-nm").value
|| "New User";

const email =
document.getElementById("su-em").value
|| "user@taskflow.com";

login(name,email);

logAct(
"ti-user",
name + " created an account",
"Just now"
);
}

function login(name,email){

me = {name,email};

document.getElementById(
"auth-screen"
).style.display="none";

document.getElementById(
"app-shell"
).style.display="block";

const cap =
name.charAt(0).toUpperCase()
+ name.slice(1);

document.getElementById(
"u-name"
).textContent = cap;

document.getElementById(
"u-av"
).textContent = cap.charAt(0);

document.getElementById(
"prof-av"
).textContent = cap.charAt(0);

document.getElementById(
"prof-name"
).textContent = cap;

document.getElementById(
"prof-email"
).textContent = email;

renderBoard();
renderStats();
renderActivity();
}

function logout(){

document.getElementById(
"auth-screen"
).style.display="block";

document.getElementById(
"app-shell"
).style.display="none";

me = null;
}
function goPage(page){

document
.querySelectorAll(".pg")
.forEach(el=>{
el.classList.remove("on");
});

document
.querySelectorAll(".ni")
.forEach(el=>{
el.classList.remove("on");
});

document
.getElementById("pg-"+page)
.classList.add("on");

document
.getElementById("nv-"+page)
.classList.add("on");

const labels = {
board:"Board",
dash:"Dashboard",
act:"Activity",
prof:"Profile"
};

document.getElementById(
"pg-label"
).textContent = labels[page];

if(page==="dash"){
renderCharts();
}
}

function setF(filter,element){

filt = filter;

document
.querySelectorAll(".fchip")
.forEach(chip=>{
chip.classList.remove("on");
});

element.classList.add("on");

renderBoard();
}

function vis(){

return tasks.filter(task=>{

if(filt==="high"){
return task.priority==="high";
}

if(filt==="mine"){

return task.asn ===
(me?.name.charAt(0).toUpperCase()
+ me?.name.slice(1));
}

return true;

});
}

function renderBoard(){

const cols = [
"todo",
"inprogress",
"done"
];

const filtered = vis();

document.getElementById(
"kanban"
).innerHTML = cols.map(col=>{

const current =
filtered.filter(
task=>task.status===col
);

return `
<div class="col">

<div class="col-hd">
<span class="col-title">
${statusLabel[col]}
</span>

<span class="col-badge">
${current.length}
</span>
</div>

${
current.length===0
?
`<div class="empty">
Nothing Here
</div>`
:
current.map(task=>`

<div class="tcard"
onclick="openDet(${task.id})">

<div class="tc-title">
${task.title}
</div>

<div class="tc-desc">
${task.desc}
</div>

<div class="tc-foot">

<span class="pill
${catPill[task.cat]}">
${catLabel[task.cat]}
</span>

<span class="tc-meta">

<span class="pdot
${priDot[task.priority]}">
</span>

${task.asn}

</span>

</div>
</div>

`).join("")
}

</div>
`;

}).join("");

}

function openAdd(){

editId = null;

document.getElementById(
"add-ttl"
).textContent = "New Task";

document.getElementById(
"f-title"
).value = "";

document.getElementById(
"f-desc"
).value = "";

document.getElementById(
"f-pri"
).value = "medium";

document.getElementById(
"f-cat"
).value = "feature";

document.getElementById(
"add-ovl"
).classList.add("open");
}

function closeOvl(id){

document
.getElementById(id)
.classList.remove("open");
}

function saveTask(){

const title =
document.getElementById(
"f-title"
).value.trim();

if(!title){
alert("Enter task title");
return;
}

const data = {

title:title,

desc:document.getElementById(
"f-desc"
).value,

priority:document.getElementById(
"f-pri"
).value,

cat:document.getElementById(
"f-cat"
).value,

asn:document.getElementById(
"f-asn"
).value
};

if(editId){

Object.assign(
tasks.find(
t=>t.id===editId
),
data
);

toast("Task Updated");

}else{

tasks.push({
id:nid++,
...data,
status:"todo"
});

toast("Task Created");
}

closeOvl("add-ovl");

renderBoard();
renderStats();
}
function openDet(id){

const task =
tasks.find(t=>t.id===id);

if(!task) return;

detId = id;

document.getElementById(
"det-title"
).textContent = task.title;

document.getElementById(
"det-desc"
).textContent = task.desc;

document.getElementById(
"det-status"
).value = task.status;

document.getElementById(
"det-tags"
).innerHTML = `

<span class="pill ${catPill[task.cat]}">
${catLabel[task.cat]}
</span>

<span class="pill pill-gray">
${priLabel[task.priority]}
Priority
</span>

<span class="pill pill-gray">
${task.asn}
</span>

`;

document.getElementById(
"det-ovl"
).classList.add("open");
}

function updStatus(){

const task =
tasks.find(t=>t.id===detId);

if(!task) return;

const newStatus =
document.getElementById(
"det-status"
).value;

task.status = newStatus;

logAct(
"ti-arrows-right-left",
`${task.title} moved to ${statusLabel[newStatus]}`,
"Just now"
);

renderBoard();
renderStats();

toast("Status Updated");
}

function delTask(){

const task =
tasks.find(t=>t.id===detId);

if(!task) return;

tasks =
tasks.filter(
t=>t.id!==detId
);

logAct(
"ti-trash",
`${task.title} deleted`,
"Just now"
);

closeOvl("det-ovl");

renderBoard();
renderStats();

toast("Task Deleted");
}

function openEdit(){

const task =
tasks.find(
t=>t.id===detId
);

if(!task) return;

editId = task.id;

document.getElementById(
"f-title"
).value = task.title;

document.getElementById(
"f-desc"
).value = task.desc;

document.getElementById(
"f-pri"
).value = task.priority;

document.getElementById(
"f-cat"
).value = task.cat;

document.getElementById(
"f-asn"
).value = task.asn;

closeOvl("det-ovl");

document.getElementById(
"add-ovl"
).classList.add("open");
}

function renderStats(){

const total =
tasks.length;

const done =
tasks.filter(
t=>t.status==="done"
).length;

const progress =
tasks.filter(
t=>t.status==="inprogress"
).length;

const high =
tasks.filter(
t=>t.priority==="high"
).length;

document.getElementById(
"stats-grid"
).innerHTML = `

<div class="sc">
<div class="sc-n">${total}</div>
<div class="sc-l">Total Tasks</div>
</div>

<div class="sc">
<div class="sc-n">${progress}</div>
<div class="sc-l">In Progress</div>
</div>

<div class="sc">
<div class="sc-n">${done}</div>
<div class="sc-l">Completed</div>
</div>

<div class="sc">
<div class="sc-n">${high}</div>
<div class="sc-l">High Priority</div>
</div>

`;
}

function renderCharts(){

if(typeof Chart==="undefined") return;

const todo =
tasks.filter(
t=>t.status==="todo"
).length;

const progress =
tasks.filter(
t=>t.status==="inprogress"
).length;

const done =
tasks.filter(
t=>t.status==="done"
).length;

new Chart(
document.getElementById("c-status"),
{
type:"doughnut",
data:{
labels:[
"To Do",
"In Progress",
"Done"
],
datasets:[{
data:[
todo,
progress,
done
],
backgroundColor:[
"#d1d5db",
"#a78bfa",
"#34d399"
]
}]
}
}
);

const high =
tasks.filter(
t=>t.priority==="high"
).length;

const medium =
tasks.filter(
t=>t.priority==="medium"
).length;

const low =
tasks.filter(
t=>t.priority==="low"
).length;

new Chart(
document.getElementById("c-pri"),
{
type:"bar",
data:{
labels:[
"High",
"Medium",
"Low"
],
datasets:[{
data:[
high,
medium,
low
]
}]
}
}
);
}

function logAct(
icon,
text,
time
){

activity.unshift({
ic:icon,
txt:text,
t:time
});

renderActivity();
}

function renderActivity(){

document.getElementById(
"act-list"
).innerHTML = activity.map(a=>`

<div class="act-item">

<div class="act-ic">
<i class="ti ${a.ic}"></i>
</div>

<div>

<div class="act-txt">
${a.txt}
</div>

<div class="act-time">
${a.t}
</div>

</div>

</div>

`).join("");
}

function toast(msg){

const box =
document.getElementById(
"toast"
);

document.getElementById(
"toast-txt"
).textContent = msg;

box.classList.add("show");

setTimeout(()=>{
box.classList.remove("show");
},2500);
}

document.addEventListener(
"keydown",
e=>{

if(e.key==="Escape"){

closeOvl("add-ovl");
closeOvl("det-ovl");

}

}
);