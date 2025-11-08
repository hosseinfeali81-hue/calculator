// انتخاب عناصر صفحه
const display = document.querySelector(".display");
const buttons = document.querySelectorAll(".btn");

let currentInput = "";
let resultDisplayed = false;

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const value = btn.textContent;

    // AC → پاک کردن کامل
    if (value === "AC") {
      currentInput = "";
      display.textContent = "0";
      return;
    }

    // C → حذف آخرین رقم
    if (value === "C") {
      currentInput = currentInput.slice(0, -1);
      display.textContent = currentInput || "0";
      return;
    }

    // = → محاسبه نهایی
    if (value === "=") {
      try {
        const result = Function('"use strict";return (' + currentInput + ')')();
        display.textContent = result;
        currentInput = result.toString();
        resultDisplayed = true;
      } catch (e) {
        display.textContent = "خطا";
        currentInput = "";
      }
      return;
    }

    // اگر دکمه درصد (%) زده شد
    if (value === "%") {
      try {
        // بررسی آخرین عدد وارد شده و تبدیل به درصد نسبت به عدد قبل
        const match = currentInput.match(/(\d+(\.\d+)?)$/);
        if (match) {
          const lastNumber = parseFloat(match[0]);
          const before = currentInput.slice(0, match.index);
          // پیدا کردن آخرین عملگر (+ - * /)
          const opMatch = before.match(/[\+\-\*\/](?!.*[\+\-\*\/])/);
          if (opMatch) {
            const op = opMatch[0];
            const leftPart = before.slice(0, opMatch.index);
            const leftNumberMatch = leftPart.match(/(\d+(\.\d+)?)$/);
            if (leftNumberMatch) {
              const base = parseFloat(leftNumberMatch[0]);
              const percentValue = (base * lastNumber) / 100;
              currentInput = before + percentValue;
            }
          } else {
            // اگر هیچ عملگری قبل از درصد نبود، فقط خودش درصدی از ۱۰۰ است
            currentInput = (lastNumber / 100).toString();
          }
          display.textContent = currentInput;
        }
      } catch (e) {
        display.textContent = "خطا";
        currentInput = "";
      }
      return;
    }

    // اگر عدد بعد از نتیجه نمایش داده شد → ورودی جدید
    if (resultDisplayed && !isNaN(value)) {
      currentInput = value;
      display.textContent = currentInput;
      resultDisplayed = false;
      return;
    }

    // اضافه کردن سایر کاراکترها (اعداد یا عملگرها)
    currentInput += value;
    display.textContent = currentInput;
    resultDisplayed = false;
  });
});