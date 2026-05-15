// Simple in-memory rate limiter
const requests = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(ip: string, limit: number = 30, windowMs: number = 60000): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = requests.get(ip);

  if (!record || now > record.resetAt) {
    requests.set(ip, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0 };
  }

  record.count++;
  return { success: true, remaining: limit - record.count };
}

// Cleanup old entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of requests.entries()) {
      if (now > value.resetAt) requests.delete(key);
    }
  }, 300000);
}
