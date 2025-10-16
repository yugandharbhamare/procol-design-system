import { z } from 'zod'
import type { Component, VariableGroup, Style } from '../types/figma'

// Environment variables
const FIGMA_FILE_KEYS = process.env.FIGMA_FILE_KEYS
const FIGMA_TOKEN = process.env.FIGMA_TOKEN
const FIGMA_API_BASE_URL = process.env.FIGMA_API_BASE_URL || 'https://api.figma.com/v1'

// MCP Tool Types
interface MCPTool {
  name: string
  arguments: Record<string, any>
}

// Check if MCP is available (in Cursor context)
const isMCPAvailable = (): boolean => {
  return typeof window !== 'undefined' && 'mcp' in window
}

// MCP Helper Functions
export const listComponents = async (fileKey: string): Promise<Component[]> => {
  try {
    if (isMCPAvailable()) {
      // Call MCP tool for components
      const mcpTool: MCPTool = {
        name: 'mcp_Figma_list_components',
        arguments: { fileKey }
      }
      
      // This would be the actual MCP call in Cursor context
      // For now, we'll fall back to REST API
      console.log('MCP not available, falling back to REST API')
    }
    
    // Fallback to REST API
    return await fetchComponentsFromREST(fileKey)
  } catch (error) {
    console.error('Error listing components:', error)
    throw new Error(`Failed to list components: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const listVariables = async (fileKey: string): Promise<VariableGroup[]> => {
  try {
    if (isMCPAvailable()) {
      // Call MCP tool for variables
      const mcpTool: MCPTool = {
        name: 'mcp_Figma_get_variable_defs',
        arguments: { fileKey }
      }
      
      console.log('MCP not available, falling back to REST API')
    }
    
    // Fallback to REST API
    return await fetchVariablesFromREST(fileKey)
  } catch (error) {
    console.error('Error listing variables:', error)
    throw new Error(`Failed to list variables: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const listStyles = async (fileKey: string): Promise<Style[]> => {
  try {
    if (isMCPAvailable()) {
      // Call MCP tool for styles
      const mcpTool: MCPTool = {
        name: 'mcp_Figma_list_styles',
        arguments: { fileKey }
      }
      
      console.log('MCP not available, falling back to REST API')
    }
    
    // Fallback to REST API
    return await fetchStylesFromREST(fileKey)
  } catch (error) {
    console.error('Error listing styles:', error)
    throw new Error(`Failed to list styles: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export const getComponentImages = async (
  fileKey: string,
  nodeIds: string[],
  format: 'svg' | 'png' = 'svg',
  scale: number = 2
): Promise<Record<string, string>> => {
  try {
    if (isMCPAvailable()) {
      // Call MCP tool for component images
      const mcpTool: MCPTool = {
        name: 'mcp_Figma_get_screenshot',
        arguments: { 
          fileKey,
          nodeIds,
          format,
          scale
        }
      }
      
      console.log('MCP not available, falling back to REST API')
    }
    
    // Fallback to REST API
    return await fetchComponentImagesFromREST(fileKey, nodeIds, format, scale)
  } catch (error) {
    console.error('Error getting component images:', error)
    throw new Error(`Failed to get component images: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// REST API Fallback Functions
const fetchComponentsFromREST = async (fileKey: string): Promise<Component[]> => {
  if (!FIGMA_TOKEN) {
    throw new Error('FIGMA_TOKEN is required for REST API fallback')
  }

  const response = await fetch(`${FIGMA_API_BASE_URL}/files/${fileKey}/components`, {
    headers: {
      'X-Figma-Token': FIGMA_TOKEN,
    },
  })

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.meta?.components || []
}

const fetchVariablesFromREST = async (fileKey: string): Promise<VariableGroup[]> => {
  if (!FIGMA_TOKEN) {
    throw new Error('FIGMA_TOKEN is required for REST API fallback')
  }

  const response = await fetch(`${FIGMA_API_BASE_URL}/files/${fileKey}/variables/local`, {
    headers: {
      'X-Figma-Token': FIGMA_TOKEN,
    },
  })

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.meta?.variables || []
}

const fetchStylesFromREST = async (fileKey: string): Promise<Style[]> => {
  if (!FIGMA_TOKEN) {
    throw new Error('FIGMA_TOKEN is required for REST API fallback')
  }

  const response = await fetch(`${FIGMA_API_BASE_URL}/files/${fileKey}/styles`, {
    headers: {
      'X-Figma-Token': FIGMA_TOKEN,
    },
  })

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.meta?.styles || []
}

const fetchComponentImagesFromREST = async (
  fileKey: string,
  nodeIds: string[],
  format: 'svg' | 'png' = 'svg',
  scale: number = 2
): Promise<Record<string, string>> => {
  if (!FIGMA_TOKEN) {
    throw new Error('FIGMA_TOKEN is required for REST API fallback')
  }

  const response = await fetch(`${FIGMA_API_BASE_URL}/images/${fileKey}`, {
    method: 'POST',
    headers: {
      'X-Figma-Token': FIGMA_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ids: nodeIds,
      format,
      scale,
    }),
  })

  if (!response.ok) {
    throw new Error(`Figma API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.images || {}
}

// Utility function to validate file key
export const validateFileKey = (fileKey: string): boolean => {
  return typeof fileKey === 'string' && fileKey.length > 0
}

// Utility function to get environment status
export const getEnvironmentStatus = () => {
  return {
    hasFileKey: !!FIGMA_FILE_KEYS,
    hasToken: !!FIGMA_TOKEN,
    mcpAvailable: isMCPAvailable(),
    apiBaseUrl: FIGMA_API_BASE_URL,
  }
}
