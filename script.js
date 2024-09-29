const cash = document.getElementById("cash");  
const purchaseBtn = document.getElementById("purchase-btn");
const changeDueContainer = document.getElementById("change-due");
const cidContainer = document.getElementById("cid");
const codContainer = document.getElementById("cod");
const priceInput = document.getElementById("price-input"); 

let cid = [
  ['PENNY', 1.01],
  ['NICKEL', 2.05],
  ['DIME', 3.1],
  ['QUARTER', 4.25],
  ['ONE', 90],
  ['FIVE', 55],
  ['TEN', 20],
  ['TWENTY', 60],
  ['ONE HUNDRED', 100]
];

const isCashEnough = () => {
    const cashFixed = cash.value; 
    const priceFixed = priceInput.value;
    if (Number(cashFixed) === Number(priceFixed)) {
        alert("No change due - customer paid with exact cash");
        return true; 
    } else if (Number(cashFixed) > Number(priceFixed)) {
        return true;
    } else {
        alert("Customer does not have enough money to purchase the item");
        return false;
    }
};

const changeDue = (cash, price) => parseFloat((cash.value - price).toFixed(2));

const convertMap = [
    {string: "ONE HUNDRED", value: 100},
    {string: "TWENTY", value: 20},
    {string: "TEN", value: 10},
    {string: "FIVE", value: 5},
    {string: "ONE", value: 1}, 
    {string: "QUARTER", value: 0.25},
    {string: "DIME", value: 0.1},
    {string: "NICKEL", value: 0.05},
    {string: "PENNY", value: 0.01}
];

const breakChange = () => { 
    let change = changeDue(cash, priceInput.value);
    let subtrahends = [];
    const tempCid = cid.map(([denomination, amount]) => [denomination, amount]); 

    convertMap.forEach(money => {
        let denomAmount = tempCid.find(([denom]) => denom === money.string)[1];

        while (change >= money.value && denomAmount > 0) {
            subtrahends.push({key: money.string, value: money.value});
            change = parseFloat((change -= money.value).toFixed(2));
            denomAmount = parseFloat((denomAmount -= money.value).toFixed(2));
        }
    }); 

    if (change > 0) {
        alert("Status: INSUFFICIENT_FUNDS");
        return []; 
    }

    return subtrahends;   
};

const updateCid = () => {
    const subtrahends = breakChange();

    subtrahends.forEach(subtrahend => {
        const moneyDrawer = cid.find(money => money[0] === subtrahend.key);

        if (moneyDrawer && moneyDrawer[1] >= subtrahend.value) {
            moneyDrawer[1] = parseFloat((moneyDrawer[1] - subtrahend.value).toFixed(2));
        }
    });

    return cid;
};

const displayCid = () => {
    const updatedCid = updateCid();
    cidContainer.innerHTML = '';
    updatedCid.forEach(array => {      
        cidContainer.innerHTML += `${array[0]} : ${array[1].toFixed(2)}<br>`;         
    });
};

const handlePurchase = () => {
    const price = Number(priceInput.value); 
    changeDueContainer.innerHTML = "";
    cidContainer.innerHTML = "";

    if (isCashEnough()) {
        const change = changeDue(cash, price).toFixed(2);
        const givenCash = parseFloat(cash.value).toFixed(2);
        const subtrahends = breakChange();
        const repeatedSubtrahends = {};

        subtrahends.map(subtrahend => {
            if (repeatedSubtrahends[subtrahend.key]) {
                repeatedSubtrahends[subtrahend.key] += subtrahend.value;
            } else {
                repeatedSubtrahends[subtrahend.key] = subtrahend.value;
            }
        });

        changeDueContainer.innerHTML = `
        Cash: <span class="positive">$ ${givenCash}</span><br>
        Price: <span class="negative">$ ${price.toFixed(2)}</span><br>
        Change: <span class="positive">$ ${change}</span>
        `;
        codContainer.innerHTML = `
        <h4 class="text-center"><span class="negative">Cash-Out</span></h4>
        `;
        for (const [key, value] of Object.entries(repeatedSubtrahends)) {
            codContainer.innerHTML += `
            <p class="text-center fs-6">${key}<br><span class="negative">- ${value.toFixed(2)}</span></p>`;
        }

        displayCid();
        cash.value = "";
        
        /*-------------------- jQuery styling------------------------------*/
        $(".positive").css("color", "green"); 
        $(".negative").css("color", "red");
        /*-------------------- jQuery styling------------------------------*/ 
    } else {
        displayCid();
        cash.value = "";
    }
}

displayCid();

purchaseBtn.addEventListener("click", handlePurchase);

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        handlePurchase();
    }
});