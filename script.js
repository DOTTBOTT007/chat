// SKU Mappings 
const SKU_MAPPINGS = { 
    'Nightsuit': [ 'NS001 - Cotton Nightsuit', 'NS002 - Silk Nightsuit', 'NS003 - Winter Nightsuit' ], 
    'Shirt': [ 'SH001 - Casual Shirt', 'SH002 - Formal Shirt' ], 
    'Lehenga': [ 'LH001 - Traditional Lehenga', 'LH002 - Wedding Lehenga' ], 
    'Kurti': [ 'KT001 - Cotton Kurti', 'KT002 - Silk Kurti' ], 
    'Dress': [ 'DR001 - Party Dress', 'DR002 - Casual Dress' ] 
};

// Dynamic SKU Population
document.getElementById('productCategory').addEventListener('change', function() { 
    const skuSelect = document.getElementById('productSku'); 
    const category = this.value; 
    
    // Reset SKU select
    skuSelect.innerHTML = '<option value="">Select SKU</option>'; 
    
    if (category && SKU_MAPPINGS[category]) { 
        SKU_MAPPINGS[category].forEach(sku => { 
            const option = document.createElement('option'); 
            option.value = sku; 
            option.textContent = sku; 
            skuSelect.appendChild(option); 
        }); 
        skuSelect.disabled = false; 
    } else { 
        skuSelect.disabled = true; 
    } 
});

