import * as React from 'react';
import { StatelessComponent } from 'react';
import './layout.scss';

interface ILayout {
  children: React.ComponentElement<any, any>;
}

const Layout: StatelessComponent<ILayout> = ({ children }): any => {
  return (
    <div className="container">
      <section className="content">
        { children }
      </section>
    </div>
  );
};

export default Layout;
