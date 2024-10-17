import { Permission, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

export async function requestStoragePermission() {
    let permission: Permission | null = null;

    if (Platform.OS === 'android') {
        permission = PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE;
    } else if (Platform.OS === 'ios') {
        permission = PERMISSIONS.IOS.PHOTO_LIBRARY; // Use this for broader storage scenarios on iOS
    }
    if(permission == null) return false;
    const result = await check(permission);
    switch (result) {
        case RESULTS.UNAVAILABLE:
            console.log('This feature is not available on this device/context');
            return false;
        case RESULTS.DENIED:
            const requestResult = await request(permission);
            return requestResult === RESULTS.GRANTED;
        case RESULTS.LIMITED:
            console.log('The permission is limited: some actions are possible');
            return true;
        case RESULTS.GRANTED:
            console.log('The permission is granted');
            return true;
        case RESULTS.BLOCKED:
            console.log('The permission is blocked');
            return false;
    }
}