const myModal = new bootstrap.Modal(document.getElementById("exampleModal"), {
  keyboard: false,
  backdrop: "static",
});

myModal.show();

const resultModal = new bootstrap.Modal(
  document.getElementById("resultModal"),
  {
    keyboard: false,
    backdrop: "static",
  }
);

const errorModal = new bootstrap.Modal(document.getElementById("errorModal"), {
  keyboard: false,
  backdrop: "static",
});

const inputEmployeeElement = document.getElementById("employee-code");
const gettingGiftElement = document.getElementById("getting-gift");
const imgResult = document.getElementById("img-result");
const errorModalLabel = document.getElementById("errorModalLabel");
const spinnerElement = document.getElementById("spinner");
const resultNameElement = document.getElementById("result-name");
spinnerElement.classList.add("hidden");
gettingGiftElement.classList.add("hidden");

function inputEmployeeCode($event) {
  $event.value = $event.value.trim();
  if (!$event.value) {
    inputEmployeeElement.classList.add("is-invalid");
  } else {
    inputEmployeeElement.classList.remove("is-invalid");
  }
}

function getGift() {
  if (
    inputEmployeeElement.classList.contains("is-invalid") ||
    !inputEmployeeElement.value
  ) {
    inputEmployeeElement.classList.add("is-invalid");
    return;
  }
  myModal.hide();
  gettingGiftElement.classList.remove("hidden");
  setTimeout(() => {
    axios
      .get(`/get-gift?employeeCode=${inputEmployeeElement.value}`)
      .then((res) => {
        resultModal.show();
        if (!res?.data?.giftCode) {
          imgResult.src = "assets/images/good-luck.gif";
        } else {
          imgResult.src = `assets/images/${res.data.giftCode}.jpg`;
          resultNameElement.textContent = res.data.employeeName;
        }
      })
      .catch((ex) => {
        errorModal.show();
        if (ex.response.status === 500) {
          errorModalLabel.textContent =
            "Chưa nhận được yêu cầu! Vui lòng thử lại!";
        } else {
          errorModalLabel.textContent = ex.response.data.message;
        }
      })
      .finally(() => {
        gettingGiftElement.classList.remove("hidden");
        spinnerElement.classList.remove("hidden");
      });
  }, generateRandomNumbers(5000, 10000));
}

function generateRandomNumbers(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function tryAgainGetGift() {
  window.location.reload();
}
