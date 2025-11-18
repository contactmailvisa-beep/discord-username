# 🚀 DUC — Discord Username Checker API

<div align="center">
  <img src="./src/assets/duc-logo.png" alt="DUC Logo" width="150" height="150" />
  <h3>The Ultimate Discord Username Availability Checker</h3>
  <p>Fast, Reliable, and Developer-Friendly API</p>
</div>

---

## 📖 Overview

**DUC (Discord Username Checker)** is a powerful platform that allows developers to check Discord username availability programmatically using real Discord API calls. Our service provides a comprehensive API that can be integrated into any application, website, or Discord bot.

### ✨ Key Features

- ✅ **Real-Time Checking** - Direct integration with Discord's API for accurate results
- 🔐 **API Key Authentication** - Secure access with personal API keys
- 🚀 **High Performance** - Fast response times with intelligent rate limiting
- 📊 **Usage Analytics** - Track your API usage and statistics
- 🔄 **Token Rotation** - Automatic Discord token management
- 💎 **Premium Plans** - Enhanced limits for power users

---

## 🎯 API Features

### API Key System

Each user can generate multiple API keys with customizable settings:

- **Custom Labels** - Name your API keys for easy identification
- **Usage Tracking** - Monitor requests, last used time, and statistics
- **Rate Limiting** - Built-in protection against abuse
- **Easy Management** - Generate, rename, revoke, or reset keys instantly

### Rate Limits

| Plan | Daily Requests | Cooldown Between Requests | Usernames Per Request |
|------|---------------|---------------------------|----------------------|
| Free | 50 requests/day | 60 seconds | Up to 10 usernames |
| Premium | 100 requests/day | 60 seconds | Up to 10 usernames |

---

## 🔌 API Endpoints

### 1. Check Username Availability

**Endpoint:** `POST https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username`

**Headers:**
```
Content-Type: application/json
x-api-key: YOUR_API_KEY
x-token-name: YOUR_TOKEN_NAME
```

**Request Body:**
```json
{
  "usernames": ["username1", "username2", "username3"]
}
```

**Response:**
```json
{
  "results": [
    {
      "username": "username1",
      "available": true,
      "status": "available"
    },
    {
      "username": "username2",
      "available": false,
      "status": "taken"
    }
  ]
}
```

### 2. Get User Information

**Endpoint:** `GET https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/user`

Get detailed information about your account including premium status, API usage stats, and account details.

**Headers:**
```
Content-Type: application/json
x-api-key: YOUR_API_KEY
```

**Response:**
```json
{
  "username": "your_username",
  "created_at": "2024-01-01T00:00:00Z",
  "avatar_url": "https://...",
  "is_premium": true,
  "premium_plan": "premium",
  "premium_expires": "2024-12-31T23:59:59Z",
  "api_stats": {
    "total_keys": 3,
    "active_keys": 2,
    "daily_limit": 100,
    "requests_today": 45,
    "requests_remaining": 55
  }
}
```

### 3. Get Saved Usernames

**Endpoint:** `GET https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/saved`

Retrieve all your saved/favorited usernames with their notes and metadata.

**Headers:**
```
Content-Type: application/json
x-api-key: YOUR_API_KEY
```

**Response:**
```json
{
  "total": 5,
  "saved_usernames": [
    {
      "username": "cool_username",
      "notes": "Perfect for gaming",
      "saved_at": "2024-01-15T10:30:00Z",
      "is_claimed": false
    },
    {
      "username": "awesome_dev",
      "notes": null,
      "saved_at": "2024-01-14T15:20:00Z",
      "is_claimed": false
    }
  ]
}
```

### 4. Get Statistics

**Endpoint:** `GET https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/stats`

Get comprehensive statistics about your token usage, check history, and activity.

**Headers:**
```
Content-Type: application/json
x-api-key: YOUR_API_KEY
```

**Response:**
```json
{
  "tokens": {
    "total": 5,
    "active": 3,
    "inactive": 2
  },
  "checks": {
    "total": 150,
    "available_found": 45,
    "taken_found": 105
  },
  "saved_usernames": 12,
  "last_api_request": "2024-01-15T14:30:00Z"
}
```

---

## 💻 Code Examples

### Check Username Availability

### JavaScript (Fetch API)

```javascript
const checkUsernames = async (apiKey, tokenName, usernames) => {
  try {
    const response = await fetch('https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'x-token-name': tokenName
      },
      body: JSON.stringify({ usernames })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Results:', data.results);
      return data.results;
    } else {
      console.error('Error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Request failed:', error);
    return null;
  }
};

// Usage
const apiKey = 'duc_your_api_key_here';
const tokenName = 'your_token_name';
const usernames = ['cool_user', 'awesome_gamer', 'pro_dev'];

checkUsernames(apiKey, tokenName, usernames);
```

