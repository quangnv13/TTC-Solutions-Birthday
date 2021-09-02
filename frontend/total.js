document.addEventListener("DOMContentLoaded", function (event) {
  const totalElements = document.querySelectorAll("ul li");
  const totalElement = document.getElementById("total-info");
  setInterval(() => {
    axios
      .get("/get-total")
      .then(function (response) {
        totalElements[0].textContent =
          "Số người trúng giải năm: " + response.data.voucher50;
        totalElements[1].textContent =
          "Số người trúng giải tư: " + response.data.voucher100;
        totalElements[2].textContent =
          "Số người trúng giải ba: " + response.data.voucher300;
        totalElements[3].textContent =
          "Số người trúng giải nhì: " + response.data.voucher500;
        totalElements[4].textContent =
          "Số người trúng giải nhất: " + response.data.voucher2000;
        let total = 0;
        for (const key in response.data) {
          if (Object.hasOwnProperty.call(response.data, key)) {
            total += response.data[key];
          }
        }
        totalElement.textContent = "Tổng số giải thưởng đã có chủ: " + total;
      })
      .catch((error) => {
        console.log(error);
        totalElement.textContent = "Không lấy được thông tin";
      });
  }, 1500);
});
