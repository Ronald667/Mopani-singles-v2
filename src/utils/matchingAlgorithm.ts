export interface Profile {
  id: string
  full_name: string
  age: number
  gender: string
  municipality: string
  village: string
  language: string
  intention: string
  bio: string
  whatsapp: string
  photo_url: string
  is_verified?: boolean
  is_approved?: boolean
}

export interface MatchResult {
  profile: Profile
  score: number
  matchReasons: string[]
}

export function calculateCompatibility(user: Partial<Profile>, candidate: Profile): MatchResult {
  let score = 50 // base score
  const reasons: string[] = []

  // 1. Intention Match (High weight)
  if (user.intention && candidate.intention && user.intention === candidate.intention) {
    score += 25
    reasons.push(`Shared intention: ${candidate.intention}`)
  }

  // 2. Location Match (Municipality & Village)
  if (user.municipality && candidate.municipality) {
    if (user.municipality === candidate.municipality) {
      score += 15
      reasons.push(`Same municipality (${candidate.municipality})`)
      if (user.village && candidate.village && user.village === candidate.village) {
        score += 10
        reasons.push(`Same town/village (${candidate.village})`)
      }
    }
  }

  // 3. Language Match
  if (user.language && candidate.language && user.language === candidate.language) {
    score += 10
    reasons.push(`Speaks ${candidate.language}`)
  }

  // 4. Age proximity (ideal within 5 years)
  if (user.age && candidate.age) {
    const ageDiff = Math.abs(user.age - candidate.age)
    if (ageDiff <= 3) {
      score += 10
      reasons.push(`Close in age (${candidate.age} yrs)`)
    } else if (ageDiff <= 6) {
      score += 5
    }
  }

  // 5. Bio keyword matching
  if (user.bio && candidate.bio) {
    const userWords = user.bio.toLowerCase().split(/\s+/)
    const candidateWords = candidate.bio.toLowerCase().split(/\s+/)
    const commonWords = userWords.filter(w => w.length > 3 && candidateWords.includes(w))
    if (commonWords.length > 0) {
      score += Math.min(10, commonWords.length * 3)
      reasons.push(`Similar interests in bio`)
    }
  }

  const finalScore = Math.min(99, Math.max(40, score))
  return {
    profile: candidate,
    score: finalScore,
    matchReasons: reasons.length > 0 ? reasons : ['Compatible Mopani profile']
  }
}
