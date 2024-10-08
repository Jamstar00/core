import {
  mockEndpointGetUserStorage,
  mockEndpointUpsertUserStorage,
  mockEndpointGetUserStorageAllFeatureEntries,
} from './__fixtures__/mockServices';
import {
  MOCK_ENCRYPTED_STORAGE_DATA,
  MOCK_STORAGE_DATA,
  MOCK_STORAGE_KEY,
} from './__fixtures__/mockStorage';
import type { GetUserStorageResponse } from './services';
import {
  getUserStorage,
  getUserStorageAllFeatureEntries,
  upsertUserStorage,
} from './services';

describe('user-storage/services.ts - getUserStorage() tests', () => {
  const actCallGetUserStorage = async () => {
    return await getUserStorage({
      bearerToken: 'MOCK_BEARER_TOKEN',
      path: 'notifications.notificationSettings',
      storageKey: MOCK_STORAGE_KEY,
    });
  };

  it('returns user storage data', async () => {
    const mockGetUserStorage = await mockEndpointGetUserStorage();
    const result = await actCallGetUserStorage();

    mockGetUserStorage.done();
    expect(result).toBe(MOCK_STORAGE_DATA);
  });

  it('returns null if endpoint does not have entry', async () => {
    const mockGetUserStorage = await mockEndpointGetUserStorage(
      'notifications.notificationSettings',
      { status: 404 },
    );
    const result = await actCallGetUserStorage();

    mockGetUserStorage.done();
    expect(result).toBeNull();
  });

  it('returns null if endpoint fails', async () => {
    const mockGetUserStorage = await mockEndpointGetUserStorage(
      'notifications.notificationSettings',
      { status: 500 },
    );
    const result = await actCallGetUserStorage();

    mockGetUserStorage.done();
    expect(result).toBeNull();
  });

  it('returns null if unable to decrypt data', async () => {
    const badResponseData: GetUserStorageResponse = {
      HashedKey: 'MOCK_HASH',
      Data: 'Bad Encrypted Data',
    };
    const mockGetUserStorage = await mockEndpointGetUserStorage(
      'notifications.notificationSettings',
      {
        status: 200,
        body: badResponseData,
      },
    );
    const result = await actCallGetUserStorage();

    mockGetUserStorage.done();
    expect(result).toBeNull();
  });
});

describe('user-storage/services.ts - getUserStorageAllFeatureEntries() tests', () => {
  const actCallGetUserStorageAllFeatureEntries = async () => {
    return await getUserStorageAllFeatureEntries({
      bearerToken: 'MOCK_BEARER_TOKEN',
      path: 'notifications',
      storageKey: MOCK_STORAGE_KEY,
    });
  };

  it('returns user storage data', async () => {
    const mockGetUserStorageAllFeatureEntries =
      await mockEndpointGetUserStorageAllFeatureEntries('notifications');
    const result = await actCallGetUserStorageAllFeatureEntries();

    mockGetUserStorageAllFeatureEntries.done();
    expect(result).toStrictEqual([MOCK_STORAGE_DATA]);
  });

  it('returns null if endpoint does not have entry', async () => {
    const mockGetUserStorage =
      await mockEndpointGetUserStorageAllFeatureEntries('notifications', {
        status: 404,
      });
    const result = await actCallGetUserStorageAllFeatureEntries();

    mockGetUserStorage.done();
    expect(result).toBeNull();
  });

  it('returns null if endpoint fails', async () => {
    const mockGetUserStorage =
      await mockEndpointGetUserStorageAllFeatureEntries('notifications', {
        status: 500,
      });
    const result = await actCallGetUserStorageAllFeatureEntries();

    mockGetUserStorage.done();
    expect(result).toBeNull();
  });

  it('returns null if unable to decrypt data', async () => {
    const badResponseData: GetUserStorageResponse = {
      HashedKey: 'MOCK_HASH',
      Data: 'Bad Encrypted Data',
    };
    const mockGetUserStorage =
      await mockEndpointGetUserStorageAllFeatureEntries('notifications', {
        status: 200,
        body: badResponseData,
      });
    const result = await actCallGetUserStorageAllFeatureEntries();

    mockGetUserStorage.done();
    expect(result).toBeNull();
  });
});

describe('user-storage/services.ts - upsertUserStorage() tests', () => {
  const actCallUpsertUserStorage = async () => {
    const encryptedData = await MOCK_ENCRYPTED_STORAGE_DATA();
    return await upsertUserStorage(encryptedData, {
      bearerToken: 'MOCK_BEARER_TOKEN',
      path: 'notifications.notificationSettings',
      storageKey: MOCK_STORAGE_KEY,
    });
  };

  it('invokes upsert endpoint with no errors', async () => {
    const mockUpsertUserStorage = mockEndpointUpsertUserStorage();
    await actCallUpsertUserStorage();

    expect(mockUpsertUserStorage.isDone()).toBe(true);
  });

  it('throws error if unable to upsert user storage', async () => {
    const mockUpsertUserStorage = mockEndpointUpsertUserStorage(
      'notifications.notificationSettings',
      {
        status: 500,
      },
    );

    await expect(actCallUpsertUserStorage()).rejects.toThrow(expect.any(Error));
    mockUpsertUserStorage.done();
  });
});
