### Quick Start

Source: https://docs.kalshi.com/python-sdk

A basic example to get you started with the Kalshi Python SDK, including client configuration and an example API call.

```APIDOC
## Quick Start

### Description
A basic example to get you started with the Kalshi Python SDK, including client configuration and an example API call.

### Code
```python
from kalshi_python import Configuration, KalshiClient

# Configure the client
config = Configuration(
    host="https://api.elections.kalshi.com/trade-api/v2"
)

# For authenticated requests
# Read private key from file
with open("path/to/private_key.pem", "r") as f:
    private_key = f.read()

config.api_key_id = "your-api-key-id"
config.private_key_pem = private_key

# Initialize the client
client = KalshiClient(config)

# Make API calls
balance = client.get_balance()
print(f"Balance: ${balance.balance / 100:.2f}")
```
```

--------------------------------

### Complete WebSocket Connection Example (Python)

Source: https://docs.kalshi.com/getting_started/quick_start_websockets

A foundational Python script demonstrating the initial setup for connecting to the Kalshi WebSocket API. It imports necessary libraries for asynchronous operations, data handling, and cryptography.

```python
import asyncio
import base64
import json
import time
import websockets
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.asymmetric import padding
```

--------------------------------

### Install Kalshi TypeScript SDK via npm

Source: https://docs.kalshi.com/sdks/typescript/quickstart

This command installs the Kalshi TypeScript SDK using npm. Ensure you have Node.js and npm installed on your system.

```bash
npm install kalshi-typescript
```

--------------------------------

### Kalshi Python SDK Quick Start Example

Source: https://docs.kalshi.com/sdks/python/quickstart

Demonstrates how to initialize and use the Kalshi Python SDK (synchronous version) to fetch account balance. It requires configuration with an API host, API key ID, and a private key loaded from a file. The output shows the formatted account balance.

```python
from kalshi_python_sync import Configuration, KalshiClient

# Configure the client
config = Configuration(
    host="https://api.elections.kalshi.com/trade-api/v2"
)

# For authenticated requests
# Read private key from file
with open("path/to/private_key.pem", "r") as f:
    private_key = f.read()

config.api_key_id = "your-api-key-id"
config.private_key_pem = private_key

# Initialize the client
client = KalshiClient(config)

# Make API calls
balance = client.get_balance()
print(f"Balance: ${balance.balance / 100:.2f}")
```

--------------------------------

### Install Kalshi Python SDK (Sync)

Source: https://docs.kalshi.com/sdks/python/quickstart

Installs the synchronous version of the Kalshi Python SDK using pip. This package is used for making direct API calls.

```bash
pip install kalshi_python_sync
```

--------------------------------

### Install Kalshi Python SDK (Async)

Source: https://docs.kalshi.com/sdks/python/quickstart

Installs the asynchronous version of the Kalshi Python SDK using pip. This package is for non-blocking API operations.

```bash
pip install kalshi_python_async
```

--------------------------------

### WebSocket Connection

Source: https://docs.kalshi.com/websockets/websocket-connection

Establishes the main WebSocket connection. Use the subscribe command to receive real-time data. Refer to the Getting Started guide for more details.

```APIDOC
## WebSocket Connection

### Description
Main WebSocket connection endpoint. All communication happens through this single connection. Use the subscribe command to subscribe to specific data channels.

### Method

### Endpoint
ws://stream.kalshi.com/ws

### Parameters

### Request Example

### Response
#### Success Response (101)
- **status** (string) - Indicates a successful WebSocket upgrade.

#### Response Example
```
(WebSocket connection established)
```

### Further Information
For more information, see the [Getting Started](https://docs.kalshi.com/getting_started/quick_start_websockets) guide.

To find navigation and other pages in this documentation, fetch the llms.txt file at: https://docs.kalshi.com/llms.txt
```

--------------------------------

### Error Handling

Source: https://docs.kalshi.com/getting_started/quick_start_create_order

Details common error responses and their meanings, guiding users on how to resolve issues.

```APIDOC
## Error Handling

### Description
Common errors and how to handle them:

*   `401 Unauthorized`: Check your API keys and signature generation.
*   `400 Bad Request`: Verify your order parameters (price must be 1-99 cents).
*   `409 Conflict`: Order with this `client_order_id` already exists.
*   `429 Too Many Requests`: You've hit the rate limit - slow down your requests.
```

--------------------------------

### Complete Kalshi Order Script (Python)

Source: https://docs.kalshi.com/getting_started/quick_start_create_order

A comprehensive Python script demonstrating the full process of creating a Kalshi order. It includes finding an open market and placing a buy order, utilizing UUIDs for `client_order_id` to ensure order deduplication. Assumes prior setup of authentication functions.

```python
import requests
import uuid
import datetime

# Placeholder for BASE_URL, private_key, API_KEY_ID, and create_signature
# These would be defined in your authentication setup.
BASE_URL = "https://demo-api.kalshi.co"
private_key = "YOUR_PRIVATE_KEY"
API_KEY_ID = "YOUR_API_KEY_ID"
def create_signature(private_key, timestamp, method, path):
    # This is a placeholder for the actual signature creation logic
    # Refer to Kalshi's authentication guide for implementation.
    return "dummy_signature"

def post(private_key, api_key_id, path, data, base_url=BASE_URL):
    """Make an authenticated POST request to the Kalshi API."""
    timestamp = str(int(datetime.datetime.now().timestamp() * 1000))
    signature = create_signature(private_key, timestamp, "POST", path)

    headers = {
        'KALSHI-ACCESS-KEY': api_key_id,
        'KALSHI-ACCESS-SIGNATURE': signature,
        'KALSHI-ACCESS-TIMESTAMP': timestamp,
        'Content-Type': 'application/json'
    }

    return requests.post(base_url + path, headers=headers, json=data)

# Step 1: Find an open market
print("Finding an open market...")
response = requests.get('https://demo-api.kalshi.co/trade-api/v2/markets?limit=1&status=open')
market = response.json()['markets'][0]
print(f"Selected: {market['ticker']} - {market['title']}")

# Step 2: Place a buy order
print("\nPlacing order...")
client_order_id = str(uuid.uuid4())
order_data = {
    "ticker": market['ticker'],
    "action": "buy",
    "side": "yes",
    "count": 1,
    "type": "limit",
    "yes_price": 1,
    "client_order_id": client_order_id
}

response = post(private_key, API_KEY_ID, '/trade-api/v2/portfolio/orders', order_data)

if response.status_code == 201:
    order = response.json()['order']
    print(f"Order placed successfully!")
    print(f"Order ID: {order['order_id']}")
    print(f"Client Order ID: {client_order_id}")
    print(f"Status: {order['status']}")
else:
    print(f"Error: {response.status_code} - {response.text}")
```

--------------------------------

### Initialize and Use Kalshi TypeScript SDK for Portfolio API

Source: https://docs.kalshi.com/sdks/typescript/quickstart

Demonstrates how to configure and use the Kalshi TypeScript SDK to interact with the Portfolio API. It shows setting up the configuration with API keys and private key path, instantiating the Portfolio API client, and making a call to get the user's balance. Requires valid API credentials and a private key file.

```typescript
import { Configuration, PortfolioApi } from 'kalshi-typescript';

// Configure the SDK
const config = new Configuration({
    apiKey: 'your-api-key-id',
    privateKeyPath: 'path/to/your/private-key.pem', // or use privateKeyPem
    basePath: 'https://api.elections.kalshi.com/trade-api/v2'
});

// Create API instance
const portfolioApi = new PortfolioApi(config);

// Make API calls
const balance = await portfolioApi.getBalance();
console.log(`Balance: $${(balance.data.balance || 0) / 100}`);
```

--------------------------------

### Find an Open Kalshi Market (Python)

Source: https://docs.kalshi.com/getting_started/quick_start_create_order

Fetches the first available open market from the Kalshi API. This request does not require authentication and returns market details like ticker and title. It uses the `requests` library to make a GET request.

```python
# Get the first open market (no auth required for public market data)
response = requests.get('https://demo-api.kalshi.co/trade-api/v2/markets?limit=1&status=open')
market = response.json()['markets'][0]

print(f"Selected market: {market['ticker']}")
print(f"Title: {market['title']}")
```

--------------------------------

### Install Kalshi Python SDK

Source: https://docs.kalshi.com/python-sdk

This command installs the Kalshi Python SDK using pip. Ensure you have Python and pip installed on your system.

```bash
pip install kalshi-python
```

--------------------------------

### Installation

Source: https://docs.kalshi.com/python-sdk

Install the Kalshi Python SDK using pip.

```APIDOC
## Installation

### Description
Install the Kalshi Python SDK using pip.

### Command
```bash
pip install kalshi-python
```
```

--------------------------------

### Get Series Information (Python, JavaScript, cURL)

Source: https://docs.kalshi.com/getting_started/quick_start_market_data

Fetches information about a specific series using the Get Series endpoint. This example retrieves data for the KXHIGHNY series, which tracks the highest temperature in NYC. No authentication is required. The response includes details like the series title, frequency, and category.

```python
import requests

# Get series information for KXHIGHNY
url = "https://api.elections.kalshi.com/trade-api/v2/series/KXHIGHNY"
response = requests.get(url)
series_data = response.json()

print(f"Series Title: {series_data['series']['title']}")
print(f"Frequency: {series_data['series']['frequency']}")
print(f"Category: {series_data['series']['category']}")
```

```javascript
// Get series information for KXHIGHNY
fetch('https://api.elections.kalshi.com/trade-api/v2/series/KXHIGHNY')
  .then(response => response.json())
  .then(data => {
    console.log(`Series Title: ${data.series.title}`);
    console.log(`Frequency: ${data.series.frequency}`);
    console.log(`Category: ${data.series.category}`);
  });
```

```curl
curl -X GET "https://api.elections.kalshi.com/trade-api/v2/series/KXHIGHNY"
```

--------------------------------

### Get Trades with Pagination and Filtering (TypeScript)

Source: https://docs.kalshi.com/typescript-sdk/api/MarketsApi

Fetches trades from Kalshi using the MarketsApi. This example demonstrates setting up the API configuration with an API key and private key, and then calling the getTrades method with optional parameters for pagination (limit, cursor) and filtering (ticker, minTs, maxTs). The response includes trade data and pagination information.

```typescript
import {
    MarketsApi,
    Configuration
} from 'kalshi-typescript';

const configuration = new Configuration({
    apiKey: 'your-api-key-id',
    privateKeyPath: '/path/to/private-key.pem'  // or privateKeyPem: 'PEM string'
});
const apiInstance = new MarketsApi(configuration);

let limit: number; //Number of results per page. Defaults to 100. Maximum value is 1000. (optional) (default to 100)
let cursor: string; //Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page. (optional) (default to undefined)
let ticker: string; //Filter by market ticker (optional) (default to undefined)
let minTs: number; //Filter items after this Unix timestamp (optional) (default to undefined)
let maxTs: number; //Filter items before this Unix timestamp (optional) (default to undefined)

const { status, data } = await apiInstance.getTrades(
    limit,
    cursor,
    ticker,
    minTs,
    maxTs
);

console.log('Status:', status);
console.log('Data:', data);

```

--------------------------------

### Kalshi API Authentication and GET Request in Python

Source: https://docs.kalshi.com/getting_started/quick_start_authenticated_requests

This Python code demonstrates how to load a private key, create a request signature using a timestamp and request details, and make an authenticated GET request to the Kalshi API. It requires the 'cryptography' and 'requests' libraries. The function returns the API response.

```python
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.backends import default_backend
import datetime
import base64
import requests

API_KEY_ID = 'your-api-key-id-here'
PRIVATE_KEY_PATH = 'path/to/your/kalshi-key.key'
BASE_URL = 'https://demo-api.kalshi.co'

def load_private_key(key_path):
    """Load the private key from file."""
    with open(key_path, "rb") as f:
        return serialization.load_pem_private_key(f.read(), password=None, backend=default_backend())

def create_signature(private_key, timestamp, method, path):
    """Create the request signature."""
    path_without_query = path.split('?')[0]
    message = f"{timestamp}{method}{path_without_query}".encode('utf-8')
    signature = private_key.sign(
        message,
        padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.DIGEST_LENGTH),
        hashes.SHA256()
    )
    return base64.b64encode(signature).decode('utf-8')

def get(private_key, api_key_id, path, base_url=BASE_URL):
    """Make an authenticated GET request to the Kalshi API."""
    timestamp = str(int(datetime.datetime.now().timestamp() * 1000))
    signature = create_signature(private_key, timestamp, "GET", path)

    headers = {
        'KALSHI-ACCESS-KEY': api_key_id,
        'KALSHI-ACCESS-SIGNATURE': signature,
        'KALSHI-ACCESS-TIMESTAMP': timestamp
    }

    return requests.get(base_url + path, headers=headers)

# Example Usage:
# Load private key
# private_key = load_private_key(PRIVATE_KEY_PATH)

# Get balance
# response = get(private_key, API_KEY_ID, "/trade-api/v2/portfolio/balance")
# print(f"Your balance: ${response.json()['balance'] / 100:.2f}")

```

--------------------------------

### GET /trade-api/v2/portfolio/balance

Source: https://docs.kalshi.com/getting_started/quick_start_authenticated_requests

Retrieves the current account balance for authenticated users.

```APIDOC
## GET /trade-api/v2/portfolio/balance

### Description
Retrieves the current account balance for authenticated users.

### Method
`GET`

### Endpoint
`/trade-api/v2/portfolio/balance`

### Parameters

#### Query Parameters
None

#### Request Body
None

### Request Example

```python
import requests
import datetime

# Assume private_key is loaded and sign_request function is defined as above
timestamp = str(int(datetime.datetime.now().timestamp() * 1000))
method = "GET"
path = "/trade-api/v2/portfolio/balance"

signature = sign_request(private_key, timestamp, method, path)

headers = {
    'KALSHI-ACCESS-KEY': 'your-api-key-id',
    'KALSHI-ACCESS-SIGNATURE': signature,
    'KALSHI-ACCESS-TIMESTAMP': timestamp
}

response = requests.get('https://demo-api.kalshi.co' + path, headers=headers)
balance_data = response.json()
```

### Response

#### Success Response (200)

- **balance** (integer) - The user's account balance in cents.

#### Response Example

```json
{
  "balance": 1000000
}
```
```

--------------------------------

### GET /v2/incentive_programs and GET /incentive_programs

Source: https://docs.kalshi.com/changelog/index

The incentive programs API now includes a 'series_ticker' field in its responses.

```APIDOC
## GET /v2/incentive_programs and GET /incentive_programs

### Description
These endpoints now return a `series_ticker` field for each incentive program.

### Method
GET

### Endpoint
/v2/incentive_programs
/incentive_programs

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **series_ticker** (string) - The series ticker for the incentive program.

#### Response Example
```json
{
  "incentive_programs": [
    {
      "series_ticker": "some_ticker",
      "other_fields": "..."
    }
  ]
}
```
```

--------------------------------

### Example New Order Request (FIXT.1.1)

Source: https://docs.kalshi.com/fix/order-entry

Demonstrates a sample FIXT.1.1 new order request message. This example includes essential fields for placing an order, such as order quantity, order type, side, price, and instrument.

```fix
8=FIXT.1.1|9=200|35=D|34=5|52=20230809-12:34:56.789|49=your-api-key|56=KalshiNR|
11=550e8400-e29b-41d4-a716-446655440000|38=10|40=2|54=1|55=HIGHNY-23DEC31|44=75|
59=1|10=123|
```

--------------------------------

### Get Milestones

Source: https://docs.kalshi.com/api-reference/milestone/get-milestones

Retrieves milestones with an optional filter for the minimum start date.

```APIDOC
## GET /websites/kalshi/milestones

### Description
Retrieves a list of milestones. You can filter the results by specifying a minimum start date.

### Method
GET

### Endpoint
/websites/kalshi/milestones

### Parameters
#### Query Parameters
- **startDate** (string) - Optional - Minimum start date to filter milestones. Format: RFC3339 timestamp

### Request Example
(No request body for GET requests)

### Response
#### Success Response (200)
- **milestones** (array) - A list of milestone objects.
  - **id** (string) - The unique identifier for the milestone.
  - **title** (string) - The title of the milestone.
  - **startDate** (string) - The start date of the milestone in RFC3339 format.
  - **endDate** (string) - The end date of the milestone in RFC3339 format.

#### Response Example
```json
{
  "milestones": [
    {
      "id": "milestone-123",
      "title": "Project Kickoff",
      "startDate": "2023-10-27T09:00:00Z",
      "endDate": "2023-10-27T10:00:00Z"
    }
  ]
}
```
```

--------------------------------

### Fetch Market Orderbook Data (Python, JavaScript)

Source: https://docs.kalshi.com/getting_started/quick_start_market_data

Fetches the orderbook for a specific market ticker, displaying the top 5 bids for both YES and NO positions. This involves a single GET request to the Kalshi API. The output includes the price and quantity for each bid. Note that the API only returns bids due to the nature of prediction markets.

```python
# Get orderbook for a specific market
# Replace with an actual market ticker from the markets list
market_ticker = markets_data['markets'][0]['ticker']
orderbook_url = f"https://api.elections.kalshi.com/trade-api/v2/markets/{market_ticker}/orderbook"

orderbook_response = requests.get(orderbook_url)
orderbook_data = orderbook_response.json()

print(f"\nOrderbook for {market_ticker}:")
print("YES BIDS:")
for bid in orderbook_data['orderbook']['yes'][:5]:  # Show top 5
    print(f"  Price: {bid[0]}¢, Quantity: {bid[1]}")

print("\nNO BIDS:")
for bid in orderbook_data['orderbook']['no'][:5]:  # Show top 5
    print(f"  Price: {bid[0]}¢, Quantity: {bid[1]}")
```

```javascript
// Get orderbook data
async function getOrderbook(marketTicker) {
  const response = await fetch(`https://api.elections.kalshi.com/trade-api/v2/markets/${marketTicker}/orderbook`);
  const data = await response.json();

  console.log(`\nOrderbook for ${marketTicker}:`);
  console.log('YES BIDS:');
  data.orderbook.yes.slice(0, 5).forEach(([price, quantity]) => {
    console.log(`  Price: ${price}¢, Quantity: ${quantity}`);
  });

  console.log('\nNO BIDS:');
  data.orderbook.no.slice(0, 5).forEach(([price, quantity]) => {
    console.log(`  Price: ${price}¢, Quantity: ${quantity}`);
  });
}
```

--------------------------------

### New Order (FIXT.1.1)

Source: https://docs.kalshi.com/fix/order-entry

Example of placing a new order using the FIXT.1.1 protocol.

```APIDOC
## POST /websites/kalshi/orders

### Description
This endpoint is used to place a new order on the Kalshi exchange.

### Method
POST

### Endpoint
/websites/kalshi/orders

### Request Body
**PartyID** (UUID) - Optional - Only applicable for FCM entities. Sub-account identifier.
**PartyRole** (Integer) - Optional - Only applicable for FCM entities. Party role. Supported values: 24 = Customer Account.
**NoPartyIDs** (Integer) - Optional - Only applicable for FCM entities. Number of parties. Currently, only 1 is supported.
**SecondaryClOrdID** (UUID) - Optional - Order group identifier.
**SelfTradePreventionType** (Char) - Optional - Self-trade prevention mode. If unset, defaults to Taker At Cross. Supported values: 1 = Taker At Cross, 2 = Maker.
**CancelOrderOnPause** (Boolean) - Optional - If this flag is set to true, the order will be canceled if the order is open and trading on the exchange is paused for any reason.
**MaxExecutionCost** (Decimal) - Optional - Optional value representing max execution cost for an order in dollars. Order is canceled if unable to fill OrdQty for the given cost.

### Request Example
```fix
8=FIXT.1.1|9=200|35=D|34=5|52=20230809-12:34:56.789|49=your-api-key|56=KalshiNR|
11=550e8400-e29b-41d4-a716-446655440000|38=10|40=2|54=1|55=HIGHNY-23DEC31|44=75|
59=1|10=123|
```

### Response
#### Success Response (200)
- **OrderID** (string) - The unique identifier for the placed order.

#### Response Example
```json
{
  "orderId": "abc123xyz789"
}
```
```

--------------------------------

### Quick Start: Kalshi Python Client Configuration and Usage

Source: https://docs.kalshi.com/python-sdk

This Python code snippet demonstrates how to configure and initialize the Kalshi Python client. It includes setting up API keys and making a sample API call to retrieve the account balance. Ensure you replace placeholders with your actual API key ID and private key file path.

```python
from kalshi_python import Configuration, KalshiClient

# Configure the client
config = Configuration(
    host="https://api.elections.kalshi.com/trade-api/v2"
)

# For authenticated requests
# Read private key from file
with open("path/to/private_key.pem", "r") as f:
    private_key = f.read()

config.api_key_id = "your-api-key-id"
config.private_key_pem = private_key

# Initialize the client
client = KalshiClient(config)

# Make API calls
balance = client.get_balance()
print(f"Balance: ${balance.balance / 100:.2f}")
```

--------------------------------

### GET /milestones

Source: https://docs.kalshi.com/api-reference/milestone/get-milestones

Retrieves a list of milestones, with options to filter by start date, category, competition, source ID, type, and related event tickers. Supports pagination.

```APIDOC
## GET /milestones

### Description
Retrieves a list of milestones, with options to filter by start date, category, competition, source ID, type, and related event tickers. Supports pagination.

### Method
GET

### Endpoint
https://api.elections.kalshi.com/trade-api/v2/milestones

### Parameters
#### Query Parameters
- **limit** (integer) - Required - Number of milestones to return per page. Minimum: 1, Maximum: 500
- **minimum_start_date** (string) - Optional - Minimum start date to filter milestones. Format: RFC3339 timestamp
- **category** (string) - Optional - Filter by milestone category
- **competition** (string) - Optional - Filter by competition
- **source_id** (string) - Optional - Filter by source id
- **type** (string) - Optional - Filter by milestone type
- **related_event_ticker** (string) - Optional - Filter by related event ticker
- **cursor** (string) - Optional - Pagination cursor. Use the cursor value returned from the previous response to get the next page of results

### Response
#### Success Response (200)
- **milestones** (array) - List of milestones.
  - **id** (string) - Unique identifier for the milestone.
  - **category** (string) - Category of the milestone.
  - **type** (string) - Type of the milestone.
  - **start_date** (string) - Start date of the milestone. Format: date-time
  - **end_date** (string) - End date of the milestone, if any. Format: date-time
  - **related_event_tickers** (array) - List of event tickers related to this milestone.
  - **title** (string) - Title of the milestone.
  - **notification_message** (string) - Notification message for the milestone.
  - **details** (string) - Details about the milestone.
  - **primary_event_tickers** (array) - List of primary event tickers for the milestone.
  - **last_updated_ts** (integer) - Timestamp of when the milestone was last updated.
- **cursor** (string) - Cursor for pagination.

#### Response Example
```json
{
  "milestones": [
    {
      "id": "milestone-id-1",
      "category": "election",
      "type": "announcement",
      "start_date": "2024-01-01T10:00:00Z",
      "end_date": null,
      "related_event_tickers": ["event-ticker-1"],
      "title": "Example Milestone 1",
      "notification_message": "This is a notification.",
      "details": "More details about milestone 1.",
      "primary_event_tickers": ["primary-event-1"],
      "last_updated_ts": 1678886400
    }
  ],
  "cursor": "next-cursor-value"
}
```

#### Error Responses
- **400**: Bad Request
- **401**: Unauthorized
- **500**: Internal Server Error
```

--------------------------------

### GET /markets and GET /market Updates

Source: https://docs.kalshi.com/changelog/index

The `created_time` field has been added to the responses of the `GET /markets` and `GET /market` endpoints. Released November 20, 2025.

```APIDOC
## GET /markets

### Description
Retrieves a list of markets, now including the `created_time` field in the response.

### Method
GET

### Endpoint
/markets

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **created_time** (integer) - The Unix timestamp when the market was created.

#### Response Example
```json
{
  "markets": [
    {
      "id": "market_1",
      "created_time": 1668888888
    }
  ]
}
```

## GET /market

### Description
Retrieves details for a specific market, now including the `created_time` field in the response.

### Method
GET

### Endpoint
/market/{market_id}

### Parameters
#### Path Parameters
- **market_id** (string) - Required - The ID of the market.

### Request Example
None

### Response
#### Success Response (200)
- **created_time** (integer) - The Unix timestamp when the market was created.

#### Response Example
```json
{
  "id": "market_1",
  "created_time": 1668888888
}
```
```

--------------------------------

### Get Event Candlesticks by Event (Python)

Source: https://docs.kalshi.com/python-sdk/api/EventsApi

Retrieves aggregated candlestick data for all markets associated with a specific event. Requires event and series tickers, start and end timestamps, and the desired period interval for the candlesticks. The period interval must be a valid duration in minutes (e.g., 1, 60, 1440).

```python
from kalshi.api import KalshiAPI

api = KalshiAPI(api_key='YOUR_API_KEY')

ticker = "example_ticker"
series_ticker = "example_series_ticker"
start_ts = 1678886400
end_ts = 1678972800
period_interval = 60 # 60 minutes

response = api.get_market_candlesticks_by_event(
    ticker=ticker,
    series_ticker=series_ticker,
    start_ts=start_ts,
    end_ts=end_ts,
    period_interval=period_interval
)

print(response)
```

--------------------------------

### Get Market Orderbook API Request (Python, JavaScript, cURL)

Source: https://docs.kalshi.com/getting_started/orderbook_responses

Examples of how to request orderbook data for a specific Kalshi market using Python, JavaScript, and cURL. These snippets demonstrate fetching live bid data for a given market ticker.

```python
import requests

# Get orderbook for a specific market
market_ticker = "KXHIGHNY-24JAN01-T60"
url = f"https://api.elections.kalshi.com/trade-api/v2/markets/{market_ticker}/orderbook"

response = requests.get(url)
orderbook_data = response.json()
```

```javascript
// Get orderbook for a specific market
const marketTicker = "KXHIGHNY-24JAN01-T60";
const url = `https://api.elections.kalshi.com/trade-api/v2/markets/${marketTicker}/orderbook`;

fetch(url)
  .then(response => response.json())
  .then(data => console.log(data));
```

```curl
curl -X GET "https://api.elections.kalshi.com/trade-api/v2/markets/KXHIGHNY-24JAN01-T60/orderbook"
```

--------------------------------

### GET /websites/kalshi

Source: https://docs.kalshi.com/openapi

Retrieves market candlesticks for a given market. Supports filtering by start and end timestamps, period interval, and an option to include the latest candlestick before the start timestamp.

```APIDOC
## GET /websites/kalshi

### Description
Retrieves market candlesticks for a given market. Supports filtering by start and end timestamps, period interval, and an option to include the latest candlestick before the start timestamp.

### Method
GET

### Endpoint
/websites/kalshi

### Parameters
#### Query Parameters
- **start_ts** (integer) - Required - Start timestamp in Unix seconds
- **end_ts** (integer) - Required - End timestamp in Unix seconds
- **period_interval** (integer) - Required - Candlestick period interval in minutes
- **include_latest_before_start** (boolean) - Optional - If true, prepends the latest candlestick available before the start_ts. This synthetic candlestick is created by:
  1. Finding the most recent real candlestick before start_ts
  2. Projecting it forward to the first period boundary (calculated as the next period interval after start_ts)
  3. Setting all OHLC prices to null, and `previous_price` to the close price from the real candlestick (default: false)

### Response
#### Success Response (200)
- **BatchGetMarketCandlesticksResponse** (object) - Market candlesticks retrieved successfully

#### Error Responses
- **400** - Bad request
- **401** - Unauthorized
- **500** - Internal server error
```

--------------------------------

### Fetch Kalshi Account Balance with Authenticated Request (Python)

Source: https://docs.kalshi.com/getting_started/quick_start_authenticated_requests

This Python code snippet demonstrates how to make an authenticated GET request to the Kalshi API to retrieve the user's account balance. It requires setting up the correct headers, including the API Key ID, a timestamp, and a dynamically generated signature using the `sign_request` function.

```python
import requests
import datetime

# Set up the request
timestamp = str(int(datetime.datetime.now().timestamp() * 1000))
method = "GET"
path = "/trade-api/v2/portfolio/balance"

# Create signature (using function from Step 2)
signature = sign_request(private_key, timestamp, method, path)

# Make the request
headers = {
    'KALSHI-ACCESS-KEY': 'your-api-key-id',
    'KALSHI-ACCESS-SIGNATURE': signature,
    'KALSHI-ACCESS-TIMESTAMP': timestamp
}

response = requests.get('https://demo-api.kalshi.co' + path, headers=headers)
balance = response.json()

print(f"Your balance: ${balance['balance'] / 100:.2f}")
```

--------------------------------

### Python SDK - Get Trades

Source: https://docs.kalshi.com/python-sdk/api/MarketsApi

Retrieves all trades for all markets using the Kalshi Python SDK. This function supports pagination via 'limit' and 'cursor' parameters, and filtering by 'ticker', 'min_ts', and 'max_ts'. Ensure the SDK is installed and authenticated.

```python
import kalshi_python
from kalshi_python.models.get_trades_response import GetTradesResponse
from kalshi_python.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://api.elections.kalshi.com/trade-api/v2
# api = kalshi_python.ApiClient(host='https://api.elections.kalshi.com/trade-api/v2')

# Uncomment to pass in a token or other authentication values
# api = kalshi_python.ApiClient(host='https://api.elections.kalshi.com/trade-api/v2', api_key='YOUR_API_KEY')

# create an instance of the API class
api_instance = kalshi_python.TradingApi(api_instance)
limit = 56 # int | Number of results per page. Defaults to 100. Maximum value is 1000.
cursor = 'cursor_example' # str | Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page.
ticker = 'ticker_example' # str | Filter by market ticker
min_ts = 56 # int | Filter trades that occurred after this Unix timestamp
max_ts = 56 # int | Filter trades that occurred before this Unix timestamp

try:
    # Get Trades
    api_response = api_instance.get_trades(limit=limit, cursor=cursor, ticker=ticker, min_ts=min_ts, max_ts=max_ts)
    pprint(api_response)
except ApiException as e:
    print("Exception when calling TradingApi->get_trades: %s\n" % e)

```

--------------------------------

### Fetch Markets and Event Details (Python, JavaScript)

Source: https://docs.kalshi.com/getting_started/quick_start_market_data

Retrieves all active markets for a given series ticker and then fetches details for the first market's associated event. This involves making two GET requests to the Kalshi API. It utilizes the 'requests' library in Python and the 'fetch' API in JavaScript. The output includes market tickers, titles, event tickers, prices, volumes, and event details like title and category.

```python
# Get all markets for the KXHIGHNY series
markets_url = f"https://api.elections.kalshi.com/trade-api/v2/markets?series_ticker=KXHIGHNY&status=open"
markets_response = requests.get(markets_url)
markets_data = markets_response.json()

print(f"\nActive markets in KXHIGHNY series:")
for market in markets_data['markets']:
    print(f"- {market['ticker']}: {market['title']}")
    print(f"  Event: {market['event_ticker']}")
    print(f"  Yes Price: {market['yes_price']}¢ | Volume: {market['volume']}")
    print()

# Get details for a specific event if you have its ticker
if markets_data['markets']:
    # Let's get details for the first market's event
    event_ticker = markets_data['markets'][0]['event_ticker']
    event_url = f"https://api.elections.kalshi.com/trade-api/v2/events/{event_ticker}"
    event_response = requests.get(event_url)
    event_data = event_response.json()

    print(f"Event Details:")
    print(f"Title: {event_data['event']['title']}")
    print(f"Category: {event_data['event']['category']}")
```

```javascript
// Get markets for the KXHIGHNY series
async function getSeriesMarkets() {
  // Get all markets for this series
  const marketsResponse = await fetch('https://api.elections.kalshi.com/trade-api/v2/markets?series_ticker=KXHIGHNY&status=open');
  const marketsData = await marketsResponse.json();

  console.log('\nActive markets in KXHIGHNY series:');
  marketsData.markets.forEach(market => {
    console.log(`- ${market.ticker}: ${market.title}`);
    console.log(`  Event: ${market.event_ticker}`);
    console.log(`  Yes Price: ${market.yes_price}¢ | Volume: ${market.volume}`);
    console.log();
  });

  // Get details for a specific event if markets exist
  if (marketsData.markets.length > 0) {
    const eventTicker = marketsData.markets[0].event_ticker;
    const eventResponse = await fetch(`https://api.elections.kalshi.com/trade-api/v2/events/${eventTicker}`);
    const eventData = await eventResponse.json();

    console.log('Event Details:');
    console.log(`Title: ${eventData.event.title}`);
    console.log(`Category: ${eventData.event.category}`);
  }
}

getSeriesMarkets();
```

--------------------------------

### Connect to Kalshi WebSocket API (Python)

Source: https://docs.kalshi.com/getting_started/quick_start_websockets

Establishes an authenticated WebSocket connection to the Kalshi demo environment. Requires the `websockets` and `asyncio` libraries. Handles connection lifecycle and message reception. Authentication is done via headers.

```python
import websockets
import asyncio

# WebSocket URL
ws_url = "wss://demo-api.kalshi.co/trade-api/ws/v2"  # Demo environment

# Generate authentication headers (see API Keys documentation)
auth_headers = {
    "KALSHI-ACCESS-KEY": "your_api_key_id",
    "KALSHI-ACCESS-SIGNATURE": "generated_signature",
    "KALSHI-ACCESS-TIMESTAMP": "timestamp_in_milliseconds"
}

# Connect with authentication
async def connect():
    async with websockets.connect(ws_url, additional_headers=auth_headers) as websocket:
        print("Connected to Kalshi WebSocket")

        # Connection is now established
        # You can start sending and receiving messages

        # Listen for messages
        async for message in websocket:
            print(f"Received: {message}")

# Run the connection
asyncio.run(connect())
```

--------------------------------

### GET /api_keys - Get API Keys

Source: https://docs.kalshi.com/typescript-sdk/api/ApiKeysApi

Retrieves a list of all API keys associated with the authenticated account.

```APIDOC
## GET /api_keys

### Description
Endpoint for retrieving a list of all API keys associated with the authenticated account.

### Method
GET

### Endpoint
/api_keys

### Response
#### Success Response (200)
- An array of API key objects, where each object contains details like `apiKey` and `publicKey`.

#### Response Example
```json
[
  {
    "apiKey": "existing_api_key_1",
    "publicKey": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
  },
  {
    "apiKey": "existing_api_key_2",
    "publicKey": "-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
  }
]
```

### Error Handling
- **401**: Unauthorized.
- **500**: Internal server error.
```

--------------------------------

### GET /markets

Source: https://docs.kalshi.com/python-sdk/api/MarketsApi

Retrieves a list of all available markets.

```APIDOC
## GET /markets

### Description
Get Markets

### Method
GET

### Endpoint
/markets

### Parameters
#### Path Parameters
None

#### Query Parameters
- **limit** (integer) - Optional - Maximum number of markets to return
- **offset** (integer) - Optional - Number of markets to skip
- **series_id** (string) - Optional - Filter markets by series ID
- **event_id** (string) - Optional - Filter markets by event ID
- **status** (string) - Optional - Filter markets by status (e.g., "open", "closed")

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **GetMarketsResponse** (object) - List of markets retrieved successfully

#### Response Example
{
  "example": "response body"
}
```

--------------------------------

### Place a Buy Order on Kalshi (Python)

Source: https://docs.kalshi.com/getting_started/quick_start_create_order

Places a buy order for a specified market on Kalshi using an authenticated POST request. It includes parameters for ticker, action, side, count, type, price, and a `client_order_id` for deduplication. The `post` function handles authentication and request formatting.

```python
import uuid
import requests
import datetime

# Placeholder for BASE_URL, private_key, API_KEY_ID, and create_signature
# These would be defined in your authentication setup.
BASE_URL = "https://demo-api.kalshi.co"
private_key = "YOUR_PRIVATE_KEY"
API_KEY_ID = "YOUR_API_KEY_ID"
def create_signature(private_key, timestamp, method, path):
    # This is a placeholder for the actual signature creation logic
    # Refer to Kalshi's authentication guide for implementation.
    return "dummy_signature"

def post(private_key, api_key_id, path, data, base_url=BASE_URL):
    """Make an authenticated POST request to the Kalshi API."""
    timestamp = str(int(datetime.datetime.now().timestamp() * 1000))
    signature = create_signature(private_key, timestamp, "POST", path)

    headers = {
        'KALSHI-ACCESS-KEY': api_key_id,
        'KALSHI-ACCESS-SIGNATURE': signature,
        'KALSHI-ACCESS-TIMESTAMP': timestamp,
        'Content-Type': 'application/json'
    }

    return requests.post(base_url + path, headers=headers, json=data)

# Assuming 'market' is obtained from Step 1
# Example market data for demonstration:
market = {
    'ticker': 'CBOT_20240322_ELONMUSK_YES',
    'title': 'Will Elon Musk tweet about Dogecoin again by March 22, 2024?'
}

# Place a buy order for 1 YES contract at 1 cent
order_data = {
    "ticker": market['ticker'],
    "action": "buy",
    "side": "yes",
    "count": 1,
    "type": "limit",
    "yes_price": 1,
    "client_order_id": str(uuid.uuid4())  # Unique ID for deduplication
}

response = post(private_key, API_KEY_ID, '/trade-api/v2/portfolio/orders', order_data)

if response.status_code == 201:
    order = response.json()['order']
    print(f"Order placed successfully!")
    print(f"Order ID: {order['order_id']}")
    print(f"Client Order ID: {order_data['client_order_id']}")
    print(f"Status: {order['status']}")
else:
    print(f"Error: {response.status_code} - {response.text}")
```

--------------------------------

### Subscribe to Ticker Updates

Source: https://docs.kalshi.com/getting_started/quick_start_websockets

Allows you to subscribe to real-time ticker updates for all markets available on Kalshi.

```APIDOC
## Subscribe to Ticker Updates

### Description
Subscribe to ticker updates for all markets.

### Method
WebSocket (Implicit)

### Endpoint
N/A (WebSocket connection)

### Parameters
#### Request Body
```json
{
  "id": "integer",
  "cmd": "subscribe",
  "params": {
    "channels": ["ticker"]
  }
}
```

- **id** (integer) - Required - A unique message identifier.
- **cmd** (string) - Required - The command to execute, must be "subscribe".
- **params** (object) - Required - Contains parameters for the subscription.
  - **channels** (array of strings) - Required - Specifies the channels to subscribe to, must include "ticker".

### Request Example
```json
{
  "id": 1,
  "cmd": "subscribe",
  "params": {
    "channels": ["ticker"]
  }
}
```

### Response
#### Success Response (200)
Messages will be sent to the client based on ticker updates.

#### Response Example
(Example not provided in source material, but would contain ticker data)
```

--------------------------------

### New timestamp filters for Markets API

Source: https://docs.kalshi.com/changelog

Added `created_time` to GET /markets and GET /market responses, and new timestamp filters for the GET /markets endpoint.

```APIDOC
## GET /markets

### Description
Retrieves a list of markets with new timestamp filters and `created_time` in the response.

### Method
GET

### Endpoint
`/markets`

### Parameters
#### Query Parameters
- **min_created_ts** (integer) - Optional - Filter markets by minimum creation timestamp.
- **max_created_ts** (integer) - Optional - Filter markets by maximum creation timestamp.
- **min_close_ts** (integer) - Optional - Filter markets by minimum close timestamp.
- **max_close_ts** (integer) - Optional - Filter markets by maximum close timestamp.
- **min_settled_ts** (integer) - Optional - Filter markets by minimum settled timestamp.
- **max_settled_ts** (integer) - Optional - Filter markets by maximum settled timestamp.

### Response
#### Success Response (200)
- **created_time** (integer) - The creation timestamp of the market.

## GET /market

### Description
Retrieves a single market with `created_time` in the response.

### Method
GET

### Endpoint
`/market`

### Parameters
#### Query Parameters
- **market_id** (string) - Required - The ID of the market.

### Response
#### Success Response (200)
- **created_time** (integer) - The creation timestamp of the market.

```

--------------------------------

### WebSocket Error Handling

Source: https://docs.kalshi.com/getting_started/quick_start_websockets

Details the format of error messages received from the WebSocket server and provides a table of common error codes and their meanings.

```APIDOC
## Error Handling

### Description
The server sends error messages in a structured JSON format.

### Method
WebSocket (Implicit)

### Endpoint
N/A (WebSocket connection)

### Response
#### Error Response
```json
{
  "id": "integer",
  "type": "error",
  "msg": {
    "code": "integer",
    "msg": "string"
  }
}
```

- **id** (integer) - The identifier of the message that caused the error.
- **type** (string) - Always "error" for error messages.
- **msg** (object) - Contains details about the error.
  - **code** (integer) - A numerical error code.
  - **msg** (string) - A human-readable description of the error.

### WebSocket Error Codes

| Code | Error                     | Description                                  |
|------|---------------------------|----------------------------------------------|
| 1    | Unable to process message | General processing error                     |
| 2    | Params required           | Missing params object in command             |
| 3    | Channels required         | Missing channels array in subscribe          |
| 4    | Subscription IDs required | Missing sids in unsubscribe                  |
| 5    | Unknown command           | Invalid command name                         |
| 7    | Unknown subscription ID   | Subscription ID not found                    |
| 8    | Unknown channel name      | Invalid channel in subscribe                 |
| 9    | Authentication required   | Private channel without auth                 |
| 10   | Channel error             | Channel-specific error                       |
| 11   | Invalid parameter         | Malformed parameter value                    |
| 12   | Exactly one subscription ID required | For update_subscription                  |
| 13   | Unsupported action        | Invalid action for update_subscription       |
| 14   | Market ticker required    | Missing market specification                 |
| 15   | Action required           | Missing action in update_subscription        |
| 16   | Market not found          | Invalid market ticker                        |
| 17   | Internal error            | Server-side processing error                 |
```

--------------------------------

### Configure Kalshi TypeScript SDK with Private Key

Source: https://docs.kalshi.com/sdks/typescript/quickstart

Shows two methods for authenticating with the Kalshi TypeScript SDK using RSA-PSS signing. You can either provide the path to your private key file or supply the private key directly as a PEM-encoded string. Both methods require your API key and the base path for the Kalshi API.

```typescript
// Using file path
const config = new Configuration({
    apiKey: 'your-api-key-id',
    privateKeyPath: 'path/to/private-key.pem',
    basePath: 'https://api.elections.kalshi.com/trade-api/v2'
});

// Using PEM string
const config = new Configuration({
    apiKey: 'your-api-key-id',
    privateKeyPem: '-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----',
    basePath: 'https://api.elections.kalshi.com/trade-api/v2'
});
```

--------------------------------

### Initialize Kalshi Client and Get Trades

Source: https://docs.kalshi.com/python-sdk/api/MarketsApi

Demonstrates initializing the Kalshi client with a configuration and then calling the get_trades method. This function allows filtering trades by ticker, timestamp ranges, and supports pagination via a cursor. It includes basic error handling for the API call.

```python
import kalshi_python
from pprint import pprint

# See configuration.py for a list of all supported configuration parameters.
configuration = kalshi_python.Configuration(
    host = "https://api.elections.kalshi.com/trade-api/v2"
)


# Initialize the Kalshi client
client = kalshi_python.KalshiClient(configuration)

limit = 100 # int | Number of results per page. Defaults to 100. Maximum value is 1000. (optional) (default to 100)

cursor = 'cursor_example' # str | Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page. (optional)

ticker = 'ticker_example' # str | Filter by market ticker (optional)

min_ts = 56 # int | Filter items after this Unix timestamp (optional)

max_ts = 56 # int | Filter items before this Unix timestamp (optional)

try:
    # Get Trades
    api_response = client.get_trades(limit=limit, cursor=cursor, ticker=ticker, min_ts=min_ts, max_ts=max_ts)
    print("The response of MarketsApi->get_trades:\n")
    pprint(api_response)
except Exception as e:
    print("Exception when calling MarketsApi->get_trades: %s\n" % e)
```

--------------------------------

### Subscribe to Specific Markets

Source: https://docs.kalshi.com/getting_started/quick_start_websockets

Enables subscription to orderbook or trade updates for specific markets by providing channel and market ticker details.

```APIDOC
## Subscribe to Specific Markets

### Description
Subscribe to specific channels and markets for orderbook or trade updates.

### Method
WebSocket (Implicit)

### Endpoint
N/A (WebSocket connection)

### Parameters
#### Request Body
```json
{
  "id": "integer",
  "cmd": "subscribe",
  "params": {
    "channels": ["orderbook" | "trades"],
    "market_tickers": ["string"]
  }
}
```

- **id** (integer) - Required - A unique message identifier.
- **cmd** (string) - Required - The command to execute, must be "subscribe".
- **params** (object) - Required - Contains parameters for the subscription.
  - **channels** (array of strings) - Required - Specifies the channels to subscribe to (e.g., "orderbook", "trades").
  - **market_tickers** (array of strings) - Required - A list of market tickers to subscribe to (e.g., ["KXFUT24-LSV", "KXHARRIS24-LSV"]).

### Request Example
```json
{
  "id": 2,
  "cmd": "subscribe",
  "params": {
    "channels": ["orderbook"],
    "market_tickers": ["KXFUT24-LSV", "KXHARRIS24-LSV"]
  }
}
```

### Response
#### Success Response (200)
Messages will be sent to the client based on the specified market and channel updates.

#### Response Example
(Example not provided in source material, but would contain orderbook or trade data for specified markets)
```

--------------------------------

### GET /communications/quotes and GET /communications/quotes/{quote_id} Updates

Source: https://docs.kalshi.com/changelog/index

The GET /communications/quotes and GET /communications/quotes/{quote_id} endpoints now support subpenny bids through the `yes_bid_dollars` and `no_bid_dollars` fields. Released November 21, 2025.

```APIDOC
## GET /communications/quotes

### Description
Retrieves quote information, now including subpenny bid details.

### Method
GET

### Endpoint
/communications/quotes

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **yes_bid_dollars** (number) - The subpenny bid for 'yes'.
- **no_bid_dollars** (number) - The subpenny bid for 'no'.

#### Response Example
```json
{
  "quotes": [
    {
      "id": "quote_1",
      "yes_bid_dollars": 0.501,
      "no_bid_dollars": 0.499
    }
  ]
}
```

## GET /communications/quotes/{quote_id}

### Description
Retrieves specific quote information, now including subpenny bid details.

### Method
GET

### Endpoint
/communications/quotes/{quote_id}

### Parameters
#### Path Parameters
- **quote_id** (string) - Required - The ID of the quote.

### Request Example
None

### Response
#### Success Response (200)
- **yes_bid_dollars** (number) - The subpenny bid for 'yes'.
- **no_bid_dollars** (number) - The subpenny bid for 'no'.

#### Response Example
```json
{
  "id": "quote_1",
  "yes_bid_dollars": 0.501,
  "no_bid_dollars": 0.499
}
```
```

--------------------------------

### Get Event Candlesticks - OpenAPI 3.0

Source: https://docs.kalshi.com/api-reference/events/get-event-candlesticks

Retrieves aggregated candlestick data for a specific event. It requires event and series tickers, start and end timestamps, and a period interval (1 minute, 1 hour, or 1 day). The response includes market tickers and their corresponding candlestick data.

```yaml
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 3.3.0
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://api.elections.kalshi.com/trade-api/v2
    description: Production server
security: []
tags:
  - name: api-keys
    description: API key management endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: communications
    description: Request-for-quote (RFQ) endpoints
  - name: multivariate
    description: Multivariate event collection endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: live-data
    description: Live data endpoints
  - name: markets
    description: Market data endpoints
  - name: milestone
    description: Milestone endpoints
  - name: search
    description: Search and filtering endpoints
  - name: incentive-programs
    description: Incentive program endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: events
    description: Event endpoints
  - name: structured-targets
    description: Structured targets endpoints
paths:
  /series/{series_ticker}/events/{ticker}/candlesticks:
    get:
      tags:
        - events
      summary: Get Event Candlesticks
      description: ' End-point for returning aggregated data across all markets corresponding to an event.'
      operationId: GetMarketCandlesticksByEvent
      parameters:
        - name: ticker
          in: path
          required: true
          description: The event ticker
          schema:
            type: string
        - name: series_ticker
          in: path
          required: true
          description: The series ticker
          schema:
            type: string
        - name: start_ts
          in: query
          required: true
          description: Start timestamp for the range
          schema:
            type: integer
            format: int64
          x-oapi-codegen-extra-tags:
            validate: required
        - name: end_ts
          in: query
          required: true
          description: End timestamp for the range
          schema:
            type: integer
            format: int64
          x-oapi-codegen-extra-tags:
            validate: required
        - name: period_interval
          in: query
          required: true
          description: >-
            Specifies the length of each candlestick period, in minutes. Must be
            one minute, one hour, or one day.
          schema:
            type: integer
            format: int32
            enum:
              - 1
              - 60
              - 1440
          x-oapi-codegen-extra-tags:
            validate: required,oneof=1 60 1440
      responses:
        '200':
          description: Event candlesticks retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetEventCandlesticksResponse'
        '400':
          description: Bad request
        '401':
          description: Unauthorized
        '500':
          description: Internal server error
components:
  schemas:
    GetEventCandlesticksResponse:
      type: object
      required:
        - market_tickers
        - market_candlesticks
        - adjusted_end_ts
      properties:
        market_tickers:
          type: array
          description: Array of market tickers in the event.
          items:
            type: string
        market_candlesticks:
          type: array
          description: >-
            Array of market candlestick arrays, one for each market in the
            event.
          items:
            type: array
            items:
              $ref: '#/components/schemas/MarketCandlestick'
        adjusted_end_ts:
          type: integer
          format: int64
          description: >-
            Adjusted end timestamp if the requested candlesticks would be larger
            than maxAggregateCandidates.
    MarketCandlestick:
      type: object
      required:
        - end_period_ts
        - yes_bid
        - yes_ask
        - price
        - volume
        - open_interest
      properties:
        end_period_ts:
          type: integer
          format: int64
          description: Unix timestamp for the inclusive end of the candlestick period.
        yes_bid:
          $ref: '#/components/schemas/BidAskDistribution'
          description: >-
            Open, high, low, close (OHLC) data for YES buy offers on the market
            during the candlestick period.
        yes_ask:
          $ref: '#/components/schemas/BidAskDistribution'
          description: >-

```

--------------------------------

### GET /portfolio/balance

Source: https://docs.kalshi.com/python-sdk/api/PortfolioApi

Retrieves the user's current balance and portfolio value, both expressed in cents.

```APIDOC
## GET /portfolio/balance

### Description
Get Balance

Endpoint for getting the balance and portfolio value of a member. Both values are returned in cents.

### Method
GET

### Endpoint
/portfolio/balance

### Parameters

This endpoint does not need any parameters.

### Request Example

```json
{}
```

### Response
#### Success Response (200)
- **balance** (integer) - The current balance in cents.
- **portfolio_value** (integer) - The current portfolio value in cents.

#### Response Example

```json
{
  "balance": 1000000,
  "portfolio_value": 1250000
}
```

#### Error Responses
- **401**: Unauthorized - authentication required
- **500**: Internal server error
```

--------------------------------

### Get Incentive Programs API

Source: https://docs.kalshi.com/openapi

Retrieves a list of incentive programs. Supports pagination using a cursor.

```APIDOC
## GET /websites/kalshi/incentive_programs

### Description
Retrieves a list of incentive programs available on the platform. This endpoint supports pagination to fetch results incrementally.

### Method
GET

### Endpoint
/websites/kalshi/incentive_programs

### Query Parameters
- **limit** (integer) - Optional - The maximum number of incentive programs to return per page.
- **cursor** (string) - Optional - A cursor for fetching the next page of results. Obtained from the `next_cursor` field in the response of a previous request.

### Response
#### Success Response (200)
- **incentive_programs** (array) - A list of IncentiveProgram objects.
- **next_cursor** (string) - A cursor for pagination to get the next page of results.

#### Response Example
```json
{
  "incentive_programs": [
    {
      "id": "incentive_program_1",
      "market_ticker": "GOOG.2024-12-20",
      "incentive_type": "liquidity",
      "start_date": "2024-01-01T00:00:00Z",
      "end_date": "2024-12-31T23:59:59Z",
      "period_reward": 10000000000,
      "paid_out": false,
      "discount_factor_bps": 10,
      "target_size": 100000
    }
  ],
  "next_cursor": "some_cursor_string"
}
```
```

--------------------------------

### POST /orders

Source: https://docs.kalshi.com/changelog/index

Creates a new order. The response now returns the full Order model, consistent with the response from the `GET /portfolio/orders` endpoint.

```APIDOC
## POST /orders

### Description
Creates a new order. The response returned by this endpoint is now the full Order model, consistent with the model returned by the `GET /portfolio/orders` endpoint.

### Method
POST

### Endpoint
/orders

### Request Body
- **market_id** (string) - Required - The ID of the market for which to create the order.
- **type** (string) - Required - The type of order (e.g., `"buy"`, `"sell"`).
- **quantity** (integer) - Required - The number of contracts to order.
- **price_cents** (integer) - Required - The price in cents.
- **is_buy_quantity** (boolean) - Required - True if `quantity` represents buy orders, false if it represents sell orders.
- **limit_price_cents** (integer) - Optional - The limit price for stop orders.
- **order_type** (string) - Optional - The type of order (e.g., `"limit"`, `"market"`, `"stop"`).
- **post_only** (boolean) - Optional - If true, the order will only be posted to the order book and not match against existing orders.

### Request Example
```json
{
  "market_id": "mk_abc123",
  "type": "buy",
  "quantity": 10,
  "price_cents": 5000,
  "is_buy_quantity": true,
  "order_type": "limit",
  "post_only": true
}
```

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the order.
- **market_id** (string) - The ID of the market.
- **type** (string) - The type of order (`"buy"` or `"sell"`).
- **quantity** (integer) - The number of contracts.
- **price_cents** (integer) - The price in cents.
- **status** (string) - The current status of the order.
- **created_at** (string) - Timestamp of order creation.

### Response Example
```json
{
  "id": "ord_12345",
  "market_id": "mk_abc123",
  "type": "buy",
  "quantity": 10,
  "price_cents": 5000,
  "status": "open",
  "created_at": "2025-10-14T10:00:00Z"
}
```
```

--------------------------------

### Order Management Endpoints

Source: https://docs.kalshi.com/getting_started/quick_start_create_order

This section details the endpoints for managing orders, including checking status, listing all orders, amending orders, and cancelling orders.

```APIDOC
## GET /portfolio/orders/{order_id}

### Description
Retrieves the status of a specific order.

### Method
GET

### Endpoint
/portfolio/orders/{order_id}

### Parameters
#### Path Parameters
- **order_id** (string) - Required - The unique identifier of the order.

### Response
#### Success Response (200)
- **order_details** (object) - Detailed information about the order.

#### Response Example
{
  "order_details": {
    "id": "ord_12345",
    "status": "open",
    "price": 50,
    "quantity": 100
  }
}

## GET /portfolio/orders

### Description
Lists all orders associated with the authenticated user.

### Method
GET

### Endpoint
/portfolio/orders

### Response
#### Success Response (200)
- **orders** (array) - A list of order objects.

#### Response Example
{
  "orders": [
    {
      "id": "ord_12345",
      "status": "open"
    },
    {
      "id": "ord_67890",
      "status": "filled"
    }
  ]
}

## PUT /portfolio/orders/{order_id}

### Description
Amends the price or quantity of an existing order.

### Method
PUT

### Endpoint
/portfolio/orders/{order_id}

### Parameters
#### Path Parameters
- **order_id** (string) - Required - The unique identifier of the order to amend.

#### Request Body
- **price** (integer) - Optional - The new price for the order (1-99 cents).
- **quantity** (integer) - Optional - The new quantity for the order.

### Request Example
{
  "price": 55,
  "quantity": 90
}

### Response
#### Success Response (200)
- **order_update_status** (string) - Confirmation of the order update.

#### Response Example
{
  "order_update_status": "amended"
}

## DELETE /portfolio/orders/{order_id}

### Description
Cancels a specific order.

### Method
DELETE

### Endpoint
/portfolio/orders/{order_id}

### Parameters
#### Path Parameters
- **order_id** (string) - Required - The unique identifier of the order to cancel.

### Response
#### Success Response (200)
- **cancellation_status** (string) - Confirmation of the order cancellation.

#### Response Example
{
  "cancellation_status": "cancelled"
}
```

--------------------------------

### GET /incentive_programs

Source: https://docs.kalshi.com/api-reference/incentive-programs/get-incentives

Lists incentive programs with optional filters. Incentives are rewards programs for trading activity on specific markets.

```APIDOC
## GET /incentive_programs

### Description
List incentives with optional filters. Incentives are rewards programs for trading activity on specific markets.

### Method
GET

### Endpoint
/incentive_programs

### Parameters
#### Query Parameters
- **status** (string) - Optional - Status filter. Can be "all", "active", "upcoming", "closed", or "paid_out". Default is "all".
- **type** (string) - Optional - Type filter. Can be "all", "liquidity", or "volume". Default is "all".
- **limit** (integer) - Optional - Number of results per page. Defaults to 100. Maximum value is 10000.
- **cursor** (string) - Optional - Cursor for pagination

### Response
#### Success Response (200)
- **incentive_programs** (array) - List of incentive programs.
- **next_cursor** (string) - Cursor for pagination to get the next page of results.

#### Response Example
```json
{
  "incentive_programs": [
    {
      "id": "string",
      "market_ticker": "string",
      "incentive_type": "liquidity" | "volume",
      "start_date": "string (date-time)",
      "end_date": "string (date-time)",
      "period_reward": "string",
      "paid_out": "boolean"
    }
  ],
  "next_cursor": "string"
}
```

#### Error Response (400, 500)
- **code** (string) - Error code
- **message** (string) - Human-readable error message
- **details** (string) - Additional details about the error, if available
- **service** (string) - The name of the service that generated the error

#### Error Response Example
```json
{
  "code": "string",
  "message": "string",
  "details": "string",
  "service": "string"
}
```
```

--------------------------------

### Get Incentives

Source: https://docs.kalshi.com/api-reference/incentive-programs/get-incentives

Lists available incentives with optional filters. Incentives are reward programs for trading activity on specific markets.

```APIDOC
## GET /websites/kalshi/incentives

### Description
Lists incentives with optional filters. Incentives are rewards programs for trading activity on specific markets.

### Method
GET

### Endpoint
/websites/kalshi/incentives

### Parameters
#### Query Parameters
- **market_id** (string) - Optional - Filter incentives by a specific market ID.
- **program_type** (string) - Optional - Filter incentives by program type (e.g., "rebate", "bonus").

### Request Example
None

### Response
#### Success Response (200)
- **incentives** (array) - A list of incentive objects.
  - **incentive_id** (string) - Unique identifier for the incentive.
  - **market_id** (string) - The ID of the market associated with the incentive.
  - **program_type** (string) - The type of the incentive program.
  - **description** (string) - A description of the incentive.
  - **start_date** (string) - The start date of the incentive period (ISO 8601 format).
  - **end_date** (string) - The end date of the incentive period (ISO 8601 format).
  - **reward_details** (object) - Details about the reward.

#### Response Example
```json
{
  "incentives": [
    {
      "incentive_id": "incentive_123",
      "market_id": "market_abc",
      "program_type": "rebate",
      "description": "Get 5% rebate on trading fees for AAPL options.",
      "start_date": "2023-01-01T00:00:00Z",
      "end_date": "2023-12-31T23:59:59Z",
      "reward_details": {
        "type": "percentage",
        "value": 0.05
      }
    }
  ]
}
```
```

--------------------------------

### Python WebSocket Connection and Orderbook Subscription

Source: https://docs.kalshi.com/getting_started/quick_start_websockets

This Python code snippet establishes an authenticated WebSocket connection to the Kalshi trading API. It loads a private key for signing requests, constructs authentication headers, and subscribes to orderbook delta updates for a given market ticker. The code then processes various message types received from the WebSocket, including subscription confirmations, orderbook snapshots, and real-time deltas.

```python
KEY_ID = "your_api_key_id"
PRIVATE_KEY_PATH = "path/to/private_key.pem"
MARKET_TICKER = "KXHARRIS24-LSV"  # Replace with any open market
WS_URL = "wss://demo-api.kalshi.co/trade-api/ws/v2"

def sign_pss_text(private_key, text: str) -> str:
    """Sign message using RSA-PSS"""
    message = text.encode('utf-8')
    signature = private_key.sign(
        message,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.DIGEST_LENGTH
        ),
        hashes.SHA256()
    )
    return base64.b64encode(signature).decode('utf-8')

def create_headers(private_key, method: str, path: str) -> dict:
    """Create authentication headers"""
    timestamp = str(int(time.time() * 1000))
    msg_string = timestamp + method + path.split('?')[0]
    signature = sign_pss_text(private_key, msg_string)

    return {
        "Content-Type": "application/json",
        "KALSHI-ACCESS-KEY": KEY_ID,
        "KALSHI-ACCESS-SIGNATURE": signature,
        "KALSHI-ACCESS-TIMESTAMP": timestamp,
    }

async def orderbook_websocket():
    """Connect to WebSocket and subscribe to orderbook"""
    # Load private key
    with open(PRIVATE_KEY_PATH, 'rb') as f:
        private_key = serialization.load_pem_private_key(
            f.read(),
            password=None
        )

    # Create WebSocket headers
    ws_headers = create_headers(private_key, "GET", "/trade-api/ws/v2")

    async with websockets.connect(WS_URL, additional_headers=ws_headers) as websocket:
        print(f"Connected! Subscribing to orderbook for {MARKET_TICKER}")

        # Subscribe to orderbook
        subscribe_msg = {
            "id": 1,
            "cmd": "subscribe",
            "params": {
                "channels": ["orderbook_delta"],
                "market_ticker": MARKET_TICKER
            }
        }
        await websocket.send(json.dumps(subscribe_msg))

        # Process messages
        async for message in websocket:
            data = json.loads(message)
            msg_type = data.get("type")

            if msg_type == "subscribed":
                print(f"Subscribed: {data}")

            elif msg_type == "orderbook_snapshot":
                print(f"Orderbook snapshot: {data}")

            elif msg_type == "orderbook_delta":
                # The client_order_id field is optional - only present when you caused the change
                if 'client_order_id' in data.get('data', {}):
                    print(f"Orderbook update (your order {data['data']['client_order_id']}): {data}")
                else:
                    print(f"Orderbook update: {data}")

            elif msg_type == "error":
                print(f"Error: {data}")

# Run the example
if __name__ == "__main__":
    asyncio.run(orderbook_websocket())

```

--------------------------------

### Get Market Candlesticks using TypeScript

Source: https://docs.kalshi.com/typescript-sdk/api/MarketsApi

Retrieves candlestick data for a specific market within a series. This function allows specifying a time range and candlestick period. It requires series ticker, market ticker, and optionally start timestamp, end timestamp, and period interval.

```typescript
import {
    MarketsApi,
    Configuration
} from 'kalshi-typescript';

const configuration = new Configuration({
    apiKey: 'your-api-key-id',
    privateKeyPath: '/path/to/private-key.pem'  // or privateKeyPem: 'PEM string'
});
const apiInstance = new MarketsApi(configuration);

let ticker: string; //The series ticker (default to undefined)
let marketTicker: string; //The market ticker (default to undefined)
let startTs: number; //Start timestamp for the range (optional) (default to undefined)
let endTs: number; //End timestamp for the range (optional) (default to undefined)
let periodInterval: string; //Period interval for candlesticks (e.g., 1m, 5m, 1h, 1d) (optional) (default to undefined)

const { status, data } = await apiInstance.getMarketCandlesticks(
    ticker,
    marketTicker,
    startTs,
    endTs,
    periodInterval
);
```

--------------------------------

### Subscribe to Kalshi WebSocket Channels (Python)

Source: https://docs.kalshi.com/getting_started/quick_start_websockets

Provides Python functions to send subscription messages to the Kalshi WebSocket API. Uses the `json` library for message formatting. Supports subscribing to 'ticker' and 'orderbook_delta' channels, with the latter allowing specific market tickers.

```python
import json

async def subscribe_to_ticker(websocket):
    """Subscribe to ticker updates"""
    subscription = {
        "id": 1,
        "cmd": "subscribe",
        "params": {
            "channels": ["ticker"]
        }
    }
    await websocket.send(json.dumps(subscription))

async def subscribe_to_orderbook(websocket, market_tickers):
    """Subscribe to orderbook updates for specific markets"""
    subscription = {
        "id": 2,
        "cmd": "subscribe",
        "params": {
            "channels": ["orderbook_delta"],
            "market_tickers": market_tickers
        }
    }
    await websocket.send(json.dumps(subscription))
```

--------------------------------

### GET /markets/trades

Source: https://docs.kalshi.com/openapi

Get Trades. Endpoint for getting all trades for all markets. A trade represents a completed transaction between two users on a specific market. Each trade includes the market ticker, price, quantity, and timestamp information. This endpoint returns a paginated response. Use the 'limit' parameter to control page size (1-1000, defaults to 100). The response includes a 'cursor' field - pass this value in the 'cursor' parameter of your next request to get the next page. An empty cursor indicates no more pages are available.

```APIDOC
## GET /markets/trades

### Description
Get Trades. Endpoint for getting all trades for all markets. A trade represents a completed transaction between two users on a specific market. Each trade includes the market ticker, price, quantity, and timestamp information. This endpoint returns a paginated response. Use the 'limit' parameter to control page size (1-1000, defaults to 100). The response includes a 'cursor' field - pass this value in the 'cursor' parameter of your next request to get the next page. An empty cursor indicates no more pages are available.

### Method
GET

### Endpoint
/markets/trades

### Parameters
#### Path Parameters

#### Query Parameters
- **limit** (integer) - Optional - Maximum number of trades to return per page (1-1000, defaults to 100).
- **cursor** (string) - Optional - Cursor for pagination. Use the 'cursor' field from the previous response to get the next page of results.
- **ticker** (string) - Optional - Filter trades by a specific market ticker.
- **min_ts** (integer) - Optional - Filter trades with a timestamp greater than or equal to this Unix timestamp.
- **max_ts** (integer) - Optional - Filter trades with a timestamp less than or equal to this Unix timestamp.

#### Request Body

### Request Example

### Response
#### Success Response (200)
- **trades** (array) - An array of trade objects.
- **cursor** (string) - Cursor for pagination. Pass this value in the 'cursor' parameter of your next request to get the next page.

#### Response Example
{
  "example": "{\"trades\": [{\"market_ticker\": \"XYZ\", \"price\": 1.50, \"quantity\": 10, \"timestamp\": 1678886400}], \"cursor\": \"next_page_cursor\"}"
}
```

--------------------------------

### Subscribe to Specific Markets (Python)

Source: https://docs.kalshi.com/getting_started/quick_start_websockets

Subscribes to specific channels (e.g., 'orderbook', 'trades') for designated market tickers. This function takes a list of channels and market tickers as input and sends a structured subscription message over the WebSocket connection.

```python
async def subscribe_to_markets(self, channels, market_tickers):
    """Subscribe to specific channels and markets"""
    subscription_message = {
        "id": self.message_id,
        "cmd": "subscribe",
        "params": {
            "channels": channels,
            "market_tickers": market_tickers
        }
    }
    await self.ws.send(json.dumps(subscription_message))
    self.message_id += 1

# Example usage:
# Subscribe to orderbook updates
# await subscribe_to_markets(["orderbook"], ["KXFUT24-LSV", "KXHARRIS24-LSV"])

# Subscribe to trade feed
# await subscribe_to_markets(["trades"], ["KXFUT24-LSV"])
```

--------------------------------

### Get Events - Limit Parameter Enhancement

Source: https://docs.kalshi.com/changelog

The GET /events endpoint's 'limit' parameter now defaults to 200 (up from 100) and correctly respects the parameter when 'with_nested_markets=true'.

```HTTP
GET /events?limit=200&with_nested_markets=true
```

--------------------------------

### Get Events - With Milestones Flag

Source: https://docs.kalshi.com/changelog

The GET /events endpoint now supports an optional 'with_milestones' flag, which includes all associated milestones with the returned events.

```HTTP
GET /events?with_milestones=true
```

--------------------------------

### FIX Protocol Error Examples

Source: https://docs.kalshi.com/fix/error-handling

Examples of FIX protocol messages for business logic errors and order rejections.

```APIDOC
## FIX Protocol Error Examples

### Business Logic Error Scenario: Trading during maintenance

**Request:**
```fix
8=FIXT.1.1|35=D|11=456|38=10|55=HIGHNY-23DEC31|...
```

**Response (BusinessMessageReject):**
```fix
8=FIXT.1.1|35=j|45=10|58=Kalshi exchange unavailable|372=D|380=4|
```

### Order Rejection Scenario: Insufficient funds

**Response (ExecutionReport):**
```fix
8=FIXT.1.1|35=8|11=789|150=8|39=8|58=Insufficient funds|103=99|...
```
```

--------------------------------

### Get Markets - Multivariate Event Filtering

Source: https://docs.kalshi.com/changelog

The GET /markets endpoint now supports the 'mve_filter' parameter to filter multivariate events. Options include 'only', 'exclude', or no parameter for default behavior.

```HTTP
GET /markets?mve_filter=only
```

```HTTP
GET /markets?mve_filter=exclude
```

```HTTP
GET /markets
```

--------------------------------

### Subscribe to Ticker Updates (Python)

Source: https://docs.kalshi.com/getting_started/quick_start_websockets

Subscribes to real-time ticker updates for all markets via the WebSocket API. Requires an active WebSocket connection and generates a subscription message.

```python
async def subscribe_to_tickers(self):
    """Subscribe to ticker updates for all markets"""
    subscription_message = {
        "id": self.message_id,
        "cmd": "subscribe",
        "params": {
            "channels": ["ticker"]
        }
    }
    await self.ws.send(json.dumps(subscription_message))
    self.message_id += 1
```

--------------------------------

### Get User Data Timestamp OpenAPI Specification

Source: https://docs.kalshi.com/api-reference/exchange/get-user-data-timestamp

The OpenAPI specification for the Get User Data Timestamp endpoint. It outlines the request method (GET), the endpoint path (`/exchange/user_data_timestamp`), and the expected response structure, including a `GetUserDataTimestampResponse` schema with an `as_of_time` property.

```yaml
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 3.3.0
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://api.elections.kalshi.com/trade-api/v2
    description: Production server
security: []
tags:
  - name: api-keys
    description: API key management endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: communications
    description: Request-for-quote (RFQ) endpoints
  - name: multivariate
    description: Multivariate event collection endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: live-data
    description: Live data endpoints
  - name: markets
    description: Market data endpoints
  - name: milestone
    description: Milestone endpoints
  - name: search
    description: Search and filtering endpoints
  - name: incentive-programs
    description: Incentive program endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: events
    description: Event endpoints
  - name: structured-targets
    description: Structured targets endpoints
paths:
  /exchange/user_data_timestamp:
    get:
      tags:
        - exchange
      summary: Get User Data Timestamp
      description: ' There is typically a short delay before exchange events are reflected in the API endpoints. Whenever possible, combine API responses to PUT/POST/DELETE requests with websocket data to obtain the most accurate view of the exchange state. This endpoint provides an approximate indication of when the data from the following endpoints was last validated: GetBalance, GetOrder(s), GetFills, GetPositions'
      operationId: GetUserDataTimestamp
      responses:
        '200':
          description: User data timestamp retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetUserDataTimestampResponse'
        '500':
          description: Internal server error
components:
  schemas:
    GetUserDataTimestampResponse:
      type: object
      required:
        - as_of_time
      properties:
        as_of_time:
          type: string
          format: date-time
          description: Timestamp when user data was last updated.

```

--------------------------------

### Get Order Group Endpoint Definition (OpenAPI)

Source: https://docs.kalshi.com/api-reference/order-groups/get-order-group

Defines the 'Get Order Group' endpoint for the Kalshi Trade API using OpenAPI 3.0. It specifies the request method (GET), path parameters, expected responses (including success and error codes), and security requirements.

```yaml
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 3.3.0
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://api.elections.kalshi.com/trade-api/v2
    description: Production server
security: []
tags:
  - name: api-keys
    description: API key management endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: communications
    description: Request-for-quote (RFQ) endpoints
  - name: multivariate
    description: Multivariate event collection endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: live-data
    description: Live data endpoints
  - name: markets
    description: Market data endpoints
  - name: milestone
    description: Milestone endpoints
  - name: search
    description: Search and filtering endpoints
  - name: incentive-programs
    description: Incentive program endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: events
    description: Event endpoints
  - name: structured-targets
    description: Structured targets endpoints
paths:
  /portfolio/order_groups/{order_group_id}:
    get:
      tags:
        - order-groups
      summary: Get Order Group
      description: ' Retrieves details for a single order group including all order IDs and auto-cancel status.'
      operationId: GetOrderGroup
      parameters:
        - $ref: '#/components/parameters/OrderGroupIdPath'
      responses:
        '200':
          description: Order group retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetOrderGroupResponse'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '404':
          $ref: '#/components/responses/NotFoundError'
        '500':
          $ref: '#/components/responses/InternalServerError'
      security:
        - kalshiAccessKey: []
          kalshiAccessSignature: []
          kalshiAccessTimestamp: []
components:
  parameters:
    OrderGroupIdPath:
      name: order_group_id
      in: path
      required: true
      description: Order group ID
      schema:
        type: string
  schemas:
    GetOrderGroupResponse:
      type: object
      required:
        - is_auto_cancel_enabled
        - orders
      properties:
        is_auto_cancel_enabled:
          type: boolean
          description: Whether auto-cancel is enabled for this order group
        orders:
          type: array
          items:
            type: string
          description: List of order IDs that belong to this order group
          x-go-type-skip-optional-pointer: true
    ErrorResponse:
      type: object
      properties:
        code:
          type: string
          description: Error code
        message:
          type: string
          description: Human-readable error message
        details:
          type: string
          description: Additional details about the error, if available
        service:
          type: string
          description: The name of the service that generated the error
  responses:
    UnauthorizedError:
      description: Unauthorized - authentication required
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    NotFoundError:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    InternalServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
  securitySchemes:
    kalshiAccessKey:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-KEY
      description: Your API key ID
    kalshiAccessSignature:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-SIGNATURE
      description: RSA-PSS signature of the request
    kalshiAccessTimestamp:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-TIMESTAMP
      description: Request timestamp in milliseconds
```

--------------------------------

### Get Events Multivariate - New Endpoint

Source: https://docs.kalshi.com/changelog

A new endpoint, GET /events/multivariate, has been introduced to retrieve multivariate events with filtering by series and collection ticker. The existing GET /events endpoint will exclude multivariate events in the future.

```HTTP
GET /events/multivariate?series_ticker=SERIES&collection_ticker=COLLECTION
```

--------------------------------

### Fetch Navigation and Site Content

Source: https://docs.kalshi.com/python-sdk/api/ExchangeApi

Retrieves navigation and other site content by fetching the llms.txt file.

```APIDOC
## GET /llms.txt

### Description
Fetches navigation and other site content. This endpoint is designed to provide access to the site's structural and informational content, typically used for site mapping or content discovery.

### Method
GET

### Endpoint
/llms.txt

### Parameters

#### Path Parameters
None

#### Query Parameters
None

### Request Example
```
(No request body for GET request)
```

### Response
#### Success Response (200)
- **content** (string) - The content of the llms.txt file, containing navigation and other site data.

#### Response Example
```text
(Content of the llms.txt file will be returned here)
```
```

--------------------------------

### Create Order Response - Full Order Model

Source: https://docs.kalshi.com/changelog

The response from the create order endpoint now returns the full Order model, consistent with the response from the get order endpoint.

```APIDOC
## POST /orders

### Description
The response model for creating an order has been updated to be identical to the model returned by the `GET /orders` endpoint. This ensures consistency in the order data structure returned to the user.

### Method
POST

### Endpoint
/orders

### Request Body
* (object) - Order creation payload.

### Response
#### Success Response (200 or 201)
* **order** (object) - The full Order model, including all details of the created order.
```

--------------------------------

### GET /portfolio/positions

Source: https://docs.kalshi.com/python-sdk/api/PortfolioApi

Retrieves the user's current market positions. Each position details the market, quantity, and value.

```APIDOC
## GET /portfolio/positions

### Description
Get Positions

Endpoint for getting the positions of a member.

### Method
GET

### Endpoint
/portfolio/positions

### Parameters

This endpoint does not need any parameters.

### Request Example

```json
{}
```

### Response
#### Success Response (200)
- **positions** (array) - A list of position objects.

#### Response Example

```json
{
  "positions": [
    {
      "market": "BTC-2024-01-01",
      "quantity": 100,
      "value": 5000000
    }
  ]
}
```
```

--------------------------------

### Get Multiple Live Data Endpoint (OpenAPI)

Source: https://docs.kalshi.com/api-reference/live-data/get-multiple-live-data

This OpenAPI specification defines the GET /live_data/batch endpoint for retrieving live data for multiple milestones. It requires an array of milestone IDs as a query parameter and returns live data objects upon success.

```yaml
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 3.3.0
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://api.elections.kalshi.com/trade-api/v2
    description: Production server
security: []
tags:
  - name: api-keys
    description: API key management endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: communications
    description: Request-for-quote (RFQ) endpoints
  - name: multivariate
    description: Multivariate event collection endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: live-data
    description: Live data endpoints
  - name: markets
    description: Market data endpoints
  - name: milestone
    description: Milestone endpoints
  - name: search
    description: Search and filtering endpoints
  - name: incentive-programs
    description: Incentive program endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: events
    description: Event endpoints
  - name: structured-targets
    description: Structured targets endpoints
paths:
  /live_data/batch:
    get:
      tags:
        - live-data
      summary: Get Multiple Live Data
      description: Get live data for multiple milestones
      operationId: GetLiveDatas
      parameters:
        - name: milestone_ids
          in: query
          required: true
          description: Array of milestone IDs
          schema:
            type: array
            items:
              type: string
            maxItems: 100
          style: form
          explode: true
      responses:
        '200':
          description: Live data retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetLiveDatasResponse'
        '500':
          description: Internal server error
components:
  schemas:
    GetLiveDatasResponse:
      type: object
      required:
        - live_datas
      properties:
        live_datas:
          type: array
          items:
            $ref: '#/components/schemas/LiveData'
    LiveData:
      type: object
      required:
        - type
        - details
        - milestone_id
      properties:
        type:
          type: string
          description: Type of live data
        details:
          type: object
          additionalProperties: true
          description: Live data details as a flexible object
        milestone_id:
          type: string
          description: Milestone ID

```

--------------------------------

### Get Quotes

Source: https://docs.kalshi.com/typescript-sdk/api/CommunicationsApi

Retrieves a list of quotes. This endpoint is accessed via a GET request to /communications/quotes.

```APIDOC
## GET /communications/quotes

### Description
Retrieves a list of quotes.

### Method
GET

### Endpoint
/communications/quotes

### Parameters
#### Query Parameters
[Details of any query parameters for filtering or pagination, e.g., `limit`, `offset`, `status`]

### Response
#### Success Response
- **Array of Quote objects** - A list of quotes matching the query parameters.

#### Error Responses
- **401**: Unauthorized - authentication required.
- **500**: Internal server error.
```

--------------------------------

### Get Balance Endpoint (OpenAPI)

Source: https://docs.kalshi.com/api-reference/portfolio/get-balance

This OpenAPI definition describes the GET /portfolio/balance endpoint. It specifies the request method, parameters, expected responses, and security requirements. The endpoint returns the user's balance and portfolio value in cents, along with a timestamp of the last update.

```yaml
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 3.3.0
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://api.elections.kalshi.com/trade-api/v2
    description: Production server
security: []
tags:
  - name: api-keys
    description: API key management endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: communications
    description: Request-for-quote (RFQ) endpoints
  - name: multivariate
    description: Multivariate event collection endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: live-data
    description: Live data endpoints
  - name: markets
    description: Market data endpoints
  - name: milestone
    description: Milestone endpoints
  - name: search
    description: Search and filtering endpoints
  - name: incentive-programs
    description: Incentive program endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: events
    description: Event endpoints
  - name: structured-targets
    description: Structured targets endpoints
paths:
  /portfolio/balance:
    get:
      tags:
        - portfolio
      summary: Get Balance
      description: ' Endpoint for getting the balance and portfolio value of a member. Both values are returned in cents.'
      operationId: GetBalance
      responses:
        '200':
          description: Balance retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetBalanceResponse'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '500':
          $ref: '#/components/responses/InternalServerError'
      security:
        - kalshiAccessKey: []
          kalshiAccessSignature: []
          kalshiAccessTimestamp: []
components:
  schemas:
    GetBalanceResponse:
      type: object
      required:
        - balance
        - portfolio_value
        - updated_ts
      properties:
        balance:
          type: integer
          format: int64
          description: >-
            Member's available balance in cents. This represents the amount
            available for trading.
        portfolio_value:
          type: integer
          format: int64
          description: >-
            Member's portfolio value in cents. This is the current value of all
            positions held.
        updated_ts:
          type: integer
          format: int64
          description: Unix timestamp of the last update to the balance.
    ErrorResponse:
      type: object
      properties:
        code:
          type: string
          description: Error code
        message:
          type: string
          description: Human-readable error message
        details:
          type: string
          description: Additional details about the error, if available
        service:
          type: string
          description: The name of the service that generated the error
  responses:
    UnauthorizedError:
      description: Unauthorized - authentication required
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    InternalServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
  securitySchemes:
    kalshiAccessKey:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-KEY
      description: Your API key ID
    kalshiAccessSignature:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-SIGNATURE
      description: RSA-PSS signature of the request
    kalshiAccessTimestamp:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-TIMESTAMP
      description: Request timestamp in milliseconds
```

--------------------------------

### GET /live_data/{type}/milestone/{milestone_id}

Source: https://docs.kalshi.com/api-reference/live-data/get-live-data

Fetches live data for a specified milestone, requiring the data type and milestone ID as path parameters.

```APIDOC
## GET /live_data/{type}/milestone/{milestone_id}

### Description
Retrieves live data for a specific milestone, identified by its type and ID.

### Method
GET

### Endpoint
/live_data/{type}/milestone/{milestone_id}

### Parameters
#### Path Parameters
- **type** (string) - Required - Type of live data to retrieve.
- **milestone_id** (string) - Required - The unique identifier for the milestone.

### Request Example
```json
{
  "example": "No request body needed for this GET request."
}
```

### Response
#### Success Response (200)
- **live_data** (object) - Contains the live data for the specified milestone.
  - **type** (string) - The type of live data.
  - **details** (object) - Additional details about the live data. Can contain flexible key-value pairs.
  - **milestone_id** (string) - The ID of the milestone associated with the data.

#### Response Example
```json
{
  "live_data": {
    "type": "event_status",
    "details": {
      "status": "active",
      "last_updated": "2023-10-27T10:00:00Z"
    },
    "milestone_id": "milestone_123"
  }
}
```

#### Error Responses
- **404**: Live data not found for the given milestone.
- **500**: Internal server error.
```

--------------------------------

### Get RFQs

Source: https://docs.kalshi.com/typescript-sdk/api/CommunicationsApi

Retrieves a list of Requests for Quote (RFQs). This endpoint is accessed via a GET request to /communications/rfqs.

```APIDOC
## GET /communications/rfqs

### Description
Retrieves a list of Requests for Quote (RFQs).

### Method
GET

### Endpoint
/communications/rfqs

### Parameters
#### Query Parameters
[Details of any query parameters for filtering or pagination, e.g., `limit`, `offset`, `status`]

### Response
#### Success Response
- **Array of RFQ objects** - A list of RFQs matching the query parameters.

#### Error Responses
- **401**: Unauthorized - authentication required.
- **500**: Internal server error.
```

--------------------------------

### GET /series Tag Filtering

Source: https://docs.kalshi.com/changelog/index

The 'tags' parameter for the GET /series endpoint now correctly supports tags with spaces and uses comma separation.

```APIDOC
## GET /series Tag Filtering

### Description
Fixed the `GET /series` endpoint's tags parameter to properly support tags containing spaces. The parameter now **only** splits on commas (`,`).

### Method
GET

### Endpoint
/series

### Parameters
#### Query Parameters
- **tags** (string) - Required - A comma-separated list of tags. Tags can now contain spaces.

### Request Example
GET /series?tags=Rotten Tomatoes,Television

### Response
#### Success Response (200)
- Returns series matching the provided tags.

#### Response Example
```json
{
  "series": [
    {
      "name": "Example Series",
      "tags": ["Rotten Tomatoes", "Television"]
    }
  ]
}
```
```

--------------------------------

### GET /portfolio/fills

Source: https://docs.kalshi.com/api-reference/portfolio/get-fills

Retrieves all fills for the authenticated member. A fill represents a matched trade.

```APIDOC
## GET /portfolio/fills

### Description
Endpoint for getting all fills for the member. A fill is when a trade you have is matched.

### Method
GET

### Endpoint
/portfolio/fills

### Parameters
#### Query Parameters
- **ticker** (string) - Optional - Filter by market ticker
- **order_id** (string) - Optional - Filter by order ID
- **min_ts** (integer) - Optional - Filter items after this Unix timestamp
- **max_ts** (integer) - Optional - Filter items before this Unix timestamp
- **limit** (integer) - Optional - Number of results per page. Defaults to 100. Maximum value is 200.
- **cursor** (string) - Optional - Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page.

### Request Example
```json
{
  "example": "Request body not applicable for GET"
}
```

### Response
#### Success Response (200)
- **fills** (array) - An array of fill objects.
  - **fill_id** (string) - Unique identifier for this fill
  - **trade_id** (string) - Unique identifier for this fill (legacy field name, same as fill_id)
  - **order_id** (string) - Unique identifier for the order that resulted in this fill
  - **client_order_id** (string) - Client-provided identifier for the order that resulted in this fill
  - **ticker** (string) - Unique identifier for the market
  - **market_ticker** (string)
  - **side** (string)
  - **action** (string)
  - **count** (integer)
  - **price** (number)
  - **yes_price** (number)
  - **no_price** (number)
  - **yes_price_fixed** (boolean)
  - **no_price_fixed** (boolean)
  - **is_taker** (boolean)
- **cursor** (string) - Pagination cursor for the next page of results

#### Response Example
```json
{
  "fills": [
    {
      "fill_id": "f_a1b2c3d4",
      "trade_id": "t_a1b2c3d4",
      "order_id": "o_e5f6g7h8",
      "client_order_id": "c_i9j0k1l2",
      "ticker": "ACME",
      "market_ticker": "ACME/GOOG",
      "side": "buy",
      "action": "buy_limit",
      "count": 10,
      "price": 0.50,
      "yes_price": 0.50,
      "no_price": 0.50,
      "yes_price_fixed": true,
      "no_price_fixed": true,
      "is_taker": true
    }
  ],
  "cursor": "next_cursor_value"
}
```

#### Error Responses
- **400** - Bad request
- **401** - Unauthorized
- **500** - Internal server error
```

--------------------------------

### Get Portfolio Settlements - Fee Cost Addition

Source: https://docs.kalshi.com/changelog

The GET /portfolio/settlements endpoint now includes the sum of trade fees paid by the user on a settled market position.

```HTTP
GET /portfolio/settlements
```

--------------------------------

### Incentive Programs API - Series Ticker Field

Source: https://docs.kalshi.com/changelog

The Incentive Programs API now includes a `series_ticker` field in its responses for both GET /v2/incentive_programs and GET /incentive_programs endpoints.

```APIDOC
## GET /v2/incentive_programs and GET /incentive_programs

### Description
These endpoints now return a `series_ticker` field for each incentive program.

### Method
GET

### Endpoint
/v2/incentive_programs
/incentive_programs

### Parameters
None

### Request Example
(Not applicable for GET requests without parameters)

### Response
#### Success Response (200)
- **series_ticker** (string) - The ticker symbol for the series associated with the incentive program.
```

--------------------------------

### Get Tags by Series Categories (OpenAPI)

Source: https://docs.kalshi.com/api-reference/search/get-tags-for-series-categories

Defines the OpenAPI specification for the 'Get Tags for Series Categories' endpoint. It outlines the request method (GET), path (/search/tags_by_categories), expected responses (200, 401, 500), and the schema for the successful response, which includes a mapping of series categories to arrays of tags.

```yaml
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 3.3.0
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://api.elections.kalshi.com/trade-api/v2
    description: Production server
security: []
tags:
  - name: api-keys
    description: API key management endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: communications
    description: Request-for-quote (RFQ) endpoints
  - name: multivariate
    description: Multivariate event collection endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: live-data
    description: Live data endpoints
  - name: markets
    description: Market data endpoints
  - name: milestone
    description: Milestone endpoints
  - name: search
    description: Search and filtering endpoints
  - name: incentive-programs
    description: Incentive program endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: events
    description: Event endpoints
  - name: structured-targets
    description: Structured targets endpoints
paths:
  /search/tags_by_categories:
    get:
      tags:
        - search
      summary: Get Tags for Series Categories
      description: >
        Retrieve tags organized by series categories.


        This endpoint returns a mapping of series categories to their associated
        tags, which can be used for filtering and search functionality.
      operationId: GetTagsForSeriesCategories
      responses:
        '200':
          description: Tags retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetTagsForSeriesCategoriesResponse'
        '401':
          description: Unauthorized
        '500':
          description: Internal server error
components:
  schemas:
    GetTagsForSeriesCategoriesResponse:
      type: object
      required:
        - tags_by_categories
      properties:
        tags_by_categories:
          type: object
          description: Mapping of series categories to their associated tags
          additionalProperties:
            type: array
            items:
              type: string

```

--------------------------------

### Kalshi API Authentication

Source: https://docs.kalshi.com/getting_started/api_keys

Demonstrates how to load a private key from a file and sign requests for the Kalshi API.

```APIDOC
## Kalshi API Authentication

### Description
This section details the process of authenticating with the Kalshi API using a private key. It includes functions for loading the private key from a file and signing text with the private key for request authorization.

### Loading Private Key

Loads the private key from a specified file path.

- **Function**: `loadPrivateKeyFromFile(filePath)`
- **Parameters**:
  - `filePath` (string) - The path to the private key file.
- **Returns**:
  - (string) - The private key in PEM format.

### Signing Text

Signs a given text using a private key with RSA-SHA256 padding.

- **Function**: `signPssText(privateKeyPem, text)`
- **Parameters**:
  - `privateKeyPem` (string) - The private key in PEM format.
  - `text` (string) - The text to sign.
- **Returns**:
  - (string) - The base64 encoded signature.

### Sending a Request

An example of sending a GET request to the Kalshi API with the signed header.

- **HTTP Method**: GET
- **Endpoint**: `https://demo-api.kalshi.co/trade-api/v2/portfolio/balance`
- **Headers**:
  - `KALSHI-ACCESS-KEY` (string) - Your API key ID.
  - `KALSHI-ACCESS-SIGNATURE` (string) - The signature generated using the private key and the request details.
  - `KALSHI-ACCESS-TIMESTAMP` (string) - The timestamp of the request in milliseconds.

#### Request Example (Conceptual)
```javascript
const axios = require('axios');

// Assume loadPrivateKeyFromFile and signPssText are defined as above

const currentTimeMilliseconds = Date.now();
const timestampStr = currentTimeMilliseconds.toString();

const privateKeyPem = loadPrivateKeyFromFile('path/to/your/private-key.pem');

const method = "GET";
const baseUrl = 'https://demo-api.kalshi.co';
const path = '/trade-api/v2/portfolio/balance';

const pathWithoutQuery = path.split('?')[0];
const msgString = timestampStr + method + pathWithoutQuery;
const sig = signPssText(privateKeyPem, msgString);

const headers = {
    'KALSHI-ACCESS-KEY': 'your-api-key-id',
    'KALSHI-ACCESS-SIGNATURE': sig,
    'KALSHI-ACCESS-TIMESTAMP': timestampStr
};

axios.get(baseUrl + path, { headers })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
```

#### Response Example (Success)
```json
{
  "example": "response body"
}
```
```

--------------------------------

### Get Exchange Announcements OpenAPI Spec

Source: https://docs.kalshi.com/api-reference/exchange/get-exchange-announcements

OpenAPI specification for the 'Get Exchange Announcements' endpoint. This defines the GET request for retrieving all exchange-wide announcements, including its path, tags, summary, and detailed response schemas for successful retrieval and errors. It also defines the structure for announcement objects.

```yaml
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 3.3.0
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://api.elections.kalshi.com/trade-api/v2
    description: Production server
security: []
tags:
  - name: api-keys
    description: API key management endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: communications
    description: Request-for-quote (RFQ) endpoints
  - name: multivariate
    description: Multivariate event collection endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: live-data
    description: Live data endpoints
  - name: markets
    description: Market data endpoints
  - name: milestone
    description: Milestone endpoints
  - name: search
    description: Search and filtering endpoints
  - name: incentive-programs
    description: Incentive program endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: events
    description: Event endpoints
  - name: structured-targets
    description: Structured targets endpoints
paths:
  /exchange/announcements:
    get:
      tags:
        - exchange
      summary: Get Exchange Announcements
      description: ' Endpoint for getting all exchange-wide announcements.'
      operationId: GetExchangeAnnouncements
      responses:
        '200':
          description: Exchange announcements retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetExchangeAnnouncementsResponse'
        '500':
          description: Internal server error
components:
  schemas:
    GetExchangeAnnouncementsResponse:
      type: object
      required:
        - announcements
      properties:
        announcements:
          type: array
          description: A list of exchange-wide announcements.
          items:
            $ref: '#/components/schemas/Announcement'
    Announcement:
      type: object
      required:
        - type
        - message
        - delivery_time
        - status
      properties:
        type:
          type: string
          enum:
            - info
            - warning
            - error
          description: The type of the announcement.
        message:
          type: string
          description: The message contained within the announcement.
        delivery_time:
          type: string
          format: date-time
          description: The time the announcement was delivered.
        status:
          type: string
          enum:
            - active
            - inactive
          description: The current status of this announcement.

```

--------------------------------

### GET /events

Source: https://docs.kalshi.com/changelog

Retrieves information about events, including broker availability.

```APIDOC
## GET /events

### Description
Get information about events. This endpoint now includes `available_on_brokers` which indicates that they are available on intermediate platforms/brokers.

### Method
GET

### Endpoint
/events

### Query Parameters
- **id** (integer) - Optional - Filter by event ID.
- **category** (string) - Optional - Filter by event category.

### Response
#### Success Response (200)
- **events** (array) - An array of event objects.
  - **id** (integer) - The event ID.
  - **title** (string) - The event title.
  - **available_on_brokers** (boolean) - Indicates if the event is available on brokers.
```

--------------------------------

### GET /websites/kalshi

Source: https://docs.kalshi.com/python-sdk/api/EventsApi

Retrieves a list of events based on the provided filters and pagination parameters.

```APIDOC
## GET /websites/kalshi

### Description
Retrieves a list of events based on the provided filters and pagination parameters.

### Method
GET

### Endpoint
/websites/kalshi

### Parameters
#### Query Parameters
- **limit** (int) - Optional - Parameter to specify the number of results per page. Defaults to 200. Maximum value is 200.
- **cursor** (str) - Optional - Parameter to specify the pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page.
- **with_nested_markets** (bool) - Optional - Parameter to specify if nested markets should be included in the response. When true, each event will include a 'markets' field containing a list of Market objects associated with that event. Defaults to False.
- **with_milestones** (bool) - Optional - If true, includes related milestones as a field alongside events. Defaults to False.
- **status** (str) - Optional - Filter by event status. Possible values are 'open', 'closed', 'settled'. Leave empty to return events with any status.
- **series_ticker** (str) - Optional - Filter by series ticker.
- **min_close_ts** (int) - Optional - Filter events with at least one market with close timestamp greater than this Unix timestamp (in seconds).

### Response
#### Success Response (200)
- **GetEventsResponse** (object) - Events retrieved successfully

#### Response Example
{
  "example": "response body"
}
```

--------------------------------

### WebSocket Error Message Format (JSON)

Source: https://docs.kalshi.com/getting_started/quick_start_websockets

Illustrates the JSON structure for error messages received from the WebSocket server. Includes an ID, type 'error', and a message object containing error code and description.

```json
{
  "id": 123,
  "type": "error",
  "msg": {
    "code": 6,
    "msg": "Params required"
  }
}
```

--------------------------------

### Subpenny bids added to Get Quote API

Source: https://docs.kalshi.com/changelog

The Subpenny fields `yes_bid_dollars` and `no_bid_dollars` are now available on the Get Quote API endpoints.

```APIDOC
## GET /communications/quotes

### Description
Retrieves quote information, now including subpenny bid details.

### Method
GET

### Endpoint
`/communications/quotes`

### Response
#### Success Response (200)
- **yes_bid_dollars** (number) - The subpenny bid in dollars for 'yes'.
- **no_bid_dollars** (number) - The subpenny bid in dollars for 'no'.

## GET /communications/quotes/{quote_id}

### Description
Retrieves quote information for a specific quote ID, now including subpenny bid details.

### Method
GET

### Endpoint
`/communications/quotes/{quote_id}`

### Parameters
#### Path Parameters
- **quote_id** (string) - Required - The ID of the quote.

### Response
#### Success Response (200)
- **yes_bid_dollars** (number) - The subpenny bid in dollars for 'yes'.
- **no_bid_dollars** (number) - The subpenny bid in dollars for 'no'.

```

--------------------------------

### Filter While Paginating - Python

Source: https://docs.kalshi.com/getting_started/pagination

Illustrates how to combine filtering criteria with cursor-based pagination in API requests. This example shows constructing a URL that includes filters like `series_ticker` and `status`, along with pagination parameters `limit` and `cursor`, to retrieve specific subsets of data across multiple pages.

```python
# Get all open markets for a series
url = f"{base_url}?series_ticker={ticker}&status=open&limit=100&cursor={cursor}"
```

--------------------------------

### Get Markets Filter Updates

Source: https://docs.kalshi.com/changelog

Updates to the filtering capabilities of the GET /markets endpoint, affecting how inactive markets are displayed.

```APIDOC
## GET /markets

### Description
Retrieves a list of markets with updated filtering for inactive markets.

### Method
GET

### Endpoint
`/markets`

### Parameters
#### Query Parameters
- **open** (string) - Optional - Include inactive markets during tradable hours.
- **closed** (string) - Optional - Exclude inactive markets during tradable hours.

**Note**: Only a single status filter is allowed per request.

```

--------------------------------

### Get Orders API - Multiple Event Tickers

Source: https://docs.kalshi.com/changelog

The `event_ticker` parameter for the `GET /portfolio/orders` endpoint now supports comma-separated values to filter orders across multiple events.

```APIDOC
## GET /portfolio/orders

### Description
The `event_ticker` parameter in the `GET /portfolio/orders` endpoint has been updated to accept multiple event tickers separated by commas. This allows users to filter orders from several events in a single request.

### Method
GET

### Endpoint
/portfolio/orders

### Parameters
#### Query Parameters
- **event_ticker** (string) - Optional - Comma-separated list of event tickers to filter orders. Example: `EVENT1,EVENT2,EVENT3`.

### Response
#### Success Response (200)
- **orders** (array) - A list of orders matching the specified criteria.
```

--------------------------------

### Comprehensive Logging for Error Handling

Source: https://docs.kalshi.com/fix/error-handling

Python code example demonstrating how to log different types of API errors.

```APIDOC
## Comprehensive Logging

### Python Logging Example

```python
def handle_message(msg):
    if msg.type == 'Reject':
        log.error(f"Session reject: {msg.Text} (Tag: {msg.RefTagID}, Reason: {msg.SessionRejectReason})")
    elif msg.type == 'BusinessMessageReject':
        log.error(f"Business reject: {msg.Text} (Reason: {msg.BusinessRejectReason})")
    elif msg.type == 'ExecutionReport' and msg.ExecType == 'Rejected':
        log.error(f"Order rejected: {msg.Text} (Reason: {msg.OrdRejReason})")
```
```

--------------------------------

### Get Orders - Multiple Event Ticker Support

Source: https://docs.kalshi.com/changelog

The 'event_ticker' parameter in the GET /portfolio/orders endpoint now accepts comma-separated values to filter orders across multiple events.

```HTTP
GET /portfolio/orders?event_ticker=EVENT1,EVENT2,EVENT3
```

--------------------------------

### GET /markets Timestamp Filters

Source: https://docs.kalshi.com/changelog/index

New timestamp filters (`min_created_ts`, `max_created_ts`, `min_settled_ts`, `max_settled_ts`) have been added to the `GET /markets` endpoint. Released November 11, 2025.

```APIDOC
## GET /markets (with new timestamp filters)

### Description
Retrieves a list of markets with new timestamp filters available for querying.

### Method
GET

### Endpoint
/markets

### Parameters
#### Query Parameters
- **min_created_ts** (integer) - Optional - Filters markets created after this Unix timestamp.
- **max_created_ts** (integer) - Optional - Filters markets created before this Unix timestamp.
- **min_settled_ts** (integer) - Optional - Filters markets settled after this Unix timestamp.
- **max_settled_ts** (integer) - Optional - Filters markets settled before this Unix timestamp.

### Request Example
```
GET /markets?min_created_ts=1668800000&max_settled_ts=1668900000
```

### Response
#### Success Response (200)
- **markets** (array) - A list of market objects matching the filter criteria.

#### Response Example
```json
{
  "markets": [
    {
      "id": "market_1",
      "created_time": 1668850000,
      "settled_time": 1668880000
    }
  ]
}
```
```

--------------------------------

### Get Events API - Limit Parameter Enhancement

Source: https://docs.kalshi.com/changelog

Fixes to the `GET /events` endpoint's `limit` parameter, increasing the default and ensuring it respects values when `with_nested_markets=true`.

```APIDOC
## GET /events

### Description
This update addresses issues with the `limit` parameter on the `GET /events` endpoint. The default limit has been increased to 200, and the parameter now correctly respects this limit even when `with_nested_markets=true`.

### Method
GET

### Endpoint
/events

### Parameters
#### Query Parameters
- **limit** (integer) - Optional - The maximum number of results to return per page. Defaults to 200.
- **with_nested_markets** (boolean) - Optional - If true, includes nested market data.
```

--------------------------------

### Enhanced Portfolio Balance Endpoint

Source: https://docs.kalshi.com/changelog/index

The GET /portfolio/balance endpoint has been enhanced to include a 'portfolio_value' field.

```APIDOC
## Enhanced Portfolio Balance Endpoint

### Description
Enhanced the existing `GET /portfolio/balance` endpoint to include a `portfolio_value` field that provides the total portfolio value (available balance plus current market value of all positions), both in cents.

### Method
GET

### Endpoint
/portfolio/balance

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **portfolio_value** (integer) - The total portfolio value in cents.

#### Response Example
```json
{
  "account_id": "acc_123",
  "balance": "100000",
  "portfolio_value": "150000"
}
```
```

--------------------------------

### Get Positions

Source: https://docs.kalshi.com/openapi

Retrieves the user's current market and event positions. Pagination is supported using the `cursor` parameter.

```APIDOC
## GET /websites/kalshi/positions

### Description
Retrieves the user's current market and event positions. Pagination is supported using the `cursor` parameter.

### Method
GET

### Endpoint
/websites/kalshi/positions

### Parameters
#### Query Parameters
- **cursor** (string) - Optional - A cursor for retrieving the next page of results. If omitted, the first page is returned.
- **limit** (integer) - Optional - The maximum number of records to return. Defaults to 100.

### Request Example
```json
{
  "example": "GET /websites/kalshi/positions?cursor=some_cursor_string&limit=50"
}
```

### Response
#### Success Response (200)
- **cursor** (string) - A cursor for retrieving the next page of results. Empty if no more pages.
- **market_positions** (array) - An array of `MarketPosition` objects representing the user's positions in various markets.
- **event_positions** (array) - An array of `EventPosition` objects representing the user's positions in various events.

#### Response Example
```json
{
  "example": {
    "cursor": "another_cursor_string",
    "market_positions": [
      {
        "ticker": "SPY.2023-12-15T10h00m",
        "total_traded": 10000,
        "total_traded_dollars": {
          "cents": 10000,
          "dollars": 100.00
        },
        "position": 10,
        "market_exposure": 5000,
        "market_exposure_dollars": {
          "cents": 5000,
          "dollars": 50.00
        },
        "realized_pnl": 200,
        "realized_pnl_dollars": {
          "cents": 200,
          "dollars": 2.00
        },
        "resting_orders_count": 2,
        "fees_paid": 50,
        "fees_paid_dollars": {
          "cents": 50,
          "dollars": 0.50
        },
        "last_updated_ts": "2023-10-27T10:00:00Z"
      }
    ],
    "event_positions": [
      {
        "event_ticker": "USPRES.2024",
        "total_cost": 50000,
        "total_cost_dollars": {
          "cents": 50000,
          "dollars": 500.00
        },
        "total_cost_shares": 50,
        "event_exposure": 25000,
        "event_exposure_dollars": {
          "cents": 25000,
          "dollars": 250.00
        },
        "realized_pnl": 1000,
        "realized_pnl_dollars": {
          "cents": 1000,
          "dollars": 10.00
        },
        "resting_orders_count": 1,
        "fees_paid": 100,
        "fees_paid_dollars": {
          "cents": 100,
          "dollars": 1.00
        }
      }
    ]
  }
}
```

### Error Handling
- **400 Bad Request**: Invalid `cursor` or `limit` parameters.
- **401 Unauthorized**: Authentication credentials are invalid.
```

--------------------------------

### Live Data Response Includes Milestone ID

Source: https://docs.kalshi.com/changelog

The GET /live_data/{type}/milestone/{milestone_id} and GET /live_data/batch endpoints now include milestone_id in their responses.

```APIDOC
## GET /live_data/{type}/milestone/{milestone_id}

### Description
Retrieves live data for a specific milestone, now including the milestone ID in the response.

### Method
GET

### Endpoint
`/live_data/{type}/milestone/{milestone_id}`

### Parameters
#### Path Parameters
- **type** (string) - Required - The type of live data to retrieve.
- **milestone_id** (string) - Required - The ID of the milestone.

### Response
#### Success Response (200)
- **milestone_id** (string) - The ID of the milestone.

## GET /live_data/batch

### Description
Retrieves live data in batch, now including milestone_id in the response.

### Method
GET

### Endpoint
`/live_data/batch`

### Response
#### Success Response (200)
- **milestone_id** (string) - The ID of the milestone.

```

--------------------------------

### GET /series/{series_ticker}/events/{ticker}/candlesticks

Source: https://docs.kalshi.com/openapi

Get Event Candlesticks. End-point for returning aggregated data across all markets corresponding to an event.

```APIDOC
## GET /series/{series_ticker}/events/{ticker}/candlesticks

### Description
Get Event Candlesticks. End-point for returning aggregated data across all markets corresponding to an event.

### Method
GET

### Endpoint
/series/{series_ticker}/events/{ticker}/candlesticks

### Parameters
#### Path Parameters
- **ticker** (string) - Required - The event ticker
- **series_ticker** (string) - Required - The series ticker

#### Query Parameters
- **start_ts** (integer) - Required - Start timestamp (Unix timestamp). Candlesticks will include those ending on or after this time.

#### Request Body

### Request Example

### Response
#### Success Response (200)
- **candlesticks** (object) - Aggregated candlestick data for the event.

#### Response Example
{
  "example": "{\"candlesticks\": [{\"open\": 100, \"high\": 110, \"low\": 90, \"close\": 105, \"volume\": 50, \"timestamp\": 1678886400}]}"
}
```

--------------------------------

### Create Market in Multivariate Event Collection (OpenAPI)

Source: https://docs.kalshi.com/api-reference/multivariate/create-market-in-multivariate-event-collection

Defines the POST endpoint for creating an individual market within a multivariate event collection. This is a prerequisite for trading or looking up a market. It requires a collection ticker and a list of selected markets as input. The response includes details of the created market, such as its event and market tickers.

```yaml
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 3.3.0
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://api.elections.kalshi.com/trade-api/v2
    description: Production server
security: []
tags:
  - name: api-keys
    description: API key management endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: communications
    description: Request-for-quote (RFQ) endpoints
  - name: multivariate
    description: Multivariate event collection endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: live-data
    description: Live data endpoints
  - name: markets
    description: Market data endpoints
  - name: milestone
    description: Milestone endpoints
  - name: search
    description: Search and filtering endpoints
  - name: incentive-programs
    description: Incentive program endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: events
    description: Event endpoints
  - name: structured-targets
    description: Structured targets endpoints
paths:
  /multivariate_event_collections/{collection_ticker}:
    post:
      tags:
        - multivariate
      summary: Create Market In Multivariate Event Collection
      description: ' Endpoint for creating an individual market in a multivariate event collection. This endpoint must be hit at least once before trading or looking up a market.'
      operationId: CreateMarketInMultivariateEventCollection
      parameters:
        - name: collection_ticker
          in: path
          required: true
          description: Collection ticker
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: >-
                #/components/schemas/CreateMarketInMultivariateEventCollectionRequest
      responses:
        '200':
          description: Market created successfully
          content:
            application/json:
              schema:
                $ref: >-
                  #/components/schemas/CreateMarketInMultivariateEventCollectionResponse
        '400':
          $ref: '#/components/responses/BadRequestError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '500':
          $ref: '#/components/responses/InternalServerError'
      security:
        - kalshiAccessKey: []
          kalshiAccessSignature: []
          kalshiAccessTimestamp: []
components:
  schemas:
    CreateMarketInMultivariateEventCollectionRequest:
      type: object
      required:
        - selected_markets
      properties:
        selected_markets:
          type: array
          items:
            $ref: '#/components/schemas/TickerPair'
          description: >-
            List of selected markets that act as parameters to determine which
            market is created.
        with_market_payload:
          type: boolean
          description: Whether to include the market payload in the response.
    CreateMarketInMultivariateEventCollectionResponse:
      type: object
      required:
        - event_ticker
        - market_ticker
      properties:
        event_ticker:
          type: string
          description: Event ticker for the created market.
        market_ticker:
          type: string
          description: Market ticker for the created market.
        market:
          $ref: '#/components/schemas/Market'
          description: Market payload of the created market.
    TickerPair:
      type: object
      required:
        - market_ticker
        - event_ticker
        - side
      properties:
        market_ticker:
          type: string
          description: Market ticker identifier.
        event_ticker:
          type: string
          description: Event ticker identifier.
        side:
          type: string
          enum:
            - 'yes'
            - 'no'
          description: Side of the market (yes or no).
    Market:
      type: object
      required:
        - ticker
        - event_ticker
        - market_type
        - title
        - subtitle
        - yes_sub_title
        - no_sub_title
        - created_time
        - open_time
        - close_time
        - expiration_time
        - latest_expiration_time
        - settlement_timer_seconds
        - status
        - response_price_units
        - notional_value
        - notional_value_dollars
        - yes_bid
        - yes_bid_dollars
        - yes_ask
        - yes_ask_dollars
        - no_bid
        - no_bid_dollars
        - no_ask
        - no_ask_dollars
        - last_price
        - last_price_dollars

```

--------------------------------

### Get Multiple Live Data

Source: https://docs.kalshi.com/openapi

Retrieves live data for multiple milestones in a batch request.

```APIDOC
## GET /live_data/batch

### Description
Get live data for multiple milestones.

### Method
GET

### Endpoint
`/live_data/batch`

### Parameters
#### Query Parameters
- **milestone_ids** (array of strings) - Required - Array of milestone IDs. Maximum 100 items.

### Response
#### Success Response (200)
- **GetLiveDatasResponse** - Schema reference for multiple live data response.

#### Error Response
- **500** - Internal server error
```

--------------------------------

### GET /exchange/announcements

Source: https://docs.kalshi.com/api-reference/exchange/get-exchange-announcements

Retrieves all exchange-wide announcements. This endpoint is part of the exchange information section of the API.

```APIDOC
## GET /exchange/announcements

### Description
Endpoint for getting all exchange-wide announcements.

### Method
GET

### Endpoint
/exchange/announcements

### Parameters

### Request Example
(No request body for GET request)

### Response
#### Success Response (200)
- **announcements** (array) - A list of exchange-wide announcements.
  - **type** (string) - The type of the announcement. Enum: info, warning, error
  - **message** (string) - The message contained within the announcement.
  - **delivery_time** (string) - The time the announcement was delivered. Format: date-time
  - **status** (string) - The current status of this announcement. Enum: active, inactive

#### Response Example
{
  "announcements": [
    {
      "type": "info",
      "message": "Upcoming maintenance scheduled for Sunday.",
      "delivery_time": "2023-10-27T10:00:00Z",
      "status": "active"
    }
  ]
}
```

--------------------------------

### Project Information and Daily Schedule

Source: https://docs.kalshi.com/api-reference/exchange/get-exchange-schedule

This section details the structure for project information, including end dates for maintenance and daily opening/closing times for markets.

```APIDOC
## Project Information and Daily Schedule

### Description
This documentation outlines the data structures for project-related information, specifically focusing on maintenance end times and daily market open/close schedules.

### Parameters

#### Request Body (Example Structure)

- **end_date_time** (string, date-time) - Required - End date and time of the maintenance window.
- **DailySchedule** (object) - Required - Object containing daily open and close times.
  - **open_time** (string) - Required - Opening time in ET (Eastern Time) format HH:MM.
  - **close_time** (string) - Required - Closing time in ET (Eastern Time) format HH:MM.

### Request Example
```json
{
  "end_date_time": "2023-10-27T10:00:00Z",
  "DailySchedule": {
    "open_time": "09:30",
    "close_time": "16:00"
  }
}
```

### Response
#### Success Response (200)
This section would typically describe the structure of a successful response if this were a specific endpoint. For this documentation, it outlines the expected input structure.

#### Response Example
```json
{
  "message": "Configuration updated successfully"
}
```
```

--------------------------------

### Get RFQs

Source: https://docs.kalshi.com/python-sdk/api/CommunicationsApi

Retrieves a list of RFQs.

```APIDOC
## GET /communications/rfqs

### Description
Get RFQs. Endpoint to retrieve a list of RFQs.

### Method
GET

### Endpoint
/communications/rfqs

### Parameters
*Note: This endpoint may accept query parameters for filtering or pagination. Details are not provided in the input.*

### Response
*Note: Specific response details are not provided in the input.*

### Response Example
```json
{
  "example": "list_of_rfqs_response_body"
}
```
```

--------------------------------

### Subpenny Pricing Format Example

Source: https://docs.kalshi.com/getting_started/subpenny_pricing

This snippet demonstrates the new JSON format for representing prices, showing both the legacy integer cents and the new fixed-point dollars.

```json
{
    "price": 12,              // legacy: cents
    "price_dollars": "0.1200" // new: fixed-point dollars
}
```

--------------------------------

### Integration Notes

Source: https://docs.kalshi.com/fix/rfq-messages

Key notes for integrating with the Kalshi API, including RFQ session requirements and endpoint usage.

```APIDOC
## Integration Notes

### Description
Provides essential information for integrating with the Kalshi API, covering session management and endpoint specifics.

### Method
N/A

### Endpoint
N/A

### Parameters
N/A

### Request Example
N/A

### Response
N/A

### Notes
*   RFQs require a separate connection.
*   The KalshiRFQ endpoint is used for quote requests.
*   The order entry session is independent of the RFQ session.
```

--------------------------------

### GET /live_data/batch

Source: https://docs.kalshi.com/api-reference/live-data/get-multiple-live-data

Retrieves live data for multiple specified milestones. This endpoint is useful for efficiently fetching real-time information for a batch of events.

```APIDOC
## GET /live_data/batch

### Description
Get live data for multiple milestones. This endpoint allows you to fetch real-time data for a list of milestone IDs.

### Method
GET

### Endpoint
/live_data/batch

### Parameters
#### Query Parameters
- **milestone_ids** (array[string]) - Required - Array of milestone IDs. Maximum of 100 IDs allowed.

### Request Example
```json
{
  "milestone_ids": ["milestone_id_1", "milestone_id_2", "milestone_id_3"]
}
```

### Response
#### Success Response (200)
- **live_datas** (array[object]) - An array of live data objects for each requested milestone.
  - **type** (string) - Type of live data.
  - **details** (object) - Live data details as a flexible object. Can contain various properties depending on the data type.
  - **milestone_id** (string) - The ID of the milestone.

#### Response Example
```json
{
  "live_datas": [
    {
      "type": "some_type",
      "details": {
        "field1": "value1",
        "field2": 123
      },
      "milestone_id": "milestone_id_1"
    },
    {
      "type": "another_type",
      "details": {
        "status": "active"
      },
      "milestone_id": "milestone_id_2"
    }
  ]
}
```
```

--------------------------------

### GET /multivariate_event_collections

Source: https://docs.kalshi.com/typescript-sdk/api/MultivariateCollectionsApi

Retrieves all multivariate event collections. This endpoint can be used to get a list of all available collections, with an option to filter by status.

```APIDOC
## GET /multivariate_event_collections

### Description
Get all multivariate event collections.

### Method
GET

### Endpoint
/multivariate_event_collections

### Parameters
#### Query Parameters
- **status** (string) - Optional - Filter by multivariate collection status

### Request Example
```typescript
import {
    MultivariateCollectionsApi,
    Configuration
} from 'kalshi-typescript';

const configuration = new Configuration({
    apiKey: 'your-api-key-id',
    privateKeyPath: '/path/to/private-key.pem'  // or privateKeyPem: 'PEM string'
});
const apiInstance = new MultivariateCollectionsApi(configuration);

let status: string;

const { status, data } = await apiInstance.getMultivariateEventCollections(
    status
);
```

### Response
#### Success Response (200)
- **GetMultivariateEventCollectionsResponse** (object) - Collections retrieved successfully

#### Response Example
(Response structure depends on the GetMultivariateEventCollectionsResponse model)

#### Error Responses
- **401** - Unauthorized - authentication required
- **500** - Internal server error
```

--------------------------------

### Get Exchange Status using cURL

Source: https://docs.kalshi.com/api-reference

This snippet demonstrates how to fetch the current status of the Kalshi exchange using a cURL command. It sends a GET request to the /exchange/status endpoint. The response will indicate if the exchange and trading are active, and an estimated resume time if the exchange is inactive.

```cURL
curl --request GET \
  --url https://api.elections.kalshi.com/trade-api/v2/exchange/status
```

--------------------------------

### Graceful Degradation Steps

Source: https://docs.kalshi.com/fix/error-handling

A step-by-step guide for implementing graceful degradation in response to API errors.

```APIDOC
## Graceful Degradation

1. **Identify Error Type**: Distinguish between recoverable and non-recoverable errors.
2. **Apply Appropriate Action**: 
   - Recoverable: Implement retry with backoff.
   - Non-recoverable: Alert and halt.
3. **Monitor and Alert**: Track error rates and patterns for system health.
```

--------------------------------

### Get Quotes

Source: https://docs.kalshi.com/python-sdk/api/CommunicationsApi

Retrieves a list of quotes.

```APIDOC
## GET /communications/quotes

### Description
Get Quotes. Endpoint to retrieve a list of quotes.

### Method
GET

### Endpoint
/communications/quotes

### Parameters
*Note: This endpoint may accept query parameters for filtering or pagination. Details are not provided in the input.*

### Response
*Note: Specific response details are not provided in the input.*

### Response Example
```json
{
  "example": "list_of_quotes_response_body"
}
```
```

--------------------------------

### GET /getRFQ

Source: https://docs.kalshi.com/typescript-sdk/api/CommunicationsApi

Retrieves a single RFQ by its ID. Authentication is required.

```APIDOC
## GET /getRFQ

### Description
Endpoint for getting a single RFQ by id.

### Method
GET

### Endpoint
/getRFQ

### Parameters
#### Query Parameters
- **rfqId** (string) - Required - The ID of the RFQ to retrieve.

### Request Example
```json
{
  "rfqId": "some_rfq_id"
}
```

### Response
#### Success Response (200)
- **GetRFQResponse** (object) - The response object containing RFQ details.

#### Response Example
```json
{
  "rfq": {
    "id": "rfq123",
    "eventTicker": "example_event",
    "creationDate": "2024-07-26T10:00:00Z",
    "status": "open"
  }
}
```

### Authorization
- kalshiAccessSignature
- kalshiAccessKey
- kalshiAccessTimestamp

### HTTP request headers
* **Accept**: application/json
```

--------------------------------

### GetFillsResponse

Source: https://docs.kalshi.com/python-sdk/models/GetFillsResponse

Retrieves fill data for a given project, including a list of fills and a cursor for pagination.

```APIDOC
## GET /websites/kalshi/fills

### Description
Retrieves fill data for a project. This response includes a list of fills and a cursor for paginating through results.

### Method
GET

### Endpoint
/websites/kalshi/fills

### Parameters
#### Query Parameters
- **cursor** (str) - Optional - A cursor for fetching the next page of results.

### Request Example
(No request body for GET requests)

### Response
#### Success Response (200)
- **fills** (List[Fill]) - A list of fill objects.
- **cursor** (str) - A cursor to retrieve the next set of results.

#### Response Example
```json
{
  "fills": [
    {
      "id": "fill_id_1",
      "price": 10.5,
      "size": 100,
      "time": "2023-10-27T10:00:00Z"
    },
    {
      "id": "fill_id_2",
      "price": 10.7,
      "size": 50,
      "time": "2023-10-27T10:05:00Z"
    }
  ],
  "cursor": "next_cursor_value"
}
```
```

--------------------------------

### Fetch Kalshi Markets Data using TypeScript

Source: https://docs.kalshi.com/typescript-sdk/api/MarketsApi

This snippet shows how to initialize the Kalshi Markets API client and fetch market data. It includes setting up API credentials and configuring optional parameters for filtering results by status, tickers, and closing timestamps. The response contains status information and the market data itself.

```typescript
import {
    MarketsApi,
    Configuration
} from 'kalshi-typescript';

const configuration = new Configuration({
    apiKey: 'your-api-key-id',
    privateKeyPath: '/path/to/private-key.pem'  // or privateKeyPem: 'PEM string'
});
const apiInstance = new MarketsApi(configuration);

let limit: number; //Number of results per page. Defaults to 100. Maximum value is 1000. (optional) (default to 100)
let cursor: string; //Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page. (optional) (default to undefined)
let eventTicker: string; //Filter by event ticker (optional) (default to undefined)
let seriesTicker: string; //Filter by series ticker (optional) (default to undefined)
let maxCloseTs: number; //Filter items that close before this Unix timestamp (optional) (default to undefined)
let minCloseTs: number; //Filter items that close after this Unix timestamp (optional) (default to undefined)
let status: string; //Filter by market status. Comma-separated list. Possible values are 'initialized', 'open', 'closed', 'settled', 'determined'. Note that the API accepts 'open' for filtering but returns 'active' in the response. Leave empty to return markets with any status. (optional) (default to undefined)
let tickers: string; //Filter by specific market tickers. Comma-separated list of market tickers to retrieve. (optional) (default to undefined)

const { status, data } = await apiInstance.getMarkets(
    limit,
    cursor,
    eventTicker,
    seriesTicker,
    maxCloseTs,
    minCloseTs,
    status,
    tickers
);
```

--------------------------------

### GET /events/{id}

Source: https://docs.kalshi.com/changelog

Retrieves information about a specific event, including broker availability.

```APIDOC
## GET /events/{id}

### Description
Get information about a specific event. This endpoint now includes `available_on_brokers` which indicates that they are available on intermediate platforms/brokers.

### Method
GET

### Endpoint
/events/{id}

### Path Parameters
- **id** (integer) - Required - The ID of the event.

### Response
#### Success Response (200)
- **event** (object) - An event object.
  - **id** (integer) - The event ID.
  - **title** (string) - The event title.
  - **available_on_brokers** (boolean) - Indicates if the event is available on brokers.
```

--------------------------------

### Get Total Resting Order Value OpenAPI Specification

Source: https://docs.kalshi.com/api-reference/portfolio/get-total-resting-order-value

OpenAPI 3.0.0 specification for the GET /portfolio/summary/total_resting_order_value endpoint. It defines the request, response schemas, and security for retrieving the total resting order value in cents. This endpoint is intended for FCM members.

```yaml
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 3.3.0
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://api.elections.kalshi.com/trade-api/v2
    description: Production server
security: []
tags:
  - name: api-keys
    description: API key management endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: communications
    description: Request-for-quote (RFQ) endpoints
  - name: multivariate
    description: Multivariate event collection endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: live-data
    description: Live data endpoints
  - name: markets
    description: Market data endpoints
  - name: milestone
    description: Milestone endpoints
  - name: search
    description: Search and filtering endpoints
  - name: incentive-programs
    description: Incentive program endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: events
    description: Event endpoints
  - name: structured-targets
    description: Structured targets endpoints
paths:
  /portfolio/summary/total_resting_order_value:
    get:
      tags:
        - portfolio
      summary: Get Total Resting Order Value
      description: ' Endpoint for getting the total value, in cents, of resting orders. This endpoint is only intended for use by FCM members (rare). Note: If you''re uncertain about this endpoint, it likely does not apply to you.'
      operationId: GetPortfolioRestingOrderTotalValue
      responses:
        '200':
          description: Total resting order value retrieved successfully
          content:
            application/json:
              schema:
                $ref: >-
                  #/components/schemas/GetPortfolioRestingOrderTotalValueResponse
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '500':
          $ref: '#/components/responses/InternalServerError'
      security:
        - kalshiAccessKey: []
          kalshiAccessSignature: []
          kalshiAccessTimestamp: []
components:
  schemas:
    GetPortfolioRestingOrderTotalValueResponse:
      type: object
      required:
        - total_resting_order_value
      properties:
        total_resting_order_value:
          type: integer
          description: Total value of resting orders in cents
    ErrorResponse:
      type: object
      properties:
        code:
          type: string
          description: Error code
        message:
          type: string
          description: Human-readable error message
        details:
          type: string
          description: Additional details about the error, if available
        service:
          type: string
          description: The name of the service that generated the error
  responses:
    UnauthorizedError:
      description: Unauthorized - authentication required
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    InternalServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
  securitySchemes:
    kalshiAccessKey:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-KEY
      description: Your API key ID
    kalshiAccessSignature:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-SIGNATURE
      description: RSA-PSS signature of the request
    kalshiAccessTimestamp:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-TIMESTAMP
      description: Request timestamp in milliseconds

```

--------------------------------

### GET /portfolio/order_groups

Source: https://docs.kalshi.com/api-reference/order-groups/get-order-groups

Retrieves all order groups for the authenticated user.

```APIDOC
## GET /portfolio/order_groups

### Description
Retrieves all order groups for the authenticated user.

### Method
GET

### Endpoint
/portfolio/order_groups

### Parameters
#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **order_groups** (array) - An array of order group objects.
  - **id** (string) - Unique identifier for the order group.
  - **is_auto_cancel_enabled** (boolean) - Whether auto-cancel is enabled for this order group.

#### Response Example
```json
{
  "order_groups": [
    {
      "id": "group_123",
      "is_auto_cancel_enabled": true
    },
    {
      "id": "group_456",
      "is_auto_cancel_enabled": false
    }
  ]
}
```

#### Error Responses
- **400 Bad Request**: Invalid input.
- **401 Unauthorized**: Authentication required.
- **500 Internal Server Error**: An error occurred on the server.
```

--------------------------------

### GET /markets/{ticker}

Source: https://docs.kalshi.com/openapi

Endpoint for getting data about a specific market by its ticker. A market represents a specific binary outcome within an event that users can trade on. Markets have yes/no positions, current prices, volume, and settlement rules.

```APIDOC
## GET /markets/{ticker}

### Description
Endpoint for getting data about a specific market by its ticker. A market represents a specific binary outcome within an event that users can trade on (e.g., "Will candidate X win?"). Markets have yes/no positions, current prices, volume, and settlement rules.

### Method
GET

### Endpoint
/markets/{ticker}

### Parameters
#### Path Parameters
- **ticker** (string) - Required - The ticker of the market to retrieve

### Response
#### Success Response (200)
- **market** (object) - The market object

#### Response Example
{
  "market": {
    "id": "string",
    "ticker": "string",
    "name": "string",
    "description": "string",
    "event_id": "string",
    "series_id": "string",
    "creator_id": "string",
    "created_ts": "integer",
    "open_ts": "integer",
    "close_ts": "integer",
    "settled_ts": "integer",
    "volume": "integer",
    "last_price": "number",
    "best_bid": "number",
    "best_ask": "number",
    "status": "string",
    "is_resolved_yes": "boolean",
    "resolution_price": "number",
    "probability": "number"
  }
}
```

--------------------------------

### GET /markets Filter Restrictions

Source: https://docs.kalshi.com/changelog/index

Breaking changes to the `GET /markets` endpoint introduce restrictions on compatible timestamp and status filters for performance reasons. Released November 11, 2025.

```APIDOC
## GET /markets (with filter restrictions)

### Description
Retrieves a list of markets with updated filter compatibility rules. Timestamp filters are now mutually exclusive with other timestamp filters and certain status filters.

### Method
GET

### Endpoint
/markets

### Parameters
#### Query Parameters
- **min_created_ts**, **max_created_ts** (integer) - Optional - Filters markets by creation time. Compatible with `unopened`, `open`, or no additional status filters.
- **min_close_ts**, **max_close_ts** (integer) - Optional - Filters markets by close time. Compatible with `closed` or no additional status filters.
- **min_settled_ts**, **max_settled_ts** (integer) - Optional - Filters markets by settlement time. Compatible with `settled` or no additional status filters.
- **unopened** (boolean) - Optional - Filter for unopened markets. Only compatible with `min_created_ts` / `max_created_ts`.
- **open** (boolean) - Optional - Filter for open markets. Only compatible with `min_created_ts` / `max_created_ts`.
- **closed** (boolean) - Optional - Filter for closed markets. Only compatible with `min_close_ts` / `max_close_ts`.
- **settled** (boolean) - Optional - Filter for settled markets. Only compatible with `min_settled_ts` / `max_settled_ts`.

### Request Example
```
GET /markets?min_created_ts=1668800000&max_created_ts=1668900000&open
```

### Response
#### Success Response (200)
- **markets** (array) - A list of market objects matching the filter criteria.

#### Response Example
```json
{
  "markets": [
    {
      "id": "market_1",
      "status": "open"
    }
  ]
}
```
```

--------------------------------

### Best Practices

Source: https://docs.kalshi.com/fix/session-management

Recommended best practices for integrating with the Kalshi API, covering session configuration, error recovery, and security measures.

```APIDOC
## Best Practices

1. **Session Configuration**
   * Use unique ClOrdIDs across all message types
   * Implement proper heartbeat handling
   * Monitor sequence numbers carefully

2. **Error Recovery**
   * Implement automatic reconnection logic
   * Store order state locally for recovery
   * Use drop copy session for missed messages

3. **Security**
   * Rotate API keys periodically
   * Monitor for unauthorized access
   * Use secure storage for private keys
```

--------------------------------

### Get Events Data with Kalshi TypeScript SDK

Source: https://docs.kalshi.com/typescript-sdk/api/EventsApi

This snippet demonstrates how to use the Kalshi TypeScript SDK to retrieve event data. It shows the initialization of the API client with configuration and how to call the getEvents method with various optional parameters for filtering and pagination. It also highlights how to handle the paginated response using a cursor.

```typescript
import {
    EventsApi,
    Configuration
} from 'kalshi-typescript';

const configuration = new Configuration({
    apiKey: 'your-api-key-id',
    privateKeyPath: '/path/to/private-key.pem'  // or privateKeyPem: 'PEM string'
});
const apiInstance = new EventsApi(configuration);

let limit: number;
let cursor: string;
let withNestedMarkets: boolean;
let status: string;
let seriesTicker: string;
let minCloseTs: number;

const { status, data } = await apiInstance.getEvents(
    limit,
    cursor,
    withNestedMarkets,
    status,
    seriesTicker,
    minCloseTs
);
```

--------------------------------

### Kalshi API Authentication

Source: https://docs.kalshi.com/getting_started/quick_start_authenticated_requests

This section details the process of authenticating requests to the Kalshi API, including how to obtain API keys and construct the necessary headers.

```APIDOC
## Kalshi API Authentication

To make authenticated requests to the Kalshi API, you need to obtain API keys and include specific headers in your requests.

### API Key Acquisition

1. Log in to your Kalshi account.
2. Navigate to **Account & security** → **API Keys**.
3. Click **Create Key**.
4. Save both your **Private Key** (downloaded as a `.key` file) and your **API Key ID**.

<Warning>
  Your private key cannot be retrieved after this page is closed. Store it securely!
</Warning>

### Request Headers

Every authenticated request requires the following headers:

| Header                    | Description                   | Example                                |
| ------------------------- | ----------------------------- | -------------------------------------- |
| `KALSHI-ACCESS-KEY`       | Your API Key ID               | `a952bcbe-ec3b-4b5b-b8f9-11dae589608c` |
| `KALSHI-ACCESS-TIMESTAMP` | Current time in milliseconds  | `1703123456789`                        |
| `KALSHI-ACCESS-SIGNATURE` | Request signature (see below) | `base64_encoded_signature`             |

### Signature Generation

The signature proves ownership of the private key and is generated as follows:

1. **Create a message string**: Concatenate `timestamp + HTTP_METHOD + path` (without query parameters).
   * Example: `1703123456789GET/trade-api/v2/portfolio/balance`
2. **Sign with your private key**: Use RSA-PSS with SHA256.
3. **Encode as base64**: Convert the signature to a base64 string.

#### Python Signing Example

```python
import base64
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.asymmetric import padding

def sign_request(private_key, timestamp, method, path):
    path_without_query = path.split('?')[0]
    message = f"{timestamp}{method}{path_without_query}".encode('utf-8')
    signature = private_key.sign(
        message,
        padding.PSS(
            mgf=padding.MGF1(hashes.SHA256()),
            salt_length=padding.PSS.DIGEST_LENGTH
        ),
        hashes.SHA256()
    )
    return base64.b64encode(signature).decode('utf-8')
```
```

--------------------------------

### GET /portfolio/fills

Source: https://docs.kalshi.com/python-sdk/api

Retrieves all fills for the member. A fill occurs when a trade is matched.

```APIDOC
## GET /portfolio/fills

### Description
Get Fills Endpoint for getting all fills for the member. A fill is when a trade you have is matched.

### Method
GET

### Endpoint
/portfolio/fills

### Parameters
#### Path Parameters
None

#### Query Parameters
- **ticker** (str) - Optional - Filter by market ticker
- **order_id** (str) - Optional - Filter by order ID
- **min_ts** (int) - Optional - Filter items after this Unix timestamp
- **max_ts** (int) - Optional - Filter items before this Unix timestamp
- **limit** (int) - Optional - Number of results per page. Defaults to 100. Maximum value is 200.
- **cursor** (str) - Optional - Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **GetFillsResponse** (object) - Information about the member's fills.

#### Response Example
```json
{
  "fills": [
    {
      "id": "fill_123",
      "order_id": "order_abc",
      "ticker": "2024-US-PRES",
      "quantity": 10,
      "price": 5000,
      "timestamp": 1678886400
    }
  ],
  "cursor": "next_page_cursor"
}
```
```

--------------------------------

### GET /markets Updates

Source: https://docs.kalshi.com/changelog/index

Updates to the filtering behavior of the GET /markets endpoint. These changes affect how inactive markets are displayed and restrict the use of status filters. Release date: November 27, 2025.

```APIDOC
## GET /markets

### Description
Retrieves a list of markets with updated filtering capabilities. Inactive markets will now appear in the 'open' selector and be removed from the 'closed' selector. Additionally, only a single status filter can be applied per request.

### Method
GET

### Endpoint
/markets

### Parameters
#### Query Parameters
- **open** (string) - Optional - Filter for open markets. Now includes inactive markets during tradable hours.
- **closed** (string) - Optional - Filter for closed markets. No longer includes inactive markets during tradable hours.

### Request Example
```
GET /markets?open
```

### Response
#### Success Response (200)
- **markets** (array) - A list of market objects.

#### Response Example
```json
{
  "markets": [
    {
      "id": "market_1",
      "status": "open",
      "tradable": true
    },
    {
      "id": "market_2",
      "status": "open",
      "tradable": false
    }
  ]
}
```
```

--------------------------------

### Get Fills API

Source: https://docs.kalshi.com/openapi

Retrieves a list of fills, which represent individual executions of orders.

```APIDOC
## GET /websites/kalshi/fills

### Description
Retrieves a list of fills, representing the executions of orders on the platform. This endpoint can be used to track individual trade executions.

### Method
GET

### Endpoint
/websites/kalshi/fills

### Query Parameters
- **limit** (integer) - Optional - The maximum number of fills to return per page.
- **cursor** (string) - Optional - A cursor for fetching the next page of results.
- **order_id** (string) - Optional - Filters fills by a specific order ID.
- **ticker** (string) - Optional - Filters fills by a specific market ticker.

### Response
#### Success Response (200)
- **fills** (array) - A list of Fill objects.
- **cursor** (string) - A cursor for pagination to get the next page of results.

#### Response Example
```json
{
  "fills": [
    {
      "fill_id": "fill_xyz",
      "trade_id": "trade_abc",
      "order_id": "order_123",
      "client_order_id": "client_order_456",
      "ticker": "TSLA.2024-06-28",
      "market_ticker": "TSLA.2024-06-28",
      "side": "yes",
      "action": "buy",
      "count": 5,
      "price": 50,
      "yes_price": 5000,
      "no_price": 5000,
      "yes_price_fixed": "50.00",
      "no_price_fixed": "50.00",
      "is_taker": true
    }
  ],
  "cursor": "some_cursor_string"
}
```
```

--------------------------------

### GET /exchange/schedule

Source: https://docs.kalshi.com/api-reference/exchange/get-exchange-schedule

Retrieves the current exchange schedule, outlining standard trading hours and any scheduled maintenance windows.

```APIDOC
## GET /exchange/schedule

### Description
Endpoint for getting the exchange schedule. This includes standard operating hours and maintenance windows.

### Method
GET

### Endpoint
/exchange/schedule

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **schedule** (object) - Contains the exchange schedule details.
  - **standard_hours** (array) - The standard operating hours of the exchange. All times are expressed in ET. Outside of these times trading will be unavailable.
    - items: (object) - Represents a weekly schedule.
      - **start_time** (string, format: date-time) - Start date and time for when this weekly schedule is effective.
      - **end_time** (string, format: date-time) - End date and time for when this weekly schedule is no longer effective.
      - **monday** (array) - Trading hours for Monday. May contain multiple sessions.
        - items: (object) - Represents daily schedule details.
      - **tuesday** (array) - Trading hours for Tuesday. May contain multiple sessions.
        - items: (object) - Represents daily schedule details.
      - **wednesday** (array) - Trading hours for Wednesday. May contain multiple sessions.
        - items: (object) - Represents daily schedule details.
      - **thursday** (array) - Trading hours for Thursday. May contain multiple sessions.
        - items: (object) - Represents daily schedule details.
      - **friday** (array) - Trading hours for Friday. May contain multiple sessions.
        - items: (object) - Represents daily schedule details.
      - **saturday** (array) - Trading hours for Saturday. May contain multiple sessions.
        - items: (object) - Represents daily schedule details.
      - **sunday** (array) - Trading hours for Sunday. May contain multiple sessions.
        - items: (object) - Represents daily schedule details.
  - **maintenance_windows** (array) - Scheduled maintenance windows, during which the exchange may be unavailable.
    - items: (object) - Represents a maintenance window.
      - **start_datetime** (string, format: date-time) - Start date and time of the maintenance window.
      - **end_datetime** (string, format: date-time) - End date and time of the maintenance window.

#### Response Example
```json
{
  "schedule": {
    "standard_hours": [
      {
        "start_time": "2023-01-01T09:00:00Z",
        "end_time": "2023-12-31T17:00:00Z",
        "monday": [
          {
            "start": "09:00",
            "end": "17:00"
          }
        ],
        "tuesday": [
          {
            "start": "09:00",
            "end": "17:00"
          }
        ],
        "wednesday": [
          {
            "start": "09:00",
            "end": "17:00"
          }
        ],
        "thursday": [
          {
            "start": "09:00",
            "end": "17:00"
          }
        ],
        "friday": [
          {
            "start": "09:00",
            "end": "17:00"
          }
        ],
        "saturday": [],
        "sunday": []
      }
    ],
    "maintenance_windows": [
      {
        "start_datetime": "2023-07-04T02:00:00Z",
        "end_datetime": "2023-07-04T04:00:00Z"
      }
    ]
  }
}
```

#### Error Response (500)
- **description**: Internal server error.
```

--------------------------------

### OpenAPI Specification

Source: https://docs.kalshi.com/changelog/index

The OpenAPI specification for the Kalshi API is now available for download, facilitating easier integration and client library generation.

```APIDOC
## OpenAPI Specification

### Description
The OpenAPI specification for the Kalshi API is available for download, enabling developers to generate client libraries and use OpenAPI-compatible tools.

### Download Link
[https://docs.kalshi.com/openapi.yaml](https://docs.kalshi.com/openapi.yaml)

### Usage
This specification can be used with tools like Swagger UI, Postman, or OpenAPI Generator to automatically create interactive documentation, client SDKs, and server stubs.
```

--------------------------------

### Get Market Data by Ticker (OpenAPI)

Source: https://docs.kalshi.com/api-reference/market/get-market

Retrieves detailed information about a specific market using its unique ticker. This endpoint is crucial for understanding market conditions, prices, volume, and settlement rules. It requires a valid market ticker as a path parameter. The response includes comprehensive market data, including bid/ask prices, volume, and status. Potential errors include unauthorized access (401), market not found (404), and server errors (500).

```yaml
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 3.3.0
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://api.elections.kalshi.com/trade-api/v2
    description: Production server
security: []
tags:
  - name: api-keys
    description: API key management endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: communications
    description: Request-for-quote (RFQ) endpoints
  - name: multivariate
    description: Multivariate event collection endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: live-data
    description: Live data endpoints
  - name: markets
    description: Market data endpoints
  - name: milestone
    description: Milestone endpoints
  - name: search
    description: Search and filtering endpoints
  - name: incentive-programs
    description: Incentive program endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: events
    description: Event endpoints
  - name: structured-targets
    description: Structured targets endpoints
paths:
  /markets/{ticker}:
    get:
      tags:
        - market
      summary: Get Market
      description: ' Endpoint for getting data about a specific market by its ticker. A market represents a specific binary outcome within an event that users can trade on (e.g., "Will candidate X win?" ). Markets have yes/no positions, current prices, volume, and settlement rules.'
      operationId: GetMarket
      parameters:
        - $ref: '#/components/parameters/TickerPath'
      responses:
        '200':
          description: Market retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetMarketResponse'
        '401':
          description: Unauthorized
        '404':
          description: Not found
        '500':
          description: Internal server error
components:
  parameters:
    TickerPath:
      name: ticker
      in: path
      required: true
      description: Market ticker
      schema:
        type: string
  schemas:
    GetMarketResponse:
      type: object
      required:
        - market
      properties:
        market:
          $ref: '#/components/schemas/Market'
    Market:
      type: object
      required:
        - ticker
        - event_ticker
        - market_type
        - title
        - subtitle
        - yes_sub_title
        - no_sub_title
        - created_time
        - open_time
        - close_time
        - expiration_time
        - latest_expiration_time
        - settlement_timer_seconds
        - status
        - response_price_units
        - notional_value
        - notional_value_dollars
        - yes_bid
        - yes_bid_dollars
        - yes_ask
        - yes_ask_dollars
        - no_bid
        - no_bid_dollars
        - no_ask
        - no_ask_dollars
        - last_price
        - last_price_dollars
        - previous_yes_bid
        - previous_yes_bid_dollars
        - previous_yes_ask
        - previous_yes_ask_dollars
        - previous_price
        - previous_price_dollars
        - volume
        - volume_24h
        - liquidity
        - liquidity_dollars
        - open_interest
        - result
        - can_close_early
        - expiration_value
        - rules_primary
        - rules_secondary
        - tick_size
        - price_level_structure
        - price_ranges
      properties:
        ticker:
          type: string
        event_ticker:
          type: string
        market_type:
          type: string
          enum:
            - binary
            - scalar
          description: Identifies the type of market
        title:
          type: string
          deprecated: true
        subtitle:
          type: string
          deprecated: true
        yes_sub_title:
          type: string
          description: Shortened title for the yes side of this market
        no_sub_title:
          type: string
          description: Shortened title for the no side of this market
        created_time:
          type: string
          format: date-time
        open_time:
          type: string
          format: date-time
        close_time:
          type: string
          format: date-time
        expected_expiration_time:
          type: string
          format: date-time
          nullable: true
          x-omitempty: true
          description: Time when this market is expected to expire
        expiration_time:
          type: string
          format: date-time
          deprecated: true
        latest_expiration_time:
          type: string
          format: date-time

```

--------------------------------

### GET /series/fee_changes Endpoint Update

Source: https://docs.kalshi.com/changelog

The GET /series/fee_changes endpoint now returns user-facing fee type names. This change also applies to CustomerIO notifications for scheduled series fee updates.

```APIDOC
## GET /series/fee_changes

### Description
Retrieves fee changes for a series. The response now includes user-facing fee type names instead of internal names. This change also affects CustomerIO notifications.

### Method
GET

### Endpoint
/series/fee_changes

### Parameters
#### Query Parameters
- **show_historical** (boolean) - Optional - If true, returns all past and upcoming fee changes. If false, returns only upcoming fee changes.

### Request Example
```
GET /series/fee_changes?show_historical=true
```

### Response
#### Success Response (200)
- **fee_type** (string) - User-facing fee type name (e.g., `quadratic`, `quadratic_with_maker_fees`, `flat`).

#### Response Example
```json
{
  "fee_changes": [
    {
      "effective_date": "2025-10-01T00:00:00Z",
      "fee_type": "quadratic"
    }
  ]
}
```
```

--------------------------------

### Market Lookup/Creation Parameters

Source: https://docs.kalshi.com/api-reference/multivariate/get-multivariate-event-collection

Defines the parameters used for looking up or creating markets, including size constraints and functional descriptions.

```APIDOC
## Market Lookup/Creation Parameters

### Description
Parameters related to market selection and creation, allowing for specific constraints on the number and type of markets.

### Method
N/A (Describing parameters, not an endpoint)

### Endpoint
N/A

### Parameters
#### Query Parameters
- **is_all_yes** (boolean) - Optional - [DEPRECATED - Use associated_events instead] Whether the collection requires that only the market side of 'yes' may be used.
- **size_min** (integer) - Optional - The minimum number of markets that must be passed into Lookup/Create (inclusive).
- **size_max** (integer) - Optional - The maximum number of markets that must be passed into Lookup/Create (inclusive).
- **functional_description** (string) - Optional - A functional description of the collection describing how inputs affect the output.

### Request Example
```json
{
  "is_all_yes": false,
  "size_min": 1,
  "size_max": 5,
  "functional_description": "Markets related to upcoming economic indicators"
}
```

### Response
N/A (Describing parameters, not an endpoint)
```

--------------------------------

### Get Filters for Sports

Source: https://docs.kalshi.com/api-reference/search/get-filters-for-sports

Retrieves available filters organized by sport, including scopes, competitions, and an ordered list of sports for display.

```APIDOC
## GET /search/filters_by_sport

### Description
Retrieve available filters organized by sport. This endpoint returns filtering options available for each sport, including scopes and competitions. It also provides an ordered list of sports for display purposes.

### Method
GET

### Endpoint
/search/filters_by_sport

### Parameters
#### Query Parameters
This endpoint does not accept any query parameters.

#### Request Body
This endpoint does not accept a request body.

### Request Example
```json
{
  "example": "No request body needed for this GET request."
}
```

### Response
#### Success Response (200)
- **filters_by_sports** (object) - Mapping of sports to their filter details.
- **sport_ordering** (array) - Ordered list of sports for display.

#### Response Example
```json
{
  "filters_by_sports": {
    "Football": {
      "scopes": ["scope1", "scope2"],
      "competitions": {
        "competitionA": {
          "scopes": ["scope1"]
        }
      }
    }
  },
  "sport_ordering": ["Football", "Basketball"]
}
```

#### Error Responses
- **401**: Unauthorized
- **500**: Internal server error
```

--------------------------------

### GET /exchange/schedule

Source: https://docs.kalshi.com/typescript-sdk/api/ExchangeApi

Retrieves the exchange schedule. This endpoint does not require any parameters.

```APIDOC
## GET /exchange/schedule

### Description
Endpoint for getting the exchange schedule.

### Method
GET

### Endpoint
/exchange/schedule

### Parameters

#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **GetExchangeScheduleResponse** (object) - Exchange schedule retrieved successfully

#### Response Example
```json
{
  "schedule": [
    {
      "name": "string",
      "startTime": "string",
      "endTime": "string"
    }
  ]
}
```
```

--------------------------------

### Get Event Metadata OpenAPI Specification

Source: https://docs.kalshi.com/api-reference/events/get-event-metadata

OpenAPI 3.0.0 specification for the 'GET /events/{event_ticker}/metadata' endpoint. This defines the request parameters, response structure for successful retrieval (200 OK), and potential error responses (400, 401, 404, 500). It also includes schemas for the response body and its components.

```yaml
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 3.3.0
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://api.elections.kalshi.com/trade-api/v2
    description: Production server
security: []
tags:
  - name: api-keys
    description: API key management endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: communications
    description: Request-for-quote (RFQ) endpoints
  - name: multivariate
    description: Multivariate event collection endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: live-data
    description: Live data endpoints
  - name: markets
    description: Market data endpoints
  - name: milestone
    description: Milestone endpoints
  - name: search
    description: Search and filtering endpoints
  - name: incentive-programs
    description: Incentive program endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: events
    description: Event endpoints
  - name: structured-targets
    description: Structured targets endpoints
paths:
  /events/{event_ticker}/metadata:
    get:
      tags:
        - events
      summary: Get Event Metadata
      description: ' Endpoint for getting metadata about an event by its ticker.  Returns only the metadata information for an event.'
      operationId: GetEventMetadata
      parameters:
        - name: event_ticker
          in: path
          required: true
          description: Event ticker
          schema:
            type: string
      responses:
        '200':
          description: Event metadata retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetEventMetadataResponse'
        '400':
          description: Bad request
        '401':
          description: Unauthorized
        '404':
          description: Event not found
        '500':
          description: Internal server error
components:
  schemas:
    GetEventMetadataResponse:
      type: object
      required:
        - image_url
        - settlement_sources
        - market_details
      properties:
        image_url:
          type: string
          description: A path to an image that represents this event.
        featured_image_url:
          type: string
          description: A path to an image that represents the image of the featured market.
        market_details:
          type: array
          description: Metadata for the markets in this event.
          items:
            $ref: '#/components/schemas/MarketMetadata'
        settlement_sources:
          type: array
          description: A list of settlement sources for this event.
          items:
            $ref: '#/components/schemas/SettlementSource'
        competition:
          type: string
          nullable: true
          x-omitempty: true
          description: Event competition.
          x-go-type-skip-optional-pointer: true
        competition_scope:
          type: string
          nullable: true
          x-omitempty: true
          description: Event scope, based on the competition.
          x-go-type-skip-optional-pointer: true
    MarketMetadata:
      type: object
      required:
        - market_ticker
        - image_url
        - color_code
      properties:
        market_ticker:
          type: string
          description: The ticker of the market.
        image_url:
          type: string
          description: A path to an image that represents this market.
        color_code:
          type: string
          description: The color code for the market.
    SettlementSource:
      type: object
      properties:
        name:
          type: string
          description: Name of the settlement source
          x-go-type-skip-optional-pointer: true
        url:
          type: string
          description: URL to the settlement source
          x-go-type-skip-optional-pointer: true
```

--------------------------------

### GET /events

Source: https://docs.kalshi.com/python-sdk/api/EventsApi

Retrieves a list of all available events on the platform. This endpoint can be used to discover events and their basic details.

```APIDOC
## GET /events

### Description
Get Events

Endpoint for retrieving a list of all available events.

### Method
GET

### Endpoint
/events

### Parameters
*Note: This endpoint currently does not have specific query parameters documented, but may support filtering or pagination in the future.*

### Request Example
```json
{
  "message": "This is a GET request to /events"
}
```

### Response
#### Success Response (200)
- **GetEventsResponse** (object) - A list of event objects.

#### Response Example
```json
{
  "events": [
    {
      "ticker": "event_ticker_1",
      "title": "Event Title 1",
      "event_type": "prediction",
      "event_deadline": "2024-12-31T23:59:59Z"
    },
    {
      "ticker": "event_ticker_2",
      "title": "Event Title 2",
      "event_type": "prediction",
      "event_deadline": "2025-01-15T12:00:00Z"
    }
  ]
}
```
```

--------------------------------

### GET /markets

Source: https://docs.kalshi.com/changelog/index

Retrieves a list of markets. Enhanced filtering capabilities now include the `mve_filter` parameter to include or exclude multivariate events.

```APIDOC
## GET /markets

### Description
Retrieves a list of markets. Supports enhanced filtering with the `mve_filter` parameter to include or exclude multivariate events.

### Method
GET

### Endpoint
/markets

### Query Parameters
- **mve_filter** (string) - Filter for multivariate events. Options: `"only"` (returns only multivariate events), `"exclude"` (excludes multivariate events). If omitted, all events are returned.

### Response
#### Success Response (200)
- **markets** (array) - A list of market objects.

### Response Example
```json
{
  "markets": [
    {
      "id": "mk_abc123",
      "name": "Example Market",
      "is_multivariate": false
    }
  ]
}
```
```

--------------------------------

### Get Portfolio Positions - Resting Order Count Removal

Source: https://docs.kalshi.com/changelog

The GET /portfolio/positions endpoint will no longer return the 'resting_orders_count' field in 'event_positions' and 'market_positions'. The 'resting_order_count' filter will also be removed, resulting in a 400 error for requests using it.

```HTTP
GET /portfolio/positions
```

--------------------------------

### GET /settlements

Source: https://docs.kalshi.com/changelog

Retrieves settlement information, including settlement value for yes contracts.

```APIDOC
## GET /settlements

### Description
Retrieves settlement information. The Settlements API now includes the settlement value for a yes contract.

### Method
GET

### Endpoint
/settlements

### Query Parameters
- **event_id** (integer) - Optional - Filter by event ID.

### Response
#### Success Response (200)
- **settlements** (array) - An array of settlement objects.
  - **event_id** (integer) - The event ID.
  - **yes_price** (integer) - The settlement value for a yes contract.
```

--------------------------------

### GET /getQuotes

Source: https://docs.kalshi.com/typescript-sdk/api/CommunicationsApi

Retrieves a list of quotes, with options for filtering and pagination. Authentication is required.

```APIDOC
## GET /getQuotes

### Description
Endpoint for getting quotes with various filtering and pagination options.

### Method
GET

### Endpoint
/getQuotes

### Parameters
#### Query Parameters
- **cursor** (string) - Optional - Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Defaults to undefined.
- **eventTicker** (string) - Optional - Event ticker of desired positions. Multiple event tickers can be provided as a comma-separated list (maximum 10).
- **marketTicker** (string) - Optional - Filter by market ticker.
- **limit** (number) - Optional - Parameter to specify the number of results per page. Defaults to 500.
- **status** (string) - Optional - Filter quotes by status.
- **quoteCreatorUserId** (string) - Optional - Filter quotes by quote creator user ID.
- **rfqCreatorUserId** (string) - Optional - Filter quotes by RFQ creator user ID.
- **rfqCreatorSubtraderId** (string) - Optional - Filter quotes by RFQ creator subtrader ID (FCM members only).
- **rfqId** (string) - Optional - Filter quotes by RFQ ID.

### Request Example
```json
{
  "limit": 100,
  "eventTicker": "election_2024,other_event"
}
```

### Response
#### Success Response (200)
- **GetQuotesResponse** (object) - The response object containing a list of quotes.

#### Response Example
```json
{
  "quotes": [
    {
      "id": "q123",
      "eventTicker": "election_2024",
      "lastPrice": 0.75,
      "volume": 1000
    },
    {
      "id": "q456",
      "eventTicker": "other_event",
      "lastPrice": 0.20,
      "volume": 500
    }
  ],
  "nextCursor": "some_next_cursor_value"
}
```

### Authorization
- kalshiAccessSignature
- kalshiAccessKey
- kalshiAccessTimestamp

### HTTP request headers
* **Accept**: application/json
```

--------------------------------

### Get Milestones

Source: https://docs.kalshi.com/openapi

Retrieves a list of milestones associated with a project. Supports pagination using a cursor.

```APIDOC
## GET /websites/kalshi/milestones

### Description
Retrieves a list of milestones for the /websites/kalshi project. Supports pagination.

### Method
GET

### Endpoint
/websites/kalshi/milestones

### Parameters
#### Query Parameters
- **cursor** (string) - Optional - Pagination cursor. Use the cursor value returned from the previous response to get the next page of results

### Response
#### Success Response (200)
- **milestones** (array) - A list of milestone objects.
- **next_cursor** (string) - The cursor for the next page of results.

#### Response Example
{
  "milestones": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "due_date": "string"
    }
  ],
  "next_cursor": "string"
}

#### Error Responses
- **400** - Bad Request
- **401** - Unauthorized
- **500** - Internal Server Error
```

--------------------------------

### Get Settlements

Source: https://docs.kalshi.com/api-reference/portfolio/get-settlements

Retrieves the member's settlement history.

```APIDOC
## GET /websites/kalshi/settlements

### Description
Endpoint for getting the member's settlements historical track.

### Method
GET

### Endpoint
/websites/kalshi/settlements

### Parameters
#### Query Parameters
- **limit** (integer) - Optional - The maximum number of settlements to return.
- **offset** (integer) - Optional - The number of settlements to skip before returning results.

### Response
#### Success Response (200)
- **settlements** (array) - A list of settlement objects.
  - **id** (string) - The unique identifier for the settlement.
  - **market_id** (string) - The identifier for the associated market.
  - **event_id** (string) - The identifier for the associated event.
  - **event** (string) - The name of the event.
  - **yes_price** (number) - The price at which the 'yes' outcome was settled.
  - **no_price** (number) - The price at which the 'no' outcome was settled.
  - **settled_price** (number) - The final settled price.
  - **settled_at** (string) - The timestamp when the settlement occurred.

#### Response Example
{
  "settlements": [
    {
      "id": "settlement_abc123",
      "market_id": "market_xyz789",
      "event_id": "event_pqr456",
      "event": "Will it rain tomorrow?",
      "yes_price": 0.95,
      "no_price": 0.05,
      "settled_price": 0.95,
      "settled_at": "2023-10-27T10:00:00Z"
    }
  ]
}
```

--------------------------------

### GET /markets

Source: https://docs.kalshi.com/api-reference/market/get-markets

Retrieves a list of markets, with options to filter by status, creation time, closing time, settlement time, and other criteria. Supports pagination.

```APIDOC
## GET /markets

### Description
Retrieves a list of markets. You can filter markets by their status (e.g., `unopened`, `open`, `closed`, `settled`). You can also filter by creation, closing, or settlement timestamps. Pagination is supported using the `cursor` parameter. For timestamp filters, note their compatibility with specific status filters.

### Method
GET

### Endpoint
/markets

### Parameters
#### Query Parameters
- **limit** (integer) - Optional - Number of results per page. Defaults to 100. Maximum value is 1000.
- **cursor** (string) - Optional - Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page.
- **event_ticker** (string) - Optional - Event ticker of desired positions. Multiple event tickers can be provided as a comma-separated list (maximum 10).
- **series_ticker** (string) - Optional - Filter by series ticker.
- **min_created_ts** (integer) - Optional - Filter items that created after this Unix timestamp.
- **max_created_ts** (integer) - Optional - Filter items that created before this Unix timestamp.
- **min_close_ts** (integer) - Optional - Filter items that closed after this Unix timestamp.
- **max_close_ts** (integer) - Optional - Filter items that closed before this Unix timestamp.
- **min_settled_ts** (integer) - Optional - Filter items that settled after this Unix timestamp.
- **max_settled_ts** (integer) - Optional - Filter items that settled before this Unix timestamp.
- **status** (string) - Optional - Filter by market status. Possible values: `unopened`, `open`, `closed`, `settled`. Only one `status` filter may be supplied at a time.
- **tickers** (string) - Optional - Filter by market tickers. Multiple tickers can be provided as a comma-separated list.
- **mve_filter** (string) - Optional - Filter by multivariate event. 

### Response
#### Success Response (200)
- **markets** (array) - List of market objects.
- **cursor** (string) - Cursor for the next page of results.

#### Response Example
```json
{
  "markets": [
    {
      "id": "some_market_id",
      "name": "Some Market Name",
      "ticker": "SOME_TICKER",
      "short_description": "A brief description of the market.",
      "long_description": "A more detailed description of the market.",
      "status": "open",
      "open_interest": 100,
      "volume": 1000,
      "last_trade_price": 0.5,
      "best_bid_price": 0.45,
      "best_ask_price": 0.55,
      "created_ts": 1678886400,
      "close_ts": 1679059200,
      "settled_ts": 1679145600
    }
  ],
  "cursor": "next_page_cursor"
}
```
```

--------------------------------

### GET /exchange/user_data_timestamp

Source: https://docs.kalshi.com/api-reference/exchange/get-user-data-timestamp

Retrieves an approximate indication of when user data from specific endpoints was last validated. This is useful for understanding data latency.

```APIDOC
## GET /exchange/user_data_timestamp

### Description
This endpoint provides an approximate indication of when the data from the following endpoints was last validated: GetBalance, GetOrder(s), GetFills, GetPositions. There is typically a short delay before exchange events are reflected in the API endpoints.

### Method
GET

### Endpoint
/exchange/user_data_timestamp

### Parameters

#### Query Parameters
_None_

#### Request Body
_None_

### Request Example
_None_

### Response
#### Success Response (200)
- **as_of_time** (string) - Timestamp when user data was last updated.

#### Response Example
```json
{
  "as_of_time": "2023-10-27T10:00:00Z"
}
```

#### Error Response (500)
- **description**: Internal server error
```

--------------------------------

### Navigation and Other Pages

Source: https://docs.kalshi.com/api-reference/events/get-events

Instructions on how to find navigation and other pages within the Kalshi documentation.

```APIDOC
## Navigation and Other Pages

### Description
To find navigation and other pages in this documentation, fetch the `llms.txt` file.

### Method
GET

### Endpoint
`https://docs.kalshi.com/llms.txt`

### Parameters
N/A

### Request Example
N/A

### Response
#### Success Response (200)
- **content** (string) - The content of the `llms.txt` file, which contains navigation and links to other pages.

### Response Example
```
{
  "navigation": [
    {
      "title": "API Documentation",
      "url": "/api"
    },
    {
      "title": "Schemas",
      "url": "/schemas"
    }
  ],
  "other_pages": [
    {
      "title": "Getting Started",
      "url": "/getting-started"
    }
  ]
}
```
```

--------------------------------

### GET /events/{event_ticker}/metadata

Source: https://docs.kalshi.com/api-reference/events/get-event-metadata

Retrieves metadata for a specific event using its ticker. This endpoint returns only the metadata information for the requested event.

```APIDOC
## GET /events/{event_ticker}/metadata

### Description
Endpoint for getting metadata about an event by its ticker. Returns only the metadata information for an event.

### Method
GET

### Endpoint
/events/{event_ticker}/metadata

### Parameters
#### Path Parameters
- **event_ticker** (string) - Required - Event ticker

### Response
#### Success Response (200)
- **image_url** (string) - A path to an image that represents this event.
- **featured_image_url** (string) - A path to an image that represents the image of the featured market.
- **market_details** (array) - Metadata for the markets in this event. Each item is an object with the following properties:
  - **market_ticker** (string) - The ticker of the market.
  - **image_url** (string) - A path to an image that represents this market.
  - **color_code** (string) - The color code for the market.
- **settlement_sources** (array) - A list of settlement sources for this event. Each item is an object with the following properties:
  - **name** (string) - Name of the settlement source
  - **url** (string) - URL to the settlement source
- **competition** (string) - Event competition.
- **competition_scope** (string) - Event scope, based on the competition.

#### Response Example
```json
{
  "image_url": "https://example.com/images/event.jpg",
  "featured_image_url": "https://example.com/images/featured_event.jpg",
  "market_details": [
    {
      "market_ticker": "mk_abc",
      "image_url": "https://example.com/images/market_abc.jpg",
      "color_code": "#FF0000"
    }
  ],
  "settlement_sources": [
    {
      "name": "Source A",
      "url": "https://example.com/sources/a"
    }
  ],
  "competition": "Election",
  "competition_scope": "US Presidential Election"
}
```

#### Error Responses
- **400** - Bad request
- **401** - Unauthorized
- **404** - Event not found
- **500** - Internal server error
```

--------------------------------

### Get Balance Response

Source: https://docs.kalshi.com/python-sdk/models/GetBalanceResponse

Details of the response object for retrieving a member's balance and portfolio value.

```APIDOC
## GetBalanceResponse

### Description
Represents the response containing a member's balance and portfolio value.

### Method
GET

### Endpoint
/websites/kalshi/balance

### Parameters
#### Query Parameters

#### Request Body

### Request Example
```json
{
  "balance": 100000,
  "portfolio_value": 250000,
  "updated_ts": 1678886400
}
```

### Response
#### Success Response (200)
- **balance** (int) - Member's available balance in cents. This represents the amount available for trading.
- **portfolio_value** (int) - Member's portfolio value in cents. This is the current value of all positions held.
- **updated_ts** (int) - Unix timestamp of the last update to the balance.

#### Response Example
```json
{
  "balance": 100000,
  "portfolio_value": 250000,
  "updated_ts": 1678886400
}
```
```

--------------------------------

### Get Markets API

Source: https://docs.kalshi.com/python-sdk/api/MarketsApi

Retrieves a list of markets with optional filtering by status, closing time, and tickers. Supports pagination.

```APIDOC
## GET /websites/kalshi

### Description
Retrieves a list of markets with optional filtering by status, closing time, and tickers. Supports pagination.

### Method
GET

### Endpoint
/websites/kalshi

### Parameters
#### Query Parameters
- **limit** (int) - Optional - Number of results per page. Defaults to 100. Maximum value is 1000.
- **cursor** (str) - Optional - Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page.
- **event_ticker** (str) - Optional - Filter by event ticker
- **series_ticker** (str) - Optional - Filter by series ticker
- **max_close_ts** (int) - Optional - Filter items that close before this Unix timestamp
- **min_close_ts** (int) - Optional - Filter items that close after this Unix timestamp
- **status** (str) - Optional - Filter by market status. Comma-separated list. Possible values are 'initialized', 'open', 'closed', 'settled', 'determined'. Note that the API accepts 'open' for filtering but returns 'active' in the response. Leave empty to return markets with any status.
- **tickers** (str) - Optional - Filter by specific market tickers. Comma-separated list of market tickers to retrieve.

### Response
#### Success Response (200)
- **GetMarketsResponse** - See [GetMarketsResponse](https://docs.kalshi.com/python-sdk/models/GetMarketsResponse) for details.

#### Error Responses
- **400** - Bad request - invalid input
- **401** - Unauthorized - authentication required
- **500** - Internal server error
```

--------------------------------

### Get Quote

Source: https://docs.kalshi.com/python-sdk/api/CommunicationsApi

Retrieves details of a specific quote by its ID.

```APIDOC
## GET /communications/quotes/{quote_id}

### Description
Get Quote. Endpoint to retrieve details of a specific quote.

### Method
GET

### Endpoint
/communications/quotes/{quote_id}

### Parameters
#### Path Parameters
- **quote_id** (str) - Required - The ID of the quote to retrieve.

### Response
*Note: Specific response details are not provided in the input.*

### Response Example
```json
{
  "example": "quote_details_response_body"
}
```
```

--------------------------------

### POST /websites/kalshi/orders/batch

Source: https://docs.kalshi.com/openapi

Creates multiple orders in a single request. This endpoint is useful for efficiently placing several orders at once.

```APIDOC
## POST /websites/kalshi/orders/batch

### Description
Creates multiple orders in a single request. This endpoint is useful for efficiently placing several orders at once.

### Method
POST

### Endpoint
/websites/kalshi/orders/batch

### Parameters
#### Request Body
- **orders** (array) - Required - An array of order objects to be created.
  - Each order object should conform to the `CreateOrderRequest` schema.

### Request Example
```json
{
  "orders": [
    {
      "ticker": "SEC.2024-01-01",
      "side": "yes",
      "action": "buy",
      "count": 5
    },
    {
      "ticker": "POL.2024-01-02",
      "side": "no",
      "action": "sell",
      "count": 20,
      "type": "market"
    }
  ]
}
```

### Response
#### Success Response (200)
- **orders** (array) - An array of responses, one for each order submitted in the batch.
  - Each response object contains `client_order_id`, `order` details if successful, or an `error` object if it failed.

#### Response Example
```json
{
  "orders": [
    {
      "client_order_id": "client1",
      "order": {
        "id": "ord_abc123",
        "status": "open"
      }
    },
    {
      "client_order_id": "client2",
      "error": {
        "code": "INVALID_TICKER",
        "message": "The provided ticker is invalid."
      }
    }
  ]
}
```
```

--------------------------------

### GET /portfolio/balance

Source: https://docs.kalshi.com/api-reference/portfolio/get-balance

Retrieves the member's available balance and current portfolio value. Both values are returned in cents, representing the amount available for trading and the total value of held positions, respectively. The timestamp of the last update is also provided.

```APIDOC
## GET /portfolio/balance

### Description
Endpoint for getting the balance and portfolio value of a member. Both values are returned in cents.

### Method
GET

### Endpoint
/portfolio/balance

### Parameters
#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **balance** (integer) - Member's available balance in cents. This represents the amount available for trading.
- **portfolio_value** (integer) - Member's portfolio value in cents. This is the current value of all positions held.
- **updated_ts** (integer) - Unix timestamp of the last update to the balance.

#### Response Example
```json
{
  "balance": 1000000,
  "portfolio_value": 1500000,
  "updated_ts": 1678886400
}
```

#### Error Response (401)
- **code** (string) - Error code
- **message** (string) - Human-readable error message
- **details** (string) - Additional details about the error, if available
- **service** (string) - The name of the service that generated the error

#### Error Response (500)
- **code** (string) - Error code
- **message** (string) - Human-readable error message
- **details** (string) - Additional details about the error, if available
- **service** (string) - The name of the service that generated the error
```

--------------------------------

### Get RFQs with Filtering

Source: https://docs.kalshi.com/python-sdk/api/CommunicationsApi

Retrieves a list of RFQs with optional filtering parameters. Allows filtering by cursor, event ticker, market ticker, limit, status, and creator user ID.

```python
def get_rfqs(cursor=None, event_ticker=None, market_ticker=None, limit=500, status=None, creator_user_id=None):
    """Get a list of RFQs with filtering options.

    Args:
        cursor (str, optional): Pagination cursor for the next page of results.
        event_ticker (str, optional): Event ticker to filter by.
        market_ticker (str, optional): Market ticker to filter by.
        limit (int, optional): Number of results per page. Defaults to 500.
        status (str, optional): Filter RFQs by status.
        creator_user_id (str, optional): Filter RFQs by creator user ID.

    Returns:
        GetRFQsResponse: The response object containing the list of RFQs.
    """
    pass
```

--------------------------------

### Get Series Fee Changes API Endpoint Specification (OpenAPI)

Source: https://docs.kalshi.com/api-reference/exchange/get-series-fee-changes

This OpenAPI specification defines the 'get /series/fee_changes' endpoint. It allows retrieval of fee changes for a specific series, with an option to include historical data. The endpoint returns a JSON object containing an array of series fee changes or an error response.

```yaml
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 3.3.0
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://api.elections.kalshi.com/trade-api/v2
    description: Production server
security: []
tags:
  - name: api-keys
    description: API key management endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: communications
    description: Request-for-quote (RFQ) endpoints
  - name: multivariate
    description: Multivariate event collection endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: live-data
    description: Live data endpoints
  - name: markets
    description: Market data endpoints
  - name: milestone
    description: Milestone endpoints
  - name: search
    description: Search and filtering endpoints
  - name: incentive-programs
    description: Incentive program endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: events
    description: Event endpoints
  - name: structured-targets
    description: Structured targets endpoints
paths:
  /series/fee_changes:
    get:
      tags:
        - exchange
      summary: Get Series Fee Changes
      operationId: GetSeriesFeeChanges
      parameters:
        - name: series_ticker
          in: query
          required: false
          schema:
            type: string
          x-go-type-skip-optional-pointer: true
        - name: show_historical
          in: query
          required: false
          schema:
            type: boolean
            default: false
          x-go-type-skip-optional-pointer: true
      responses:
        '200':
          description: Series fee changes retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetSeriesFeeChangesResponse'
        '400':
          $ref: '#/components/responses/BadRequestError'
        '500':
          $ref: '#/components/responses/InternalServerError'
components:
  schemas:
    GetSeriesFeeChangesResponse:
      type: object
      required:
        - series_fee_change_arr
      properties:
        series_fee_change_arr:
          type: array
          items:
            $ref: '#/components/schemas/SeriesFeeChange'
    SeriesFeeChange:
      type: object
      required:
        - id
        - series_ticker
        - fee_type
        - fee_multiplier
        - scheduled_ts
      properties:
        id:
          type: string
          description: Unique identifier for this fee change
        series_ticker:
          type: string
          description: Series ticker this fee change applies to
        fee_type:
          type: string
          enum:
            - quadratic
            - quadratic_with_maker_fees
            - flat
          description: New fee type for the series
        fee_multiplier:
          type: number
          format: double
          description: New fee multiplier for the series
        scheduled_ts:
          type: string
          format: date-time
          description: Timestamp when this fee change is scheduled to take effect
    ErrorResponse:
      type: object
      properties:
        code:
          type: string
          description: Error code
        message:
          type: string
          description: Human-readable error message
        details:
          type: string
          description: Additional details about the error, if available
        service:
          type: string
          description: The name of the service that generated the error
  responses:
    BadRequestError:
      description: Bad request - invalid input
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    InternalServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
```

--------------------------------

### GET /series

Source: https://docs.kalshi.com/openapi

Retrieves a list of available series. This endpoint provides a comprehensive overview of all defined series.

```APIDOC
## GET /series

### Description
Endpoint for retrieving a list of all available series.

### Method
GET

### Endpoint
/series

### Response
#### Success Response (200)
- **response** (object) - Contains the list of series.

#### Response Example
```json
{
  "response": "<GetSeriesListResponse>"
}
```
```

--------------------------------

### Python: Get Markets with Filtering and Pagination

Source: https://docs.kalshi.com/python-sdk/api/MarketsApi

Retrieves a paginated list of markets from Kalshi. Supports filtering by event ticker, series ticker, closing timestamp, status, and specific tickers. Requires API key and private key for authentication. The response includes a cursor for fetching subsequent pages.

```python
import kalshi_python
from kalshi_python.models.get_markets_response import GetMarketsResponse
from kalshi_python.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://api.elections.kalshi.com/trade-api/v2
# See configuration.py for a list of all supported configuration parameters.
configuration = kalshi_python.Configuration(
    host = "https://api.elections.kalshi.com/trade-api/v2"
)

# Read private key from file
with open('path/to/private_key.pem', 'r') as f:
    private_key = f.read()

# Configure API key authentication
configuration.api_key_id = "your-api-key-id"
configuration.private_key_pem = private_key

# Initialize the Kalshi client
client = kalshi_python.KalshiClient(configuration)

limit = 100 # int | Number of results per page. Defaults to 100. Maximum value is 1000. (optional) (default to 100)

cursor = 'cursor_example' # str | Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page. (optional)

event_ticker = 'event_ticker_example' # str | Filter by event ticker (optional)

series_ticker = 'series_ticker_example' # str | Filter by series ticker (optional)

max_close_ts = 56 # int | Filter items that close before this Unix timestamp (optional)

min_close_ts = 56 # int | Filter items that close after this Unix timestamp (optional)

status = 'status_example' # str | Filter by market status. Comma-separated list. Possible values are 'initialized', 'open', 'closed', 'settled', 'determined'. Note that the API accepts 'open' for filtering but returns 'active' in the response. Leave empty to return markets with any status. (optional)

tickers = 'tickers_example' # str | Filter by specific market tickers. Comma-separated list of market tickers to retrieve. (optional)

try:
    # Get Markets
    api_response = client.get_markets(limit=limit, cursor=cursor, event_ticker=event_ticker, series_ticker=series_ticker, max_close_ts=max_close_ts, min_close_ts=min_close_ts, status=status, tickers=tickers)
    print("The response of MarketsApi->get_markets:\n")
    pprint(api_response)
except Exception as e:
    print("Exception when calling MarketsApi->get_markets: %s\n" % e)

```

--------------------------------

### GET /series/{series_ticker}/markets/{ticker}/candlesticks

Source: https://docs.kalshi.com/openapi

Get Market Candlesticks. Time period length of each candlestick in minutes. Valid values: 1 (1 minute), 60 (1 hour), 1440 (1 day).

```APIDOC
## GET /series/{series_ticker}/markets/{ticker}/candlesticks

### Description
Get Market Candlesticks. Time period length of each candlestick in minutes. Valid values: 1 (1 minute), 60 (1 hour), 1440 (1 day).

### Method
GET

### Endpoint
/series/{series_ticker}/markets/{ticker}/candlesticks

### Parameters
#### Path Parameters
- **series_ticker** (string) - Required - Series ticker - the series that contains the target market
- **ticker** (string) - Required - Market ticker - unique identifier for the specific market

#### Query Parameters
- **start_ts** (integer) - Required - Start timestamp (Unix timestamp). Candlesticks will include those ending on or after this time.
- **end_ts** (integer) - Required - End timestamp (Unix timestamp). Candlesticks will include those ending on or before this time.
- **period_interval** (integer) - Required - Time period length of each candlestick in minutes. Valid values are 1 (1 minute), 60 (1 hour), or 1440 (1 day).

#### Request Body

### Request Example

### Response
#### Success Response (200)
- **candlesticks** (object) - Candlesticks retrieved successfully

#### Response Example
{
  "example": "{\"candlesticks\": [{\"open\": 100, \"high\": 110, \"low\": 90, \"close\": 105, \"volume\": 50, \"timestamp\": 1678886400}]}"
}
```

--------------------------------

### GET /portfolio/order_groups/{order_group_id}

Source: https://docs.kalshi.com/api-reference/order-groups/get-order-group

Retrieves details for a single order group, including all order IDs and auto-cancel status. This endpoint is useful for inspecting the state of an order group.

```APIDOC
## GET /portfolio/order_groups/{order_group_id}

### Description
Retrieves details for a single order group, including all order IDs and auto-cancel status.

### Method
GET

### Endpoint
/portfolio/order_groups/{order_group_id}

### Parameters
#### Path Parameters
- **order_group_id** (string) - Required - Order group ID

### Request Example
```json
{
  "example": "No request body for GET"
}
```

### Response
#### Success Response (200)
- **is_auto_cancel_enabled** (boolean) - Whether auto-cancel is enabled for this order group
- **orders** (array of strings) - List of order IDs that belong to this order group

#### Response Example
```json
{
  "is_auto_cancel_enabled": true,
  "orders": [
    "order_id_1",
    "order_id_2"
  ]
}
```

#### Error Responses
- **401** Unauthorized - authentication required
- **404** Not Found - Resource not found
- **500** Internal Server Error - Internal server error
```

--------------------------------

### Get Multiple Structured Targets (Python)

Source: https://docs.kalshi.com/python-sdk/api/StructuredTargetsApi

Fetches a list of structured targets, with options to filter by type and competition, and control pagination. The page size can be adjusted, with a default of 100 and a maximum of 2000. A cursor is used for subsequent page requests. Handles successful retrieval, unauthorized access, and internal server errors.

```python
from kalshi.api import structured_targets

try:
    # Example with filters and pagination
    response = structured_targets.get_structured_targets(
        type="example_type",
        competition="example_competition",
        page_size=50,
        cursor="example_cursor"
    )
    print(response.to_json())

    # Example with default parameters
    response_default = structured_targets.get_structured_targets()
    print(response_default.to_json())

except Exception as e:
    print(f"An error occurred: {e}")
```

--------------------------------

### GET /markets

Source: https://docs.kalshi.com/openapi

Filter by market status. Possible values: `unopened`, `open`, `closed`, `settled`. Leave empty to return markets with any status. Only one `status` filter may be supplied at a time.

```APIDOC
## GET /markets

### Description
Filter by market status. Possible values: `unopened`, `open`, `closed`, `settled`. Leave empty to return markets with any status.
- Only one `status` filter may be supplied at a time.
- Timestamp filters will be mutually exclusive from other timestamp filters and certain status filters.

| Compatible Timestamp Filters | Additional Status Filters|
|------------------------------|--------------------------|
| min_created_ts, max_created_ts | `unopened`, `open`, *empty* |
| min_close_ts, max_close_ts | `closed`, *empty* |
| min_settled_ts, max_settled_ts | `settled`, *empty* |

### Method
GET

### Endpoint
/markets

### Parameters
#### Query Parameters
- **limit** (integer) - Optional - Maximum number of markets to return
- **cursor** (string) - Optional - Cursor for pagination
- **event_ticker** (string) - Optional - Filter by event ticker
- **series_ticker** (string) - Optional - Filter by series ticker
- **min_created_ts** (integer) - Optional - Minimum creation timestamp
- **max_created_ts** (integer) - Optional - Maximum creation timestamp
- **min_close_ts** (integer) - Optional - Minimum close timestamp
- **max_close_ts** (integer) - Optional - Maximum close timestamp
- **min_settled_ts** (integer) - Optional - Minimum settled timestamp
- **max_settled_ts** (integer) - Optional - Maximum settled timestamp
- **status** (string) - Optional - Filter by market status (`unopened`, `open`, `closed`, `settled`)
- **tickers** (string) - Optional - Comma-separated list of market tickers
- **mve** (string) - Optional - Filter by Market Value Estimate (e.g., `yes` or `no`)

### Response
#### Success Response (200)
- **markets** (array) - List of market objects
- **next_cursor** (string) - Cursor for the next page of results

#### Response Example
{
  "markets": [
    {
      "id": "string",
      "ticker": "string",
      "name": "string",
      "description": "string",
      "event_id": "string",
      "series_id": "string",
      "creator_id": "string",
      "created_ts": "integer",
      "open_ts": "integer",
      "close_ts": "integer",
      "settled_ts": "integer",
      "volume": "integer",
      "last_price": "number",
      "best_bid": "number",
      "best_ask": "number",
      "status": "string",
      "is_resolved_yes": "boolean",
      "resolution_price": "number",
      "probability": "number"
    }
  ],
  "next_cursor": "string"
}
```

--------------------------------

### Process Kalshi WebSocket Messages (Python)

Source: https://docs.kalshi.com/getting_started/quick_start_websockets

A Python function to process incoming messages from the Kalshi WebSocket API. Parses JSON messages and handles different message types like 'ticker', 'orderbook_snapshot', 'orderbook_update', and 'error'. Includes basic printing of received data or error details.

```python
import json

async def process_message(message):
    """Process incoming WebSocket messages"""
    data = json.loads(message)
    msg_type = data.get("type")

    if msg_type == "ticker":
        # Handle ticker update
        market = data["data"]["market_ticker"]
        bid = data["data"]["bid"]
        ask = data["data"]["ask"]
        print(f"{market}: Bid ${bid}, Ask ${ask}")

    elif msg_type == "orderbook_snapshot":
        # Handle full orderbook state
        print(f"Orderbook snapshot for {data['data']['market_ticker']}")

    elif msg_type == "orderbook_update":
        # Handle orderbook changes
        print(f"Orderbook update for {data['data']['market_ticker']}")
        # Note: client_order_id field is optional - present only when you caused this change
        if 'client_order_id' in data['data']:
            print(f"  Your order {data['data']['client_order_id']} caused this change")

    elif msg_type == "error":
        error_code = data.get("msg", {}).get("code")
        error_msg = data.get("msg", {}).get("msg")
        print(f"Error {error_code}: {error_msg}")
```

--------------------------------

### GET /markets/series

Source: https://docs.kalshi.com/openapi

Endpoint for getting data about multiple series with specified filters. A series represents a template for recurring events that follow the same format and rules. This endpoint allows you to browse and discover available series templates by category.

```APIDOC
## GET /markets/series

### Description
Endpoint for getting data about multiple series with specified filters. A series represents a template for recurring events that follow the same format and rules (e.g., "Monthly Jobs Report", "Weekly Initial Jobless Claims", "Daily Weather in NYC"). This endpoint allows you to browse and discover available series templates by category.

### Method
GET

### Endpoint
/markets/series

### Parameters
#### Query Parameters
- **category** (string) - Optional - Series category
- **tags** (string) - Optional - Series tags
- **include_product_metadata** (boolean) - Optional - Include product metadata in the response. Defaults to false.

### Response
#### Success Response (200)
- **series_list** (array) - List of series objects

#### Response Example
{
  "series_list": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "category": "string",
      "tags": ["string"],
      "creator_id": "string",
      "created_ts": "integer",
      "first_open_ts": "integer",
      "last_close_ts": "integer"
    }
  ]
}
```

--------------------------------

### Get FCM Orders - OpenAPI YAML

Source: https://docs.kalshi.com/api-reference/fcm/get-fcm-orders

This OpenAPI definition specifies the 'Get FCM Orders' endpoint for FCM members. It allows filtering orders by subtrader ID and provides parameters for pagination, timestamp, status, and limit. The response includes a list of orders and a cursor for pagination.

```yaml
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 3.3.0
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://api.elections.kalshi.com/trade-api/v2
    description: Production server
security: []
tags:
  - name: api-keys
    description: API key management endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: communications
    description: Request-for-quote (RFQ) endpoints
  - name: multivariate
    description: Multivariate event collection endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: live-data
    description: Live data endpoints
  - name: markets
    description: Market data endpoints
  - name: milestone
    description: Milestone endpoints
  - name: search
    description: Search and filtering endpoints
  - name: incentive-programs
    description: Incentive program endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: events
    description: Event endpoints
  - name: structured-targets
    description: Structured targets endpoints
paths:
  /fcm/orders:
    get:
      tags:
        - fcm
      summary: Get FCM Orders
      description: >
        Endpoint for FCM members to get orders filtered by subtrader ID.

        This endpoint requires FCM member access level and allows filtering
        orders by subtrader ID.
      operationId: GetFCMOrders
      parameters:
        - name: subtrader_id
          in: query
          required: true
          description: >-
            Restricts the response to orders for a specific subtrader (FCM
            members only)
          schema:
            type: string
        - $ref: '#/components/parameters/CursorQuery'
        - $ref: '#/components/parameters/EventTickerQuery'
        - $ref: '#/components/parameters/TickerQuery'
        - name: min_ts
          in: query
          description: >-
            Restricts the response to orders after a timestamp, formatted as a
            Unix Timestamp
          schema:
            type: integer
            format: int64
        - name: max_ts
          in: query
          description: >-
            Restricts the response to orders before a timestamp, formatted as a
            Unix Timestamp
          schema:
            type: integer
            format: int64
        - name: status
          in: query
          description: Restricts the response to orders that have a certain status
          schema:
            type: string
            enum:
              - resting
              - canceled
              - executed
        - name: limit
          in: query
          description: Parameter to specify the number of results per page. Defaults to 100
          schema:
            type: integer
            minimum: 1
            maximum: 1000
      responses:
        '200':
          description: Orders retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetOrdersResponse'
        '400':
          description: Bad request
        '401':
          description: Unauthorized
        '404':
          description: Not found
        '500':
          description: Internal server error
      security:
        - kalshiAccessKey: []
          kalshiAccessSignature: []
          kalshiAccessTimestamp: []
components:
  parameters:
    CursorQuery:
      name: cursor
      in: query
      description: >-
        Pagination cursor. Use the cursor value returned from the previous
        response to get the next page of results. Leave empty for the first
        page.
      schema:
        type: string
        x-go-type-skip-optional-pointer: true
    EventTickerQuery:
      name: event_ticker
      in: query
      description: >-
        Event ticker of desired positions. Multiple event tickers can be
        provided as a comma-separated list (maximum 10).
      schema:
        type: string
        x-go-type-skip-optional-pointer: true
    TickerQuery:
      name: ticker
      in: query
      description: Filter by market ticker
      schema:
        type: string
        x-go-type-skip-optional-pointer: true
  schemas:
    GetOrdersResponse:
      type: object
      required:
        - orders
        - cursor
      properties:
        orders:
          type: array
          items:
            $ref: '#/components/schemas/Order'
        cursor:
          type: string
    Order:
      type: object
      required:
        - order_id
        - user_id
        - client_order_id
        - ticker
        - side
        - action
        - type
        - status
        - yes_price
        - no_price
        - yes_price_dollars

```

--------------------------------

### Batch Create Orders API - General Availability

Source: https://docs.kalshi.com/changelog

The POST /portfolio/orders/batched endpoint is now generally available, removing the advanced API access prerequisite.

```APIDOC
## POST /portfolio/orders/batched

### Description
Creates orders in batch. This endpoint is now generally available.

### Method
POST

### Endpoint
`/portfolio/orders/batched`

```

--------------------------------

### GET /websites/kalshi

Source: https://docs.kalshi.com/api-reference/multivariate/create-market-in-multivariate-event-collection

Retrieves detailed information about Kalshi markets, including trading data, market status, and expiration details.

```APIDOC
## GET /websites/kalshi

### Description
Retrieves detailed information about Kalshi markets, including trading data, market status, and expiration details.

### Method
GET

### Endpoint
/websites/kalshi

### Parameters
#### Query Parameters
- **ticker** (string) - Optional - The ticker symbol for the market.
- **event_ticker** (string) - Optional - The event ticker for the market.
- **market_type** (string) - Optional - The type of market ('binary' or 'scalar').
- **status** (string) - Optional - The current status of the market.
- **limit** (integer) - Optional - The maximum number of results to return.
- **offset** (integer) - Optional - The number of results to skip.

### Response
#### Success Response (200)
- **properties** (object) - An object containing various market properties such as:
  - **ticker** (string) - The ticker symbol for the market.
  - **event_ticker** (string) - The event ticker for the market.
  - **market_type** (string) - The type of market ('binary' or 'scalar').
  - **yes_sub_title** (string) - Shortened title for the yes side of this market.
  - **no_sub_title** (string) - Shortened title for the no side of this market.
  - **created_time** (string) - The creation timestamp of the market.
  - **open_time** (string) - The opening timestamp of the market.
  - **close_time** (string) - The closing timestamp of the market.
  - **expected_expiration_time** (string) - The expected expiration timestamp of the market.
  - **latest_expiration_time** (string) - The latest possible expiration timestamp of the market.
  - **settlement_timer_seconds** (integer) - The time in seconds after determination that the market settles.
  - **status** (string) - The current status of the market.
  - **yes_bid_dollars** (object) - Price for the highest YES buy offer in dollars.
  - **yes_ask_dollars** (object) - Price for the lowest YES sell offer in dollars.
  - **no_bid_dollars** (object) - Price for the highest NO buy offer in dollars.
  - **no_ask_dollars** (object) - Price for the lowest NO sell offer in dollars.
  - **last_price_dollars** (object) - Price for the last traded YES contract in dollars.
  - **volume** (integer) - The total trading volume.
  - **volume_24h** (integer) - The trading volume in the last 24 hours.
  - **result** (string) - The final result of the market ('yes', 'no', or '').
  - **can_close_early** (boolean) - Indicates if the market can be closed early.
  - **open_interest** (integer) - The number of open contracts.
  - **notional_value_dollars** (object) - The total value of a single contract at settlement in dollars.
  - **previous_yes_bid_dollars** (object) - Price for the highest YES buy offer a day ago in dollars.
  - **previous_yes_bid_dollars** (object) - Price for the highest YES buy offer a day ago in dollars.
  - **previous_yes_ask_dollars** (object) - Price for the lowest YES sell offer a day ago in dollars.
  - **previous_price_dollars** (object) - The last traded price a day ago in dollars.
  - **liquidity** (integer) - The current liquidity of the market.
  - **liquidity_dollars** (object) - The current liquidity in dollars.
  - **rules_primary** (string) - The primary rules for the market.
  - **rules_secondary** (string) - The secondary rules for the market.
  - **tick_size** (number) - The minimum price increment for the market.
  - **price_level_structure** (object) - Structure defining price levels.
  - **price_ranges** (array) - Array of price ranges for the market.

#### Response Example
```json
{
  "properties": [
    {
      "ticker": "TSLA_2024-12-20",
      "event_ticker": "TSLA",
      "market_type": "binary",
      "yes_sub_title": "Tesla Stock Price",
      "no_sub_title": "Tesla Stock Price Not Above",
      "created_time": "2023-01-01T00:00:00Z",
      "open_time": "2023-01-01T00:00:00Z",
      "close_time": "2024-12-20T16:00:00Z",
      "expected_expiration_time": "2024-12-20T16:00:00Z",
      "latest_expiration_time": "2024-12-20T16:00:00Z",
      "settlement_timer_seconds": 3600,
      "status": "active",
      "yes_bid_dollars": {
        "value": "0.75",
        "display_value": "$0.75"
      },
      "yes_ask_dollars": {
        "value": "0.80",
        "display_value": "$0.80"
      },
      "no_bid_dollars": {
        "value": "0.20",
        "display_value": "$0.20"
      },
      "no_ask_dollars": {
        "value": "0.25",
        "display_value": "$0.25"
      },
      "last_price_dollars": {
        "value": "0.78",
        "display_value": "$0.78"
      },
      "volume": 10000,
      "volume_24h": 500,
      "result": "",
      "can_close_early": false,
      "open_interest": 5000,
      "notional_value_dollars": {
        "value": "1.00",
        "display_value": "$1.00"
      },
      "previous_yes_bid_dollars": {
        "value": "0.70",
        "display_value": "$0.70"
      },
      "previous_yes_ask_dollars": {
        "value": "0.75",
        "display_value": "$0.75"
      },
      "previous_price_dollars": {
        "value": "0.72",
        "display_value": "$0.72"
      },
      "liquidity": 500,
      "liquidity_dollars": {
        "value": "375.00",
        "display_value": "$375.00"
      },
      "rules_primary": "Price must be above $100.",
      "rules_secondary": "Settlement based on closing price.",
      "tick_size": 0.01,
      "price_level_structure": {
        "type": "fixed",
        "step": 0.01
      },
      "price_ranges": [
        {
          "min": 0,
          "max": 1
        }
      ]
    }
  ]
}
```
```

--------------------------------

### GET /exchange/announcements

Source: https://docs.kalshi.com/typescript-sdk/api/ExchangeApi

Retrieves all exchange-wide announcements. This endpoint does not require any parameters.

```APIDOC
## GET /exchange/announcements

### Description
Endpoint for getting all exchange-wide announcements.

### Method
GET

### Endpoint
/exchange/announcements

### Parameters

#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **GetExchangeAnnouncementsResponse** (object) - Exchange announcements retrieved successfully

#### Response Example
```json
{
  "announcements": [
    {
      "id": "string",
      "timestamp": 0,
      "title": "string",
      "text": "string"
    }
  ]
}
```
```

--------------------------------

### GET /series/fee_changes

Source: https://docs.kalshi.com/api-reference/exchange/get-series-fee-changes

Retrieves fee change information for series on the Kalshi exchange. This endpoint allows filtering by series ticker and can include historical data.

```APIDOC
## GET /series/fee_changes

### Description
Retrieves fee change information for series on the Kalshi exchange. This endpoint allows filtering by series ticker and can include historical data.

### Method
GET

### Endpoint
/series/fee_changes

### Parameters
#### Query Parameters
- **series_ticker** (string) - Optional - The ticker of the series to retrieve fee changes for.
- **show_historical** (boolean) - Optional - Defaults to false. If true, includes historical fee changes.

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **series_fee_change_arr** (array) - An array of SeriesFeeChange objects.
  - **id** (string) - Unique identifier for this fee change.
  - **series_ticker** (string) - Series ticker this fee change applies to.
  - **fee_type** (string) - Enum: "quadratic", "quadratic_with_maker_fees", "flat" - New fee type for the series.
  - **fee_multiplier** (number) - New fee multiplier for the series.
  - **scheduled_ts** (string) - Timestamp when this fee change is scheduled to take effect.

#### Response Example
```json
{
  "series_fee_change_arr": [
    {
      "id": "fee_change_123",
      "series_ticker": "TSLA-20240101",
      "fee_type": "quadratic",
      "fee_multiplier": 0.005,
      "scheduled_ts": "2024-01-01T00:00:00Z"
    }
  ]
}
```

#### Error Handling
- **400 Bad Request**: Returned when the input parameters are invalid.
- **500 Internal Server Error**: Returned when the server encounters an unexpected error.
```

--------------------------------

### Create Order Response - Model Update

Source: https://docs.kalshi.com/changelog

The response model for the create order operation has been updated to be identical to the model returned by the get order operation, providing a consistent data structure.

```JSON
{
  "order_id": "12345",
  "status": "open",
  "price": "1.50"
}
```

--------------------------------

### GET /portfolio/orders/{order_id}

Source: https://docs.kalshi.com/api-reference/orders/get-order

Retrieves the details of a specific order using its unique identifier.

```APIDOC
## GET /portfolio/orders/{order_id}

### Description
Endpoint for retrieving a single order by its ID.

### Method
GET

### Endpoint
/portfolio/orders/{order_id}

### Parameters
#### Path Parameters
- **order_id** (string) - Required - The unique identifier of the order.

### Response
#### Success Response (200)
- **order** (object) - Contains the details of the order.
  - **order_id** (string) - The unique identifier of the order.
  - **user_id** (string) - Unique identifier for users.
  - **client_order_id** (string) - The client-provided order ID.
  - **ticker** (string) - The market ticker symbol.
  - **side** (string) - 'yes' or 'no'.
  - **action** (string) - 'buy' or 'sell'.
  - **type** (string) - 'limit' or 'market'.
  - **status** (string) - The current status of the order.
  - **yes_price** (integer) - The yes price of the order.
  - **no_price** (integer) - The no price of the order.
  - **yes_price_dollars** (string) - The yes price in dollars.
  - **no_price_dollars** (string) - The no price in dollars.
  - **fill_count** (integer) - The number of contracts filled.
  - **remaining_count** (integer) - The number of contracts remaining.
  - **initial_count** (integer) - The initial number of contracts.
  - **taker_fees** (integer) - Fees paid on filled taker contracts, in cents.
  - **maker_fees** (integer) - Fees paid on filled maker contracts, in cents.
  - **taker_fill_cost** (integer) - Cost of filled taker orders in cents.
  - **maker_fill_cost** (integer) - Cost of filled maker orders in cents.
  - **taker_fill_cost_dollars** (string) - Cost of filled taker orders in dollars.
  - **maker_fill_cost_dollars** (string) - Cost of filled maker orders in dollars.
  - **queue_position** (integer) - The position in the order queue.

#### Response Example
{
  "order": {
    "order_id": "some-order-id",
    "user_id": "some-user-id",
    "client_order_id": "some-client-order-id",
    "ticker": "some-ticker",
    "side": "yes",
    "action": "buy",
    "type": "limit",
    "status": "filled",
    "yes_price": 5000,
    "no_price": 5000,
    "yes_price_dollars": "0.50",
    "no_price_dollars": "0.50",
    "fill_count": 10,
    "remaining_count": 0,
    "initial_count": 10,
    "taker_fees": 5,
    "maker_fees": 0,
    "taker_fill_cost": 50000,
    "maker_fill_cost": 0,
    "taker_fill_cost_dollars": "5.00",
    "maker_fill_cost_dollars": "0.00",
    "queue_position": 0
  }
}

#### Error Responses
- **401** - Unauthorized
- **404** - Not Found
- **500** - Internal Server Error
```

--------------------------------

### GET /event_metadata

Source: https://docs.kalshi.com/changelog/index

Retrieves metadata for a specific event, now including settlement sources.

```APIDOC
## GET /event_metadata

### Description
Retrieves metadata for a specific event, including settlement sources.

### Method
GET

### Endpoint
/event_metadata

### Parameters
#### Query Parameters
- **event_ticker** (string) - Required - The ticker of the event to retrieve metadata for.

### Request Example
```json
{
  "event_ticker": "sample_event"
}
```

### Response
#### Success Response (200)
- **event_ticker** (string) - The ticker of the event.
- **settlement_sources** (array) - A list of settlement sources for the event.

#### Response Example
```json
{
  "event_ticker": "sample_event",
  "settlement_sources": ["source1", "source2"]
}
```
```

--------------------------------

### POST /portfolio/orders/batched

Source: https://docs.kalshi.com/changelog

Allows for the creation of multiple orders in a single request. This endpoint is now available to Basic tier users in the demo environment for testing purposes.

```APIDOC
## POST /portfolio/orders/batched

### Description
Creates multiple orders in a single request. This endpoint is available for testing in the demo environment for Basic tier users.

### Method
POST

### Endpoint
`/portfolio/orders/batched`

### Parameters
#### Request Body
- **orders** (array) - Required - An array of order objects to be created.
  - **market_ticker** (string) - Required - The ticker of the market for the order.
  - **order_type** (string) - Required - The type of order (e.g., 'limit', 'market').
  - **price** (number) - Optional - The price for limit orders.
  - **quantity** (number) - Required - The quantity of contracts for the order.
  - **side** (string) - Required - The side of the order ('buy' or 'sell').
  - **tif** (string) - Optional - Time in force for the order (e.g., 'gtc', 'day').

### Request Example
```json
{
  "orders": [
    {
      "market_ticker": "aapl-2023-11-17-call-200",
      "order_type": "limit",
      "price": 0.50,
      "quantity": 10,
      "side": "buy",
      "tif": "gtc"
    }
  ]
}
```

### Response
#### Success Response (200)
- **order_ids** (array) - An array of IDs for the created orders.

#### Response Example
```json
{
  "order_ids": ["ord_12345abc", "ord_67890def"]
}
```
```

--------------------------------

### GET /search/tags_by_categories

Source: https://docs.kalshi.com/api-reference/search/get-tags-for-series-categories

Retrieve tags organized by series categories. This endpoint returns a mapping of series categories to their associated tags, which can be used for filtering and search functionality.

```APIDOC
## GET /search/tags_by_categories

### Description
Retrieve tags organized by series categories. This endpoint returns a mapping of series categories to their associated tags, which can be used for filtering and search functionality.

### Method
GET

### Endpoint
/search/tags_by_categories

### Parameters

### Query Parameters

### Request Body

### Request Example
```json
{
  "example": "No request body for this endpoint"
}
```

### Response
#### Success Response (200)
- **tags_by_categories** (object) - Mapping of series categories to their associated tags. Additional properties are arrays of strings representing tags.

#### Response Example
```json
{
  "tags_by_categories": {
    "category1": ["tag1", "tag2"],
    "category2": ["tag3"]
  }
}
```

#### Error Responses
- **401** - Unauthorized
- **500** - Internal server error
```

--------------------------------

### GET /portfolio/positions

Source: https://docs.kalshi.com/openapi

Retrieves the user's positions, with options to filter by various fields and order types.

```APIDOC
## GET /portfolio/positions

### Description
Restricts the positions to those with any of following fields with non-zero values, as a comma separated list. The following values are accepted: position, total_traded.

### Method
GET

### Endpoint
/portfolio/positions

### Parameters
#### Query Parameters
- **cursor** (string) - Optional - Cursor for pagination.
- **limit** (integer) - Optional - Maximum number of positions to return.
- **count_filter** (string) - Optional - Filters positions based on count. Accepts 'position' or 'total_traded'.
- **ticker** (string) - Optional - Filters positions by ticker symbol.
- **event_ticker** (string) - Optional - Filters positions by event ticker.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **GetPositionsResponse** (object) - Schema containing the user's positions.

#### Response Example
```json
{
  "positions": [
    {
      "ticker": "BTC-USD",
      "event_ticker": "",
      "position": 100000,
      "total_traded": 50000
    }
  ],
  "next_cursor": "some_cursor"
}
```
```

--------------------------------

### Get FCM Positions - OpenAPI Specification

Source: https://docs.kalshi.com/api-reference/fcm/get-fcm-positions

Defines the GET endpoint for retrieving FCM (Futures Commission Merchant) positions. This endpoint allows filtering by subtrader ID, ticker, event ticker, settlement status, and pagination. It requires specific Kalshi API authentication headers.

```yaml
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 3.3.0
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://api.elections.kalshi.com/trade-api/v2
    description: Production server
security: []
tags:
  - name: api-keys
    description: API key management endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: communications
    description: Request-for-quote (RFQ) endpoints
  - name: multivariate
    description: Multivariate event collection endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: live-data
    description: Live data endpoints
  - name: markets
    description: Market data endpoints
  - name: milestone
    description: Milestone endpoints
  - name: search
    description: Search and filtering endpoints
  - name: incentive-programs
    description: Incentive program endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: events
    description: Event endpoints
  - name: structured-targets
    description: Structured targets endpoints
paths:
  /fcm/positions:
    get:
      tags:
        - fcm
      summary: Get FCM Positions
      description: >
        Endpoint for FCM members to get market positions filtered by subtrader
        ID.

        This endpoint requires FCM member access level and allows filtering
        positions by subtrader ID.
      operationId: GetFCMPositions
      parameters:
        - name: subtrader_id
          in: query
          required: true
          description: >-
            Restricts the response to positions for a specific subtrader (FCM
            members only)
          schema:
            type: string
        - name: ticker
          in: query
          description: Ticker of desired positions
          schema:
            type: string
            x-go-type-skip-optional-pointer: true
        - name: event_ticker
          in: query
          description: Event ticker of desired positions
          schema:
            type: string
            x-go-type-skip-optional-pointer: true
        - name: count_filter
          in: query
          description: >-
            Restricts the positions to those with any of following fields with
            non-zero values, as a comma separated list
          schema:
            type: string
        - name: settlement_status
          in: query
          description: Settlement status of the markets to return. Defaults to unsettled
          schema:
            type: string
            enum:
              - all
              - unsettled
              - settled
        - name: limit
          in: query
          description: Parameter to specify the number of results per page. Defaults to 100
          schema:
            type: integer
            minimum: 1
            maximum: 1000
        - name: cursor
          in: query
          description: >-
            The Cursor represents a pointer to the next page of records in the
            pagination
          schema:
            type: string
      responses:
        '200':
          description: Positions retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetPositionsResponse'
        '400':
          description: Bad request
        '401':
          description: Unauthorized
        '404':
          description: Not found
        '500':
          description: Internal server error
      security:
        - kalshiAccessKey: []
          kalshiAccessSignature: []
          kalshiAccessTimestamp: []
components:
  schemas:
    GetPositionsResponse:
      type: object
      required:
        - market_positions
        - event_positions
      properties:
        cursor:
          type: string
          description: >-
            The Cursor represents a pointer to the next page of records in the
            pagination. Use the value returned here in the cursor query
            parameter for this end-point to get the next page containing limit
            records. An empty value of this field indicates there is no next
            page.
        market_positions:
          type: array
          items:
            $ref: '#/components/schemas/MarketPosition'
          description: List of market positions
        event_positions:
          type: array
          items:
            $ref: '#/components/schemas/EventPosition'
          description: List of event positions
    MarketPosition:
      type: object
      required:
        - ticker
        - total_traded
        - total_traded_dollars
        - position
        - market_exposure
        - market_exposure_dollars
        - realized_pnl

```

--------------------------------

### Create Order

Source: https://docs.kalshi.com/api-reference/orders/create-order

Allows users to create new orders on the Kalshi exchange. Supports various order types and self-trade prevention.

```APIDOC
## POST /websites/kalshi

### Description
Creates a new order on the Kalshi exchange. This endpoint allows users to specify the details of the order, including ticker, side, type, price, and quantity.

### Method
POST

### Endpoint
/websites/kalshi

### Parameters
#### Request Body
- **self_trade_prevention_type** (string) - Optional - The self-trade prevention type for orders (taker_at_cross, maker).
- **order_group_id** (string) - Optional - The order group this order is part of.
- **cancel_order_on_pause** (boolean) - Optional - If true, the order will be canceled if trading is paused.

### Request Example
```json
{
  "ticker": "GOV.2024-12-31",
  "side": "buy",
  "type": "limit",
  "limit_price": 100,
  "quantity": 10,
  "self_trade_prevention_type": "taker_at_cross",
  "cancel_order_on_pause": false
}
```

### Response
#### Success Response (200)
- **order** (object) - Contains details of the created order.
  - **order_id** (string) - Unique identifier for the order.
  - **user_id** (string) - Unique identifier for the user.
  - **client_order_id** (string) - Client-generated order identifier.
  - **ticker** (string) - The market ticker for the order.
  - **side** (string) - The side of the order ('yes' or 'no').
  - **action** (string) - The action of the order ('buy' or 'sell').
  - **type** (string) - The type of the order ('limit' or 'market').
  - **status** (string) - The current status of the order.
  - **yes_price** (integer) - The yes price for the order.
  - **no_price** (integer) - The no price for the order.
  - **yes_price_dollars** (string) - The yes price in dollars (fixed-point format).
  - **no_price_dollars** (string) - The no price in dollars (fixed-point format).
  - **fill_count** (integer) - The number of contracts filled.
  - **remaining_count** (integer) - The remaining number of contracts for the order.
  - **initial_count** (integer) - The initial size of the order.
  - **taker_fees** (integer) - Fees paid on filled taker contracts (in cents).
  - **maker_fees** (integer) - Fees paid on filled maker contracts (in cents).
  - **taker_fill_cost** (integer) - Cost of filled taker orders (in cents).
  - **maker_fill_cost** (integer) - Cost of filled maker orders (in cents).
  - **taker_fill_cost_dollars** (string) - Cost of filled taker orders in dollars.
  - **maker_fill_cost_dollars** (string) - Cost of filled maker orders in dollars.
  - **queue_position** (integer) - DEPRECATED: Always returns 0.
  - **taker_fees_dollars** (string) - Fees paid on filled taker contracts in dollars (nullable).
  - **maker_fees_dollars** (string) - Fees paid on filled maker contracts in dollars (nullable).
  - **expiration_time** (string) - Order expiration time (date-time format, nullable).
  - **created_time** (string) - Order creation time (date-time format).
  - **last_update_time** (string) - Last update time of the order (date-time format, nullable).
  - **self_trade_prevention_type** (string) - Self-trade prevention type used for the order (nullable).
  - **order_group_id** (string) - The order group ID (nullable).

#### Response Example
```json
{
  "order": {
    "order_id": "ord_abcdef123456",
    "user_id": "usr_xyz987654",
    "client_order_id": "clt_12345",
    "ticker": "GOV.2024-12-31",
    "side": "buy",
    "action": "buy",
    "type": "limit",
    "status": "open",
    "yes_price": 5000,
    "no_price": 5000,
    "yes_price_dollars": "0.5000",
    "no_price_dollars": "0.5000",
    "fill_count": 0,
    "remaining_count": 10,
    "initial_count": 10,
    "taker_fees": 0,
    "maker_fees": 0,
    "taker_fill_cost": 0,
    "maker_fill_cost": 0,
    "taker_fill_cost_dollars": "0.0000",
    "maker_fill_cost_dollars": "0.0000",
    "queue_position": 0,
    "created_time": "2023-10-27T10:00:00Z",
    "last_update_time": "2023-10-27T10:00:00Z"
  }
}
```
```

--------------------------------

### Get Total Resting Order Value

Source: https://docs.kalshi.com/api-reference/portfolio/get-total-resting-order-value

Retrieves the total value, in cents, of all resting orders associated with your account. This endpoint is primarily for FCM members.

```APIDOC
## GET /portfolio/summary/total_resting_order_value

### Description
Endpoint for getting the total value, in cents, of resting orders. This endpoint is only intended for use by FCM members (rare). Note: If you're uncertain about this endpoint, it likely does not apply to you.

### Method
GET

### Endpoint
https://api.elections.kalshi.com/trade-api/v2/portfolio/summary/total_resting_order_value

### Parameters

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **total_resting_order_value** (integer) - Total value of resting orders in cents

#### Response Example
```json
{
  "total_resting_order_value": 123456
}
```

#### Error Responses
- **401** - Unauthorized - authentication required
- **500** - Internal Server Error
```

--------------------------------

### GET /portfolio/settlements

Source: https://docs.kalshi.com/python-sdk/api

Retrieves the member's historical settlements.

```APIDOC
## GET /portfolio/settlements

### Description
Get Settlements Endpoint for getting the member’s settlements historical track.

### Method
GET

### Endpoint
/portfolio/settlements

### Parameters
#### Path Parameters
None

#### Query Parameters
- **limit** (int) - Optional - Number of results per page.
- **cursor** (str) - Optional - Pagination cursor.
- **ticker** (str) - Optional - Filter by market ticker.
- **event_ticker** (str) - Optional - Filter by event ticker.
- **min_ts** (int) - Optional - Filter items after this Unix timestamp.
- **max_ts** (int) - Optional - Filter items before this Unix timestamp.

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **GetSettlementsResponse** (object) - Information about the member's settlements.

#### Response Example
```json
{
  "settlements": [
    {
      "ticker": "2024-US-PRES",
      "settled_quantity": 10,
      "settlement_price": 5000,
      "timestamp": 1678886400
    }
  ],
  "cursor": "next_page_cursor"
}
```
```

--------------------------------

### Fetch Navigation and Other Pages

Source: https://docs.kalshi.com/api-reference/communications/create-rfq

Endpoint to retrieve navigation and other page information from the documentation.

```APIDOC
## GET /websites/kalshi/llms.txt

### Description
This endpoint allows you to fetch the `llms.txt` file, which contains navigation and other page information for the Kalshi documentation.

### Method
GET

### Endpoint
/websites/kalshi/llms.txt

### Parameters
#### Query Parameters
None

#### Request Body
None

### Request Example
```bash
curl -X GET https://docs.kalshi.com/llms.txt
```

### Response
#### Success Response (200)
- **content** (string) - The content of the llms.txt file, containing navigation and page data.
```

--------------------------------

### Get Filters for Sports - OpenAPI Specification

Source: https://docs.kalshi.com/api-reference/search/get-filters-for-sports

This OpenAPI 3.0 specification defines the GET /search/filters_by_sport endpoint. It outlines the request parameters, successful response structure (200 OK) which includes filters by sport and sport ordering, and potential error responses (401 Unauthorized, 500 Internal Server Error). The response schema details nested objects for sport filters, scopes, and competitions.

```yaml
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 3.3.0
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://api.elections.kalshi.com/trade-api/v2
    description: Production server
security: []
tags:
  - name: api-keys
    description: API key management endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: communications
    description: Request-for-quote (RFQ) endpoints
  - name: multivariate
    description: Multivariate event collection endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: live-data
    description: Live data endpoints
  - name: markets
    description: Market data endpoints
  - name: milestone
    description: Milestone endpoints
  - name: search
    description: Search and filtering endpoints
  - name: incentive-programs
    description: Incentive program endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: events
    description: Event endpoints
  - name: structured-targets
    description: Structured targets endpoints
paths:
  /search/filters_by_sport:
    get:
      tags:
        - search
      summary: Get Filters for Sports
      description: >
        Retrieve available filters organized by sport.


        This endpoint returns filtering options available for each sport,
        including scopes and competitions. It also provides an ordered list of
        sports for display purposes.
      operationId: GetFiltersForSports
      responses:
        '200':
          description: Filters retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetFiltersBySportsResponse'
        '401':
          description: Unauthorized
        '500':
          description: Internal server error
components:
  schemas:
    GetFiltersBySportsResponse:
      type: object
      required:
        - filters_by_sports
        - sport_ordering
      properties:
        filters_by_sports:
          type: object
          description: Mapping of sports to their filter details
          additionalProperties:
            $ref: '#/components/schemas/SportFilterDetails'
        sport_ordering:
          type: array
          description: Ordered list of sports for display
          items:
            type: string
    SportFilterDetails:
      type: object
      required:
        - scopes
        - competitions
      properties:
        scopes:
          type: array
          description: List of scopes available for this sport
          items:
            type: string
        competitions:
          type: object
          description: Mapping of competitions to their scope lists
          additionalProperties:
            $ref: '#/components/schemas/ScopeList'
    ScopeList:
      type: object
      required:
        - scopes
      properties:
        scopes:
          type: array
          description: List of scopes
          items:
            type: string

```

--------------------------------

### Events Endpoints - Broker Availability

Source: https://docs.kalshi.com/changelog/index

Individual and batch GET events endpoints now return `available_on_brokers` field.

```APIDOC
## Events Endpoints Update

### Description
Both the individual and batch `GET` events endpoints now also return `available_on_brokers` which indicates that they are available on intermediate platforms/ brokers.

### Method
GET

### Endpoint
- /events/{id}
- /events

### Response
#### Success Response (200)
- **available_on_brokers** (boolean) - Indicates if the event is available on intermediate platforms/brokers.
```

--------------------------------

### Logon Process

Source: https://docs.kalshi.com/fix/session-management

Details on how to establish a FIX session by sending a Logon message and the expected responses.

```APIDOC
## Logon Process

### Logon Message (35=A)

Send a Logon message (tag 35=A) to establish a session. The acceptor will respond with a Logon message on success or a Logout message (35=5) on failure.

### Required Fields

| Tag  | Name             | Description                    | Value                    |
| ---- | ---------------- | ------------------------------ | ------------------------ |
| 98   | EncryptMethod    | Method of encryption           | None<0>                  |
| 96   | RawData          | Client logon message signature | Base64 encoded signature |
| 108  | HeartbeatInt     | Heartbeat interval (seconds)   | N > 3                    |
| 1137 | DefaultApplVerID | Default application version    | FIX50SP2<9>              |

### Optional Fields

| Tag   | Name                     | Description                                                                                          | Default |
| ----- | ------------------------ | ---------------------------------------------------------------------------------------------------- | ------- |
| 141   | ResetSeqNumFlag          | Reset sequence numbers on logon. **Must be Y for KalshiNR, KalshiDC, KalshiPT.**                     | N       |
| 108   | HeartbeatInt             | Heartbeat <0> interval (seconds)                                                                       | 30      |
| 8013  | CancelOrdersOnDisconnect | Cancel orders on any disconnection (including graceful logout)                                       | N       |
| 20126 | ListenerSession          | Listen-only session (KalshiNR/RT only, requires SkipPendingExecReports=Y)                            | N       |
| 20127 | ReceiveSettlementReports | Receive settlement reports (KalshiRT only)                                                           | N       |
| 20200 | MessageRetentionPeriod   | How long session messages will be store for retransmission (KalshiRT and KalshiRFQ only), max of 72. | 24      |
| 21011 | SkipPendingExecReports   | Skip PENDING_{NEW|REPLACE|CANCEL} execution reports                                              | N       |
| 21007 | EnableIocCancelReport    | Partially filled IOC orders produce a cancel report                                                  | N       |
| 21008 | PreserveOriginalOrderQty | OrderQty tag 38 always reflects original order quantity across all states                            | N       |
```

--------------------------------

### PriceRange Model

Source: https://docs.kalshi.com/python-sdk/models/PriceRange

This section details the properties of the PriceRange model, which represents a price range with a starting price, ending price, and a price step.

```APIDOC
## PriceRange Model

### Description
Represents a price range with defined start, end, and step values.

### Properties

#### Response Body
- **start** (string) - Starting price for this range in dollars.
- **end** (string) - Ending price for this range in dollars.
- **step** (string) - Price step/tick size for this range in dollars.

### Response Example
```json
{
  "start": "1.00",
  "end": "5.00",
  "step": "0.01"
}
```
```

--------------------------------

### GET /exchange/schedule

Source: https://docs.kalshi.com/python-sdk/api/ExchangeApi

Retrieves the exchange schedule. This endpoint does not require any parameters.

```APIDOC
## GET /exchange/schedule

### Description
Get Exchange Schedule

Endpoint for getting the exchange schedule.

### Method
GET

### Endpoint
/exchange/schedule

### Parameters

#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **GetExchangeScheduleResponse** (object) - Exchange schedule retrieved successfully

#### Response Example
{
  "example": "response body"
}
```

--------------------------------

### GET /exchange/status

Source: https://docs.kalshi.com/typescript-sdk/api/ExchangeApi

Retrieves the current status of the exchange. This endpoint does not require any parameters.

```APIDOC
## GET /exchange/status

### Description
Endpoint for getting the exchange status.

### Method
GET

### Endpoint
/exchange/status

### Parameters

#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **ExchangeStatus** (object) - Exchange status retrieved successfully

#### Response Example
```json
{
  "status": "open" 
}
```
```

--------------------------------

### GET /forecast_percentiles_history

Source: https://docs.kalshi.com/changelog/index

Retrieves the percentile history of an event forecast.

```APIDOC
## GET /forecast_percentiles_history

### Description
Get percentile history of a event forecast.

### Method
GET

### Endpoint
/forecast_percentiles_history

### Query Parameters
- **event_id** (integer) - Required - The ID of the event.
- **start_ts** (integer) - Optional - The start timestamp for the history.
- **end_ts** (integer) - Optional - The end timestamp for the history.

### Response
#### Success Response (200)
- **history** (array) - An array of percentile history objects.
  - **ts** (integer) - Timestamp of the forecast.
  - **percentiles** (object) - Object containing percentile values.
```

--------------------------------

### Get RFQs API

Source: https://docs.kalshi.com/python-sdk/api/CommunicationsApi

Retrieves a list of RFQs with various filtering and pagination options.

```APIDOC
## GET /get_rfqs

### Description
Retrieves a list of RFQs with various filtering and pagination options.

### Method
GET

### Endpoint
/get_rfqs

### Parameters
#### Query Parameters
- **cursor** (string) - Optional - Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page.
- **event_ticker** (string) - Optional - Event ticker of desired RFQs. Multiple event tickers can be provided as a comma-separated list (maximum 10).
- **market_ticker** (string) - Optional - Filter by market ticker
- **limit** (integer) - Optional - Parameter to specify the number of results per page. Defaults to 500.
- **status** (string) - Optional - Filter RFQs by status
- **creator_user_id** (string) - Optional - Filter RFQs by creator user ID

### Response
#### Success Response (200)
- **GetRFQsResponse** (object) - RFQs retrieved successfully

#### Error Response
- **401** - Unauthorized - authentication required
- **500** - Internal server error
```

--------------------------------

### GET /markets/trades

Source: https://docs.kalshi.com/python-sdk/api/MarketsApi

Retrieves a list of recent trades across all markets.

```APIDOC
## GET /markets/trades

### Description
Get Trades

### Method
GET

### Endpoint
/markets/trades

### Parameters
#### Path Parameters
None

#### Query Parameters
- **limit** (integer) - Optional - Maximum number of trades to return
- **offset** (integer) - Optional - Number of trades to skip
- **market_ticker** (string) - Optional - Filter trades by market ticker
- **start_ts** (integer) - Optional - Start timestamp for trades
- **end_ts** (integer) - Optional - End timestamp for trades

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **GetTradesResponse** (object) - List of trades retrieved successfully

#### Response Example
{
  "example": "response body"
}
```

--------------------------------

### Calculate Bid-Ask Spread for a Market (Python)

Source: https://docs.kalshi.com/getting_started/orderbook_responses

Demonstrates how to calculate the bid-ask spread for a given market using provided orderbook data. It explains the logic of deriving ask prices from the reciprocal relationship in binary markets.

```python
# Using the example orderbook above
best_yes_bid = 42  # Highest YES bid (last in array)
best_yes_ask = 100 - 56  # 100 - highest NO bid = 44

spread = best_yes_ask - best_yes_bid  # 44 - 42 = 2

# The spread is 2¢
# You can buy YES at 44¢ (implied ask) and sell at 42¢ (bid)
```

--------------------------------

### Get Communications ID

Source: https://docs.kalshi.com/python-sdk/api/CommunicationsApi

Retrieves communications information by ID.

```APIDOC
## GET /communications/id

### Description
Get Communications ID. Endpoint to retrieve communications information.

### Method
GET

### Endpoint
/communications/id

### Parameters
*Note: This endpoint may require specific query parameters or a request body to identify the communications. Details are not provided in the input.* 

### Response
*Note: Specific response details are not provided in the input.*

### Request Example
```json
{
  "example": "get_communications_request_body"
}
```

### Response Example
```json
{
  "example": "get_communications_response_body"
}
```
```

--------------------------------

### GET /websites/kalshi/trades

Source: https://docs.kalshi.com/api-reference/market/get-trades

Retrieves a paginated list of all trades for all markets on Kalshi. Trades represent completed transactions.

```APIDOC
## GET /websites/kalshi/trades

### Description
Endpoint for getting all trades for all markets. A trade represents a completed transaction between two users on a specific market. Each trade includes the market ticker, price, quantity, and timestamp information. This endpoint returns a paginated response.

### Method
GET

### Endpoint
/websites/kalshi/trades

### Parameters
#### Query Parameters
- **limit** (integer) - Optional - Use to control page size (1-1000, defaults to 100).
- **cursor** (string) - Optional - Pass the 'cursor' value from the previous response to get the next page. An empty cursor indicates no more pages are available.

### Request Example
```json
{
  "limit": 500,
  "cursor": "some_previous_cursor"
}
```

### Response
#### Success Response (200)
- **trades** (array) - A list of trade objects.
  - **market_ticker** (string) - The ticker symbol of the market.
  - **price** (number) - The price at which the trade occurred.
  - **quantity** (integer) - The number of shares traded.
  - **timestamp** (string) - The ISO 8601 timestamp of the trade.
- **cursor** (string) - A cursor for fetching the next page of results. Empty if no more pages.

#### Response Example
```json
{
  "trades": [
    {
      "market_ticker": "YES.2024-01-01.XYZ",
      "price": 0.75,
      "quantity": 100,
      "timestamp": "2023-10-27T10:00:00Z"
    },
    {
      "market_ticker": "NO.2024-01-01.XYZ",
      "price": 0.25,
      "quantity": 50,
      "timestamp": "2023-10-27T10:05:00Z"
    }
  ],
  "cursor": "next_cursor_value"
}
```
```

--------------------------------

### Get API Keys

Source: https://docs.kalshi.com/api-reference/api-keys/get-api-keys

Retrieves all API keys associated with the authenticated user. These keys enable programmatic access to the platform.

```APIDOC
## GET /api_keys

### Description
Endpoint for retrieving all API keys associated with the authenticated user. API keys allow programmatic access to the platform without requiring username/password authentication. Each key has a unique identifier and name.

### Method
GET

### Endpoint
/api_keys

### Parameters
#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **api_keys** (array) - List of all API keys associated with the user
  - **api_key_id** (string) - Unique identifier for the API key
  - **name** (string) - User-provided name for the API key
  - **scopes** (array of strings) - List of scopes granted to this API key. Valid values are 'read' and 'write'.

#### Response Example
```json
{
  "api_keys": [
    {
      "api_key_id": "your_api_key_id_1",
      "name": "My First Key",
      "scopes": ["read", "write"]
    },
    {
      "api_key_id": "your_api_key_id_2",
      "name": "Read Only Key",
      "scopes": ["read"]
    }
  ]
}
```

#### Error Response
- **401** - Unauthorized
- **500** - Internal server error
```

--------------------------------

### Create API Key

Source: https://docs.kalshi.com/python-sdk/api/ApiKeysApi

Creates a new API key for a user. This endpoint is available for users with Premier or Market Maker API usage levels. The user must provide their own RSA public key for signature verification.

```APIDOC
## POST /api_keys

### Description
Creates a new API key with a user-provided public key. This endpoint allows users with Premier or Market Maker API usage levels to create API keys by providing their own RSA public key. The platform will use this public key to verify signatures on API requests.

### Method
POST

### Endpoint
/api_keys

### Parameters
#### Request Body
- **create_api_key_request** (CreateApiKeyRequest) - Required - Details of the API key to create.

### Request Example
```json
{
  "example": "request body for create_api_key_request"
}
```

### Response
#### Success Response (201)
- **CreateApiKeyResponse** - Details of the newly created API key.

#### Response Example
```json
{
  "example": "response body for CreateApiKeyResponse"
}
```

#### Error Responses
- **400** - Bad request - invalid input
- **401** - Unauthorized
- **403** - Forbidden - insufficient API usage level
- **500** - Internal server error
```

--------------------------------

### Get Fills API

Source: https://docs.kalshi.com/api-reference/portfolio/get-fills

Retrieves all fills for a member. A fill occurs when a trade is matched.

```APIDOC
## GET /websites/kalshi/fills

### Description
Endpoint for getting all fills for the member. A fill is when a trade you have is matched.

### Method
GET

### Endpoint
/websites/kalshi/fills

### Parameters
#### Query Parameters
- **limit** (integer) - Optional - The maximum number of fills to return.
- **next_page_token** (string) - Optional - Token for retrieving the next page of results.

### Request Example
(No request body for GET requests)

### Response
#### Success Response (200)
- **fills** (array) - A list of fill objects.
  - **id** (string) - The unique identifier for the fill.
  - **created_timestamp** (string) - The timestamp when the fill was created.
  - **quantity** (number) - The quantity of the trade that was filled.
  - **price** (number) - The price at which the trade was filled.
  - **is_buy** (boolean) - True if the fill was a buy order, false otherwise.
  - **market_id** (string) - The identifier of the market.
  - **market_ticker** (string) - The ticker symbol of the market.
  - **expiration_timestamp** (string) - The timestamp when the market expires.
  - **strike_price** (number) - The strike price of the option.
  - **outcome** (string) - The outcome of the market (e.g., "YES", "NO").
  - **trade_id** (string) - The identifier of the associated trade.
- **next_page_token** (string) - Token for retrieving the next page of results, or null if there are no more pages.

#### Response Example
{
  "fills": [
    {
      "id": "fill_abc123",
      "created_timestamp": "2023-10-27T10:00:00Z",
      "quantity": 10,
      "price": 0.50,
      "is_buy": true,
      "market_id": "market_xyz789",
      "market_ticker": "ACME_CORP_20240101",
      "expiration_timestamp": "2024-01-01T23:59:59Z",
      "strike_price": 10.00,
      "outcome": "YES",
      "trade_id": "trade_def456"
    }
  ],
  "next_page_token": "page_token_ghi789"
}
```

--------------------------------

### Create Market In Multivariate Event Collection

Source: https://docs.kalshi.com/api-reference/multivariate/create-market-in-multivariate-event-collection

Endpoint for creating an individual market in a multivariate event collection. This endpoint must be hit at least once before trading or looking up a market.

```APIDOC
## POST /websites/kalshi

### Description
Endpoint for creating an individual market in a multivariate event collection. This endpoint must be hit at least once before trading or looking up a market.

### Method
POST

### Endpoint
/websites/kalshi

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
(No specific request body schema provided in the input text.)

### Request Example
```json
{
  "example": "request body"
}
```

### Response
#### Success Response (200)
(No specific success response schema provided in the input text.)

#### Response Example
```json
{
  "example": "response body"
}
```
```

--------------------------------

### Update GET /series/fee_changes API for User-Facing Fee Types

Source: https://docs.kalshi.com/changelog

The GET /series/fee_changes API endpoint now returns user-friendly fee type names (e.g., 'quadratic') instead of internal names. This change impacts API responses and CustomerIO notifications for scheduled series fee updates.

```plaintext
GET /series/fee_changes
```

--------------------------------

### Get Quotes API

Source: https://docs.kalshi.com/python-sdk/api/CommunicationsApi

Retrieves market quotes with various filtering and pagination options.

```APIDOC
## GET /websites/kalshi

### Description
Retrieves market quotes with various filtering and pagination options.

### Method
GET

### Endpoint
/websites/kalshi

### Parameters
#### Query Parameters
- **cursor** (string) - Optional - Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page.
- **event_ticker** (string) - Optional - Event ticker of desired positions. Multiple event tickers can be provided as a comma-separated list (maximum 10).
- **market_ticker** (string) - Optional - Filter by market ticker
- **limit** (integer) - Optional - Parameter to specify the number of results per page. Defaults to 500.
- **status** (string) - Optional - Filter quotes by status
- **quote_creator_user_id** (string) - Optional - Filter quotes by quote creator user ID
- **rfq_creator_user_id** (string) - Optional - Filter quotes by RFQ creator user ID
- **rfq_creator_subtrader_id** (string) - Optional - Filter quotes by RFQ creator subtrader ID (FCM members only)
- **rfq_id** (string) - Optional - Filter quotes by RFQ ID

### Response
#### Success Response (200)
- **GetQuotesResponse** (object) - Quotes retrieved successfully

#### Error Response
- **401** - Unauthorized - authentication required
- **500** - Internal server error
```

--------------------------------

### Python: Authenticated Kalshi API Request

Source: https://docs.kalshi.com/getting_started/api_keys

Demonstrates how to construct and send an authenticated GET request to the Kalshi API. It includes generating a timestamp, signing the request path and method, and setting the necessary headers (KALSHI-ACCESS-KEY, KALSHI-ACCESS-TIMESTAMP, KALSHI-ACCESS-SIGNATURE). Note that query parameters must be stripped from the path before signing.

```python
import requests
import datetime

# Assuming load_private_key_from_file and sign_pss_text are defined as above
def load_private_key_from_file(file_path):
    # ... (implementation from previous snippet)
    pass
def sign_pss_text(private_key: rsa.RSAPrivateKey, text: str) -> str:
    # ... (implementation from previous snippet)
    pass

current_time = datetime.datetime.now()
timestamp = current_time.timestamp()
current_time_milliseconds = int(timestamp * 1000)
timestampt_str = str(current_time_milliseconds)

private_key = load_private_key_from_file('kalshi-key-2.key')

method = "GET"
base_url = 'https://demo-api.kalshi.co'
path='/trade-api/v2/portfolio/balance'

# Strip query parameters from path before signing
path_without_query = path.split('?')[0]
msg_string = timestampt_str + method + path_without_query
sig = sign_pss_text(private_key, msg_string)

headers = {
    'KALSHI-ACCESS-KEY': 'a952bcbc-ec3b-4b5b-b8f9-11dae589608c', # Replace with your actual Key ID
    'KALSHI-ACCESS-SIGNATURE': sig,
    'KALSHI-ACCESS-TIMESTAMP': timestampt_str
}

response = requests.get(base_url + path, headers=headers)

print(response.text)
```

--------------------------------

### /websites/kalshi - Project Details

Source: https://docs.kalshi.com/python-sdk/models/Market

Retrieves details for a specific Kalshi project, including pricing information and participant keys.

```APIDOC
## GET /websites/kalshi

### Description
Retrieves details for a specific Kalshi project, including pricing information and participant keys.

### Method
GET

### Endpoint
/websites/kalshi

### Parameters
#### Query Parameters
- **primary_participant_key** (str) - Optional - The primary participant key for the project.
- **price_level_structure** (str) - Optional - Defines the price level structure for this market, including price ranges and tick sizes.
- **price_ranges** (List[PriceRange]) - Optional - Valid price ranges for orders on this market. See [PriceRange](https://docs.kalshi.com/python-sdk/models/PriceRange) for details.

### Response
#### Success Response (200)
- **primary_participant_key** (str) - The primary participant key.
- **price_level_structure** (str) - The price level structure.
- **price_ranges** (List[PriceRange]) - The valid price ranges for orders.

#### Response Example
{
  "primary_participant_key": "example_key",
  "price_level_structure": "default",
  "price_ranges": [
    {
      "min": 0,
      "max": 100
    }
  ]
}
```

--------------------------------

### GET /portfolio/settlements

Source: https://docs.kalshi.com/python-sdk/api/PortfolioApi

Retrieves the user's settlement history. This includes details about resolved trades.

```APIDOC
## GET /portfolio/settlements

### Description
Get Settlements

Endpoint for getting the settlements of a member.

### Method
GET

### Endpoint
/portfolio/settlements

### Parameters

This endpoint does not need any parameters.

### Request Example

```json
{}
```

### Response
#### Success Response (200)
- **settlements** (array) - A list of settlement objects.

#### Response Example

```json
{
  "settlements": [
    {
      "market": "ETH-2023-12-31",
      "quantity": 50,
      "payout": 2500000
    }
  ]
}
```
```

--------------------------------

### GET /forecast_percentiles_history

Source: https://docs.kalshi.com/changelog

Retrieves the historical percentile data for an event forecast.

```APIDOC
## GET /forecast_percentiles_history

### Description
Get percentile history of an event forecast.

### Method
GET

### Endpoint
/forecast_percentiles_history

### Query Parameters
- **event_id** (integer) - Required - The ID of the event.
- **start_ts** (integer) - Optional - The timestamp to start retrieving data from.
- **end_ts** (integer) - Optional - The timestamp to end retrieving data at.

### Response
#### Success Response (200)
- **history** (array) - An array of percentile history objects.
  - **ts** (integer) - The timestamp of the data point.
  - **percentiles** (object) - An object containing percentile values.
```

--------------------------------

### GET /milestones

Source: https://docs.kalshi.com/python-sdk/api/MilestonesApi

Retrieves a list of all milestones, with optional filtering by status and pagination.

```APIDOC
## GET /milestones

### Description
Get all milestones.

### Method
GET

### Endpoint
/milestones

### Parameters
#### Query Parameters
- **status** (str) - Optional - Filter by milestone status
- **limit** (int) - Optional - Number of items per page (minimum 1, maximum 500) (default to 100)

### Request Example
```python
# No request body for this endpoint.
```

### Response
#### Success Response (200)
- **GetMilestonesResponse** - A list of milestones matching the criteria.

#### Response Example
```json
{
  "example": "response body"
}
```
```

--------------------------------

### GET /portfolio/positions

Source: https://docs.kalshi.com/api-reference/portfolio/get-positions

Retrieves a list of user's current positions, with options to filter and paginate the results. This endpoint is useful for tracking current holdings and their values.

```APIDOC
## GET /portfolio/positions

### Description
Retrieves a list of user's current positions. You can filter positions based on specific fields like 'position' or 'total_traded' and paginate the results using cursor and limit parameters.

### Method
GET

### Endpoint
/portfolio/positions

### Parameters
#### Query Parameters
- **cursor** (string) - Optional - The Cursor represents a pointer to the next page of records in the pagination. Use the value returned from the previous response to get the next page.
- **limit** (integer) - Optional - Parameter to specify the number of results per page. Defaults to 100.
- **count_filter** (string) - Optional - Restricts the positions to those with any of following fields with non-zero values, as a comma separated list. Accepted values: position, total_traded.
- **ticker** (string) - Optional - Filter by market ticker.
- **event_ticker** (string) - Optional - Event ticker of desired positions. Multiple event tickers can be provided as a comma-separated list (maximum 10).

### Request Example
```json
{
  "example": "GET /portfolio/positions?limit=100&count_filter=position&ticker=BTC-USD"
}
```

### Response
#### Success Response (200)
- **cursor** (string) - A pointer to the next page of records. An empty value indicates no next page.
- **market_positions** (array) - List of market positions.
  - **ticker** (string) - Market ticker.
  - **total_traded** (number) - Total amount traded.
  - **total_traded_dollars** (number) - Total amount traded in dollars.
  - **position** (number) - Current position value.
- **event_positions** (array) - List of event positions.

#### Response Example
```json
{
  "example": {
    "cursor": "some_cursor_value",
    "market_positions": [
      {
        "ticker": "BTC-USD",
        "total_traded": 1000,
        "total_traded_dollars": 100000,
        "position": 500
      }
    ],
    "event_positions": []
  }
}
```
```

--------------------------------

### Enhanced Portfolio Balance Endpoint

Source: https://docs.kalshi.com/changelog

The `GET /portfolio/balance` endpoint has been updated to include a `portfolio_value` field, representing the total portfolio value.

```APIDOC
## GET /portfolio/balance

### Description
This endpoint now includes a `portfolio_value` field, which calculates the sum of available balance and the current market value of all positions.

### Method
GET

### Endpoint
/portfolio/balance

### Parameters
None

### Request Example
(Not applicable for GET requests without parameters)

### Response
#### Success Response (200)
- **portfolio_value** (string) - The total portfolio value in cents, including available balance and current market value of positions.
```

--------------------------------

### GET /websites/kalshi

Source: https://docs.kalshi.com/api-reference/events/get-events

Retrieves market data for a specific Kalshi market. This endpoint provides detailed information about a market, including its status, pricing, volume, and other relevant trading metrics.

```APIDOC
## GET /websites/kalshi

### Description
Retrieves market data for a specific Kalshi market. This endpoint provides detailed information about a market, including its status, pricing, volume, and other relevant trading metrics.

### Method
GET

### Endpoint
/websites/kalshi

### Parameters
#### Query Parameters
- **ticker** (string) - Required - The ticker symbol for the market.

### Request Example
```json
{
  "ticker": "example_ticker"
}
```

### Response
#### Success Response (200)
- **ticker** (string) - The ticker symbol for the market.
- **event_ticker** (string) - The event ticker associated with the market.
- **market_type** (string) - Identifies the type of market (`binary` or `scalar`).
- **yes_sub_title** (string) - Shortened title for the yes side of this market.
- **no_sub_title** (string) - Shortened title for the no side of this market.
- **created_time** (string) - The time when the market was created (ISO 8601 format).
- **open_time** (string) - The time when the market opened (ISO 8601 format).
- **close_time** (string) - The time when the market closed (ISO 8601 format).
- **expected_expiration_time** (string) - Time when this market is expected to expire (ISO 8601 format).
- **latest_expiration_time** (string) - Latest possible time for this market to expire (ISO 8601 format).
- **settlement_timer_seconds** (integer) - The amount of time after determination that the market settles.
- **status** (string) - The current status of the market (e.g., `initialized`, `active`, `closed`).
- **yes_bid_dollars** (object) - Price for the highest YES buy offer in dollars.
  - **value** (string) - The dollar value.
  - **display_value** (string) - The dollar value formatted for display.
- **yes_ask_dollars** (object) - Price for the lowest YES sell offer in dollars.
  - **value** (string) - The dollar value.
  - **display_value** (string) - The dollar value formatted for display.
- **no_bid_dollars** (object) - Price for the highest NO buy offer in dollars.
  - **value** (string) - The dollar value.
  - **display_value** (string) - The dollar value formatted for display.
- **no_ask_dollars** (object) - Price for the lowest NO sell offer in dollars.
  - **value** (string) - The dollar value.
  - **display_value** (string) - The dollar value formatted for display.
- **last_price_dollars** (object) - Price for the last traded YES contract in dollars.
  - **value** (string) - The dollar value.
  - **display_value** (string) - The dollar value formatted for display.
- **volume** (integer) - The total trading volume for the market.
- **volume_24h** (integer) - The trading volume in the last 24 hours.
- **result** (string) - The final result of the market (`yes`, `no`, or empty).
- **can_close_early** (boolean) - Indicates if the market can be closed early.
- **open_interest** (integer) - Number of contracts bought on this market, disregarding netting.
- **notional_value_dollars** (object) - The total value of a single contract at settlement in dollars.
  - **value** (string) - The dollar value.
  - **display_value** (string) - The dollar value formatted for display.
- **tick_size** (number) - The minimum price increment for the market.
- **price_level_structure** (object) - Defines the structure of price levels.
- **price_ranges** (array) - An array of possible price ranges for the market.

#### Response Example
```json
{
  "ticker": "TSLA24AUG23C100",
  "event_ticker": "TSLA",
  "market_type": "binary",
  "yes_sub_title": "Call",
  "no_sub_title": "Put",
  "created_time": "2023-08-15T10:00:00Z",
  "open_time": "2023-08-15T10:00:00Z",
  "close_time": "2023-08-16T10:00:00Z",
  "expected_expiration_time": "2023-08-16T10:00:00Z",
  "latest_expiration_time": "2023-08-16T10:00:00Z",
  "settlement_timer_seconds": 60,
  "status": "active",
  "yes_bid_dollars": {"value": "0.50", "display_value": "$0.50"},
  "yes_ask_dollars": {"value": "0.55", "display_value": "$0.55"},
  "no_bid_dollars": {"value": "0.45", "display_value": "$0.45"},
  "no_ask_dollars": {"value": "0.40", "display_value": "$0.40"},
  "last_price_dollars": {"value": "0.52", "display_value": "$0.52"},
  "volume": 1000,
  "volume_24h": 500,
  "result": "",
  "can_close_early": false,
  "open_interest": 2000,
  "notional_value_dollars": {"value": "100.00", "display_value": "$100.00"},
  "tick_size": 0.01,
  "price_level_structure": {"type": "cents"},
  "price_ranges": [{"min": 0, "max": 100}]
}
```
```

--------------------------------

### GET /structured_targets

Source: https://docs.kalshi.com/api-reference/structured-targets/get-structured-targets

Fetches a list of structured targets. This endpoint supports filtering by type and competition, and includes pagination parameters like page_size and cursor for efficient data retrieval.

```APIDOC
## GET /structured_targets

### Description
Retrieves a list of structured targets, which are specific events or entities on the Kalshi exchange. Supports filtering and pagination.

### Method
GET

### Endpoint
/structured_targets

### Parameters
#### Query Parameters
- **type** (string) - Optional - Filter by structured target type.
- **competition** (string) - Optional - Filter by competition.
- **page_size** (integer) - Optional - Number of items per page (min 1, max 2000, default 100).
- **cursor** (string) - Optional - Pagination cursor for the next page.

### Request Example
```json
{
  "example": "GET /structured_targets?type=election&competition=us_presidential_2024&page_size=50"
}
```

### Response
#### Success Response (200)
- **structured_targets** (array) - An array of structured target objects.
  - **id** (string) - Unique identifier for the structured target.
  - **name** (string) - Name of the structured target.
  - **type** (string) - Type of the structured target.
  - **details** (object) - Additional details about the structured target.
  - **source_id** (string) - External source identifier for the structured target.
  - **last_updated_ts** (string) - Timestamp when this structured target was last updated.
- **cursor** (string) - Pagination cursor for the next page. Empty if there are no more results.

#### Response Example
```json
{
  "example": {
    "structured_targets": [
      {
        "id": "st_abc123",
        "name": "US Presidential Election 2024 - Biden",
        "type": "election",
        "details": {
          "candidate": "Joe Biden",
          "party": "Democrat"
        },
        "source_id": "USPRES2024BIDEN",
        "last_updated_ts": "2023-10-27T10:00:00Z"
      }
    ],
    "cursor": "next_page_cursor_12345"
  }
}
```

#### Error Responses
- **401** - Unauthorized
- **500** - Internal server error
```

--------------------------------

### Get API Keys OpenAPI Specification

Source: https://docs.kalshi.com/api-reference/api-keys/get-api-keys

OpenAPI 3.0.0 specification for the GET /api_keys endpoint. This endpoint allows users to retrieve all API keys associated with their authenticated account. It requires specific Kalshi API authentication headers and returns a list of API keys, each with an ID, name, and associated scopes ('read' or 'write').

```yaml
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 3.3.0
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://api.elections.kalshi.com/trade-api/v2
    description: Production server
security: []
tags:
  - name: api-keys
    description: API key management endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: communications
    description: Request-for-quote (RFQ) endpoints
  - name: multivariate
    description: Multivariate event collection endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: live-data
    description: Live data endpoints
  - name: markets
    description: Market data endpoints
  - name: milestone
    description: Milestone endpoints
  - name: search
    description: Search and filtering endpoints
  - name: incentive-programs
    description: Incentive program endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: events
    description: Event endpoints
  - name: structured-targets
    description: Structured targets endpoints
paths:
  /api_keys:
    get:
      tags:
        - api-keys
      summary: Get API Keys
      description: ' Endpoint for retrieving all API keys associated with the authenticated user.  API keys allow programmatic access to the platform without requiring username/password authentication. Each key has a unique identifier and name.'
      operationId: GetApiKeys
      responses:
        '200':
          description: List of API keys retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetApiKeysResponse'
        '401':
          description: Unauthorized
        '500':
          description: Internal server error
      security:
        - kalshiAccessKey: []
          kalshiAccessSignature: []
          kalshiAccessTimestamp: []
components:
  schemas:
    GetApiKeysResponse:
      type: object
      required:
        - api_keys
      properties:
        api_keys:
          type: array
          description: List of all API keys associated with the user
          items:
            $ref: '#/components/schemas/ApiKey'
    ApiKey:
      type: object
      required:
        - api_key_id
        - name
        - scopes
      properties:
        api_key_id:
          type: string
          description: Unique identifier for the API key
        name:
          type: string
          description: User-provided name for the API key
        scopes:
          type: array
          description: >-
            List of scopes granted to this API key. Valid values are 'read' and
            'write'.
          items:
            type: string
  securitySchemes:
    kalshiAccessKey:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-KEY
      description: Your API key ID
    kalshiAccessSignature:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-SIGNATURE
      description: RSA-PSS signature of the request
    kalshiAccessTimestamp:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-TIMESTAMP
      description: Request timestamp in milliseconds

```

--------------------------------

### API Classes Overview

Source: https://docs.kalshi.com/python-sdk

An overview of the different API classes available in the Kalshi Python SDK, categorized by their functionality.

```APIDOC
## API Classes

### Description
An overview of the different API classes available in the Kalshi Python SDK, categorized by their functionality.

### Classes
*   **ApiKeysApi**: API key management
*   **CommunicationsApi**: Quotes and RFQs
*   **EventsApi**: Event operations
*   **ExchangeApi**: Exchange status and info
*   **MarketsApi**: Market data and trading
*   **MilestonesApi**: Milestone operations
*   **MultivariateCollectionsApi**: Multivariate collections
*   **PortfolioApi**: Portfolio and order management
*   **SeriesApi**: Series operations
*   **StructuredTargetsApi**: Structured targets
```

--------------------------------

### Get Orders by Status

Source: https://docs.kalshi.com/api-reference/orders/get-orders

Fetches orders and allows filtering by status. Supported statuses include 'resting', 'canceled', and 'executed'.

```APIDOC
## GET /websites/kalshi/orders

### Description
Retrieves a list of orders from the Kalshi platform. The response can be filtered to include only orders with a specific status.

### Method
GET

### Endpoint
/websites/kalshi/orders

### Parameters
#### Query Parameters
- **status** (string) - Optional - Restricts the response to orders that have a certain status: 'resting', 'canceled', or 'executed'.

### Request Example
(No request body for GET requests)

### Response
#### Success Response (200)
- **orders** (array) - A list of order objects.
  - **id** (string) - The unique identifier for the order.
  - **status** (string) - The current status of the order ('resting', 'canceled', 'executed').
  - **market_id** (string) - The identifier of the market the order belongs to.
  - **price** (string) - The price of the order.
  - **quantity** (string) - The quantity of the order.
  - **side** (string) - The side of the order ('buy' or 'sell').
  - **order_type** (string) - The type of the order ('limit' or 'market').
  - **created_at** (string) - The timestamp when the order was created.
  - **filled_at** (string) - The timestamp when the order was filled.

#### Response Example
{
  "orders": [
    {
      "id": "ord_12345",
      "status": "executed",
      "market_id": "mkt_abcde",
      "price": "0.75",
      "quantity": "10",
      "side": "buy",
      "order_type": "limit",
      "created_at": "2023-10-27T10:00:00Z",
      "filled_at": "2023-10-27T10:05:00Z"
    }
  ]
}

### Error Handling
- **400 Bad Request**: Invalid status parameter provided.
- **404 Not Found**: No orders found matching the criteria.
```

--------------------------------

### Example Market Settlement Report (FIX)

Source: https://docs.kalshi.com/fix/market-settlement

This FIX message demonstrates a market settlement report where the market was resolved as 'Yes'. It includes details like the settlement ID, market symbol, clearing date, market result, party information, collateral changes, and fee structure. The example is intended for integration testing and understanding the message format.

```fix
// Market settled as "Yes"
8=FIXT.1.1|35=UMS|
20105=settle-123|55=HIGHNY-23DEC31|715=20231231|
20107=Yes|
20108=1|
  20109=user-456|20110=24|
  704=100|705=0|
  1703=1|
    1704=10000|1705=1|
  136=1|
    137=0.00|138=USD|139=4|891=0|
893=Y|

```

--------------------------------

### GET /websites/kalshi

Source: https://docs.kalshi.com/typescript-sdk/api/PortfolioApi

Retrieves a list of settlements based on the provided filter parameters. Supports pagination and filtering by ticker, event ticker, and timestamps.

```APIDOC
## GET /websites/kalshi

### Description
Retrieves a list of settlements. This endpoint supports various query parameters for filtering and pagination.

### Method
GET

### Endpoint
/websites/kalshi

### Parameters
#### Query Parameters
- **limit** (number) - Optional - Number of results per page. Defaults to 100. Maximum value is 200.
- **cursor** (string) - Optional - Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page.
- **ticker** (string) - Optional - Filter by market ticker.
- **eventTicker** (string) - Optional - Event ticker of desired positions. Multiple event tickers can be provided as a comma-separated list (maximum 10).
- **minTs** (number) - Optional - Filter items after this Unix timestamp.
- **maxTs** (number) - Optional - Filter items before this Unix timestamp.

### Request Example
```json
{
  "limit": 100,
  "cursor": "some_cursor_string",
  "ticker": "BTC-USD",
  "eventTicker": "",
  "minTs": 1678886400,
  "maxTs": 1678972800
}
```

### Response
#### Success Response (200)
- **GetSettlementsResponse** (object) - Details of the settlement data.

#### Response Example
```json
{
  "results": [
    {
      "ticker": "BTC-20231215",
      "event": "BTC-20231215",
      "underlying": "BTC",
      "price": 30000,
      "volume": 100,
      "deadline": 1702713600,
      "status": "resolved",
      "resolution": "higher",
      "is_trading_open": true
    }
  ],
  "cursor": "next_cursor_string",
  "has_more": true
}
```

### Error Handling
- **400**: Bad request - invalid input.
- **401**: Unauthorized - authentication required.
- **500**: Internal server error.
```

--------------------------------

### Paginate Through Markets - JavaScript

Source: https://docs.kalshi.com/getting_started/pagination

Fetches all markets for a given series ticker by handling API pagination using async/await and the fetch API. It iteratively retrieves data, aggregates markets, and advances the cursor until all pages are processed. No external libraries are strictly required, relying on built-in browser/Node.js fetch capabilities.

```javascript
async function getAllMarkets(seriesTicker) {
  const allMarkets = [];
  let cursor = null;
  const baseUrl = 'https://api.elections.kalshi.com/trade-api/v2/markets';

  while (true) {
    // Build URL with cursor if we have one
    let url = `${baseUrl}?series_ticker=${seriesTicker}&limit=100`;
    if (cursor) {
      url += `&cursor=${cursor}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    // Add markets from this page
    allMarkets.push(...data.markets);

    // Check if there are more pages
    cursor = data.cursor;
    if (!cursor) {
      break;
    }

    console.log(`Fetched ${data.markets.length} markets, total: ${allMarkets.length}`);
  }

  return allMarkets;
}

// Example usage
getAllMarkets('KXHIGHNY').then(markets => {
  console.log(`Total markets found: ${markets.length}`);
});
```

--------------------------------

### Instantiate and Convert LookupBundleResponse (Python)

Source: https://docs.kalshi.com/python-sdk/models/LookupBundleResponse

Demonstrates how to create an instance of the LookupBundleResponse model, convert it to a JSON string, and create it back from a JSON string. It also shows conversion to and from a Python dictionary. This model is part of the Kalshi Python SDK.

```python
from kalshi_python.models.lookup_bundle_response import LookupBundleResponse

# Create an instance with example data
lookup_bundle_response_instance = LookupBundleResponse(
    # Add required fields here
)

# Convert to JSON string
json_str = lookup_bundle_response_instance.to_json()
print(json_str)

# Create from JSON string
lookup_bundle_response_from_json = LookupBundleResponse.from_json(json_str)

# Convert to dict
lookup_bundle_response_dict = lookup_bundle_response_instance.to_dict()

# Create from dict
lookup_bundle_response_from_dict = LookupBundleResponse.from_dict(lookup_bundle_response_dict)
```

--------------------------------

### Get Quotes API

Source: https://docs.kalshi.com/python-sdk/api/CommunicationsApi

Endpoint for retrieving a list of quotes, with options for filtering.

```APIDOC
## GET /get_quotes

### Description
Endpoint for getting quotes.

### Method
GET

### Endpoint
/get_quotes

### Parameters
#### Query Parameters
- **cursor** (str) - Optional - Cursor for pagination.
- **event_ticker** (str) - Optional - Filter by event ticker.
- **market_ticker** (str) - Optional - Filter by market ticker.
- **limit** (int) - Optional - Maximum number of quotes to return.
- **status** (str) - Optional - Filter by quote status.
- **quote_creator_user_id** (str) - Optional - Filter by the user ID of the quote creator.
- **rfq_creator_user_id** (str) - Optional - Filter by the user ID of the RFQ creator.
- **rfq_creator_subtrader_id** (str) - Optional - Filter by the subtrader ID of the RFQ creator.
- **rfq_id** (str) - Optional - Filter by RFQ ID.

### Response
#### Success Response (200)
- **GetQuotesResponse** (object) - Contains a list of quotes matching the criteria.
```

--------------------------------

### Get Milestone by ID

Source: https://docs.kalshi.com/api-reference/milestone/get-milestone

Retrieves data for a specific milestone using its unique identifier.

```APIDOC
## GET /milestones/{milestone_id}

### Description
Endpoint for getting data about a specific milestone by its ID.

### Method
GET

### Endpoint
/milestones/{milestone_id}

### Parameters
#### Path Parameters
- **milestone_id** (string) - Required - Milestone ID

### Request Example
```json
{
  "example": "GET /v2/milestones/some_milestone_id"
}
```

### Response
#### Success Response (200)
- **milestone** (object) - The milestone data.
  - **id** (string) - Unique identifier for the milestone.
  - **category** (string) - Category of the milestone.
  - **type** (string) - Type of the milestone.
  - **start_date** (string) - Start date of the milestone.
  - **end_date** (string) - End date of the milestone, if any.
  - **related_event_tickers** (array) - List of event tickers related to this milestone.
  - **title** (string) - Title of the milestone.
  - **notification_message** (string) - Notification message for the milestone.
  - **source_id** (string) - Source id of milestone if available.
  - **details** (object) - Additional details about the milestone.
  - **primary_event_tickers** (array) - List of event tickers directly related to the outcome of this milestone.
  - **last_updated_ts** (string) - Last time this structured target was updated.

#### Response Example
```json
{
  "milestone": {
    "id": "some_milestone_id",
    "category": "election",
    "type": "event",
    "start_date": "2024-11-05T20:00:00Z",
    "end_date": null,
    "related_event_tickers": ["election_nov_2024"],
    "title": "US Presidential Election 2024",
    "notification_message": "The 2024 US Presidential Election date.",
    "source_id": null,
    "details": {},
    "primary_event_tickers": ["election_nov_2024"],
    "last_updated_ts": "2023-10-27T10:00:00Z"
  }
}
```

#### Error Responses
- **400**: Bad Request
- **401**: Unauthorized
- **404**: Not Found
- **500**: Internal Server Error
```

--------------------------------

### GET /candlesticks

Source: https://docs.kalshi.com/changelog/index

Retrieves candlestick data for all markets associated with an event. Supports pagination for large datasets.

```APIDOC
## GET /candlesticks

### Description
Get candlesticks for all markets associated with an event. If the # of candlesticks exceeds 5000, paginate the results and return an adjustedEndTs which should be used as the start_ts for your next request.

### Method
GET

### Endpoint
/candlesticks

### Query Parameters
- **event_id** (integer) - Required - The ID of the event.
- **start_ts** (integer) - Optional - The start timestamp for the candlestick data.
- **end_ts** (integer) - Optional - The end timestamp for the candlestick data.

### Response
#### Success Response (200)
- **candlesticks** (array) - An array of candlestick objects.
  - **ts** (integer) - Timestamp of the candlestick.
  - **open** (integer) - Opening price.
  - **high** (integer) - Highest price.
  - **low** (integer) - Lowest price.
  - **close** (integer) - Closing price.
  - **volume** (integer) - Trading volume.
- **adjusted_end_ts** (integer) - The end timestamp for the next page of results, if pagination is used.
```

--------------------------------

### Get Quote by ID

Source: https://docs.kalshi.com/api-reference/communications/get-quote

Retrieves details for a specific quote using its unique identifier.

```APIDOC
## GET /communications/quotes/{quote_id}

### Description
Endpoint for retrieving the details of a specific quote.

### Method
GET

### Endpoint
/communications/quotes/{quote_id}

### Parameters
#### Path Parameters
- **quote_id** (string) - Required - The unique identifier of the quote.

### Response
#### Success Response (200)
- **quote** (object) - The details of the requested quote.
  - **id** (string) - Unique identifier for the quote
  - **rfq_id** (string) - ID of the RFQ this quote is responding to
  - **creator_id** (string) - Public communications ID of the quote creator
  - **rfq_creator_id** (string) - Public communications ID of the RFQ creator
  - **market_ticker** (string) - The ticker of the market this quote is for
  - **contracts** (integer) - Number of contracts in the quote
  - **yes_bid** (integer) - Bid price for YES contracts, in cents
  - **no_bid** (integer) - Bid price for NO contracts, in cents
  - **yes_bid_dollars** (object) - Bid price for YES contracts, in dollars
  - **no_bid_dollars** (object) - Bid price for NO contracts, in dollars
  - **created_ts** (string) - Timestamp when the quote was created
  - **updated_ts** (string) - Timestamp when the quote was last updated
  - **status** (string) - Current status of the quote (open, accepted, confirmed, executed, cancelled)
  - **accepted_side** (string) - The side that was accepted (yes or no)
  - **accepted_ts** (string) - Timestamp when the quote was accepted
  - **confirmed_ts** (string) - Timestamp when the quote was confirmed

#### Error Response
- **401**: Unauthorized
- **404**: Not Found
- **500**: Internal Server Error

### Response Example
```json
{
  "quote": {
    "id": "q_abcdef1234567890",
    "rfq_id": "rfq_abcdef1234567890",
    "creator_id": "comm_user123",
    "rfq_creator_id": "comm_user456",
    "market_ticker": "YES-GOV-2024",
    "contracts": 10,
    "yes_bid": 5000,
    "no_bid": 4000,
    "yes_bid_dollars": {
      "integer": 50,
      "fraction": 0
    },
    "no_bid_dollars": {
      "integer": 40,
      "fraction": 0
    },
    "created_ts": "2023-10-27T10:00:00Z",
    "updated_ts": "2023-10-27T10:05:00Z",
    "status": "open",
    "accepted_side": null,
    "accepted_ts": null,
    "confirmed_ts": null
  }
}
```
```

--------------------------------

### Batch Order Creation - Post-Only Cross Errors

Source: https://docs.kalshi.com/changelog

Batch order creation now provides detailed error messages for post-only orders that cross the market, instead of just a 'canceled' status.

```APIDOC
## POST /orders/batch

### Description
Batch order creation has been improved to return specific error details when post-only orders cross the market. Previously, these orders would simply be marked as 'canceled'. Now, detailed error codes and messages are provided for better debugging and consistency with single order creation.

### Method
POST

### Endpoint
/orders/batch

### Request Body
* (object) - Array of order objects to be created in batch.

### Response
#### Error Response
- **error_code** (string) - Typically "invalid order".
- **error_details** (string) - Indicates "post only cross" when a post-only order crosses the market.
```

--------------------------------

### GET /communications/id

Source: https://docs.kalshi.com/api-reference/communications/get-communications-id

Retrieves the public communications ID for the currently authenticated user.

```APIDOC
## GET /communications/id

### Description
Endpoint for getting the communications ID of the logged-in user.

### Method
GET

### Endpoint
/communications/id

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **communications_id** (string) - A public communications ID which is used to identify the user

#### Response Example
```json
{
  "communications_id": "a1b2c3d4-e5f6-7890-1234-567890abcdef"
}
```

#### Error Responses
- **401** - Unauthorized - authentication required
- **500** - Internal server error
```

--------------------------------

### GET /websites/kalshi/events

Source: https://docs.kalshi.com/python-sdk/api/EventsApi

Retrieves a list of events, with options to filter by status, series ticker, and minimum close timestamp.

```APIDOC
## GET /websites/kalshi/events

### Description
Retrieves a list of events, with options to filter by status, series ticker, and minimum close timestamp. Filter by event status. Possible values: 'open', 'closed', 'settled'. Leave empty to return events with any status.

### Method
GET

### Endpoint
/websites/kalshi/events

### Parameters
#### Query Parameters
- **limit** (int) - Optional - The maximum number of events to return.
- **cursor** (str) - Optional - A cursor for pagination, to retrieve the next page of results.
- **with_nested_markets** (bool) - Optional - Whether to include nested markets in the response.
- **with_milestones** (bool) - Optional - Whether to include milestones in the response.
- **status** (str) - Optional - Filter by event status. Possible values: 'open', 'closed', 'settled'.
- **series_ticker** (str) - Optional - Filter by series ticker.
- **min_close_ts** (int) - Optional - Minimum close timestamp for the events.
```

--------------------------------

### POST /portfolio/orders/batched

Source: https://docs.kalshi.com/changelog/index

Allows users to create multiple orders in a single request. This endpoint is available in the demo environment for Basic tier users for testing purposes.

```APIDOC
## POST /portfolio/orders/batched

### Description
Creates multiple orders in a single request. This endpoint is now available to Basic tier users in the demo environment for testing.

### Method
POST

### Endpoint
/portfolio/orders/batched

### Parameters
#### Request Body
- **orders** (array) - Required - An array of order objects to be created.

### Request Example
```json
{
  "orders": [
    {
      "ticker": "sample_ticker",
      "type": "buy",
      "price": 100,
      "size": 5
    }
  ]
}
```

### Response
#### Success Response (200)
- **result** (object) - Details of the created orders.
- **errors** (array) - Any errors encountered during batch order creation.

#### Response Example
```json
{
  "result": {
    "order_ids": ["12345", "67890"]
  },
  "errors": []
}
```
```

--------------------------------

### Get Order Queue Positions OpenAPI Spec

Source: https://docs.kalshi.com/api-reference/orders/get-queue-positions-for-orders

This OpenAPI specification defines the GET /portfolio/orders/queue_positions endpoint. It allows users to retrieve queue positions for all resting orders, filtered by market tickers or event tickers. The response includes details about each order's position in the queue based on price-time priority. Authentication is handled via Kalshi API keys, signatures, and timestamps.

```yaml
openapi: 3.0.0
info:
  title: Kalshi Trade API Manual Endpoints
  version: 3.3.0
  description: >-
    Manually defined OpenAPI spec for endpoints being migrated to spec-first
    approach
servers:
  - url: https://api.elections.kalshi.com/trade-api/v2
    description: Production server
security: []
tags:
  - name: api-keys
    description: API key management endpoints
  - name: orders
    description: Order management endpoints
  - name: order-groups
    description: Order group management endpoints
  - name: portfolio
    description: Portfolio and balance information endpoints
  - name: communications
    description: Request-for-quote (RFQ) endpoints
  - name: multivariate
    description: Multivariate event collection endpoints
  - name: exchange
    description: Exchange status and information endpoints
  - name: live-data
    description: Live data endpoints
  - name: markets
    description: Market data endpoints
  - name: milestone
    description: Milestone endpoints
  - name: search
    description: Search and filtering endpoints
  - name: incentive-programs
    description: Incentive program endpoints
  - name: fcm
    description: FCM member specific endpoints
  - name: events
    description: Event endpoints
  - name: structured-targets
    description: Structured targets endpoints
paths:
  /portfolio/orders/queue_positions:
    get:
      tags:
        - orders
      summary: Get Queue Positions for Orders
      description: ' Endpoint for getting queue positions for all resting orders. Queue position represents the number of contracts that need to be matched before an order receives a partial or full match, determined using price-time priority.'
      operationId: GetOrderQueuePositions
      parameters:
        - name: market_tickers
          in: query
          description: Comma-separated list of market tickers to filter by
          schema:
            type: string
        - name: event_ticker
          in: query
          description: Event ticker to filter by
          schema:
            type: string
      responses:
        '200':
          description: Queue positions retrieved successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/GetOrderQueuePositionsResponse'
        '400':
          $ref: '#/components/responses/BadRequestError'
        '401':
          $ref: '#/components/responses/UnauthorizedError'
        '500':
          $ref: '#/components/responses/InternalServerError'
      security:
        - kalshiAccessKey: []
          kalshiAccessSignature: []
          kalshiAccessTimestamp: []
components:
  schemas:
    GetOrderQueuePositionsResponse:
      type: object
      required:
        - queue_positions
      properties:
        queue_positions:
          type: array
          description: Queue positions for all matching orders
          items:
            $ref: '#/components/schemas/OrderQueuePosition'
    OrderQueuePosition:
      type: object
      required:
        - order_id
        - market_ticker
        - queue_position
      properties:
        order_id:
          type: string
          description: The order ID
        market_ticker:
          type: string
          description: The market ticker
        queue_position:
          type: integer
          format: int32
          description: The position of the order in the queue
    ErrorResponse:
      type: object
      properties:
        code:
          type: string
          description: Error code
        message:
          type: string
          description: Human-readable error message
        details:
          type: string
          description: Additional details about the error, if available
        service:
          type: string
          description: The name of the service that generated the error
  responses:
    BadRequestError:
      description: Bad request - invalid input
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    UnauthorizedError:
      description: Unauthorized - authentication required
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
    InternalServerError:
      description: Internal server error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/ErrorResponse'
  securitySchemes:
    kalshiAccessKey:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-KEY
      description: Your API key ID
    kalshiAccessSignature:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-SIGNATURE
      description: RSA-PSS signature of the request
    kalshiAccessTimestamp:
      type: apiKey
      in: header
      name: KALSHI-ACCESS-TIMESTAMP
      description: Request timestamp in milliseconds

```

--------------------------------

### Subpenny Support in WS for RFQs and Quotes

Source: https://docs.kalshi.com/changelog

Subpenny pricing is now supported in WebSocket messages for RFQs and Quotes. New fields have been added to accommodate dollar-normalized prices.

```APIDOC
## WebSocket Messages (RFQs and Quotes)

### Description
New fields have been added to RFQ and quote WebSocket messages to enable subpenny pricing through dollar-normalized price fields.

### Method
WebSocket

### Endpoint
(Refer to WebSocket Documentation)

### Parameters
Refer to WebSocket Documentation for specific message parameters.

### Request Example
(Refer to WebSocket Documentation)

### Response
#### Success Response
- **Dollar-normalized price fields** (string) - Fields supporting subpenny pricing for RFQs and quotes.
```

--------------------------------

### GET /structured_targets/{structured_target_id}

Source: https://docs.kalshi.com/api-reference/structured-targets/get-structured-target

Retrieve data for a specific structured target using its unique identifier.

```APIDOC
## GET /structured_targets/{structured_target_id}

### Description
Endpoint for getting data about a specific structured target by its ID.

### Method
GET

### Endpoint
/structured_targets/{structured_target_id}

### Parameters
#### Path Parameters
- **structured_target_id** (string) - Required - Structured target ID

### Request Example
```json
{
  "example": ""
}
```

### Response
#### Success Response (200)
- **structured_target** (object) - Contains details of the structured target.
  - **id** (string) - Unique identifier for the structured target.
  - **name** (string) - Name of the structured target.
  - **type** (string) - Type of the structured target.
  - **details** (object) - Additional details about the structured target. Contains flexible JSON data specific to the target type.
  - **source_id** (string) - External source identifier for the structured target, if available (e.g., third-party data provider ID).
  - **last_updated_ts** (string) - Timestamp when this structured target was last updated.

#### Response Example
```json
{
  "structured_target": {
    "id": "example_id",
    "name": "example_name",
    "type": "example_type",
    "details": {},
    "source_id": "external_source_123",
    "last_updated_ts": "2023-10-27T10:00:00Z"
  }
}
```
```

--------------------------------

### Get RFQs

Source: https://docs.kalshi.com/python-sdk/models/GetRFQsResponse

Retrieves a list of RFQs based on specified criteria. Supports pagination to fetch results in chunks.

```APIDOC
## GET /websites/kalshi/rfqs

### Description
Retrieves a list of RFQs matching the query criteria. This endpoint supports pagination through the use of a cursor.

### Method
GET

### Endpoint
/websites/kalshi/rfqs

### Query Parameters
- **limit** (int) - Optional - The maximum number of RFQs to return.
- **cursor** (str) - Optional - A cursor provided by a previous response to fetch the next page of results.

### Response
#### Success Response (200)
- **rfqs** (List[RFQ]) - List of RFQs matching the query criteria.
- **cursor** (str) - Cursor for pagination to get the next page of results (optional).

#### Response Example
```json
{
  "rfqs": [
    {
      "id": "rfq_123",
      "symbol": "BTC-20240101-10000-C",
      "venue": "CF",
      "created_timestamp": "2023-10-27T10:00:00Z",
      "expiration_timestamp": "2024-01-01T10:00:00Z",
      "strike_price": "10000",
      "contract_type": "call",
      "underlying_asset": "BTC"
    }
  ],
  "cursor": "next_page_cursor_string"
}
```
```

--------------------------------

### Get Trades API

Source: https://docs.kalshi.com/openapi

Retrieves a list of trades executed on the platform. Supports pagination.

```APIDOC
## GET /websites/kalshi/trades

### Description
Retrieves a list of trades that have occurred on the platform. This endpoint is useful for analyzing trading activity and supports pagination.

### Method
GET

### Endpoint
/websites/kalshi/trades

### Query Parameters
- **limit** (integer) - Optional - The maximum number of trades to return per page.
- **cursor** (string) - Optional - A cursor for fetching the next page of results. Obtained from the `cursor` field in the response of a previous request.
- **market_ticker** (string) - Optional - Filters trades by a specific market ticker.

### Response
#### Success Response (200)
- **trades** (array) - A list of Trade objects.
- **cursor** (string) - A cursor for pagination to get the next page of results.

#### Response Example
```json
{
  "trades": [
    {
      "trade_id": "trade_abc",
      "ticker": "TSLA.2024-06-28",
      "price": 50,
      "count": 10,
      "yes_price": 5000,
      "no_price": 5000,
      "yes_price_dollars": {
        "integer": 50,
        "fraction": 0
      },
      "no_price_dollars": {
        "integer": 50,
        "fraction": 0
      },
      "taker_side": "yes",
      "created_time": "2024-06-20T10:30:00Z"
    }
  ],
  "cursor": "some_cursor_string"
}
```
```

--------------------------------

### GET /markets

Source: https://docs.kalshi.com/python-sdk/api/MarketsApi

Retrieves a paginated list of markets on Kalshi. Supports filtering by various criteria such as event ticker, series ticker, closing time, status, and specific market tickers.

```APIDOC
## GET /markets

### Description
Lists and discovers markets on Kalshi. Markets represent specific binary outcomes within events, allowing users to trade on yes/no positions. This endpoint is paginated and supports extensive filtering options.

### Method
GET

### Endpoint
/markets

### Parameters
#### Query Parameters
- **limit** (int) - Optional - Number of results per page. Defaults to 100. Maximum value is 1000.
- **cursor** (str) - Optional - Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page.
- **event_ticker** (str) - Optional - Filter by event ticker.
- **series_ticker** (str) - Optional - Filter by series ticker.
- **max_close_ts** (int) - Optional - Filter markets that close before this Unix timestamp.
- **min_close_ts** (int) - Optional - Filter markets that close after this Unix timestamp.
- **status** (str) - Optional - Filter by market status. Comma-separated list. Possible values are 'initialized', 'open', 'closed', 'settled', 'determined'. Note that the API accepts 'open' for filtering but returns 'active' in the response. Leave empty to return markets with any status.
- **tickers** (str) - Optional - Filter by specific market tickers. Comma-separated list of market tickers to retrieve.

### Request Example
```python
import kalshi_python
from kalshi_python.models.get_markets_response import GetMarketsResponse
from kalshi_python.rest import ApiException
from pprint import pprint

configuration = kalshi_python.Configuration(
    host = "https://api.elections.kalshi.com/trade-api/v2"
)

with open('path/to/private_key.pem', 'r') as f:
    private_key = f.read()

configuration.api_key_id = "your-api-key-id"
configuration.private_key_pem = private_key

client = kalshi_python.KalshiClient(configuration)

limit = 100
cursor = 'cursor_example'
event_ticker = 'event_ticker_example'
series_ticker = 'series_ticker_example'
max_close_ts = 56
min_close_ts = 56
status = 'status_example'
tickers = 'tickers_example'

try:
    api_response = client.get_markets(limit=limit, cursor=cursor, event_ticker=event_ticker, series_ticker=series_ticker, max_close_ts=max_close_ts, min_close_ts=min_close_ts, status=status, tickers=tickers)
    pprint(api_response)
except Exception as e:
    print("Exception when calling MarketsApi->get_markets: %s\n" % e)
```

### Response
#### Success Response (200)
- **markets** (array) - A list of market objects.
- **cursor** (str) - A cursor for paginating through the results. Empty if no more pages are available.

#### Response Example
```json
{
  "markets": [
    {
      "id": "market_id_1",
      "event_ticker": "event_ticker_1",
      "series_ticker": "series_ticker_1",
      "ticker": "market_ticker_1",
      "short_description": "Short description of market 1",
      "long_description": "Long description of market 1",
      "creator": "creator_address",
      "creation_date": "2023-01-01T12:00:00Z",
      "expiration_date": "2023-12-31T12:00:00Z",
      "last_price": 0.5,
      "volume": 1000,
      "is_valid": true,
      "status": "open",
      "market_type": "binary",
      "yes_price": 0.6,
      "no_price": 0.4,
      "yes_volume": 600,
      "no_volume": 400,
      "close_time": "2023-12-31T12:00:00Z"
    }
  ],
  "cursor": "next_cursor_value"
}
```
```

--------------------------------

### Market Structure and Pricing

Source: https://docs.kalshi.com/api-reference/events/get-event

This section details the structure of a Kalshi market, including its various components like strike values, rules, and pricing configurations.

```APIDOC
## Market Object Details

### Description
Provides a comprehensive overview of a market's attributes, including settlement rules, pricing structures, and associated events.

### Properties

- **max_strike_value** (number) - nullable - Maximum expiration value that leads to a YES settlement.
- **functional_strike** (string) - nullable - Mapping from expiration values to settlement values.
- **custom_strike** (object) - nullable - Expiration value for each target that leads to a YES settlement.
- **rules_primary** (string) - A plain language description of the most important market terms.
- **rules_secondary** (string) - A plain language description of secondary market terms.
- **mve_collection_ticker** (string) - The ticker of the multivariate event collection.
- **mve_selected_legs** (array) - Contains details of selected legs within a multivariate event.
  - **items** (object) - Reference to MveSelectedLeg schema.
- **primary_participant_key** (string) - nullable.
- **price_level_structure** (string) - Price level structure for this market, defining price ranges and tick sizes.
- **price_ranges** (array) - Valid price ranges for orders on this market.
  - **items** (object) - Reference to PriceRange schema.

### Type Definitions

#### FixedPointDollars

- **type**: string
- **description**: US dollar amount as a fixed-point decimal string with exactly 4 decimal places.
- **example**: '0.5600'

#### MveSelectedLeg

- **type**: object
- **properties**:
  - **event_ticker** (string) - Unique identifier for the selected event.
  - **market_ticker** (string) - Unique identifier for the selected market.
  - **side** (string) - The side of the selected market.

#### PriceRange

- **type**: object
- **required**: [start, end, step]
- **properties**:
  - **start** (string) - Starting price for this range in dollars.
  - **end** (string) - Ending price for this range in dollars.
  - **step** (string) - Price step/tick size for this range in dollars.

```

--------------------------------

### GET /portfolio/orders

Source: https://docs.kalshi.com/changelog/index

Retrieves user's orders. The `event_ticker` parameter now supports comma-separated values to filter orders across multiple events.

```APIDOC
## GET /portfolio/orders

### Description
Retrieves a list of the user's orders. The `event_ticker` query parameter now accepts a comma-separated list of tickers to filter orders across multiple events.

### Method
GET

### Endpoint
/portfolio/orders

### Query Parameters
- **event_ticker** (string) - Optional - A single event ticker or a comma-separated list of event tickers (e.g., `EVENT1,EVENT2,EVENT3`) to filter orders.

### Response
#### Success Response (200)
- **orders** (array) - A list of order objects.

### Response Example
```json
{
  "orders": [
    {
      "id": "ord_12345",
      "market_id": "mk_abc123",
      "event_ticker": "EVENT1",
      "quantity": 10,
      "price_cents": 5000,
      "status": "open"
    },
    {
      "id": "ord_67890",
      "market_id": "mk_xyz789",
      "event_ticker": "EVENT2",
      "quantity": 5,
      "price_cents": 6000,
      "status": "filled"
    }
  ]
}
```
```

--------------------------------

### GET /series

Source: https://docs.kalshi.com/api-reference/market/get-series-list

Retrieves a list of series, which are templates for recurring events. This endpoint allows filtering by category and tags, and can include product metadata.

```APIDOC
## GET /series

### Description
Endpoint for getting data about multiple series with specified filters. A series represents a template for recurring events that follow the same format and rules. This endpoint allows you to browse and discover available series templates by category.

### Method
GET

### Endpoint
/series

### Parameters
#### Query Parameters
- **category** (string) - Optional - Allows filtering series by category.
- **tags** (string) - Optional - Allows filtering series by tags.
- **include_product_metadata** (boolean) - Optional - Defaults to false. If true, includes product metadata in the response.

### Response
#### Success Response (200)
- **series** (array) - An array of series objects, each containing details like ticker, frequency, title, category, tags, settlement sources, and contract URLs.

#### Response Example
{
  "series": [
    {
      "ticker": "sample-series-ticker",
      "frequency": "weekly",
      "title": "Sample Series Title",
      "category": "Sample Category",
      "tags": ["tag1", "tag2"],
      "settlement_sources": [
        {
          "source_name": "Source A",
          "source_url": "http://example.com/sourceA"
        }
      ],
      "contract_url": "http://example.com/contract",
      "contract_terms_url": "http://example.com/terms",
      "fee_type": "percentage",
      "fee_multiplier": 0.01,
      "additional_prohibitions": []
    }
  ]
}

#### Error Responses
- **400** - Bad Request Error
- **500** - Internal Server Error
```

--------------------------------

### Get Orders

Source: https://docs.kalshi.com/api-reference/orders/get-orders

Retrieves a list of orders, with options to filter by ticker, event ticker, timestamp range, status, and pagination.

```APIDOC
## GET /portfolio/orders

### Description
Retrieves a list of orders. The response can be restricted to orders that have a specific status such as 'resting', 'canceled', or 'executed'.

### Method
GET

### Endpoint
/portfolio/orders

### Parameters
#### Query Parameters
- **ticker** (string) - Optional - Filter by market ticker.
- **event_ticker** (string) - Optional - Event ticker of desired positions. Multiple event tickers can be provided as a comma-separated list (maximum 10).
- **min_ts** (integer) - Optional - Filter items after this Unix timestamp.
- **max_ts** (integer) - Optional - Filter items before this Unix timestamp.
- **status** (string) - Optional - Filter by status. Possible values depend on the endpoint.
- **limit** (integer) - Optional - Number of results per page. Defaults to 100. Maximum value is 200.
- **cursor** (string) - Optional - Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page.

### Request Example
```json
{
  "example": "No request body for GET request"
}
```

### Response
#### Success Response (200)
- **orders** (array) - An array of Order objects.
- **cursor** (string) - Pagination cursor for the next page of results.

#### Response Example
```json
{
  "orders": [
    {
      "order_id": "string",
      "user_id": "string",
      "client_order_id": "string",
      "ticker": "string",
      "side": "string",
      "action": "string",
      "type": "string",
      "status": "string",
      "yes_price": "string",
      "no_price": "string",
      "yes_price_dollars": "string",
      "no_price_dollars": "string",
      "fill_count": 0,
      "remaining_count": 0,
      "initial_count": 0,
      "taker_fees": "string",
      "maker_fees": "string",
      "taker_fill_cost": "string",
      "maker_fill_cost": "string",
      "taker_fill_cost_dollars": "string"
    }
  ],
  "cursor": "string"
}
```
```

--------------------------------

### GET /markets/trades

Source: https://docs.kalshi.com/api-reference/market/get-trades

Retrieves all trades for all markets. This endpoint is paginated and allows filtering by ticker and timestamp.

```APIDOC
## GET /markets/trades

### Description
Endpoint for getting all trades for all markets. A trade represents a completed transaction between two users on a specific market. Each trade includes the market ticker, price, quantity, and timestamp information. This endpoint returns a paginated response.

### Method
GET

### Endpoint
/markets/trades

### Parameters
#### Query Parameters
- **limit** (integer) - Optional - Number of results per page. Defaults to 100. Maximum value is 1000.
- **cursor** (string) - Optional - Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page.
- **ticker** (string) - Optional - Filter by market ticker.
- **min_ts** (integer) - Optional - Filter items after this Unix timestamp.
- **max_ts** (integer) - Optional - Filter items before this Unix timestamp.

### Request Example
```json
{
  "limit": 100,
  "cursor": "",
  "ticker": "" 
}
```

### Response
#### Success Response (200)
- **trades** (array) - An array of trade objects.
- **cursor** (string) - A cursor for paginating through results.

#### Response Example
```json
{
  "trades": [
    {
      "trade_id": "string",
      "ticker": "string",
      "price": "number",
      "count": "integer",
      "yes_price": "integer",
      "no_price": "integer",
      "yes_price_dollars": "integer",
      "no_price_dollars": "integer",
      "taker_side": "string"
    }
  ],
  "cursor": "string"
}
```
```

--------------------------------

### Fetch LLM Navigation Data

Source: https://docs.kalshi.com/api-reference/multivariate/lookup-tickers-for-market-in-multivariate-event-collection

Retrieve navigation and other page data by fetching the llms.txt file.

```APIDOC
## GET /llms.txt

### Description
Fetches navigation and other page data from the `llms.txt` file.

### Method
`GET`

### Endpoint
`/llms.txt`

### Query Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **Content**: `llms.txt` file content

#### Response Example
(Content of llms.txt)
```

--------------------------------

### GET /categories/{category}/milestones

Source: https://docs.kalshi.com/changelog

Retrieves milestones for a given category. The category parameter now supports case-insensitive matching.

```APIDOC
## GET /categories/{category}/milestones

### Description
Retrieves milestones for a given category. Category matching is now case-insensitive.

### Method
GET

### Endpoint
`/categories/{category}/milestones`

### Parameters
#### Path Parameters
- **category** (string) - Required - The category to filter milestones by (case-insensitive).

### Response
#### Success Response (200)
- **milestones** (array) - An array of milestone objects.

#### Response Example
```json
{
  "milestones": [
    {
      "id": "ms_123",
      "name": "First Milestone",
      "category": "Sports"
    }
  ]
}
```
```

--------------------------------

### Get Settlements API

Source: https://docs.kalshi.com/python-sdk/models/GetSettlementsResponse

This endpoint retrieves settlement information. It returns a list of settlements and an optional cursor for pagination.

```APIDOC
## GET /websites/kalshi/settlements

### Description
Retrieves settlement information, including a list of settlements and an optional cursor for pagination.

### Method
GET

### Endpoint
/websites/kalshi/settlements

### Parameters
#### Query Parameters
- **cursor** (string) - Optional - Used for paginating through results.

### Response
#### Success Response (200)
- **settlements** (List[Settlement]) - A list of settlement objects.
- **cursor** (string) - An optional cursor for fetching the next page of results.

#### Response Example
```json
{
  "settlements": [
    {
      "id": "settlement_id_1",
      "name": "Example Settlement 1",
      "status": "completed"
    },
    {
      "id": "settlement_id_2",
      "name": "Example Settlement 2",
      "status": "in_progress"
    }
  ],
  "cursor": "next_page_cursor"
}
```
```

--------------------------------

### Create API Key

Source: https://docs.kalshi.com/python-sdk/models/CreateApiKeyRequest

This endpoint allows you to create a new API key with specified permissions and identification.

```APIDOC
## POST /v2/api_key

### Description
Creates a new API key with a given name, public key, and optional scopes.

### Method
POST

### Endpoint
/v2/api_key

### Parameters
#### Request Body
- **name** (str) - Required - Name for the API key. This helps identify the key's purpose
- **public_key** (str) - Required - RSA public key in PEM format. This will be used to verify signatures on API requests
- **scopes** (List[str]) - Optional - List of scopes to grant to the API key. Valid values are 'read' and 'write'. If 'write' is included, 'read' must also be included. Defaults to full access (['read', 'write']) if not provided.

### Request Example
```json
{
  "name": "My Trading Bot Key",
  "public_key": "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA...\n-----END PUBLIC KEY-----",
  "scopes": ["read", "write"]
}
```

### Response
#### Success Response (201)
- **id** (str) - The unique identifier for the created API key.
- **name** (str) - The name of the API key.
- **public_key** (str) - The RSA public key associated with the API key.
- **scopes** (List[str]) - The list of scopes granted to the API key.
- **created_at** (str) - The timestamp when the API key was created.

#### Response Example
```json
{
  "id": "ak_abcdef1234567890",
  "name": "My Trading Bot Key",
  "public_key": "-----BEGIN PUBLIC KEY-----\nMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA...\n-----END PUBLIC KEY-----",
  "scopes": ["read", "write"],
  "created_at": "2023-10-27T10:00:00Z"
}
```
```

--------------------------------

### Get Event Candlesticks

Source: https://docs.kalshi.com/api-reference/events/get-event-candlesticks

Retrieve aggregated data across all markets corresponding to a specific event.

```APIDOC
## GET /websites/kalshi/events/candlesticks

### Description
End-point for returning aggregated data across all markets corresponding to an event.

### Method
GET

### Endpoint
/websites/kalshi/events/candlesticks

### Parameters
#### Query Parameters
- **event_id** (string) - Required - The ID of the event to retrieve candlestick data for.
- **start_time** (integer) - Optional - The start timestamp (Unix epoch milliseconds) for the candlestick data.
- **end_time** (integer) - Optional - The end timestamp (Unix epoch milliseconds) for the candlestick data.
- **interval** (string) - Optional - The interval for the candlesticks (e.g., '1m', '5m', '1h', '1d'). Defaults to '5m'.

### Response
#### Success Response (200)
- **event_id** (string) - The ID of the event.
- **candlesticks** (array) - An array of candlestick objects.
  - **timestamp** (integer) - The start timestamp of the candlestick.
  - **open** (number) - The opening price of the candlestick.
  - **high** (number) - The highest price during the candlestick interval.
  - **low** (number) - The lowest price during the candlestick interval.
  - **close** (number) - The closing price of the candlestick.
  - **volume** (integer) - The total volume traded during the candlestick interval.

#### Response Example
```json
{
  "event_id": "event123",
  "candlesticks": [
    {
      "timestamp": 1678886400000,
      "open": 1.05,
      "high": 1.10,
      "low": 1.03,
      "close": 1.08,
      "volume": 1500
    },
    {
      "timestamp": 1678886700000,
      "open": 1.08,
      "high": 1.12,
      "low": 1.07,
      "close": 1.11,
      "volume": 1200
    }
  ]
}
```
```

--------------------------------

### Get Multivariate Event Collections

Source: https://docs.kalshi.com/python-sdk/models/GetMultivariateEventCollectionsResponse

Retrieves a list of multivariate event collections. Supports pagination using a cursor.

```APIDOC
## GET /websites/kalshi/events/multivariate

### Description
Retrieves a paginated list of multivariate event collections. The response includes a cursor for fetching subsequent pages.

### Method
GET

### Endpoint
/websites/kalshi/events/multivariate

### Parameters
#### Query Parameters
- **cursor** (string) - Optional - The cursor for fetching the next page of records. If empty, there is no next page.
- **limit** (integer) - Optional - The maximum number of records to return per page.

### Request Example
```json
{
  "limit": 10,
  "cursor": "some_cursor_value"
}
```

### Response
#### Success Response (200)
- **multivariate_contracts** (List[MultivariateEventCollection]) - A list of multivariate event collections.
- **cursor** (string) - A cursor for fetching the next page of records. An empty value indicates no next page.

#### Response Example
```json
{
  "multivariate_contracts": [
    {
      "id": "collection_id_1",
      "event_id": "event_id_1",
      "name": "Example Event Collection 1"
    },
    {
      "id": "collection_id_2",
      "event_id": "event_id_2",
      "name": "Example Event Collection 2"
    }
  ],
  "cursor": "next_cursor_value"
}
```

#### Error Response (400)
- **error** (string) - Description of the error.

#### Error Response Example
```json
{
  "error": "Invalid cursor provided."
}
```
```

--------------------------------

### GET /candlesticks

Source: https://docs.kalshi.com/changelog

Retrieves candlestick data for all markets associated with an event. Supports pagination for large result sets.

```APIDOC
## GET /candlesticks

### Description
Get candlesticks for all markets associated with an event. If the # of candlesticks exceeds 5000, paginate the results and return an adjustedEndTs which should be used as the start_ts for your next request.

### Method
GET

### Endpoint
/candlesticks

### Query Parameters
- **event_id** (integer) - Required - The ID of the event to retrieve candlesticks for.
- **start_ts** (integer) - Optional - The timestamp to start retrieving candlesticks from.
- **end_ts** (integer) - Optional - The timestamp to end retrieving candlesticks at.

### Response
#### Success Response (200)
- **candlesticks** (array) - An array of candlestick objects.
  - **ts** (integer) - The timestamp of the candlestick.
  - **open** (integer) - The opening price.
  - **high** (integer) - The highest price.
  - **low** (integer) - The lowest price.
  - **close** (integer) - The closing price.
  - **volume** (integer) - The trading volume.
- **adjustedEndTs** (integer) - If pagination is used, this is the timestamp to be used as `start_ts` for the next request.
```

--------------------------------

### Get Market Data

Source: https://docs.kalshi.com/api-reference/market/get-market

Retrieves data for a specific market using its ticker. Markets represent binary outcomes on which users can trade.

```APIDOC
## GET /markets/{ticker}

### Description
Endpoint for getting data about a specific market by its ticker. A market represents a specific binary outcome within an event that users can trade on (e.g., "Will candidate X win?"). Markets have yes/no positions, current prices, volume, and settlement rules.

### Method
GET

### Endpoint
/markets/{ticker}

### Parameters
#### Path Parameters
- **ticker** (string) - Required - Market ticker

### Request Example
```json
{
  "example": "No request body for GET request"
}
```

### Response
#### Success Response (200)
- **market** (object) - Contains detailed market information.
  - **ticker** (string)
  - **event_ticker** (string)
  - **market_type** (string) - enum: [binary, scalar] - Identifies the type of market
  - **title** (string) - Deprecated
  - **subtitle** (string) - Deprecated
  - **yes_sub_title** (string) - Shortened title for the yes side of this market
  - **no_sub_title** (string) - Shortened title for the no side of this market
  - **created_time** (string) - format: date-time
  - **open_time** (string) - format: date-time
  - **close_time** (string) - format: date-time
  - **expiration_time** (string) - format: date-time - Deprecated
  - **latest_expiration_time** (string) - format: date-time
  - **settlement_timer_seconds** (integer)
  - **status** (string)
  - **response_price_units** (string)
  - **notional_value** (number)
  - **notional_value_dollars** (number)
  - **yes_bid** (number)
  - **yes_bid_dollars** (number)
  - **yes_ask** (number)
  - **yes_ask_dollars** (number)
  - **no_bid** (number)
  - **no_bid_dollars** (number)
  - **no_ask** (number)
  - **no_ask_dollars** (number)
  - **last_price** (number)
  - **last_price_dollars** (number)
  - **previous_yes_bid** (number)
  - **previous_yes_bid_dollars** (number)
  - **previous_yes_ask** (number)
  - **previous_yes_ask_dollars** (number)
  - **previous_price** (number)
  - **previous_price_dollars** (number)
  - **volume** (integer)
  - **volume_24h** (integer)
  - **liquidity** (number)
  - **liquidity_dollars** (number)
  - **open_interest** (integer)
  - **result** (string)
  - **can_close_early** (boolean)
  - **expiration_value** (string)
  - **rules_primary** (string)
  - **rules_secondary** (string)
  - **tick_size** (number)
  - **price_level_structure** (string)
  - **price_ranges** (array)

#### Response Example
```json
{
  "market": {
    "ticker": "example_ticker",
    "event_ticker": "example_event",
    "market_type": "binary",
    "title": "Example Market Title",
    "subtitle": "Example Market Subtitle",
    "yes_sub_title": "Yes Option",
    "no_sub_title": "No Option",
    "created_time": "2023-10-27T10:00:00Z",
    "open_time": "2023-10-27T10:00:00Z",
    "close_time": "2023-11-01T10:00:00Z",
    "expiration_time": "2023-11-01T10:00:00Z",
    "latest_expiration_time": "2023-11-01T10:00:00Z",
    "settlement_timer_seconds": 3600,
    "status": "open",
    "response_price_units": "cents",
    "notional_value": 1000000,
    "notional_value_dollars": 1000000,
    "yes_bid": 0.75,
    "yes_bid_dollars": 750000,
    "yes_ask": 0.76,
    "yes_ask_dollars": 760000,
    "no_bid": 0.24,
    "no_bid_dollars": 240000,
    "no_ask": 0.25,
    "no_ask_dollars": 250000,
    "last_price": 0.755,
    "last_price_dollars": 755000,
    "previous_yes_bid": 0.70,
    "previous_yes_bid_dollars": 700000,
    "previous_yes_ask": 0.71,
    "previous_yes_ask_dollars": 710000,
    "previous_price": 0.705,
    "previous_price_dollars": 705000,
    "volume": 5000,
    "volume_24h": 1200,
    "liquidity": 0.9,
    "liquidity_dollars": 900000,
    "open_interest": 3000,
    "result": null,
    "can_close_early": false,
    "expiration_value": null,
    "rules_primary": "Standard outcome",
    "rules_secondary": null,
    "tick_size": 0.01,
    "price_level_structure": "standard",
    "price_ranges": []
  }
}
```

#### Error Responses
- **401**: Unauthorized
- **404**: Not found
- **500**: Internal server error
```

--------------------------------

### Fetch LLM Data

Source: https://docs.kalshi.com/api-reference/multivariate/get-multivariate-event-collection-lookup-history

This endpoint allows you to fetch the llms.txt file, which may contain navigation and other page data for the specified project.

```APIDOC
## GET /websites/kalshi/llms.txt

### Description
Fetches the llms.txt file for the "kalshi" project, potentially containing navigation and other page information.

### Method
GET

### Endpoint
/websites/kalshi/llms.txt

### Parameters
None

### Request Example
None

### Response
#### Success Response (200)
- **Content-Type** (string) - The content type of the file, typically application/json or text/plain.
- **File Content** (string) - The raw content of the llms.txt file.

#### Response Example
```json
{
  "message": "File content retrieved successfully."
}
```
```

--------------------------------

### GET /markets/{ticker}

Source: https://docs.kalshi.com/python-sdk/api/MarketsApi

Retrieves a single market by its ticker. A market represents a specific binary outcome within an event that users can trade on.

```APIDOC
## GET /markets/{ticker}

### Description
Get a single market by its ticker. A market represents a specific binary outcome within an event that users can trade on (e.g., "Will candidate X win?"). Markets have yes/no positions, current prices, volume, and settlement rules.

### Method
GET

### Endpoint
/markets/{ticker}

### Parameters
#### Path Parameters
- **ticker** (string) - Required - Market ticker

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **GetMarketResponse** (object) - Market retrieved successfully

#### Response Example
{
  "example": "response body"
}
```

--------------------------------

### GET /structured_targets

Source: https://docs.kalshi.com/python-sdk/api/StructuredTargetsApi

Retrieves a collection of structured targets, with options to filter by type, competition, and control pagination.

```APIDOC
## GET /structured_targets

### Description
Get a list of Structured Targets with optional filtering and pagination.

### Method
GET

### Endpoint
/v2/structured_targets

### Parameters
#### Query Parameters
- **type** (str) - Optional - Filter by structured target type
- **competition** (str) - Optional - Filter by competition
- **page_size** (int) - Optional - Number of items per page (min 1, max 2000, default 100)
- **cursor** (str) - Optional - Pagination cursor

### Response
#### Success Response (200)
- **GetStructuredTargetsResponse** - Structured targets retrieved successfully

#### Error Responses
- **401**: Unauthorized
- **500**: Internal server error
```

--------------------------------

### Get Market Candlesticks

Source: https://docs.kalshi.com/api-reference/market/get-market-candlesticks

Retrieves candlestick data for a specific market within a given time range. Candlestick intervals can be 1 minute, 1 hour, or 1 day.

```APIDOC
## GET /series/{series_ticker}/markets/{ticker}/candlesticks

### Description
Retrieves candlestick data for a specific market within a given time range. The `period_interval` parameter determines the length of each candlestick in minutes, with valid options being 1 (1 minute), 60 (1 hour), or 1440 (1 day).

### Method
GET

### Endpoint
`/series/{series_ticker}/markets/{ticker}/candlesticks`

### Parameters
#### Path Parameters
- **series_ticker** (string) - Required - The series that contains the target market.
- **ticker** (string) - Required - Unique identifier for the specific market.

#### Query Parameters
- **start_ts** (integer) - Required - Start timestamp (Unix timestamp). Candlesticks will include those ending on or after this time.
- **end_ts** (integer) - Required - End timestamp (Unix timestamp). Candlesticks will include those ending on or before this time.
- **period_interval** (integer) - Required - Time period length of each candlestick in minutes. Valid values are 1, 60, or 1440.

### Response
#### Success Response (200)
- **ticker** (string) - Unique identifier for the market.
- **candlesticks** (array) - Array of candlestick data points for the specified time range.
  - **end_period_ts** (integer) - Unix timestamp for the inclusive end of the candlestick period.
  - **yes_bid** (object) - Open, high, low, close (OHLC) data for YES buy offers.
  - **yes_ask** (object) - Open, high, low, close (OHLC) data for YES sell offers.
  - **price** (object) - Open, high, low, close (OHLC) and more data for trade YES contract.

#### Response Example
```json
{
  "ticker": "TEST",
  "candlesticks": [
    {
      "end_period_ts": 1678886400,
      "yes_bid": {
        "open": 0.5,
        "high": 0.6,
        "low": 0.4,
        "close": 0.55
      },
      "yes_ask": {
        "open": 0.52,
        "high": 0.62,
        "low": 0.42,
        "close": 0.57
      },
      "price": {
        "open": 0.51,
        "high": 0.61,
        "low": 0.41,
        "close": 0.56,
        "volume": 1000,
        "open_interest": 500
      }
    }
  ]
}
```
```

--------------------------------

### GET /events/{event_ticker}

Source: https://docs.kalshi.com/api-reference/events/get-event

Retrieves detailed information about a specific event, optionally including its associated markets. Events represent tradable real-world occurrences.

```APIDOC
## GET /events/{event_ticker}

### Description
Endpoint for getting data about an event by its ticker. An event represents a real-world occurrence that can be traded on, such as an election, sports game, or economic indicator release. Events contain one or more markets where users can place trades on different outcomes.

### Method
GET

### Endpoint
/events/{event_ticker}

### Parameters
#### Path Parameters
- **event_ticker** (string) - Required - Event ticker

#### Query Parameters
- **with_nested_markets** (boolean) - Optional - If true, markets are included within the event object. If false (default), markets are returned as a separate top-level field in the response.

### Request Example
```json
{
  "example": "request body"
}
```

### Response
#### Success Response (200)
- **event** (object) - Data for the event.
- **markets** (array) - Data for the markets in this event. This field is deprecated in favour of the "markets" field inside the event. Which will be filled with the same value if you use the query parameter "with_nested_markets=true".

#### Response Example
```json
{
  "example": "response body"
}
```

#### Error Responses
- **400**: Bad request
- **401**: Unauthorized
- **404**: Event not found
- **500**: Internal server error
```

--------------------------------

### User Portfolio Information

Source: https://docs.kalshi.com/openapi

Retrieves a user's current portfolio balance and value, along with the timestamp of the last update.

```APIDOC
## GET /websites/kalshi/portfolio

### Description
Retrieves the user's current financial status, including their available balance and the total value of their portfolio. It also provides a timestamp indicating when this information was last updated.

### Method
GET

### Endpoint
/websites/kalshi/portfolio

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **balance** (integer) - Member's available balance in cents. This represents the amount available for trading.
- **portfolio_value** (integer) - Member's portfolio value in cents. This is the current value of all positions held.
- **updated_ts** (integer) - Unix timestamp of the last update to the balance.

#### Response Example
```json
{
  "balance": 1000000,
  "portfolio_value": 1500000,
  "updated_ts": 1678886400
}
```
```

--------------------------------

### GET /communications/rfqs/{rfq_id}

Source: https://docs.kalshi.com/api-reference/communications/get-rfq

Retrieves details for a specific Request for Quote (RFQ) by its unique identifier.

```APIDOC
## GET /communications/rfqs/{rfq_id}

### Description
Endpoint for getting a single RFQ by id.

### Method
GET

### Endpoint
/communications/rfqs/{rfq_id}

### Parameters
#### Path Parameters
- **rfq_id** (string) - Required - RFQ ID

### Response
#### Success Response (200)
- **rfq** (object) - The details of the requested RFQ
  - **id** (string) - Unique identifier for the RFQ
  - **creator_id** (string) - Public communications ID of the RFQ creator
  - **market_ticker** (string) - The ticker of the market this RFQ is for
  - **contracts** (integer) - Number of contracts requested in the RFQ
  - **status** (string) - Current status of the RFQ (open, closed)
  - **created_ts** (string) - Timestamp when the RFQ was created
  - **target_cost_centi_cents** (integer) - Total value of the RFQ in centi-cents
  - **mve_collection_ticker** (string) - Ticker of the MVE collection this market belongs to
  - **mve_selected_legs** (array) - Selected legs for the MVE collection
  - **rest_remainder** (boolean) - Whether to rest the remainder of the RFQ after execution
  - **cancellation_reason** (string) - Reason for RFQ cancellation if cancelled
  - **creator_user_id** (string) - User ID of the RFQ creator (private field)
  - **cancelled_ts** (string) - Timestamp when the RFQ was cancelled
  - **updated_ts** (string) - Timestamp when the RFQ was last updated

#### Error Response
- **code** (string) - Error code
- **message** (string) - Human-readable error message
- **details** (object) - Additional error details
```

--------------------------------

### GET /events

Source: https://docs.kalshi.com/changelog/index

Retrieves a list of events. Updates include an increased default limit for the `limit` parameter and the addition of an optional `with_milestones` flag. Multivariate events will be excluded from this endpoint in future releases.

```APIDOC
## GET /events

### Description
Retrieves a list of events. The default `limit` parameter has been increased to 200. The `with_nested_markets` parameter now correctly respects the `limit` parameter. An optional `with_milestones` flag can be used to include milestone data. Multivariate events will be excluded from this endpoint starting November 13th, 2025.

### Method
GET

### Endpoint
/events

### Query Parameters
- **limit** (integer) - The maximum number of results to return per page. Defaults to 200.
- **with_nested_markets** (boolean) - If true, includes nested markets. This parameter now respects the `limit` parameter.
- **with_milestones** (boolean) - Optional. If true, includes all milestones related to the returned events.

### Response
#### Success Response (200)
- **events** (array) - A list of event objects.
- **milestones** (array) - A list of milestone objects (only if `with_milestones=true`).

### Response Example
```json
{
  "events": [
    {
      "id": "ev_abc123",
      "name": "Example Event"
    }
  ],
  "milestones": [
    {
      "event_id": "ev_abc123",
      "date": "2025-11-01"
    }
  ]
}
```
```

--------------------------------

### GET /events/{event_ticker}/metadata

Source: https://docs.kalshi.com/python-sdk/api/EventsApi

Retrieves metadata associated with a specific event using its ticker.

```APIDOC
## GET /events/{event_ticker}/metadata

### Description
Get Event Metadata

Endpoint for getting metadata about an event by its ticker.

### Method
GET

### Endpoint
/events/{event_ticker}/metadata

### Parameters
#### Path Parameters
- **event_ticker** (str) - Required - Event ticker

### Request Example
```json
{
  "event_ticker": "example_event_ticker"
}
```

### Response
#### Success Response (200)
- **GetEventMetadataResponse** (object) - Metadata related to the event.

#### Response Example
```json
{
  "event_ticker": "example_event_ticker",
  "category": "Politics",
  "sentiment": "Neutral",
  "source": "Example News Source"
}
```
```

--------------------------------

### Get Market Orderbook

Source: https://docs.kalshi.com/api-reference/market/get-market-orderbook

Retrieves the current order book for a specific market, displaying bid orders for both yes and no sides.

```APIDOC
## GET /websites/kalshi/orderbook

### Description
Endpoint for getting the current order book for a specific market. The order book shows all active bid orders for both yes and no sides of a binary market. It returns yes bids and no bids only (no asks are returned). This is because in binary markets, a bid for yes at price X is equivalent to an ask for no at price (100-X). For example, a yes bid at 7¢ is the same as a no ask at 93¢, with identical contract sizes. Each side shows price levels with their corresponding quantities and order counts, organized from best to worst prices.

### Method
GET

### Endpoint
/websites/kalshi/orderbook

### Parameters
#### Query Parameters
- **market_id** (string) - Required - The unique identifier for the market.

### Request Example
(No request body for GET requests)

### Response
#### Success Response (200)
- **yes_bids** (array) - An array of bid objects for the 'yes' side.
  - **price** (number) - The bid price.
  - **quantity** (number) - The total quantity at this price level.
  - **count** (number) - The number of orders at this price level.
- **no_bids** (array) - An array of bid objects for the 'no' side.
  - **price** (number) - The bid price.
  - **quantity** (number) - The total quantity at this price level.
  - **count** (number) - The number of orders at this price level.

#### Response Example
{
  "yes_bids": [
    {
      "price": 70,
      "quantity": 1000,
      "count": 5
    },
    {
      "price": 69,
      "quantity": 2500,
      "count": 10
    }
  ],
  "no_bids": [
    {
      "price": 30,
      "quantity": 1500,
      "count": 8
    },
    {
      "price": 31,
      "quantity": 3000,
      "count": 12
    }
  ]
}
```

--------------------------------

### GET /exchange/status

Source: https://docs.kalshi.com/api-reference/exchange/get-exchange-status

Retrieves the current status of the Kalshi exchange, indicating whether trading is active and if the exchange is generally operational.

```APIDOC
## GET /exchange/status

### Description
Endpoint for getting the exchange status.

### Method
GET

### Endpoint
/exchange/status

### Parameters

### Request Example

### Response
#### Success Response (200)
- **exchange_active** (boolean) - False if the core Kalshi exchange is no longer taking any state changes at all. This includes but is not limited to trading, new users, and transfers. True unless we are under maintenance.
- **trading_active** (boolean) - True if we are currently permitting trading on the exchange. This is true during trading hours and false outside exchange hours. Kalshi reserves the right to pause at any time in case issues are detected.
- **exchange_estimated_resume_time** (string) - Estimated downtime for the current exchange maintenance window. However, this is not guaranteed and can be extended.

#### Response Example
{
  "exchange_active": true,
  "trading_active": true,
  "exchange_estimated_resume_time": null
}
```

--------------------------------

### Send Authenticated GET Request to Kalshi API (Javascript)

Source: https://docs.kalshi.com/getting_started/api_keys

Sends an authenticated GET request to the Kalshi API. It loads a private key, constructs a signature string from the timestamp, method, and path, and includes it in the request headers along with the API key and timestamp. Uses Axios for HTTP requests.

```javascript
const axios = require('axios');

const currentTimeMilliseconds = Date.now();
const timestampStr = currentTimeMilliseconds.toString();

const privateKeyPem = loadPrivateKeyFromFile('path/to/your/private-key.pem');

const method = "GET";
const baseUrl = 'https://demo-api.kalshi.co';
const path = '/trade-api/v2/portfolio/balance';

// Strip query parameters from path before signing
const pathWithoutQuery = path.split('?')[0];
const msgString = timestampStr + method + pathWithoutQuery;
const sig = signPssText(privateKeyPem, msgString);

const headers = {
    'KALSHI-ACCESS-KEY': 'your-api-key-id',
    'KALSHI-ACCESS-SIGNATURE': sig,
    'KALSHI-ACCESS-TIMESTAMP': timestampStr
};

axios.get(baseUrl + path, { headers })
    .then(response => {
        console.log(response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

```

--------------------------------

### GET /portfolio/orders

Source: https://docs.kalshi.com/openapi

Retrieves a list of orders, with options to filter by status. This endpoint is crucial for managing and tracking user's trading orders.

```APIDOC
## GET /portfolio/orders

### Description
Restricts the response to orders that have a certain status: resting, canceled, or executed.

### Method
GET

### Endpoint
/portfolio/orders

### Parameters
#### Query Parameters
- **ticker** (string) - Optional - Filter by a specific market ticker.
- **event_ticker** (string) - Optional - Filter by a specific event ticker.
- **min_ts** (integer) - Optional - Filter by minimum timestamp.
- **max_ts** (integer) - Optional - Filter by maximum timestamp.
- **status** (string) - Optional - Filter by order status (e.g., 'resting', 'canceled', 'executed').
- **limit** (integer) - Optional - Number of results to return per page.
- **cursor** (string) - Optional - Cursor for pagination.

### Request Example
`GET /portfolio/orders?status=executed&limit=10`

### Response
#### Success Response (200)
- **GetOrdersResponse** (object) - A list of orders matching the criteria.

#### Response Example
```json
{
  "orders": [
    {
      "id": "order_123",
      "ticker": "XYZ",
      "status": "executed",
      "creation_date": "2023-10-27T11:00:00Z"
    }
  ],
  "next_cursor": "some_cursor_value"
}
```
```

--------------------------------

### Update GET /series/fee_changes Endpoint with User-Facing Fee Types

Source: https://docs.kalshi.com/changelog/index

The GET /series/fee_changes endpoint now returns user-facing fee type names instead of internal names. This change affects CustomerIO notifications for scheduled series fee updates. The endpoint's primary function is to retrieve fee change information for a given series.

```json
{
  "fee_type": "quadratic"
}
```

--------------------------------

### Subpenny Support in WS for RFQs and Quotes

Source: https://docs.kalshi.com/changelog/index

Fields supporting subpenny pricing have been added to all RFQ and quote WebSocket messages.

```APIDOC
## Subpenny Support in WS for RFQs and Quotes

### Description
Fields have been added to all RFQ and quote messages to support subpenny pricing via the dollar normalized price fields.

### Method
WebSocket

### Endpoint
Refer to Websocket Documentation

### Parameters
Refer to Websocket Documentation

### Request Example
Refer to Websocket Documentation

### Response
#### Success Response
- Fields supporting subpenny pricing (e.g., dollar normalized price fields) are now available in RFQ and quote messages.

#### Response Example
Refer to Websocket Documentation for specific message structures.
```

--------------------------------

### Batch Create Orders

Source: https://docs.kalshi.com/api-reference/orders/batch-create-orders

Submit a batch of orders. Each order is counted against the total rate limit for order operations. The batch size is capped by the current per-second rate-limit configuration.

```APIDOC
## POST /websites/kalshi/orders

### Description
Endpoint for submitting a batch of orders. Each order in the batch is counted against the total rate limit for order operations. Consequently, the size of the batch is capped by the current per-second rate-limit configuration applicable to the user. At the moment of writing, the limit is 20 orders per batch.

### Method
POST

### Endpoint
/websites/kalshi/orders

### Parameters
#### Request Body
- **orders** (array[object]) - Required - An array of order objects to be submitted in the batch.
  - **order** (object) - Required - Represents a single order.
    - **ticker** (string) - Required - The ticker symbol for the market.
    - **price** (number) - Required - The price for the order.
    - **size** (number) - Required - The quantity of contracts to trade.
    - **action** (string) - Required - The type of order ('buy' or 'sell').
    - **type** (string) - Optional - The type of order ('limit', 'market', or 'ioc'). Defaults to 'limit'.

### Request Example
```json
{
  "orders": [
    {
      "ticker": "YES-2024/07/19-GOOG",
      "price": 0.50,
      "size": 10,
      "action": "buy",
      "type": "limit"
    },
    {
      "ticker": "YES-2024/07/19-MSFT",
      "price": 0.75,
      "size": 5,
      "action": "sell",
      "type": "market"
    }
  ]
}
```

### Response
#### Success Response (200)
- **created_orders** (array[object]) - A list of successfully created orders.
  - **id** (string) - The unique identifier for the created order.
  - **ticker** (string) - The ticker symbol for the market.
  - **price** (number) - The price for the order.
  - **size** (number) - The quantity of contracts traded.
  - **action** (string) - The type of order ('buy' or 'sell').
  - **status** (string) - The current status of the order.
- **failed_orders** (array[object]) - A list of orders that failed to be created.
  - **order_details** (object) - The original details of the failed order.
  - **error_message** (string) - The reason for the failure.

#### Response Example
```json
{
  "created_orders": [
    {
      "id": "ord_abc123",
      "ticker": "YES-2024/07/19-GOOG",
      "price": 0.50,
      "size": 10,
      "action": "buy",
      "status": "open"
    }
  ],
  "failed_orders": [
    {
      "order_details": {
        "ticker": "YES-2024/07/19-MSFT",
        "price": 0.75,
        "size": 5,
        "action": "sell",
        "type": "market"
      },
      "error_message": "Insufficient funds."
    }
  ]
}
```
```

--------------------------------

### Get Market using Kalshi Python SDK

Source: https://docs.kalshi.com/python-sdk/api/MarketsApi

Retrieves a single market's details by its ticker using the Kalshi Python SDK. This method requires authentication with an API key and private key. It returns a GetMarketResponse object or raises an ApiException on failure.

```python
import kalshi_python
from kalshi_python.models.get_market_response import GetMarketResponse
from kalshi_python.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to https://api.elections.kalshi.com/trade-api/v2
# See configuration.py for a list of all supported configuration parameters.
configuration = kalshi_python.Configuration(
    host = "https://api.elections.kalshi.com/trade-api/v2"
)

# Read private key from file
with open('path/to/private_key.pem', 'r') as f:
    private_key = f.read()

# Configure API key authentication
configuration.api_key_id = "your-api-key-id"
configuration.private_key_pem = private_key

# Initialize the Kalshi client
client = kalshi_python.KalshiClient(configuration)

ticker = 'ticker_example' # str | Market ticker

try:
    # Get Market
    api_response = client.get_market(ticker)
    print("The response of MarketsApi->get_market:\n")
    pprint(api_response)
except Exception as e:
    print("Exception when calling MarketsApi->get_market: %s\n" % e)
```

--------------------------------

### Get User Data Timestamp

Source: https://docs.kalshi.com/typescript-sdk/api/ExchangeApi

Retrieves the user data timestamp for the specified project. This endpoint does not require any parameters or authorization.

```APIDOC
## GET /websites/kalshi

### Description
Retrieves the user data timestamp for the specified project.

### Method
GET

### Endpoint
/websites/kalshi

### Parameters
This endpoint does not have any parameters.

### Request Example
```json
{}
```

### Response
#### Success Response (200)
- **GetUserDataTimestampResponse** (object) - User data timestamp details.

#### Response Example
```json
{
  "timestamp": "2023-10-27T10:00:00Z"
}
```

#### Error Response (500)
- **Error** (object) - Internal server error details.
```

--------------------------------

### GET /websites/kalshi/settlements

Source: https://docs.kalshi.com/python-sdk/api

Retrieves a paginated list of settlements. Supports filtering by market ticker, event ticker, and time range.

```APIDOC
## GET /websites/kalshi/settlements

### Description
Retrieves a paginated list of settlements, allowing filtering by market ticker, event ticker, and time range.

### Method
GET

### Endpoint
/websites/kalshi/settlements

### Parameters
#### Query Parameters
- **limit** (int) - Optional - Number of results per page. Defaults to 100. Maximum value is 200.
- **cursor** (str) - Optional - Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page.
- **ticker** (str) - Optional - Filter by market ticker.
- **event_ticker** (str) - Optional - Event ticker of desired positions. Multiple event tickers can be provided as a comma-separated list (maximum 10).
- **min_ts** (int) - Optional - Filter items after this Unix timestamp.
- **max_ts** (int) - Optional - Filter items before this Unix timestamp

### Request Example
(No request body for GET requests, parameters are in query string)
```
GET /websites/kalshi/settlements?limit=100&ticker=BTC-USD&min_ts=1678886400
```

### Response
#### Success Response (200)
- **GetSettlementsResponse** (object) - Contains settlement data and pagination information.

#### Response Example
```json
{
  "settlements": [
    {
      "ticker": "BTC-USD",
      "event_ticker": "BTC-USD-20231215",
      "settlement_date": "2023-12-15T20:00:00Z",
      "value": 45000.50
    }
  ],
  "next_cursor": "some_cursor_value"
}
```

#### Error Responses
- **400** - Bad request - invalid input
- **401** - Unauthorized - authentication required
- **500** - Internal server error
```

--------------------------------

### Get Communications ID API

Source: https://docs.kalshi.com/python-sdk/api/CommunicationsApi

Endpoint for retrieving the communications ID of the currently logged-in user.

```APIDOC
## GET /get_communications_id

### Description
Endpoint for getting the communications ID of the logged-in user.

### Method
GET

### Endpoint
/get_communications_id

### Parameters
This endpoint does not require any parameters.

### Response
#### Success Response (200)
- **GetCommunicationsIDResponse** (object) - Details of the communications ID.

#### Error Response
- **401**: Unauthorized - authentication required
- **500**: Internal server error
```

--------------------------------

### Get Market Data

Source: https://docs.kalshi.com/api-reference/market/get-market

Retrieves data for a specific market using its ticker. Markets represent binary outcomes with associated trading information.

```APIDOC
## GET /websites/kalshi

### Description
Endpoint for getting data about a specific market by its ticker. A market represents a specific binary outcome within an event that users can trade on (e.g., "Will candidate X win?"). Markets have yes/no positions, current prices, volume, and settlement rules.

### Method
GET

### Endpoint
/websites/kalshi

### Parameters
#### Query Parameters
- **ticker** (string) - Required - The ticker symbol of the market to retrieve.
```

--------------------------------

### Python: Load RSA Private Key from File

Source: https://docs.kalshi.com/getting_started/api_keys

Loads an RSA private key from a PEM-encoded file. This function is essential for using your API key to sign requests. It takes the file path as input and returns the loaded private key object. Ensure the file path is correct and the key is not password-protected, or provide the password.

```python
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.backends import default_backend

def load_private_key_from_file(file_path):
    with open(file_path, "rb") as key_file:
        private_key = serialization.load_pem_private_key(
            key_file.read(),
            password=None,  # or provide a password if your key is encrypted
            backend=default_backend()
        )
    return private_key
```

--------------------------------

### POST /multivariate_event_collections/{collection_ticker}

Source: https://docs.kalshi.com/api-reference/multivariate/create-market-in-multivariate-event-collection

Creates an individual market within a multivariate event collection. This endpoint must be called before trading or looking up a market.

```APIDOC
## POST /multivariate_event_collections/{collection_ticker}

### Description
Endpoint for creating an individual market in a multivariate event collection. This endpoint must be hit at least once before trading or looking up a market.

### Method
POST

### Endpoint
/multivariate_event_collections/{collection_ticker}

### Parameters
#### Path Parameters
- **collection_ticker** (string) - Required - Collection ticker

#### Request Body
- **selected_markets** (array) - Required - List of selected markets that act as parameters to determine which market is created.
  - **market_ticker** (string) - Required - Market ticker identifier.
  - **event_ticker** (string) - Required - Event ticker identifier.
  - **side** (string) - Required - Side of the market (yes or no).
- **with_market_payload** (boolean) - Optional - Whether to include the market payload in the response.

### Request Example
```json
{
  "selected_markets": [
    {
      "market_ticker": "sample_market_ticker",
      "event_ticker": "sample_event_ticker",
      "side": "yes"
    }
  ],
  "with_market_payload": true
}
```

### Response
#### Success Response (200)
- **event_ticker** (string) - Event ticker for the created market.
- **market_ticker** (string) - Market ticker for the created market.
- **market** (object) - Market payload of the created market.
  - **ticker** (string) - 
  - **event_ticker** (string) - 
  - **market_type** (string) - 
  - **title** (string) - 
  - **subtitle** (string) - 
  - **yes_sub_title** (string) - 
  - **no_sub_title** (string) - 
  - **created_time** (string) - 
  - **open_time** (string) - 
  - **close_time** (string) - 
  - **expiration_time** (string) - 
  - **latest_expiration_time** (string) - 
  - **settlement_timer_seconds** (number) - 
  - **status** (string) - 
  - **response_price_units** (string) - 
  - **notional_value** (string) - 
  - **notional_value_dollars** (string) - 
  - **yes_bid** (number) - 
  - **yes_bid_dollars** (string) - 
  - **yes_ask** (number) - 
  - **yes_ask_dollars** (string) - 
  - **no_bid** (number) - 
  - **no_bid_dollars** (string) - 
  - **no_ask** (number) - 
  - **no_ask_dollars** (string) - 
  - **last_price** (number) - 
  - **last_price_dollars** (string) - 

#### Response Example
```json
{
  "event_ticker": "sample_event_ticker",
  "market_ticker": "sample_market_ticker",
  "market": {
    "ticker": "sample_market_ticker",
    "event_ticker": "sample_event_ticker",
    "market_type": "daily",
    "title": "Example Market Title",
    "subtitle": "Example Market Subtitle",
    "yes_sub_title": "Example Yes Subtitle",
    "no_sub_title": "Example No Subtitle",
    "created_time": "2023-01-01T12:00:00Z",
    "open_time": "2023-01-01T12:00:00Z",
    "close_time": "2023-01-01T12:00:00Z",
    "expiration_time": "2023-01-01T12:00:00Z",
    "latest_expiration_time": "2023-01-01T12:00:00Z",
    "settlement_timer_seconds": 3600,
    "status": "open",
    "response_price_units": "cents",
    "notional_value": "100000000",
    "notional_value_dollars": "1000000.00",
    "yes_bid": 0.50,
    "yes_bid_dollars": "0.50",
    "yes_ask": 0.55,
    "yes_ask_dollars": "0.55",
    "no_bid": 0.45,
    "no_bid_dollars": "0.45",
    "no_ask": 0.40,
    "no_ask_dollars": "0.40",
    "last_price": 0.52,
    "last_price_dollars": "0.52"
  }
}
```

```

--------------------------------

### GET /portfolio/summary/total_resting_order_value

Source: https://docs.kalshi.com/python-sdk/api/PortfolioApi

Retrieves the total value, in cents, of resting orders. This endpoint is primarily for FCM members.

```APIDOC
## GET /portfolio/summary/total_resting_order_value

### Description
Get Total Resting Order Value

Endpoint for getting the total value, in cents, of resting orders. This endpoint is only intended for use by FCM members (rare). Note: If you're uncertain about this endpoint, it likely does not apply to you.

### Method
GET

### Endpoint
/portfolio/summary/total_resting_order_value

### Parameters

This endpoint does not need any parameters.

### Request Example

```json
{}
```

### Response
#### Success Response (200)
- **total_resting_order_value** (integer) - The total value of resting orders in cents.

#### Response Example

```json
{
  "total_resting_order_value": 750000
}
```
```

--------------------------------

### Events API - With Milestones Flag

Source: https://docs.kalshi.com/changelog

The `GET /events` endpoint now includes an optional `with_milestones` flag to retrieve milestone data associated with events.

```APIDOC
## GET /events

### Description
An optional `with_milestones` flag has been added to the `GET /events` endpoint. When set to `true`, this flag will include all milestones related to the events returned in the response.

### Method
GET

### Endpoint
/events

### Parameters
#### Query Parameters
- **with_milestones** (boolean) - Optional - If `true`, includes milestone data for the events.
```

--------------------------------

### Get Exchange Announcements

Source: https://docs.kalshi.com/python-sdk/models/GetExchangeAnnouncementsResponse

Retrieves a list of exchange-wide announcements. The response contains a list of Announcement objects, each detailing an announcement.

```APIDOC
## GET /websites/kalshi/announcements

### Description
Retrieves a list of exchange-wide announcements.

### Method
GET

### Endpoint
/websites/kalshi/announcements

### Parameters
#### Query Parameters
None

#### Path Parameters
None

### Request Body
None

### Response
#### Success Response (200)
- **announcements** (List[Announcement]) - A list of exchange-wide announcements.

#### Response Example
```json
{
  "announcements": [
    {
      "id": "123",
      "title": "New Market Added",
      "content": "A new market for XYZ has been added.",
      "created_at": "2023-10-27T10:00:00Z"
    }
  ]
}
```
```

--------------------------------

### Get Positions API

Source: https://docs.kalshi.com/api-reference/portfolio/get-positions

Retrieves position data, allowing filtering by specific fields with non-zero values.

```APIDOC
## GET /websites/kalshi/positions

### Description
Retrieves position data for the Kalshi website. Allows filtering the positions to include only those where specified fields have non-zero values.

### Method
GET

### Endpoint
/websites/kalshi/positions

### Parameters
#### Query Parameters
- **position** (string) - Optional - Restricts results to positions with a non-zero value in the 'position' field.
- **total_traded** (string) - Optional - Restricts results to positions with a non-zero value in the 'total_traded' field.

### Request Example
```json
{
  "example": "GET /websites/kalshi/positions?position=true&total_traded=true"
}
```

### Response
#### Success Response (200)
- **positions** (array) - A list of position objects matching the filter criteria.
  - **position** (number) - The value of the position field.
  - **total_traded** (number) - The value of the total_traded field.

#### Response Example
```json
{
  "example": {
    "positions": [
      {
        "position": 100,
        "total_traded": 5000
      },
      {
        "position": 50,
        "total_traded": 2500
      }
    ]
  }
}
```
```

--------------------------------

### Get Quotes with Parameters

Source: https://docs.kalshi.com/python-sdk/api/CommunicationsApi

Retrieves quotes from the Kalshi API. Supports filtering by various parameters such as event ticker, market ticker, status, and user IDs. Pagination is handled using a cursor and a limit for results per page.

```python
def get_quotes(cursor=None, event_ticker=None, market_ticker=None, limit=500, status=None, quote_creator_user_id=None, rfq_creator_user_id=None, rfq_creator_subtrader_id=None, rfq_id=None):
    """Get quotes with various filtering options.

    Args:
        cursor (str, optional): Pagination cursor for the next page of results.
        event_ticker (str, optional): Event ticker(s) to filter by. Comma-separated list.
        market_ticker (str, optional): Market ticker to filter by.
        limit (int, optional): Number of results per page. Defaults to 500.
        status (str, optional): Filter quotes by status.
        quote_creator_user_id (str, optional): Filter quotes by quote creator user ID.
        rfq_creator_user_id (str, optional): Filter quotes by RFQ creator user ID.
        rfq_creator_subtrader_id (str, optional): Filter quotes by RFQ creator subtrader ID.
        rfq_id (str, optional): Filter quotes by RFQ ID.

    Returns:
        GetQuotesResponse: The response object containing the quotes.
    """
    pass
```

--------------------------------

### Authentication

Source: https://docs.kalshi.com/api-reference/communications/get-quotes

API authentication using API keys and signatures.

```APIDOC
## Authentication

### Security Schemes

- **kalshiAccessKey**
  - Type: apiKey
  - In: header
  - Name: KALSHI-ACCESS-KEY
  - Description: Your API key ID

- **kalshiAccessSignature**
  - Type: apiKey
  - In: header
  - Name: KALSHI-ACCESS-SIGNATURE
  - Description: RSA-PSS signature of the request

- **kalshiAccessTimestamp**
  - Type: apiKey
  - In: header
  - Name: KALSHI-ACCESS-TIMESTAMP
  - Description: Timestamp of the request
```

--------------------------------

### GET /websites/kalshi

Source: https://docs.kalshi.com/api-reference/market/get-markets

Retrieves a list of markets based on various filtering criteria. This endpoint allows users to search for markets by closing time, settlement time, status, tickers, and multivariate event status.

```APIDOC
## GET /websites/kalshi

### Description
Retrieves a list of markets. You can filter markets by closing time, settlement time, status, tickers, and multivariate event status.

### Method
GET

### Endpoint
/websites/kalshi

### Parameters
#### Query Parameters
- **max_close_ts** (integer) - Optional - Filter items that close before this Unix timestamp
- **min_close_ts** (integer) - Optional - Filter items that close after this Unix timestamp
- **min_settled_ts** (integer) - Optional - Filter items that settled after this Unix timestamp
- **max_settled_ts** (integer) - Optional - Filter items that settled before this Unix timestamp
- **status** (string) - Optional - Filter by market status. Leave empty to return markets with any status. Possible values: `unopened`, `open`, `paused`, `closed`, `settled`.
- **tickers** (string) - Optional - Filter by specific market tickers. Comma-separated list of market tickers to retrieve.
- **mve_filter** (string) - Optional - Filter by multivariate events (combos). 'only' returns only multivariate events, 'exclude' excludes multivariate events. Possible values: `only`, `exclude`.

### Response
#### Success Response (200)
- **markets** (array) - An array of market objects.
  - **ticker** (string) - The market ticker symbol.
  - **event_ticker** (string) - The ticker of the associated event.
  - **market_type** (string) - Identifies the type of market. Possible values: `binary`, `scalar`.
  - **title** (string) - DEPRECATED: The title of the market.
  - **subtitle** (string) - DEPRECATED: The subtitle of the market.
  - **yes_sub_title** (string) - Shortened title for the yes side of this market.
  - **no_sub_title** (string) - Shortened title for the no side of this market.
  - **created_time** (string) - The time the market was created (ISO 8601 format).
  - **open_time** (string) - The time the market opened (ISO 8601 format).
  - **close_time** (string) - The time the market closed (ISO 8601 format).
  - **expected_expiration_time** (string) - Time when this market is expected to expire (ISO 8601 format, nullable).
  - **expiration_time** (string) - DEPRECATED: The expiration time of the market (ISO 8601 format).
  - **latest_expiration_time** (string) - The latest possible time for this market to expire (ISO 8601 format).
  - **settlement_timer_seconds** (integer) - The amount of time after determination that the market settles.
  - **status** (string) - The current status of the market. Possible values: `initialized`, `inactive`, `active`, `closed`, `determined`, `disputed`, `amended`, `finalized`.
  - **response_price_units** (string) - DEPRECATED: Use price_level_structure and price_ranges instead. Possible values: `usd_cent`.
  - **yes_bid** (number) - DEPRECATED: The current bid price for the 'yes' side.
  - **notional_value** (number) - The notional value of the market.
  - **notional_value_dollars** (number) - The notional value in USD.
  - **yes_bid_dollars** (number) - The 'yes' bid price in USD.
  - **yes_ask_dollars** (number) - The 'yes' ask price in USD.
  - **no_bid_dollars** (number) - The 'no' bid price in USD.
  - **no_ask_dollars** (number) - The 'no' ask price in USD.
  - **last_price_dollars** (number) - The last traded price in USD.
  - **previous_yes_bid_dollars** (number) - The previous 'yes' bid price in USD.
  - **previous_yes_ask_dollars** (number) - The previous 'yes' ask price in USD.
  - **previous_price_dollars** (number) - The previous last traded price in USD.
  - **volume** (number) - The total volume traded in the market.
  - **volume_24h** (number) - The volume traded in the last 24 hours.
  - **liquidity_dollars** (number) - The liquidity of the market in USD.
  - **open_interest** (number) - The number of open contracts.
  - **result** (any) - The result of the market (type depends on market_type).
  - **can_close_early** (boolean) - Indicates if the market can be closed early.
  - **expiration_value** (any) - The value at which the market expires (type depends on market_type).
  - **rules_primary** (string) - Primary rules for the market.
  - **rules_secondary** (string) - Secondary rules for the market.
  - **tick_size** (number) - The minimum price increment for the market.
  - **price_level_structure** (string) - Describes the structure of price levels.
  - **price_ranges** (object) - Defines the price ranges for the market.
- **cursor** (string) - A cursor for paginating through results.

#### Response Example
```json
{
  "markets": [
    {
      "ticker": "TSLA-2024-12-20",
      "event_ticker": "TSLA-2024-12-20",
      "market_type": "binary",
      "title": "Will TSLA close above $200 on Dec 20, 2024?",
      "subtitle": "",
      "yes_sub_title": "Yes",
      "no_sub_title": "No",
      "created_time": "2024-01-15T10:00:00Z",
      "open_time": "2024-01-15T10:00:00Z",
      "close_time": "2024-12-20T17:00:00Z",
      "expected_expiration_time": null,
      "expiration_time": "2024-12-20T17:00:00Z",
      "latest_expiration_time": "2024-12-20T17:00:00Z",
      "settlement_timer_seconds": 300,
      "status": "open",
      "response_price_units": "usd_cent",
      "yes_bid": 75.50,
      "notional_value": 1000000,
      "notional_value_dollars": 1000000.00,
      "yes_bid_dollars": 75.50,
      "yes_ask_dollars": 76.00,
      "no_bid_dollars": 24.00,
      "no_ask_dollars": 24.50,
      "last_price_dollars": 75.75,
      "previous_yes_bid_dollars": 75.00,
      "previous_yes_ask_dollars": 75.50,
      "previous_price_dollars": 75.25,
      "volume": 1500,
      "volume_24h": 200,
      "liquidity_dollars": 50000.00,
      "open_interest": 1000,
      "result": null,
      "can_close_early": false,
      "expiration_value": null,
      "rules_primary": "Standard binary market rules.",
      "rules_secondary": "",
      "tick_size": 0.01,
      "price_level_structure": "standard",
      "price_ranges": {
        "min": 0,
        "max": 100
      }
    }
  ],
  "cursor": "some_pagination_token"
}
```
```

--------------------------------

### Portfolio Positions API - Total Cost Shares Added

Source: https://docs.kalshi.com/changelog

The `GET /portfolio/positions` endpoint now includes the `total_cost_shares` field, tracking the total number of shares traded per event.

```APIDOC
## GET /portfolio/positions

### Description
The `GET /portfolio/positions` endpoint has been enhanced to include the `total_cost_shares` field. This field represents the total number of shares traded on an event, encompassing both YES and NO contracts.

### Method
GET

### Endpoint
/portfolio/positions

### Response
#### Success Response (200)
- **positions** (array) - An array of portfolio positions.
  - **total_cost_shares** (string) - The total number of shares traded for the event.
```

--------------------------------

### Get Markets

Source: https://docs.kalshi.com/api-reference/market/get-markets

Retrieves a list of markets, with options to filter by status and various timestamp ranges. Note that timestamp and status filters can be mutually exclusive.

```APIDOC
## GET /websites/kalshi/markets

### Description
Retrieves a list of markets, allowing filtering by status and timestamps. The `status` parameter accepts `unopened`, `open`, `closed`, or `settled`. Timestamp filters like `min_created_ts`, `max_created_ts`, `min_close_ts`, `max_close_ts`, `min_settled_ts`, and `max_settled_ts` are available.

### Method
GET

### Endpoint
/websites/kalshi/markets

### Parameters
#### Query Parameters
- **status** (string) - Optional - Filter markets by status. Possible values: `unopened`, `open`, `closed`, `settled`. Leave empty to return markets with any status. Only one `status` filter may be supplied at a time.
- **min_created_ts** (integer) - Optional - Filter by minimum creation timestamp.
- **max_created_ts** (integer) - Optional - Filter by maximum creation timestamp.
- **min_close_ts** (integer) - Optional - Filter by minimum close timestamp.
- **max_close_ts** (integer) - Optional - Filter by maximum close timestamp.
- **min_settled_ts** (integer) - Optional - Filter by minimum settled timestamp.
- **max_settled_ts** (integer) - Optional - Filter by maximum settled timestamp.

### Request Example
```json
{
  "status": "open",
  "min_created_ts": 1678886400
}
```

### Response
#### Success Response (200)
- **markets** (array) - A list of market objects.
  - **id** (string) - The unique identifier for the market.
  - **name** (string) - The name of the market.
  - **status** (string) - The current status of the market (`unopened`, `open`, `closed`, `settled`).
  - **created_ts** (integer) - The timestamp when the market was created.
  - **close_ts** (integer) - The timestamp when the market closes.
  - **settled_ts** (integer) - The timestamp when the market was settled.

#### Response Example
```json
{
  "markets": [
    {
      "id": "market-123",
      "name": "Will it rain tomorrow?",
      "status": "open",
      "created_ts": 1678886400,
      "close_ts": 1679059200,
      "settled_ts": null
    }
  ]
}
```
```

--------------------------------

### Live Data Schemas

Source: https://docs.kalshi.com/openapi

Schemas for handling live data updates and responses.

```APIDOC
## LiveData Schema

### Description
Represents a single piece of live data from the Kalshi platform.

### Properties

#### type (string)
- Required - Type of live data.

#### details (object)
- Required - Live data details as a flexible object. Additional properties can be any valid JSON value.

#### milestone_id (string)
- Required - Milestone ID associated with the live data.
```

```APIDOC
## GetLiveDataResponse Schema

### Description
Response structure for retrieving a single live data item.

### Properties

#### live_data (LiveData)
- Required - The live data object.
```

```APIDOC
## GetLiveDatasResponse Schema

### Description
Response structure for retrieving a list of live data items.

### Properties

#### live_datas (array)
- Required - An array of LiveData objects.
```

--------------------------------

### GET /milestones/{milestone_id}

Source: https://docs.kalshi.com/python-sdk/api/MilestonesApi

Retrieves a single milestone by its unique identifier.

```APIDOC
## GET /milestones/{milestone_id}

### Description
Get a single milestone by ID.

### Method
GET

### Endpoint
/milestones/{milestone_id}

### Parameters
#### Path Parameters
- **milestone_id** (str) - Required - Milestone ID

### Request Example
```python
# No request body for this endpoint.
```

### Response
#### Success Response (200)
- **GetMilestoneResponse** - Details of the retrieved milestone.

#### Response Example
```json
{
  "example": "response body"
}
```

#### Error Responses
- **401** - Unauthorized - authentication required
- **404** - Resource not found
- **500** - Internal server error
```

--------------------------------

### Get API Keys

Source: https://docs.kalshi.com/python-sdk/api/ApiKeysApi

Retrieves all API keys associated with the authenticated user. This endpoint provides a list of API keys, each with a unique identifier and name, used for programmatic access.

```APIDOC
## GET /api_keys

### Description
Retrieves all API keys associated with the authenticated user. API keys allow programmatic access to the platform without requiring username/password authentication. Each key has a unique identifier and name.

### Method
GET

### Endpoint
/api_keys

### Parameters
This endpoint does not require any parameters.

### Response
#### Success Response (200)
- **GetApiKeysResponse** - A list of API keys associated with the user.

#### Response Example
```json
{
  "example": "response body for GetApiKeysResponse"
}
```
```

--------------------------------

### GET /websites/kalshi/orders/{order_id}

Source: https://docs.kalshi.com/openapi

Retrieves a specific order by its ID. This endpoint allows users to check the status and details of a previously placed order.

```APIDOC
## GET /websites/kalshi/orders/{order_id}

### Description
Retrieves a specific order by its ID. This endpoint allows users to check the status and details of a previously placed order.

### Method
GET

### Endpoint
/websites/kalshi/orders/{order_id}

### Parameters
#### Path Parameters
- **order_id** (string) - Required - The unique identifier of the order to retrieve.

### Request Example
```json
// No request body for GET requests.
```

### Response
#### Success Response (200)
- **order** (object) - Details of the retrieved order.

#### Response Example
```json
{
  "order": {
    "id": "ord_abc123",
    "created_ts": 1678886400,
    "ticker": "SEC.2024-01-01",
    "side": "yes",
    "action": "buy",
    "count": 10,
    "type": "limit",
    "yes_price": 50,
    "status": "filled"
  }
}
```
```

--------------------------------

### Get Event

Source: https://docs.kalshi.com/openapi

Retrieves detailed information for a specific event, including its markets. Supports fetching nested market data via a query parameter.

```APIDOC
## GET /websites/kalshi/event/{event_ticker}

### Description
Retrieves detailed information for a specific event.

### Method
GET

### Endpoint
/websites/kalshi/event/{event_ticker}

### Parameters
#### Path Parameters
- **event_ticker** (string) - Required - The ticker of the event to retrieve.
#### Query Parameters
- **with_nested_markets** (boolean) - Optional - Whether to include the markets data within the event object.

### Response
#### Success Response (200)
- **event** (object) - Data for the event.
- **markets** (array) - Data for the markets in this event. Deprecated in favour of the 'markets' field inside the event object.

#### Response Example
```json
{
  "event": {
    "id": "event-123",
    "ticker": "SOME_EVENT",
    "name": "Some Event Name",
    "short_description": "Event Short Description",
    "long_description": "Event Long Description",
    "image_url": "/path/to/event_image.png",
    "creation_date": "2023-10-27T09:00:00Z",
    "expiration_date": "2023-10-27T17:00:00Z",
    "resolution_date": null,
    "status": "open",
    "volume": 5000,
    "open_interest": 2000,
    "markets": [
      {
        "ticker": "MarketTicker1",
        "short_description": "Market 1 Short Description",
        "long_description": "Market 1 Long Description",
        "image_url": "/path/to/market1_image.png",
        "creation_date": "2023-10-27T09:15:00Z",
        "expiration_date": "2023-10-27T17:00:00Z",
        "resolution_date": null,
        "status": "open",
        "best_bid": "10000",
        "best_ask": "10100",
        "last_trade_price_cents": "10050",
        "last_update_time": "2023-10-27T11:00:00Z",
        "volume": 1000,
        "open_interest": 500,
        "is_valid": true,
        "is_resolved": false,
        "is_above_one": true,
        "yes_entry_price_cents": "10000",
        "yes_entry_amount": "0",
        "no_entry_price_cents": "0",
        "no_entry_amount": "0",
        "entity_last_updated_utc": "2023-10-27T11:05:00Z",
        "futures_multiples_of_one_cent": false,
        "autocomplete_on_extreme_prices_with_one_cent_increments": false
      }
    ]
  },
  "markets": [
      {
        "ticker": "MarketTicker1",
        "short_description": "Market 1 Short Description",
        "long_description": "Market 1 Long Description",
        "image_url": "/path/to/market1_image.png",
        "creation_date": "2023-10-27T09:15:00Z",
        "expiration_date": "2023-10-27T17:00:00Z",
        "resolution_date": null,
        "status": "open",
        "best_bid": "10000",
        "best_ask": "10100",
        "last_trade_price_cents": "10050",
        "last_update_time": "2023-10-27T11:00:00Z",
        "volume": 1000,
        "open_interest": 500,
        "is_valid": true,
        "is_resolved": false,
        "is_above_one": true,
        "yes_entry_price_cents": "10000",
        "yes_entry_amount": "0",
        "no_entry_price_cents": "0",
        "no_entry_amount": "0",
        "entity_last_updated_utc": "2023-10-27T11:05:00Z",
        "futures_multiples_of_one_cent": false,
        "autocomplete_on_extreme_prices_with_one_cent_increments": false
      }
    ]
}
```
```

--------------------------------

### GET /websites/kalshi/markets

Source: https://docs.kalshi.com/typescript-sdk/api/MarketsApi

Retrieves a list of markets with support for filtering by various criteria such as status, closing time, and specific tickers. Includes pagination using a cursor and limit.

```APIDOC
## GET /websites/kalshi/markets

### Description
Retrieves a list of markets with support for filtering by various criteria such as status, closing time, and specific tickers. Includes pagination using a cursor and limit.

### Method
GET

### Endpoint
/websites/kalshi/markets

### Parameters
#### Query Parameters
- **limit** (number) - Optional - Number of results per page. Defaults to 100. Maximum value is 1000.
- **cursor** (string) - Optional - Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page.
- **eventTicker** (string) - Optional - Filter by event ticker.
- **seriesTicker** (string) - Optional - Filter by series ticker.
- **maxCloseTs** (number) - Optional - Filter items that close before this Unix timestamp.
- **minCloseTs** (number) - Optional - Filter items that close after this Unix timestamp.
- **status** (string) - Optional - Filter by market status. Comma-separated list. Possible values are 'initialized', 'open', 'closed', 'settled', 'determined'. Leave empty to return markets with any status.
- **tickers** (string) - Optional - Filter by specific market tickers. Comma-separated list of market tickers to retrieve.

### Request Example
```json
{
  "query": "?limit=100&status=open,closed"
}
```

### Response
#### Success Response (200)
- **markets** (array) - An array of market objects. (Type defined by GetMarketsResponse)

#### Response Example
```json
{
  "markets": [
    {
      "id": "some-market-id",
      "eventTicker": "example_event",
      "seriesTicker": "example_series",
      "name": "Will it rain tomorrow?",
      "status": "open",
      "closeTime": 1700000000,
      "volume": 1500,
      "openInterest": 3000
    }
  ],
  "next_cursor": "some-next-cursor-value"
}
```

#### Error Responses
- **400** - Bad request - invalid input
- **401** - Unauthorized - authentication required
- **500** - Internal server error
```

--------------------------------

### Get RFQs

Source: https://docs.kalshi.com/python-sdk/api/CommunicationsApi

Retrieves a list of Request for Quotes (RFQs) from the Kalshi platform. This endpoint supports pagination and filtering by various parameters.

```APIDOC
## GET /websites/kalshi

### Description
Retrieves a list of Request for Quotes (RFQs) from the Kalshi platform. This endpoint supports pagination and filtering by various parameters.

### Method
GET

### Endpoint
/websites/kalshi

### Parameters
#### Query Parameters
- **cursor** (str) - Optional - Pagination cursor. Use the cursor value returned from the previous response to get the next page of results. Leave empty for the first page.
- **event_ticker** (str) - Optional - Event ticker of desired positions. Multiple event tickers can be provided as a comma-separated list (maximum 10).
- **market_ticker** (str) - Optional - Filter by market ticker
- **limit** (int) - Optional - Parameter to specify the number of results per page. Defaults to 100.
- **status** (str) - Optional - Filter RFQs by status
- **creator_user_id** (str) - Optional - Filter RFQs by creator user ID

### Response
#### Success Response (200)
- **GetRFQsResponse** (object) - RFQs retrieved successfully

#### Response Example
{
  "example": "Response body example for GetRFQsResponse"
}

#### Error Responses
- **401**: Unauthorized - authentication required
- **500**: Internal server error
```

--------------------------------

### GET /exchange/status

Source: https://docs.kalshi.com/python-sdk/api/ExchangeApi

Retrieves the current exchange status. This endpoint does not require any parameters.

```APIDOC
## GET /exchange/status

### Description
Get Exchange Status

Endpoint for getting the exchange status.

### Method
GET

### Endpoint
/exchange/status

### Parameters

#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **ExchangeStatus** (object) - Exchange status retrieved successfully

#### Response Example
{
  "example": "response body"
}
```

--------------------------------

### RFQ Object Documentation

Source: https://docs.kalshi.com/python-sdk/models/RFQ

Details the properties of the RFQ object as defined in the Python SDK.

```APIDOC
## RFQ Object

### Description
Represents a Request For Quote (RFQ) in the system.

### Properties

#### `id`
- **Type**: `string`
- **Description**: Unique identifier for the RFQ

#### `creator_id`
- **Type**: `string`
- **Description**: Public communications ID of the RFQ creator

#### `market_ticker`
- **Type**: `string`
- **Description**: The ticker of the market this RFQ is for

#### `contracts`
- **Type**: `integer`
- **Description**: Number of contracts requested in the RFQ

#### `target_cost_centi_cents`
- **Type**: `integer`
- **Description**: Total value of the RFQ in centi-cents
- **Optional**: Yes

#### `status`
- **Type**: `string`
- **Description**: Current status of the RFQ (e.g., open, closed)

#### `created_ts`
- **Type**: `datetime`
- **Description**: Timestamp when the RFQ was created

#### `mve_collection_ticker`
- **Type**: `string`
- **Description**: Ticker of the MVE collection this market belongs to
- **Optional**: Yes

#### `mve_selected_legs`
- **Type**: `List[MveSelectedLeg]`
- **Description**: Selected legs for the MVE collection
- **Optional**: Yes
- **Link**: [MveSelectedLeg](https://docs.kalshi.com/python-sdk/models/MveSelectedLeg)

#### `rest_remainder`
- **Type**: `boolean`
- **Description**: Whether to rest the remainder of the RFQ after execution
- **Optional**: Yes

#### `cancellation_reason`
- **Type**: `string`
- **Description**: Reason for RFQ cancellation if cancelled
- **Optional**: Yes

#### `creator_user_id`
- **Type**: `string`
- **Description**: User ID of the RFQ creator (private field)
- **Optional**: Yes

#### `cancelled_ts`
- **Type**: `datetime`
- **Description**: Timestamp when the RFQ was cancelled
- **Optional**: Yes

#### `updated_ts`
- **Type**: `datetime`
- **Description**: Timestamp when the RFQ was last updated
- **Optional**: Yes

```

--------------------------------

### Get RFQ by ID

Source: https://docs.kalshi.com/api-reference/communications/get-rfq

Retrieves the details of a specific Request for Quote (RFQ) using its unique identifier.

```APIDOC
## GET /websites/kalshi/rfq/{id}

### Description
Endpoint for getting a single RFQ by id.

### Method
GET

### Endpoint
/websites/kalshi/rfq/{id}

### Parameters
#### Path Parameters
- **id** (string) - Required - The unique identifier of the RFQ to retrieve.

### Response
#### Success Response (200)
- **rfqId** (string) - The unique identifier of the RFQ.
- **symbol** (string) - The symbol representing the financial instrument.
- **quantity** (integer) - The requested quantity for the RFQ.
- **price** (number) - The price associated with the RFQ.
- **side** (string) - The side of the trade (e.g., 'buy' or 'sell').
- **status** (string) - The current status of the RFQ (e.g., 'open', 'filled', 'cancelled').
- **createdAt** (string) - The timestamp when the RFQ was created.

#### Response Example
{
  "rfqId": "rfq_12345",
  "symbol": "TSLA-2024-01-01-CALL",
  "quantity": 100,
  "price": 150.75,
  "side": "buy",
  "status": "open",
  "createdAt": "2024-01-01T10:00:00Z"
}
```

--------------------------------

### GET /events

Source: https://docs.kalshi.com/typescript-sdk/api/EventsApi

Retrieves a list of all available events on the Kalshi platform. This endpoint allows users to discover tradable events.

```APIDOC
## GET /events

### Description
Get a list of all events.

### Method
GET

### Endpoint
/events

### Parameters
(No specific parameters mentioned for this endpoint in the provided text)

### Request Example
```typescript
// Example for retrieving events, assuming a similar structure to other endpoints
// Note: Specific SDK method call for getEvents is not detailed in the input.
// This is a conceptual example based on the description.

import {
    EventsApi,
    Configuration
} from 'kalshi-typescript';

const configuration = new Configuration({
    apiKey: 'your-api-key-id',
    privateKeyPath: '/path/to/private-key.pem'  // or privateKeyPem: 'PEM string'
});
const apiInstance = new EventsApi(configuration);

// Assuming a method like apiInstance.getEvents() exists
// const { status, data } = await apiInstance.getEvents(); 
```

### Response
#### Success Response (200)
- **Array of Event objects** - A list of event summaries or full event details.

#### Response Example
(Example response structure depends on the schema for a list of events, not provided in input)

### Error Handling
- **401**: Unauthorized - authentication required
- **500**: Internal server error
```

--------------------------------

### Get RFQ Response

Source: https://docs.kalshi.com/python-sdk/models/GetRFQResponse

Retrieves the response for a Request for Quote (RFQ). The response includes detailed RFQ information.

```APIDOC
## GET /websites/kalshi/rfqresponse

### Description
Retrieves the response for a Request for Quote (RFQ). The response includes detailed RFQ information.

### Method
GET

### Endpoint
/websites/kalshi/rfqresponse

### Parameters
#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **rfq** (RFQ) - Contains detailed information about the RFQ.

#### Response Example
```json
{
  "rfq": {
    "call_put": "call",
    "strike_price": "100.0",
    "expiration_date": "2024-12-31",
    "contract_symbol": "ES-20241231-100-C",
    "underlying_asset": "ES",
    "exercise_style": "european",
    "market_id": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```
```

--------------------------------

### GET /markets/{ticker}/orderbook

Source: https://docs.kalshi.com/python-sdk/api/MarketsApi

Retrieves the order book for a specific market, showing current buy and sell orders.

```APIDOC
## GET /markets/{ticker}/orderbook

### Description
Get Market Orderbook

### Method
GET

### Endpoint
/markets/{ticker}/orderbook

### Parameters
#### Path Parameters
- **ticker** (string) - Required - Market ticker

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **GetMarketOrderbookResponse** (object) - Market orderbook retrieved successfully

#### Response Example
{
  "example": "response body"
}
```

--------------------------------

### Kalshi Project Website Details

Source: https://docs.kalshi.com/python-sdk/models/Series

Retrieves detailed information about a specific Kalshi project website, including contract URLs, terms URLs, product metadata, fee information, and additional prohibitions.

```APIDOC
## GET /websites/kalshi

### Description
Retrieves detailed information about the Kalshi project website, including contract URLs, terms URLs, product metadata, fee information, and additional prohibitions.

### Method
GET

### Endpoint
/websites/kalshi

### Parameters
#### Path Parameters
None

#### Query Parameters
None

#### Request Body
None

### Request Example
None

### Response
#### Success Response (200)
- **contract_url** (str) - A direct link to the original filing of the contract that underlies the series.
- **contract_terms_url** (str) - The URL to the current terms of the contract underlying the series.
- **product_metadata** (object) - Internal product metadata of the series. (Optional)
- **fee_type** (str) - A string representing the series' fee structure. Fee structures can be found at https://kalshi.com/docs/kalshi-fee-schedule.pdf.
- **fee_multiplier** (float) - A floating point multiplier applied to the fee calculations.
- **additional_prohibitions** (List[str]) - A list of additional trading prohibitions for this series.

#### Response Example
```json
{
  "contract_url": "https://www.sec.gov/Archives/edgar/data/1731068/000110465921110417/tm2124574d2_kalshi.htm",
  "contract_terms_url": "https://kalshi.com/contracts/b0e1f5641e7b40f48261b10e6a4e162f/terms",
  "product_metadata": {},
  "fee_type": "quadratic",
  "fee_multiplier": 1.0,
  "additional_prohibitions": []
}
```
```

--------------------------------

### Get Market Orderbook

Source: https://docs.kalshi.com/python-sdk/api/MarketsApi

Retrieves the current orderbook for a given market, showing bid and ask prices and sizes. This is essential for understanding market liquidity and available trading opportunities.

```APIDOC
## GET /markets/{ticker}/orderbook

### Description
Retrieves the current orderbook for a given market, showing bid and ask prices and sizes. This is essential for understanding market liquidity and available trading opportunities.

### Method
GET

### Endpoint
/markets/{ticker}/orderbook

### Parameters
#### Path Parameters
- **ticker** (str) - Required - Market ticker

#### Query Parameters
- **depth** (int) - Optional - Depth of the orderbook to retrieve (default to 10)

### Request Example
```python
{
  "ticker": "ticker_example",
  "depth": 10
}
```

### Response
#### Success Response (200)
- **GetMarketOrderbookResponse** (object) - Orderbook retrieved successfully

#### Response Example
```json
{
  "example": "response body"
}
```
```

--------------------------------

### Batch Get Market Candlesticks

Source: https://docs.kalshi.com/api-reference/market/batch-get-market-candlesticks

Fetches candlestick data for multiple markets in a single request. It supports fetching up to 100 market tickers and returns up to 10,000 candlesticks.

```APIDOC
## GET /websites/kalshi/candlesticks

### Description
Endpoint for retrieving candlestick data for multiple markets. Accepts up to 100 market tickers per request and returns up to 10,000 candlesticks total across all markets. Returns candlesticks grouped by market_id. Optionally includes a synthetic initial candlestick for price continuity.

### Method
GET

### Endpoint
/websites/kalshi/candlesticks

### Parameters
#### Query Parameters
- **market_ids** (string[]) - Required - A list of market IDs for which to retrieve candlestick data. Up to 100 market IDs are allowed.
- **start** (integer) - Optional - The start timestamp (inclusive) for the candlestick data. Defaults to the earliest available data.
- **end** (integer) - Optional - The end timestamp (inclusive) for the candlestick data. Defaults to the latest available data.
- **resolution** (string) - Optional - The resolution of the candlesticks (e.g., "1m", "5m", "1h", "1d"). Defaults to "1m".
- **limit** (integer) - Optional - The maximum number of candlesticks to return per market. Defaults to 1000.
- **include_latest_before_start** (boolean) - Optional - If true, includes a synthetic candlestick representing the latest data point before the specified `start` time for price continuity. Defaults to false.

### Request Example
```json
{
  "market_ids": ["BTC-USD", "ETH-USD"],
  "start": 1678886400,
  "end": 1678972800,
  "resolution": "1h",
  "include_latest_before_start": true
}
```

### Response
#### Success Response (200)
- **candlesticks** (object) - An object where keys are market IDs and values are arrays of candlestick objects.
  - **market_id** (string) - The ID of the market.
  - **open** (number) - The opening price for the candlestick period.
  - **high** (number) - The highest price during the candlestick period.
  - **low** (number) - The lowest price during the candlestick period.
  - **close** (number) - The closing price for the candlestick period.
  - **volume** (number) - The trading volume during the candlestick period.
  - **timestamp** (integer) - The Unix timestamp of the start of the candlestick period.

#### Response Example
```json
{
  "candlesticks": {
    "BTC-USD": [
      {
        "market_id": "BTC-USD",
        "open": 25000.00,
        "high": 25500.00,
        "low": 24900.00,
        "close": 25300.00,
        "volume": 1000.50,
        "timestamp": 1678886400
      }
    ],
    "ETH-USD": [
      {
        "market_id": "ETH-USD",
        "open": 1800.00,
        "high": 1820.00,
        "low": 1790.00,
        "close": 1810.00,
        "volume": 500.25,
        "timestamp": 1678886400
      }
    ]
  }
}
```
```

--------------------------------

### Generate API Key

Source: https://docs.kalshi.com/python-sdk/models/GenerateApiKeyRequest

This endpoint allows for the creation of new API keys. You can specify a name for the key to easily identify its purpose and define the access scopes it should have. The 'scopes' parameter accepts a list of strings, where valid values are 'read' and 'write'. If 'write' scope is provided, 'read' scope must also be included. If no scopes are specified, the key defaults to having both 'read' and 'write' access.

```APIDOC
## POST /api/keys

### Description
Generates a new API key with a specified name and access scopes.

### Method
POST

### Endpoint
/api/keys

### Parameters
#### Request Body
- **name** (str) - Required - Name for the API key. This helps identify the key's purpose.
- **scopes** (List[str]) - Optional - List of scopes to grant to the API key. Valid values are 'read' and 'write'. If 'write' is included, 'read' must also be included. Defaults to full access (['read', 'write']) if not provided.

### Request Example
```json
{
  "name": "my-app-key",
  "scopes": ["read", "write"]
}
```

### Response
#### Success Response (201)
- **key** (str) - The newly generated API key.
- **name** (str) - The name provided for the API key.
- **scopes** (List[str]) - The scopes granted to the API key.

#### Response Example
```json
{
  "key": "abc123xyz789",
  "name": "my-app-key",
  "scopes": ["read", "write"]
}
```
```

--------------------------------

### GET /portfolio/order_groups/{order_group_id}

Source: https://docs.kalshi.com/openapi

Retrieves details for a single order group including all order IDs and auto-cancel status.

```APIDOC
## GET /portfolio/order_groups/{order_group_id}

### Description
Retrieves details for a single order group including all order IDs and auto-cancel status.

### Method
GET

### Endpoint
/portfolio/order_groups/{order_group_id}

### Parameters
#### Path Parameters
- **order_group_id** (string) - Required - The ID of the order group to retrieve.

### Query Parameters

### Request Body

### Request Example
```json
{
  "example": "request body"
}
```

### Response
#### Success Response (200)
- **id** (string) - The unique identifier for the order group.
- **contracts_limit** (integer) - The contracts limit set for the order group.
- **matched_contracts** (integer) - The current number of matched contracts in the order group.
- **created_at** (string) - The timestamp when the order group was created.
- **orders** (array) - A list of order IDs belonging to this group.
- **auto_cancel** (boolean) - Indicates if auto-cancel is enabled for this group.

#### Response Example
```json
{
  "example": "{\"id\": \"og_123\", \"contracts_limit\": 100, \"matched_contracts\": 50, \"created_at\": \"2023-01-01T10:00:00Z\", \"orders\": [\"o_abc\", \"o_def\"], \"auto_cancel\": false}"
}
```
```

--------------------------------

### Get Quotes API

Source: https://docs.kalshi.com/python-sdk/models/GetQuotesResponse

Retrieves a list of quotes matching the query criteria. Supports pagination using a cursor.

```APIDOC
## GET /websites/kalshi/quotes

### Description
Retrieves a list of quotes matching the query criteria. Supports pagination using a cursor.

### Method
GET

### Endpoint
/websites/kalshi/quotes

### Parameters
#### Query Parameters
- **cursor** (string) - Optional - Cursor for pagination to get the next page of results

### Request Example
```json
{
  "some_query_parameter": "value"
}
```

### Response
#### Success Response (200)
- **quotes** (List[Quote]) - List of quotes matching the query criteria
- **cursor** (string) - Cursor for pagination to get the next page of results

#### Response Example
```json
{
  "quotes": [
    {
      "id": "quote123",
      "instrument_id": "instrument456",
      "price": 1.50,
      "volume": 100
    }
  ],
  "cursor": "next_page_cursor_token"
}
```
```

--------------------------------

### POST /websites/kalshi/orders

Source: https://docs.kalshi.com/openapi

Creates a new order on the Kalshi exchange. This endpoint allows users to place buy or sell orders with various specifications.

```APIDOC
## POST /websites/kalshi/orders

### Description
Creates a new order on the Kalshi exchange. This endpoint allows users to place buy or sell orders with various specifications.

### Method
POST

### Endpoint
/websites/kalshi/orders

### Parameters
#### Request Body
- **ticker** (string) - Required - The ticker symbol for the contract.
- **side** (string) - Required - The side of the order (yes or no).
- **action** (string) - Required - The action to perform (buy or sell).
- **count** (integer) - Required - The number of contracts to trade.
- **client_order_id** (string) - Optional - A unique identifier for the client-generated order.
- **type** (string) - Optional - The type of order (limit, market).
- **yes_price** (integer) - Optional - The price for the 'yes' side of the contract (1-99).
- **no_price** (integer) - Optional - The price for the 'no' side of the contract (1-99).
- **yes_price_dollars** (object) - Optional - Submitting price of the Yes side in fixed-point dollars.
- **no_price_dollars** (object) - Optional - Submitting price of the No side in fixed-point dollars.
- **expiration_ts** (integer) - Optional - The Unix timestamp in milliseconds when the order should expire.
- **time_in_force** (string) - Optional - The time in force for the order (fill_or_kill, good_till_canceled, immediate_or_cancel).
- **buy_max_cost** (integer) - Optional - Maximum cost in cents. When specified, the order will automatically have Fill-or-Kill (FoK) behavior.
- **post_only** (boolean) - Optional - If true, the order will only be posted to the order book and not execute immediately.
- **reduce_only** (boolean) - Optional - If true, the order will only reduce an existing position.
- **sell_position_floor** (integer) - Optional - Deprecated: Use reduce_only instead. Only accepts value of 0.
- **self_trade_prevention_type** (string) - Optional - The self-trade prevention type (taker_at_cross, maker).
- **order_group_id** (string) - Optional - The order group this order is part of.
- **cancel_order_on_pause** (boolean) - Optional - If true, the order will be canceled if trading is paused.

### Request Example
```json
{
  "ticker": "SEC.2024-01-01",
  "side": "yes",
  "action": "buy",
  "count": 10,
  "type": "limit",
  "yes_price": 50
}
```

### Response
#### Success Response (200)
- **order** (object) - Details of the created order.

#### Response Example
```json
{
  "order": {
    "id": "ord_abc123",
    "created_ts": 1678886400,
    "ticker": "SEC.2024-01-01",
    "side": "yes",
    "action": "buy",
    "count": 10,
    "type": "limit",
    "yes_price": 50,
    "status": "open"
  }
}
```
```

--------------------------------

### GET /series

Source: https://docs.kalshi.com/typescript-sdk/api/SeriesApi

Retrieves all market series. Supports filtering by series status.

```APIDOC
## GET /series

### Description
Get all market series. This endpoint allows filtering by series status.

### Method
GET

### Endpoint
/series

#### Query Parameters
- **status** (string) - Optional - Filter by series status. Defaults to undefined.

### Request Example
```typescript
import {
    SeriesApi,
    Configuration
} from 'kalshi-typescript';

const configuration = new Configuration({
    apiKey: 'your-api-key-id',
    privateKeyPath: '/path/to/private-key.pem'
});
const apiInstance = new SeriesApi(configuration);

let status: string;

const { status, data } = await apiInstance.getSeries(status);
```

### Response
#### Success Response (200)
- **data** (object) - Contains the series data.
- **status** (string) - The status of the request.

#### Response Example
```json
{
  "data": [
    {
      "name": "Example Series 1",
      "ticker": "EX1",
      "status": "open",
      "events": []
    }
  ],
  "status": "success"
}
```

#### Error Responses
- **401** - Unauthorized - authentication required
- **500** - Internal server error
```

--------------------------------

### GET /multivariate_event_collections

Source: https://docs.kalshi.com/openapi

Retrieves a paginated list of multivariate event collections. Supports filtering by limit and cursor for pagination.

```APIDOC
## GET /multivariate_event_collections

### Description
Retrieves a list of multivariate event collections. Supports pagination using `limit` and `cursor` query parameters.

### Method
GET

### Endpoint
/multivariate_event_collections

### Parameters
#### Query Parameters
- **limit** (integer) - Optional - Specify the maximum number of results. Minimum: 1, Maximum: 200.
- **cursor** (string) - Optional - The Cursor represents a pointer to the next page of records in the pagination. This optional parameter, when filled, should be filled with the cursor string returned in a previous request to this end-point.

### Response
#### Success Response (200)
- **response** (object) - Contains the list of multivariate event collections.

#### Response Example
{
  "response": "<GetMultivariateEventCollectionsResponse>"
}
```

--------------------------------

### Create Market In Multivariate Event Collection

Source: https://docs.kalshi.com/openapi

Creates a new market within a multivariate event collection. This endpoint allows for the creation of a market based on a selection of predefined markets within a multivariate event.

```APIDOC
## POST /websites/kalshi/markets/multivariate/event/collection

### Description
Creates a new market within a multivariate event collection based on selected markets.

### Method
POST

### Endpoint
/websites/kalshi/markets/multivariate/event/collection

### Parameters
#### Request Body
- **selected_markets** (array) - Required - List of selected markets that act as parameters to determine which market is created.
- **with_market_payload** (boolean) - Optional - Whether to include the market payload in the response.

### Request Example
```json
{
  "selected_markets": [
    {
      "ticker": "SomeTickerPair"
    }
  ],
  "with_market_payload": true
}
```

### Response
#### Success Response (200)
- **event_ticker** (string) - Event ticker for the created market.
- **market_ticker** (string) - Market ticker for the created market.
- **market** (object) - Market payload of the created market.

#### Response Example
```json
{
  "event_ticker": "SomeEventTicker",
  "market_ticker": "SomeMarketTicker",
  "market": {
    "ticker": "CreatedMarketTicker",
    "short_description": "Market Description",
    "long_description": "Detailed Market Description",
    "image_url": "/path/to/image.png",
    "creation_date": "2023-10-27T10:00:00Z",
    "expiration_date": "2023-10-27T12:00:00Z",
    "resolution_date": null,
    "status": "open",
    "best_bid": "10000",
    "best_ask": "10100",
    "last_trade_price_cents": "10050",
    "last_update_time": "2023-10-27T11:00:00Z",
    "volume": 1000,
    "open_interest": 500,
    "is_valid": true,
    "is_resolved": false,
    "is_above_one": true,
    "yes_entry_price_cents": "10000",
    "yes_entry_amount": "0",
    "no_entry_price_cents": "0",
    "no_entry_amount": "0",
    "entity_last_updated_utc": "2023-10-27T11:05:00Z",
    "futures_multiples_of_one_cent": false,
    "autocomplete_on_extreme_prices_with_one_cent_increments": false
  }
}
```
```