### JavaScript (Axios)

```javascript
const axios = require('axios');

const checkUsernames = async (apiKey, tokenName, usernames) => {
  try {
    const response = await axios.post(
      'https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username',
      { usernames },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'x-token-name': tokenName
        }
      }
    );
    
    console.log('Results:', response.data.results);
    return response.data.results;
  } catch (error) {
    console.error('Error:', error.response?.data?.error || error.message);
    return null;
  }
};

// Usage
const apiKey = 'duc_your_api_key_here';
const tokenName = 'your_token_name';
const usernames = ['cool_user', 'awesome_gamer', 'pro_dev'];

checkUsernames(apiKey, tokenName, usernames);
```

### Python (Requests)

```python
import requests
import json

def check_usernames(api_key, token_name, usernames):
    """
    Check Discord username availability using DUC API
    
    Args:
        api_key (str): Your DUC API key
        token_name (str): Your Discord token name
        usernames (list): List of usernames to check (max 10)
    
    Returns:
        dict: API response with results
    """
    url = 'https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username'
    
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': api_key,
        'x-token-name': token_name
    }
    
    payload = {
        'usernames': usernames
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            print('Results:')
            for result in data.get('results', []):
                status = '✅ Available' if result['available'] else '❌ Taken'
                print(f"  {result['username']}: {status}")
            return data
        else:
            error_data = response.json()
            print(f"Error: {error_data.get('error', 'Unknown error')}")
            return None
            
    except requests.exceptions.Timeout:
        print('Request timed out')
        return None
    except requests.exceptions.RequestException as e:
        print(f'Request failed: {str(e)}')
        return None

# Usage
if __name__ == '__main__':
    api_key = 'duc_your_api_key_here'
    token_name = 'your_token_name'
    usernames = ['cool_user', 'awesome_gamer', 'pro_dev']
    
    check_usernames(api_key, token_name, usernames)
```

### Python (Flask Web App)

```python
from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

# Your DUC API credentials
API_KEY = 'duc_your_api_key_here'
TOKEN_NAME = 'your_token_name'
DUC_API_URL = 'https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username'

@app.route('/check', methods=['POST'])
def check_usernames():
    """
    Endpoint to check username availability
    Expects JSON: {"usernames": ["user1", "user2"]}
    """
    data = request.get_json()
    
    if not data or 'usernames' not in data:
        return jsonify({'error': 'Missing usernames parameter'}), 400
    
    usernames = data['usernames']
    
    if not isinstance(usernames, list) or len(usernames) > 10:
        return jsonify({'error': 'Usernames must be a list with max 10 items'}), 400
    
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'x-token-name': TOKEN_NAME
    }
    
    try:
        response = requests.post(
            DUC_API_URL,
            headers=headers,
            json={'usernames': usernames},
            timeout=60
        )
        
        if response.status_code == 200:
            return jsonify(response.json()), 200
        else:
            return jsonify(response.json()), response.status_code
            
    except requests.exceptions.Timeout:
        return jsonify({'error': 'Request timeout'}), 408
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
```

### Discord.js (Discord Bot)

```javascript
const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

// Your DUC API credentials
const API_KEY = 'duc_your_api_key_here';
const TOKEN_NAME = 'your_token_name';
const DUC_API_URL = 'https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Function to check usernames
async function checkUsernames(usernames) {
  try {
    const response = await fetch(DUC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'x-token-name': TOKEN_NAME
      },
      body: JSON.stringify({ usernames })
    });
    
    const data = await response.json();
    return response.ok ? data : null;
  } catch (error) {
    console.error('API Error:', error);
    return null;
  }
}

// Command handler
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  
  // !check username1 username2 username3
  if (message.content.startsWith('!check')) {
    const args = message.content.split(' ').slice(1);
    
    if (args.length === 0) {
      return message.reply('❌ Please provide usernames to check!\nUsage: `!check username1 username2`');
    }
    
    if (args.length > 10) {
      return message.reply('❌ Maximum 10 usernames per request!');
    }
    
    const loading = await message.reply('🔍 Checking usernames...');
    
    const result = await checkUsernames(args);
    
    if (!result) {
      return loading.edit('❌ Failed to check usernames. Please try again later.');
    }
    
    // Create embed with results
    const embed = new EmbedBuilder()
      .setTitle('📊 Username Check Results')
      .setColor('#5865F2')
      .setTimestamp();
    
    let description = '';
    result.results.forEach(r => {
      const status = r.available ? '✅ **Available**' : '❌ **Taken**';
      description += `\`${r.username}\`: ${status}\n`;
    });
    
    embed.setDescription(description);
    embed.setFooter({ text: 'Powered by DUC API' });
    
    loading.edit({ content: null, embeds: [embed] });
  }
});

