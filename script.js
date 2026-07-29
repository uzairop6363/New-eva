/* =========================================
   EVA EARNING
   CLEAN SCRIPT
   PART 1 / 10
   APP BASE + USER SYSTEM
========================================= */


const API = "/api";


// Current User
let currentUser = JSON.parse(
    localStorage.getItem("user")
) || null;


// App Data
let wallet = 0;
let reward = 0;
let ads = 5;
let watched = 0;
let plan = "FREE PLAN";




// =========================
// SPLASH SCREEN
// =========================

const splash = document.getElementById("splash");
const app = document.getElementById("app");


window.addEventListener("load",()=>{


    setTimeout(()=>{


        if(splash){

            splash.style.opacity = "0";

        }


        setTimeout(()=>{


            if(splash){

                splash.style.display = "none";

            }


            if(app){

                app.classList.remove("hidden");

            }


            loadUser();


        },500);


    },5000);


});






// =========================
// ELEMENTS
// =========================


const walletText =
document.getElementById("wallet");


const rewardText =
document.getElementById("todayReward");


const adsLeft =
document.getElementById("adsLeft");


const adsWatched =
document.getElementById("adsWatched");



const profileName =
document.getElementById("profileName");


const profileEmail =
document.getElementById("profileEmail");


const profileWallet =
document.getElementById("profileWallet");


const profileRewards =
document.getElementById("profileRewards");


const profileAds =
document.getElementById("profileAds");


const profilePlan =
document.getElementById("profilePlan");






// =========================
// UPDATE UI
// =========================


function updateUI(){



    if(walletText){

        walletText.innerHTML =
        "PKR " + wallet;

    }



    if(rewardText){

        rewardText.innerHTML =
        reward;

    }



    if(adsLeft){

        adsLeft.innerHTML =
        ads;

    }



    if(adsWatched){

        adsWatched.innerHTML =
        watched;

    }





    if(currentUser){


        if(profileName)
        profileName.innerHTML =
        currentUser.name;



        if(profileEmail)
        profileEmail.innerHTML =
        currentUser.phone;



        if(profileWallet)
        profileWallet.innerHTML =
        "PKR " + wallet;



        if(profileRewards)
        profileRewards.innerHTML =
        "PKR " + reward;



        if(profileAds)
        profileAds.innerHTML =
        watched;



        if(profilePlan)
        profilePlan.innerHTML =
        plan;



    }
    else{


        if(profileName)
        profileName.innerHTML =
        "Guest User";


        if(profileEmail)
        profileEmail.innerHTML =
        "Login Required";


    }


}







// =========================
// LOAD USER
// =========================


function loadUser(){


    if(!currentUser){

        updateUI();

        return;

    }



    wallet =
    currentUser.wallet || 0;



    reward =
    currentUser.reward || 0;



    ads =
    currentUser.ads || 5;



    watched =
    currentUser.watchedAds || 0;



    plan =
    currentUser.plan || "FREE PLAN";



    updateUI();


}






// =========================
// SAVE USER
// =========================


async function saveUser(){

    if(!currentUser) return;

    currentUser.wallet = wallet;
    currentUser.reward = reward;
    currentUser.ads = ads;
    currentUser.watchedAds = watched;
    currentUser.plan = plan;

    localStorage.setItem(
        "user",
        JSON.stringify(currentUser)
    );

    try{

        await fetch("/api/update-user",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                phone:currentUser.phone,

                wallet:wallet,

                reward:reward,

                ads:ads,

                watchedAds:watched,

                plan:plan

            })

        });

    }catch(error){

        console.log("Update User Error",error);

    }

}




// Initial Load

loadUser();


console.log(
"Eva Earning Part 1 Loaded"
);/* =========================================
   EVA EARNING
   PART 2 / 10
   LOGIN + CREATE ACCOUNT SYSTEM
========================================= */


const loginBtn =
document.getElementById("loginBtn");


const loginModal =
document.getElementById("loginModal");


const loginSubmit =
document.getElementById("loginSubmit");


const closeModal =
document.querySelector(".closeModal");



const nameInput =
document.getElementById("userName");


const phoneInput =
document.getElementById("userEmail");




// Create Password Input

let passwordInput =
document.getElementById("userPassword");


if(!passwordInput && phoneInput){


    passwordInput =
    document.createElement("input");


    passwordInput.type =
    "password";


    passwordInput.id =
    "userPassword";


    passwordInput.placeholder =
    "Password";


    phoneInput.parentNode.insertBefore(
        passwordInput,
        phoneInput.nextSibling
    );


}




// =========================
// OPEN LOGIN
// =========================


if(loginBtn){


loginBtn.onclick = ()=>{


    loginModal.classList.add("show");


};


}





// =========================
// CLOSE LOGIN
// =========================


