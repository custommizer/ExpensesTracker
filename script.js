document.addEventListener('DOMContentLoaded', () => {
    // Set up Chart.js for donut chart (Home tab)
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const expenseChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['General', 'Shopping', 'Travel', 'Fuel', 'Grocery', 'Food', 'Fun'],
            datasets: [{
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: ['#ff6384', '#36a2eb', '#ffce56', '#4bc0c0', '#9966ff', '#ff9f40', '#c9cbcf']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Load expenses from localStorage
    let expenses = [];
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
        try {
            expenses = JSON.parse(storedExpenses);
            if (!Array.isArray(expenses)) expenses = [];
        } catch (e) {
            console.error('Invalid expense data in localStorage:', e);
            expenses = [];
        }
    }

    // Get DOM elements
    const monthSpendingEl = document.getElementById('month-spending');
    const todaySpendingEl = document.getElementById('today-spending');
    const monthExpenseListEl = document.getElementById('month-expense-list');
    const dailyExpenseListEl = document.getElementById('daily-expense-list');
    const analysisTableBodyEl = document.getElementById('analysis-table-body');
    const addBtn = document.querySelector('.add-btn');
    const modal = document.getElementById('expense-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const expenseForm = document.getElementById('expense-form');
    const tabLinks = document.querySelectorAll('.tab-link');

    // Initial UI update
    updateMonthSpending();
    updateTodaySpending();
    updateMonthExpenseList();
    updateDailyExpenseList();
    updateChart();
    updateAnalysisTable();

    // Handle tab switching (Home, Daily, Analysis)
    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            tabLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            const tabId = link.getAttribute('data-tab');
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            document.getElementById(tabId).classList.add('active');
        });
    });

    // Show add expense modal
    addBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    // Hide modal on cancel
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Add new expense and save to localStorage
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;
        expenses.push({ amount, category, date });

        // Save to localStorage
        try {
            localStorage.setItem('expenses', JSON.stringify(expenses));
        } catch (e) {
            console.error('Failed to save expenses to localStorage:', e);
        }

        // Update UI
        updateMonthSpending();
        updateTodaySpending();
        updateMonthExpenseList();
        updateDailyExpenseList();
        updateChart();
        updateAnalysisTable();

        // Reset form and close modal
        expenseForm.reset();
        modal.style.display = 'none';
    });

    // Delete expense by index
    function deleteExpense(index) {
        expenses.splice(index, 1);
        // Save to localStorage
        try {
            localStorage.setItem('expenses', JSON.stringify(expenses));
        } catch (e) {
            console.error('Failed to save expenses to localStorage:', e);
        }
        // Update UI
        updateMonthSpending();
        updateTodaySpending();
        updateMonthExpenseList();
        updateDailyExpenseList();
        updateChart();
        updateAnalysisTable();
    }

    // Update current month's spending (Home)
    function updateMonthSpending() {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        const monthExpenses = expenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() + 1 === currentMonth && expDate.getFullYear() === currentYear;
        });
        const total = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        monthSpendingEl.textContent = total;
    }

    // Update today's spending (Daily)
    function updateTodaySpending() {
        const today = new Date().toISOString().split('T')[0];
        const todayExpenses = expenses.filter(exp => exp.date === today);
        const total = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        todaySpendingEl.textContent = total;
    }

    // Update current month's expense list (Home)
    function updateMonthExpenseList() {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        const monthExpenses = expenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() + 1 === currentMonth && expDate.getFullYear() === currentYear;
        });

        monthExpenseListEl.innerHTML = '';
        monthExpenses.forEach((exp, index) => {
            const originalIndex = expenses.indexOf(exp);
            const item = document.createElement('div');
            item.classList.add('expense-item');
            item.innerHTML = `
                <span>${exp.date} - ${exp.category}</span>
                <div>
                    <span>${exp.amount} tg</span>
                    <button class="delete-btn" data-index="${originalIndex}"  
                    style="background: none; color: red; border: none; cursor: pointer;"> X </button>
                </div>
            `;
            monthExpenseListEl.appendChild(item);
        });

        // Add delete button listeners
        const deleteButtons = monthExpenseListEl.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                deleteExpense(index);
            });
        });
    }

    // Update today's expense list (Daily)
    function updateDailyExpenseList() {
        const today = new Date().toISOString().split('T')[0];
        const todayExpenses = expenses.filter(exp => exp.date === today);

        dailyExpenseListEl.innerHTML = '';
        todayExpenses.forEach((exp, index) => {
            const originalIndex = expenses.indexOf(exp);
            const item = document.createElement('div');
            item.classList.add('expense-item');
            item.innerHTML = `
                <span>${exp.date} - ${exp.category}</span>
                <div>
                    <span>${exp.amount} tg</span>
                    <button class="delete-btn" data-index="${originalIndex}">Delete</button>
                </div>
            `;
            dailyExpenseListEl.appendChild(item);
        });

        // Add delete button listeners
        const deleteButtons = dailyExpenseListEl.querySelectorAll('.delete-btn');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const index = parseInt(button.getAttribute('data-index'));
                deleteExpense(index);
            });
        });
    }

    // Update chart with current month's data (Home)
    function updateChart() {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        const monthExpenses = expenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() + 1 === currentMonth && expDate.getFullYear() === currentYear;
        });

        const categories = expenseChart.data.labels;
        const data = categories.map(cat => {
            return monthExpenses
                .filter(exp => exp.category === cat)
                .reduce((sum, exp) => sum + exp.amount, 0);
        });
        expenseChart.data.datasets[0].data = data;
        expenseChart.update();
    }

    // Update analysis table with current month's data (Analysis)
    function updateAnalysisTable() {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        const monthExpenses = expenses.filter(exp => {
            const expDate = new Date(exp.date);
            return expDate.getMonth() + 1 === currentMonth && expDate.getFullYear() === currentYear;
        });

        const categories = ['General', 'Shopping', 'Travel', 'Fuel', 'Grocery', 'Food', 'Fun'];
        analysisTableBodyEl.innerHTML = '';
        categories.forEach(cat => {
            const total = monthExpenses
                .filter(exp => exp.category === cat)
                .reduce((sum, exp) => sum + exp.amount, 0);
            if (total > 0) {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${cat}</td>
                    <td>${total} tg</td>
                `;
                analysisTableBodyEl.appendChild(row);
            }
        });
    }
});