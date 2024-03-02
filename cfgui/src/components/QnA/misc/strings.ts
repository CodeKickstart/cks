export function fnSplitCursor(str: string): {
  phase: string;
  sidCursor: string;
} {
  const index = str.indexOf(".");
  if (index !== -1) {
    const phase = str.substring(0, index);
    const sidCursor = str.substring(index + 1);
    return { phase, sidCursor };
  } else {
    return { phase: "", sidCursor: str };
  }
}
