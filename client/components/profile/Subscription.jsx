import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Alert,
	ScrollView,
	Image,
} from "react-native";
import React, { useState } from "react";
import { Link, useLocalSearchParams } from "expo-router";
import { PAYPAL_CLIENT_ID, PAYPAL_SECRET_KEY, PAYPAL_API } from "@env";
import axios from "axios";
import { encode as btoa } from "base-64";
import qs from "qs";
import WebView from "react-native-webview";
import { useAuth } from "@/app/context/AuthContext";
import Icon from "react-native-vector-icons/FontAwesome5";
import Feather from "react-native-vector-icons/Feather";
import IconCommunity from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import { jwtDecode } from "jwt-decode";
import { images } from "@/constants";

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	upgradeButton: {
		backgroundColor: "green",
		borderRadius: 40,
		// padding: '0px 40px',
		padding: 30,
	},
	main: {
		display: "flex",
		justifyContent: "center",
		alignItems: "center",
		width: "100%",
		height: "100%",
	},
});

//https://www.uplabs.com/posts/premium-subscription-plan-app-ui-kit
const Subscription = () => {
	const { userInfo, setAuthState, setUserInfo } = useAuth();
	const [accessToken, setAccessToken] = useState("");
	const [paypalUrl, setPaypalUrl] = useState(null);
	const [authId, setAuthId] = useState(null);
	const [upgradeType, setUpgradeType] = useState("");
	const membershipType = [
		{
			id: 1,
			icon: "bike",
			name: "Plus",
			price: 10,
			benefits: ["Benefit 1", "Benefit 2"],

			color: ["rgba(0, 255, 235, 1)", "rgba(106, 144, 240, 1)"],
		},
		{
			id: 2,
			icon: "airplane",
			name: "Premium",
			price: 100,
			benefits: ["Benefit 1", "Benefit 2", "Benefit 3"],
			color: ["rgba(213,205,125,1)", "rgba(191,173,61,1)"],
		},
	];

	const upgradeMembership = async (type) => {
		await axios
			.put(`${"https://reactnative-finess-app.vercel.app"}/api/users/upgrade/`, {
				email: userInfo.email,
				newMembership: type,
			})
			.then((res) => {
				const decoded = jwtDecode(res.data.token);
				setUserInfo({
					userName: decoded.name,
					email: decoded.email,
					membership: decoded.membership,
					trialEndDate: decoded.trialEndDate,
				});
				setAuthState((previous) => ({
					...previous,
					token: res.data.token,
				}));
			})
			.catch((error) => console.error(error));
		setUpgradeType("");
	};

	const handleGetAccessToken = async (type, price) => {
		Alert.alert(
			'Info',
			'This feature is temporarily disable'
		);
		return
		const amount = price;
		const dataDetail = {
			intent: "sale",
			payer: {
				payment_method: "paypal",
			},
			transactions: [
				{
					amount: {
						currency: "EUR",
						total: amount,
						details: {
							shipping: "0",
							subtotal: amount,
							shipping_discount: "0",
							insurance: "0",
							handling_fee: "0",
							tax: "0",
						},
					},
					description: "This is the payment transaction description",
					payment_options: {
						allowed_payment_method: "IMMEDIATE_PAY",
					},
					item_list: {
						items: [
							{
								name: "Book",
								description: "Chasing After The Wind",
								quantity: "1",
								price: amount,
								tax: "0",
								sku: "product34",
								currency: "EUR",
							},
						],
					},
				},
			],
			redirect_urls: {
				return_url: "https://example.com/",
				cancel_url: "https://example.com/",
			},
		};
		console.log(PAYPAL_API)
		await axios
			.post(PAYPAL_API, "grant_type=client_credentials", {
				headers: {
					"Content-Type": "text/plain",
					Authorization: `Basic ${btoa(
						PAYPAL_CLIENT_ID + ":" + PAYPAL_SECRET_KEY
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
								"Content-Type": "application/json",
								Authorization: `Bearer ${access_token}`,
							},
						}
					)
					.then((response) => {
						const { id, links } = response.data;
						const approvalUrl = links.find(
							(data) => data.rel == "approval_url"
						).href;
						setPaypalUrl(approvalUrl);
						setAuthId(id);
					})
					.catch((err) => {
						console.error("115", { ...err });
					});
			})
			.catch((error) => {
				setUpgradeType("");
				console.error("error", error);
			});
	};

	const _onNavigationStateChange = (webVIewState) => {
		if (webVIewState.title === "Example Domain") {
			const url = new URL(webVIewState.url);
			const urlParams = url.searchParams;
			const paymentId = urlParams.get("paymentId");
			const payerId = urlParams.get("PayerID");
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
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			)
			.then((res) => {
				upgradeMembership(upgradeType);
				Alert.alert("Payment Success!", "Thanks for your payment!");
			})
			.catch((error) => {
				setUpgradeType("");
				Alert.alert("Payment Fail!", "Please do that again!");
			});
	};
	return (
		<>
			{paypalUrl !== null ? (
				<WebView
					style={{
						height: "100%",
						width: "100%",
						marginTop: 40,
					}}
					source={{ uri: paypalUrl }}
					onNavigationStateChange={(data) =>
						_onNavigationStateChange(data)
					}
					javaScriptEnabled={true}
					domStorageEnabled={true}
					startInLoadingState={true}
				/>
			) : (
				<ScrollView
					style={styles.container}
					showsVerticalScrollIndicator={false}
					showsHorizontalScrollIndicator={false}
					className='bg-[#1c1c1d]'
				>
					<View className='h-full flex justify-center items-center  flex-col'>
						<View className=' flex-1 mt-14 flex flex-col items-center justify-between w-full min-h-[50vh] mb-5 '>
							<View className=' flex flex-col justify-center items-center'>
								<View className='bg-slate-600 rounded-full w-36 h-36 flex items-center justify-center  shadow hover:shadow-2xl mb-4'>
									{/* <Icon
										className='mb-2'
										name='award'
										color={"white"}
										size={80}
									/> */}
									<Image
										resizeMode='contain'
										source={images.logo}
										className='rounded-full'
										style={{
											width: "100%",
											height: undefined,
											aspectRatio: 1,
										}}
									/>
								</View>
								<Text
									className='text-xl text-slate-300'
									style={{ fontFamily: "DMBold" }}
								>
									{userInfo.membership?.toUpperCase()} PLAN
								</Text>
							</View>
							{/* {userInfo.membership === "Free Trial" && ( */}
							<View className='flex flex-col justify-center items-center w-1/2 '>
								<Text className='color-red-300 text-md mb-4 '>
									10 Days Left!
								</Text>
								<Text className='text-center text-slate-300 '>
									Your plan will expire on February 22, 2024
								</Text>
							</View>
							{/* )} */}

							<View className='w-full h-10  flex flex-row justify-center items-center  '>
								<View className='border border-gray-500 w-[30vw]' />
								<View className='bg-slate-400 w-32 h-full flex items-center justify-center rounded-full'>
									<Text
										className=' color-white text-md'
										style={{ fontFamily: "DMBold" }}
									>
										PLANS
									</Text>
								</View>
								<View className='border border-gray-500 w-[30vw]' />
							</View>
						</View>
						<View className=' w-full  flex justify-center items-center'>
							<View className='w-full px-5'>
								{membershipType.map((item) => (
									<View key={item.id}>
										<LinearGradient
											className='bg-gradient-to-r from-cyan-500 to-blue-500  w-full h-52 mb-5 flex flex-row rounded-xl p-2'
											start={{ x: 0, y: 0.75 }}
											end={{ x: 1, y: 0.25 }}
											colors={item.color}
										>
											<View className='flex flex-row w-full border border-white rounded-xl'>
												<View
													className={`
												border-r border-white min-w-10 relative px-3 flex justify-center items-center `}
												>
													{/* <View className='flex flex-col justify-center items-center absolute border bottom-10'> */}
													<IconCommunity
														name={item.icon}
														size={50}
													/>
													<Text className='mt-2'>
														{item.name}
													</Text>
													{/* </View> */}
												</View>
												<View
													className={` flex-1 flex flex-col justify-center items-center`}
												>
													<View className='flex-1  flex justify-center items-start flex-col'>
														<Text className='color-white mb-2'>
															<Text
																className='text-3xl'
																style={{
																	fontFamily:
																		"DMBold",
																}}
															>
																{item.price}€/
															</Text>
															<Text>Mon</Text>
														</Text>
														{item.benefits.map(
															(item) => (
																<View key={item} className='flex flex-row items-center gap-2 mb-2'>
																	<Feather name='check-circle' />
																	<Text>
																		{item}
																	</Text>
																</View>
															)
														)}
													</View>
													<View className=' w-full pb-2 flex justify-end items-end px-4'>
														<TouchableOpacity
															onPress={() => {
																setUpgradeType(
																	item.name
																);
																handleGetAccessToken(
																	item.name,
																	item.price
																);
															}}
															className=' w-fit flex flex-row gap-1 items-center'
														>
															<Text>
																Choose Plan
															</Text>
															<Icon
																name='angle-right'
																size={10}
															/>
														</TouchableOpacity>
													</View>
												</View>
											</View>
										</LinearGradient>
									</View>
								))}
							</View>
						</View>
					</View>
				</ScrollView>
			)}
			{/* </View> */}
		</>
	);
};

export default Subscription;
