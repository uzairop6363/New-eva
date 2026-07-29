const adminLoginBtn = document.getElementById("adminLoginBtn");

const adminEmail = document.getElementById("adminEmail");
const adminPassword = document.getElementById("adminPassword");
const adminMessage = document.getElementById("adminMessage");



if(adminLoginBtn){


adminLoginBtn.onclick = async ()=>{


let username = adminEmail.value.trim();

let password = adminPassword.value.trim();



if(!username || !password){


adminMessage.innerHTML =
"⚠ Enter username and password";


return;


}





try{


let response = await fetch("/api/admin-login",{


method:"POST",


headers:{


"Content-Type":"application/json"


},


body:JSON.stringify({


username,

password


})


});



let data = await response.json();




if(data.success){



localStorage.setItem(
"admin",
JSON.stringify(data.admin)
);



adminMessage.innerHTML =
"✅ Login Successful";



setTimeout(()=>{


window.location.href =
"dashboard.html";


},1000);



}else{



adminMessage.innerHTML =
"❌ Invalid Login";


}



}catch(error){



console.log(error);


adminMessage.innerHTML =
"❌ Server Error";


}



};


}
