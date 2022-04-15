import {Box, Button, Center, Input, Text, View, VStack} from "native-base";
import React, {useState} from "react";
import SearchUsers from "../components/API Calls/SearchUsers";
import CustomCard from "../components/CustomCard";
import {FlatList} from "react-native";
import PeopleCard from "../components/PeopleCard";

const SearchFriendsPage = ({navigation, route}) => {
    const [eventID, setEventID] = useState(route.params.eventID);
    const [people, setPeople] = useState()
    const [formData, setData] = useState({search: ' '} );

    async function handleClick() {
        const temp = await SearchUsers(formData.search)
            .then((res) => {
                let parseMap = res.map((obj) => obj)
                setPeople(parseMap);
            })
    }
    return(
        <View style={{
            flex: 1,
            alignContent: "center",
            top: "10%",
            marginLeft: "2%",
            marginRight: "2%",
            flexDirection: "column",
        }}>
            <VStack space={3}>
                    <Input
                        size="md"
                        placeholder = "Search for a new guest!"
                        value = {formData.search}
                        onChangeText={value => setData({ ...formData,
                            search: value})
                        }
                    />
                    <Button onPress={() => handleClick()}>
                        Get Users
                    </Button>
                    <Box flexGrow={1} maxW="100%" maxH={"75%"} bg="violet.400" rounded="md" shadow={3}
                    >
                        <FlatList
                            data = {people}
                            renderItem={({ item }) => (
                                <PeopleCard props ={item} _id={item._id} key = {item._id} eventID = {eventID} navigation = {navigation} />
                            )}
                            keyExtractor={item => item._id}

                            showsVerticalScrollIndicator={true}
                            borderColor={"black"}
                            rounded="md"
                            bg="violet.300"
                            maxH={"90%"} marginLeft= "5%" marginRight="5%"
                            textAlign={"center"}
                            lineHeight={10}


                        />
                    </Box>
            </VStack>
        </View>
    )
}

export default SearchFriendsPage