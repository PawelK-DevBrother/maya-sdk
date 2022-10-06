export interface User {
    user_id: string;
    customer_id: string;
    username: string;
    first_name: string;
    last_name: string;
    middle_name: string;
    email: string;
    mobile_nr: string;
    limit_group_id: string;
    created_at: string;
    updated_at: string;
    version: number;
    last_signin_ts: number;
    last_app_version: string;
    tac: number;
    news_subscription: number;
    is_beta_user: number;
}

export const UserString = `
user_id
customer_id
username
first_name
last_name
middle_name
email
mobile_nr
limit_group_id
created_at
updated_at
version
last_signin_ts
last_app_version
tac
news_subscription
is_beta_user
`;
