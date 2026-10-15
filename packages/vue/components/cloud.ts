/** Silhouettes of the shared cloud illustration, from a tall billow to a thin distant wisp. */
export const ylfCloudShapes = ['billow', 'heap', 'bank', 'puff', 'wisp'] as const

export type YlfCloudShape = typeof ylfCloudShapes[number]
