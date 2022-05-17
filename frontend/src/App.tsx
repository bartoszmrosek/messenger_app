import { useEffect } from 'react';
import RegisterUserForm from './pages/RegisterUserForm';
import startSocketConnetion from './WebSockets/socketHandler';

function App() {
  return <RegisterUserForm />;
}

export default App;
