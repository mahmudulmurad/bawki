import Axios from 'axios';

export const loginCall = async (userData, dispatch) => {
    dispatch({ type: "LOGIN_START" });
    try {
        const res = await Axios.post('http://localhost:3030/login', userData)
        dispatch({ type: "LOGIN_SUCCESS", payload: res.data.user })
        await sessionStorage.setItem('token', res.data.token);
    } catch (error) {
        dispatch({ type: "LOGIN_FAILURE", payload: error.message })
    }
}
export const authenticatedUSer = async (dispatch) =>{
    dispatch({ type: "LOGIN_START" });
    try {
        const res = await Axios.get('http://localhost:3030/me',{
            headers: {
              "Content-type": "application/json;charset=UTF-8",
              'Authorization': 'Bearer ' + sessionStorage.getItem('token')
            }
          })
        dispatch({ type: "USER_FOUND", payload: res.data })
    } catch (error) {
        dispatch({ type: "LOGIN_FAILURE", payload: error.message })
    }
}

export const logoutUser = async (dispatch) =>{
    try {
        dispatch({ type: "USER_LOGOUT" })
        await sessionStorage.removeItem('token');
    } catch (error) {
        dispatch({ type: "LOGIN_FAILURE", payload: error.message })
    }
}