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

// Advanced Dashboard Metrics
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

        // Profit Calculation
        const totalProfit = totalRevenue - totalExpenses;

        // Update dashboard with animations
        animateNumberChange('totalOrdersCount', ordersCount || 0);
        animateNumberChange('totalRevenueAmount', totalRevenue, '₹');
        animateNumberChange('totalExpensesAmount', totalExpenses, '₹');
        animateNumberChange('totalProfitAmount', totalProfit, '₹');

    } catch (error) { 
        console.error('Error updating dashboard:', error); 
    } 
}

// Number Animation Function
function animateNumberChange(elementId, finalValue, prefix = '') {
    const element = document.getElementById(elementId);
    const duration = 1500; // Animation duration in ms
    const startValue = parseInt(element.textContent.replace(/[^0-9.-]+/g,'')) || 0;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (finalValue - startValue) + startValue);
        
        element.textContent = `${prefix}${currentValue.toLocaleString()}`;
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            element.textContent = `${prefix}${finalValue.toLocaleString()}`;
        }
    };
    
    window.requestAnimationFrame(step);
}

// Order Form Submission (existing code remains the same)
// ... (keep the existing orderForm submission code)

// Expenses Form Submission (existing code remains the same)
// ... (keep the existing expenseForm submission code)

// Enhanced Chart Creation Function
async function createCharts() { 
    try { 
        // Fetch orders and expenses data 
        const { data: ordersData, error: ordersError } = await supabase 
            .from('orders') 
            .select('*'); 

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

        new Chart(document.getElementById('platformRevenueChart'), { 
            type: 'doughnut', 
            data: { 
                labels: Object.keys(platformRevenue), 
                datasets: [{ 
                    data: Object.values(platformRevenue), 
                    backgroundColor: [ 
                        'rgba(255, 99, 132, 0.7)', 
                        'rgba(54, 162, 235, 0.7)', 
                        'rgba(255, 206, 86, 0.7)' 
                    ],
                    borderWidth: 1
                }] 
            }, 
            options: { 
                responsive: true, 
                plugins: { 
                    title: { 
                        display: true, 
                        text: 'Revenue by Sales Platform' 
                    },
                    legend: {
                        position: 'bottom'
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
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
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
                    },
                    legend: {
                        display: false
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

// Call dashboard metrics and create charts when DOM is loaded 
document.addEventListener('DOMContentLoaded', () => {
    updateDashboardMetrics();
    createCharts();
});
