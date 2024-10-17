import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import styles from '../Signup/Signup.style';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { getUser } from '../../db/users.db';
import { useDB } from '../../contexts/DBContexts';
import { useAuth } from '../../contexts/AuthContexts';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LangSwitcher';

type ErrorType = {
  password?: string;
  email?: string;
};
const Login = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [errors, setErrors] = useState<ErrorType>({});
  const [pressed, setPressed] = useState(false);
  const { db } = useDB();
  const { setUser } = useAuth();
  const validateForm = (): boolean => {
    let errors: ErrorType = {};
    if (!email) {
      errors.email = t('Email is required.');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = t('Email is invalid.');
    }
    if (!password) {
      errors.password = t('Password is empty.');
    }
    setErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };
  const handleSubmit = async () => {
    if (validateForm()) {
      console.log('Form submitted successfully!');
      // Proceed with form submission logic
      const users = await getUser(db, {
        email: email,
        password: password,
      });
      if (users.length) {
        setUser({
          name: '' + users[0].firstName + users[0].lastName,
          id: users[0].id,
        });
        navigation.navigate('HomeBase');
      } else {
        Alert.alert(t('Login failed: Email or Password wrong.'));
      }
    } else {
      console.log('Form has errors. Please correct them.');
    }
  };
  const gotoRegister = () => {
    navigation.navigate('Signup');
  };
  return (
    <>
      <ScrollView style={{ backgroundColor: '#fff' }}>
        <StatusBar barStyle="dark-content" backgroundColor={'#f9f9f9'} />
        <LanguageSwitcher />
        {/* <SafeAreaView style={styles.SafeAreaView1} /> */}
        <SafeAreaView style={styles.SafeAreaView2}>
          <View style={styles.outerWrapper}>
            <Text style={styles.pageTitle}>{t('Login')}</Text>
            <View style={styles.switchView}>
              <Text style={styles.text}>{t("Don't have an account?")} </Text>
              <Pressable onPress={gotoRegister}>
                <Text style={styles.switchText}>{t('Create now')}</Text>
              </Pressable>
            </View>
            <View style={styles.formView}>
              <Text style={styles.text}>{t('Email')}</Text>
              <TextInput
                placeholder={t('Email Address')}
                value={email}
                onChangeText={setEmail}
                style={styles.inputField}
              />
              {errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>
            <View style={styles.formView}>
              <Text style={styles.text}>{t('Password')}</Text>
              <TextInput
                placeholder={t('Password')}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.inputField}
              />
              {errors.password && (
                <Text style={styles.errorText}>{errors.password}</Text>
              )}
            </View>
            <View style={styles.formView}>
              <Pressable
                onPress={handleSubmit}
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}>
                <Text
                  style={[
                    styles.submitButton,
                    pressed ? styles.pressedButton : {},
                  ]}>
                  {t('Login')}
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

const styleUser = StyleSheet.create<any>({
  borderBottomWidth: 1,
  borderColor: '#eee',
  padding: 1,
  marginTop: 10,
});

export default Login;
