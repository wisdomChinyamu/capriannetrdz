import React from 'react';
import Toast from '../components/Toast';

type ToastContextType = {
  show: (message: string, type?: 'success'|'error'|'info', ttl?: number) => void;
  hide: () => void;
};

const ToastContext = React.createContext<ToastContextType>({
  show: () => {},
  hide: () => {},
});

export const ToastProvider: React.FC<any> = ({ children }) => {
  const [visible, setVisible] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [type, setType] = React.useState<'success'|'error'|'info'>('info');
  const timeoutRef = React.useRef<any>(null);

  const show = (msg: string, t: 'success'|'error'|'info' = 'info', ttl = 2500) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setMessage(msg);
    setType(t);
    setVisible(true);
    timeoutRef.current = setTimeout(() => setVisible(false), ttl);
  };

  const hide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setVisible(false);
  };

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}
      <Toast message={message} type={type} visible={visible} />
    </ToastContext.Provider>
  );
};

export const useToast = () => React.useContext(ToastContext);

export default ToastContext;
