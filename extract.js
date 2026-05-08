const fs = require('fs');
const zlib = require('zlib');

const html = fs.readFileSync('f:\\DB_Acreditacion\\IBERO MAP UI Kit.html', 'utf8');

const manifestMatch = html.match(/<script type="__bundler\/manifest">\s*([\s\S]*?)\s*<\/script>/);
if (manifestMatch) {
    const manifest = JSON.parse(manifestMatch[1]);
    for (const [uuid, entry] of Object.entries(manifest)) {
        let buffer = Buffer.from(entry.data, 'base64');
        if (entry.compressed) {
            try {
                buffer = zlib.gunzipSync(buffer);
            } catch (e) {
                console.error('Error gunzipping', uuid, e);
            }
        }
        let ext = 'txt';
        if (entry.mime.includes('javascript')) ext = 'js';
        if (entry.mime.includes('css')) ext = 'css';
        if (entry.mime.includes('html')) ext = 'html';
        
        fs.writeFileSync(`f:\\iberomap-angular\\scratch_${uuid}.${ext}`, buffer);
        console.log(`Saved f:\\iberomap-angular\\scratch_${uuid}.${ext}`);
    }
} else {
    console.log('Manifest not found');
}

const templateMatch = html.match(/<script type="__bundler\/template">\s*([\s\S]*?)\s*<\/script>/);
if (templateMatch) {
    let template = templateMatch[1];
    try {
        template = JSON.parse(template); // it might be a JSON string
    } catch(e) {}
    fs.writeFileSync('f:\\iberomap-angular\\scratch_template.html', template);
    console.log('Saved f:\\iberomap-angular\\scratch_template.html');
} else {
    console.log('Template not found');
}
