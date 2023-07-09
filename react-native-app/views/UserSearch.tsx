import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Button, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProfileImage from '../components/ProfileImage';
import { globalContext } from '../views/GlobalContext';
import User from '../shared/models/User';
import Colors from '../assets/constants/colors';
import T from '../assets/constants/text';
import { request } from '../services/ServerFacade';
import { notifyMessage } from '../utils/UiUtils';
import { observer } from 'mobx-react-lite';

type state = {
	results: User[],
	pageNumber: number,
	loading: boolean,
	query?: string
	hasMore: boolean,
}

const PAGE_SIZE = 5;

const UserSearch = observer(() => {
	const navigation = useNavigation<any>();

	const { userStore } = useContext(globalContext);
	const currentUser = userStore.currentUser;

	const [state, setState] = useState<state>({
		results: [],
		pageNumber: 0,
		loading: false,
		query: undefined,
		hasMore: false
	});

	let flexibleState: state = { ...state };
	function updateState(props: Partial<state>) {
		flexibleState = { ...flexibleState, ...props };
		setState({ ...flexibleState })
	}

	async function loadNewResults() {
		console.log("here!!!", state.pageNumber)
		Keyboard.dismiss();
		if (!state.query) {
			updateState({ results: [] })
			return;
		}
		updateState({ loading: true })
		let page = await getPage(state.query, 0)
		console.log(page)
		updateState({
			loading: false,
			results: page.users,
			pageNumber: 1,
			hasMore: page.users.length < page.total
		})
	}


	async function loadMoreResults() {
		if (!state.query) return;
		updateState({ loading: true })
		let page = await getPage(state.query, state.pageNumber)
		updateState({
			loading: false,
			results: state.results.concat(page.users),
			pageNumber: state.pageNumber + 1,
			hasMore: state.results.length + page.users.length < page.total
		})
	}

	async function getPage(query: string, pageNumber: any) {
		try {
			const { data } = await request.get(`/user/search?query=${query}&page=${pageNumber}&pageSize=${PAGE_SIZE}`);
			return data;
		}
		catch (e) {
			notifyMessage("Could not load users");
			throw e;
		}
	}

	function updateQuery(text: string) {
		updateState({
			query: text,
			pageNumber: 0
		})
	}

	return (
		<>
			<View style={styles.searchBarWrapper}>
				<TextInput placeholder={T.people.search.prompt}
					placeholderTextColor={Colors.white}
					style={styles.searchInput}
					onChangeText={(text) => updateQuery(text)}></TextInput>
				<TouchableHighlight style={styles.searchIconButton}
					onPress={loadNewResults}
					underlayColor="#ccc">
					<Icon name="search" style={styles.icon} size={30} />
				</TouchableHighlight>
			</View>

			<ScrollView style={styles.screen}>
				{state.results.map(user => (
					<View style={styles.resultRow} key={user.userId} onTouchEnd={() => { navigation.navigate("OtherUserProfile", { profileOwner: user }) }}>
						<ProfileImage user={user} size={30}></ProfileImage>
						<Text style={styles.text}>{user.firstname} {user.lastname}</Text>
					</View>
				))}

				{state.hasMore ?
					<Button title="Load More" onPress={loadMoreResults} color={Colors.darkBlue}></Button>
					:
					state.results.length ? <Text style={styles.noMore}>No more results</Text> : null
				}
			</ScrollView>
		</>
	);
});

const styles = StyleSheet.create({
	screen: {
		backgroundColor: Colors.lightBackground
	},
	searchBarWrapper: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#ddd',
		backgroundColor: Colors.lightBackground,
	},
	searchInput: {
		flexGrow: 1,
		paddingLeft: 10,
		fontSize: 15,
		color: Colors.white,
	},
	searchIconButton: {
		padding: 10
	},
	text: {
		marginLeft: 10,
		fontSize: 15,
	},
	noMore: {
		textAlign: 'center',
		color: Colors.white,
		margin: 10
	},
	icon: {
		color: Colors.white
	},
	resultRow: {
		backgroundColor: "white",
		padding: 10,
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#ddd'
	}
})
export default UserSearch;