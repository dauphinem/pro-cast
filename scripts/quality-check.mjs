import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(import.meta.dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const checks = [];
const check = (name, condition, detail = "") => checks.push({name, ok:Boolean(condition), detail});

const html = read("index.html");
const app = read("app.js");
const worker = read("service-worker.js");
const manifest = JSON.parse(read("manifest.webmanifest"));

const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
check("Identifiants HTML uniques", duplicateIds.length === 0, duplicateIds.join(", "));

const referencedIds = [...app.matchAll(/\$\("([A-Za-z][\w-]*)"\)/g)].map(match => match[1]);
const dynamicIds = [...app.matchAll(/\bid=["']([A-Za-z][\w-]*)["']/g)].map(match => match[1]);
const knownIds = new Set([...ids, ...dynamicIds]);
const missingIds = [...new Set(referencedIds.filter(id => !knownIds.has(id)))];
check("Éléments utilisés par JavaScript présents", missingIds.length === 0, missingIds.join(", "));

const indexAppVersion = html.match(/app\.js\?v=([\w-]+)/)?.[1];
const indexCssVersion = html.match(/v13\.css\?v=([\w-]+)/)?.[1];
const workerVersion = worker.match(/const CACHE="pro-cast-v([^"]+)"/)?.[1];
check("Versions JS et CSS identiques", indexAppVersion && indexAppVersion === indexCssVersion, `${indexAppVersion ?? "?"} / ${indexCssVersion ?? "?"}`);
check("Version du cache alignée", workerVersion && workerVersion === indexAppVersion, `${workerVersion ?? "?"} / ${indexAppVersion ?? "?"}`);
check("Assets versionnés présents dans le cache", worker.includes(`app.js?v=${indexAppVersion}`) && worker.includes(`v13.css?v=${indexCssVersion}`));

const backupCollections = ["tasks","decisions","scenarios","episodes","decors","motifs","weeklyRituals","dailyClosures","dailyPreparations","weekPreparations","taskBlocks","blockOccurrences"];
const exportBody = app.match(/function exportData\(\)\{([\s\S]*?)\nasync function importData/)?.[1] ?? "";
const missingBackupCollections = backupCollections.filter(name => !new RegExp(`\\b${name}\\b`).test(exportBody));
check("Sauvegarde complète", missingBackupCollections.length === 0, missingBackupCollections.join(", "));

check("Suppression d’un bloc conserve les tâches", /Supprimer le bloc[\s\S]*?Les tâches seront conservées/.test(app));
check("Retrait d’un bloc distinct de la suppression", /function removeTaskFromBlock/.test(app));
check("Une tâche peut appartenir à plusieurs blocs", /if\(!block\.taskIds\.includes\(task\.id\)\)block\.taskIds\.push/.test(app));
check("Action Faite disponible dans le menu", /data-quick="complete"/.test(html) && /type==="complete"/.test(app));
check("Têtes d’affiche réordonnables et retirables", /priority-headliner/.test(app) && /isPriority\?togglePriority\(id\):makeHeadliner\(id\)/.test(app));
check("Têtes d’affiche datées visibles uniquement le jour J", /visibleCandidates=candidates\.filter\(t=>!t\.due\|\|t\.due===today\(\)\)/.test(app));
check("Clôtures fusionnables", /function pendingClosureDates/.test(app) && /journées à clôturer ensemble/.test(app));
check("Motif de report limité aux scènes du jour à la clôture", /type==="reschedule"&&extra\.due&&item\?\.kind==="today"/.test(app) && /source:decisionSource\|\|"day_closure"/.test(app));

const iconPaths = (manifest.icons ?? []).map(icon => icon.src).filter(Boolean);
const missingIcons = iconPaths.filter(icon => !fs.existsSync(path.join(root, icon)));
check("Icônes du manifeste présentes", missingIcons.length === 0, missingIcons.join(", "));

for (const result of checks) {
  const mark = result.ok ? "✓" : "✗";
  console.log(`${mark} ${result.name}${result.detail && !result.ok ? ` — ${result.detail}` : ""}`);
}

const failures = checks.filter(result => !result.ok);
console.log(`\n${checks.length - failures.length}/${checks.length} contrôles réussis.`);
if (failures.length) process.exitCode = 1;
