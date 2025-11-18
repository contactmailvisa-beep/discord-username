import { useState } from "react";
import { Terminal, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CodeBlock from "../CodeBlock";

const ApiEndpoints = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("HTTP");
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);

  const languages = [
    { id: "HTTP", label: "HTTP" },
    { id: "cURL", label: "cURL" },
    { id: "JavaScript", label: "JavaScript" },
    { id: "Python", label: "Python" },
    { id: "Discord.js", label: "Discord.js" },
    { id: "Discord.py", label: "Discord.py" },
  ];

  const codeExamples: Record<string, { code: string; language: string }> = {
    HTTP: {
      language: "http",
      code: `POST /functions/v1/check-api-username HTTP/1.1
Host: srqqxvhbzuvfjexvbkbq.supabase.co
Content-Type: application/json
x-api-key: duc_your_api_key_here
x-token-name: your_token_name

{
  "usernames": ["user1", "user2", "user3"]
}`
    },
    cURL: {
      language: "bash",
      code: `curl -X POST https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: duc_your_api_key_here" \\
  -H "x-token-name: your_token_name" \\
  -d '{"usernames": ["user1", "user2", "user3"]}'`
    },
    JavaScript: {
      language: "javascript",
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
    Python: {
      language: "python",
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
    "Discord.js": {
      language: "javascript",
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
    "Discord.py": {
      language: "python",
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
  };

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

      {/* Request Format Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Request Format</h2>
          <div className="relative">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1c20] hover:bg-[#27272a] text-white rounded-lg border border-[#27272a] transition-colors"
            >
              <span className="text-sm font-medium">{selectedLanguage}</span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#1a1c20] border border-[#27272a] rounded-lg shadow-lg z-10 overflow-hidden">
                {languages.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => {
                      setSelectedLanguage(lang.id);
                      setIsLanguageDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                      selectedLanguage === lang.id
                        ? 'bg-[#22c55e] text-white'
                        : 'text-[#a1a1aa] hover:bg-[#27272a] hover:text-white'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <CodeBlock
          code={codeExamples[selectedLanguage].code}
          language={codeExamples[selectedLanguage].language}
        />
      </div>

      {/* Authorizations Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Authorizations</h2>
        <div className="rounded-lg border border-[#1a1c20] bg-[#13141a] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#1a1c20] border-b border-[#27272a]">
            <span className="text-sm font-medium text-white">ApiKeyAuth</span>
            <span className="text-xs text-[#a1a1aa]">string</span>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div>
                <code className="text-sm font-mono text-[#22c55e]">x-api-key</code>
                <span className="text-sm text-[#f59e0b] ml-2">required</span>
                <p className="text-sm text-[#a1a1aa] mt-1">
                  Your DUC API key for authentication
                </p>
              </div>
              <div>
                <code className="text-sm font-mono text-[#22c55e]">x-token-name</code>
                <span className="text-sm text-[#f59e0b] ml-2">required</span>
                <p className="text-sm text-[#a1a1aa] mt-1">
                  Name of the Discord token to use for checking
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Body</h2>
        <div className="rounded-lg border border-[#1a1c20] bg-[#13141a] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-[#1a1c20] border-b border-[#27272a]">
            <span className="text-sm font-medium text-white">application/json</span>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              <div>
                <code className="text-sm font-mono text-[#22c55e]">usernames</code>
                <span className="text-sm text-[#f59e0b] ml-2">required</span>
                <Badge variant="outline" className="border-[#27272a] text-[#a1a1aa] ml-2">array[string]</Badge>
                <p className="text-sm text-[#a1a1aa] mt-1">
                  Array of Discord usernames to check (maximum 10 per request)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responses Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Responses</h2>
        
        {/* 200 Response */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className="bg-[#22c55e] hover:bg-[#16a34a] text-white">200</Badge>
            <span className="text-white font-medium">Successful operation</span>
          </div>
          
          <CodeBlock
            code={`{
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
}`}
            language="json"
          />

          {/* 401 Response */}
          <div className="flex items-center gap-2 mt-6">
            <Badge variant="destructive">401</Badge>
            <span className="text-white font-medium">Authentication error</span>
          </div>
          
          <CodeBlock
            code={`{
  "error": "Invalid or missing API key"
}`}
            language="json"
          />
        </div>
      </div>

      {/* Response Fields */}
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
    </div>
  );
};

export default ApiEndpoints;
