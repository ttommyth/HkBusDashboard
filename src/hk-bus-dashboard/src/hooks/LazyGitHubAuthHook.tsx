import * as React from 'react';
type LoadContextType = {
    auth: string// Not sure what these are, type it appropriately
    setAuth: (str:string)=>void
  }
  
export const LazyGitHubAuthContext = React.createContext<LoadContextType>({} as LoadContextType);

export const LazyGitHubAuthProvider = (props:{ children:  React.ReactNode}) => {
  
    const[auth, setAuth] = React.useState<string>("");
  return (
    <LazyGitHubAuthContext.Provider value={{ auth, setAuth }}>
      {props.children}
    </LazyGitHubAuthContext.Provider>
  );
};
export const useLazyGitHubAuth= ()=> {
  const { auth, setAuth } = React.useContext(LazyGitHubAuthContext);

  return {
    auth,
    setAuth
  };
}