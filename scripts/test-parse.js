const fs = require('fs');
const path = require('path');

function parseAmharicHtm(filePath) {
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf8');
  const textBodyMatch = content.match(/<div class="textBody" id="textBody">([\s\S]*?)<\/div>/i);
  if (!textBodyMatch) return [];
  const body = textBodyMatch[1];

  const verses = [];
  // Split on <span class="verse" id="N"> or <br /><span class="verse" id="N">
  const regex = /<span\s+class="verse"\s+id="(\d+)">\s*\d*\s*<\/span>/gi;
  
  // Also handle first verse before any span if it starts right away
  let match;
  const indices = [];
  while ((match = regex.exec(body)) !== null) {
    indices.push({
      verseNum: parseInt(match[1], 10),
      index: match.index,
      length: match[0].length,
    });
  }

  if (indices.length === 0) {
    // Fallback: entire text is verse 1
    const cleanText = body.replace(/<[^>]+>/g, '').trim();
    if (cleanText) verses.push({ verse: 1, text: cleanText });
    return verses;
  }

  // Verse 1 might be before index[0] or index[0] might be verse 1 (commented out or not)
  // Check if there is text before the first span tag
  const beforeFirst = body.substring(0, indices[0].index).replace(/<[^>]+>/g, '').replace(/^[፤፦\s\d]+/, '').trim();
  if (beforeFirst && (!indices[0] || indices[0].verseNum > 1)) {
    verses.push({ verse: 1, text: beforeFirst });
  }

  for (let i = 0; i < indices.length; i++) {
    const current = indices[i];
    const next = indices[i + 1];
    const start = current.index + current.length;
    const end = next ? next.index : body.indexOf('</p>', start);
    let chunk = end !== -1 ? body.substring(start, end) : body.substring(start);
    chunk = chunk.replace(/<[^>]+>/g, '').replace(/^[፤፦\s\d]+/, '').trim();
    if (chunk) {
      verses.push({ verse: current.verseNum, text: chunk });
    }
  }

  return verses;
}

const vGen1 = parseAmharicHtm(path.join(__dirname, '..', 'am_new', '01', '1.htm'));
console.log('Genesis 1 verses count:', vGen1.length);
console.log('Genesis 1:1 ->', vGen1[0]);
console.log('Genesis 1:2 ->', vGen1[1]);
console.log('Genesis 1:31 ->', vGen1[vGen1.length - 1]);

const vJohn1 = parseAmharicHtm(path.join(__dirname, '..', 'am_new', '43', '1.htm'));
console.log('John 1 verses count:', vJohn1.length);
console.log('John 1:1 ->', vJohn1[0]);
console.log('John 1:14 ->', vJohn1.find(v => v.verse === 14));
