# Figma Integration Setup

This document explains how to set up Figma integration for the Procol Design System using MCP (Model Context Protocol) tools with REST API fallback.

## Environment Setup

### 1. Create Environment File

Copy the example environment file and configure it:

```bash
cp env.example .env.local
```

### 2. Configure Environment Variables

Edit `.env.local` with your actual Figma credentials:

```env
# Your Figma file key (found in the URL: https://www.figma.com/file/FILE_KEY/...)
FIGMA_FILE_KEYS=your_actual_file_key_here

# Your Figma Personal Access Token (only needed for REST API fallback)
FIGMA_TOKEN=your_actual_token_here

# Optional: Figma API base URL
FIGMA_API_BASE_URL=https://api.figma.com/v1
```

### 3. Get Your Figma File Key

1. Open your Figma file
2. Copy the file key from the URL: `https://www.figma.com/file/FILE_KEY/file-name`
3. Paste it as `FIGMA_FILE_KEYS` in your `.env.local`

### 4. Get Your Figma Personal Access Token (for REST fallback)

1. Go to [Figma Account Settings](https://www.figma.com/settings)
2. Scroll down to "Personal Access Tokens"
3. Click "Create new token"
4. Give it a name (e.g., "Procol Design System")
5. Copy the token and paste it as `FIGMA_TOKEN` in your `.env.local`

## Usage

### MCP Tools (Preferred - in Cursor)

When running in Cursor with MCP enabled, the system will automatically use MCP tools:

```typescript
import { listComponents, listVariables, listStyles, getComponentImages } from './lib/figma-mcp'

// List all components
const components = await listComponents('your-file-key')

// List all variables
const variables = await listVariables('your-file-key')

// List all styles
const styles = await listStyles('your-file-key')

// Get component images
const images = await getComponentImages('your-file-key', ['node-id-1', 'node-id-2'], 'svg', 2)
```

### REST API Fallback

If MCP is not available (e.g., in CI/CD), the system automatically falls back to REST API:

```typescript
// The same functions work, but use REST API under the hood
const components = await listComponents('your-file-key')
```

## API Reference

### `listComponents(fileKey: string): Promise<Component[]>`

Lists all components in a Figma file.

**Parameters:**
- `fileKey`: The Figma file key

**Returns:** Array of Component objects

### `listVariables(fileKey: string): Promise<VariableGroup[]>`

Lists all variable groups in a Figma file.

**Parameters:**
- `fileKey`: The Figma file key

**Returns:** Array of VariableGroup objects

### `listStyles(fileKey: string): Promise<Style[]>`

Lists all styles in a Figma file.

**Parameters:**
- `fileKey`: The Figma file key

**Returns:** Array of Style objects

### `getComponentImages(fileKey: string, nodeIds: string[], format?: 'svg' | 'png', scale?: number): Promise<Record<string, string>>`

Gets images for specific nodes in a Figma file.

**Parameters:**
- `fileKey`: The Figma file key
- `nodeIds`: Array of node IDs to get images for
- `format`: Image format ('svg' or 'png', default: 'svg')
- `scale`: Image scale factor (default: 2)

**Returns:** Object mapping node IDs to image URLs

## Type Safety

All functions use Zod schemas for runtime type validation:

```typescript
import type { Component, VariableGroup, Style } from './types/figma'

// Type-safe usage
const components: Component[] = await listComponents('file-key')
```

## Error Handling

The system includes comprehensive error handling:

```typescript
try {
  const components = await listComponents('file-key')
} catch (error) {
  console.error('Failed to fetch components:', error.message)
}
```

## Environment Status

Check your environment configuration:

```typescript
import { getEnvironmentStatus } from './lib/figma-mcp'

const status = getEnvironmentStatus()
console.log(status)
// {
//   hasFileKey: true,
//   hasToken: true,
//   mcpAvailable: false,
//   apiBaseUrl: 'https://api.figma.com/v1'
// }
```

## Troubleshooting

### Common Issues

1. **"MCP not available"** - This is normal when not running in Cursor with MCP enabled
2. **"FIGMA_TOKEN is required"** - Make sure you've set up your Personal Access Token
3. **"Figma API error"** - Check your file key and token are correct

### Debug Mode

Enable debug logging by setting:

```env
DEBUG=figma-mcp
```

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your Figma Personal Access Token secure
- Use environment-specific tokens for different environments (dev, staging, prod)
