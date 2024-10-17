import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import styles from './Home.style';
import IconMaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const users = [
  { id: 1, name: 'John Doe' },
  { id: 2, name: 'Jane Doe' },
  { id: 3, name: 'Jordan Doe' },
  { id: 4, name: 'John Doe' },
  { id: 5, name: 'Jane Doe' },
  { id: 6, name: 'Jordan Doe' },
  { id: 7, name: 'John Doe' },
  { id: 8, name: 'Jane Doe' },
  { id: 9, name: 'Jordan Doe' },
  { id: 10, name: 'John Doe' },
  { id: 11, name: 'Jane Doe' },
  { id: 12, name: 'Jordan Doe' },
  { id: 13, name: 'John Doe' },
  { id: 14, name: 'Jane Doe' },
  { id: 15, name: 'Jordan Doe' },
  { id: 16, name: 'John Doe' },
  { id: 17, name: 'Jane Doe' },
  { id: 18, name: 'Jordan Doe' },
  { id: 19, name: 'John Doe' },
  { id: 20, name: 'Jane Doe' },
  { id: 21, name: 'Jordan Doe' },
  { id: 22, name: 'John Doe' },
  { id: 23, name: 'Jane Doe' },
  { id: 24, name: 'Jordan Doe' },
];

const Home = ({ navigation }: any) => {
  function ListUser() {
    return (
      <>
        {users.map((data: any) => {
          return (
            <View key={data?.id} style={styleUser as any}>
              <Text style={{ fontSize: 15 }}>
                {data?.id}. {data?.name}
              </Text>
            </View>
          );
        })}
      </>
    );
  }

  return (
    <>
      <ScrollView>
        <StatusBar barStyle="dark-content" backgroundColor={'#f9f9f9'} />
        <SafeAreaView style={styles.SafeAreaView1} />
        <SafeAreaView style={styles.SafeAreaView2}>
          <View style={styles.outerWrapper}>
            <IconMaterialCommunityIcons
              name={'lock-alert-outline'}
              size={80}
              color={'green'}
            />
            <IconMaterialCommunityIcons
              name={'wifi-lock-open'}
              size={50}
              color={'grey'}
            />

            <View>
              <TouchableOpacity
                style={styles.buttonStyle}
                onPress={() => navigation?.navigate('Profile')}>
                <Text style={styles.text}>
                  Click here to go to profile Page:
                </Text>
              </TouchableOpacity>
              <ListUser />
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

export default Home;
