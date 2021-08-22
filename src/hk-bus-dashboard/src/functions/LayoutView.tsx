import { AppBar, Toolbar, IconButton, Typography, Button, Menu, MenuItem, TextField } from '@material-ui/core';
import { classes } from 'istanbul-lib-coverage';
import LanguageIcon from '@material-ui/icons/Language';
import * as React from 'react';
import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { useLazyGitHubAuth } from '../hooks/LazyGitHubAuthHook';

export const LayoutView =(props:{ children: React.ReactNode})=>{
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { t, i18n } = useTranslation();
    const {auth, setAuth} = useLazyGitHubAuth();
  
  
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
      };
    
      const handleClose = async (locale:string|null) => {
        setAnchorEl(null);
        if(!locale)
            return;
        await i18n.changeLanguage(locale);
        moment.locale(locale)
      };
  
    return <>
    <Menu
  id="simple-menu"
  anchorEl={anchorEl}
  keepMounted
  open={Boolean(anchorEl)}
  onClose={()=>handleClose(null)}
>
  <MenuItem onClick={()=>handleClose("en")}>English</MenuItem>
  <MenuItem onClick={()=>handleClose("zh-CN")}>簡體中文</MenuItem>
  <MenuItem onClick={()=>handleClose("zh-HK")}>正體中文</MenuItem>
</Menu>
    <AppBar position="static">
  <Toolbar>
    <IconButton edge="end"  color="inherit" aria-label="language" onClick={handleClick}>
      <LanguageIcon />
    </IconButton>
    <TextField value={auth} 
    onChange={e=>setAuth(e.target.value)} 
    placeholder="GitHub Token"
    style={{width: 500}}/>
  </Toolbar>
</AppBar>

{props.children}
</>
}