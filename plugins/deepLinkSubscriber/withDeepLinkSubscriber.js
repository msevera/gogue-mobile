import configPlugins from '@expo/config-plugins';
const { withDangerousMod } = configPlugins;
import fs from 'fs';
import path from 'path';

const withDeepLinkSubscriber = config => {
  return withDangerousMod(config, [
    'ios',
    async modConfig => {
      const projectRoot = modConfig.modRequest.projectRoot;
      const iosRoot = modConfig.modRequest.platformProjectRoot;
      const srcPath = path.join(projectRoot, 'plugins', 'deepLinkSubscriber', 'DeepLinkSubscriber.swift');
      const destDir = path.join(iosRoot, 'Gogue');
      const destPath = path.join(destDir, 'DeepLinkSubscriber.swift');

      if (!fs.existsSync(srcPath)) {
        console.warn(`Source file not found at ${srcPath}`);
        return modConfig;
      }

      // Create the directory if it doesn't exist
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
        console.log(`Created directory: ${destDir}`);
      }

      fs.copyFileSync(srcPath, destPath);
      console.log('Copied DeepLinkSubscriber.swift successfully');

      return modConfig;
    },
  ]);
};

export default withDeepLinkSubscriber;
