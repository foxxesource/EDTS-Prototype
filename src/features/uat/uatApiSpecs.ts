export interface ApiParam {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface ApiEndpoint {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  parameters: ApiParam[];
  requestBody?: string;
  responseBody: string;
}

export interface ApiCategory {
  category: string;
  endpoints: ApiEndpoint[];
}

export const API_DOCS: ApiCategory[] = [
  {
    category: 'Inquiry',
    endpoints: [
      {
        name: 'Generate Authentication Token',
        method: 'POST',
        path: '/api/v1/auth/token',
        description: 'Obtain a JWT access token using client credentials.',
        parameters: [],
        requestBody: JSON.stringify({
          grant_type: 'client_credentials',
          client_id: 'YOUR_CLIENT_ID',
          client_secret: 'YOUR_CLIENT_SECRET'
        }, null, 2),
        responseBody: JSON.stringify({
          access_token: 'eyJhbGciOiJIUzI1...',
          token_type: 'Bearer',
          expires_in: 3600
        }, null, 2),
      },
      {
        name: 'Fetch Active Catalog',
        method: 'GET',
        path: '/api/v1/catalog/active',
        description: 'Retrieve a list of currently available digital goods for sale.',
        parameters: [
          { name: 'category', type: 'string', description: 'Filter by product category', required: false },
          { name: 'limit', type: 'number', description: 'Max items to return', required: false },
        ],
        responseBody: JSON.stringify({
          status: 'success',
          data: [
            { id: 'prod_1', name: 'Premium Data Pack', price: 100.00, currency: 'IDR' },
            { id: 'prod_2', name: 'Enterprise Access', price: 500.00, currency: 'IDR' }
          ]
        }, null, 2),
      },
    ],
  },
  {
    category: 'Order',
    endpoints: [
      {
        name: 'Simulate Top-up',
        method: 'POST',
        path: '/api/v1/orders/topup',
        description: 'Trigger a balance top-up request for the account.',
        parameters: [],
        requestBody: JSON.stringify({
          amount: 10000,
          currency: 'IDR',
          payment_method: 'credit_card'
        }, null, 2),
        responseBody: JSON.stringify({
          order_id: 'ord_987654321',
          status: 'PENDING',
          message: 'Top-up request initiated successfully.'
        }, null, 2),
      },
    ],
  },
];
