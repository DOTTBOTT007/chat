<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Clothing Business Manager</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js" rel="stylesheet">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 100%;
            padding: 15px;
        }
        .card {
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .form-control, .btn {
            margin-bottom: 10px;
        }
        #dashboardCharts {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-around;
        }
        .chart-container {
            width: 100%;
            max-width: 500px;
            margin: 10px 0;
        }
        @media (max-width: 768px) {
            .chart-container {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="text-center my-4">Clothing Business Manager</h1>
        
        <!-- Navigation -->
        <ul class="nav nav-tabs" id="mainTabs">
            <li class="nav-item">
                <a class="nav-link active" href="#dashboard" data-bs-toggle="tab">Dashboard</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#orders" data-bs-toggle="tab">Orders</a>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="#expenses" data-bs-toggle="tab">Expenses</a>
            </li>
        </ul>

        <!-- Tab Content -->
        <div class="tab-content mt-3">
            <!-- Dashboard Tab -->
            <div class="tab-pane fade show active" id="dashboard">
                <div id="dashboardCharts" class="row">
                    <div class="chart-container">
                        <canvas id="salesChart"></canvas>
                    </div>
                    <div class="chart-container">
                        <canvas id="expensesChart"></canvas>
                    </div>
                </div>
                <div class="row mt-3">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">Total Sales</div>
                            <div class="card-body">
                                <h3 id="totalSales">$0</h3>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">Total Expenses</div>
                            <div class="card-body">
                                <h3 id="totalExpenses">$0</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Orders Tab -->
            <div class="tab-pane fade" id="orders">
                <div class="card">
                    <div class="card-header">Add New Order</div>
                    <div class="card-body">
                        <form id="orderForm">
                            <input type="text" class="form-control" id="orderProduct" placeholder="Product Name" required>
                            <input type="number" class="form-control" id="orderQuantity" placeholder="Quantity" required>
                            <input type="number" class="form-control" id="orderPrice" placeholder="Price per Unit" required>
                            <input type="date" class="form-control" id="orderDate" required>
                            <button type="submit" class="btn btn-primary">Add Order</button>
                        </form>
                    </div>
                </div>
                <div class="card mt-3">
                    <div class="card-header">Order List</div>
                    <div class="card-body">
                        <table class="table" id="orderTable">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="orderTableBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Expenses Tab -->
            <div class="tab-pane fade" id="expenses">
                <div class="card">
                    <div class="card-header">Add New Expense</div>
                    <div class="card-body">
                        <form id="expenseForm">
                            <input type="text" class="form-control" id="expenseCategory" placeholder="Expense Category" required>
                            <input type="number" class="form-control" id="expenseAmount" placeholder="Amount" required>
                            <input type="date" class="form-control" id="expenseDate" required>
                            <button type="submit" class="btn btn-primary">Add Expense</button>
                        </form>
                    </div>
                </div>
                <div class="card mt-3">
                    <div class="card-header">Expense List</div>
                    <div class="card-body">
                        <table class="table" id="expenseTable">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody id="expenseTableBody"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal for Editing -->
    <div class="modal fade" id="editModal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Entry</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="editModalBody">
                    <!-- Dynamic content will be inserted here -->
                </div>
            </div>
        </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
    <script>
        // Supabase Configuration
        const supabaseUrl = 'YOUR_SUPABASE_PROJECT_URL';
        const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Utility Functions
        function formatCurrency(amount) {
            return '$' + parseFloat(amount).toFixed(2);
        }

        // Order Management
        const orderForm = document.getElementById('orderForm');
        const orderTableBody = document.getElementById('orderTableBody');

        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const product = document.getElementById('orderProduct').value;
            const quantity = document.getElementById('orderQuantity').value;
            const price = document.getElementById('orderPrice').value;
            const date = document.getElementById('orderDate').value;

            try {
                const { data, error } = await supabase
                    .from('orders')
                    .insert([{ product, quantity, price, date }]);
                
                if (error) throw error;
                loadOrders();
                orderForm.reset();
            } catch (error) {
                alert('Error adding order: ' + error.message);
            }
        });

        async function loadOrders() {
            const { data, error } = await supabase.from('orders').select('*');
            
            if (error) {
                console.error('Error fetching orders:', error);
                return;
            }

            orderTableBody.innerHTML = '';
            let totalSales = 0;
            data.forEach(order => {
                const total = order.quantity * order.price;
                totalSales += total;
                const row = `
                    <tr>
                        <td>${order.product}</td>
                        <td>${order.quantity}</td>
                        <td>${formatCurrency(order.price)}</td>
                        <td>${order.date}</td>
                        <td>
                            <button class="btn btn-sm btn-warning" onclick="editOrder(${order.id})">Edit</button>
                            <button class="btn btn-sm btn-danger" onclick="deleteOrder(${order.id})">Delete</button>
                        </td>
                    </tr>
                `;
                orderTableBody.innerHTML += row;
            });

            document.getElementById('totalSales').textContent = formatCurrency(totalSales);
            updateCharts();
        }

        // Similar functions for expenses (loadExpenses, addExpense, etc.)

        // Charts
        function updateCharts() {
            // Implement charts using Chart.js
            // Sales and Expenses charts
        }

        // Initial Load
        document.addEventListener('DOMContentLoaded', () => {
            loadOrders();
            loadExpenses();
        });
    </script>
</body>
</html>
