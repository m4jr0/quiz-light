import AsyncStorage from '@react-native-async-storage/async-storage';

export const CacheHandler = (() => {
  let instance = null;

  function createInstance() {
    return new PrivateCacheHandler();
  }

  return {
    getInstance: () => {
      if (instance === null) {
        instance = createInstance();
      }

      return instance;
    },
  };
})();

class PrivateCacheHandler {
  constructor() {}

  wrapValue(value) {
    let strValue;

    if (typeof value === 'string') {
      strValue = value;
    } else {
      strValue = JSON.stringify(value);

      if (strValue === undefined) {
        return null;
      }
    }

    return JSON.stringify({
      strValue: strValue,
      type: typeof value,
    });
  }

  unwrapValue(strWrappedValue) {
    if (strWrappedValue === null) {
      return null;
    }

    try {
      const wrappedValue = JSON.parse(strWrappedValue);
      const strValue = wrappedValue.strValue;

      if (wrappedValue.type === 'string') {
        return strValue;
      }

      return JSON.parse(strValue);
    } catch (error) {
      console.error(
        `An error occurred while unwrapping a value: ${error}. Returning null.`,
      );
      return null;
    }
  }

  async setData(key, value) {
    try {
      await AsyncStorage.setItem(key, this.wrapValue(value));
    } catch (error) {
      console.error(`An error occurred while setting a value: ${error}.`);
      return false;
    }

    return true;
  }

  async getData(key, defaultValue = null) {
    try {
      const rawData = await AsyncStorage.getItem(key);

      if (rawData === null) {
        return defaultValue;
      }

      return this.unwrapValue(rawData);
    } catch (error) {
      console.error(`An error occurred while getting a value: ${error}.`);
      return null;
    }
  }

  async clearData(key) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`An error occurred while getting a value: ${error}.`);
      return null;
    }
  }
}