if(closeModal){


closeModal.onclick = ()=>{


    loginModal.classList.remove("show");


};


}






// =========================
// LOGIN / REGISTER
// =========================


if(loginSubmit){



loginSubmit.onclick = async()=>{



const name =
nameInput.value.trim();



const phone =
phoneInput.value.trim();



const password =
passwordInput.value.trim();





if(!phone || !password){


showToast(
"Phone & Password Required"
);


return;


}





try{



// FIRST LOGIN TRY


const loginResponse =
await fetch(
"/api/login",
{


method:"POST",


headers:{


"Content-Type":
"application/json"


},


body:JSON.stringify({

phone:phone,

password:password

})


});






const loginData =
await loginResponse.json();






if(loginData.success){



currentUser =
loginData.user;



localStorage.setItem(
"user",
JSON.stringify(currentUser)
);



loginModal.classList.remove(
"show"
);



loadUser();



showToast(
"✅ Login Successful"
);



return;


}







// IF LOGIN FAIL THEN REGISTER


if(!name){


showToast(
"Name Required For New Account"
);


return;


}






const registerResponse =
await fetch(
"/api/register",
{


method:"POST",


headers:{


"Content-Type":
"application/json"


},


body:JSON.stringify({

name:name,

phone:phone,

password:password

})


});






const registerData =
await registerResponse.json();






if(registerData.success){



showToast(
"✅ Account Created"
);




// AUTO LOGIN AFTER REGISTER


const autoLogin =
await fetch(
"/api/login",
{


method:"POST",


headers:{


"Content-Type":
"application/json"


},


body:JSON.stringify({

phone:phone,

password:password

})


});






const userData =
await autoLogin.json();






if(userData.success){



currentUser =
userData.user;



localStorage.setItem(
"user",
JSON.stringify(currentUser)
);



loginModal.classList.remove(
"show"
);



loadUser();



}



}else{


showToast(
registerData.message ||
"Register Failed"
);


}





}catch(error){


console.log(error);


showToast(
"❌ Server Error"
);


}





};



}





console.log(
"Eva Earning Part 2 Loaded"
); /* =========================================
   EVA EARNING
   PART 3 / 10
   TOAST + LOGOUT + NAVIGATION
========================================= */



// =========================
// TOAST SYSTEM
// =========================


function showToast(message){


    const oldToast =
    document.querySelector(".evaToast");


    if(oldToast){

        oldToast.remove();

    }



    const toast =
    document.createElement("div");



    toast.className =
    "evaToast";


    toast.innerHTML =
    message;



    document.body.appendChild(toast);




    setTimeout(()=>{


        toast.classList.add("show");


    },100);




    setTimeout(()=>{


        toast.classList.remove("show");



        setTimeout(()=>{


            toast.remove();


        },300);



    },3000);



}






// =========================
// LOGOUT SYSTEM
// =========================


const logoutBtn =
document.getElementById("logoutBtn");



if(logoutBtn){



logoutBtn.onclick = ()=>{



    localStorage.removeItem("user");



    currentUser = null;



    wallet = 0;

    reward = 0;

    ads = 5;

    watched = 0;

    plan = "FREE PLAN";



    updateUI();



    showToast(
    "👋 Logged Out"
    );



};



}








// =========================
// BOTTOM NAVIGATION
// =========================


const navItems =
document.querySelectorAll(".navItem");



const pages =
document.querySelectorAll(".page");





navItems.forEach(button=>{



button.onclick = ()=>{



    const target =
    button.dataset.page;




    pages.forEach(page=>{


        page.classList.remove(
        "active"
        );


    });






    const selectedPage =
    document.getElementById(target);




    if(selectedPage){


        selectedPage.classList.add(
        "active"
        );


    }





    navItems.forEach(item=>{


        item.classList.remove(
        "active"
        );


    });





    button.classList.add(
    "active"
    );



};



});






// =========================
// CLOSE MODAL OUTSIDE CLICK
// =========================


window.onclick = (event)=>{


    if(event.target === loginModal){


        loginModal.classList.remove(
        "show"
        );


    }


};





console.log(
"Eva Earning Part 3 Loaded"
);/* =========================================
   EVA EARNING
   PART 4 / 10
   WATCH AD REWARD SYSTEM
========================================= */



const watchBtn =
document.getElementById("watchAd");


const timer =
document.getElementById("timer");





