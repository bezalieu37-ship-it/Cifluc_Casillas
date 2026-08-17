// plugins/withRemoveForegroundServices.js
// Remove foreground service permissions and services injected by
// expo-audio native manifest (app only plays a short splash sound,
// no legitimate foreground service use case).
const { withAndroidManifest } = require('expo/config-plugins');

const PERMISSIONS_TO_REMOVE = [
  'android.permission.FOREGROUND_SERVICE',
  'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
  'android.permission.FOREGROUND_SERVICE_MICROPHONE',
  'android.permission.POST_NOTIFICATIONS',
];

const SERVICES_TO_DISABLE = [
  '.service.AudioControlsService',
  '.service.AudioRecordingService',
];

module.exports = function withRemoveForegroundServices(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    // Remove uses-permission entries
    if (manifest['uses-permission']) {
      manifest['uses-permission'] = manifest['uses-permission'].filter(
        (perm) =>
          !PERMISSIONS_TO_REMOVE.includes(perm.$['android:name'])
      );
    }

    // Disable services declared by expo-audio (keep manifest merge happy,
    // but mark them disabled so they never run and don't require the
    // foreground service permission)
    const application = manifest.application?.[0];
    if (application && application.service) {
      application.service = application.service.map((service) => {
        const name = service.$['android:name'];
        if (SERVICES_TO_DISABLE.includes(name)) {
          service.$['android:enabled'] = 'false';
          service.$['android:exported'] = 'false';
        }
        return service;
      });
    }

    return config;
  });
};