import { setLocalStorage } from "./util.js";

const step1LoginFormError = document.querySelector(".step-1-login-form__error");
const step2LoginFormError = document.querySelector(".step-2-login-form__error");
const phoneNumberInput = document.querySelector(".phone_Number_input");
const loginModal = document.querySelector(".login-modal");
const userNumberNotice = document.querySelector(".user_number_notice");
const requestTimerContainer = document.querySelector(".request_timer");
const requestTimer = document.querySelector(".request_timer span");
const loading = document.querySelector("#loading-container");
const otpInput = document.querySelector(".code_input");
const reqNewCodeBtn = document.querySelector(".req_new_code_btn");


const loginUser =async () => {
  loading.classList.add("active-login-loader");
  const otpRegex = RegExp(/^\d{4}$/);
  const userOtp = otpInput.value;
  const isValidOtp = otpRegex.test(userOtp);

  if (isValidOtp) {
    step2LoginFormError.innerHTML = "";
    const res = await fetch(`https://divarapi.liara.run/v1/auth/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phoneNumberInput.value, otp: userOtp }),
    });

    if (res.status === 200 || res.status === 201) {
      let respance =await res.json()
      console.log(respance);
      
      setLocalStorage('divar',respance.data.token)
      
      loading.classList.remove("active-login-loader");
      loginModal.classList.remove('login-modal--active')
     
      alert('لاگین با موفقیت انجام شد')
    } else if (res.status === 400) {
      loading.classList.remove("active-login-loader");
      otpInput.value = "";
      step2LoginFormError.innerHTML = "کد وارد شده نامعتبر هست";
    }
  } else {
    loading.classList.remove("active-login-loader");
    step2LoginFormError.innerHTML = "کد وارد شده نامعتبر هست";
  }
}

const sendUserPhone =async () => {
   const phoneRegex = RegExp(/^(09)[0-9]{9}$/);
  const phoneNumber = phoneNumberInput.value;
  const isValidPhoneNumber = phoneRegex.test(phoneNumber);

  if (isValidPhoneNumber) {
    step1LoginFormError.innerHTML = "";
    const res = await fetch(`https://divarapi.liara.run/v1/auth/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phoneNumber }),
    });
    if (res.status === 200) {
        loginModal.classList.add("active_step_2");
        userNumberNotice.innerHTML = phoneNumber;
        reqNewCodeBtn.style.display = "none";
  
        let count = 5;
        requestTimerContainer.style.display = "flex";
        requestTimer.textContent = "5";
  
        let timer = setInterval(() => {
          count--;
          requestTimer.textContent = count;
          if (count === 0) {
            clearInterval(timer);
            reqNewCodeBtn.style.display = "block";
            requestTimerContainer.style.display = "none";
          }
        }, 1000);
      }
    } else {
      step1LoginFormError.innerHTML = "شماره تماس وارد شده معتبر نیست";
    }
  
    
}

const sendNewCode = async () => {
  const phoneNumber = phoneNumberInput.value;
  step1LoginFormError.innerHTML = "";
    const res = await fetch(`https://divarapi.liara.run/v1/auth/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone: phoneNumber }),
    });
    if (res.status === 200) {
        loginModal.classList.add("active_step_2");
        userNumberNotice.innerHTML = phoneNumber;
        reqNewCodeBtn.style.display = "none";
  
        let count = 5;
        requestTimerContainer.style.display = "flex";
        requestTimer.textContent = "5";
  
        let timer = setInterval(() => {
          count--;
          requestTimer.textContent = count;
          if (count === 0) {
            clearInterval(timer);
            reqNewCodeBtn.style.display = "block";
            requestTimerContainer.style.display = "none";
          }
        }, 1000);
      }
}


export{sendUserPhone,loginUser,sendNewCode}