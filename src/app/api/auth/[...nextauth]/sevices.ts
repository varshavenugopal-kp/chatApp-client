import { api } from "./(axios)/axios";


export const allChats = (userid: string) => {
    return api.get(`/chat/userChat/${userid}`)
        .then(({ data }) => {
            return data.fullchat;
        })
        .catch((err) => {
            throw err; // Re-throw the error to be caught by the calling code
        });
};


export const allUser = async () => {
    const { data } = await api.get('/users')
    return data

}