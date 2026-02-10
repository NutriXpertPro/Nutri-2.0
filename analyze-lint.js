const fs = require('fs');

try {
    const data = JSON.parse(fs.readFileSync('lint-report.json', 'utf8'));
    const filesWithErrors = data.filter(f => f.errorCount > 0);

    // Group by file and error type
    const errorStats = filesWithErrors.map(f => ({
        filePath: f.filePath,
        errorCount: f.errorCount,
        warningCount: f.warningCount,
        messages: f.messages.map(m => m.ruleId)
    }));

    // Sort by total errors
    const topFiles = errorStats.sort((a, b) => b.errorCount - a.errorCount).slice(0, 15);

    console.log('Top files with most errors:');
    topFiles.forEach(f => {
        console.log(`${f.errorCount} errors: ${f.filePath}`);
        // Count ruleIds for this file
        const rules = {};
        f.messages.forEach(r => rules[r] = (rules[r] || 0) + 1);
        console.log('  Rules:', JSON.stringify(rules));
    });
} catch (e) {
    console.error('Error parsing lint report:', e);
}
