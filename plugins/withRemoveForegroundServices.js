// plugins/withRemoveForegroundServices.js
// Removes foreground service permissions and services injected by
// expo-audio native manifest (app only plays a short splash sound,
// no legitimate foreground service use case).
//
// NOTE: Gradle merges manifests from all native modules, so simply
// removing entries from the app manifest is not enough - the library
// manifest re-adds them. We must declare them with tools:node="remove"
// in the app manifest so the manifest merger strips them from the
// final merged AndroidManifest.xml.
const { withAndroidManifest } = require('expo/config-plugins');

const PERMISSIONS_TO_REMOVE = [
  'android.permission.FOREGROUND_SERVICE',
  'android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK',
  'android.permission.FOREGROUND_SERVICE_MICROPHONE',
  'android.permission.POST_NOTIFICATIONS',
  'android.permission.RECORD_AUDIO',
  'android.permission.SYSTEM_ALERT_WINDOW',
];

const SERVICES_TO_REMOVE = [
  '.service.AudioControlsService',
  '.service.AudioRecordingService',
];

module.exports = function withRemoveForegroundServices(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;

    // Ensure xmlns:tools is declared on <manifest>
    if (!manifest.$['xmlns:tools']) {
      manifest.$['xmlns:tools'] = 'http://schemas.android.com/tools';
    }

    // 1) Remove uses-permission entries declared directly in app manifest
    if (manifest['uses-permission']) {
      manifest['uses-permission'] = manifest['uses-permission'].filter(
        (perm) => !PERMISSIONS_TO_REMOVE.includes(perm.$['android:name'])
      );
    }

    // 2) Add tools:node="remove" declarations so the manifest merger
    //    strips the same permissions coming from library manifests
    //    (expo-audio, react-native, etc.)
    const removePermissions = PERMISSIONS_TO_REMOVE.map((name) => ({
      $: {
        'android:name': name,
        'tools:node': 'remove',
      },
    }));
    manifest['uses-permission'] = [
      ...(manifest['uses-permission'] || []),
      ...removePermissions,
    ];

    // 3) Disable + remove services declared by expo-audio via merger
    const application = manifest.application?.[0];
    if (application) {
      const removeServices = SERVICES_TO_REMOVE.map((name) => ({
        $: {
          'android:name': name,
          'tools:node': 'remove',
        },
      }));
      application.service = [
        ...(application.service || []),
        ...removeServices,
      ];
    }

    return config;
  });
};