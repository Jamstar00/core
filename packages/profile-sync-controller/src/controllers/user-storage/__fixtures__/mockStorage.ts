import encryption, { createSHA256Hash } from '../encryption';

export const MOCK_STORAGE_KEY_SIGNATURE = 'mockStorageKey';
export const MOCK_STORAGE_KEY = createSHA256Hash(MOCK_STORAGE_KEY_SIGNATURE);
export const MOCK_STORAGE_DATA = JSON.stringify({ hello: 'world' });

// NOTE - using encryption.encryptString directly in fixtures causes issues on mobile.
// This is because this fixture is getting added in at run time. Will be improved once we support multiple exports
let cachedMockEncryptedData: string;
export const MOCK_ENCRYPTED_STORAGE_DATA = async () =>
  (cachedMockEncryptedData ??= await encryption.encryptString(
    MOCK_STORAGE_DATA,
    MOCK_STORAGE_KEY,
  ));
