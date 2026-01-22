
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="social" name="(social)">
        <Icon sf="house.fill" />
        <Label>Social</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon sf="magnifyingglass" />
        <Label>Discover</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="log" name="modal" href="/modal">
        <Icon sf="plus.circle.fill" />
        <Label>Rate</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="profile" name="profile">
        <Icon sf="person.fill" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
