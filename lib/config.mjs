import { readFileSync } from 'fs';
import { parse } from 'yaml';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load profile configuration from config/profile.yml
 * @returns {Object} Parsed profile configuration
 */
export function loadProfile() {
  const profilePath = join(__dirname, '..', 'config', 'profile.yml');
  const fileContents = readFileSync(profilePath, 'utf8');
  return parse(fileContents);
}

/**
 * Check if auto_submit is enabled
 * @returns {boolean} True if auto_submit is enabled
 */
export function isAutoSubmitEnabled() {
  const profile = loadProfile();
  return profile.auto_submit === true;
}

/**
 * Get candidate info from profile
 * @returns {Object} Candidate information
 */
export function getCandidate() {
  const profile = loadProfile();
  return profile.candidate;
}

export default { loadProfile, isAutoSubmitEnabled, getCandidate };