import React, { useEffect } from 'react';
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom';
import Analytics from 'react-ga';
import ScrollToTop from 'react-router-scroll-top';
import NavigationBar from './components/NavigationBar';
import Notification from './components/Notification';
import NotFound from './pages/NotFound';
import { uniformUrl } from './utils/analytics';
import { ROUTES } from './config/routing';

function initGoogleAnalytics() {
  const trackingId = process.env.REACT_APP_ANALYTICS_TRACKING_ID;
  const testMode = process.env.NODE_ENV === 'development';

  Analytics.initialize(trackingId, { testMode });
}

function onLocationChanged(location) {
  const url = uniformUrl(location.pathname);
  Analytics.set({ page: url });
  Analytics.pageview(url);
}

/**
 * Can't use useLocation from inside a component that
 * mounts the Route (App), so we have to create a wrapper
 * component, and use that to call useLocation.
 */
function AppWrapper({ children }) {
  const location = useLocation();

  useEffect(initGoogleAnalytics, []);
  useEffect(() => onLocationChanged(location), [location]);

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <NavigationBar />
        <Notification />
        <div className="content">
          <AppWrapper>
            <Switch>
              {ROUTES.map(route => (
                <Route key={route.path} exact path={route.path} component={route.component} />
              ))}
              <Route component={NotFound} />
            </Switch>
          </AppWrapper>
        </div>
      </ScrollToTop>
    </BrowserRouter>
  );
}

export default App;
