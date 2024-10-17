import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, View, Switch, StyleSheet, Text } from 'react-native';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => {
    setIsEnabled(!isEnabled);
  };
  useEffect(() => {
    if (isEnabled) changeLanguage('pt');
    else changeLanguage('en');
  }, [isEnabled]);
  return (
    <View style={styles.bound}>
      <View style={styles.container}>
        <Text>en</Text>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
        <Text>pt</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 10,
  },
  bound: {
    height: 30,
  },
});

export default LanguageSwitcher;
