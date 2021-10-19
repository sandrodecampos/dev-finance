function modalToggle(name){
  let element = document.querySelector(name);
  if (element.classList.contains('active')){
    element.classList.remove('active')
  }else {
    element.classList.add('active')
  }
}

const transactions = [
  {
    id: 1,
    description: 'Web development Hotel',
    amount: 500000,
    date: '2021-01-22'
  },
  {
    id: 2,
    description: 'Lunch A&W',
    amount: -2000,
    date: '2021-01-25'
  },
  {
    id: 3,
    description: 'Rent',
    amount: -100000,
    date: '2021-02-05'
  },
]

const Transaction = {
  incomes() {
    let income = 0;
    transactions.forEach(transactions => {
      if(transactions.amount > 0) {
        income += transactions.amount;
      }
    })
    return income;
  },
  expenses() {
    let expense = 0;
    transactions.forEach(transactions => {
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
    tr.innerHTML = DOM.innerHTMLTransaction(transaction);
    DOM.transactionsContainer.appendChild(tr);
  },
  innerHTMLTransaction(transaction) {
    const CSSclass = transaction.amount > 0 ? "income" : "expense";
    const amount = Utils.formatCurrency(transaction.amount);

    const html = `      
        <td class="description">${transaction.description}</td>
        <td class=${CSSclass}>${amount}</td>
        <td class="date">${transaction.date}</td>
        <td><img src="./assets/minus.svg" alt="remove transaction"></td>      
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
  }

}

const Utils =  {
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

transactions.forEach(transaction => {
  DOM.addTransaction(transaction);
})

DOM.updateBalance();
