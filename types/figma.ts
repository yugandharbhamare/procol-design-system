import { z } from 'zod'

// Base types for common Figma properties
const ColorSchema = z.object({
  r: z.number().min(0).max(1),
  g: z.number().min(0).max(1),
  b: z.number().min(0).max(1),
  a: z.number().min(0).max(1).optional(),
})

const Vector2DSchema = z.object({
  x: z.number(),
  y: z.number(),
})

const RectangleSchema = z.object({
  x: z.number(),
  y: z.number(),
  width: z.number(),
  height: z.number(),
})

// Component Schema
export const ComponentSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string().optional(),
  componentSetId: z.string().optional(),
  documentationLinks: z.array(z.object({
    uri: z.string(),
  })).optional(),
  remote: z.boolean().optional(),
  thumbnailUrl: z.string().optional(),
})

export type Component = z.infer<typeof ComponentSchema>

// Variable Schema
export const VariableSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string().optional(),
  variableCollectionId: z.string(),
  resolvedType: z.enum(['BOOLEAN', 'FLOAT', 'STRING', 'COLOR']),
  valuesByMode: z.record(z.union([
    z.string(),
    z.number(),
    z.boolean(),
    ColorSchema,
  ])),
  remote: z.boolean().optional(),
  hiddenFromPublishing: z.boolean().optional(),
  scopes: z.array(z.enum([
    'ALL_FILLS',
    'ALL_STROKES',
    'TEXT_CONTENT',
    'CORNER_RADIUS',
    'WIDTH_HEIGHT',
    'GAP',
    'ALL_FILLS',
    'FRAME_FILL',
    'SHAPE_FILL',
    'TEXT_FILL',
    'ALL_STROKES',
    'FRAME_STROKE',
    'RECTANGLE_STROKE',
    'ELLIPSE_STROKE',
    'VECTOR_STROKE',
    'LINE_STROKE',
    'TEXT_STROKE',
    'CORNER_RADIUS',
    'WIDTH_HEIGHT',
    'GAP',
  ])).optional(),
  codeSyntax: z.record(z.string()).optional(),
})

export type Variable = z.infer<typeof VariableSchema>

// Variable Group Schema
export const VariableGroupSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string().optional(),
  variables: z.array(VariableSchema),
  remote: z.boolean().optional(),
  hiddenFromPublishing: z.boolean().optional(),
})

export type VariableGroup = z.infer<typeof VariableGroupSchema>

// Style Schema
export const StyleSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string().optional(),
  styleType: z.enum([
    'FILL',
    'TEXT',
    'EFFECT',
    'GRID',
  ]),
  remote: z.boolean().optional(),
  thumbnailUrl: z.string().optional(),
})

export type Style = z.infer<typeof StyleSchema>

// Node Schema (for component images)
export const NodeSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  visible: z.boolean().optional(),
  children: z.array(z.lazy(() => NodeSchema)).optional(),
})

export type Node = z.infer<typeof NodeSchema>

// File Schema
export const FileSchema = z.object({
  document: NodeSchema,
  components: z.record(ComponentSchema),
  styles: z.record(StyleSchema),
  name: z.string(),
  lastModified: z.string(),
  thumbnailUrl: z.string().optional(),
  version: z.string(),
  role: z.string(),
  editorType: z.string(),
  linkAccess: z.string(),
})

export type File = z.infer<typeof FileSchema>

// API Response Schemas
export const ComponentsResponseSchema = z.object({
  meta: z.object({
    components: z.record(ComponentSchema),
  }),
})

export const VariablesResponseSchema = z.object({
  meta: z.object({
    variables: z.record(VariableSchema),
  }),
})

export const StylesResponseSchema = z.object({
  meta: z.object({
    styles: z.record(StyleSchema),
  }),
})

export const ImagesResponseSchema = z.object({
  images: z.record(z.string()),
})

// Error Schema
export const FigmaErrorSchema = z.object({
  err: z.string(),
  status: z.number().optional(),
})

export type FigmaError = z.infer<typeof FigmaErrorSchema>

// Utility types for API responses
export type ComponentsResponse = z.infer<typeof ComponentsResponseSchema>
export type VariablesResponse = z.infer<typeof VariablesResponseSchema>
export type StylesResponse = z.infer<typeof StylesResponseSchema>
export type ImagesResponse = z.infer<typeof ImagesResponseSchema>

// Environment validation
export const EnvironmentSchema = z.object({
  FIGMA_FILE_KEYS: z.string().min(1),
  FIGMA_TOKEN: z.string().min(1).optional(),
  FIGMA_API_BASE_URL: z.string().url().optional(),
})

export type Environment = z.infer<typeof EnvironmentSchema>
