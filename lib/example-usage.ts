/**
 * Example usage of Figma MCP integration
 * This file demonstrates how to use the Figma integration functions
 */

import { 
  listComponents, 
  listVariables, 
  listStyles, 
  getComponentImages,
  getEnvironmentStatus 
} from './figma-mcp'

// Example: Get all components from a Figma file
export async function getDesignSystemComponents(fileKey: string) {
  try {
    console.log('Fetching components from Figma...')
    const components = await listComponents(fileKey)
    
    console.log(`Found ${components.length} components:`)
    components.forEach(component => {
      console.log(`- ${component.name} (${component.key})`)
    })
    
    return components
  } catch (error) {
    console.error('Error fetching components:', error)
    throw error
  }
}

// Example: Get all design tokens (variables) from a Figma file
export async function getDesignTokens(fileKey: string) {
  try {
    console.log('Fetching design tokens from Figma...')
    const variableGroups = await listVariables(fileKey)
    
    console.log(`Found ${variableGroups.length} variable groups:`)
    variableGroups.forEach(group => {
      console.log(`- ${group.name} (${group.variables.length} variables)`)
    })
    
    return variableGroups
  } catch (error) {
    console.error('Error fetching design tokens:', error)
    throw error
  }
}

// Example: Get all styles from a Figma file
export async function getDesignStyles(fileKey: string) {
  try {
    console.log('Fetching styles from Figma...')
    const styles = await listStyles(fileKey)
    
    console.log(`Found ${styles.length} styles:`)
    styles.forEach(style => {
      console.log(`- ${style.name} (${style.styleType})`)
    })
    
    return styles
  } catch (error) {
    console.error('Error fetching styles:', error)
    throw error
  }
}

// Example: Get component images for documentation
export async function getComponentDocumentationImages(fileKey: string, componentKeys: string[]) {
  try {
    console.log('Fetching component images from Figma...')
    const images = await getComponentImages(fileKey, componentKeys, 'svg', 2)
    
    console.log(`Generated ${Object.keys(images).length} component images:`)
    Object.entries(images).forEach(([nodeId, imageUrl]) => {
      console.log(`- ${nodeId}: ${imageUrl}`)
    })
    
    return images
  } catch (error) {
    console.error('Error fetching component images:', error)
    throw error
  }
}

// Example: Check environment setup
export function checkFigmaSetup() {
  const status = getEnvironmentStatus()
  
  console.log('Figma Integration Status:')
  console.log(`- File Key: ${status.hasFileKey ? '✅ Set' : '❌ Missing'}`)
  console.log(`- Token: ${status.hasToken ? '✅ Set' : '❌ Missing'}`)
  console.log(`- MCP Available: ${status.mcpAvailable ? '✅ Yes' : '❌ No (using REST fallback)'}`)
  console.log(`- API Base URL: ${status.apiBaseUrl}`)
  
  if (!status.hasFileKey) {
    console.warn('⚠️  FIGMA_FILE_KEYS is not set. Please configure your .env.local file.')
  }
  
  if (!status.hasToken) {
    console.warn('⚠️  FIGMA_TOKEN is not set. REST API fallback will not work.')
  }
  
  return status
}

// Example: Complete design system sync
export async function syncDesignSystem(fileKey: string) {
  console.log('🔄 Starting design system sync...')
  
  // Check environment
  const status = checkFigmaSetup()
  if (!status.hasFileKey) {
    throw new Error('FIGMA_FILE_KEYS is required')
  }
  
  try {
    // Fetch all design system data
    const [components, variableGroups, styles] = await Promise.all([
      getDesignSystemComponents(fileKey),
      getDesignTokens(fileKey),
      getDesignStyles(fileKey)
    ])
    
    // Get component images for documentation
    const componentKeys = components.map(c => c.key)
    const images = await getComponentDocumentationImages(fileKey, componentKeys)
    
    console.log('✅ Design system sync completed!')
    console.log(`- Components: ${components.length}`)
    console.log(`- Variable Groups: ${variableGroups.length}`)
    console.log(`- Styles: ${styles.length}`)
    console.log(`- Component Images: ${Object.keys(images).length}`)
    
    return {
      components,
      variableGroups,
      styles,
      images
    }
  } catch (error) {
    console.error('❌ Design system sync failed:', error)
    throw error
  }
}
