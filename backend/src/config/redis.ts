import Redis from 'ioredis';

let redis: any = null;

if (process.env.REDIS_ENABLED === 'true') {
  redis = new Redis(process.env.REDIS_URL as string);
} else {
  console.log('⚠️ Redis disabled');
  redis = {
    get: async () => null,
    set: async () => null,
    del: async () => null,
  };
}

export default redis;