if(watchBtn){



watchBtn.onclick = ()=>{



    // Login Check

    if(!currentUser){


        showToast(
        "⚠ Please Login First"
        );


        loginModal.classList.add(
        "show"
        );


        return;


    }





    // Ads Check

    if(ads <= 0){


        showToast(
        "❌ No Ads Remaining Today"
        );


        return;


    }






    watchBtn.disabled = true;



    let seconds = 15;



    if(timer){

        timer.innerHTML =
        "⏳ " + seconds + "s";

    }





    const countdown =
    setInterval(()=>{



        seconds--;



        if(timer){

            timer.innerHTML =
            "⏳ " + seconds + "s";

        }






        if(seconds <= 0){



            clearInterval(
            countdown
            );




            wallet += 100;



            reward += 100;



            ads--;



            watched++;





            saveUser();



            updateUI();






            if(timer){

                timer.innerHTML =
                "🎉 PKR 100 Added";

            }






            showToast(
            "✅ Reward Added"
            );




            watchBtn.disabled =
            false;




        }




    },1000);




};



}





console.log(
"Eva Earning Part 4 Loaded"
);/* =========================================
   EVA EARNING
   PART 5 / 10
   WITHDRAW SYSTEM
========================================= */



const withdrawBtn =
document.getElementById("withdrawBtn");



const methodInput =
document.getElementById("method");


const withdrawName =
document.getElementById("withdrawName");


const withdrawPhone =
document.getElementById("withdrawPhone");


const withdrawAmount =
document.getElementById("withdrawAmount");







if(withdrawBtn){



withdrawBtn.onclick = async()=>{





if(!currentUser){



showToast(
"⚠ Please Login First"
);



loginModal.classList.add(
"show"
);



return;


}







const method =
methodInput.value;



const name =
withdrawName.value.trim();



const number =
withdrawPhone.value.trim();



const amount =
Number(withdrawAmount.value);








if(!name || !number || !amount){



showToast(
"⚠ Fill All Details"
);



return;


}







if(amount < 50){



showToast(
"⚠ Minimum Withdraw PKR 50"
);



return;


}








if(plan === "FREE PLAN" && amount > 50){



showToast(
"⚠ Free Plan Limit PKR 50"
);



return;


}







if(wallet < amount){



showToast(
"❌ Insufficient Balance"
);



return;


}








try{



const response =
await fetch(
"/api/withdraw",
{


method:"POST",


headers:{


"Content-Type":
"application/json"


},


body:JSON.stringify({



phone:currentUser.phone,


method:method,


name:name,


number:number,


amount:amount



})


});







const data =
await response.json();







if(data.success){





wallet -= amount;



saveUser();



updateUI();





withdrawName.value = "";

withdrawPhone.value = "";

withdrawAmount.value = "";





showToast(
"✅ Withdraw Request Sent"
);





}else{



showToast(
data.message ||
"Withdraw Failed"
);



}





}catch(error){



console.log(error);



showToast(
"❌ Server Error"
);



}





};



}





console.log(
"Eva Earning Part 5 Loaded"
);/* =========================================
   EVA EARNING
   PART 6 / 10
   VIP + BALANCE + THEME SYSTEM
========================================= */



// =========================
// VIP SYSTEM
// =========================


const vipButtons =
document.querySelectorAll(".buyVip");



vipButtons.forEach(button=>{



button.onclick = ()=>{



    if(!currentUser){



        showToast(
        "⚠ Please Login First"
        );



        loginModal.classList.add(
        "show"
        );



        return;


    }





    const selectedPlan =
    button.dataset.plan;





    showToast(
    "💎 " + selectedPlan + 
    " Activation Coming Soon"
    );





};



});







// =========================
// BALANCE SHOW / HIDE
// =========================



const toggleBalance =
document.getElementById("toggleBalance");



let balanceVisible = true;





if(toggleBalance){



toggleBalance.onclick = ()=>{



    balanceVisible =
    !balanceVisible;





    if(walletText){



        walletText.innerHTML =
        balanceVisible
        ?
        "PKR " + wallet
        :
        "PKR ****";



    }





};



}








// =========================
// DARK MODE
// =========================



const themeBtn =
document.getElementById("themeBtn");




if(themeBtn){



themeBtn.onclick = ()=>{



    document.body.classList.toggle(
    "darkMode"
    );



};



}






console.log(
"Eva Earning Part 6 Loaded"
);/* =========================================
   EVA EARNING
   PART 7 / 10
   WITHDRAW ACTIVITY + HISTORY
========================================= */



// =========================
// FAKE WITHDRAW ACTIVITY BAR
// =========================


const activityNames = [

"Ahmad",
"Zaka",
"Ali",
"Hamza",
"Usman",
"Ayesha",
"Sara",
"Fatima"

];



function startActivity(){



const activity =
document.getElementById("activityText");



if(!activity) return;





setInterval(()=>{



const name =
activityNames[
Math.floor(
Math.random() *
activityNames.length
)
];





const amounts = [

900,
1500,
3000,
5000,
9000

];





const amount =
amounts[
Math.floor(
Math.random() *
amounts.length
)
];






activity.innerHTML =

`${name} Withdraw PKR ${amount}`;



},4000);




}





