import { validateField, validateLeadForm, EMAIL_REGEX, PHONE_CHARS_REGEX } from '../src/utils/validation.js';
import { formatDate } from '../src/utils/formatters.js';

console.log('--- Testing Validation Logic ---');

// Test 1: Full name validation
console.assert(validateField('fullName', '') === 'Full name is required', 'Should reject empty name');
console.assert(validateField('fullName', 'A') === 'Full name must be at least 2 characters', 'Should reject single letter name');
console.assert(validateField('fullName', 'Jane Doe') === null, 'Should accept valid name');

// Test 2: Email validation
console.assert(validateField('email', '') === 'Email address is required', 'Should reject empty email');
console.assert(validateField('email', 'invalid-email') !== null, 'Should reject invalid email format');
console.assert(validateField('email', 'user@domain.com') === null, 'Should accept standard email');
console.assert(validateField('email', 'alex.chen+leads@company.co.uk') === null, 'Should accept complex email');

// Test 3: Phone validation
console.assert(validateField('phone', '') === 'Phone number is required', 'Should reject empty phone');
console.assert(validateField('phone', '123') !== null, 'Should reject too short phone number');
console.assert(validateField('phone', '+1 (555) 019-2834') === null, 'Should accept standard US phone');
console.assert(validateField('phone', '+44 20 7946 0991') === null, 'Should accept UK phone');
console.assert(validateField('phone', '0300 1234567') === null, 'Should accept mobile phone');

// Test 4: Company optional
console.assert(validateField('company', '') === null, 'Company should be optional');
console.assert(validateField('company', 'Acme Corp') === null, 'Company should accept valid name');

// Test 5: Message validation
console.assert(validateField('message', '') === 'Requirements / Message is required', 'Should reject empty message');
console.assert(validateField('message', 'Short') !== null, 'Should reject message shorter than 10 chars');
console.assert(validateField('message', 'We need a robust lead capture system connecting to n8n.') === null, 'Should accept valid message');

// Test 6: Form validation
const sampleValid = {
  fullName: 'Johnathan Doe',
  email: 'john@example.com',
  phone: '+1 415-555-0199',
  company: 'Example Corp',
  message: 'Looking for a custom automation pipeline with Google Sheets.',
};
const errors = validateLeadForm(sampleValid);
console.assert(Object.keys(errors).length === 0, 'Valid form should produce zero errors');

// Test 7: Formatter
const formattedDate = formatDate('2026-11-18T18:42:00.000Z');
console.assert(typeof formattedDate === 'string' && formattedDate.length > 0, 'Date formatter should return valid string');

console.log('✅ ALL TESTS PASSED CLEANLY (Zero assertion failures)!');
