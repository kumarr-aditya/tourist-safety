// Mock blockchain ID generation utilities
// In a real implementation, this would connect to actual blockchain networks

/**
 * Generates a mock blockchain-style ID
 * Format: BC-[timestamp]-[random]-[checksum]
 */
export function generateBlockchainId() {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  const checksum = generateChecksum(timestamp + random)

  return `BC-${timestamp}-${random}-${checksum}`.toUpperCase()
}

/**
 * Generates a simple checksum for the ID
 */
function generateChecksum(input) {
  let hash = 0
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36).substring(0, 4)
}

/**
 * Validates blockchain ID format
 */
export function validateBlockchainId(id) {
  const pattern = /^BC-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+$/
  return pattern.test(id)
}

/**
 * Mock blockchain registration - simulates storing user data on blockchain
 */
export function registerOnBlockchain(userData) {
  const blockchainId = generateBlockchainId()
  const timestamp = new Date().toISOString()

  // Simulate blockchain transaction
  const transaction = {
    id: blockchainId,
    userData: {
      name: userData.name,
      email: userData.email,
      role: userData.role,
    },
    timestamp,
    blockHash: generateBlockHash(blockchainId, userData),
    status: "confirmed",
  }

  // Store in localStorage to simulate blockchain persistence
  const existingRecords = JSON.parse(localStorage.getItem("blockchainRecords") || "[]")
  existingRecords.push(transaction)
  localStorage.setItem("blockchainRecords", JSON.stringify(existingRecords))

  return {
    blockchainId,
    transaction,
    success: true,
  }
}

/**
 * Generates a mock block hash
 */
function generateBlockHash(id, userData) {
  const data = id + userData.name + userData.email + userData.role
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return "0x" + Math.abs(hash).toString(16).padStart(16, "0")
}

/**
 * Retrieves blockchain record by ID
 */
export function getBlockchainRecord(blockchainId) {
  const records = JSON.parse(localStorage.getItem("blockchainRecords") || "[]")
  return records.find((record) => record.id === blockchainId)
}

/**
 * Enhanced blockchain ID generation with multi-factor verification
 */
export function generateEnhancedBlockchainId(userData) {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  const userHash = generateUserHash(userData)
  const checksum = generateChecksum(timestamp + random + userHash)

  return `BC-${timestamp}-${random}-${userHash}-${checksum}`.toUpperCase()
}

/**
 * Generates user-specific hash for enhanced security
 */
function generateUserHash(userData) {
  const userString = userData.name + userData.email + userData.role + userData.passport
  let hash = 0
  for (let i = 0; i < userString.length; i++) {
    const char = userString.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(36).substring(0, 6)
}

/**
 * Get blockchain transaction history for a user
 */
export function getBlockchainHistory(blockchainId) {
  const records = JSON.parse(localStorage.getItem("blockchainRecords") || "[]")
  const userRecord = records.find((record) => record.id === blockchainId)

  if (!userRecord) return []

  // Generate mock transaction history
  const history = [
    {
      id: generateTransactionId(),
      type: "registration",
      timestamp: userRecord.timestamp,
      status: "confirmed",
      blockHeight: Math.floor(Math.random() * 1000000) + 500000,
      gasUsed: "21000",
      fee: "0.001 ETH",
    },
    {
      id: generateTransactionId(),
      type: "verification",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      status: "confirmed",
      blockHeight: Math.floor(Math.random() * 1000000) + 500000,
      gasUsed: "15000",
      fee: "0.0005 ETH",
    },
  ]

  return history
}

/**
 * Generate transaction ID
 */
function generateTransactionId() {
  return "0x" + Math.random().toString(16).substring(2, 18).padStart(16, "0")
}

/**
 * Get verification level for blockchain ID
 */
export function getVerificationLevel(blockchainId) {
  const record = getBlockchainRecord(blockchainId)
  if (!record) return { level: 0, status: "unverified" }

  const age = Date.now() - new Date(record.timestamp).getTime()
  const ageInHours = age / (1000 * 60 * 60)

  if (ageInHours < 1) {
    return { level: 1, status: "basic", description: "Recently registered" }
  } else if (ageInHours < 24) {
    return { level: 2, status: "verified", description: "Identity verified" }
  } else {
    return { level: 3, status: "trusted", description: "Fully trusted identity" }
  }
}

/**
 * Get current blockchain network status
 */
export function getBlockchainNetworkStatus() {
  return {
    network: "Tourist Safety Chain",
    status: "online",
    blockHeight: Math.floor(Math.random() * 1000000) + 500000,
    gasPrice: "20 gwei",
    avgBlockTime: "15s",
    pendingTransactions: Math.floor(Math.random() * 100) + 50,
    lastUpdate: new Date().toISOString(),
  }
}

/**
 * Initiate blockchain ID recovery process
 */
export function initiateIdRecovery(email, backupData) {
  const recoveryId = generateRecoveryId()
  const timestamp = new Date().toISOString()

  const recoveryRequest = {
    id: recoveryId,
    email,
    backupData,
    timestamp,
    status: "pending",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
  }

  // Store recovery request
  const recoveryRequests = JSON.parse(localStorage.getItem("recoveryRequests") || "[]")
  recoveryRequests.push(recoveryRequest)
  localStorage.setItem("recoveryRequests", JSON.stringify(recoveryRequests))

  return recoveryRequest
}

/**
 * Generate recovery ID
 */
function generateRecoveryId() {
  return "REC-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 8)
}

/**
 * Create multi-signature verification request
 */
export function createMultiSigVerification(blockchainId, verifiers) {
  const multiSigId = generateMultiSigId()
  const timestamp = new Date().toISOString()

  const multiSigRequest = {
    id: multiSigId,
    blockchainId,
    verifiers,
    signatures: [],
    requiredSignatures: Math.ceil(verifiers.length / 2), // Majority required
    status: "pending",
    timestamp,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
  }

  // Store multi-sig request
  const multiSigRequests = JSON.parse(localStorage.getItem("multiSigRequests") || "[]")
  multiSigRequests.push(multiSigRequest)
  localStorage.setItem("multiSigRequests", JSON.stringify(multiSigRequests))

  return multiSigRequest
}

/**
 * Generate multi-signature ID
 */
function generateMultiSigId() {
  return "MS-" + Date.now().toString(36) + "-" + Math.random().toString(36).substring(2, 8)
}
