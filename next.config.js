import nextra from 'nextra'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.tsx',
  mdxOptions: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default withNextra({
  experimental: {
    esmExternals: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
})
