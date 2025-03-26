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
        amount: parseFloat(document.getElementById('orderAmount').value),
        units: parseInt(document.getElementById('orderUnits').value),
        order_date: document.getElementById('orderDate').value,
        remarks: document.getElementById('orderRemarks').value
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
