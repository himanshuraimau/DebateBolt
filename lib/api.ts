// Mock debate topics API
export async function fetchDebateTopics() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return [
    {
      id: 1,
      title: "Should artificial intelligence be regulated by governments?",
      category: "Technology",
      difficulty: "Medium",
    },
    {
      id: 2,
      title: "Is universal basic income a viable economic policy?",
      category: "Economics",
      difficulty: "Hard",
    },
    {
      id: 3,
      title: "Should social media platforms be responsible for content moderation?",
      category: "Technology",
      difficulty: "Medium",
    },
    {
      id: 4,
      title: "Is space exploration a worthwhile investment for humanity?",
      category: "Science",
      difficulty: "Easy",
    },
    {
      id: 5,
      title: "Should genetic engineering of humans be permitted?",
      category: "Ethics",
      difficulty: "Hard",
    },
    {
      id: 6,
      title: "Is nuclear energy the solution to climate change?",
      category: "Environment",
      difficulty: "Medium",
    },
  ]
}

// Mock user stats API
export async function fetchUserStats() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  return {
    totalDebates: 24,
    winRate: 68,
    averageScore: 82,
    debatesThisWeek: 5,
    recentActivity: [
      { action: "Won debate on 'Digital Privacy'", time: "2 hours ago" },
      { action: "Practiced with AI on 'Economic Policy'", time: "Yesterday" },
      { action: "Lost debate on 'Space Exploration'", time: "3 days ago" },
    ],
  }
}
