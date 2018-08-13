import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Text
} from 'react-native';
export const Loader = props => {

  const {
    loading,
    text,
    ...attributes
  } = props;

  return (
    <Modal
      transparent={true}
      animationType={'fade'}
      onRequestClose={() => {}}
      visible={!!loading}>
      <View style={styles.modalBackground}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            animating={loading} />
          <Text style={styles.text}>{text}</Text>
        </View>
      </View>
    </Modal>
  )
};
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: 'transparent'
  },
  activityIndicatorWrapper: {
    backgroundColor: '#FFFFFF',
    height: 100,
    width: 100,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  text: {
    fontSize: 10,
    lineHeight: 10
  }
});
