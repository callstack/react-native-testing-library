import { NativeModules } from 'react-native';

export default class NativeNotification {
  static show(title, body) {
    const module = NativeModules.NativeNotification;

    module.showNotification(title, body);
  }
}
