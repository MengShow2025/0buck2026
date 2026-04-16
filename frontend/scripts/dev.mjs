import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const repoRoot = path.resolve(__dirname, '..', '..');
const csvPath = path.join(repoRoot, '0Buck_i18n_Translation_Table.csv');
const syncScriptPath = path.join(__dirname, 'sync_i18n.py');

let viteChild;
let syncing = false;
let pendingSync = false;

function runSync() {
  if (syncing) {
    pendingSync = true;
    return;
  }

  syncing = true;
  const child = spawn('python3', [syncScriptPath], { stdio: 'inherit' });
  child.on('exit', () => {
    syncing = false;
    if (pendingSync) {
      pendingSync = false;
      runSync();
    }
  });
}

function startWatcher() {
  if (!fs.existsSync(csvPath)) {
    console.error(`[i18n] CSV not found: ${csvPath}`);
    return;
  }

  let timer;
  fs.watch(csvPath, { persistent: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log('[i18n] CSV changed, syncing...');
      runSync();
    }, 200);
  });
}

function startVite() {
  viteChild = spawn('npm', ['run', 'dev:vite'], { stdio: 'inherit', cwd: path.join(repoRoot, 'frontend') });
  viteChild.on('exit', (code) => process.exit(code ?? 0));
}

function shutdown() {
  if (viteChild && !viteChild.killed) {
    viteChild.kill('SIGINT');
  }
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log('[i18n] Initial sync...');
runSync();
startWatcher();
startVite();

