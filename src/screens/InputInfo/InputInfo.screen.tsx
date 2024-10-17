import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useTransition,
} from 'react';
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
  Button,
  Platform,
  Alert,
} from 'react-native';
import RNPickerSelect, { Item } from 'react-native-picker-select';
import styles from '../Signup/Signup.style';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { formatDate } from '../../utils/utils';
import {
  addSalesInfo,
  updateSalesInfo,
  deleteSalesInfo,
  getSalesInfos,
} from '../../db/salesinfo.db';
import { useDB } from '../../contexts/DBContexts';
import { useAuth } from '../../contexts/AuthContexts';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LangSwitcher';

type ErrorType = {
  date?: string;
  buysellID?: string;
  amount?: string;
  fee?: string;
  crypto?: string;
  description?: string;
  quantity?: string;
  country?: string;
  countryDescription?: string;
  cpfCNPJ?: string;
  name?: string;
  address?: string;
};
const InputInfo = ({ navigation }: any) => {
  const { t } = useTranslation();
  const buyTypes: Item[] = [
    { label: t('Buy'), value: t('Buy') },
    { label: t('Sell'), value: t('Sell') },
  ];
  const countries: Item[] = [
    { label: t('Br'), value: t('Br') },
    { label: t('USA'), value: t('USA') },
  ];
  const countryDescriptions = [t('Brazil'), t('United State')];
  const cryptos: Item[] = [
    { label: 'BTC', value: 'BTC' },
    { label: 'ETH', value: 'ETH' },
    { label: 'DCR', value: 'DCR' },
    { label: 'LTC', value: 'LTC' },
    { label: 'BRZ', value: 'BRZ' },
    { label: 'USDT', value: 'USDT' },
    { label: 'Trx', value: 'Trx' },
    { label: 'USDC', value: 'USDC' },
    { label: 'brl', value: 'brl' },
    { label: 'Uyu', value: 'Uyu' },
  ];
  const cryptoDescriptions = [
    'Bitcoin',
    'Ethereum',
    'Decred',
    'Litecoin',
    'Brazilian Token',
    'Theter',
    'Tron',
    'USD Coin',
    'Brazilian Real',
    'Uruguayan Peso',
  ];

  const [buyType, setBuyType] = useState('');
  // const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [fee, setFee] = useState('');
  const [crypto, setCrypto] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [country, setCountry] = useState('');
  const [countryDescription, setCountryDescription] = useState('');
  const [cpfCNPJ, setCPFCNPJ] = useState('');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const [phase, setPhase] = useState(0);

  const [errors, setErrors] = useState<ErrorType>({});
  const [pressed, setPressed] = useState(false);
  const { db, setDBChanged } = useDB();
  const { user } = useAuth();
  const scrollRef = useRef(null);

  const validateForm = (): boolean => {
    let errors: ErrorType = {};
    // if (!email) {
    //   errors.email = 'Email is required.';
    // } else if (!/\S+@\S+\.\S+/.test(email)) {
    //   errors.email = 'Email is invalid.';
    // }
    // if (!password) {
    //   errors.password = 'Password is empty.';
    // }
    setErrors(errors);
    return Object.keys(errors).length === 0; // Returns true if no errors
  };
  const clearInputs = () => {
    setBuyType('');
    setAmount('');
    setFee('');
    setCrypto('');
    setDescription('');
    setQuantity('');
    setCountry('');
    setCountryDescription('');
    setCPFCNPJ('');
    setName('');
    setAddress('');
  };
  const handleSubmit = async () => {
    if (validateForm()) {
      console.log('Form submitted successfully!');
      // Proceed with form submission logic
      const result = await addSalesInfo(db, {
        date: dateString,
        buyType: buyType,
        amount: amount,
        fee: fee,
        crypto: crypto,
        cryptoDescription: description,
        quantity: quantity,
        country: country,
        countryDescription: countryDescription,
        cpfCNPJ: cpfCNPJ,
        name: name,
        address: address,
        userId: user?.id,
      });
      if (result) {
        Alert.alert(t('One record added!'));
        setDBChanged(true);
        clearInputs();
      }
    } else {
      console.log('Form has errors. Please correct them.');
    }
  };

  const [displayDate, setDisplayDate] = useState(new Date());
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [dateString, setDateString] = useState('');
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState(0);
  const [flag1, setFlag1] = useState(false);
  const [flag2, setFlag2] = useState(false);

  const onChange = useCallback((event: any, selectedDate?: Date) => {
    // const currentDate = selectedDate;
    console.log('selectedDate:', selectedDate);
    if (mode < 1) {
      if (flag1) return;
      console.log('mode:', mode, 'flag1: ', flag1);
      setDate(selectedDate || date);
      setMode(1);
      setFlag1(true);
    } else {
      if (flag2) return;
      setTime(selectedDate || time);
      setShow(Platform.OS === 'ios');
      setFlag2(true);
    }
    setDisplayDate(selectedDate || displayDate);
  }, []);

  // useEffect(() => {
  //   if (mode < 1) {
  //     setDate(displayDate);
  //     console.log('mode: ', mode, 'date: ', date, 'time: ', time);
  //   } else {
  //     setTime(displayDate);
  //   }
  // }, [displayDate]);
  useEffect(() => {
    setDateString(
      formatDate(
        new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          time.getHours(),
          time.getMinutes(),
          time.getSeconds(),
        ),
      ),
    );
  }, [date, time]);
  const showDatepicker = () => {
    setMode(0);
    setShow(true);
    setFlag1(false);
    setFlag2(false);
  };
  const closeDateTime = useCallback(() => {
    setShow(false);
  }, []);

  const [datetimePicker] = useState(
    <RNDateTimePicker
      testID="dateTimePicker"
      value={time}
      mode={mode < 1 ? 'date' : 'time'}
      is24Hour={true}
      display="default"
      onChange={onChange}
      onPointerLeave={closeDateTime}
    />,
  );

  return (
    <>
      <ScrollView
        ref={scrollRef}
        onContentSizeChange={() => {
          if (Platform.OS === 'ios') {
            scrollRef.current?.scrollToEnd({ animated: true });
          }
        }}>
        <StatusBar barStyle="dark-content" backgroundColor={'#f9f9f9'} />
        {/* <SafeAreaView style={styles.SafeAreaView1} /> */}
        <LanguageSwitcher />
        <SafeAreaView style={styles.SafeAreaView2}>
          <View style={styles.outerWrapper}>
            <Text style={styles.pageTitle}>{t('Input Transaction Info')}</Text>

            <View style={styles.formView}>
              <Text style={styles.text}>{t('Transaction Type')}</Text>
              <View style={styles.pickerSelect}>
                <RNPickerSelect
                  onValueChange={value => setBuyType(value)}
                  items={buyTypes}
                  placeholder={{
                    label: t('Select a transaction type'),
                    value: null,
                  }} // Optional placeholder11
                />
              </View>
              {errors.buysellID && (
                <Text style={styles.errorText}>{errors.buysellID}</Text>
              )}
            </View>
            <View style={styles.formView}>
              <Text style={styles.text}>{t('Date')}</Text>
              <TextInput
                placeholder="2024-01-31 12:00"
                value={dateString}
                onChangeText={setDateString}
                onFocus={showDatepicker}
                style={styles.inputField}
              />
              {/* <Button onPress={showDatepicker} title="Show Date Picker" /> */}
              {show && datetimePicker}
              {/* <Text>
                Selected Date: {date.toDateString() + time.toTimeString()}
              </Text> */}
              {errors.date && (
                <Text style={styles.errorText}>{errors.date}</Text>
              )}
            </View>
            <View style={styles.formView}>
              <Text style={styles.text}>{t('Amount')}</Text>
              <TextInput
                placeholder={t('Amount of Crypto')}
                value={amount}
                onChangeText={setAmount}
                style={styles.inputField}
              />
              {errors.amount && (
                <Text style={styles.errorText}>{errors.amount}</Text>
              )}
            </View>
            <View style={styles.formView}>
              <Text style={styles.text}>{t('Fee')}</Text>
              <TextInput
                placeholder={t('Fee of Transaction')}
                value={fee}
                onChangeText={setFee}
                style={styles.inputField}
              />
              {errors.fee && <Text style={styles.errorText}>{errors.fee}</Text>}
            </View>
            <View style={styles.formView}>
              <Text style={styles.text}>{t('Crypto')}</Text>
              <View style={styles.pickerSelect}>
                <RNPickerSelect
                  onValueChange={(value, index) => {
                    setCrypto(value);
                    setDescription(cryptoDescriptions[index - 1]);
                  }}
                  items={cryptos}
                  placeholder={{
                    label: t('Select a crypto type'),
                    value: null,
                  }} // Optional placeholder
                />
              </View>
              {errors.crypto && (
                <Text style={styles.errorText}>{errors.crypto}</Text>
              )}
            </View>
            <View style={styles.formView}>
              <Text style={styles.text}>{t('Crypto Description')}</Text>
              <TextInput
                placeholder={t('Crypto Description')}
                value={description}
                onChangeText={setDescription}
                style={styles.inputField}
              />
              {errors.description && (
                <Text style={styles.errorText}>{errors.description}</Text>
              )}
            </View>
            <View style={styles.formView}>
              <Text style={styles.text}>{t('Quantity')}</Text>
              <TextInput
                placeholder={t('Quantity')}
                value={quantity}
                onChangeText={setQuantity}
                style={styles.inputField}
              />
              {errors.quantity && (
                <Text style={styles.errorText}>{errors.quantity}</Text>
              )}
            </View>

            {/**User Info */}
            <View style={styles.formView}>
              <View style={styles.pickerSelect}>
                <RNPickerSelect
                  onValueChange={(value, index) => {
                    setCountry(value);
                    setCountryDescription(countryDescriptions[index - 1]);
                  }}
                  items={countries}
                  placeholder={{
                    label: t('Select a country'),
                    value: null,
                  }} // Optional placeholder
                />
              </View>
              {errors.country && (
                <Text style={styles.errorText}>{errors.country}</Text>
              )}
            </View>
            <View style={styles.formView}>
              <Text style={styles.text}>{t('Country Description')}</Text>
              <TextInput
                placeholder={t('Country description')}
                value={countryDescription}
                onChangeText={setCountryDescription}
                style={styles.inputField}
              />
              {errors.countryDescription && (
                <Text style={styles.errorText}>
                  {errors.countryDescription}
                </Text>
              )}
            </View>
            <View style={styles.formView}>
              <Text style={styles.text}>{t('Buyer CPFCNPJ')}</Text>
              <TextInput
                placeholder=""
                value={cpfCNPJ}
                onChangeText={setCPFCNPJ}
                style={styles.inputField}
              />
              {errors.cpfCNPJ && (
                <Text style={styles.errorText}>{errors.cpfCNPJ}</Text>
              )}
            </View>
            <View style={styles.formView}>
              <Text style={styles.text}>{t('Buyer Name')}</Text>
              <TextInput
                placeholder={t('John')}
                value={name}
                onChangeText={setName}
                style={styles.inputField}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>
            <View style={styles.formView}>
              <Text style={styles.text}>{t('Buyer Address')}</Text>
              <TextInput
                placeholder=""
                value={address}
                onChangeText={setAddress}
                style={styles.inputField}
              />
              {errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
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
                  {t('Save')}
                </Text>
              </Pressable>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    </>
  );
};

export default InputInfo;
