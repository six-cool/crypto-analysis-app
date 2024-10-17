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
} from 'react-native';
import styles from './Signup.style';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { addUser } from '../../db/users.db';
import { useDB } from '../../contexts/DBContexts';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LangSwitcher';
type ErrorType = {
  firstName?: string;
  lastName?: string;
  password?: string;
  confirmPass?: string;
  email?: string;
};
const Signup = ({ navigation }: any) => {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [errors, setErrors] = useState<ErrorType>({});
  const [pressed, setPressed] = useState(false);
  const { db } = useDB();
  const validateForm = (): boolean => {
    let errors: ErrorType = {};
    if (!firstName) {
      errors.firstName = t('Name is required.');
    }
    if (!email) {
      errors.email = t('Email is required.');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = t('Email is invalid.');
    }
    if (!password) {
      errors.password = t('Password is required.');
    } else if (password.length < 6) {
      errors.password = t('Password must be at least 6 characters.');
    }
    if (!confirmPass || password != confirmPass) {
      errors.confirmPass = t("Confirm password doesn't match");
    }
    setErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };
  const handleSubmit = async () => {
    if (validateForm()) {
      console.log('Form submitted successfully!');
      await addUser(db, {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
      });
      navigation.navigate('Login');
      // Proceed with form submission logic
    } else {
      console.log('Form has errors. Please correct them.');
    }
  };
  const gotoLogin = () => {
    navigation.navigate('Login');
  };
  return (
    <>
      <ScrollView style={{ backgroundColor: '#fff' }}>
        <StatusBar barStyle="dark-content" backgroundColor={'#f9f9f9'} />
        <LanguageSwitcher />
        {/* <SafeAreaView style={styles.SafeAreaView1} /> */}
        <SafeAreaView style={styles.SafeAreaView2}>
          <View style={styles.outerWrapper}>
            <Text style={styles.pageTitle}>{t('Create Your Account')}</Text>
            <View style={styles.switchView}>
              <Text style={styles.text}>{t('Already have an account?')} </Text>
              <Pressable onPress={gotoLogin}>
                <Text style={styles.switchText}>{t('Login')}</Text>
              </Pressable>
            </View>
            <View style={styles.formView}>
              <Text style={styles.text}>{t('First Name')}</Text>

              <TextInput
                placeholder={t('First Name')}
                value={firstName}
                onChangeText={setFirstName}
                style={styles.inputField}
              />
              {errors.firstName && (
                <Text style={styles.errorText}>{errors.firstName}</Text>
              )}
            </View>
            <View style={styles.formView}>
              <Text style={styles.text}>{t('Last Name')}</Text>
              <TextInput
                placeholder={t('Last Name')}
                value={lastName}
                onChangeText={setLastName}
                style={styles.inputField}
              />
              {errors.lastName && (
                <Text style={styles.errorText}>{errors.lastName}</Text>
              )}
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
              <Text style={styles.text}>{t('Confirm Password')}</Text>
              <TextInput
                placeholder={t('Input the your password again.')}
                value={confirmPass}
                onChangeText={setConfirmPass}
                secureTextEntry
                style={styles.inputField}
              />
              {errors.confirmPass && (
                <Text style={styles.errorText}>{errors.confirmPass}</Text>
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
                  {t('Sign Up')}
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

export default Signup;
