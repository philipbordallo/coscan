/** @type {import('jest').Config} */
const config = {
  coverageReporters: ['text'],
  projects: [
    {
      displayName: {
        name: '@coscan/jsx-scanner',
        color: 'blueBright',
      },
      rootDir: 'packages/jsx-scanner',
    },
  ],
};

export default config;
