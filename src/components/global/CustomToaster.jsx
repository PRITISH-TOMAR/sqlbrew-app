import { Toaster } from 'react-hot-toast';
import useNavbarHeight from '../../hooks/useNavbarHeight';

const CustomToaster = () => {
  const navbarHeight = useNavbarHeight();
  
  return (
    <Toaster 
      position="top-right" 
      reverseOrder={true} 
      containerStyle={{
        top: `${navbarHeight + 10}px`,
        right: '20px'
      }}
    />
  );
};

export default CustomToaster;