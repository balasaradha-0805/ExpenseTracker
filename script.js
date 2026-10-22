let transactions = [];
const form = document.querySelector("#transaction-form");
const titleInput = document.querySelector("#title");
const amountInput = document.querySelector("#amount");
const categoryInput = document.querySelector("#category");
const transactionsList = document.querySelector("#transaction-list");
const searchInput = document.querySelector("#search");
//summary 
const balanceElement = document.querySelector("#balance");
const incomeElement = document.querySelector("#income");
const expenseElement = document.querySelector("#expense");
const emailBtn = document.querySelector(".email-btn")
const email = document.querySelector("#email");
const sub_btn = document.querySelector(".sub-btn");

const api_text = document.querySelector(".api-text");

function validateEmail() {
 const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if(regex.test(email.value)){
  alert("valid");
 }else{
alert("Invalid");
}
}
//validateEma.addEventListener("submit",validateEmail(email.value))

function addtransaction(){
    const title = titleInput.value;
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const type = document.querySelector(
        'input[name="type"]:checked'
    ).value;

    if(title === "" || amount <=0){
        alert("Please enter a valid description and amount");
        return;
    }
    const trsn = {
        id : Date.now(),
        title: title,
        amount: amount,
        category: category,
        type: type
    };
    console.log(trsn);
    transactions.push(trsn);

    displayTransaction();
    calculateIncome();
    calculateExpense();
    calculateBalance();
    saveToLocalStorage();
    fetchCurrency(trsn);

    form.reset();
    document.querySelector('input[name="type"][value="expense"]').checked = true;
}

form.addEventListener("submit", function(event){
    event.preventDefault();
    addtransaction();
})

function displayTransaction(list = transactions){
    transactionsList.innerHTML = "";

    if(list.length === 0){
        transactionsList.innerHTML="<p>No Transactions found</p>";
        return;
    }
    list.forEach(function(transaction){
        const  div = document.createElement("div");
        div.classList.add("transaction");


        div.innerHTML = `
        <div>
        <h3>${transaction.title}</h3>
        <small>
            ${transaction.category}
        </small>
    </div>
    <div>
        <strong>
            ${transaction.type === 'income' ?"+" : "-"}
            ${transaction.amount}
        </strong>
        <button class="delete-button" onclick="deleteTransaction(${transaction.id})"> Delete</button>
    </div>`;
    transactionsList.append(div);
    });
}

function calculateIncome(){
    const income = transactions.filter(function(transaction){
        return transaction.type === "income";}).reduce(function(total,transaction){
            return total +transaction.amount;
        },0);

        incomeElement.textContent = `Rs${income}`;
        return income;
}

function calculateExpense(){
    const expense = transactions.filter(function(transaction){
        return transaction.type === "expense";}).reduce(function(total,transaction){
            return total +transaction.amount;
        },0);

        expenseElement.textContent = `Rs${expense}`;
        return expense;
}
function calculateBalance(){
     const income = calculateIncome();
     const expense = calculateExpense();
    
        const balance = income - expense;
        balanceElement.textContent = `${balance}`;
}

function deleteTransaction(id){
    transactions = transactions.filter(function(transaction){
        return transaction.id !== id;
    });
    displayTransaction();
    calculateIncome();
    calculateExpense();
    calculateBalance();
    saveToLocalStorage();
}
function searchTransaction(){
    const searchText = searchInput.value.toLowerCase();
    const filteredTransactions = transactions.filter(
        function(transaction){
            return(
                transaction.title.toLowerCase().includes(searchText) ||
                transaction.category.toLowerCase().includes(searchText)
            );
        }
    );
    displayTransaction(filteredTransactions);
}

searchInput.addEventListener("input", searchTransaction);

function saveToLocalStorage(){
    localStorage.setItem(
        "transactions", JSON.stringify(transactions)
    );
}

function loadFromLocalStorage(){
    const savedTransactions = localStorage.getItem("transactions");
    if(savedTransactions){
        transactions = JSON.parse(savedTransactions);
        displayTransaction();
        calculateIncome();
        calculateExpense();
        calculateBalance();
    }
}

loadFromLocalStorage();
async function fetchCurrency(transaction) {
        console.log("1. Function called");
    try{

        const response = await fetch( "https://api.frankfurter.app/latest?from=INR&to=USD");
        if(!response.ok){
            throw new Error("Currenct API request failed");
        }
        const data = await response.json();
        console.log("USD to INR :",data.rates.INR);
        const rate =  data.rates.USD;

        console.log(transaction.amount * rate);
    }catch(error){
        console.log("Currency Error", error.message);
        return null;
    }
}

console.log("Expense Tracker started!");

console.log(
    "Current transactions:",
    transactions
);


loadFromLocalStorage();

function fetchCurrency2(amt) {
    console.log("1. Function called");

    return new Promise(function(resolve, reject) {
        fetch("https://api.frankfurter.app/latest?from=INR&to=USD")
            .then(function(response) {
                if (!response.ok) {
                    reject(new Error("Currency API request failed"));
                    return;
                }

                return response.json();
            })
            .then(function(data) {
                if (!data) {
                    return;
                }
                console.log("INR to USD:", data.rates.USD);
                const rate = data.rates.USD;
                const usdValue = amt * rate;
                console.log("USD value:", usdValue);
                resolve(usdValue);
            })
            .catch(function(error) {
                console.log("Currency Error:", error.message);
                console.log("adjskaa");
                reject(error);
            });
    });
}


console.log("A");
fetchCurrency2(50000);
console.log("B");



  
async function apicall() {
  const res = await fetch("https://dog.ceo/api/breeds/list/all");
  const data = await res.json();
  
  Object.keys(data.message).forEach(breed => {
    const breed_li = `<li> ${breed} </li>`
    api_text.insertAdjacentHTML('beforeend', breed_li);
  });

}

