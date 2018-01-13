import React from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
const history = createHistory();

// import App from 'containers';

// 按路由拆分代码
import Loadable from 'react-loadable';
const MyLoadingComponent = ({ isLoading, error }) => {
    // Handle the loading state
    if (isLoading) {
        return <div>Loading...</div>;
    }
    // Handle the error state
    else if (error) {
        return <div>Sorry, there was a problem loading the page.</div>;
    }
    else {
        return null;
    }
};
const AsyncHome = Loadable({
    loader: () => import('./c.js'),
    loading: MyLoadingComponent
});
const AsyncCity = Loadable({
    loader: () => import('./t2.js'),
    loading: MyLoadingComponent
});
 

const About = () => (
    <div>
      <h2>Ab3333333333333out</h2>
     
  
    </div>
  )

// 路由配置
class RouteMap extends React.Component {
    render() {
        return (
            <Router history={history}>
               
                    <Switch>
                        <Route path="/" exact component={AsyncHome} />
                        <Route path="/city/:name" component={AsyncCity} />
                        <Route path="/a" component={About} />
                        
                       
                    </Switch>
                
            </Router>
        );
        // 说明
        // empty Route
        // https://github.com/ReactTraining/react-router/issues/1982  解决人：PFight
        // 解决react-router v4改变查询参数并不会刷新或者说重载组件的问题 
    }
}

export default RouteMap;