client.on('ready', () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
});

client.login('YOUR_DISCORD_BOT_TOKEN');
```

### Discord.py (Discord Bot)

```python
import discord
from discord.ext import commands
import requests
import asyncio

# Your DUC API credentials
API_KEY = 'duc_your_api_key_here'
TOKEN_NAME = 'your_token_name'
DUC_API_URL = 'https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username'

# Bot setup
intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

def check_usernames_api(usernames):
    """Call DUC API to check usernames"""
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'x-token-name': TOKEN_NAME
    }
    
    payload = {'usernames': usernames}
    
    try:
        response = requests.post(DUC_API_URL, headers=headers, json=payload, timeout=60)
        if response.status_code == 200:
            return response.json()
        else:
            return None
    except Exception as e:
        print(f'API Error: {e}')
        return None

@bot.command(name='check')
async def check_usernames(ctx, *usernames):
    """
    Check Discord username availability
    Usage: !check username1 username2 username3
    """
    if not usernames:
        await ctx.reply('❌ Please provide usernames to check!\nUsage: `!check username1 username2`')
        return
    
    if len(usernames) > 10:
        await ctx.reply('❌ Maximum 10 usernames per request!')
        return
    
    # Send loading message
    loading = await ctx.reply('🔍 Checking usernames...')
    
    # Check usernames
    result = check_usernames_api(list(usernames))
    
    if not result:
        await loading.edit(content='❌ Failed to check usernames. Please try again later.')
        return
    
    # Create embed with results
    embed = discord.Embed(
        title='📊 Username Check Results',
        color=discord.Color.blurple(),
        timestamp=discord.utils.utcnow()
    )
    
    description = ''
    for r in result.get('results', []):
        status = '✅ **Available**' if r['available'] else '❌ **Taken**'
        description += f"`{r['username']}`: {status}\n"
    
    embed.description = description
    embed.set_footer(text='Powered by DUC API')
    
    await loading.edit(content=None, embed=embed)

@bot.event
async def on_ready():
    print(f'✅ Bot logged in as {bot.user.name}')
    print(f'Bot ID: {bot.user.id}')

# Run bot
bot.run('YOUR_DISCORD_BOT_TOKEN')
```

### cURL (Command Line)

```bash
curl -X POST https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username \
  -H "Content-Type: application/json" \
  -H "x-api-key: duc_your_api_key_here" \
  -H "x-token-name: your_token_name" \
  -d '{
    "usernames": ["cool_user", "awesome_gamer", "pro_dev"]
  }'
```

### Get User Information

#### JavaScript (Fetch API)

```javascript
const getUserInfo = async (apiKey) => {
  try {
    const response = await fetch('https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/user', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('User Info:', data);
      return data;
    } else {
      console.error('Error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Request failed:', error);
    return null;
  }
};

// Usage
const apiKey = 'duc_your_api_key_here';
getUserInfo(apiKey);
```

#### Python

```python
import requests

def get_user_info(api_key):
    url = 'https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/user'
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': api_key
    }
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print('User Info:', data)
            return data
        else:
            print('Error:', response.json().get('error'))
            return None
    except Exception as e:
        print('Request failed:', str(e))
        return None

# Usage
api_key = 'duc_your_api_key_here'
get_user_info(api_key)
```

#### cURL

```bash
curl -X GET https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/user \
  -H "Content-Type: application/json" \
  -H "x-api-key: duc_your_api_key_here"
```

### Get Saved Usernames

#### JavaScript (Fetch API)

```javascript
const getSavedUsernames = async (apiKey) => {
  try {
    const response = await fetch('https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/saved', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Saved Usernames:', data);
      console.log(`Total saved: ${data.total}`);
      return data;
    } else {
      console.error('Error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Request failed:', error);
    return null;
  }
};

// Usage
const apiKey = 'duc_your_api_key_here';
getSavedUsernames(apiKey);
```

#### Python

```python
import requests

def get_saved_usernames(api_key):
    url = 'https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/saved'
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': api_key
    }
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print(f"Total saved: {data['total']}")
            print('Saved Usernames:', data['saved_usernames'])
            return data
        else:
            print('Error:', response.json().get('error'))
            return None
    except Exception as e:
        print('Request failed:', str(e))
        return None

