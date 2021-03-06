import { Box, Button, Center, FormControl, Heading, Input, Modal, Spinner, Text, View, FlatList } from "native-base"
import ReduxStore from "../redux/ReduxStore";
import { useDispatch } from "react-redux";
import GetEvents from "./API Calls/GetEvents";
import { eventPOST, eventSET } from "../redux/eventsReducer";
import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { CredentialsContext } from "./CredentialsContext";
import CustomCard from "./CustomCard";
import { Datepicker, NativeDateService } from "@ui-kitten/components";
import CreateNewEvent from "./API Calls/CreateNewEvent";
import {PageTitle, StyledImageContainer} from "./styles";

const InitDashboard = ({ navigation, route, newState }) => {
    const [eventData, setEventData] = useState(newState.events);
    const [username, setUsername] = useState(useContext(CredentialsContext).storedCredentials.firstName)
    const [showModal, setShowModal] = useState(false);
    const [routePush, setRoutePush] = useState(route.params)
    const [loading, setLoading] = useState(true);
    const [deleteState, setDeleteState] = useState(ReduxStore.getState());
    // const [oldState, setOldState] = useState(ReduxStore.getState().events);

    const abortController = new AbortController()

    useEffect(() => {
        if (newState.events !== null){
            setEventData(newState.events)
            setLoading(false);
        }
        return () => {
            abortController.abort()
        }
    }, [newState])

    // Redux Initialization

    const dispatch = useDispatch();
    const init = () => {
        GetEvents().then((events) => {
            dispatch(eventSET({ events }))
            setEventData(events)
        })
    }
    useEffect(() => {
        init();
        return () => {
            abortController.abort()
        }
    }, [route.params]);
    
    // End of Redux Initialization

    // Start of CreateEventModal Logic
    const initDate = new Date();
    const formatDateService = new NativeDateService('en', { format: 'MM-DD-YYYY' });

    const [formData, setData] = useState({ date: initDate, location: "TBD", description: "TBD" });
    const [errors, setErrors] = useState({});

    const validate = ({ formData }) => {
        if (formData.name === undefined || formData.name === "") {
            setErrors({
                ...errors,
                name: 'Name is required'
            });
            return false;
        }
        else {
            CreateNewEvent({ formData })
                .then((res) => {
                    dispatch(eventPOST(res.newEvent))
                    setEventData(ReduxStore.getState().events)
                })
            return true;
        }
    };


    useEffect(() => {
        if (showModal) return; // If shown, do nothing

        // Else, clear form
        setData({ date: initDate, location: "", description: "" });
        setErrors({});
        return () => {
            abortController.abort()
        }
    }, [showModal]);

    // End of CreateEventModal Logic

    return (
    loading ? (
        <Center h="100%">
            < Box >
                <Heading fontSize="xl">
                    Welcome to PrimalParty, {username}!
                </Heading>
                <Spinner size="lg" />
            </Box >
        </Center >
    ) :(
    <Center h="100%">
        <View
            style={{
            flex: 1,
            top: "5%",
            marginLeft: "2%",
            marginRight: "2%",
        }}>
            <>
                    <PageTitle>
                        {username}'s
                        Upcoming Events
                    </PageTitle>
                <Box maxH={"80%"} flexGrow={1} >
                <FlatList
                        data={eventData}
                        renderItem={({ item }) => (
                            <CustomCard
                                navigation={navigation}
                                data={item}
                                key={item._id}
                                route={route}
                            />
                        )}
                        keyExtractor={item => item._id}
                        mt={'2%'}
                    />
                </Box>
                <Box pt={"5%"}>
                    <View>
                        <Button onPress={() => setShowModal(true)}>
                            Create Event
                        </Button>
                        <Modal isOpen={showModal} onClose={() => setShowModal(false)} avoidKeyboard={true}>
                            <Modal.Content maxWidth="400px">
                                <Modal.CloseButton />
                                <Modal.Header>Create Event</Modal.Header>
                                <Modal.Body>
                                    <FormControl isRequired isInvalid={'name' in errors}>
                                        <FormControl.Label>Title</FormControl.Label>
                                        <Input
                                            size="md"
                                            placeholder="  Javascript Party"
                                            value={formData.name}
                                            onChangeText={value => setData({
                                                ...formData,
                                                name: value
                                            })
                                            }
                                        />
                                        {'name' in errors ? <FormControl.ErrorMessage>Required</FormControl.ErrorMessage> : <FormControl.HelperText>
                                        </FormControl.HelperText>}
                                    </FormControl>
                                    <FormControl mt="3">
                                        <FormControl.Label>Date</FormControl.Label>
                                        <Datepicker
                                            placement={"left"}
                                            min={initDate}
                                            date={formData.date}
                                            dateService={formatDateService}
                                            onSelect={nextDate => setData({
                                                name: formData.name,
                                                date: nextDate, location:
                                                    formData.location,
                                                description: formData.description
                                            })}
                                        />
                                    </FormControl >
                                    <FormControl mt="3">
                                        <FormControl.Label>Location</FormControl.Label>
                                        <Input
                                            size="md"
                                            placeholder="  VS Code"
                                            value={formData.location}
                                            onChangeText={value => setData({
                                                ...formData,
                                                location: value
                                            })}
                                        />
                                    </FormControl>
                                    <FormControl mt="3">
                                        <FormControl.Label>Description</FormControl.Label>
                                        <Input
                                            size="md"
                                            placeholder="  Let's code collaboratively!"
                                            value={formData.description}
                                            onChangeText={value => setData({
                                                ...formData,
                                                description: value
                                            })}
                                        />
                                    </FormControl>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button onPress={() => {
                                        if (validate({ formData })) {
                                            setShowModal(false);
                                        }
                                        else
                                            console.log("bruh");
                                    }}>
                                        Save
                                    </Button>
                                </Modal.Footer>
                            </Modal.Content>
                        </Modal>
                    </View>
                </Box>
            </>
        </View>
    </Center>
    )
    )
}

export default InitDashboard;
