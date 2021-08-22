import moment from 'moment';
import * as React from 'react';
import 'moment/locale/zh-cn';
import 'moment/locale/zh-hk';
import { useTranslation } from 'react-i18next';

export const useMoment = (intervalMs:number = 1000 ) => {
    const { t, i18n } = useTranslation();
    const [now, setNow] = React.useState(moment().locale(i18n.language)); // Save the current date to be able to trigger an update
  
    React.useEffect(() => {
        const timer = setInterval(() => { // Creates an interval which will update the current data every minute
        // This will trigger a rerender every component that uses the useDate hook.
        setNow(moment().locale(i18n.language));
      },  intervalMs);
      return () => {
        clearInterval(timer); // Return a funtion to clear the timer so that it will stop being called on unmount
      }
    }, [intervalMs]);
  
    return {
      now: now
    };
  };