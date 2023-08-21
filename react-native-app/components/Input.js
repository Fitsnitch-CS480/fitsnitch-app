import React from 'react';
import { StyleSheet, TextInput, View, Text } from 'react-native';
import Colors from '../assets/constants/colors';


const Input = ({
	value = "",
	label = "",
	onChange,
	...props
}) => {

	const style = StyleSheet.create({
		inputWrapper: {
			marginVertical: 5,
		},
		label: {
			color: '#777',
			marginBottom: 5,
			fontSize: 12
		},
		input: {
			paddingHorizontal: 10,
			paddingVertical: 5,
			borderWidth: 1,
			borderColor: '#777',
			borderRadius: 5,
			backgroundColor: Colors.charcoal,
			color: Colors.white,
		},
	});

	return (
		<View style={style.inputWrapper}>
			{ label && <Text style={style.label}>{label}</Text> }
			<TextInput
				style={style.input}
				onChangeText={onChange}
				value={value}
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...props}
			/>
		</View>
		
	)
};

export default Input;