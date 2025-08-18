import configPlugins from '@expo/config-plugins';
const { withDangerousMod } = configPlugins;
import fs from 'fs';
import path from 'path';

const withDeepLinkSubscriber = config => {
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
