import { createStyles, Grid, makeStyles, Theme, useTheme } from '@material-ui/core';
import moment from 'moment';
import * as React from 'react';
import { useQueries, useQuery, UseQueryOptions } from 'react-query';
import { useParams } from 'react-router';
import { GenericResponse } from '../../fetcher/model/GenericResponse';
import { RouteData } from '../../fetcher/model/RouteData';
import { RouteEtaData } from '../../fetcher/model/RouteEtaData';
import { RouteStopData } from '../../fetcher/model/RouteStopData';
import { StopData } from '../../fetcher/model/StopData';
import { SubScribedRouteStopData } from '../../fetcher/model/SubscribedRouteStopData';
import { useLazyGitHubAuth } from '../../hooks/LazyGitHubAuthHook';
import { AddRouteView } from './AddRouteView';
import { RouteEtaView } from './RouteEtaView';

const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
        backgroundColor: theme.palette.background.default,
    },
}));


export const HomeView = () => {
    const { pasteKey } = useParams<{ pasteKey: string }>()
    const classes = useStyles();
    const theme = useTheme();
    const { auth, setAuth } = useLazyGitHubAuth();
    const [gistFileName, setGistFileName] = React.useState<string>("");
    const [config, setConfig] = React.useState<GenericResponse<SubScribedRouteStopData[]> | null>(null);

    const configQuery = useQuery(["gist", pasteKey], async () => {
        var query = await fetch(`https://api.github.com/gists/${pasteKey}`, {
        });
        var data = (await query.json()) as any;// as GenericResponse<SubScribedRouteStopData[]>;
        setGistFileName((Object.entries(data.files).find(_ => true) as any)[0]);
        return JSON.parse((Object.entries(data.files).find(_ => true) as any)[1].content) as GenericResponse<SubScribedRouteStopData[]>;
    }, {
    })

    const routeEtaQueryFn = async (it: SubScribedRouteStopData) => {
        var query = await fetch(`https://data.etabus.gov.hk/v1/transport/kmb/route-eta/${it.routeNumber}/${it.service_type}`);
        var list = await query.json() as GenericResponse<RouteEtaData[]>;
        return list.data.filter(stop => stop.dir === it.direction && stop.seq === it.seq) as RouteEtaData[];
    };

    const routeEtaQuery = useQueries(
        config?.data?.map(it => (
            {
                queryKey: ["routeEta", it.routeNumber, it.service_type, it.seq],
                queryFn: async (q) => ({ request: it, eta: await routeEtaQueryFn(it) }),
                refetchInterval: 10000,
                cacheTime: 0
            } as UseQueryOptions)) ?? []
    )
    const routeQuery = useQuery("routes", async () => {
        var query = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/route/");
        return await query.json() as GenericResponse<RouteData[]>;
    }, {
        refetchInterval: 86400000,
        cacheTime: 86400000
    })
    const stopQuery = useQuery("stops", async () => {
        var query = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/stop");
        return await query.json() as GenericResponse<StopData[]>;
    }, {
        refetchInterval: 86400000,
        cacheTime: 86400000
    })

    const routeStopQuery = useQuery("routeStops", async () => {
        var query = await fetch("https://data.etabus.gov.hk/v1/transport/kmb/route-stop");
        return await query.json() as GenericResponse<RouteStopData[]>;
    }, {
        refetchInterval: 86400000,
        cacheTime: 86400000
    })

    React.useEffect(()=>{
        if(configQuery.data){
            setConfig(configQuery.data)
        }
    },[configQuery.data])

    const handleRemoveClicked = async (data: SubScribedRouteStopData) => {
        var newConfig = {
            type: "subscribedRouteStop",
            version: "1.0",
            generated_timestamp: moment().toDate(),
            data: configQuery?.data?.data?.filter(it => it !== data) ?? [] as SubScribedRouteStopData[]
        } as GenericResponse<SubScribedRouteStopData[]>;
        var query = await fetch(`https://api.github.com/gists/${pasteKey}`, {
            method: "PATCH",
            headers: {
                'Authorization': 'token ' + auth,
                'Content-Type': 'application/vnd.github.v3.text+json'
            },
            body: JSON.stringify({
                description: "Edit gist",
                files: {
                    [gistFileName]: {
                        content: JSON.stringify(newConfig, null, 2)
                    }
                }
            }, null, 2)
        });
        setConfig(newConfig);
        //configQuery.refetch();
    }

    const handleAdd =async (data:SubScribedRouteStopData): Promise<boolean>=>{
        var newConfig = {
            type: "subscribedRouteStop",
            version: "1.0",
            generated_timestamp: moment().toDate(),
            data: [...configQuery?.data?.data ?? [], data ] as SubScribedRouteStopData[]
        } as GenericResponse<SubScribedRouteStopData[]>;
        var query = await fetch(`https://api.github.com/gists/${pasteKey}`, {
            method: "PATCH",
            headers: {
                'Authorization': 'token ' + auth,
                'Content-Type': 'application/vnd.github.v3.text+json'
            },
            body: JSON.stringify({
                description: "Edit gist",
                files: {
                    [gistFileName]: {
                        content: JSON.stringify(newConfig, null, 2)
                    }
                }
            }, null, 2)
        });
        setConfig(newConfig);
        return query.ok;
      }
    return <>
        {pasteKey == null ?
            <Grid container spacing={2}></Grid>
            :
            <Grid container spacing={2}>

                {
                    routeEtaQuery
                        ?.map((it, idx) =>
                            <Grid item xs={12} xl={4} md={6} key={"eta" + idx}>
                                <RouteEtaView
                                    onRemoveClicked={(it)=>handleRemoveClicked(it)}
                                    stops={stopQuery.data?.data ?? []}
                                    data={it.data as any}
                                    routeStops={routeStopQuery.data?.data ?? []} />
                            </Grid>
                        )}


                <Grid item xs={12} xl={4} md={6}>
                    <AddRouteView
                        onRouteAdded={data => handleAdd(data)}
                        stops={stopQuery.data?.data ?? []}
                        data={configQuery.data?.data ?? []}
                        routes={routeQuery.data?.data ?? []}
                        routeStops={routeStopQuery.data?.data ?? []} />

                </Grid>
            </Grid>
        }
    </>
}