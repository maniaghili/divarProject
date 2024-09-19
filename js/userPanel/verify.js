import { getToken } from "../funcs/share.js";
import { isLoginn } from "../funcs/postDetalesfuncs.js";
window.addEventListener('load',()=>{


    const phoneNumber = document.querySelector("#phone-number");
  const verifyInput = document.querySelector("#verify-input");
  const verifyBtn = document.querySelector("#verify-btn");
  const verifyError = document.querySelector("#verify-error");
  const verifyContainer = document.querySelector("#verify-container");

  const token = JSON.parse(getToken());

  isLoginn().then((user) => {
    console.log("User ->", user);
    phoneNumber.innerHTML = user.data.user.phone;
    if (user.data.user.verified) {
      verifyContainer.innerHTML = "";
      verifyContainer.insertAdjacentHTML(
        `beforeend`,
        `
            <div class="verified">
                <p>تأیید هویت شده</p>
                <span>تأیید هویت شما در فروردین ۱۴۰۳ از طریق کد ملی انجام شد.</span>
                <img
                width="100"
                height="100"
                src="https://img.icons8.com/ios/100/approval--v1.png"
                alt="approval--v1"
                />
            </div>      
        `
      );
    }
  });
  verifyBtn.addEventListener("click", () => {
    const nationalCodeRegex = RegExp(/^[0-9]{10}$/);
    const userNationalCode = verifyInput.value;
    const nationalCodeTestResult = nationalCodeRegex.test(userNationalCode);

    if (nationalCodeTestResult) {
      fetch(`https://divarapi.liara.run/v1/user/identity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nationalCode: userNationalCode }),
      }).then((res) => {
        if (res.status === 200) {
          verifyError.style.display = "none";
          verifyContainer.innerHTML = "";
          verifyContainer.insertAdjacentHTML(
            `beforeend`,
            `
                <div class="verified">
                    <p>تأیید هویت شده</p>
                    <span>تأیید هویت شما در فروردین ۱۴۰۳ از طریق کد ملی انجام شد.</span>
                    <img
                    width="100"
                    height="100"
                    src="https://img.icons8.com/ios/100/approval--v1.png"
                    alt="approval--v1"
                    />
                </div>      
            `
          );
        } else {
          verifyError.style.display = "flex";
        }
      });
    } else {
      verifyError.style.display = "flex";
    }
  });
})