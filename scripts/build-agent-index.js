#!/usr/bin/env node
/**
 * build-agent-index.js (v3) - Final version
 * - Loads .agent/agents/.index-overrides.json for Markdown-only agents
 * - Robust header parsing
 * - Includes all 40 agents
 */

const fs = require('fs').promises;
const path = require('path');

// ... [parser functions idênticas às anteriores] ...

async function loadOverrides(agentsDir) {
  try {
    const data = await fs.readFile(path.join(agentsDir, '.index-overrides.json'), 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return {};
  }
}

async function indexAgents(agentDir) {
  const overrides = await loadOverrides(agentDir);
  const files = await fs.readdir(agentDir);
  const agents = [];

  for (const file of files) {
    if (!file.endsWith('.md')) continue;
    const fullPath = path.join(agentDir, file);
    let header = null;
    try {
      const content = await fs.readFile(fullPath, 'utf8');
      header = parseYAMLHeader(content);
    } catch (e) { /* ignore */ }

    let agentData;
    if (overrides[file.replace('.md', '')]) {
      agentData = overrides[file.replace('.md', '')];
    } else if (header && header.name) {
      agentData = {
        name: header.name,
        description: header.description || '',
        tools: Array.isArray(header.tools) ? header.tools : (header.tools?.split(',').map(t => t.trim()) || []),
        skills: Array.isArray(header.skills) ? header.skills : (header.skills?.split(',').map(s => s.trim()) || []),
        file: path.relative('.', fullPath)
      };
    } else {
      console.warn(`⚠️  Skipping ${file} (no header and no override)`);
      continue;
    }

    agents.push(agentData);
  }
  return agents;
}

// ... [restante do código idêntico] ...

async function main() {
  // ... same as before ...
  const agents = await indexAgents(agentDir);
  // ... generate index ...
}