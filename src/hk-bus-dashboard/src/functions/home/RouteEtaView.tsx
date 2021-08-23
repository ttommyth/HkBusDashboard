import { Box, Card, CardContent, CardHeader, Chip, createStyles, IconButton, makeStyles, Paper, Theme, Typography, useTheme } from '@material-ui/core';
import moment from 'moment';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useQueries, useQuery, UseQueryOptions } from 'react-query';
import { useParams } from 'react-router';
import { GenericResponse } from '../../fetcher/model/GenericResponse';
import { RouteEtaData } from '../../fetcher/model/RouteEtaData';
import { RouteStopData } from '../../fetcher/model/RouteStopData';
import { StopData } from '../../fetcher/model/StopData';
import DeleteIcon from '@material-ui/icons/Delete';
import { SubScribedRouteStopData } from '../../fetcher/model/SubscribedRouteStopData';
import { useMoment } from '../../hooks/MomentHook';

export interface RouteEtaViewProps {
    data: {
        request: SubScribedRouteStopData,
        eta: RouteEtaData[],
    }
    stops: {[key:string]: StopData},
    routeStops: RouteStopData[],
    onRemoveClicked: (item: SubScribedRouteStopData) => void
}

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        backgroundColor: theme.palette.background.default,
    },
}));


export const RouteEtaView = (props: RouteEtaViewProps) => {
    const { data, stops, routeStops } = props;
    const { t, i18n } = useTranslation();
    const classes = useStyles();
    const theme = useTheme();
    const { now } = useMoment();

    const transformedData = React.useMemo(() => {
        var target = data?.request;
        return data?.eta?.map(it => ({
            etaData: it,
        }))
    }, [data])
    const targetStop = React.useMemo(() => {
        if(data &&stops && routeStops ){
            var target = data?.request;
             return stops[
                 routeStops
                     .find(rs => rs.route === target?.routeNumber && rs.bound === target?.direction && rs.seq === target?.seq?.toString())?.stop ?? ""
             ]
        }
        return null;
    }, [data, stops, routeStops])

    const getLocaleStopName = (stop: StopData | undefined | null, lang: string) => {
        if (lang === "zh-HK")
            return stop?.name_tc;
        if (lang === "zh-CN")
            return stop?.name_sc;

        return stop?.name_en;
    }


    return <>
        <Card >
            <CardHeader
                title={data?.request?.routeNumber + " - " + getLocaleStopName(targetStop, i18n.language)}

                action={
                    <IconButton aria-label="delete"
                        onClick={() => props.onRemoveClicked(data?.request)}>
                        <DeleteIcon />
                    </IconButton>
                }
            >

            </CardHeader>
            <CardContent>

                {transformedData?.map((it, idx) => <>
                    <Box display="flex" key={"etaRow" + idx}>
                        <Box flexGrow={1}>
                            {it.etaData.eta==null ?
                            <Typography variant={idx === 0 ? "h2" : idx === 1 ? "h5" : "h6"} display="inline">
                                {t("route_not_available")}
                            </Typography>
                            :<>
                            <Typography variant={idx === 0 ? "h2" : idx === 1 ? "h5" : "h6"} display="inline">
                                {moment(it.etaData.eta)?.locale(i18n.language)?.from(now)}
                            </Typography>
                            <Chip label={moment(it.etaData.eta)?.format("HH:mm")} />
                            </>}
                        </Box>
                        <Box>
                        </Box>
                    </Box>
                </>
                )}
            </CardContent>
        </Card>
    </>
}