import CodeTabs from "../CodeTabs";

const CodeExamples = () => {
  const javascriptFetch = `// Using Fetch API
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
    
    if (!response.ok) {
      throw new Error(\`HTTP error! status: \${response.status}\`);
    }
    
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error checking usernames:', error);
    return null;
  }
};

// Usage
const apiKey = 'duc_your_api_key_here';
const tokenName = 'your_token_name';
const usernames = ['cool_user', 'awesome_gamer'];

checkUsernames(apiKey, tokenName, usernames)
  .then(results => {
    results.forEach(result => {
      console.log(\`\${result.username}: \${result.available ? '✅ Available' : '❌ Taken'}\`);
    });
  });`;

  const pythonRequests = `import requests

def check_usernames(api_key, token_name, usernames):
    """Check Discord username availability using DUC API"""
    url = 'https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username'
    
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': api_key,
        'x-token-name': token_name
    }
    
    payload = {'usernames': usernames}
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=60)
        response.raise_for_status()
        
        data = response.json()
        for result in data['results']:
            status = '✅ Available' if result['available'] else '❌ Taken'
            print(f"{result['username']}: {status}")
        
        return data['results']
    except requests.exceptions.RequestException as e:
        print(f'Error: {e}')
        return None

# Usage
api_key = 'duc_your_api_key_here'
token_name = 'your_token_name'
usernames = ['cool_user', 'awesome_gamer']

check_usernames(api_key, tokenName, usernames)`;

  const discordJs = `const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

const API_KEY = 'duc_your_api_key_here';
const TOKEN_NAME = 'your_token_name';
const API_URL = 'https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

async function checkUsernames(usernames) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'x-token-name': TOKEN_NAME
    },
    body: JSON.stringify({ usernames })
  });
  
  return response.ok ? await response.json() : null;
}

client.on('messageCreate', async (message) => {
  if (message.author.bot || !message.content.startsWith('!check')) return;
  
  const args = message.content.split(' ').slice(1);
  if (args.length === 0 || args.length > 10) {
    return message.reply('Usage: !check username1 username2 (max 10)');
  }
  
  const loading = await message.reply('🔍 Checking...');
  const result = await checkUsernames(args);
  
  if (!result) return loading.edit('❌ Error checking usernames');
  
  const embed = new EmbedBuilder()
    .setTitle('Username Check Results')
    .setColor('#5865F2')
    .setDescription(result.results.map(r => 
      \`\\\`\${r.username}\\\`: \${r.available ? '✅ Available' : '❌ Taken'}\`
    ).join('\\n'))
    .setFooter({ text: 'Powered by DUC API' });
  
  loading.edit({ content: null, embeds: [embed] });
});

client.login('YOUR_BOT_TOKEN');`;

  const discordPy = `import discord
from discord.ext import commands
import requests

API_KEY = 'duc_your_api_key_here'
TOKEN_NAME = 'your_token_name'
API_URL = 'https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username'

intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix='!', intents=intents)

def check_usernames_api(usernames):
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'x-token-name': TOKEN_NAME
    }
    
    try:
        response = requests.post(API_URL, headers=headers, json={'usernames': usernames}, timeout=60)
        return response.json() if response.status_code == 200 else None
    except Exception as e:
        print(f'Error: {e}')
        return None

@bot.command(name='check')
async def check_usernames(ctx, *usernames):
    if not usernames or len(usernames) > 10:
        return await ctx.reply('Usage: !check username1 username2 (max 10)')
    
    loading = await ctx.reply('🔍 Checking...')
    result = check_usernames_api(list(usernames))
    
    if not result:
        return await loading.edit(content='❌ Error checking usernames')
    
    embed = discord.Embed(title='Username Check Results', color=discord.Color.blurple())
    embed.description = '\\n'.join([
        f"\`{r['username']}\`: {'✅ Available' if r['available'] else '❌ Taken'}"
        for r in result['results']
    ])
    embed.set_footer(text='Powered by DUC API')
    
    await loading.edit(content=None, embed=embed)

bot.run('YOUR_BOT_TOKEN')`;

  const curlExample = `# Check multiple usernames
curl -X POST https://srqqxvhbzuvfjexvbkbq.supabase.co/functions/v1/check-api-username \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: duc_your_api_key_here" \\
  -H "x-token-name: your_token_name" \\
  -d '{
    "usernames": ["cool_user", "awesome_gamer", "pro_dev"]
  }'

# Expected Response:
# {
#   "results": [
#     {"username": "cool_user", "available": true, "status": "available"},
#     {"username": "awesome_gamer", "available": false, "status": "taken"},
#     {"username": "pro_dev", "available": true, "status": "available"}
#   ]
# }`;

  const examples = [
    { language: "javascript", label: "JavaScript", code: javascriptFetch },
    { language: "python", label: "Python", code: pythonRequests },
    { language: "javascript", label: "Discord.js", code: discordJs },
    { language: "python", label: "Discord.py", code: discordPy },
    { language: "bash", label: "cURL", code: curlExample }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Code Examples</h1>
        <p className="text-lg text-muted-foreground">
          Ready-to-use code examples in multiple programming languages and frameworks.
        </p>
      </div>

      <CodeTabs examples={examples} title="Choose Your Language" />

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">💡 Quick Tips</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Replace <code className="text-primary">duc_your_api_key_here</code> with your actual API key</li>
          <li>• Replace <code className="text-primary">your_token_name</code> with the name of your Discord token</li>
          <li>• All examples include error handling for production use</li>
          <li>• Remember to respect rate limits (60 seconds between requests)</li>
        </ul>
      </div>
    </div>
  );
};

export default CodeExamples;
