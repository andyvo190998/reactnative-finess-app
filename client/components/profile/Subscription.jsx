import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY, PAYPAL_API } from '@env';
import axios from 'axios';
import { encode as btoa } from 'base-64';
import qs from 'qs';
import WebView from 'react-native-webview';
const styles = StyleSheet.create({
  container: {
    // display: 'flex',
    // justifyContent: 'center',
    // alignItems: 'center',
    // width: '100%',
    // height: '100%',
    flex: 1,
  },
  upgradeButton: {
    backgroundColor: 'green',
    borderRadius: 40,
    // padding: '0px 40px',
    padding: 30,
  },
  main: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
});

const Subscription = () => {
  const [accessToken, setAccessToken] = useState('');
  const [paypalUrl, setPaypalUrl] = useState(null);
  const [authId, setAuthId] = useState(null);

  const handleGetAccessToken = async (type) => {
    let amount = 0;
    if (type === 'Plus') {
      amount = 10;
    } else {
      amount = 100;
    }
    const dataDetail = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      transactions: [
        {
          amount: {
            currency: 'EUR',
            total: amount,
            details: {
              shipping: '0',
              subtotal: amount,
              shipping_discount: '0',
              insurance: '0',
              handling_fee: '0',
              tax: '0',
            },
          },
          description: 'This is the payment transaction description',
          payment_options: {
            allowed_payment_method: 'IMMEDIATE_PAY',
          },
          item_list: {
            items: [
              {
                name: 'Book',
                description: 'Chasing After The Wind',
                quantity: '1',
                price: amount,
                tax: '0',
                sku: 'product34',
                currency: 'EUR',
              },
            ],
          },
        },
      ],
      redirect_urls: {
        return_url: 'https://example.com/',
        cancel_url: 'https://example.com/',
      },
    };

    await axios
      .post(PAYPAL_API, 'grant_type=client_credentials', {
        headers: {
          'Content-Type': 'text/plain',
          Authorization: `Basic ${btoa(
            PAYPAL_CLIENT_ID + ':' + PAYPAL_SECRET_KEY
          )}`,
        },
      })
      .then((res) => {
        const access_token = res.data.access_token;
        setAccessToken(access_token);

        axios
          .post(
            `https://api.sandbox.paypal.com/v1/payments/payment`,
            dataDetail,
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${access_token}`,
              },
            }
          )
          .then((response) => {
            const { id, links } = response.data;
            const approvalUrl = links.find(
              (data) => data.rel == 'approval_url'
            ).href;
            setPaypalUrl(approvalUrl);
            setAuthId(id);
          })
          .catch((err) => {
            console.error('115', { ...err });
          });
      })
      .catch((error) => console.error('error', error));
  };

  const _onNavigationStateChange = (webVIewState) => {
    if (webVIewState.title === 'Example Domain') {
      const url = new URL(webVIewState.url);
      const urlParams = url.searchParams;
      const paymentId = urlParams.get('paymentId');
      const payerId = urlParams.get('PayerID');
      execute(payerId, paymentId);
      setPaypalUrl(null);
    }
  };

  const execute = (payerId, paymentId) => {
    axios
      .post(
        `https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`,
        { payer_id: payerId },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        Alert.alert('Payment Success!', 'Thanks for your payment!');
      })
      .catch((error) => Alert.alert('Payment Fail!', 'Please do that again!'));
  };
  return (
    <View style={styles.container}>
      {/* <Link href="subscription/payment">payment</Link> */}
      {paypalUrl !== null ? (
        <WebView
          style={{
            height: '100%',
            width: '100%',
            marginTop: 40,
          }}
          source={{ uri: paypalUrl }}
          onNavigationStateChange={(data) => _onNavigationStateChange(data)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
        />
      ) : (
        <View className=" h-full flex justify-center items-center">
          <View className=" w-1/2 flex justify-center items-center">
            <TouchableOpacity
              onPress={() => handleGetAccessToken('Plus')}
              className=" px-5 py-1 rounded-2xl bg-green-500 mb-1"
            >
              <Text className="text-red-500">Upgrade Plus</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleGetAccessToken('Premium')}
              className=" px-5 py-1 rounded-2xl bg-yellow-500 mb-1"
            >
              <Text className="text-red-500">Upgrade Premium</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Link href="/">Home</Link>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default Subscription;
