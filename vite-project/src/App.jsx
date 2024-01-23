import axios from 'axios';
import { createStore, applyMiddleware } from 'redux';
import{thunk} from 'redux-thunk';
import { Provider, useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';

const initialState = {
  data: [],
  error: null,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_DATA_SUCCESS':
      return {
        ...state,
        data: action.payload,
        error: null,
      };
    case 'FETCH_DATA_ERROR':
      return {
        ...state,
        data: [],
        error: action.payload,
      };
    default:
      return state;
  }
};


const store = createStore(userReducer, applyMiddleware(thunk));


const fetchData = () => {
  return (dispatch) => {
    axios.get('https://jsonplaceholder.typicode.com/users')
      .then((response) => {
        dispatch({
          type: 'FETCH_DATA_SUCCESS',
          payload: response.data,
        });
      })
      .catch((error) => {
        dispatch({
          type: 'FETCH_DATA_ERROR',
          payload: error,
        });
      });
  };
};


const App = () => {
  const [dataLocal, setDataLocal] = useState([]);
  const dispatch = useDispatch();
  const dataRedux = useSelector((state) => state.data);
  const errorRedux = useSelector((state) => state.error);

  useEffect(() => {
    setDataLocal(dataRedux);
  }, [dataRedux]);

  return (
    <div style={{ textAlign: 'center', marginLeft: '30vw' }}>
      {errorRedux && <p>Error fetching data: {errorRedux.message}</p>}

      {dataLocal && dataLocal.map((user) => (
        <div key={user.id} style={{ margin: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
          <h1>{user.name}</h1>
          <p>{user.email}</p>
        </div>
      ))}

      <button style={{marginLeft: '17vw' }} onClick={() => dispatch(fetchData())}>Fetch Data</button>
    </div>
  );
};


const AppWrapper = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppWrapper;
