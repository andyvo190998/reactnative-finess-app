import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Link } from 'expo-router';
import { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY, PAYPAL_API } from '@env';
import axios from 'axios';
import { decode as atob, encode as btoa } from 'base-64';
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
});

const Subscription = () => {
  const [accessToken, setAccessToken] = useState('');
  const [paypalUrl, setPaypalUrl] = useState(null);
  const [authId, setAuthId] = useState(null);
  const dataDetail = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal',
    },
    transactions: [
      {
        amount: {
          currency: 'EUR',
          total: '100',
          details: {
            shipping: '0',
            subtotal: '100',
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
              price: '100',
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
  const data = {
    grant_type: 'client_credentials',
  };

  const auth = {
    username: PAYPAL_CLIENT_ID, //"your_paypal-app-client-ID",
    password: PAYPAL_SECRET_KEY, //"your-paypal-app-secret-ID
  };

  const options = {
    method: 'post',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Credentials': true,
    },

    //Make sure you use the qs.stringify for data
    data: qs.stringify(data),
    auth: auth,
    PAYPAL_API,
  };

  const handleGetAccessToken = async () => {
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
        console.log('107', access_token);
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
            console.log('121');
            const { id, links } = response.data;
            const approvalUrl = links.find(
              (data) => data.rel == 'approval_url'
            ).href;

            console.log('response', approvalUrl);
            console.log('id', id);
            console.log('links', links);
            setPaypalUrl(approvalUrl);
            setAuthId(id);
          })
          .catch((err) => {
            console.log('133', { ...err });
          });
      })
      .catch((error) => console.error('error', error));

    // axios(options)
    //   .then((response) => {
    //     setAccessToken(response.data.access_token);

    //     //Resquest payal payment (It will load login page payment detail on the way)
    //     axios
    //       .post(
    //         `https://api.sandbox.paypal.com/v1/payments/payment`,
    //         dataDetail,
    //         {
    //           headers: {
    //             'Content-Type': 'application/json',
    //             Authorization: `Bearer ${response.data.access_token}`,
    //           },
    //         }
    //       )
    //       .then((response) => {
    //         const { id, links } = response.data;
    //         const approvalUrl = links.find(
    //           (data) => data.rel == 'approval_url'
    //         ).href;

    //         console.log('response', links);
    //         setPaypalUrl(approvalUrl);
    //       })
    //       .catch((err) => {
    //         console.log({ ...err });
    //       });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  //https://www.youtube.com/watch?v=40a0qbgAkmk&list=PL3-PKAGi7JdgxJbn_KEylg2OLpZTdbTwG&index=2
  const _onNavigationStateChange = (webVIewState) => {
    console.log('webviewstate', webVIewState);
    // if (webVIewState.url.includes('http://example.com/')) {
    //   setPaypalUrl(null);
    // }

    const { PayerID, paymentId } = webVIewState.url;
    if (webVIewState.title === 'Example Domain') {
      const url = new URL(webVIewState.url);
      const urlParams = url.searchParams;
      const paymentId = urlParams.get('paymentId');
      const payerId = urlParams.get('PayerID');
      console.log('paymentId:', paymentId);
      console.log('PayerID:', payerId);
      execute(payerId, paymentId);
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
      .then((res) => console.log('execute', res))
      .catch((error) => console.error(error));
  };
  return (
    <View style={styles.container}>
      {/* <Link href="subscription/payment">payment</Link> */}
      {paypalUrl !== null ? (
        <WebView
          style={
            {
              // height: '100%',
              // width: '100%',
              // marginTop: 40,
            }
          }
          source={{ uri: paypalUrl }}
          onNavigationStateChange={(data) => _onNavigationStateChange(data)}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
        />
      ) : (
        <>
          <Text>Subscription</Text>
          <TouchableOpacity
            onPress={handleGetAccessToken}
            style={styles.upgradeButton}
          >
            <Text className="text-red-500">Upgrade</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Link href="/">Home</Link>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default Subscription;
