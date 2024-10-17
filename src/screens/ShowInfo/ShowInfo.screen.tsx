import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Text,
  Modal,
  Button,
  TextInput,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  Table,
  Row,
  Rows,
  TableWrapper,
  Cell,
} from 'react-native-table-component';
import { useAuth } from '../../contexts/AuthContexts';
import {
  addSalesInfo,
  deleteSalesInfo,
  getDataBetweenDates,
  getSalesInfos,
} from '../../db/salesinfo.db';
import { useDB } from '../../contexts/DBContexts';
import styles from '../Signup/Signup.style';
import { useTranslation } from 'react-i18next';
import { exportToCSV } from '../../utils/utils';
import { requestStoragePermission } from '../../utils/permission';
import LanguageSwitcher from '../../components/LangSwitcher';
import Icon from 'react-native-vector-icons/Ionicons';

interface TableData {
  tableHead: string[];
  tableData: string[][];
}

const ShowInfo: React.FC = () => {
  const { t } = useTranslation();
  const [data, setData]: [TableData, any] = useState({
    tableHead: [
      t('No'),
      t('Transaction Type'),
      t('Date'),
      t('Amount'),
      t('Fee'),
      t('Crypto'),
      t('Description'),
      t('Quantity'),
      t('Country'),
      t('Country Description'),
      t('CPFCNPJ'),
      t('Name'),
      t('Address'),
    ],
    tableData: [['1', '', '', '', '', '', '', '', '', '', '', '', '']],
  });
  const { user } = useAuth();
  const { db, dbChanged, setDBChanged } = useDB();
  const [pressed1, setPressed1] = useState(false);
  const [pressed2, setPressed2] = useState(false);
  const [visible, setVisible] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const fetchData = async () => {
    const results = await getSalesInfos(db, user?.id);
    const tData = results.map((info, index) => {
      return [
        index + 1,
        info.buyType,
        info.date,
        info.amount,
        info.fee,
        info.crypto,
        info.cryptoDescription,
        info.quantity,
        info.country,
        info.countryDescription,
        info.cpfCNPJ,
        info.name,
        info.address,
        info.id,
      ];
    });
    setData({ ...data, tableData: tData });
  };
  useEffect(() => {
    if (!dbChanged) return;
    fetchData();
    setDBChanged(false);
  }, [dbChanged]);
  useEffect(() => {
    fetchData();
  }, []);
  const handleFilter = async () => {
    if (!fromDate) setFromDate('1970-01-01');
    if (!toDate) setToDate('2050-12-31');
    // const results = await getDataBetweenDates(db, '01/01/1970', '12/31/2050');
  };
  useEffect(() => {
    const tData = data.tableData.filter(info => {
      console.log('info[2] > fromDate: ', info[2] > fromDate);
      console.log('info[2] < toDate: ', info[2] < toDate);
      return info[2] > fromDate && info[2] < toDate;
    });
    setData({ ...data, tableData: tData });
  }, [fromDate, toDate]);
  const handleExport = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      console.log('Permission denied');
      return;
    }
    const tableHead = [
      t('No'),
      t('Transaction Type'),
      t('Date'),
      t('Amount'),
      t('Fee'),
      t('Crypto'),
      t('Description'),
      t('Quantity'),
      t('Country'),
      t('Country Description'),
      t('CPFCNPJ'),
      t('Name'),
      t('Address'),
    ];
    const exportData = [
      tableHead,
      ...data.tableData.map(item => item.slice(0, item.length - 1)),
    ];
    const result: { status: boolean; filePath?: string; error?: string } =
      await exportToCSV(exportData, 'excelfile');
    if (result.status) {
      Alert.alert(
        t('Note'),
        t('File saved successfully! \nLocation: ') + result.filePath,
      );
    } else {
      Alert.alert(
        t('Note'),
        t('Error occured while saving file. \nError: ') + result.error,
      );
    }
  };

  const _showData = (data: any, index: Number) => {
    if (index !== 3) return;
    console.log(data);
  };

  const [selectStarted, setSelectStarted] = useState(false);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const handleRowPress = (data: any[], index: Number) => {
    if (selectStarted) {
      if (!selectedRows.includes(index))
        setSelectedRows([...selectedRows, index]);
      else {
        setSelectedRows(selectedRows.filter(item => item !== index));
      }
    }
  };
  const handleRowLongPress = (data: any[], index: Number) => {
    if (selectStarted) return;
    else {
      setSelectStarted(true);
      setSelectedRows([...selectedRows, index]);
    }
  };
  const handleDelete = async () => {
    selectedRows.forEach(value => {
      deleteSalesInfo(db, Number(data.tableData[value].slice(-1)[0])).then(
        result => {
          console.log('deleted: ', result?.[0].rows.item);
        },
      );
    });
    setDBChanged(true);
    setSelectStarted(false);
    setSelectedRows([]);
  };
  const handleCancelSelect = () => {
    setSelectStarted(false);
    setSelectedRows([]);
  };
  return (
    <View style={styles.container}>
      <LanguageSwitcher />

      <View style={styles.tableContainer}>
        <View
          style={{
            height: 70,
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 5,
            margin: 0,
            padding: 10,
          }}>
          <Pressable
            onPress={() => setVisible(true)}
            onPressIn={() => setPressed1(true)}
            onPressOut={() => setPressed1(false)}
            style={{ flex: 1 }}>
            <Text
              style={[
                styles.submitButton,
                pressed1 ? styles.pressedButton : {},
              ]}>
              {t('Filter')}
            </Text>
          </Pressable>
          <Pressable
            onPress={handleExport}
            onPressIn={() => setPressed2(true)}
            onPressOut={() => setPressed2(false)}
            style={{ flex: 1 }}>
            <Text
              style={[
                styles.submitButton,
                pressed2 ? styles.pressedButton : {},
              ]}>
              {t('Export')}
            </Text>
          </Pressable>
        </View>
        <Modal transparent visible={visible} animationType="slide">
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text>{t('Select Date Range')}</Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  gap: 5,
                  alignItems: 'center',
                }}>
                <View style={styles.formView}>
                  <Text style={styles.text}>{t('From')}</Text>
                  <TextInput
                    placeholder="2024-01-31"
                    value={fromDate}
                    onChangeText={setFromDate}
                    style={styles.inputField}
                  />
                  {/* {errors.description && (
                  <Text style={styles.errorText}>{errors.description}</Text>
                )} */}
                </View>
                <View style={styles.formView}>
                  <Text style={styles.text}>{t('To')}</Text>
                  <TextInput
                    placeholder="2024-01-31"
                    value={toDate}
                    onChangeText={setToDate}
                    style={styles.inputField}
                  />
                  {/* {errors.description && (
                  <Text style={styles.errorText}>{errors.description}</Text>
                )} */}
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  height: 40,
                  justifyContent: 'space-around',
                  gap: 15,
                }}>
                <Button
                  title={t('Confirm')}
                  onPress={async () => {
                    await handleFilter();
                    setVisible(false);
                  }}
                />
                <Button title={t('Close')} onPress={() => setVisible(false)} />
              </View>
            </View>
          </View>
        </Modal>
        <ScrollView
          horizontal={true}
          style={{
            width: '100%',
            borderWidth: 1,
            marginBottom: 30,
            borderColor: 'rgba(0, 0, 0, 0.08)',
            flex: 1,
          }}>
          <Table
            borderStyle={{
              borderWidth: 1,
              borderColor: '#C1C0B9',
            }}>
            <Row
              data={data.tableHead}
              style={styles.tableHead}
              widthArr={[
                30, 150, 150, 80, 80, 80, 80, 80, 80, 80, 100, 100, 150,
              ]}
              textStyle={styles.tableText}
            />
            <ScrollView style={{ position: 'relative' }}>
              {data.tableData.map((data, i) => (
                <TouchableOpacity
                  key={i}
                  style={{ flex: 1 }}
                  onPress={() => handleRowPress(data, i)}
                  onLongPress={() => handleRowLongPress(data, i)}>
                  <Row
                    data={data}
                    textStyle={styles.tableText}
                    widthArr={[
                      30, 150, 150, 80, 80, 80, 80, 80, 80, 80, 100, 100, 150,
                    ]}
                    style={[
                      i % 2 == 1 ? { backgroundColor: '#eee' } : {},
                      selectedRows.includes(i) ? styles.selectedRow : {},
                    ]}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Table>
        </ScrollView>
        {selectStarted && (
          <View
            style={{
              flexDirection: 'row',
              height: 40,
              justifyContent: 'space-around',
              gap: 15,
            }}>
            <Pressable
              onPress={async () => {
                await handleDelete();
              }}>
              <Icon name={'trash-outline'} size={25} />
            </Pressable>
            <Pressable
              onPress={async () => {
                await handleCancelSelect();
              }}>
              <Icon name={'close-circle-outline'} size={25} />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
};

export default ShowInfo;
