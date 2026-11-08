// AccounTech Universal AI Intelligence Service
// Supports Cloud AI (Google Gemini, OpenAI), 100% Offline Local AI (Ollama),
// and a Built-in Offline Financial Computation Engine.

import { Transaction, Invoice, Expense, Budget, Company } from './entities';

const AI_CONFIG_KEY = 'accountech_ai_config';

export const DEFAULT_AI_CONFIG = {
  provider: 'gemini', // 'gemini' | 'openai' | 'ollama' | 'builtin'
  geminiApiKey: '',
  geminiModel: 'gemini-1.5-flash',
  openaiApiKey: '',
  openaiModel: 'gpt-4o-mini',
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'llama3:latest'
};

export function getAIConfig() {
  try {
    const raw = localStorage.getItem(AI_CONFIG_KEY);
    return raw ? { ...DEFAULT_AI_CONFIG, ...JSON.parse(raw) } : { ...DEFAULT_AI_CONFIG };
  } catch {
    return { ...DEFAULT_AI_CONFIG };
  }
}

export function saveAIConfig(config) {
  try {
    localStorage.setItem(AI_CONFIG_KEY, JSON.stringify(config));
    return true;
  } catch (e) {
    console.error('Failed to save AI config:', e);
    return false;
  }
}

// Build live financial snapshot for AI context
export async function getFinancialContext() {
  try {
    const [transactions, invoices, expenses, budgets, companies] = await Promise.all([
      Transaction.list('-date', 20),
      Invoice.list('-created_date', 15),
      Expense.list('-date', 15),
      Budget.list('-created_date', 10),
      Company.list()
    ]);

    const company = companies[0] || { name: 'My Business', currency: 'USD' };
    const curr = company.currency || 'USD';

    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const totalExpenses = expenses
      .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

    const netIncome = totalIncome - totalExpenses;
    const pendingInvoices = invoices.filter(i => i.status === 'pending');
    const pendingTotal = pendingInvoices.reduce((sum, i) => sum + (Number(i.total_amount) || 0), 0);

    const recentTxSummary = transactions.slice(0, 5).map(t => 
      `- ${t.date}: ${t.description} (${t.type.toUpperCase()}) ${curr} ${Number(t.amount).toLocaleString()}`
    ).join('\n');

    const pendingInvSummary = pendingInvoices.slice(0, 5).map(i =>
      `- Invoice #${i.invoice_number || i.id} for ${i.client_name}: ${curr} ${Number(i.total_amount).toLocaleString()} (Due: ${i.due_date || 'N/A'})`
    ).join('\n');

    return {
      companyName: company.name,
      currency: curr,
      totalIncome,
      totalExpenses,
      netIncome,
      pendingCount: pendingInvoices.length,
      pendingTotal,
      recentTxSummary,
      pendingInvSummary,
      activeBudgetsCount: budgets.length,
      rawSummary: `
Company: ${company.name} (Currency: ${curr})
Financial Overview:
- Total Recorded Revenue: ${curr} ${totalIncome.toLocaleString()}
- Total Recorded Expenses: ${curr} ${totalExpenses.toLocaleString()}
- Net Profit: ${curr} ${netIncome.toLocaleString()} (${totalIncome > 0 ? ((netIncome / totalIncome) * 100).toFixed(1) : 0}% profit margin)
- Pending Invoices: ${pendingInvoices.length} invoices totaling ${curr} ${pendingTotal.toLocaleString()}

Recent Ledger Transactions:
${recentTxSummary || 'None recorded yet.'}

Pending Unpaid Invoices:
${pendingInvSummary || 'No pending invoices.'}
`
    };
  } catch (e) {
    console.error('Error gathering financial context:', e);
    return {
      companyName: 'AccounTech Client',
      currency: 'USD',
      totalIncome: 0,
      totalExpenses: 0,
      netIncome: 0,
      rawSummary: 'Financial data ledger currently offline.'
    };
  }
}

