import React, {useState} from 'react';
import * as Battery from 'expo-battery';

export const useBattery = async() => {
  const [batteryLevel, setBatteryLevel] = useState(null)
  const level = await Battery.getBatteryLevelAsync();
  setBatteryLevel(level)
  console.log((batteryLevel   * 100).toFixed(0))

  return {batteryLevel}
}
