
module.exports = {
  apps: [
    {
      name: 'atsat-api',
      script: 'dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001
      },
      max_memory_restart: '200M'
    }
  ]
};
