import { KnowledgeNode, KnowledgeGraph, Stats } from '../types'
import { mockKnowledgeNodes, stats as mockStats } from '../mock/data'
import { simulateApiCall, generateId, deepClone } from '../utils/helpers'

// ============================================================================
// Knowledge Mock Database
// ============================================================================

let knowledgeNodeDatabase: Map<string, KnowledgeNode> = new Map(mockKnowledgeNodes.map((n) => [n.id, deepClone(n)]))
let userMasteryScores: Map<string, Map<string, number>> = new Map() // userId -> nodeId -> mastery%

// ============================================================================
// Knowledge Graph Service
// ============================================================================

/**
 * Gets the full knowledge graph for a user
 */
export async function getKnowledgeGraph(userId: string): Promise<KnowledgeGraph> {
  return simulateApiCall(() => {
    const nodes = Array.from(knowledgeNodeDatabase.values()).map((n) => {
      const userMastery = userMasteryScores.get(userId)?.get(n.id) ?? 0
      return {
        ...deepClone(n),
        masteryPercentage: userMastery,
      }
    })
    const edges = generateGraphEdges(nodes)
    return { nodes, edges }
  }, 0)
}

/**
 * Gets a specific knowledge node
 */
export async function getKnowledgeNode(nodeId: string, userId?: string): Promise<KnowledgeNode | null> {
  return simulateApiCall(() => {
    const node = knowledgeNodeDatabase.get(nodeId)
    if (!node) return null
    const updated = deepClone(node)
    if (userId) {
      const userMastery = userMasteryScores.get(userId)?.get(nodeId) ?? 0
      updated.masteryPercentage = userMastery
    }
    return updated
  }, 0)
}

/**
 * Gets all nodes in a category
 */
export async function getNodesByCategory(userId: string, category: string): Promise<KnowledgeNode[]> {
  return simulateApiCall(() => {
    const nodes = Array.from(knowledgeNodeDatabase.values())
      .filter((n) => n.category === category)
      .map((n) => {
        const userMastery = userMasteryScores.get(userId)?.get(n.id) ?? 0
        return {
          ...deepClone(n),
          masteryPercentage: userMastery,
        }
      })
    return nodes
  }, 0)
}

/**
 * Gets related nodes for learning paths
 */
export async function getRelatedNodes(nodeId: string, userId: string): Promise<KnowledgeNode[]> {
  return simulateApiCall(() => {
    const node = knowledgeNodeDatabase.get(nodeId)
    if (!node) return []
    const related: KnowledgeNode[] = node.relatedNodes
      .map((id) => knowledgeNodeDatabase.get(id))
      .filter((n) => n !== undefined)
      .map((n) => {
        const userMastery = userMasteryScores.get(userId)?.get(n!.id) ?? 0
        return {
          ...deepClone(n!),
          masteryPercentage: userMastery,
        }
      })
    return related
  }, 0)
}

/**
 * Updates mastery score for a node
 */
export async function updateNodeMastery(userId: string, nodeId: string, masteryDelta: number): Promise<number> {
  return simulateApiCall(() => {
    if (!userMasteryScores.has(userId)) {
      userMasteryScores.set(userId, new Map())
    }
    const userMap = userMasteryScores.get(userId)!
    const currentMastery = userMap.get(nodeId) ?? 0
    const newMastery = Math.min(100, Math.max(0, currentMastery + masteryDelta))
    userMap.set(nodeId, newMastery)
    userMasteryScores.set(userId, userMap)
    return newMastery
  })
}

/**
 * Gets knowledge summary statistics
 */
export async function getKnowledgeSummary(userId?: string): Promise<Stats> {
  return simulateApiCall(() => {
    if (!userId) {
      return deepClone(mockStats)
    }
    const nodes = Array.from(knowledgeNodeDatabase.values())
    const masteryScores = userMasteryScores.get(userId) ?? new Map()
    const scores = nodes.map((n) => masteryScores.get(n.id) ?? 0)
    const avgKnowledge = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
    return {
      knowledge: avgKnowledge,
      mastery: {
        current: Math.round((avgKnowledge / 100) * 600),
        total: 600,
      },
      retentionRate: avgKnowledge,
      dailyGoal: { target: 60, completed: Math.floor(Math.random() * 60) + 20 },
      weeklyStats: generateWeeklyStats(),
    }
  }, 0)
}

