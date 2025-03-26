// SKU Mappings
const SKU_MAPPINGS = {
    'Nightsuit': [
        'NS001 - Cotton Nightsuit',
        'NS002 - Silk Nightsuit', 
        'NS003 - Winter Nightsuit'
    ],
    'Shirt': [
        'SH001 - Casual Shirt', 
        'SH002 - Formal Shirt'
    ],
    'Lehenga': [
        'LH001 - Traditional Lehenga', 
        'LH002 - Wedding Lehenga'
    ],
    'Kurti': [
        'KT001 - Cotton Kurti',
        'KT002 - Silk Kurti'
    ],
    'Dress': [
        'DR001 - Party Dress',
        'DR002 - Casual Dress'
    ]
};

// Dynamic SKU Population
document.getElementById('productCategory').addEventListener('change', function() {
    const skuSelect = document.getElementById('productSku');
    const category = this.value;
    
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
            .select('amount');

        const totalRevenue = revenueData.reduce((sum, order) => sum + order.amount, 0);

        // Fetch total expenses
        const { data: expensesData } = await supabase
            .from('expenses')
            .select('amount');

        const totalExpenses = expensesData.reduce((sum, expense) => sum + expense.amount, 0);

        // Update dashboard
        document.getElementById('totalOrdersCount').textContent = ordersCount || 0;
        document.getElementById('totalRevenueAmount').textContent = `₹${totalRevenue.toFixed(2)}`;
        document.getElementById('totalExpensesAmount').textContent = `₹${totalExpenses.toFixed(2)}`;
    } catch (error) {
        console.error('Error updating dashboard:', error);
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
    };

    try {
        const { error } = await supabase.from('orders').insert([orderData]);
        
        if (error) throw error;
        
        alert('Order added successfully!');
        e.target.reset();
        updateDashboardMetrics();
    } catch (error) {
        alert('Error adding order: ' + error.message);
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
    } catch (error) {
        alert('Error adding expense: ' + error.message);
    }
});

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', updateDashboardMetrics);

// Function to create charts
async function createCharts() {
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
            acc[order.platform] = (acc[order.platform] || 0) + order.amount;
            return acc;
        }, {});

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
            acc[month] = (acc[month] || 0) + order.amount;
            return acc;
        }, {});

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
    }
}

// Call create charts when DOM is loaded
document.addEventListener('DOMContentLoaded', createCharts);
