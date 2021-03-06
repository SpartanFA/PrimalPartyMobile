import {Box, Button, Heading, HStack, Icon, IconButton, Text} from "native-base";
import React, {useContext, useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {eventDELETE, guestADD} from "../redux/eventsReducer";
import {StackActions as navigation} from "react-navigation";
import ReduxStore from "../redux/ReduxStore";
import {CredentialsContext} from "./CredentialsContext";
import {Entypo} from "@expo/vector-icons";

const PeopleCard = (pass) => {
    const [props, setProps] = useState(pass);
    const dispatch = useDispatch();

    useEffect(() => {
        // console.log("new Page")
        // setProps(pass);
    }, [])



    // Handle Add
    const handleGuestAdd = async ({userData, eventID}) => {
        console.log("Adding: " + userData._id + " - " + eventID);
        const url = 'https://primalpartybackend.azurewebsites.net/events/' + eventID + '/guests/' + userData._id;
        dispatch(guestADD({userData: userData, eventID: eventID}))

        let details = [eventID, userData._id];
        let formBody = [];
        for (let property in details) {
            let encodedKey = encodeURIComponent(property);
            let encodedValue = encodeURIComponent(details[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");

        try {
            const res = await fetch(url,
                {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
                    },
                    credentials: 'include',
                    body: formBody
                })
            let postData = await res.json();
            return;
        } catch (e) {
            return e
        }
    }


    const handleClick = () => {
        handleGuestAdd({userData: props.props, eventID: props.eventID})
            .then(() => {
                let newState = ReduxStore.getState().events.find((obj) => obj._id === props.eventID);
                // console.log(newState);
                // props.route.params.newData(newState)
                props.navigation.navigate("EventGuestNavigation", {eventData: newState})
                // props.navigation.navigate("EventGuestNavigation");
            })
    }

    return (
        <Box
            bg={'#f6e84b'}
            marginBottom={'5%'}
            width={'100%'}
            borderRadius={8}
            pb={"1%"} pt={"1%"}
        >
            <Box flexDirection={"row"} marginLeft="5%" pb={"3%"} pt={"3%"}>
                <HStack space={"2%"} flex={1} alignItems={'center'} >
                    <Heading
                        textAlign={"left"} width={"50%"} pt="2%" size={'sm'} flexWrap={'wrap'}>
                        {props.props.firstName} {props.props.lastName}
                    </Heading>
                    <IconButton icon={<Icon as={Entypo} name="add-user" size={'md'} ml={'25%'} color={'#202020'}/>}
                        ml={'20%'}
                        w={'20%'}
                        height={'43px'}
                        size={'md'}
                        borderWidth={2}
                        borderRadius={50}
                        onPress={() => handleClick()}>
                        {"Add " + props.props.username}
                    </IconButton>
                </HStack>
            </Box>
        </Box>
    )
}

export default PeopleCard