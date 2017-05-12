import * as React from 'react';
import { StatelessComponent } from 'react';
import { Link } from 'react-router';

const HomeLayout: StatelessComponent<any> = (): any => {
  return (
    <div>
      <Link to="game" ><button className="btn btn-primary btn-lg btn-block play" >Play</button></Link>
    </div>
  );
};

export default HomeLayout;