# Usage
api_key = 'duc_your_api_key_here'
get_saved_usernames(api_key)
```

#### cURL

```bash
curl -X GET https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/saved \
  -H "Content-Type: application/json" \
  -H "x-api-key: duc_your_api_key_here"
```

### Get Statistics

#### JavaScript (Fetch API)

```javascript
const getStats = async (apiKey) => {
  try {
    const response = await fetch('https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/stats', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Statistics:', data);
      console.log(`Total tokens: ${data.tokens.total}`);
      console.log(`Active tokens: ${data.tokens.active}`);
      console.log(`Total checks: ${data.checks.total}`);
      console.log(`Available found: ${data.checks.available_found}`);
      return data;
    } else {
      console.error('Error:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Request failed:', error);
    return null;
  }
};

// Usage
const apiKey = 'duc_your_api_key_here';
getStats(apiKey);
```

#### Python

```python
import requests

def get_stats(api_key):
    url = 'https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/stats'
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': api_key
    }
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            print('Statistics:', data)
            print(f"Total tokens: {data['tokens']['total']}")
            print(f"Active tokens: {data['tokens']['active']}")
            print(f"Total checks: {data['checks']['total']}")
            print(f"Available found: {data['checks']['available_found']}")
            return data
        else:
            print('Error:', response.json().get('error'))
            return None
    except Exception as e:
        print('Request failed:', str(e))
        return None

# Usage
api_key = 'duc_your_api_key_here'
get_stats(api_key)
```

#### cURL

```bash
curl -X GET https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/stats \
  -H "Content-Type: application/json" \
  -H "x-api-key: duc_your_api_key_here"
```

---

## 🔐 Getting Started

### 1. Create an Account
Visit [discord-username.lovable.app](https://discord-username.lovable.app) and create an account.

### 2. Add Discord Token
Navigate to the Tokens section and add your Discord API token.

### 3. Generate API Key
Go to your Profile and generate a new API key with a custom label.

### 4. Start Using
Use the API key and token name in your requests to check usernames!

---

## 📊 Response Status Codes

| Status Code | Description |
|------------|-------------|
| `200` | Success - Results returned |
| `400` | Bad Request - Invalid parameters |
| `401` | Unauthorized - Invalid API key |
| `403` | Forbidden - User banned or insufficient permissions |
| `408` | Request Timeout - Request took too long |
| `429` | Rate Limited - Too many requests |
| `500` | Internal Server Error - Server-side issue |

## ⚠️ Error Responses

```json
{
  "error": "Error message description"
}
```

Common error messages:
- `"API key مطلوب"` - API key is required
- `"Token name مطلوب"` - Token name is required
- `"الحد الأقصى 10 أسماء مستخدم"` - Maximum 10 usernames per request
- `"لقد تم حظرك من استخدام API Keys"` - You are banned from using API keys
- `"خطأ في الاتصال"` - Connection error

---

## 🎁 Premium Plans

Upgrade to Premium for enhanced features:

- ✅ **100 Requests/Day** (vs 50 on Free)
- ✅ **Priority Processing**
- ✅ **Advanced Analytics**
- ✅ **Premium Support**

**Price:** $3/month via PayPal

---

## 🛡️ Security & Best Practices

### API Key Security
- ✅ Never share your API keys publicly
- ✅ Rotate keys regularly using the Reset function
- ✅ Use environment variables to store keys
- ✅ Monitor usage for suspicious activity

### Rate Limiting
- ✅ Respect the 60-second cooldown between requests
- ✅ Don't exceed daily limits
- ✅ Implement proper error handling for rate limit responses

---

## 📞 Support

Need help? We're here for you:

- 📧 **Email:** support@discord-username.lovable.app
- 🌐 **Website:** [discord-username.lovable.app](https://discord-username.lovable.app)
- 📚 **Documentation:** [discord-username.lovable.app/docs](https://discord-username.lovable.app/docs)

---

## 📄 License

All rights reserved © DUC (Discord Username Checker)

**Important Notice:** This service uses Discord's API for username checking. We are not affiliated with or endorsed by Discord Inc. Use of this service must comply with Discord's Terms of Service and API Guidelines.

---

<div align="center">
  <p>Made with ❤️ by the DUC Team</p>
  <p>
    <a href="https://discord-username.lovable.app">Website</a> •
    <a href="https://discord-username.lovable.app/docs">Documentation</a> •
    <a href="https://discord-username.lovable.app/dashboard/premium">Premium</a>
  </p>
</div>