/**
 * Creates a new knowledge node
 */
export async function createKnowledgeNode(
  title: string,
  description: string,
  category: string,
  difficulty: 'beginner' | 'intermediate' | 'advanced',
  prerequisites?: string[]
): Promise<KnowledgeNode> {
  return simulateApiCall(() => {
    const node: KnowledgeNode = {
      id: generateId(),
      title,
      description,
      category,
      masteryPercentage: 0,
      relatedNodes: [],
      difficulty,
      resources: [],
      prerequisites,
    }
    knowledgeNodeDatabase.set(node.id, node)
    return deepClone(node)
  }, 0.05)
}

/**
 * Links two knowledge nodes
 */
export async function linkNodes(fromNodeId: string, toNodeId: string, weight: number = 1): Promise<void> {
  return simulateApiCall(() => {
    const fromNode = knowledgeNodeDatabase.get(fromNodeId)
    if (!fromNode) {
      throw new Error('Source node not found')
    }
    if (!fromNode.relatedNodes.includes(toNodeId)) {
      fromNode.relatedNodes.push(toNodeId)
      knowledgeNodeDatabase.set(fromNodeId, fromNode)
    }
  })
}

/**
 * Generates practice recommendations based on mastery gaps
 */
export async function generatePracticeRecommendations(userId: string, limit: number = 5): Promise<KnowledgeNode[]> {
  return simulateApiCall(() => {
    const masteryMap = userMasteryScores.get(userId) ?? new Map()
    const nodes = Array.from(knowledgeNodeDatabase.values())
      .map((n) => ({
        node: n,
        mastery: masteryMap.get(n.id) ?? 0,
      }))
      .sort((a, b) => a.mastery - b.mastery)
      .slice(0, limit)
      .map(({ node }) => {
        const userMastery = masteryMap.get(node.id) ?? 0
        return {
          ...deepClone(node),
          masteryPercentage: userMastery,
        }
      })
    return nodes
  }, 0)
}

/**
 * Gets learning path from one node to another
 */
export async function getLearningPath(userId: string, startNodeId: string, endNodeId: string): Promise<KnowledgeNode[]> {
  return simulateApiCall(() => {
    const path: KnowledgeNode[] = []
    const visited = new Set<string>()
    const queue: string[] = [startNodeId]
    let found = false
    while (queue.length > 0 && !found) {
      const currentId = queue.shift()!
      if (visited.has(currentId)) continue
      visited.add(currentId)
      const node = knowledgeNodeDatabase.get(currentId)
      if (node) {
        const userMastery = userMasteryScores.get(userId)?.get(node.id) ?? 0
        path.push({
          ...deepClone(node),
          masteryPercentage: userMastery,
        })
        if (currentId === endNodeId) {
          found = true
          break
        }
        node.relatedNodes.forEach((id) => {
          if (!visited.has(id)) {
            queue.push(id)
          }
        })
      }
    }
    return path
  }, 0)
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Generates edges for the knowledge graph
 */
function generateGraphEdges(nodes: KnowledgeNode[]): { from: string; to: string; weight: number }[] {
  const edges: { from: string; to: string; weight: number }[] = []
  nodes.forEach((node) => {
    node.relatedNodes.forEach((relatedId) => {
      edges.push({
        from: node.id,
        to: relatedId,
        weight: 1,
      })
    })
  })
  return edges
}

/**
 * Generates weekly statistics
 */
function generateWeeklyStats(): Stats['weeklyStats'] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((day) => ({
    day,
    completed: Math.floor(Math.random() * 5),
    xpGained: Math.floor(Math.random() * 400) + 50,
  }))
}
