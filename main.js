"use strict";

const billAmount = document.querySelector("#bill-amount");
const tipRadios = document.querySelectorAll("input[type='radio']");
const totalAmount = document.querySelector("#total-amount");
const tipAmount = document.querySelector("#tip-amount");
const customTip = document.querySelector("#custom-tip");
const numberOfPeople = document.querySelector("#number-of-people");
const errorMessageBill = document.querySelector(".error-message.bill");
const errorMessagePeople = document.querySelector(".error-message.people");
const resetButton = document.querySelector(".button");
const form = document.querySelector("form");
const liveResult = document.querySelector("#live-result");

let bill = 0;
let people = 1;

const calculateTipAndTotal = () => {
  let tipPercentage = getTipPercentage();
  const tip = calculateTip(bill, tipPercentage, people);
  updateDisplayValues(tip, people);
};

const getTipPercentage = () => {
  let tipPercentage = parseFloat(customTip.value) || 0;
  tipRadios.forEach((tipRadio) => {
    if (tipRadio.checked) {
      tipPercentage = parseFloat(tipRadio.value);
    }
  });
  return tipPercentage;
};

const calculateTip = (bill, tipPercentage, people) => {
  return ((tipPercentage / 100) * bill) / people;
};

const updateDisplayValues = (tip, people) => {
  tipAmount.value = `$${tip.toFixed(2)}`;
  totalAmount.value = `$${((bill + tip) / people).toFixed(2)}`;

  liveResult.textContent = `Tip Amount per person: $${tip.toFixed(
    2
  )}, Total per person: $${((bill + tip) / people).toFixed(2)}`;
};

const updateValues = () => {
  bill = parseFloat(billAmount.value) || 0;
  people =
    parseInt(numberOfPeople.value) > 0 ? parseInt(numberOfPeople.value) : 1;
  totalAmount.value = `$${bill.toFixed(2)}`;
  calculateTipAndTotal();
};

const handleValidation = (value, inputType, errorMessageType) => {
  if (value === "") {
    inputType.setAttribute("aria-invalid", "false");
    errorMessageType.classList.add("hidden");
    if (inputType === billAmount) {
      bill = 0;
    }
    if (inputType === numberOfPeople) {
      people = 1;
    }
    updateValues();
  } else if (value === 0) {
    inputType.setAttribute("aria-invalid", "true");
    errorMessageType.textContent = "Can't be zero";
    errorMessageType.classList.remove("hidden");
  } else if (value < 0) {
    inputType.setAttribute("aria-invalid", "true");
    errorMessageType.textContent = "Can't be negative";
    errorMessageType.classList.remove("hidden");
  } else {
    inputType.setAttribute("aria-invalid", "false");
    errorMessageType.classList.add("hidden");
    updateValues();
  }
  validateInputs();
};

const validateInputs = () => {
  const billValue = parseFloat(billAmount.value);
  const peopleValue = parseInt(numberOfPeople.value);
  let tipSelected =
    [...tipRadios].some((radio) => radio.checked) ||
    parseFloat(customTip.value) > 0;
  if (billValue > 0 && peopleValue > 0 && tipSelected) {
    resetButton.disabled = false;
  } else {
    resetButton.disabled = true;
  }
};

billAmount.addEventListener("input", function (event) {
  const value = parseFloat(event.target.value);
  handleValidation(value, billAmount, errorMessageBill);
});

numberOfPeople.addEventListener("input", function (event) {
  const value = parseInt(event.target.value);
  handleValidation(value, numberOfPeople, errorMessagePeople);
});

tipRadios.forEach((tipRadio) => {
  tipRadio.addEventListener("click", function () {
    calculateTipAndTotal();
    validateInputs();
  });
});

customTip.addEventListener("input", () => {
  tipRadios.forEach((tipRadio) => {
    tipRadio.checked = false;
  });
  const customTipValue = parseFloat(customTip.value);
  if (customTipValue <= 0) {
    customTip.setAttribute("aria-invalid", "true");
  } else {
    customTip.setAttribute("aria-invalid", "false");
    updateValues();
  }
  validateInputs();
});

resetButton.disabled = true;

const resetForm = () => {
  billAmount.value = "";
  numberOfPeople.value = "";
  customTip.value = "";
  tipAmount.value = "$0.00";
  totalAmount.value = "$0.00";
  tipRadios.forEach((tipRadio) => {
    tipRadio.checked = false;
  });
  resetButton.disabled = true;
  errorMessageBill.classList.add("hidden");
  errorMessagePeople.classList.add("hidden");
  billAmount.setAttribute("aria-invalid", "false");
  numberOfPeople.setAttribute("aria-invalid", "false");
  customTip.setAttribute("aria-invalid", "false");
};

window.onload = resetForm;

form.addEventListener("submit", (event) => {
  event.preventDefault();
  resetForm();
});
