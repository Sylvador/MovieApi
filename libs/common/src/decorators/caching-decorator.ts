export function cache(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const cache = new Map();

  descriptor.value = async function (...args: any[]) {
    const cacheKey = JSON.stringify(args);

    if (cache.has(cacheKey)) {
      console.log('Returning cached result...');
      return cache.get(cacheKey);
    }

    const result = await originalMethod.apply(this, args);
    cache.set(cacheKey, result);

    return result;
  };

  return descriptor;
}