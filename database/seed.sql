INSERT INTO users
(google_id, name, email, profile_picture)
VALUES
('google_demo_001', 'Risha Demo', 'risha.demo@example.com', NULL),
('google_demo_002', 'Rahul Demo', 'rahul.demo@example.com', NULL);


INSERT INTO financial_preferences
(user_id, monthly_income, preferred_currency, monthly_savings_target)
VALUES
(1, 50000, 'INR', 10000),
(2, 60000, 'INR', 12000);


INSERT INTO categories
(name, type)
VALUES
('Salary', 'income'),
('Freelance', 'income'),
('Food', 'expense'),
('Transport', 'expense'),
('Rent', 'expense'),
('Shopping', 'expense'),
('Entertainment', 'expense'),
('Utilities', 'expense'),
('Healthcare', 'expense'),
('Education', 'expense');


INSERT INTO transactions
(user_id, category_id, amount, transaction_type, description, transaction_date, source_type)
VALUES
(1, 1, 50000, 'income', 'Monthly salary', '2026-09-01', 'manual'),
(1, 3, 450, 'expense', 'Food delivery', '2026-09-05', 'manual'),
(1, 4, 250, 'expense', 'Cab', '2026-09-06', 'text'),
(1, 5, 15000, 'expense', 'Monthly rent', '2026-09-01', 'manual'),
(1, 6, 2500, 'expense', 'Shopping', '2026-09-08', 'manual'),
(1, 7, 1200, 'expense', 'Entertainment', '2026-09-10', 'manual'),

(2, 1, 60000, 'income', 'Monthly salary', '2026-09-01', 'manual'),
(2, 3, 800, 'expense', 'Restaurant', '2026-09-07', 'manual');



INSERT INTO recurring_expenses
(user_id, category_id, merchant, amount, frequency, confidence, last_seen_date, next_expected_date)
VALUES
(1, 7, 'Netflix', 649, 'monthly', 94.5, '2026-09-01', '2026-10-01'),
(1, 7, 'Gym Membership', 1500, 'monthly', 91.2, '2026-09-05', '2026-10-05');


INSERT INTO budgets
(user_id, category_id, amount, period, start_date, end_date)
VALUES
(1, 3, 5000, 'monthly', '2026-09-01', '2026-09-30'),
(1, 4, 3000, 'monthly', '2026-09-01', '2026-09-30');


INSERT INTO savings_goals
(user_id, goal_name, target_amount, current_amount, target_date)
VALUES
(1, 'New Laptop', 80000, 35000, '2027-06-30');


INSERT INTO insights
(user_id, insight_type, title, message)
VALUES
(
    1,
    'spending_pattern',
    'Food spending increased',
    'Your food spending has increased this month.'
),
(
    1,
    'recommendation',
    'Reduce food delivery',
    'Consider reducing food delivery expenses to improve your savings.'
);