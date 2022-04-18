
const AddNewTask = async ({formData}, eventID, currentUserID) => {
    const url = 'https://primalpartybackend.azurewebsites.net/events/' + eventID + '/tasks'
    console.log(url);
    const details = {
        name: formData.name,
        description: formData.description,
        assignees: [],
    }

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
        return await res.json();
    } catch (e) {
        return e
    }

}

export default AddNewTask;