// Built-in intelligent financial analyst (Offline Fallback)
function generateBuiltInFinancialResponse(userPrompt, context) {
  const q = userPrompt.toLowerCase();
  const c = context.currency;

  if (q.includes('revenue') || q.includes('income') || q.includes('make') || q.includes('earn')) {
    return `📈 **Revenue & Income Overview**\n\n• **Total Revenue:** ${c} ${context.totalIncome.toLocaleString()}\n• **Net Profit:** ${c} ${context.netIncome.toLocaleString()}\n\nRecent earnings are looking healthy! You have ${context.pendingCount} pending invoices worth ${c} ${context.pendingTotal.toLocaleString()} waiting for collection.`;
  }

  if (q.includes('expense') || q.includes('spend') || q.includes('cost') || q.includes('cut')) {
    return `📊 **Expense Analysis**\n\n• **Total Recorded Expenses:** ${c} ${context.totalExpenses.toLocaleString()}\n• **Net Margin:** ${context.totalIncome > 0 ? ((context.netIncome / context.totalIncome) * 100).toFixed(1) : 0}%\n\n💡 **Optimization Tip:** Review your top recurring subscriptions and software vendor line items to improve your cash margin.`;
  }

  if (q.includes('invoice') || q.includes('bill') || q.includes('pending') || q.includes('due') || q.includes('client')) {
    if (context.pendingCount > 0) {
      return `📋 **Outstanding Invoices (${context.pendingCount})**\n\nTotal Pending: **${c} ${context.pendingTotal.toLocaleString()}**\n\n${context.pendingInvSummary}\n\nWould you like me to draft a polite payment reminder for any of these clients?`;
    }
    return `✅ **Invoices All Clear!**\n\nAll client invoices are currently marked as paid. Great cash flow discipline!`;
  }

  if (q.includes('profit') || q.includes('margin') || q.includes('health')) {
    return `💰 **Profitability Report for ${context.companyName}**\n\n• **Gross Revenue:** ${c} ${context.totalIncome.toLocaleString()}\n• **Operating Expenses:** ${c} ${context.totalExpenses.toLocaleString()}\n• **Net Profit:** ${c} ${context.netIncome.toLocaleString()}\n• **Profit Margin:** ${context.totalIncome > 0 ? ((context.netIncome / context.totalIncome) * 100).toFixed(1) : 0}%\n\nYour business is operating at a ${context.netIncome >= 0 ? 'profitable' : 'negative'} balance.`;
  }

  // General helpful response
  return `🤖 **Jarvis Financial Assistant**\n\nI analyzed your prompt: "${userPrompt}" against your ledger for **${context.companyName}**.\n\n• Current Net Income: **${c} ${context.netIncome.toLocaleString()}**\n• Active Pending Invoices: **${c} ${context.pendingTotal.toLocaleString()}**\n\n*(Tip: You can add a Google Gemini or OpenAI API key in AI Settings to enable open-ended conversation and deep tax recommendations!)*`;
}

