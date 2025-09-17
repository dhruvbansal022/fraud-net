export type AppEnvKey = 'stage2' | 'prod';

export interface DiroConfig {
  apiUrl: string;
  smartUploadUrl?: string;
  apiKey?: string;
  authToken?: string; // raw token, without 'Bearer '
  defaultButtonId?: string;
  warnTrackId1?: string;
  warnTrackId2?: string;
}

export interface AppEnvConfig {
  diro: DiroConfig;
}

export const ENVIRONMENTS: Record<AppEnvKey, AppEnvConfig> = {
  stage2: {
    diro: {
      apiUrl: 'https://api.dirolabs.com/betav3/smartFeedback',
      smartUploadUrl: 'https://api.dirolabs.com/betav3/smartUpload',
      apiKey: 'd-b825e93fc17bd53e78d06f2fb059b753',
      authToken:
        'eyJjdHkiOiJKV1QiLCJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJyaXNoYWJoQGRpcm8uaW8iLCJzZWNyZXRLZXkiOiJDby9iNEREams5dWM1VFJ6OVI4bHBJU1VFeEdmZDc4amVJTTB3K0d2SldHRi9IaGZpcHJsSlRibEMzTHA4eDR4IiwiaWF0IjoxNzIxNjM1Nzc1fQ.I_08MkPtoSHPZxOdcsREhA2duRwAQ2Eftx3-OHr0RXbYjbsY5-i2Obw0R75bTOwrMn0gA-2gxGD9UaoSmkRnZg',
      defaultButtonId: 'O.DD-HOM0Xa-4HPc-sandbox',
      warnTrackId1: '',
      warnTrackId2: '',
    },
  },
  prod: {
    diro: {
      apiUrl: '',
      smartUploadUrl: '',
      apiKey: '',
      authToken: '',
      defaultButtonId: '',
      warnTrackId1: '',
      warnTrackId2: '',
    },
  },
};

// Allow selecting env via Vite env, default to 'stage2'
export const CURRENT_ENV_KEY: AppEnvKey = ((import.meta as any).env?.VITE_APP_ENV as AppEnvKey) || 'stage2';

export const env: AppEnvConfig = ENVIRONMENTS[CURRENT_ENV_KEY];

export const getDiroAuthHeader = (): string | undefined =>
  env.diro.authToken ? `Bearer ${env.diro.authToken}` : undefined;

export const ensureConfig = () => {
  if (!env?.diro?.apiUrl) {
    console.warn('[Config] Missing DIRO apiUrl for env:', CURRENT_ENV_KEY);
  }
  if (!env?.diro?.smartUploadUrl) {
    console.warn('[Config] Missing DIRO smartUploadUrl for env:', CURRENT_ENV_KEY);
  }
};


