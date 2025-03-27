// Function to create charts with improved error handling and flexibility
async function createCharts() {
    try {
        // Fetch orders data with error handling
        const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('*')
            .throwOnError();

        // Fetch expenses data with error handling
        const { data: expensesData, error: expensesError } = await supabase
            .from('expenses')
            .select('*')
            .throwOnError();

        // Ensure we have data before proceeding
        if (!ordersData || !expensesData) {
            console.error('No data available for charts');
            return;
        }

        // Color palette for consistent design
        const COLOR_PALETTE = {
            primary: 'rgba(54, 162, 235, 0.7)',
            secondary: 'rgba(255, 99, 132, 0.7)',
            tertiary: 'rgba(75, 192, 192, 0.7)',
            accent: 'rgba(255, 206, 86, 0.7)'
        };

        // Revenue by Platform Chart with more interactive options
        const platformRevenue = ordersData.reduce((acc, order) => {
            acc[order.platform] = (acc[order.platform] || 0) + order.sellingprice;
            return acc;
        }, {});

        new Chart(document.getElementById('platformRevenueChart'), {
            type: 'pie',
            data: {
                labels: Object.keys(platformRevenue),
                datasets: [{
                    data: Object.values(platformRevenue),
                    backgroundColor: [
                        COLOR_PALETTE.primary, 
                        COLOR_PALETTE.secondary,
                        COLOR_PALETTE.tertiary
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Revenue Distribution by Sales Platform',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const value = context.parsed;
                                const percentage = ((value / total) * 100).toFixed(2);
                                return `₹${value.toLocaleString()} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });

        // Expenses by Category Chart with gradient fill
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
                    backgroundColor: createGradientFill(
                        document.getElementById('expensesCategoryChart').getContext('2d'), 
                        COLOR_PALETTE.tertiary
                    )
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Total Expenses (₹)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Expenses Breakdown by Category',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `₹${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                }
            }
        });

        // Monthly Revenue Trend with more detailed configuration
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
                    borderColor: COLOR_PALETTE.secondary,
                    backgroundColor: createGradientFill(
                        document.getElementById('monthlyRevenueChart').getContext('2d'), 
                        COLOR_PALETTE.secondary, 
                        0.2
                    ),
                    borderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Total Revenue (₹)'
                        },
                        ticks: {
                            callback: function(value) {
                                return '₹' + value.toLocaleString();
                            }
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Revenue Progression',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `₹${context.parsed.y.toLocaleString()}`;
                            }
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error('Comprehensive chart creation error:', error);
        // Optional: Display user-friendly error message on the UI
        document.getElementById('chartErrorMessage').textContent = 
            'Unable to load charts. Please try again later.';
    }
}

// Utility function to create gradient fills for charts
function createGradientFill(ctx, baseColor, opacity = 0.7) {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, baseColor.replace('0.7', String(opacity)));
    gradient.addColorStop(1, baseColor.replace('0.7', '0.1'));
    return gradient;
}

// Call create charts when DOM is loaded
document.addEventListener('DOMContentLoaded', createCharts);