// Master AI Query Function
export async function askAI(userPrompt, history = []) {
  const config = getAIConfig();
  const context = await getFinancialContext();

  const systemInstruction = `You are Jarvis, an elite AI CFO and Financial Co-Pilot for the desktop software "AccounTech Co-Pilot".
You are speaking directly with the business owner of ${context.companyName}.
You have direct, real-time access to their financial ledger. Always reference their actual numbers when answering questions.
Be concise, professional, insightful, and actionable. Use bullet points and emoji sparingly for readability.

CURRENT FINANCIAL LEDGER DATA:
${context.rawSummary}
`;

  // 1. Google Gemini API
  if (config.provider === 'gemini' && config.geminiApiKey) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel || 'gemini-1.5-flash'}:generateContent?key=${config.geminiApiKey}`;
      
      const contents = [];
      // Add conversation history
      if (Array.isArray(history) && history.length > 0) {
        history.slice(-6).forEach(m => {
          contents.push({
            role: m.type === 'user' ? 'user' : 'model',
            parts: [{ text: m.message || m.content || '' }]
          });
        });
      }

      // Add current message with system instructions
      contents.push({
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\nUser Question: ${userPrompt}` }]
      });

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1000
          }
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `Gemini API returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (reply) return reply;
      throw new Error('No response text generated by Gemini.');
    } catch (e) {
      console.warn('Gemini request failed, falling back to local engine:', e.message);
      return `⚠️ *(Gemini API Notice: ${e.message})*\n\n` + generateBuiltInFinancialResponse(userPrompt, context);
    }
  }

  // 2. OpenAI API
  if (config.provider === 'openai' && config.openaiApiKey) {
    try {
      const messages = [
        { role: 'system', content: systemInstruction },
        ...history.slice(-6).map(m => ({
          role: m.type === 'user' ? 'user' : 'assistant',
          content: m.message || m.content || ''
        })),
        { role: 'user', content: userPrompt }
      ];

      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.openaiApiKey}`
        },
        body: JSON.stringify({
          model: config.openaiModel || 'gpt-4o-mini',
          messages,
          temperature: 0.7
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error?.message || `OpenAI API returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data.choices?.[0]?.message?.content;
      if (reply) return reply;
      throw new Error('No response text generated by OpenAI.');
    } catch (e) {
      console.warn('OpenAI request failed, falling back to local engine:', e.message);
      return `⚠️ *(OpenAI API Notice: ${e.message})*\n\n` + generateBuiltInFinancialResponse(userPrompt, context);
    }
  }

  // 3. Ollama (100% Offline Local AI)
  if (config.provider === 'ollama') {
    try {
      const fullPrompt = `${systemInstruction}\n\nUser Question: ${userPrompt}\n\nAnswer:`;
      const res = await fetch(`${config.ollamaUrl || 'http://localhost:11434'}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: config.ollamaModel || 'llama3:latest',
          prompt: fullPrompt,
          stream: false
        })
      });

      if (!res.ok) {
        throw new Error(`Ollama returned status ${res.status}. Is Ollama running on your machine?`);
      }

      const data = await res.json();
      if (data.response) return data.response;
      throw new Error('Empty response from Ollama.');
    } catch (e) {
      console.warn('Ollama request failed, falling back to local engine:', e.message);
      return `⚠️ *(Local Ollama Notice: ${e.message})*\n\n` + generateBuiltInFinancialResponse(userPrompt, context);
    }
  }

  // 4. Fallback: Intelligent Local Financial Rule Engine
  return generateBuiltInFinancialResponse(userPrompt, context);
}

// Test Provider Connection
export async function testAIConnection(configToTest) {
  const config = configToTest || getAIConfig();
  
  if (config.provider === 'gemini') {
    if (!config.geminiApiKey) {
      return { success: false, message: 'Please enter a Google Gemini API Key first.' };
    }
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.geminiModel || 'gemini-1.5-flash'}:generateContent?key=${config.geminiApiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: 'Hello, respond with the word "Connected" in 1 word.' }] }]
        })
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, message: err.error?.message || `Status: ${res.status}` };
      }
      return { success: true, message: 'Successfully connected to Google Gemini!' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  if (config.provider === 'openai') {
    if (!config.openaiApiKey) {
      return { success: false, message: 'Please enter an OpenAI API Key first.' };
    }
    try {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${config.openaiApiKey}` }
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        return { success: false, message: err.error?.message || `Status: ${res.status}` };
      }
      return { success: true, message: 'Successfully connected to OpenAI!' };
    } catch (e) {
      return { success: false, message: e.message };
    }
  }

  if (config.provider === 'ollama') {
    try {
      const res = await fetch(`${config.ollamaUrl || 'http://localhost:11434'}/api/tags`);
      if (!res.ok) return { success: false, message: 'Ollama is not responding at ' + config.ollamaUrl };
      const data = await res.json();
      const models = (data.models || []).map(m => m.name).join(', ');
      return { success: true, message: `Connected to Ollama! Available models: ${models || 'None pulled yet'}` };
    } catch (e) {
      return { success: false, message: `Cannot connect to Ollama (${e.message}). Ensure Ollama is running.` };
    }
  }

  return { success: true, message: 'Using Built-in Offline Financial Intelligence Engine.' };
}
