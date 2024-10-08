import type {
  UserStoragePathWithFeatureAndKey,
  UserStoragePathWithFeatureOnly,
} from '../schema';
import { createEntryPath } from '../schema';
import type {
  GetUserStorageAllFeatureEntriesResponse,
  GetUserStorageResponse,
} from '../services';
import { USER_STORAGE_ENDPOINT } from '../services';
import { MOCK_ENCRYPTED_STORAGE_DATA, MOCK_STORAGE_KEY } from './mockStorage';

type MockResponse = {
  url: string;
  requestMethod: 'GET' | 'POST' | 'PUT';
  response: unknown;
};

export const getMockUserStorageEndpoint = (
  path: UserStoragePathWithFeatureAndKey | UserStoragePathWithFeatureOnly,
) => {
  if (path.split('.').length === 1) {
    return `${USER_STORAGE_ENDPOINT}/${path}`;
  }

  return `${USER_STORAGE_ENDPOINT}${createEntryPath(
    path as UserStoragePathWithFeatureAndKey,
    MOCK_STORAGE_KEY,
  )}`;
};

const MOCK_GET_USER_STORAGE_RESPONSE =
  async (): Promise<GetUserStorageResponse> => ({
    HashedKey: 'HASHED_KEY',
    Data: await MOCK_ENCRYPTED_STORAGE_DATA(),
  });

const MOCK_GET_USER_STORAGE_ALL_FEATURE_ENTRIES_RESPONSE =
  async (): Promise<GetUserStorageAllFeatureEntriesResponse> => [
    {
      HashedKey: 'HASHED_KEY',
      Data: await MOCK_ENCRYPTED_STORAGE_DATA(),
    },
  ];

export const getMockUserStorageGetResponse = async (
  path: UserStoragePathWithFeatureAndKey = 'notifications.notificationSettings',
) => {
  return {
    url: getMockUserStorageEndpoint(path),
    requestMethod: 'GET',
    response: await MOCK_GET_USER_STORAGE_RESPONSE(),
  } satisfies MockResponse;
};

export const getMockUserStorageAllFeatureEntriesResponse = async (
  path: UserStoragePathWithFeatureOnly = 'notifications',
) => {
  return {
    url: getMockUserStorageEndpoint(path),
    requestMethod: 'GET',
    response: await MOCK_GET_USER_STORAGE_ALL_FEATURE_ENTRIES_RESPONSE(),
  } satisfies MockResponse;
};

export const getMockUserStoragePutResponse = (
  path: UserStoragePathWithFeatureAndKey = 'notifications.notificationSettings',
) => {
  return {
    url: getMockUserStorageEndpoint(path),
    requestMethod: 'PUT',
    response: null,
  } satisfies MockResponse;
};
