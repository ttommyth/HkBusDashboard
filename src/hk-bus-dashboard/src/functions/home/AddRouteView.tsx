import * as React from 'react';
import { Box, Button, Card, CardContent, CardHeader, Chip, createStyles, IconButton, makeStyles, TextField, TextFieldProps, Theme, Typography, useTheme } from '@material-ui/core';
import moment, { now } from 'moment';
import { useTranslation } from 'react-i18next';
import { RouteData } from '../../fetcher/model';
import { RouteStopData } from '../../fetcher/model/RouteStopData';
import { StopData } from '../../fetcher/model/StopData';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import { SubScribedRouteStopData } from '../../fetcher/model/SubscribedRouteStopData';
import i18n from '../../i18n/i18n';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { dir } from 'console';

export interface AddRouteProps{
    routes: RouteData[],
    data: SubScribedRouteStopData[],
    stops: StopData[],
    routeStops: RouteStopData[],
    onRouteAdded: (newData: SubScribedRouteStopData)=>Promise<boolean>
}
const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
      backgroundColor: theme.palette.background.default,
    },
  }));
function onlyUnique(value: any, index: number , self: any[]) {
    return self.indexOf(value) === index;
}

const getLocaleStopName = (stop: StopData | undefined, lang: string) => {
  if (lang === "zh-HK")
      return stop?.name_tc;
  if (lang === "zh-CN")
      return stop?.name_sc;

  return stop?.name_en;
}
export const AddRouteView =(props: AddRouteProps )=>{
    const {data, stops, routeStops, routes} = props;
    const { t, i18n } = useTranslation();
    const classes = useStyles();
    const theme = useTheme();

    const [addMode, setAddMode]=React.useState(false);
    const [route, setRoute]=React.useState<string>("");
    const [serviceType, setServiceType]=React.useState("");
    const [direction, setDirection]=React.useState("");
    const [seq, setSeq]=React.useState("");
    
    const routeStopList = React.useMemo(()=>{
      return {
        "I": routeStops.filter(it=>it.route===route &&it.bound==="I" && it.service_type===serviceType).sort((a,b)=> (+b.seq) -(+a.seq) ),
        "O": routeStops.filter(it=>it.route===route &&it.bound==="O"&& it.service_type===serviceType).sort((a,b)=> (+b.seq) -(+a.seq) )
      }
    }, [routeStops, route, serviceType]);

    React.useEffect(()=>{
      setServiceType("");
      setDirection("");
      setSeq("");
    }, [route]);
    React.useEffect(()=>{
      setDirection("");
      setSeq("");
    }, [serviceType]);
    React.useEffect(()=>{
      setSeq("");
    }, [direction]);
    React.useEffect(()=>{

    }, [seq]);

    const handleSubmit =async ()=>{
  if( await props.onRouteAdded({
        routeNumber: route,
        service_type: serviceType,
        direction: direction,
        seq: +seq,
      } as SubScribedRouteStopData)){

        setRoute("");
        setAddMode(false);
      }
    }
    return <>
    {addMode?
    <Card >
        <CardHeader 
        title={t("add_route")}
        action={<IconButton onClick={()=>setAddMode(false)}>
          <CloseIcon/>
          </IconButton>}
          >
        </CardHeader>
        <CardContent>
        <Autocomplete
        value={route}
        onChange={(event: any, newValue: string | null) => {
          setRoute(newValue??"");
        }}
  options={routes.map(it=>it.route).filter(onlyUnique)}
  getOptionLabel={(it) => it}
  renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField 
  {...params} label={t('route')} variant="outlined" fullWidth />}
/>
{route&&
        <Autocomplete
        value={serviceType}
        onChange={(event: any, newValue: string | null) => {
          setServiceType(newValue??"");
        }}
  options={routes.filter(it=>it.route==route).map(it=>it.service_type).filter(onlyUnique)}
  getOptionLabel={(it) => it}
  renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField 
  {...params} label={t('service_type')} variant="outlined" fullWidth />}
/>
}
{serviceType&&
        <Autocomplete
        value={direction}
        onChange={(event: any, newValue: string | null) => {
          setDirection(newValue??"");
        }}
  options={["I", "O"]}
  getOptionLabel={dir=>
    getLocaleStopName(
    stops.find(it=>it.stop===
      (routeStopList[dir as ("I" | "O")] as RouteStopData[])?.find(_=>true)?.stop)
    , i18n.language
    ) ?? ""
  }
  renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField 
  {...params} label={t('direction')} variant="outlined" fullWidth />}
/>
}
{direction&&
        <Autocomplete
        value={seq}
        onChange={(event: any, newValue: string | null) => {
          setSeq(newValue??"");
        }}
  options={routeStops.filter(it=>it.route===route &&it.bound===direction).map(it=>it.seq)}
  getOptionLabel={seq=>
    getLocaleStopName(
      stops.find(it=>it.stop===(routeStopList[direction as ("I" | "O")] as RouteStopData[])?.find(it=>it.route===route &&it.bound===direction && it.seq===seq)?.stop)
    , i18n.language) ??""
  }
  renderInput={(params: JSX.IntrinsicAttributes & TextFieldProps) => <TextField 
  {...params} label={t('stop_name')} variant="outlined" fullWidth />}
/>
}
{seq&&
<Button variant="contained" color="primary" onClick={()=>handleSubmit()}>
  {t("addToMonitorList")}
  </Button>
}
        </CardContent>
        </Card>
        :<Card>

<CardContent style={{alignContent:"center", alignItems:"center"}}>
            <IconButton onClick={()=>setAddMode(true)}>
                <AddIcon/>
                </IconButton>
        </CardContent>
        </Card>
}
     </>
}