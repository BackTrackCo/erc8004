import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['tests/**/*.test.ts'],
          exclude: ['tests/fork/**'],
          coverage: {
            provider: 'v8',
            reporter: [process.env.CI ? 'lcov' : 'text', 'json', 'html'],
            include: ['src/**/*.ts'],
            exclude: ['src/**/index.ts', 'src/**/types.ts'],
          },
        },
      },
      {
        test: {
          name: 'fork',
          include: ['tests/fork/**/*.fork.test.ts'],
          globalSetup: ['tests/setup/globalSetup.ts'],
          testTimeout: 60_000,
          hookTimeout: 60_000,
          retry: 3,
        },
      },
    ],
  },
})
