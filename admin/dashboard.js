/* =====================================
   EVA EARNING ADMIN DASHBOARD
   PART 6
===================================== */


const admin =
JSON.parse(localStorage.getItem("admin"));



// Check Admin Login

if(!admin){

window.location.href="index.html";

}





// Logout

const logoutAdmin =
document.getElementById("logoutAdmin");


if(logoutAdmin){


logoutAdmin.onclick=()=>{


localStorage.removeItem("admin");


window.location.href="index.html";


};


}







// Load Users

async function loadUsers(){


try{


const response =
await fetch("/api/admin-users");


const data =
await response.json();



if(data.success){


document.getElementById(
"totalUsers"
).innerHTML =
data.users.length;



let box =
document.getElementById(
"usersList"
);



box.innerHTML="";



data.users.forEach(user=>{


box.innerHTML += `

<div class="userItem">

<div>

<b>${user.name || "User"}</b>

<br>

${user.phone}

</div>


<div>

Wallet:
PKR ${user.wallet || 0}

</div>


</div>

`;



});



}



}catch(error){


console.log(error);


}



}









// Load Withdraw Requests


async function loadWithdraws(){


try{


const response =
await fetch("/api/admin-withdraws");


const data =
await response.json();



if(data.success){



let list =
document.getElementById(
"withdrawList"
);



list.innerHTML="";



let pending=0;
let approved=0;
let rejected=0;



data.withdraws.forEach(item=>{



if(item.status==="Pending")
pending++;


if(item.status==="Approved")
approved++;


if(item.status==="Rejected")
rejected++;




list.innerHTML += `


<div class="withdrawItem">


<div>


<b>
${item.name}
</b>


<br>

${item.method}

<br>

PKR ${item.amount}


<br>

Status:
${item.status}


</div>



<div>


<button 
class="approveBtn"
onclick="updateWithdraw('${item._id}','Approved')">

Approve

</button>




<button 
class="rejectBtn"
onclick="updateWithdraw('${item._id}','Rejected')">

Reject

</button>


</div>


</div>



`;



});



document.getElementById(
"pendingWithdraw"
).innerHTML=pending;



document.getElementById(
"approvedWithdraw"
).innerHTML=approved;



document.getElementById(
"rejectedWithdraw"
).innerHTML=rejected;



}



}catch(error){


console.log(error);


}



}








// Update Withdraw Status


async function updateWithdraw(id,status){


try{


let response =
await fetch("/api/update-withdraw",{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({

id,

status

})


});



let data =
await response.json();



if(data.success){


alert(
"Updated Successfully"
);



load
