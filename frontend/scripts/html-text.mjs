// JavaScript incluído em HTML precisa respeitar também o parser HTML5.
export const inlineScriptText = (source) => source
  .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,
    character => '\\u' + character.charCodeAt(0).toString(16).padStart(4, '0'))
  .replace(/<\/script/gi, match => '<\\/' + match.slice(2));