startActivity();








// =========================
// WITHDRAW HISTORY
// =========================



async function loadWithdrawHistory(){



if(!currentUser){

return;

}






try{



const response =
await fetch(
`/api/withdraw-history?phone=${currentUser.phone}`
);






const data =
await response.json();







const historyBox =
document.getElementById(
"withdrawHistory"
);





if(!historyBox){

return;

}






if(!data.success || 
!data.withdraws || 
data.withdraws.length===0){



historyBox.innerHTML =

`
<div class="emptyHistory">
No Withdraw History
</div>
`;



return;


}







historyBox.innerHTML = "";







data.withdraws.forEach(item=>{



historyBox.innerHTML +=

`

<div class="historyCard">


<div>

<b>
${item.method}
</b>


<p>
${item.name}
</p>


</div>



<div>


<h3>
PKR ${item.amount}
</h3>


<span>
${item.status}
</span>



</div>


</div>


`;



});






}catch(error){



console.log(
"History Error",
error
);



}




}






console.log(
"Eva Earning Part 7 Loaded"
);/* =========================================
   EVA EARNING
   PART 8 / 10
   PROFILE + SESSION + APP START
========================================= */



// =========================
// PROFILE REFRESH
// =========================


function refreshProfile(){



if(!currentUser){

return;

}






if(profileName){

profileName.innerHTML =
currentUser.name;

}




if(profileEmail){

profileEmail.innerHTML =
currentUser.phone;

}




if(profileWallet){

profileWallet.innerHTML =
"PKR " + wallet;

}




if(profileRewards){

profileRewards.innerHTML =
"PKR " + reward;

}




if(profileAds){

profileAds.innerHTML =
watched;

}




if(profilePlan){

profilePlan.innerHTML =
plan;

}




}








// =========================
// AFTER LOGIN LOAD
// =========================


function afterLogin(){



loadUser();



refreshProfile();



loadWithdrawHistory();



updateUI();



}








// =========================
// CHECK EXISTING LOGIN
// =========================


window.addEventListener(
"load",
()=>{



if(currentUser){



afterLogin();



}else{



updateUI();



}



});








// =========================
// CLEAR LOGIN FORM
// =========================


function clearLoginForm(){



const name =
document.getElementById(
"userName"
);



const phone =
document.getElementById(
"userEmail"
);



const password =
document.getElementById(
"userPassword"
);






if(name){

name.value = "";

}



if(phone){

phone.value = "";

}



if(password){

password.value = "";

}



}







console.log(
"Eva Earning Part 8 Loaded"
);/* =========================================
   EVA EARNING
   PART 9 / 10
   SECURITY + ERROR HANDLING
========================================= */



// =========================
// SAFE JSON PARSER
// =========================


async function safeJSON(response){


try{


return await response.json();



}catch(error){



return {

success:false,

message:"Invalid Server Response"

};



}



}







// =========================
// AUTO LOGOUT CHECK
// =========================


function checkSession(){



if(!currentUser){


return;


}




const savedUser =
localStorage.getItem("user");




if(!savedUser){



currentUser = null;



updateUI();



}





}






setInterval(()=>{


checkSession();


},30000);








// =========================
// NETWORK ERROR HANDLER
// =========================


window.addEventListener(
"offline",
()=>{


showToast(
"⚠ Internet Connection Lost"
);



});





window.addEventListener(
"online",
()=>{


showToast(
"✅ Internet Connected"
);



});








// =========================
// PREVENT MULTIPLE CLICKS
// =========================


function disableButton(button,time=2000){



if(!button) return;



button.disabled = true;



setTimeout(()=>{


button.disabled = false;



},time);



}







console.log(
"Eva Earning Part 9 Loaded"
);/* =========================================
   EVA EARNING
   PART 10 / 10
   FINAL APP READY
========================================= */



// =========================
// FINAL INITIALIZATION
// =========================


document.addEventListener(
"DOMContentLoaded",
()=>{



    updateUI();



    if(currentUser){



        loadUser();



        refreshProfile();



        loadWithdrawHistory();



    }





    console.log(
    "🚀 Eva Earning App Ready"
    );



});







// =========================
// GLOBAL ERROR HANDLER
// =========================


window.addEventListener(
"error",
(event)=>{



console.log(
"App Error:",
event.message
);



});







// =========================
// RESET APP DATA (OPTIONAL)
// =========================


function resetEvaApp(){



localStorage.removeItem(
"user"
);



currentUser = null;


wallet = 0;

reward = 0;

ads = 5;

watched = 0;

plan = "FREE PLAN";



updateUI();



showToast(
"App Reset Successfully"
);



}





console.log(
"✅ Eva Earning Complete Script Loaded"
);