// Dashboard Metrics
async function updateDashboardMetrics() { 
    try { 
        // Fetch total orders count 
        const { count: ordersCount } = await supabase 
            .from('orders') 
            .select('*', { count: 'exact' }); 

        // Fetch total revenue 
        const { data: revenueData } = await supabase 
            .from('orders') 
            .select('sellingprice'); 
        
        const totalRevenue = revenueData.reduce((sum, order) => sum + order.sellingprice, 0); 

        // Fetch total expenses 
        const { data: expensesData } = await supabase 
            .from('expenses') 
            .select('amount'); 
        
        const totalExpenses = expensesData.reduce((sum, expense) => sum + expense.amount, 0); 

        // Calculate profit
        const totalProfit = totalRevenue - totalExpenses;

        // Update dashboard elements
        document.getElementById('totalOrdersCount').textContent = ordersCount || 0; 
        document.getElementById('totalRevenueAmount').textContent = `₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; 
        document.getElementById('totalExpensesAmount').textContent = `₹${totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; 
        document.getElementById('totalProfitAmount').textContent = `₹${totalProfit.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; 
    } catch (error) { 
        console.error('Error updating dashboard:', error); 
        alert('Failed to update dashboard metrics: ' + error.message); 
    } 
}

// Order Form Submission
document.getElementById('orderForm').addEventListener('submit', async (e) => { 
    e.preventDefault(); 
    
    const orderData = { 
        category: document.getElementById('productCategory').value, 
        sku: document.getElementById('productSku').value, 
        platform: document.getElementById('salesPlatform').value, 
        team_member: document.getElementById('teamMember').value, 
        units: parseInt(document.getElementById('orderUnits').value), 
        order_date: document.getElementById('orderDate').value, 
        remarks: document.getElementById('orderRemarks').value, 
        gender: document.getElementById('personCategory').value, 
        sellingprice: parseFloat(document.getElementById('sellingprice').value), 
        buyingprice: parseFloat(document.getElementById('buyingprice').value), 
        gst: document.getElementById('gst').value
    }; 
    
    try { 
        const { error } = await supabase.from('orders').insert([orderData]); 
        
        if (error) throw error; 
        
        alert('Order added successfully!'); 
        e.target.reset(); 
        updateDashboardMetrics(); 
        createCharts(); 
    } catch (error) { 
        alert('Error adding order: ' + error.message); 
        console.error('Order submission error:', error); 
    } 
});

// Expense Form Submission
document.getElementById('expenseForm').addEventListener('submit', async (e) => { 
    e.preventDefault(); 
    
    const expenseData = { 
        category: document.getElementById('expenseCategory').value, 
        amount: parseFloat(document.getElementById('expenseAmount').value), 
        expense_date: document.getElementById('expenseDate').value, 
        team_member: document.getElementById('expenseTeamMember').value, 
        remarks: document.getElementById('expenseRemarks').value 
    }; 
    
    try { 
        const { error } = await supabase.from('expenses').insert([expenseData]); 
        
        if (error) throw error; 
        
        alert('Expense added successfully!'); 
        e.target.reset(); 
        updateDashboardMetrics(); 
        createCharts(); 
    } catch (error) { 
        alert('Error adding expense: ' + error.message); 
        console.error('Expense submission error:', error); 
    } 
});
<!-- +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++  -->

async function fetchOrders() {
    try {
        // Fetch orders data from Supabase
        const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('*');

        if (ordersError) {
            console.error('Error fetching orders:', ordersError);
            return;
        }

        // Get the orders table element
        const ordersTableBody = document.getElementById('ordersTable').getElementsByTagName('tbody')[0];

        // Clear the table
        ordersTableBody.innerHTML = '';

        // Populate the table with the fetched orders data
        ordersData.forEach(order => {
            const row = ordersTableBody.insertRow();
            row.innerHTML = `
                <td>${order.sku}</td>
                <td>${order.category}</td>
                <td>${order.units}</td>
                <td>₹${order.sellingprice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>${order.order_date}</td>
                <td>${order.platform}</td>
            `;
        });
    } catch (error) {
        console.error('Error displaying orders:', error);
    }
}

// Function to display expenses in the table
async function fetchExpenses() {
    try {
        // Fetch expenses data from Supabase
        const { data: expensesData, error: expensesError } = await supabase
            .from('expenses')
            .select('*');

        if (expensesError) {
            console.error('Error fetching expenses:', expensesError);
            return;
        }

        // Get the expenses table element
        const expensesTableBody = document.getElementById('expensesTable').getElementsByTagName('tbody')[0];

        // Clear the table
        expensesTableBody.innerHTML = '';

        // Populate the table with the fetched expenses data
        expensesData.forEach(expense => {
            const row = expensesTableBody.insertRow();
            row.innerHTML = `
                <td>${expense.category}</td>
                <td>₹${expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td>${expense.expense_date}</td>
                <td>${expense.team_member}</td>
            `;
        });
    } catch (error) {
        console.error('Error displaying expenses:', error);
    }
}







// Function to create charts
async function createCharts() { 
    // Ensure Chart.js is loaded
    if (typeof Chart === 'undefined') {
        console.error('Chart.js is not loaded');
        return;
    }

    try { 
        // Fetch orders data 
        const { data: ordersData, error: ordersError } = await supabase 
            .from('orders') 
            .select('*'); 

        // Fetch expenses data 
        const { data: expensesData, error: expensesError } = await supabase 
            .from('expenses') 
            .select('*'); 

        if (ordersError || expensesError) { 
            console.error('Error fetching data:', ordersError || expensesError); 
            return; 
        } 

        // Revenue by Platform Chart 
        const platformRevenue = ordersData.reduce((acc, order) => { 
            acc[order.platform] = (acc[order.platform] || 0) + order.sellingprice; 
            return acc; 
        }, {}); 

        // Destroy existing chart if it exists
        Chart.getChart('platformRevenueChart')?.destroy();
        new Chart(document.getElementById('platformRevenueChart'), { 
            type: 'pie', 
            data: { 
                labels: Object.keys(platformRevenue), 
                datasets: [{ 
                    data: Object.values(platformRevenue), 
                    backgroundColor: [ 
                        'rgba(255, 99, 132, 0.7)', 
                        'rgba(54, 162, 235, 0.7)', 
                        'rgba(255, 206, 86, 0.7)' 
                    ] 
                }] 
            }, 
            options: { 
                responsive: true, 
                plugins: { 
                    title: { 
                        display: true, 
                        text: 'Revenue by Sales Platform' 
                    } 
                } 
            } 
        }); 

        // Expenses by Category Chart 
        const expensesByCategory = expensesData.reduce((acc, expense) => { 
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount; 
            return acc; 
        }, {}); 

        // Destroy existing chart if it exists
        Chart.getChart('expensesCategoryChart')?.destroy();
        new Chart(document.getElementById('expensesCategoryChart'), { 
            type: 'bar', 
            data: { 
                labels: Object.keys(expensesByCategory), 
                datasets: [{ 
                    label: 'Expenses', 
                    data: Object.values(expensesByCategory), 
                    backgroundColor: 'rgba(75, 192, 192, 0.7)' 
                }] 
            }, 
            options: { 
                responsive: true, 
                scales: { 
                    y: { 
                        beginAtZero: true, 
                        title: { 
                            display: true, 
                            text: 'Amount (₹)' 
                        } 
                    } 
                }, 
                plugins: { 
                    title: { 
                        display: true, 
                        text: 'Expenses by Category' 
                    } 
                } 
            } 
        }); 

        // Monthly Revenue Trend 
        const monthlyRevenue = ordersData.reduce((acc, order) => { 
            const month = new Date(order.order_date).toLocaleString('default', { month: 'short' }); 
            acc[month] = (acc[month] || 0) + order.sellingprice; 
            return acc; 
        }, {}); 

        // Destroy existing chart if it exists
        Chart.getChart('monthlyRevenueChart')?.destroy();
        new Chart(document.getElementById('monthlyRevenueChart'), { 
            type: 'line', 
            data: { 
                labels: Object.keys(monthlyRevenue), 
                datasets: [{ 
                    label: 'Monthly Revenue', 
                    data: Object.values(monthlyRevenue), 
                    borderColor: 'rgba(255, 99, 132, 1)', 
                    backgroundColor: 'rgba(255, 99, 132, 0.2)', 
                    tension: 0.1 
                }] 
            }, 
            options: { 
                responsive: true, 
                scales: { 
                    y: { 
                        beginAtZero: true, 
                        title: { 
                            display: true, 
                            text: 'Revenue (₹)' 
                        } 
                    } 
                }, 
                plugins: { 
                    title: { 
                        display: true, 
                        text: 'Monthly Revenue Trend' 
                    } 
                } 
            } 
        }); 

    } catch (error) { 
        console.error('Error creating charts:', error); 
        alert('Failed to create charts: ' + error.message); 
    } 
}

// Initialize dashboard and charts on page load
document.addEventListener('DOMContentLoaded', () => {
    updateDashboardMetrics();
    createCharts();
    fetchOrders();      // Fetch and display orders
    fetchExpenses();
});

// Order Form Submission
document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // ... Order form data processing ...

    try {
        const { error } = await supabase.from('orders').insert([orderData]);
        if (error) throw error;

        alert('Order added successfully!');
        e.target.reset();
        updateDashboardMetrics();
        createCharts();
        fetchOrders();  // Refresh the orders table
    } catch (error) {
        alert('Error adding order: ' + error.message);
        console.error('Order submission error:', error);
    }
});
// Expense Form Submission
document.getElementById('expenseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // ... Expense form data processing ...

    try {
        const { error } = await supabase.from('expenses').insert([expenseData]);
        if (error) throw error;

        alert('Expense added successfully!');
        e.target.reset();
        updateDashboardMetrics();
        createCharts();
        fetchExpenses();  // Refresh the expenses table
    } catch (error) {
        alert('Error adding expense: ' + error.message);
        console.error('Expense submission error:', error);
    }
});

