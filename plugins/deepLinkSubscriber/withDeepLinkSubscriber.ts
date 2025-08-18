import configPlugins from '@expo/config-plugins';
import type { ConfigPlugin } from '@expo/config-plugins';
const { withDangerousMod } = configPlugins as unknown as { withDangerousMod: typeof import('@expo/config-plugins').withDangerousMod };
import fs from 'fs';
import path from 'path';

const withDeepLinkSubscriber: ConfigPlugin = config => {
  return withDangerousMod(config, [
    'ios',
    async modConfig => {
      const srcPath = path.join(modConfig.modRequest.projectRoot, 'plugins', 'deepLinkSubscriber', 'DeepLinkSubscriber.swift');
      const destPath = path.join(modConfig.modRequest.platformProjectRoot, 'Gogue', 'DeepLinkSubscriber.swift');
      fs.copyFileSync(srcPath, destPath);
      return modConfig;
    },
  ]);
};

export default withDeepLinkSubscriber;
