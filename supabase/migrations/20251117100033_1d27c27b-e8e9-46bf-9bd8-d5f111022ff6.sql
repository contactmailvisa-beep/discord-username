-- Grant permanent premium subscription to user 54f4231d-9b07-4cd1-98f5-a483ac27db29
INSERT INTO user_subscriptions (
  user_id,
  plan_type,
  status,
  current_period_start,
  current_period_end,
  paypal_subscription_id
) VALUES (
  '54f4231d-9b07-4cd1-98f5-a483ac27db29',
  'premium',
  'active',
  NOW(),
  '2099-12-31 23:59:59+00',
  'PERMANENT_ADMIN_SUBSCRIPTION'
)
ON CONFLICT (user_id) 
DO UPDATE SET
  plan_type = 'premium',
  status = 'active',
  current_period_end = '2099-12-31 23:59:59+00',
  paypal_subscription_id = 'PERMANENT_ADMIN_SUBSCRIPTION',
  updated_at = NOW();