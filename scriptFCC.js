const cash = document.getElementById("cash");  
const purchaseBtn = document.getElementById("purchase-btn");
const changeDueContainer = document.getElementById("change-due");
const cidContainer = document.getElementById("cid");
const codContainer = document.getElementById("cod");
const codHeader = document.getElementById("cod-header");
const cidStatusDom = document.getElementById("status");

let price = 3.26;
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
    const cashFixed = parseFloat(cash.value); 
    const priceFixed = price;
    
    if (cashFixed >= priceFixed) {
        return true;
    } else {
        alert("Customer does not have enough money to purchase the item");
        return false;
    }
};

const changeDue = (cash, price) => parseFloat((cash - price).toFixed(2));

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

const totalCid = () => parseFloat(cid.reduce((acc, [denom, amount]) => acc + amount, 0).toFixed(2));

const breakChange = (change) => {
    let subtrahends = [];
    const tempCid = cid.map(([denomination, amount]) => [denomination, amount]); // Copy of cid

    convertMap.forEach(money => {
        let denomAmount = tempCid.find(([denom]) => denom === money.string)[1];
        
        while (change >= money.value && denomAmount > 0) {
            subtrahends.push({key: money.string, value: money.value});
            change = parseFloat((change - money.value).toFixed(2));
            denomAmount = parseFloat((denomAmount - money.value).toFixed(2));
        }
    });

    if (change > 0) {
        return { status: "INSUFFICIENT_FUNDS", change: [] }; 
    }
    
    return { status: "OPEN", change: subtrahends };
};

const updateCid = (subtrahends) => {
    subtrahends.forEach(subtrahend => {
        const moneyDrawer = cid.find(money => money[0] === subtrahend.key);
        if (moneyDrawer && moneyDrawer[1] >= subtrahend.value) {
            moneyDrawer[1] = parseFloat((moneyDrawer[1] - subtrahend.value).toFixed(2));
        }
    });
};

const purchaseBtnClick = () => {
    changeDueContainer.innerHTML = "";
    codContainer.innerHTML = "";
    cidContainer.innerHTML = "";

    if (!isCashEnough()) return;

    const cashFixed = parseFloat(cash.value);
    const change = changeDue(cashFixed, price);
    const totalCashInDrawer = totalCid();

    if (cashFixed === price) {
        changeDueContainer.innerText = "No change due - customer paid with exact cash";
    } else if (change === totalCashInDrawer) {
      
        changeDueContainer.innerHTML = "Status: CLOSED";

        let changeDisplay = "";
        cid.forEach(([denom, amount]) => {
            if (amount > 0) {
                changeDisplay += ` ${denom}: $${amount.toFixed(2)} `;
            }
        });

        changeDueContainer.innerHTML += changeDisplay;
        cid.forEach(denom => denom[1] = 0);  
    } else {
        const result = breakChange(change);

        if (result.status === "INSUFFICIENT_FUNDS") {
            changeDueContainer.innerText = "Status: INSUFFICIENT_FUNDS";
        } else {
            updateCid(result.change);

            let repeatedSubtrahends = {};
            result.change.forEach(subtrahend => {
                if (repeatedSubtrahends[subtrahend.key]) {
                    repeatedSubtrahends[subtrahend.key] += subtrahend.value;
                } else {
                    repeatedSubtrahends[subtrahend.key] = subtrahend.value;
                }
            });

            let changeDisplay = "Status: OPEN";
            for (const [key, value] of Object.entries(repeatedSubtrahends)) {
                changeDisplay += ` ${key}: $${value.toFixed(2)}`;
            }

            changeDueContainer.innerHTML = changeDisplay;
        }
    }

    displayCid();
    cash.value = "";
};

purchaseBtn.addEventListener("click", purchaseBtnClick);

const displayCid = () => {
    cidContainer.innerHTML = '';  
    cid.forEach(array => {      
        cidContainer.innerHTML += `${array[0]} : ${array[1].toFixed(2)}<br>`;         
    });
};

displayCid();