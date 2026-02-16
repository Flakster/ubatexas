/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://ubatexas.com',
  generateRobotsTxt: true,
  exclude: ['/auth/callback', '/login', '/gente/nuevo', '/agenda/nuevo'],
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/agenda'),
    await config.transform(config, '/gente'),
    await config.transform(config, '/territorio'),
  ],
}
