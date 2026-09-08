const fs = require('fs');
const content = fs.readFileSync('mindforge/style.css', 'utf8');
const lines = content.split('\n');

const rules = [];
let currentRule = [];
let lineNum = 0;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('{')) {
        currentRule = [];
        lineNum = i + 1;
    } else if (line.includes('}')) {
        if (currentRule.length === 0) {
            console.log('Empty rule around line ' + lineNum);
        }
        
        // check for missing standard properties
        const hasWebkitBackdrop = currentRule.some(p => p.includes('-webkit-backdrop-filter'));
        const hasBackdrop = currentRule.some(p => p.includes('backdrop-filter') && !p.includes('-webkit-'));
        if (hasWebkitBackdrop && !hasBackdrop) console.log('Missing standard backdrop-filter in rule ending at line ' + (i+1));

        const hasWebkitBackgroundClip = currentRule.some(p => p.includes('-webkit-background-clip'));
        const hasBackgroundClip = currentRule.some(p => p.includes('background-clip') && !p.includes('-webkit-'));
        if (hasWebkitBackgroundClip && !hasBackgroundClip) console.log('Missing standard background-clip in rule ending at line ' + (i+1));
        
        const hasWebkitTextFill = currentRule.some(p => p.includes('-webkit-text-fill-color'));
        const hasTextFill = currentRule.some(p => p.includes('text-fill-color') && !p.includes('-webkit-'));
        // text-fill-color standard doesn't strictly exist for text gradients, so usually not a warning, but VSCode sometimes warns.
    } else {
        if (line.trim().length > 0 && !line.trim().startsWith('/*')) {
            currentRule.push(line);
        }
    }
}
