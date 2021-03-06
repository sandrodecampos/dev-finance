function modalToggle(name){
  let element = document.querySelector(name);
  if (element.classList.contains('active')){
    element.classList.remove('active')
  }else {
    element.classList.add('active')
  }
}

const Storage = {
  get(){
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },

  set(transactions) {
    localStorage.setItem("dev.finances:transactions",
    JSON.stringify(transactions));
  }
}

const Transaction = {
  all: Storage.get(),

  add(transaction){
    Transaction.all.push(transaction)

    App.reload();
  },

  remove(index) {
    Transaction.all.splice(index, 1);

    App.reload();
  },

  incomes() {
    let income = 0;
    Transaction.all.forEach(transactions => {
      if(transactions.amount > 0) {
        income += transactions.amount;
      }
    })
    return income;
  },

  expenses() {
    let expense = 0;
    Transaction.all.forEach(transactions => {
      if(transactions.amount < 0){
        expense += transactions.amount;
      }
    })
    return expense;
  },

  total() {
    return Transaction.incomes() + Transaction.expenses();
  }
}

const DOM = {
  transactionsContainer: document.querySelector('#data-table-transaction tbody'),
  addTransaction(transaction, index) {
    const tr = document.createElement('tr');
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index);
    tr.dataset.index = index;

    DOM.transactionsContainer.appendChild(tr);
  },
  innerHTMLTransaction(transaction, index) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense";
    const amount = Utils.formatCurrency(transaction.amount);

    const html = `      
        <td class="description">${transaction.description}</td>
        <td class=${CSSclass}>${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="remove transaction"></td>      
    `
    return html;
  },

  updateBalance() {
    document
      .getElementById('income-display')
      .innerHTML = Utils.formatCurrency(Transaction.incomes());
    document
      .getElementById('expense-display')
      .innerHTML = Utils.formatCurrency(Transaction.expenses());
    document
      .getElementById('total-display')
      .innerHTML = Utils.formatCurrency(Transaction.total());
  },

  clearTransaction() {
    DOM.transactionsContainer.innerHTML = "";
  }

}

const Utils =  {

  formatAmount(value) {
    value = Number(value) * 100;

    return Math.round(value);
  },

  // formatDate(date) {
  //   const splittedDate = date.split("-")

  //   return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
  // },

  formatCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g,"");
    value = Number(value) / 100;
    value = value.toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD"
    })

    return signal + value;
  }
}

const Form = {
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateField() {
    const { description, amount, date } = Form.getValues();

    if(description.trim() === "" || 
       amount.trim() === "" ||
       date.trim() === "" ) {
         throw new Error("Please, enter all fields")
       }
  },

  formatValues() {
    let { description, amount, date } = Form.getValues();

    amount = Utils.formatAmount(amount);

    return {
      description,
      amount,
      date
    }
  },

  saveTransaction(transaction) {
    Transaction.add(transaction)
  },

  clearFields() {
    Form.description.value = "";
    Form.amount.value = "";
    Form.date.value = "";
  },

  submit(event) {
    event.preventDefault();

    try {
      Form.validateField();
      const transaction = Form.formatValues();
      Form.saveTransaction(transaction);
      Form.clearFields();

    } catch (error) {
       alert(error.message);
    }
    
  }
}

const App = {
  init(){
    Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index);
    });

    DOM.updateBalance();

    Storage.set(Transaction.all);
    
  },

  reload(){
    DOM.clearTransaction();
    App.init();
  }
}

App.init();