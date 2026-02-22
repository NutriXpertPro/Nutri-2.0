#!/usr/bin/env node
/**
 * Qwen Agent Orchestrator v2.0
 * - Uses .agent/index.json for instant agent/skill lookup
 * - Integrates with your existing .agent/ ecosystem
 * - Requires explicit approval before commit/deploy
 */

const fs = require('fs').promises;
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function prompt(message) {
  return new Promise(resolve => {
    rl.question(`${message} (y/N): `, ans => {
      resolve(ans.toLowerCase().trim() === 'y');
    });
  });
}

async function loadIndex() {
  try {
    const data = await fs.readFile(path.join(__dirname, '..', '..', '.agent', 'index.json'), 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('❌ Failed to load .agent/index.json:', err.message);
    process.exit(1);
  }
}

function findAgents(index, query) {
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2);
  return index.agents.filter(agent => {
    const text = (agent.description + ' ' + agent.skills.join(' ') + ' ' + agent.name).toLowerCase();
    return terms.every(term => text.includes(term));
  });
}

async function main() {
  const args = process.argv.slice(2);
  let targetFile = null;
  let userQuery = '';

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && i + 1 < args.length) {
      targetFile = args[i + 1];
    } else if (args[i] === '--query') {
      userQuery = args.slice(i + 1).join(' ');
    }
  }

  if (!userQuery) {
    console.error('Usage: node runner.js --query "corrija erro X na pagina Y" [--file <file>]');
    process.exit(1);
  }

  console.log(`🔍 Analyzing query: "${userQuery}"`);
  const index = await loadIndex();
  const candidates = findAgents(index, userQuery);

  console.log(`\n🎯 Candidate agents (${candidates.length}):`);
  candidates.forEach((a, i) => {
    console.log(`  ${i+1}. ${a.name} — ${a.description.substring(0, 60)}${a.description.length > 60 ? '...' : ''}`);
  });

  if (candidates.length === 0) {
    console.warn('\n⚠️  No agents matched. Falling back to orchestrator.');
    const orch = index.agents.find(a => a.name === 'orquestrador');
    if (orch) candidates.push(orch);
  }

  console.log('\n✅ Ready to orchestrate. Next steps:');
  console.log('  1. Load context (read file, grep error)');
  console.log('  2. Invoke selected agents in parallel');
  console.log('  3. Synthesize solution');
  console.log('  4. Show diff → wait for YOUR approval');
  console.log('  5. Commit only if you say YES');

  const proceed = await prompt('Do you want to simulate this workflow?');
  if (!proceed) {
    console.log('⏹️  Aborted.');
    rl.close();
    return;
  }

  console.log('\n🚀 Workflow simulation started...');
  console.log('1. Context loaded (simulated)');
  console.log('2. Invoking agents: ', candidates.map(a => a.name));
  await prompt('Review proposed solution?');
  console.log('✅ Solution approved');
  await prompt('Apply changes to file?');
  console.log('✅ Changes applied');
  await prompt('Show git diff before commit?');
  console.log('✅ Diff reviewed');
  const commitOk = await prompt('Commit these changes?');
  if (commitOk) {
    console.log('\n🟢 Commit would run now — but in real use, Qwen Code shows exact git diff first.');
  } else {
    console.log('\n🟡 Commit cancelled. Changes remain staged.');
  }

  rl.close();
}

if (require.main === module) {
  main().catch(console.error);
}