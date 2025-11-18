import { Terminal, Send, Database } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CodeTabs from "../CodeTabs";

const ApiEndpoints = () => {
  const codeExamples = [
    {
      language: "http",
      label: "HTTP",
      code: `POST https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username

Headers:
  Content-Type: application/json
  x-api-key: duc_your_api_key_here
  x-token-name: your_token_name

Body:
{
  "usernames": ["user1", "user2", "user3"]
}`
    },
    {
      language: "bash",
      label: "cURL",
      code: `curl -X POST https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: duc_your_api_key_here" \\
  -H "x-token-name: your_token_name" \\
  -d '{"usernames": ["user1", "user2", "user3"]}'`
    },
    {
      language: "javascript",
      label: "JavaScript",
      code: `const response = await fetch('https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': 'duc_your_api_key_here',
    'x-token-name': 'your_token_name'
  },
  body: JSON.stringify({
    usernames: ['user1', 'user2', 'user3']
  })
});

const data = await response.json();
console.log(data.results);`
    },
    {
      language: "python",
      label: "Python",
      code: `import requests

url = 'https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username'
headers = {
    'Content-Type': 'application/json',
    'x-api-key': 'duc_your_api_key_here',
    'x-token-name': 'your_token_name'
}
payload = {
    'usernames': ['user1', 'user2', 'user3']
}

response = requests.post(url, json=payload, headers=headers)
data = response.json()
print(data['results'])`
    },
    {
      language: "javascript",
      label: "Discord.js",
      code: `const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('messageCreate', async (message) => {
  if (message.content.startsWith('!check')) {
    const username = message.content.split(' ')[1];
    
    try {
      const response = await axios.post(
        'https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username',
        { usernames: [username] },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'duc_your_api_key_here',
            'x-token-name': 'your_token_name'
          }
        }
      );
      
      const result = response.data.results[0];
      const status = result.available ? '✅ Available' : '❌ Taken';
      message.reply(\`Username **\${username}** is \${status}\`);
    } catch (error) {
      message.reply('Error checking username: ' + error.message);
    }
  }
});

client.login('YOUR_BOT_TOKEN');`
    },
    {
      language: "python",
      label: "Discord.py",
      code: `import discord
from discord.ext import commands
import requests

bot = commands.Bot(command_prefix='!', intents=discord.Intents.default())

@bot.command()
async def check(ctx, username: str):
    url = 'https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username'
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': 'duc_your_api_key_here',
        'x-token-name': 'your_token_name'
    }
    payload = {'usernames': [username]}
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        result = response.json()['results'][0]
        
        status = '✅ Available' if result['available'] else '❌ Taken'
        await ctx.send(f'Username **{username}** is {status}')
    except Exception as e:
        await ctx.send(f'Error checking username: {str(e)}')

bot.run('YOUR_BOT_TOKEN')`
    }
  ];

  const responseExample = `{
  "results": [
    {
      "username": "user1",
      "available": true,
      "status": "available"
    },
    {
      "username": "user2",
      "available": false,
      "status": "taken"
    },
    {
      "username": "user3",
      "available": true,
      "status": "available"
    }
  ]
}`;

  const authorizationsExample = `Headers:
  x-api-key: string (required)
    Your DUC API key for authentication
    
  x-token-name: string (required)
    Name of the Discord token to use for checking
    
  Content-Type: application/json`;

  const bodyExample = `{
  "usernames": ["user1", "user2", "user3"]
}

Field Details:
  usernames: array[string] (required)
    - Array of Discord usernames to check
    - Maximum 10 usernames per request
    - Each username must be 3-32 characters`;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-white mb-4">API Endpoints</h1>
        <p className="text-lg text-[#a1a1aa]">
          Complete reference for checking Discord username availability.
        </p>
      </div>

      <Card className="p-6 border-[#1a1c20] bg-[#13141a]">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-[#22c55e] text-white">
            <Terminal className="w-6 h-6" />
          </div>
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <Badge className="bg-[#22c55e] hover:bg-[#16a34a] text-white">POST</Badge>
              <h2 className="text-xl font-semibold text-white">Check Username Availability</h2>
            </div>
            <code className="text-sm text-[#22c55e] block">
              /functions/v1/check-api-username
            </code>
            <p className="text-[#a1a1aa]">
              Check the availability of one or more Discord usernames in a single request.
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <Send className="w-6 h-6 text-[#22c55e]" />
          Request Format
        </h2>
        <CodeTabs examples={codeExamples} />
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Authorizations</h2>
        <div className="rounded-lg border border-[#1a1c20] bg-[#0a0b0e] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-[#1a1c20] border-b border-[#27272a]">
            <span className="text-sm font-medium text-white">Request Headers</span>
            <span className="text-xs text-[#a1a1aa]">ApiKeyAuth</span>
          </div>
          <div className="p-4 overflow-x-auto">
            <code className="font-mono text-sm text-[#e5e7eb] whitespace-pre">
              {authorizationsExample}
            </code>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Body</h2>
        <div className="rounded-lg border border-[#1a1c20] bg-[#0a0b0e] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-[#1a1c20] border-b border-[#27272a]">
            <span className="text-sm font-medium text-white">Request Body</span>
            <span className="text-xs text-[#a1a1aa]">application/json</span>
          </div>
          <div className="p-4 overflow-x-auto">
            <code className="font-mono text-sm text-[#e5e7eb] whitespace-pre">
              {bodyExample}
            </code>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Responses</h2>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#22c55e] hover:bg-[#16a34a] text-white">200</Badge>
            <span className="text-white font-medium">Successful operation</span>
            <span className="text-xs text-[#a1a1aa] ml-auto">application/json</span>
          </div>
          
          <div className="rounded-lg border border-[#1a1c20] bg-[#0a0b0e] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-[#1a1c20] border-b border-[#27272a]">
              <span className="text-sm font-medium text-white">Response</span>
              <span className="text-xs text-[#a1a1aa]">object</span>
            </div>
            <div className="p-4 overflow-x-auto max-h-[400px] overflow-y-auto">
              <code className="font-mono text-sm">
                <div className="text-[#e5e7eb]">{'{'}</div>
                <div className="ml-4">
                  <span className="text-[#3b82f6]">"results"</span>
                  <span className="text-[#e5e7eb]">: [</span>
                </div>
                <div className="ml-8 text-[#e5e7eb]">{'{'}</div>
                <div className="ml-12">
                  <span className="text-[#3b82f6]">"username"</span>
                  <span className="text-[#e5e7eb]">: </span>
                  <span className="text-[#22c55e]">"user1"</span>
                  <span className="text-[#e5e7eb]">,</span>
                </div>
                <div className="ml-12">
                  <span className="text-[#3b82f6]">"available"</span>
                  <span className="text-[#e5e7eb]">: </span>
                  <span className="text-[#f59e0b]">true</span>
                  <span className="text-[#e5e7eb]">,</span>
                </div>
                <div className="ml-12">
                  <span className="text-[#3b82f6]">"status"</span>
                  <span className="text-[#e5e7eb]">: </span>
                  <span className="text-[#22c55e]">"available"</span>
                </div>
                <div className="ml-8 text-[#e5e7eb]">{'}'}</div>
                <div className="ml-4 text-[#e5e7eb]">]</div>
                <div className="text-[#e5e7eb]">{'}'}</div>
              </code>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Badge variant="destructive">401</Badge>
            <span className="text-white font-medium">Authentication error</span>
            <span className="text-xs text-[#a1a1aa] ml-auto">application/json</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Response Fields</h2>
        <Card className="border-[#1a1c20] bg-[#13141a]">
          <div className="divide-y divide-[#1a1c20]">
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <code className="text-sm font-mono text-[#22c55e]">results</code>
                  <p className="text-sm text-[#a1a1aa]">
                    Array of result objects, one for each username checked
                  </p>
                </div>
                <Badge variant="outline" className="border-[#27272a] text-[#a1a1aa]">array[object]</Badge>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <code className="text-sm font-mono text-[#22c55e]">results[].username</code>
                  <p className="text-sm text-[#a1a1aa]">
                    The username that was checked
                  </p>
                </div>
                <Badge variant="outline" className="border-[#27272a] text-[#a1a1aa]">string</Badge>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <code className="text-sm font-mono text-[#22c55e]">results[].available</code>
                  <p className="text-sm text-[#a1a1aa]">
                    Boolean indicating if the username is available (true) or taken (false)
                  </p>
                </div>
                <Badge variant="outline" className="border-[#27272a] text-[#a1a1aa]">boolean</Badge>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <code className="text-sm font-mono text-[#22c55e]">results[].status</code>
                  <p className="text-sm text-[#a1a1aa]">
                    Status string: "available", "taken", "rate_limited", "error"
                  </p>
                </div>
                <Badge variant="outline" className="border-[#27272a] text-[#a1a1aa]">string</Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-3">⚡ Performance Tips</h3>
        <ul className="space-y-2 text-sm text-[#a1a1aa]">
          <li>• Batch multiple usernames in a single request for better efficiency</li>
          <li>• Maximum 10 usernames per request to balance speed and reliability</li>
          <li>• Implement exponential backoff for rate-limited responses</li>
          <li>• Cache results when appropriate to reduce API calls</li>
        </ul>
      </div>
    </div>
  );
};

export default ApiEndpoints;
