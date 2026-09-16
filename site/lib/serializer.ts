export function serialize(value: unknown): unknown {
  if (typeof value === 'bigint') return value.toString();
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(serialize);
  if (value && typeof value === 'object') {
    if (typeof value.toString === 'function' && value.constructor?.name === 'Decimal') {
      return Number(value.toString());
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = serialize(v);
    }
    return out;
  }
  return value;
}

export function jsonSafe(data: unknown) {
  return JSON.parse(JSON.stringify(serialize(data)));
}
