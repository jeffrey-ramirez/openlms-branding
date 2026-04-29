function escape(key: string) {
  return key.replace(/\s+/g, "-").toLowerCase();
}

export function buildUtilities(tokens: Record<string, string>) {
  let css = "";

  for (const key of Object.keys(tokens)) {
    const k = escape(key);

    css += `
/* base */
.bg-${k} { background-color: var(--${k}); }
.text-${k} { color: var(--${k}); }
.border-${k} { border-color: var(--${k}); }

/* hover */
.hover\\:bg-${k}:hover { background-color: var(--${k}); }
.hover\\:text-${k}:hover { color: var(--${k}); }

/* focus */
.focus\\:bg-${k}:focus { background-color: var(--${k}); }
`;
  }

  return css;
}