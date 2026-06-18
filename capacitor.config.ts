import type { CapacitorConfig } from '@capacitor/cli';
import * as dotenv from 'dotenv'

dotenv.config()

const config: CapacitorConfig = {
  appId: 'com.hmarmedia.app',
  appName: 'hmar-media',
  webDir: 'build',
  android: {
    buildOptions: {
      keystorePath: process.env.ANDROID_KEYSTORE_PATH,
      keystorePassword: process.env.ANDROID_KEYSTORE_PASSWORD,
      keystoreAlias: process.env.ANDROID_KEY_ALIAS,
      keystoreAliasPassword: process.env.ANDROID_KEY_PASSWORD,
    },
  }
};

export default config;
